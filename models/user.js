"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config");

//Functions for users

class User {
    //Authenticates user with username, password

    //Returns { username, email, firstname, lastname }

    //Throws UnauthorizedError if user is not found or password is wrong

    static async authenticate(username, password) {
        //try to find the user first
        const result = await db.query(
            `SELECT username, password, email, firstname, lastname FROM users WHERE username = $1`,
            [username]
        );

        const user = result.rows[0];

        if (user) {
            //compare hashed pw to a new hash from pw
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid === true) {
                delete user.password;
                return user;
            }
        }
        throw new UnauthorizedError("Invalid username/password");
    }

    //Register user with data.

    //Returns { username, email, firstname, lastname}

    //Throws BadRequestError on duplicates

    static async register({
        username,
        password,
        firstName,
        lastName,
        email,
        isAdmin,
    }) {
        const duplicateCheck = await db.query(
            `SELECT username
             FROM users
             WHERE username = $1`,
            [username]
        );

        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Duplicate username: ${username}`);
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const result = await db.query(
            `INSERT INTO users
             (username,
                email,
              password,
              firstname,
              lastname)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING username, email, firstname, lastname`,
            [username, email, hashedPassword, firstname, lastname]
        );

        const user = result.rows[0];

        return user;
    }

    //Find all users
    //Returns [{username, email, firstname, lastname}, ...]

    static async findAll() {
        const result = await db.query(
            `SELECT username,
                email, firstname, lastname
           FROM users
           ORDER BY username`
        );

        return result.rows;
    }

    //Given a username, return data about a user.

    //Returns { username, email, firstname, lastname, decks}
    //where decks is {deckname}

    //Throws NotFoundError if not found.

    static async get(username) {
        const userRes = await db.query(
            `SELECT username,
                          email,
                          firstname,
                          lastname
                   FROM users
                   WHERE username = $1`,
            [username]
        );

        const user = userRes.rows[0];

        if (!user) throw new NotFoundError(`No user: ${username}`);

        const userDecksRes = await db.query(
            `SELECT deck.deckname
                 FROM decks AS a
                 WHERE deck.username = $1`,
            [username]
        );

        user.decks = userDecksRes.rows.map((deck) => deck.deckname);
        return user;
    }

    //Update user data with `data` - partial update that only changes provided fields

    //Data can include {password, email, firstname, lastname}
    //Returns {username, email, firstname, lastname}

    //Throws NotFoundError ifnot found.
    //WARNING: this function can set a new password.
    // Callers of this function must be certain they have validated inputs to this
    // or a serious security risks are opened.

    static async update(username, data) {
        if (data.password) {
            data.password = await bcrypt.hash(
                data.password,
                BCRYPT_WORK_FACTOR
            );
        }

        const { setCols, values } = sqlForPartialUpdate(data, {
            password: "password",
            email: "email",
            firstname: "firstname",
            lastname: "lastname",
        });

        //Used as a placeholder to prevent SQL injection attacks
        const usernameVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE users
        SET ${setCols}
        WHERE username = ${usernameVarIdx}
        RETURNING username, password, email, firstname, lastname`;
        const result = await db.query(querySql, [...values, username]);
        const user = result.rows[0];

        if (!user) throw new NotFoundError(`No user: ${username}`);

        delete user.password;
        return user;
    }

    // Delete given user from database; returns undefined

    static async remove(username) {
        let result = await db.query(
            `DELETE
           FROM users
           WHERE username = $1
           RETURNING username`,
            [username]
        );
        const user = result.rows[0];

        if (!user) throw new NotFoundError(`No user: ${username}`);
    }
}

module.exports = User;

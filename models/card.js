"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

//Related functions for cards

class Card {
    //Create a card (from data), update db, return new card data

    //Data should be { username, cardfront, cardback, deckname }

    //Returns {id, username, cardfront, cardback, deckname }

    static async create(data) {
        const result = await db.query(
            `INSERT INTO cards (username, cardfront, cardback, deckname)
            VALUES ($1, $2, $3, $4)
            RETURNING id, username, cardfront, cardback, deckname`,
            [data.username, data.cardfront, data.cardback, data.deckname]
        );
        let card = result.rows[0];
        return card;
    }

    //Find all cards in the given deckname aand username.

    //Returns [{id, username, cardfront, cardback, deckname}, ...]

    static async findAll(username, deckname) {
        console.log('username:', username, 'deckname:', deckname)


        let query = `SELECT c.id, c.username, c.cardfront, c.cardback, c.deckname
            FROM cards c`;
        let whereExpressions = [];
        let queryValues = [];

        //For each possible search term, add to whereExressions and queryValues so we can generate the right SQL

        if (username !== undefined) {
            queryValues.push(username);
            whereExpressions.push(`username = '${username}'`);
        }

        if (deckname != undefined) {
            queryValues.push(deckname);
            whereExpressions.push(`deckname = '${deckname}'`);
        }

        if (whereExpressions.length > 0) {
            query += " WHERE " + whereExpressions.join(" AND ");
        }

        console.log('query:', query)
        console.log('query type:', typeof(query));
        //Finalize query and return results

        const cardsRes = await db.query(query);
        return cardsRes.rows;
    }

    //Update card data with 'data' - partial update

    //Data can include: { cardfront, cardback, deckname }

    //Returns: {id, cardfront, cardback, deckname }

    static async update(id, data) {
        const { setCols, values } = sqlForPartialUpdate(data, {});
        const idVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE cards
        SET ${setCols}
            WHERE id = ${idVarIdx}
            RETURNING id, cardfront, cardback, deckname;       
        `;
        const result = await db.query(querySql, [...values, id]);
        const card = result.rows[0];

        if (!card) throw new NotFoundError(`No card: ${id}`);
        return card;
    }

    /** Delete given card from database; returns undefined.
     *
     * Throws NotFoundError if company not found.
     **/

    static async remove(id) {
        const result = await db.query(
            `DELETE
           FROM cards
           WHERE id = $1
           RETURNING id`,
            [id]
        );
        const card = result.rows[0];

        if (!card) throw new NotFoundError(`No card: ${id}`);
    }
}

module.exports = Card;

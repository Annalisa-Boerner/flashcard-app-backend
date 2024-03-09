"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

//Related functions for cards

class Deck {
    //Create a deck (from data), update db, return new deck data

    //Data should be { deckname, username }

    //Returns { id, deckname, username }

    static async create(data) {
        const result = await db.query(
            `INSERT INTO decks (name, username)
            VALUES ($1, $2)
            RETURNING id, name, username`,
            [data.deckname, data.username]
        );
        let deck = result.rows[0];
        return card;
    }

    //Find all decks for a given user.

    //Returns [deckname, deckname, ...]

    static async findAll(username) {
      console.log('username:', username)

      let query = `SELECT d.deckname
          FROM decks d
          WHERE username = ${username}`;

      const decksRes = await db.query(query);
      return decksRes.rows;
  }



    /** Delete given deck from database; returns { name, username }
     *
     * Throws NotFoundError if deck not found.
     **/

    static async remove(deckname, username) {
      const result = await db.query(
          `DELETE FROM decks
          WHERE name = $1 AND username = $2
          RETURNING name, username`,
          [deckname, username]
      );
  
      if (result.rows.length === 0) {
          throw new NotFoundError(`No deck: ${deckname} found for user: ${username}`);
      }
  }
  
}


module.exports = Deck;
"use strict";

//Routes for cards

const jsonschema = require("jsonschema");

const express = require("express");
const { BadRequestError } = require("../expressError");
const Deck = require("../models/deck");
const deckNewSchema = require("../schemas/deckNew.json");
const deckSearchSchema = require("../schemas/deckSearch")

const router = express.Router({ mergeParams: true });

/** POST / { deck } => { deck }
 *
 * deck should be { deckname, username }
 *
 * Returns { deckname, username }
 *
 */

router.post("/", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, deckNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError(errs);
        }

        const deck = await Deck.create(req.body);
        return res.status(201).json({ deck });
    } catch (err) {
        return next(err);
    }
});

/** GET / =>
 *   { decks: [ { id, cardfront, cardback, deckname, username }, ...], [{ id, cardfront, cardback, deckname, username }, { id, cardfront, cardback, deckname, username }] }
 *
 * Get all decks for a user
 *
 * Guaranteed to recieve the correct username in the request body (logic take place on frontend)
 */

router.get("/", async function (req, res, next) {
    const b = req.body;
    let username = b.username;

    try {
        const validator = jsonschema.validate(b, deckSearchSchema);
        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError(errs);
        }

        const decks = await Deck.findAll(username);
        return res.json({ decks });
    } catch (err) {
        return next(err);
    }
});

/** DELETE /:deckname/:username => { deleted: deckname }
 * 
 * Deletes the deck identified by deckname and username.
 *
 * Returns { deleted: deckname } on success.
 *
 * Throws NotFoundError if the deck is not found.
 */

router.delete("/", async function(req, res, next) {
  try {
      const { deckname, username } = req.body;
      console.log(`Attempting to delete deck: '${deckname}' for user: '${username}'`);

      await Deck.remove(deckname, username);
      return res.json({ deleted: deckname });
  } catch (err) {
      return next(err);
  }
});




module.exports = router;

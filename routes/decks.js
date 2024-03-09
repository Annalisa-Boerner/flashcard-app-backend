"use strict";

const express = require("express");

//Routes for cards

const jsonschema = require("jsonschema");

const express = require("express");
const { BadRequestError } = require("../expressError");
const Deck = require("../models/deck");
const deckNewSchema = require("../schemas/deckNew.json");

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
        return res.status(201).json({ card });
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
        console.log("username:", username, "deckname:", deckname);
        const validator = jsonschema.validate(b, deckSearchSchema);
        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError(errs);
        }

        const decks = await Deck.findAll(username, deckname);
        return res.json({ cards });
    } catch (err) {
        return next(err);
    }
});

/** PATCH /[cardId]  { fld1, fld2, ... } => { card }
 * NOT IN MVP
 * Data can include: { cardfront, cardback, deckname}
 *
 * Returns {  id, cardfront, cardback, deckname, username }
 */

router.patch("/:id", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, cardUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError(errs);
        }

        const card = await Card.update(req.params.id, req.body);
        return res.json({ card });
    } catch (err) {
        return next(err);
    }
});

/** DELETE /[cardId] =>  { deleted: id }
 * NOT IN MVP
 * Authorization required: current user's card
 */

router.delete("/:id", async function (req, res, next) {
    try {
        await Card.remove(req.params.id);
        return res.json({ deleted: +req.params.id });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;

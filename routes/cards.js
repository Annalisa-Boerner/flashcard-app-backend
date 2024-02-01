"use strict";

// const express = require("express");

//Routes for cards

const jsonschema = require("jsonschema");

const express = require("express");
const { BadRequestError } = require("../expressError");
const Card = require("../models/card");
const cardNewSchema = require("../schemas/cardNew.json");
const cardUpdateSchema = require("../schemas/cardUpdate.json");
const cardSearchSchema = require("../schemas/cardSearch.json");

const router = express.Router({ mergeParams: true });

/** POST / { card } => { card }
 *
 * card should be {cardfront, cardback, deckname, username }
 *
 * Returns { id,cardfront, cardback, deckname, username }
 *
 */

router.post("/", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, cardNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError(errs);
        }

        const card = await Card.create(req.body);
        return res.status(201).json({ card });
    } catch (err) {
        return next(err);
    }
});

/** GET / =>
 *   { cards: [ { id, cardfront, cardback, deckname, username }, ...] }
 *
 * Can provide search filter in query:
 * - deckname
 * 
 * Guaranteed to recieve the correct username in the request body (logic take place on frontend)
 */

router.get("/", async function (req, res, next) {
    const b = req.body;
    let username = b.username;
    let deckname = b.deckname;

    
    try {
        console.log('username:', username, 'deckname:', deckname)
        // const validator = jsonschema.validate(b, cardSearchSchema);
        // if (!validator.valid) {
        //     const errs = validator.errors.map((e) => e.stack);
        //     throw new BadRequestError(errs);
        // }

        const cards = await Card.findAll(username, deckname);
        return res.json({ cards });
    } catch (err) {
        return next(err);
    }
});

/** GET /[cardId] => { card }
 *
 * Returns { id, cardfront, cardback, deckname, username }

 */

router.get("/:id", async function (req, res, next) {
    try {
        const card = await Card.get(req.params.id);
        return res.json({ card });
    } catch (err) {
        return next(err);
    }
});

/** PATCH /[cardId]  { fld1, fld2, ... } => { card }
 *
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
 *
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

"use strict";

//Express app for Flashcards

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const decksRoutes = require("./routes/cards");

const morgan = require("morgan");

const app = express();

app.use(cors());
//Parses json and makes it avail via req.body
app.use(express.json());
//Formats the console output to a tiny version
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/decks", decksRoutes);

//Handle 404 errors: matches everything
app.use(function (req, res, next) {
    return next(new NotFoundError());
});

//Generic error handler: anything not handled goes here
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: { message, status },
    });
});

module.exports = app;

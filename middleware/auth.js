"use strict";

//Convenience middleware to handle common auth cases in routes.

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

//Middleware: authenticate user.

//If a token was provided, verify it, and, if valid, store the token payload on res.locals.

function authenticateJWT(req, res, next) {
    try {
        const authHeader = req.headers && req.headers.authorization;
        if (authHeader) {
            const token = authHeader.replace(/^[Bb]earer/, "").trim();
            res.locals.user = jwt.verify(token, SECRET_KEY);
        }
        return next();
    } catch (error) {
        return next();
    }
}

//Middleware to use when user must be logged in: if not, raises Unauthorized

function ensureLoggedIn(req, res, next) {
    try {
        if (!res.locals.user) throw new UnauthorizedError();
        return next();
    } catch (error) {
        return next(error);
    }
}

//Middleware to use when they are logged in as an admin user

function ensureAdmin(req, res, next) {
    try {
        if (!res.locals.user || !res.locals.user.isAdmin) {
            throw new UnauthorizedError();
        }
        return next();
    } catch (error) {
        return next(error);
    }
}

//Middlewar to use when they must provide a valid token & be user matching username provided as a route param

function ensureCorrectUserOrAdmin(req, res, next) {
    try {
        const user = res.locals.user;
        if (!(user && user.username === req.params.username)) {
            throw new UnauthorizedError();
        }
        return next();
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    authenticateJWT,
    ensureLoggedIn,
    ensureAdmin,
    ensureCorrectUserOrAdmin,
};

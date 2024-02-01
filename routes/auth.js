"use strict";

//Routes for authentication

const jsonschema = require("jsonschema");

const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const { BadRequestError } = require("../expressError");

//POST  /auth/token: {username, password} => {token}

//Returns JWT token which can be used to authenticate further requests. Auth required: none.

router.post("/token", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userAuthSchema);
        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError(errs);
        }
        const { username, password } = req.body;

        // authenticate method makes use of the User model

        const user = await User.authenticate(username, password);
        const token = createToken(user);
        return res.json({ token });
    } catch (err) {
        return next(err);
    }
});

//POST /auth/register: { user } => { token }

//user must include { username, password, email, firstname, lastname }

//Returns JWT token which can be used to authenticate further requests.
//Auth req: none.

router.post("/register", async function (req, res, next) {
    console.log('req', req)
    try {
        console.log('about to validate')
        const validator = jsonschema.validate(req.body, userRegisterSchema);
        console.log('validator:', validator)
        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError(errs);
        }
        console.log('Before User.register')
        const newUser = await User.register({ ...req.body });
        console.log('type of createToken:', typeof(createToken))
        console.log('Testing createToken error')
        const token = createToken(newUser);
        return res.status(201).json({ token });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;

"use strict";

//Convenience middleware to handle common auth cases in routes.

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

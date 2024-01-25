"use strict";

//Shared config for application; can be required many places.

require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "flash-those-cards";

const PORT = +process.env.PORT || 3001;

//Use dev db, testing db, or - via env var - production db

function getDatabaseUri() {
    return process.env.NODE_ENV === "TEST"
        ? "postgresql://localhost:5432/flashcards_test"
        : process.env.DATABASE_URL || "postgresql://localhost:5432/flashcards";
}

// Speed up bcrypt during tests, since the algorithm safety isn't being tested

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

console.log("Flashcards Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
    SECRET_KEY,
    PORT,
    BCRYPT_WORK_FACTOR,
    getDatabaseUri,
};

CREATE TABLE users (
    username VARCHAR(255) PRIMARY KEY,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL
);

CREATE TABLE cards (
    id SERIAL PRIMARY KEY,
    cardfront TEXT NOT NULL,
    cardback TEXT NOT NULL,
    deckname TEXT NOT NULL,
    username    TEXT NOT NULL REFERENCES users
);


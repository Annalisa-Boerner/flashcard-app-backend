CREATE TABLE users (
    username VARCHAR(255) PRIMARY KEY,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL
)

CREATE TABLE cards (
    id SERIAL PRIMARY KEY,
    cardfront TEXT NOT NULL,
    cardback TEXT NOT NULL,
    deckname TEXT NOT NULL,
)

CREATE TABLE decks (
    username VARCHAR(255) FOREIGN KEY,
    id SERIAL PRIMARY KEY,
    deckname VARCHAR(255) NOT NULL
)

CREATE TABLE cards_decks (
    deck_id INTEGER FOREIGN KEY,
    card_id INTEGER FOREIGN KEY
)
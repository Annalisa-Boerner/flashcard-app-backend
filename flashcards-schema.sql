CREATE TABLE users (
    username VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL
);


CREATE TABLE decks (
    name VARCHAR(255),
    username VARCHAR(255) NOT NULL,
    PRIMARY KEY (name, username),
    FOREIGN KEY (username) REFERENCES users(username)
);


CREATE TABLE cards (
    id SERIAL PRIMARY KEY,
    cardfront TEXT NOT NULL,
    cardback TEXT NOT NULL,
    deckname VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    FOREIGN KEY (deckname, username) REFERENCES decks(name, username)
);
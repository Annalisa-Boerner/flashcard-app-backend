-- Insert test users
INSERT INTO users (username, password, email, firstName, lastName)
VALUES 
    ('testuser1', 'password', 'test@user1.com', 'Test', 'User1'),
    ('testuser2', 'password', 'test@user2.com', 'Test', 'User2');

-- Insert test decks
INSERT INTO decks (name, username)
VALUES 
    ('testdeck1', 'testuser1'),
    ('testdeck2', 'testuser2'),
    ('testdeck3', 'testuser2');

-- Insert test cards, directly referencing 'deckname' and 'username'
INSERT INTO cards (cardfront, cardback, deckname, username)
VALUES 
    ('front1_deck1', 'back1_deck1', 'testdeck1', 'testuser1'),
    ('front2_deck1', 'back2_deck1', 'testdeck1', 'testuser1'),
    ('front1_deck2', 'back1_deck2', 'testdeck2', 'testuser2'),
    ('front2_deck2', 'back2_deck2', 'testdeck2', 'testuser2'),
    ('front1_deck3', 'back1_deck3', 'testdeck3', 'testuser2'),
    ('front2_deck3', 'back2_deck3', 'testdeck3', 'testuser2');

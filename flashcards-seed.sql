-- two test users with password "password"

INSERT INTO users (username, password, email, firstname, lastname)
VALUES ('testuser1', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'test@user1.com', 'test', 'user1'),
 ('testuser2', '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q', 'test@user2.com', 'test', 'user2');

--two cards per test deck

 INSERT INTO cards (cardfront, cardback, deckname)
 VALUES ('front1', 'back1', 'testdeck1'), ('front2', 'back2', 'testdeck1'), ('front1', 'back1', 'testdeck2'), ('front2', 'back2', 'testdeck2')
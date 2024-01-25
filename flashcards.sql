\echo "Delete and recreate flashcards db?"
\prompt "Return for yes or control-C to cancel > " foo

DROP DATABASE flashcards;
CREATE DATABASE flashcards;
\connect flashcards

\i flashcards-schema.sql
\i flashcards-seed.sql

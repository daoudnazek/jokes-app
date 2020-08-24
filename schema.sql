DROP TABLE IF EXISTS jokeslist;

CREATE TABLE IF NOT EXISTS jokeslist (
    id SERIAL PRIMARY KEY,
    type VARCHAR(255),
    setup VARCHAR(255),
    punchline VARCHAR(255),
);
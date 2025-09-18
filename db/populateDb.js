const { Client } = require("pg");
const dotenv = require("dotenv").config();

const createTables = `
    CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR(255) NOT NULL
    );
    CREATE TABLE IF NOT EXISTS platforms (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR(255) UNIQUE
    );
    CREATE TABLE IF NOT EXISTS genres (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR(255) UNIQUE
    );
    CREATE TABLE IF NOT EXISTS game_genre (
        game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
        genre_id INTEGER REFERENCES genres(id),
        PRIMARY KEY (game_id, genre_id)
    );
    CREATE TABLE IF NOT EXISTS game_platform (
        game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
        platform_id INTEGER REFERENCES platforms(id),
        PRIMARY KEY (game_id, platform_id)
    );
`;

const insertPlatforms = `
    INSERT INTO platforms (name)
        VALUES ('GameCube'),
            ('PS2'),
            ('Xbox'),
            ('Wii'),
            ('PS3'),
            ('Xbox 360'),       
            ('Switch'),
            ('PS4'),
            ('Xbox One')
        ON CONFLICT (name) DO NOTHING;
`;

const insertGenres = `
    INSERT INTO genres (name)
        VALUES ('FPS'),
            ('Platformer'),
            ('Racing'),
            ('RPG'),
            ('Fighting'),
            ('Simulation'),
            ('Strategy')
        ON CONFLICT (name) DO NOTHING;
`;

const main = async () => {
    console.log("Populating database...");

    const connection = process.env.DB_URL || undefined;
    if (connection) {
        console.log(`Connected to ${connection}`);
        const client = new Client({
            connectionString: connection
        });
        await client.connect();
        await client.query(createTables);
        await client.query(insertPlatforms);
        await client.query(insertGenres);
        await client.end();
        console.log("Population complete, connection closing");
    }
    else {
        console.error("Connection to database could not be made. Please check connectionString");
    }

};

main();
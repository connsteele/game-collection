const { Client } = require("pg");
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const SQL = `
    DROP TABLE IF EXISTS game_genre;
    DROP TABLE IF EXISTS game_platform;
    DROP TABLE IF EXISTS games;
    DROP TABLE IF EXISTS platforms;
    DROP TABLE IF EXISTS genres;
`;

const main = async () => {
    console.log("Clearing database...");

    const connection = process.env.DB_URL || undefined;
    if (connection) {
        console.log(`Connected to ${connection}`);
        const client = new Client({
            connectionString: connection
        });
        await client.connect();
        await client.query(SQL);
        await client.end();
        console.log("Population complete, connection closing");
    }
    else {
        console.error("Connection to database could not be made. Please check connectionString");
    }

};

main();
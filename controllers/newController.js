const pool = require("../db/pool");
const db = require("../db/queries");

const addGameGet = async (req, res) => {
    const platforms = await db.getPlatforms();
    const genres = await db.getGenres();
    res.render("addGame", {platforms: platforms, genres: genres});
}

const insertGameTable = async (gameTitle) => {
    const queryInsertGame = `
        INSERT INTO games 
            (name)
        VALUES
            ($1)
        RETURNING 
            id;
    `;
    const gameRes = await pool.query(queryInsertGame, [gameTitle]);
    const gameId = gameRes.rows[0].id;

    return gameId;
};

const insertGamePlatformJunction = async (gameId, platformIds) => {
    const queryInsertGamePlatform = `
        INSERT INTO game_platform
            (game_id, platform_id)
        VALUES
            ($1, UNNEST($2::int[]))
    `;

    return await pool.query(queryInsertGamePlatform, [gameId, platformIds]);
};

const insertGameGenreJunction = async (gameId, genreIds) => {
    const queryInsertGameGenre = `
        INSERT INTO game_genre
            (game_id, genre_id)
        VALUES
            ($1, UNNEST($2::int[]))
    `;

    return await pool.query(queryInsertGameGenre, [gameId, genreIds]);
};

const addGamePost = [
    // add middleware for validation here
    async (req, res) => {
        if (!req.body && !req.body.name && !req.body.platforms && !req.body.genres) {
            throw new Error("Submitted form is lacking infomation");
        }
        console.log("Recieved request to add:");
        console.log(`Game: ${req.body.name} | Platform(s): ${req.body.platforms} | Genre(s): ${req.body.genres}`);

        const gameTitle = req.body.name;
        const platforms = req.body.platforms;
        const genres = req.body.genres;

        const gameId = await insertGameTable(gameTitle);
        const platformIds = await db.getPlatformIds(platforms);
        await insertGamePlatformJunction(gameId, platformIds);
        const genreIds = await db.getGenresIds(genres);
        await insertGameGenreJunction(gameId, genreIds);

        res.redirect("/");
    }
];

module.exports = {
    addGameGet,
    addGamePost
}
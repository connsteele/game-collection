const pool = require("../db/pool");

const addGameGet = (req, res) => {
    res.render("addGame");
}

const updateGameTable = async (gameTitle) => {
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

const getPlatformIds = async (platforms) => {
    const res = await pool.query(
        "SELECT id FROM platforms WHERE name = ANY($1)",
        [Array.isArray(platforms) ? platforms : [platforms]]
        // ensure a nested array is being passed
    );
    const ids = res.rows.map((row) => row.id);
    return ids;
};

const updateGamePlatformJunction = async (gameId, platformIds) => {
    const queryInsertGamePlatform = `
        INSERT INTO game_platform
            (game_id, platform_id)
        VALUES
            ($1, UNNEST($2::int[]))
    `;

    return await pool.query(queryInsertGamePlatform, [gameId, platformIds]);
};

const getGenresIds = async (genres) => {
    const res = await pool.query(
        "SELECT id FROM genres WHERE name = ANY($1)",
        [Array.isArray(genres) ? genres : [genres]]
        // ensure a nested array is being passed
    );
    const ids = res.rows.map((row) => row.id);
    return ids;
};

const updateGameGenreJunction = async (gameId, genreIds) => {
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

        const gameId = await updateGameTable(gameTitle);
        const platformIds = await getPlatformIds(platforms);
        await updateGamePlatformJunction(gameId, platformIds);
        const genreIds = await getGenresIds(genres);
        await updateGameGenreJunction(gameId, genreIds);

        res.redirect("/");
    }
];

module.exports = {
    addGameGet,
    addGamePost
}
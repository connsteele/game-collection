const pool = require("../db/pool");

const deleteGame = async (req, res) => {
    if (!req.params && !req.params.id)
        throw new Error("No game id provided! Deletion cannot occur without id");

    const gameId = req.params.id;
    await deleteFromTables(gameId);

    res.redirect("/");
};

//------ Helper Function
async function deleteFromTables (gameId) {
    const gameQuery = `
        DELETE FROM games
        WHERE
            id = $1;
    `;
    const platformJncQuery = `
        DELETE FROM game_platform
        WHERE
            game_id = $1;
    `;
    const genreJncQuery = `
        DELETE FROM game_genre
        WHERE
            game_id = $1;
    `;

    const params = [gameId];
    await pool.query(gameQuery, params);
    await pool.query(platformJncQuery, params);
    await pool.query(genreJncQuery, params);
};

module.exports = {
    deleteGame,
};
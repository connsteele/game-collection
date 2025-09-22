const pool = require("../db/pool");
const db = require("../db/queries");

const getTitle = async (gameId) => {
    const res = await pool.query(`
        SELECT name FROM games
        WHERE games.id = $1;
    ` , [gameId]);
    const gameName = res.rows[0].name;
    return gameName;
};

const getPlatforms = async (gameId) => {
    const res = await pool.query(`
        SELECT ARRAY_AGG (DISTINCT p.name)
            FILTER (WHERE p.name IS NOT NULL)
            AS Platforms
        FROM
            game_platform as gp
            LEFT JOIN
                platforms AS p ON p.id = gp.platform_id
        WHERE gp.game_id = $1;
    `, [gameId]);
    const obj = res.rows[0];
    return obj.platforms;
};

const getGenres = async (gameId) => {
    const res = await pool.query(`
        SELECT ARRAY_AGG (DISTINCT g.name)
            FILTER (WHERE g.name IS NOT NULL)
            AS Genres
        FROM
            game_genre as gg
            LEFT JOIN
                genres AS g ON g.id = gg.genre_id
        WHERE gg.game_id = $1;
    `, [gameId]);
    const obj = res.rows[0];
    return obj.genres;
};

const updateEntryGet = async (req, res) => {
    if (Object.keys(req.params).length === 0)
        throw new Error("Cannot update without game id");

    const gameId = req.params.id;
    const gameName = await getTitle(gameId);
    const platforms = await getPlatforms(gameId);
    const genres = await getGenres(gameId);

    res.render("updateEntry", {
        game_id: gameId,
        game_name: gameName,
        platforms: platforms,
        genres: genres
    });
};

const updateEntryPost = async (req, res) => {
    // Update the database after data validation
    if (!req.body && !req.body.name && !req.body.platforms && !req.body.genres)
        throw new Error("Submitted form for game update is lacking infomation");

    console.log("Recieved request to update entry to:");
    console.log(`Game id: ${req.params.id} | Game: ${req.body.name} | Platform(s): ${req.body.platforms} | Genre(s): ${req.body.genres}`);

    const update = {
        gameId: parseInt(req.params.id),
        name: req.body.name,
        platforms: req.body.platforms,
        genres: req.body.genres
    };

    await updateGameTable(update);
    await updatePlatforms(update);
    await updateGenres(update);

    res.redirect("/");
};

// -------------- Helper Functions --------------
async function updateGameTable({ gameId, name }) {
    const query = `
        UPDATE games
        SET
            name = $2
        WHERE
            id = $1;
    `;

    await pool.query(query, [gameId, name]);

};

async function updatePlatforms({ gameId, platforms }) {
    const remove = `
        DELETE FROM game_platform
        WHERE
            game_id = $1;
    `;

    const add = `
        INSERT INTO game_platform
            (game_id, platform_id)
        VALUES
            ($1, UNNEST($2::int[]));
    `;

    const platform_ids = await db.getPlatformIds(platforms);
    await pool.query(remove, [gameId]);
    await pool.query(add, [gameId, platform_ids]);
};

async function updateGenres({ gameId, genres}) {
    const remove = `
        DELETE FROM game_genre
        WHERE
            game_id = $1;
    `;

    const add = `
        INSERT INTO game_genre
            (game_id, genre_id)
        VALUES
            ($1, UNNEST($2::int[]));
    `;

    const genre_ids = await db.getGenresIds(genres);
    await pool.query(remove, [gameId]);
    await pool.query(add, [gameId, genre_ids]);
};

module.exports = {
    updateEntryGet,
    updateEntryPost
};
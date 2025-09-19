const pool = require("../db/pool");

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
    // Get data from database to populate form
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

const updateEntryPost = (req, res) => {
    res.redirect("/");
};

module.exports = {
    updateEntryGet,
    updateEntryPost
};
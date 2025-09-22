const pool = require("./pool");

const getAll = async () => {
    const select = `
        SELECT 
            games.id as id,
            games.name AS Game,
            ARRAY_AGG(DISTINCT p.name) FILTER (WHERE p.name IS NOT NULL) AS Platforms,
            ARRAY_AGG(DISTINCT genres.name) FILTER (WHERE genres.name IS NOT NULL) AS Genres
        FROM 
            games
        LEFT JOIN
            game_platform as gp ON games.id = gp.game_id
        LEFT JOIN
            platforms as p on p.id = gp.platform_id
        LEFT JOIN
            game_genre as gg ON games.id = gg.game_id
        LEFT JOIN
            genres on genres.id = gg.genre_id
        GROUP BY games.id, games.name
        ;
    `;
    const {rows} = await pool.query(select);
    console.log(rows);
    return rows;
};

/**
 * 
 * @param {string[]} platforms Array of platform names
 * @returns {int[]} Array of platform ids
 */
const getPlatformIds = async (platforms) => {
    const res = await pool.query(
        "SELECT id FROM platforms WHERE name = ANY($1)",
        [Array.isArray(platforms) ? platforms : [platforms]]
        // ensure a nested array is being passed
    );
    const ids = res.rows.map((row) => row.id);
    return ids;
};

/**
 * 
 * @param {string[]} platforms Array of genre names
 * @returns {int[]} Array of genre ids
 */
const getGenresIds = async (genres) => {
    const res = await pool.query(
        "SELECT id FROM genres WHERE name = ANY($1)",
        [Array.isArray(genres) ? genres : [genres]]
        // ensure a nested array is being passed
    );
    const ids = res.rows.map((row) => row.id);
    return ids;
};


/**
 * 
 * @returns string[] containing all the names of platforms in the database
 */
const getPlatforms = async () => {
    const select = `
        SELECT
            ARRAY_AGG(DISTINCT p.name) FILTER (WHERE p.name IS NOT NULL) AS Platforms
        FROM
            platforms AS p
    `;

    const platforms = (await pool.query(select)).rows[0].platforms;
    return platforms;
}

/**
 * 
 * @returns string[] containing all the names of platforms in the database
 */
const getGenres = async () => {
    const select = `
        SELECT
            ARRAY_AGG(DISTINCT g.name) FILTER (WHERE g.name IS NOT NULL) AS Genres
        FROM
            genres AS g
    `;

    const genres = (await pool.query(select)).rows[0].genres;
    return genres;
}

module.exports = {
    getAll,
    getPlatformIds,
    getGenresIds,
    getPlatforms,
    getGenres
}
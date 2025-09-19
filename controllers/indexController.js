const db = require("../db/queries");

const indexGet = async (req, res) => {
    const rows = await db.getAll();
    res.render("index", {rows: rows});
};

module.exports = {
    indexGet,
}
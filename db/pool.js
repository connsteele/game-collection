const {Pool} = require("pg");
const dotenv = require("dotenv").config();

module.exports = new Pool({
    connectionString: process.env.DB_URL
});
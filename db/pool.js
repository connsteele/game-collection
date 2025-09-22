const { Pool } = require("pg");
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

module.exports = new Pool({
    connectionString: process.env.DB_URL
});
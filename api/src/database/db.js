const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "youssef.05.",
    host: "localhost",
    port: 5432,
    database: "SkillFlow"
});

module.exports = pool;


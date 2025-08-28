// backend/db/knex.js
const knex = require("knex");
const knexConfig = require("../knexfile");
require("dotenv").config();

const db = knex(knexConfig.development); // use the environment you want

module.exports = db;

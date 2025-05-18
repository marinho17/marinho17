const { Pool } = require("pg");

const pool = new Pool({
  user: "postgles",
  host: "localhost",
  database: "folha_pagamento",
  password: "admin",  // Troque pela sua senha real
  port: 3001,
});

module.exports = pool;

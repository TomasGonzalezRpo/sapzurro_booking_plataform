const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: console.log,
    port: process.env.DB_PORT,
  }
);

const db = {};
db.sequelize = sequelize;
db.DataTypes = DataTypes;

module.exports = db;

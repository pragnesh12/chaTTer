const Sequelize = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const DB_CONFIG = {
  HOST: process.env.DB_HOST,
  USERNAME: process.env.DB_USERNAME,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_NAME,
  DIALECT: "mysql",
};

const sequelize = new Sequelize(
  DB_CONFIG.DB,
  DB_CONFIG.USERNAME,
  DB_CONFIG.PASSWORD,
  {
    host: DB_CONFIG.HOST,
    dialect: DB_CONFIG.DIALECT,
    operatorsAliases: false,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log(
      `Connected Successfully With "${process.env.DB_NAME}" Database`
    );
  })
  .catch((err) => {
    console.log("Error is : ", err);
  });

module.exports = { Sequelize, sequelize };

const Sequelize = require("sequelize");
const sequelize = new Sequelize(env.DATABASE || "postgres", env.USERNAME || "postgres", env.PASSWORD || "123", {
  host: env.HOST || "localhost",
  dialect: env.DIALECT || "postgres",
  operatorsAliases: 0,

  pool: {
    max: env.POOL_MAX || 5,
    min: env.POOL_MIN || 0,
    acquire: env.POOL_AQUIRE || 30000,
    idle: env.POOL_IDLE || 10000
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.movies = require("./movies.js")(sequelize, Sequelize);

module.exports = db;
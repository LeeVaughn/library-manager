"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf(".") !== 0) && (file !== basename) && (file.slice(-3) === ".js");
  })
  .forEach(file => {
    const model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Books = require("../models/books.js")(sequelize, Sequelize);
db.Loans = require("../models/loans.js")(sequelize, Sequelize);
db.Patrons = require("../models/patrons.js")(sequelize, Sequelize);

db.Books.hasMany(db.Loans, {
  foreignKey: "book_id"
});
db.Loans.belongsTo(db.Books, {
  foreignKey: "book_id"
});
db.Patrons.hasMany(db.Loans, {
  foreignKey: "patron_id"
});
db.Loans.belongsTo(db.Patrons, {
  foreignKey: "patron_id"
});

module.exports = db;

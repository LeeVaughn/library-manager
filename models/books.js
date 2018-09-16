"use strict";
module.exports = (sequelize, DataTypes) => {
  const Books = sequelize.define("Books", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Title cannot be left blank"
        }
      }
    },
    author: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Author cannot be left blank"
        }
      }
    },
    genre: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Genre cannot be left blank"
        }
      }
    },
    first_published: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: {
          msg: "Please enter a year in numeric form, i.e. 2018"
        }
      }
    }
  }, {
    timestamps: false
  });
  Books.associate = function(models) {
    // associations can be defined here
  };
  return Books;
};

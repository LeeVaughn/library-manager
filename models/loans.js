"use strict";
module.exports = (sequelize, DataTypes) => {
  const Loans = sequelize.define("Loans", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    book_id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Book ID cannot be left blank"
        }
      }
    },
    patron_id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: "Patron ID cannot be left blank"
        }
      }
    },
    loaned_on: {
      type: DataTypes.DATEONLY,
      validate: {
        isDate: {
          msg: "Loaned On must be a valid date"
        }
      }
    },
    return_by: {
      type: DataTypes.DATEONLY,
      validate: {
        isDate: {
          msg: "Return By must be a valid date"
        }
      }
    },
    returned_on: {
      type: DataTypes.DATEONLY,
      validate: {
        isDate: {
          msg: "Returned On must be a valid date"
        }
      }
    }
  }, {
    timestamps: false
  });
  Loans.associate = function(models) {
    // associations can be defined here
  };
  return Loans;
};

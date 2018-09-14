'use strict';
module.exports = (sequelize, DataTypes) => {
  const Loans = sequelize.define('Loans', {
    id: {
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    book_id: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: {
          msg: "Book ID should be a number"
        },
        notEmpty: {
          msg: "Book ID cannot be left blank"
        }
      }
    },
    patron_id: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: {
          msg: "Patron ID should be a number"
        },
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
  loans.associate = function(models) {
    // associations can be defined here
  };
  return Loans;
};

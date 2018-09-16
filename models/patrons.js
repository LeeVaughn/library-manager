"use strict";
module.exports = (sequelize, DataTypes) => {
  const Patrons = sequelize.define("Patrons", {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    first_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "First Name cannot be left blank"
        }
      }
    },
    last_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Last Name cannot be left blank"
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Address cannot be left blank"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: "Please enter a valid email, i.e. name@email.com"
        },
        notEmpty: {
          msg: "Email cannot be left blank"
        }
      }
    },
    library_id: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Library ID cannot be left blank"
        }
      }
    },
    zip_code: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: {
          msg: "Zip Code should be a five digit number"
        },
        notEmpty: {
          msg: "Zip Code cannot be left blank"
        }
      }
    }
  }, {
    timestamps: false
  });
  Patrons.associate = function(models) {
    // associations can be defined here
  };
  return Patrons;
};

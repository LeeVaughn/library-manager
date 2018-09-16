const express = require("express");
const router = express.Router();
const db = require("../models");
const Sequelize = require("sequelize");

// get new patron
router.get("/new_patron", function(req, res, next) {
  res.render("./patrons/new_patron", { patrons: db.Patrons.build() });
});

// get all patrons
router.get("/all_patrons", function(req, res, next) {
  db.Patrons.findAll().then(function(patrons) {
    res.render("./patrons/all_patrons", { patrons });
  });
});

// get individual patron
router.get("/patrons/:id", function(req, res, next) {
  db.Patrons.findAll({
    where: {
      id: req.params.id
    },
    include: {
      model: db.Loans,
      include: {
        model: db.Books
      }
    }
  }).then(function(patronDetail) {
    let patronInfo = patronDetail[0];
    let loanInfo = patronInfo.Loans;
    res.render("./patrons/patron_detail", { patronInfo, loanInfo });
  })
});

// post new patron
router.post("/new_patron", function(req, res, next) {
  db.Patrons.create(req.body).then(function() {
      res.redirect("/all_patrons");
    })
    .catch(function(err) {
      if (err.name === "SequelizeValidationError") {
        res.render("./patrons/new_patron", { patrons: db.Patrons.build(req.body), errors: err.errors })
      }
    });
});

// post patron update
router.post("/patrons/:id", function(req, res, next) {
  db.Patrons.findAll({
      where: {
        id: req.params.id
      }
    }).then(function(patron) {
      return patron[0].update(req.body)
    }).then(function() {
      res.redirect("/all_patrons");
    })
    .catch(function(err) {
      if (err.name === "SequelizeValidationError") {
        db.Patrons.findAll({
          where: {
            id: req.params.id
          },
          include: {
            model: db.Loans,
            include: {
              model: db.Books
            }
          }
        }).then(function(patronDetail) {
          let patronInfo = patronDetail[0];
          let loanInfo = patronInfo.Loans;
          res.render("./patrons/patron_detail", { patronInfo, loanInfo, errors: err.errors });
        })
      }
    });
});

module.exports = router;

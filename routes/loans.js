const express = require("express");
const router = express.Router();
const db = require("../models");
const moment = require("moment");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// get new loan
router.get("/new_loan", function(req, res, next) {
  db.Books.findAll().then(function(books) {
    db.Patrons.findAll().then(function(patrons) {
      res.render("./loans/new_loan", {
        books,
        patrons,
        loaned_on: moment().format("YYYY-MM-DD"),
        return_by: moment().add(7, "days").format("YYYY-MM-DD")
      });
    })
  })
});

// get all loans
router.get("/all_loans", function(req, res, next) {
  db.Loans.findAll({
    include: [{
        model: db.Books
      },
      {
        model: db.Patrons
      },
    ],
  }).then(function(loans) {
    res.render("./loans/all_loans", { loans });
  });
});

// get overdue loans
router.get("/overdue_loans", function(req, res, next) {
  db.Loans.findAll({
    where: {
      returned_on: null,
      return_by: {
        [Op.lt]: new Date()
      },
    },
    include: [{
        model: db.Books
      },
      {
        model: db.Patrons
      },
    ],
  }).then(function(overdueLoans) {
    res.render("./loans/overdue_loans", { overdueLoans });
  });
});

// get currently checked out loans
router.get("/checked_loans", function(req, res, next) {
  db.Loans.findAll({
    where: {
      returned_on: null
    },
    include: [{
        model: db.Books
      },
      {
        model: db.Patrons
      },
    ],
  }).then(function(checkedLoans) {
    res.render("./loans/checked_loans", { checkedLoans });
  });
});

// get return loan form
router.get("/return/:id", function(req, res, next) {
  db.Loans.findAll({
    where: {
      id: req.params.id
    },
    include: [{
        model: db.Books
      },
      {
        model: db.Patrons
      }
    ],
  }).then(function(loan) {
    let firstLoan = loan[0];
    res.render("./books/return_book", { loan: firstLoan, returned_on: moment().format("YYYY-MM-DD") });
  });
});

// post new loan
router.post("/new_loan", function(req, res, next) {
  db.Loans.create(req.body).then(function() {
      res.redirect("/all_loans");
    })
    .catch(function(err) {
      if (err.name === "SequelizeValidationError") {
        db.Books.findAll().then(function(books) {
          db.Patrons.findAll().then(function(patrons) {
            res.render("./loans/new_loan", {
              books,
              patrons,
              loaned_on: moment().format("YYYY-MM-DD"),
              return_by: moment().add(7, "days").format("YYYY-MM-DD"),
              errors: err.errors
            });
          })
        })
      }
    });
});

// post return loan form
router.post("/return/:id", function(req, res, next) {
  db.Loans.findAll({
      where: {
        id: req.params.id
      }
    }).then(function(loan) {
      loan.returned_on = req.body.returned_on;
      return loan[0].update(req.body);
    }).then(function() {
      res.redirect("/all_loans");
    })
    .catch(function(err) {
      if (err.name === "SequelizeValidationError") {
        db.Loans.findAll({
          where: {
            id: req.params.id
          },
          include: [{
              model: db.Books
            },
            {
              model: db.Patrons
            }
          ],
        }).then(function(loan) {
          let firstLoan = loan[0];
          res.render("./books/return_book", {
            loan: firstLoan,
            returned_on: moment().format("YYYY-MM-DD"),
            errors: err.errors
          });
        });
      }
    });
});

module.exports = router;

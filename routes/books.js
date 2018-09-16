const express = require("express");
const router = express.Router();
const db = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// get new book
router.get("/new_book", function(req, res) {
  res.render("./books/new_book", {
    books: db.Books.build()
  });
});

// get all books
router.get("/all_books", function(req, res, next) {
  db.Books.findAll().then(function(books) {
    res.render("./books/all_books", {
      books
    });
  });
});

// get overdue books
router.get("/overdue_books", function(req, res) {
  db.Loans.findAll({
    where: {
      returned_on: null,
      return_by: {
        [Op.lt]: new Date()
      },
    },
    include: [{
      model: db.Books
    }],
  }).then(function(overdueBooks) {
    res.render("./books/overdue_books", {
      overdueBooks
    });
  });
});

// get checkout books
router.get("/checked_books", function(req, res) {
  db.Loans.findAll({
    where: {
      returned_on: null
    },
    include: [{
      model: db.Books
    }, ],
  }).then(function(checkedBooks) {
    res.render("./books/checked_books", {
      checkedBooks
    });
  });
});

// get book info
router.get("/books/:id", function(req, res) {
  db.Books.findAll({
    where: {
      id: req.params.id
    },
    include: {
      model: db.Loans,
      include: {
        model: db.Patrons
      }
    }
  }).then(bookDetail => {
    let bookInfo = bookDetail[0];
    let loanInfo = bookInfo.Loans;
    res.render("./books/book_detail", {
      bookInfo,
      loanInfo
    })
  });
});

// post new book
router.post("/new_book", function(req, res, next) {
  db.Books.create(req.body).then(function(book) {
      res.redirect("/all_books");
    })
    .catch(function(e) {
      if (e.name === "SequelizeValidationError") {
        res.render("./books/new_book", {
          books: db.Books.build(),
          errors: e.errors
        })
      }
    });
});

// post book info
router.post("/books/:id", function(req, res, next) {
  db.Books.findAll({
      where: {
        id: req.params.id
      }
    }).then(function(book) {
      return book[0].update(req.body)
    }).then(function(book) {
      res.redirect("/all_books");
    })
    .catch(function(e) {
      if (e.name === "SequelizeValidationError") {
        db.Books.findAll({
          where: {
            id: req.params.id
          },
          include: {
            model: db.Loans,
            include: {
              model: db.Patrons
            }
          }
        }).then(bookDetail => {
          let bookInfo = bookDetail[0];
          let loanInfo = bookInfo.Loans;
          res.render("./books/book_detail", {
            bookInfo,
            loanInfo,
            errors: e.errors
          })
        });
      }
    });
});

module.exports = router;

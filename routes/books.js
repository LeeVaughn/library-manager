const express = require("express");
const router = express.Router();
const db = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// get new book
router.get("/new_book", function(req, res, next) {
  res.render("./books/new_book", { books: db.Books.build() });
});

// get all books, redirects to first page of pagination
router.get("/all_books", function(req, res, next) {
  res.redirect("./all_books/page/1")
});

// get overdue books
router.get("/overdue_books", function(req, res, next) {
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
    res.render("./books/overdue_books", { overdueBooks });
  });
});

// get checkout books
router.get("/checked_books", function(req, res, next) {
  db.Loans.findAll({
    where: {
      returned_on: null
    },
    include: [{
      model: db.Books
    }, ],
  }).then(function(checkedBooks) {
    res.render("./books/checked_books", { checkedBooks });
  });
});

// get book info
router.get("/books/:id", function(req, res, next) {
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
  }).then(function(bookDetail) {
    const bookInfo = bookDetail[0];
    const loanInfo = bookInfo.Loans;
    res.render("./books/book_detail", { bookInfo, loanInfo });
  });
});

// get pagination
router.get("/all_books/page/:page", function(req, res, next) {
  const limit = 10;
  let offset = 0;
  db.Books.findAndCountAll()
    .then(function(data) {
      const page = req.params.page;
      const pages = Math.ceil(data.count / limit);
      offset = limit * (page - 1);
      db.Books.findAll({ limit: limit, offset: offset, sort: { id: 1 } })
      .then(function(books) {
        res.render("./books/all_books", {
          books: books,
          pagination: Array.apply(null, { length: pages }).map(Function.call, Number)
        });
      }).catch(function(err) {
        res.send(500, err);
      });
    });
});

// search function
router.get("/search_books", function(req, res, next) {
  const query = (req.query.query);
  db.Books.findAll({
    where: {
      [Op.or]: {
        title: {
          [Op.like]: `%${query}%`
        },
        author: {
          [Op.like]: `%${query}%`
        },
        genre: {
          [Op.like]: `%${query}%`
        },
        first_published: {
          [Op.like]: `%${query}%`
        }
      }
    }
  }).then(function(books) {
    res.render("./books/book_results", {
      books: books
    });
  }).catch(function(err) {
    res.send(500, err);
  });
});

// post new book
router.post("/new_book", function(req, res, next) {
  db.Books.create(req.body).then(function() {
      res.redirect("/all_books");
    })
    .catch(function(err) {
      if (err.name === "SequelizeValidationError") {
        res.render("./books/new_book", { books: db.Books.build(req.body), errors: err.errors })
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
    }).then(function() {
      res.redirect("/all_books");
    })
    .catch(function(err) {
      if (err.name === "SequelizeValidationError") {
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
        }).then(function(bookDetail) {
          const bookInfo = bookDetail[0];
          const loanInfo = bookInfo.Loans;
          res.render("./books/book_detail", { bookInfo, loanInfo, errors: err.errors })
        });
      }
    });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const db = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// get new patron
router.get("/new_patron", function(req, res, next) {
  res.render("./patrons/new_patron", { patrons: db.Patrons.build() });
});

// get all patrons, redirects to first page of pagination
router.get("/all_patrons", function(req, res, next) {
  res.redirect("./all_patrons/page/1")
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
    const patronInfo = patronDetail[0];
    const loanInfo = patronInfo.Loans;
    res.render("./patrons/patron_detail", { patronInfo, loanInfo });
  })
});

// get pagination
router.get("/all_patrons/page/:page", function(req, res, next) {
  const limit = 10;
  let offset = 0;
  db.Patrons.findAndCountAll()
    .then(function(data) {
      const page = req.params.page;
      const pages = Math.ceil(data.count / limit);
      offset = limit * (page - 1);
      db.Patrons.findAll({ limit: limit, offset: offset, sort: { id: 1 } })
      .then(function(patrons) {
        res.render("./patrons/all_patrons", {
          patrons: patrons,
          pagination: Array.apply(null, { length: pages }).map(Function.call, Number)
        });
      }).catch(function(err) {
        res.send(500, err);
      });
    });
});

// search function
router.get("/search_patrons", function(req, res, next) {
  const query = (req.query.query);
  db.Patrons.findAll({
    where: {
      [Op.or]: {
        first_name: {
          [Op.like]: `%${query}%`
        },
        last_name: {
          [Op.like]: `%${query}%`
        },
        address: {
          [Op.like]: `%${query}%`
        },
        email: {
          [Op.like]: `%${query}%`
        },
        library_id: {
          [Op.like]: `%${query}%`
        },
        zip_code: {
          [Op.like]: `%${query}%`
        }
      }
    }
  }).then(function(patrons) {
    console.log("test");
    console.log(patrons);
    res.render("./patrons/patron_results", {
      patrons: patrons
    });
  }).catch(function(err) {
    res.send(500, err);
  });
});

// post new patron
router.post("/new_patron", function(req, res, next) {
  db.Patrons.create(req.body).then(function() {
      res.redirect("./all_patrons");
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
          const patronInfo = patronDetail[0];
          const loanInfo = patronInfo.Loans;
          res.render("./patrons/patron_detail", { patronInfo, loanInfo, errors: err.errors });
        })
      }
    });
});

module.exports = router;

# Library Management System (work in progress)

A dynamic library management website built with Node.js, Express, Pug, Sequelize, and SQLite.

## Motivation

This project was created as a part of the Treehouse Full Stack JavaScript Techdegree program

## Features

* The library database contains tables for books, patrons, and loans
* The Home Screen contains links to the Books, Patrons, and Loans pages
* The Main Navigation Menu is available on every page and contains links to the Books, Patrons, and Loans pages
* The Books Listing Page contains filterable data from the books table, links to Book Detail pages, a button to create a new book, pagination, and search functionality
* The New Books Page includes a form to add a new book, which when submitted redirects the user to the Books Listing Page
* The Book Detail Page contains a loan history table and a form to update information, which when submitted redirects the user to the Books Listing Page
* The Loans Listing Page contains filterable data from the loans table along with a button to create a new loan
* The New Loan Page contains a form to create a new loan, which when submitted redirects the user to the Loan Listings Page
* The Return Books Page displays information on loaned books and includes a button to return a book, which will redirect the user to the Loans Listing Page
* The Patrons Listing Page displays patron's information, links to the individual Patron Detail pages, a button to create a new Patron, pagination, and search functionality
* The Patron Detail Page contains a form to update Patron information, which when submitted updates the database and redirects the user to the Patron Page
* The New Patron Page includes a form to register new patrons, which when submitted adds the Patron to the database and redirects the user to the Patrons Listing Page
* Errors are displayed when forms are not filled out properly
* Sequelize model validation is used for validating input fields

## To Run

* Coming soon

## Built With

* [Node.js](https://nodejs.org/en/)
* [Express](https://github.com/LeeVaughn/twitter-interface)
* [Pug](https://pugjs.org/api/getting-started.html)
* [Sequelize](https://www.npmjs.com/package/sequelize)
* [SQLite3](https://www.npmjs.com/package/sqlite3)

## Dependencies

* coming soon

## Links

* [Repository](https://github.com/LeeVaughn/library-manager)

## Author

[Daniel Lee Vaughn](https://github.com/LeeVaughn)

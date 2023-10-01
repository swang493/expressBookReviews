const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username && username.length > 1)
        return res.status(400).json({ error: "name is required" });
    if (!password && password.length > 1)
        return res.status(400).json({ error: "password is required" });

    users.push({ username: username, password: password, });
    res.status(200).json({ message: "user registered successfully.", users });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    let myPromise = new Promise((resolve, reject) => {
        resolve(books)
    })

    myPromise.then((booksInfo) => {
        res.send(JSON.stringify({ booksInfo }, null, 4));
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    let myPromise = new Promise((resolve, reject) => {
        let isbn = req.params.isbn;
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject({ status: 404, message: `ISBN ${isbn} not found` });
        }
    })

    myPromise.then((isbnInfo) => {
        res.send(isbnInfo);
    })
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    let myPromise = new Promise((resolve, reject) => {
        resolve(books)
    })

    myPromise.then((books) => Object.values(books))
    .then((book_arrs) => book_arrs.filter((book) => book.author === req.params.author))
    .then((filtered) => res.status(200).json(filtered))
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    let myPromise = new Promise((resolve, reject) => {
        resolve(books)
    })

    myPromise.then((books) => Object.values(books))
    .then((book_arrs) => book_arrs.filter((book) => book.title === req.params.title))
    .then((filtered) => res.status(200).json(filtered))
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    let myPromise = new Promise((resolve, reject) => {
        let isbn = req.params.isbn;
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject({ status: 404, message: `ISBN ${isbn} not found` });
        }
    });

    myPromise.then((book) => res.status(200).json(book.reviews))
});

module.exports.general = public_users;

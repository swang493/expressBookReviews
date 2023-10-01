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
        setTimeout(() => {
            resolve("Promise resolved")
        }, 2000)
    })

    myPromise.then((successMessage) => {
        console.log("callback " + successMessage)
        res.send(JSON.stringify({ books }, null, 4));
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    let myPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Promise resolved")
        }, 2000)
    })

    myPromise.then((successMessage) => {
        console.log("callback " + successMessage)
        let isbn = req.params.isbn;
        res.send(books[isbn]);

    })

    console.log("After calling promise");
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    let myPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Promise resolved ")
        }, 2000)
    })

    myPromise.then((successMessage) => {
        console.log("callback " + successMessage)
        const authors = req.params.author;
        const book_arrs = Object.values(books);
        const book = book_arrs.filter((book) => book.author === authors);
        res.status(200).json(book);
    })
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    let myPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Promise resolved in getting book details based on title")
        }, 2000)
    })

    //Console log before calling the promise
    console.log("Before calling promise");
    //Call the promise and wait for it to be resolved and then print a message.
    myPromise.then((successMessage) => {
        console.log("From Callback " + successMessage)
        const title = req.params.title;
        const book_arr = Object.values(books);
        const book = book_arr.filter((book) => book.title === title);
        res.status(200).json(book);
    })
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const book_isbn = req.params.isbn;
    const book = books[book_isbn];
    res.send(book.reviews);
});

module.exports.general = public_users;
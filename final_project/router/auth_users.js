const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
let users = [];

const isValid = (username) => {
    let x = users.filter((user) => {
        return user.username === username;
    });
    if (x.length > 0)
        return false;
    return true;
}

const authenticatedUser = (username, password) => {
    let x = users.filter((user) => {
        return user.username === username && user.password === password;
    });

    if (x.length > 0)
        return true;
    return false;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // If no username and/or password was provided.
    if (!username || !password) {
        return res.status(404).send("Username and password cannot be empty");
    }
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ error: "invalid" });
    }
    const token = jwt.sign({ data: password }, 'access', {
        expiresIn: 60 * 60,
    });

    req.session.authorization = {
        token, username
    }
    return res.status(200).json({ token });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
    const bookISBN = req.params.isbn;
    const userReview = req.body.review;
    const currentUser = req.session.authorization.username;
    let bookReviews = books[bookISBN].reviews;

    let reviewExists = false;
    for (const username in bookReviews) {
        if (username === currentUser) {
            bookReviews[currentUser] = userReview;
            reviewExists = true;
            break;
        }
    }
    if (!reviewExists) {
        bookReviews[currentUser] = userReview;
    }

    res.send("Review added successfully.");
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const bookISBN = req.params.isbn;
    const currentUser = req.session.authorization.username;
    const bookReviews = books[bookISBN].reviews;
    let reviewExists = false;
    for (const username in bookReviews) {
        if (username === currentUser) {
            delete bookReviews[currentUser];
            reviewExists = true;
            break;
        }
    }

    if (!reviewExists) {
        res.send("could not be deleted.");
    }
    res.send("deleted successfully.");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
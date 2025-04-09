"use strict";

const express = require("express");
const User = require("../models/user");
const { UnauthorizedError, BadRequestError } = require("../expressError");
const router = new express.Router();
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** POST /register: Create a new user */
router.post("/register", async function (req, res, next) {
  try {
    const { username, password, firstName, lastName, email } = req.body;
    const user = await User.register({
      username,
      password,
      firstName,
      lastName,
      email,
    });
    const token = jwt.sign({ username: user.username }, SECRET_KEY);
    return res.status(201).json({ token, user });
  } catch (err) {
    return next(err);
  }
});

/** POST /token: Authenticate and log in a user */
router.post("/token", async function (req, res, next) {
  try {
    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    const token = jwt.sign({ username: user.username }, SECRET_KEY);

    return res.json({ token, user });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

//
/* TEST DATA: USER 5 
{
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXI1IiwiaWF0IjoxNzQzNjE5NDAxfQ.UuYRv1FrIup0i1KB2qB_2urOJ8zGfbG4AzYlCxyvngM",
	"user": {
		"username": "user5",
		"firstName": "Test",
		"lastName": "User",
		"email": "testuser@example.com"
	}
}
*/

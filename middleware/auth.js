"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Assumes 'Bearer <token>'
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        console.error("JWT verification error:", err); // DEBUGGING: Log errors
        return res.sendStatus(403); // Forbidden
      }
      res.locals.user = user;
      console.log("User from token:", user); // DEBUGGING: Ensure token payload has correct data
      next();
    });
  } else {
    console.log("No token provided");
    res.sendStatus(401); // Unauthorized
  }
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req, res, next) {
  try {
    if (!res.locals.user) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}

/** Middleware to use when they must provide a valid token & be user matching
 *  username provided as route param.
 *
 *  If not, raises Unauthorized.
 */

function ensureCorrectUser(req, res, next) {
  const user = res.locals.user;
  console.log("User from JWT:", user); // DEBUGGING: Log the user data from token
  console.log("Username from params:", req.params.username); // DEBUGGING: Log the username from URL parameter

  if (user && user.username === req.params.username) {
    next();
  } else {
    console.log("Username mismatch or user not found"); // DEBUGGING: More detailed logging
    res.sendStatus(403); // Forbidden
  }
}

/** Middleware to validate a password meets minimum requirements upon account creation */

const validator = require("validator");

function validatePassword(req, res, next) {
  const { password } = req.body;
  const isValid = validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });

  if (!isValid) {
    return res.status(400).json({
      error:
        "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.",
    });
  }

  next();
}
module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser,
  validatePassword,
};

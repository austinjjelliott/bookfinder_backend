"use strict";

/** Express app for book recommendation. */
const cors = require("cors");

const express = require("express");

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const booksRoutes = require("./routes/books");
const bookFavoritesRoutes = require("./routes/bookFavorites");
const bookSearchRoutes = require("./routes/bookSearch");
const usersRoutes = require("./routes/users");

const morgan = require("morgan");

const app = express();
//Homepage
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Middleware
app.use(cors()); // Enable cross-origin resource sharing (CORS)
app.use(express.json()); // Parse incoming JSON requests
app.use(morgan("tiny")); // Log HTTP requests

// Authentication middleware

// Routes
app.use("/auth", authRoutes); // Auth routes (login, signup, etc.)
app.use("/books", booksRoutes); // Books routes (list, add, search, etc.)
app.use("/bookFavorites", bookFavoritesRoutes); // Book favorites routes (add/remove to favorites)
app.use("/bookSearch", bookSearchRoutes); // Book search routes (search by title, author, etc.)
app.use("/users", usersRoutes); // User-related routes (view profile, etc.)

// Handle 404 errors -- this matches anything that doesn't match an existing route
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message || "Something went wrong";

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;

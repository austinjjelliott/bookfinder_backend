"use strict";

const express = require("express");
const BookSearch = require("../models/bookSearch");
const { BadRequestError } = require("../expressError");

const router = new express.Router();

/** GET /search: Search for books via the Google Books API.
 *
 * Query parameters:
 * - q: query string (e.g., title, author, or genre)
 *
 * Returns: [{ google_books_id, title, author, description, cover_image }, ...]
 */
router.get("/", async function (req, res, next) {
  try {
    const query = req.query.q;

    // Ensure the query parameter is present
    if (!query) {
      throw new BadRequestError("Query parameter 'q' is required.");
    }

    // Perform the book search
    const books = await BookSearch.search(query);

    return res.json(books);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

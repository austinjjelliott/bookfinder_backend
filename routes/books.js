"use strict";

const express = require("express");
const axios = require("axios");
const { ensureLoggedIn } = require("../middleware/auth");
const validateSchema = require("../middleware/validateSchema");

const bookSearchSchema = require("../schemas/bookSearch.json");
const bookFavoriteSchema = require("../schemas/bookFavorite.json");

const router = express.Router();

const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes";

/**
 * GET /all
 * Retrieve a list of books from the Google Books API.
 * No authentication required.
 * Returns: { books: [{ id, title, authors, description, thumbnail }] }
 */
router.get("/all", async (req, res, next) => {
  try {
    // Define the Google Books API URL with a query parameter to limit results
    const LIMITED_GOOGLE_BOOKS_API_URL = `${GOOGLE_BOOKS_API_URL}?q=*&maxResults=25`;

    // Make a request to the Google Books API
    const response = await axios.get(LIMITED_GOOGLE_BOOKS_API_URL);

    // Map the API response to a simplified book structure
    const books = response.data.items.map((book) => ({
      id: book.id,
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors || ["Unknown Author"],
      description: book.volumeInfo.description || "No description available",
      thumbnail: book.volumeInfo.imageLinks?.thumbnail || "No image available",
    }));

    // Return the list of books as a JSON response
    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});

/**
 * GET /search
 * Search for books via Google Books API.
 * Query params: title (required), author, genre, isbn
 * Returns: { books: [{ id, title, authors, description, thumbnail }] }
 */
router.get("/search", async (req, res, next) => {
  try {
    const { title, author, genre, isbn } = req.query;
    let query = `q=${encodeURIComponent(title)}`;

    if (author) query += `+inauthor:${encodeURIComponent(author)}`;
    if (genre) query += `+subject:${encodeURIComponent(genre)}`;
    if (isbn) query += `+isbn:${encodeURIComponent(isbn)}`;

    const response = await axios.get(
      `${GOOGLE_BOOKS_API_URL}?${query}&maxResults=10`
    );

    const books = response.data.items.map((book) => ({
      id: book.id,
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors || [],
      description: book.volumeInfo.description || "No description available",
      thumbnail: book.volumeInfo.imageLinks?.thumbnail || null,
    }));

    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});

/**
 * POST /favorite
 * Add a book to the user's favorites.
 * Requires authentication.
 * Request body: { book_id, title, author }
 * Returns: { favorite: { book_id, username } }
 */
router.post(
  "/favorite",
  ensureLoggedIn,
  validateSchema(bookFavoriteSchema),
  async (req, res, next) => {
    try {
      const { book_id, title, author } = req.body;
      const username = req.user.username;

      const result = await db.query(
        `INSERT INTO favoriteBooks (book_id, title, author, username)
       VALUES ($1, $2, $3, $4)
       RETURNING book_id, username`,
        [book_id, title, author, username]
      );

      return res.status(201).json({ favorite: result.rows[0] });
    } catch (err) {
      return next(err);
    }
  }
);

/**
 * GET /favorites
 * Get all favorite books for the logged-in user.
 * Requires authentication.
 * Returns: { favorites: [{ book_id, title, author }] }
 */
router.get("/favorites", ensureLoggedIn, async (req, res, next) => {
  try {
    const username = req.user.username;
    const result = await db.query(
      `SELECT book_id, title, author FROM favoriteBooks WHERE username = $1`,
      [username]
    );

    return res.json({ favorites: result.rows });
  } catch (err) {
    return next(err);
  }
});

/**
 * DELETE /favorite/:book_id
 * Remove a book from the user's favorites.
 * Requires authentication.
 * Returns: { deleted: book_id }
 */
router.delete("/favorite/:book_id", ensureLoggedIn, async (req, res, next) => {
  try {
    const username = req.user.username;
    const { book_id } = req.params;

    const result = await db.query(
      `DELETE FROM favoriteBooks WHERE book_id = $1 AND username = $2 RETURNING book_id`,
      [book_id, username]
    );

    if (!result.rows.length) {
      throw new NotFoundError(
        `Book with ID '${book_id}' not found in favorites.`
      );
    }

    return res.json({ deleted: book_id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

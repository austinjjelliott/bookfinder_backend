"use strict";

const express = require("express");
const BookFavorite = require("../models/bookFavorite");
const { ensureLoggedIn } = require("../middleware/auth");
const router = new express.Router();

/** POST /favorites: Add a book to the user's favorites list.
 *
 * Data should include: { bookId, status }
 *
 * Returns: { id, username, bookId, status }
 */
router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const { bookId, status } = req.body;

    // Add the book to the user's favorites
    const favorite = await BookFavorite.addToFavorites(
      req.username,
      bookId,
      status
    );

    return res.status(201).json(favorite);
  } catch (err) {
    return next(err);
  }
});

/** DELETE /favorites/:bookId: Remove a book from the user's favorites list.
 *
 * Returns: { message: "Book removed from favorites" }
 */
router.delete("/:bookId", ensureLoggedIn, async function (req, res, next) {
  try {
    const { bookId } = req.params;

    // Remove the book from the user's favorites
    await BookFavorite.removeFromFavorites(req.username, bookId);

    return res.json({ message: "Book removed from favorites" });
  } catch (err) {
    return next(err);
  }
});

/** GET /favorites: Get all books favorited by the user.
 *
 * Returns: [{ bookId, status }, ...]
 */
router.get("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const favorites = await BookFavorite.getFavorites(req.username);

    return res.json(favorites);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

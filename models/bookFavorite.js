"use strict";

const db = require("../db");
const { NotFoundError, BadRequestError } = require("../expressError");

/** Related functions for favorite books. */

class BookFavorite {
  /** Add a book to the user's favorite books list.
   *
   * Returns { id, username, book_id, status }
   *
   * Throws BadRequestError if the book is already in the list.
   **/
  static async addToFavorites(username, bookId, status) {
    const duplicateCheck = await db.query(
      `SELECT id
           FROM favorite_books
           WHERE username = $1 AND book_id = $2`,
      [username, bookId]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError("Book already in favorites.");
    }

    const result = await db.query(
      `INSERT INTO favorite_books (username, book_id, status)
           VALUES ($1, $2, $3)
           RETURNING id, username, book_id AS "bookId", status`,
      [username, bookId, status]
    );

    return result.rows[0];
  }

  /** Remove a book from the user's favorites list.
   *
   * Returns undefined.
   *
   * Throws NotFoundError if the book is not found in the list.
   **/
  static async removeFromFavorites(username, bookId) {
    const result = await db.query(
      `DELETE FROM favorite_books
           WHERE username = $1 AND book_id = $2
           RETURNING id`,
      [username, bookId]
    );

    if (!result.rows[0]) {
      throw new NotFoundError(`No favorite book found with ID: ${bookId}`);
    }
  }

  /** Get all books favorited by a user.
   *
   * Returns [{ book_id, status }, ...]
   **/
  static async getFavorites(username) {
    const result = await db.query(
      `SELECT book_id AS "bookId", status
           FROM favorite_books
           WHERE username = $1`,
      [username]
    );

    return result.rows;
  }
}

module.exports = BookFavorite;

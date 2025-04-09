"use strict";

const axios = require("axios");
const { BadRequestError } = require("../expressError");

/** Related functions for searching books via Google Books API. */

class BookSearch {
  /** Search for books based on query (e.g., title, author, genre).
   *
   * Returns [{ google_books_id, title, author, description, cover_image }]
   **/
  static async search(query) {
    const response = await axios.get(
      "https://www.googleapis.com/books/v1/volumes",
      {
        params: { q: query },
      }
    );

    const books = response.data.items;
    if (!books) {
      throw new BadRequestError("No books found for this query.");
    }

    return books.map((book) => ({
      google_books_id: book.id,
      title: book.volumeInfo.title,
      author: book.volumeInfo.authors?.join(", ") || "Unknown Author",
      description: book.volumeInfo.description || "No description available.",
      cover_image: book.volumeInfo.imageLinks?.thumbnail || null,
    }));
  }
}

module.exports = BookSearch;

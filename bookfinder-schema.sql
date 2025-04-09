CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE CHECK (email LIKE '%@%')
);

CREATE TABLE books (
  google_books_id TEXT PRIMARY KEY,  -- Google Books API ID
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT,
  cover_image TEXT
);


CREATE TABLE favorite_books (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25) REFERENCES users ON DELETE CASCADE,
  book_id TEXT REFERENCES books(google_books_id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('Want to Read', 'Already Read')),
  UNIQUE(username, book_id) -- Ensures a user can save a book only once
);


CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25) REFERENCES users ON DELETE CASCADE,
  book_id TEXT NOT NULL,  -- Storing Google Books API ID
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  review TEXT NOT NULL
);

-- Insert sample users
INSERT INTO users (username, password, first_name, last_name, email, favorites) VALUES
  ('user1', 'hashedpassword1', 'Alice', 'Smith', 'alice@example.com', 'Bk101,Bk102'), -- Alice's favorites
  ('user2', 'hashedpassword2', 'Bob', 'Jones', 'bob@example.com', 'Bk103'), -- Bob's favorite
  ('user3', 'hashedpassword3', 'Charlie', 'Brown', 'charlie@example.com', 'Bk104'); -- Charlie's favorite

-- Insert sample books
INSERT INTO books (google_books_id, title, author, description, cover_image) VALUES
  ('Bk101', 'The Great Gatsby', 'F. Scott Fitzgerald', 'A novel about the Jazz Age.', 'gatsby.jpg'),
  ('Bk102', '1984', 'George Orwell', 'Dystopian novel about surveillance.', '1984.jpg'),
  ('Bk103', 'To Kill a Mockingbird', 'Harper Lee', 'Classic novel about racial injustice.', 'mockingbird.jpg'),
  ('Bk104', 'Moby Dick', 'Herman Melville', 'A novel about a great white whale.', 'mobydick.jpg');

-- Insert sample favorite books (Google Books API book IDs used as book_id)
INSERT INTO favorite_books (username, book_id) VALUES
  ('user1', 'Bk101'),
  ('user1', 'Bk102'),
  ('user2', 'Bk103'),
  ('user3', 'Bk104');

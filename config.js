"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev"; // Secret for JWTs, or use environment variable

const PORT = +process.env.PORT || 3001; // Default to 3000 for local development

// Database URI configuration (adapted for your project)
function getDatabaseUri() {
  // Use environment variable DATABASE_URL for production (e.g.for Supabase)
  return process.env.NODE_ENV === "test"
    ? "postgresql://localhost/bookfinder_test" // Local test database
    : process.env.DATABASE_URL || "postgresql://localhost/bookfinder"; // Local or production database URL
}

// Bcrypt work factor for password hashing
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

console.log("BookFinder Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
};

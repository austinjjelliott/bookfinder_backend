"use strict";

const express = require("express");
const User = require("../models/user");
const { NotFoundError, BadRequestError } = require("../expressError");
const router = new express.Router();
const { ensureCorrectUser, authenticateJWT } = require("../middleware/auth");

router.get("/", async function (req, res, next) {
  try {
    const users = await User.findAll(); // Method to get all users
    const usernames = users.map((user) => ({ username: user.username })); // Extract usernames
    return res.json(usernames); // Respond with array of usernames
  } catch (err) {
    return next(err);
  }
});

/** POST /users: Register a new user.
 *
 * Data should include: { username, password, firstName, lastName, email }
 *
 * Returns: { username, firstName, lastName, email }
 */
router.post("/", async function (req, res, next) {
  try {
    const { username, password, firstName, lastName, email } = req.body;

    const user = await User.register({
      username,
      password,
      firstName,
      lastName,
      email,
    });

    return res.status(201).json(user); // Return the created user with a 201 status
  } catch (err) {
    return next(err);
  }
});

/** GET /users/:username: Get a user's profile.
 *
 * Returns: { username, first_name, last_name, email }
 */
router.get("/:username", async function (req, res, next) {
  try {
    const user = await User.get(req.params.username);
    return res.json(user);
  } catch (err) {
    return next(err);
  }
});

// PATCH /users/:username: Update a user's profile.
router.patch("/users/:username", async (req, res) => {
  const { username } = req.params;
  const { firstName, lastName, email, password } = req.body;

  try {
    // Fetch the current user to ensure the password and username stay the same
    const user = await User.get({ where: { username } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user, only changing the fields that were provided
    await user.update({
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      email: email || user.email,
      password: password || user.password, // Keep password unchanged if not provided
    });

    res.status(200).json(user);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:username/favorites", async function (req, res, next) {
  const { username } = req.params; // Get the username from the route parameter

  try {
    // Fetch the user by username
    const user = await User.get(username); // Using the User.get() method from the User model

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user's favorites
    res.status(200).json({
      username: user.username,
      favorites: user.favorites, // Send the favorites array
    });
  } catch (err) {
    console.error("Error fetching favorites:", err);
    return next(err); // Pass the error to the error handler
  }
});

/// FAVORITES PATCH /users/:username/favorites route
router.patch("/:username/favorites", async function (req, res, next) {
  const { username } = req.params; // Get the username from the route parameter
  const { favorites } = req.body; // Get the new favorites array from the request body

  try {
    // Fetch the user by username
    const user = await User.get(username);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Ensure favorites is an array
    if (!Array.isArray(favorites)) {
      return res.status(400).json({ error: "Favorites must be an array" });
    }

    // Use User.update() to update the favorites
    const updatedUser = await User.update(username, {
      favorites: favorites, // Only update the favorites field
    });

    // Return the updated user with their new favorites
    res.status(200).json({
      username: updatedUser.username,
      favorites: updatedUser.favorites,
    });
  } catch (err) {
    console.error("Error updating favorites:", err);
    return next(err); // Pass the error to the error handler
  }
});

module.exports = router;

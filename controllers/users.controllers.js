const bcrypt = require("bcryptjs");
const {
  setAllUsers,
  selectUserByUsername,
  addUser,
} = require("../models/users.models");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secret";

const generateToken = (user) => {
  return jwt.sign({ user }, JWT_SECRET, { expiresIn: "1d" });
};
const { hashedPassword } = require("../db/seeds/utils");

exports.getAllUsers = (req, res, next) => {
  setAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  selectUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};

exports.createUser = (req, res, next) => {
  const { username, name, avatar_url, password } = req.body;

  if (!username || !name || !avatar_url || !password) {
    return res.status(400).json({ msg: "All fields are required" });
  }
  const userData = { username, name, avatar_url, password };

  selectUserByUsername(username)
    .then(() => {
      // If user exists, handle it
      throw new Error("username already exists");
    })
    .catch((error) => {
      if (error.status === 404) {
        // User not found, proceed to hashing
        return hashedPassword(userData);
      } else {
        throw error; // Re-throw if the error is not user-not-found
      }
    })
    .then((hashedUser) => {
      const { username, name, avatar_url, password } = hashedUser;
      return addUser(username, name, avatar_url, password);
    })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((error) => {
      console.error("Error during user creation:", error);
      if (error.message === "Username already exists") {
        return res.status(409).send({ msg: "Username already exists" });
      }
      next(error);
    });
};
exports.loginUser = (req, res, next) => {
  const { username, password } = req.body;
  selectUserByUsername(username)
    .then((user) => {
      if (bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).send({ user, token });
      } else {
        next({
          status: 401,
          msg: "invalid credentials",
        });
      }
    })
    .catch(next);
};

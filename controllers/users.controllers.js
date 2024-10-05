const bcrypt = require("bcryptjs/dist/bcrypt");
const {
  setAllUsers,
  selectUserByUsername,
  addUser,
  generateToken,
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
  const userData = { username, name, avatar_url, password };
  hashedPassword(userData)
    .then((hashedUser) => {
      const { username, name, avatar_url, password } = hashedUser;
      return addUser(username, name, avatar_url, password);
    })
    .then((user) => {
      const token = generateToken(user);
      res.status(201).send({ user, token });
    })
    .catch((error) => {
      console.error("Error during user creation:", error);
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

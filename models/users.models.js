const db = require("../db/connection");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secret";

const generateToken = (user) => {
  return jwt.sign({ user }, JWT_SECRET, { expiresIn: "1d" });
};

exports.setAllUsers = () => {
  return db.query("SELECT * FROM users").then(({ rows }) => {
    return rows;
  });
};

exports.selectUserByUsername = (username) => {
  return db
    .query("SELECT * FROM users WHERE username = $1 ", [username])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "user was not found" });
      }
      return rows[0];
    });
};

exports.addUser = (username, name, avatar_url, password) => {
  return db
    .query(
      "INSERT INTO users (username, name, avatar_url, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, name, avatar_url, password]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.generateToken = generateToken;

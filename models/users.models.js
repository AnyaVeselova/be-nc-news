const db = require("../db/connection");
const { hashPassword } = require("../db/seeds/utils");
const jwt = require("jsonwebtoken");
exports.setAllUsers = () => {
  return db.query("SELECT * FROM users").then(({ rows }) => {
    return rows;
  });
};

const JWT_SECRET = process.env.JWT_SECRET || "secret";

const generateToken = (user) => {
  return jwt.sign({ user }, JWT_SECRET, {
    expiresIn: "1d",
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

exports.verifyUser = (username, password) => {
  return db
    .query("SELECT * FROM users WHERE username = $1 ", [username])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "user was not found" });
      }
      const user = rows[0];
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return Promise.reject({ status: 401, msg: "invalid credentials" });
      }
      const token = generateToken(user);
      return { user, token };
    });
};

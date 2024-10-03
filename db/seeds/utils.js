const format = require("pg-format");
const db = require("../connection");
const bcrypt = require("bcryptjs");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key, value) => {
  return arr.reduce((ref, element) => {
    ref[element[key]] = element[value];
    return ref;
  }, {});
};

exports.formatComments = (comments, idLookup) => {
  return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
    const article_id = idLookup[belongs_to];
    return {
      article_id,
      author: created_by,
      ...this.convertTimestampToDate(restOfComment),
    };
  });
};

exports.checkExists = (table, column, value) => {
  const queryStr = format("SELECT * FROM %I WHERE %I = $1;", table, column);
  return db.query(queryStr, [value]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: `${value} not found` });
    }
  });
};

exports.hashPassword = async (userData) => {
  const saltRounds = 10;
  const hashedUserData = await Promise.all(
    userData.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      return { ...user, password: hashedPassword };
    })
  );
  return hashedUserData;
};

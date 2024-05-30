const db = require("../db/connection");

exports.selectCommentsByArticleId = (article_id) => {
  return db.query(
    "SELECT * FROM comments WHERE comments.article_id = $1 ORDER BY comments.created_at",
    [article_id]
  );
};

exports.setComment = (article_id, username, body) => {
  return db
    .query(
      "INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *",
      [article_id, username, body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.selectCommentById = (comment_id) => {
  return db
    .query("SELECT * FROM comments WHERE comment_id = $1", [comment_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Sorry! Comment does not exist!",
        });
      }
      return rows[0];
    });
};

exports.removeCommentById = () => {
  return db.query("DELETE FROM comments");
};

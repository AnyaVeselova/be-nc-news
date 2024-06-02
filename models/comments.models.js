const db = require("../db/connection");
const { commentData } = require("../db/data/test-data");

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
    .query("SELECT * FROM comments WHERE comment_id = $1 ", [comment_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "comment was not found" });
      }
      return rows[0];
    });
};

exports.patchCommentById = (comment_id, newVote) => {
  return db
    .query(
      "UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *",
      [newVote, comment_id]
    )
    .then(({ rows }) => rows[0]);
};

exports.removeCommentById = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1", [comment_id])
    .then((response) => {
      if (response.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "Sorry! Comment does not exist!",
        });
      }
      return response.rows[0];
    });
};

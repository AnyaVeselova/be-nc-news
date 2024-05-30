const db = require("../db/connection");

exports.setArticles = (topic) => {
  let formatedArticlesQuery = `
    SELECT 
    articles.article_id,
    articles.title, 
    articles.author,
    articles.topic, 
    articles.created_at,
    articles.votes,
    articles.article_img_url,
    COUNT(comments.comment_id)::int AS comment_count
    FROM articles    
    LEFT JOIN comments ON comments.article_id = articles.article_id
    `;

  const queryVal = [];
  if (topic) {
    formatedArticlesQuery += "WHERE articles.topic = $1 ";
    queryVal.push(topic);
  }
  formatedArticlesQuery +=
    " GROUP BY articles.article_id ORDER BY articles.created_at DESC";

  return db.query(formatedArticlesQuery, queryVal).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1 ", [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "article was not found" });
      }
      return rows[0];
    });
};

exports.patchArticleById = (article_id, newVotes) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *",
      [newVotes, article_id]
    )
    .then(({ rows }) => rows[0]);
};

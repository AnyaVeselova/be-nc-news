const db = require("../db/connection");

exports.setArticles = () => {
  const formatedArticles = `
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
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;
    `;

  return db.query(formatedArticles).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1 ", [article_id])
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.setComments = (article_id) => {
  return this.selectArticleById(article_id).then((article) => {
    if (article) {
      return db.query(
        "SELECT * FROM comments WHERE comments.article_id = $1 ORDER BY comments.created_at",
        [article_id]
      );
    } else {
      return Promise.reject({ status: 404, msg: "article does not exist" });
    }
  });
};

const db = require("../db/connection");

exports.setArticles = (topic, sort_by = "created_at", order = "desc") => {
  let formatedArticlesQuery = `
    SELECT 
    articles.article_id,
    articles.title, 
    articles.author,
    articles.topic, 
    articles.created_at,
    articles.votes,
    articles.article_img_url,
    COUNT(comments.article_id)::int AS comment_count
    FROM articles    
    LEFT JOIN comments ON comments.article_id = articles.article_id
    `;

  const topicQuery = [];
  const sortQueries = [
    "votes",
    "comment_count",
    "article_id",
    "author",
    "title",
    "topic",
    "created_at",
  ];
  const orderQueries = ["desc", "asc"];

  if (topic) {
    formatedArticlesQuery += "WHERE articles.topic = $1 ";
    topicQuery.push(topic);
  }
  formatedArticlesQuery += " GROUP BY articles.article_id ";

  if (sortQueries.includes(sort_by)) {
    formatedArticlesQuery += `ORDER BY ${sort_by}`;
  } else {
    return Promise.reject({ status: 400, msg: "Invalid sort_by" });
  }

  if (orderQueries.includes(order)) {
    formatedArticlesQuery += ` ${order}`;
  } else {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  console.log(formatedArticlesQuery);

  return db.query(formatedArticlesQuery, topicQuery).then(({ rows }) => {
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

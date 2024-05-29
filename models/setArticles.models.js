const db = require("../db/connection");

exports.setArticles = () => {
  const fortatedArticles = `
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

  return db.query(fortatedArticles).then(({ rows }) => {
    console.log(rows);
    return rows;
  });
};

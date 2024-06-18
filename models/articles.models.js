const db = require("../db/connection");
const { convertTimestampToDate } = require("../db/seeds/utils");

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

  return db.query(formatedArticlesQuery, topicQuery).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleById = (article_id) => {
  let formatedArticleQuery = `
    SELECT 
    articles.article_id,
    articles.title, 
    articles.author,
    articles.topic, 
    articles.created_at,
    articles.votes,
    articles.article_img_url,
    articles.body,
    COUNT(comments.article_id)::int AS comment_count
    FROM articles    
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
    `;
  return db.query(formatedArticleQuery, [article_id]).then(({ rows }) => {
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

exports.insertArticle = (article) => {
  const { created_at } = convertTimestampToDate({
    created_at: new Date().getTime(),
  });

  if (!article.article_img_url) {
    article.article_img_url =
      "https://unsplash.com/photos/bundle-of-newspaper-on-table-Mwuod2cm8g4";
  }

  // const requiredKeys = ["title", "topic", "author", "body", "article_img_url"];

  // for (let key of requiredKeys) {
  //   if (!article[key]) {
  //     throw { status: 400, msg: "Required key missing" };
  //   }
  // }

  return db
    .query(
      `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url)
		 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        article.title,
        article.topic,
        article.author,
        article.body,
        created_at,
        0,
        article.article_img_url,
      ]
    )
    .then((article) => {
      article.rows[0].comment_count = 0;
      return article.rows;
    });
};

exports.createAnArticle = (reqBody) => {};

const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const app = require("../app");
const request = require("supertest");
const endpointsJSON = require("../endpoints.json");
require("jest-sorted");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  db.end();
});

describe("GET: /api/topics", () => {
  test("200: responds with an array of all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toHaveLength(data.topicData.length);

        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api", () => {
  test("200: responds with an object with all the available endpoints on the API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpointsJSON);
      });
  });
});

describe("GET: /api/articles", () => {
  test("200: responds with an array of all articles without the body property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(data.articleData.length);

        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            author: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
          expect(article).not.toHaveProperty("body");
        });
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET: /api/articles?topic=mitch", () => {
  test("GET: 200 - filters articles when passed a topic query", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(12);
        body.articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });

  test("GET: 200 - should return an empty array when topic exists but there aren't any articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([]);
      });
  });

  test("GET: 404 - should throw an error when passed an invalid topic query", () => {
    return request(app)
      .get("/api/articles?topic=nonsense")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("nonsense not found");
      });
  });
});

describe("GET: /api/users", () => {
  test("GET 200: responds with an array of all users objects with certain properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(data.userData.length);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("GET: 200 sends a single article to the client ", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.article_id).toBe(1);
        expect(body.article.title).toBe("Living in the shadow of a great man");
        expect(body.article.topic).toBe("mitch");
        expect(body.article.author).toBe("butter_bridge");
        expect(body.article.body).toBe("I find this existence challenging");
        expect(body.article.created_at).toBe("2020-07-09T20:11:00.000Z");
        expect(body.article.votes).toBe(100);
        expect(body.article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("GET: 404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article was not found");
      });
  });
  test("GET: 400 sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-article")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("GET: 200 sends an array of comments to the client with the most recent comments first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveLength(
          data.commentData.filter((comment) => comment.article_id === 1).length
        );

        body.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
        expect(body).toBeSortedBy("created_at");
      });
  });

  test("GET: 200 sends an empty array if the article_id exists but there are not any comments at this id", () => {
    return request(app)
      .get("/api/articles/11/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveLength(0);
      });
  });

  test("GET:404 sends an appropriate status and error message when given a valid but non-existent article_id", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article was not found");
      });
  });
  test("GET:400 responds with an appropriate error message when given an invalid article_id", () => {
    return request(app)
      .get("/api/articles/nonsense/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("POST: 201 adds a new comment to a particular article", () => {
    const newComment = {
      username: "butter_bridge",
      body: "NC is the best software development bootcamp",
    };

    return request(app)
      .post("/api/articles/11/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          body: "NC is the best software development bootcamp",
          article_id: expect.any(Number),
          author: "butter_bridge",
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  test("POST: 400 responds with an appropriate error when provided a bad comment schema", () => {
    return request(app)
      .post("/api/articles/11/comments")
      .send({ username: "butter_bridge" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("POST: 400 responds with an appropriate error when article_id is of an invalid type", () => {
    const newComment = {
      username: "butter_bridge",
      body: "NC is the best software development bootcamp",
    };
    return request(app)
      .post("/api/articles/nonsense/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("PATCH: 200 should increment the specified article vote with the inc_votes provided", () => {
    const newVotes = { inc_votes: 5 };

    return request(app)
      .patch("/api/articles/1")
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        const { updatedArticle } = body;

        expect(updatedArticle.votes).toBe(105);
      });
  });

  test("PATCH: 200 should decrement the specified article vote with the inc_votes provided", () => {
    const newVotes = { inc_votes: -5 };

    return request(app)
      .patch("/api/articles/1")
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        const { updatedArticle } = body;
        expect(updatedArticle.votes).toBe(95);
      });
  });

  test("PATCH: 400 responds with an appropriate error when newVotes is not provided", () => {
    const newVotes = {};

    return request(app)
      .patch("/api/articles/NaN")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("PATCH: 400 responds with an appropriate error when article_id is an invalid type ", () => {
    const newVotes = { inc_votes: -5 };

    return request(app)
      .patch("/api/articles/NaN")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("PATCH: 404 - responds with an appropriate error when article_id is non-existent", () => {
    const newVotes = { inc_votes: -5 };

    return request(app)
      .patch("/api/articles/999")
      .send(newVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article was not found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("DELETE: 204 - deletes the given comment by comment_id, responds with 204 status and no content", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("DELETE: 404 responds with an appropriate error when comment_id is non-existent", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Sorry! Comment does not exist!");
      });
  });
});
describe("Generic errors", () => {
  test("GET: 404 responds with not found error when endpoint does not exist  ", () => {
    return request(app)
      .get("/api/sdfdsafjds")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
});

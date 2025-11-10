const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app.js");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("200: Responds with the topics object", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(3);
        expect(Array.isArray(body)).toBe(true);
        expect(body).toEqual([
          { slug: "mitch", description: "The man, the Mitch, the legend", img_url: "" },
          { slug: "cats", description: "Not dogs", img_url: "" },
          { slug: "paper", description: "what books are made of", img_url: "" },
        ]);
      });
  });
});

describe("GET /api/articles", () => {
  test("should give an array of 13 articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
      });
  });
  test("should respond with 200: 'Responds with the articles object 'when passed no comment count but  and all values from the articles table", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
      });
  });
  test("should respond with 200: 'Responds with the articles object 'when passed no comment count but  and all values from the articles table excluding the body", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        body.articles.forEach((article) => {
          article.hasOwnProperty("body") === false;
        });
      });
  });
  test("should respond with 200: 'Responds with the articles object 'when passed a comment count and all values from the articles table excluding the body", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
});
describe("GET /api/users", () => {
  test("should respond with 200 and the users object", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        body.users.forEach((user) => {
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
  test("should respond with 200 and article matching the article_id ", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body }) => {
        expect(body.article[0]).toMatchObject({
          author: "icellusedkars",
          title: "Eight pug gifs that remind me of mitch",
          article_id: 3,
          body: "some gifs",
          topic: "mitch",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
   test("should respond with 400 error when given an invalid type for an index ", () => {
    return request(app)
      .get("/api/articles/not_an_index")
      .expect(400)
      .then(({ body }) => {
        console.log(body)
        expect(body.msg).toEqual("Bad request")
      });
  });
});
describe("GET /api/articles/:article_id/comments", () => {
  test("should respond with 200 and article matching the article_id ", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });
});

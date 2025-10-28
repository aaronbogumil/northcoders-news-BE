const express = require("express")
const app = express();
const db = require("./db/connection");

app.use(express.json());

app.use('/api', express.static('./public'))

app.get("/", (req, res) => {
  res.send("Connected at endpoint: /");
});
app.get("/api/topics", (req, res) => {
  db.query("SELECT * FROM topics").then(({ rows }) => {
    res.status(200).send(rows);
  });
});

app.get("/api/articles", (req, res) => {
  const articleQuery = `SELECT a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url, 
    COUNT(c.comment_id)::INT AS comment_count 
    FROM articles a 
    LEFT JOIN comments c ON a.article_id = c.article_id
    GROUP BY a.article_id`;
  return db.query(articleQuery).then(({ rows }) => {
    res.status(200).send({ articles: rows });
  });
});
app.get("/api/articles/:article_id", (req, res) => {
  let { article_id } = req.params;
  console.log(article_id);
  const articleQuery = `SELECT author, title, article_id, body, topic, created_at, votes, article_img_url FROM articles WHERE article_id = $1;`;
  article_id = Number(article_id);
  if (article_id) {
    return db.query(articleQuery, [article_id]).then(({ rows }) => {
      res.status(200).send({ article: rows });
    });
  }
});
app.get("/api/articles/:article_id/comments", (req, res) => {
  let { article_id } = req.params;
  let articleQuery = `SELECT c.comment_id, c.votes, c.created_at, c.author, c.body, c.article_id FROM comments AS c LEFT JOIN articles AS a ON c.article_id = a.article_id WHERE a.article_id = $1;`;
  article_id = Number(article_id);
  if (article_id) {
    return db.query(articleQuery, [article_id]).then(({ rows }) => {
      res.status(200).send({ comments: rows });
    });
  }
});

app.get("/api/users", (req, res) => {
  const usersQuery = "SELECT * FROM users";
  return db.query(usersQuery).then(({ rows }) => {
    res.status(200).send({ users: rows });
  });
});

app.use((error, request, response, next) => {
  console.error(error);
  if (error.code === "22p02") {
    return response.status(400).send({ msg: "Bad request" });
  }
  next(error);
});

app.use((error, request, response, next) => {
  console.error(error);
  response.status(500).send(error);
});
module.exports = app;

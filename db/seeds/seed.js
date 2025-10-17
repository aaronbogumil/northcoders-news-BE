const db = require("../connection");
const { convertTimestampToDate } = require("./utils");
const format = require("pg-format")
const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query(`DROP TABLE IF EXISTS comments;`)
  .then(()=> {return db.query(`DROP TABLE IF EXISTS articles;`)})
  .then(()=> {return db.query(`DROP TABLE IF EXISTS users;`)})
  .then(()=> {return db.query(`DROP TABLE IF EXISTS topics;`)})
  .then(()=> {return db.query(`CREATE TABLE topics(slug VARCHAR PRIMARY KEY, description VARCHAR, img_url VARCHAR(1000));`)})
  .then(()=> {return db.query(`CREATE TABLE users(username VARCHAR(50) PRIMARY KEY, name VARCHAR, avatar_url VARCHAR(1000));`)})
  .then(()=> {return db.query(`CREATE TABLE articles(article_id SERIAL PRIMARY KEY, title VARCHAR, topic VARCHAR REFERENCES topics(slug), author VARCHAR REFERENCES users(username), body TEXT, created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP , votes INT DEFAULT 0, article_img_url VARCHAR(1000));`)})
  .then(()=> {return db.query(`CREATE TABLE comments(comment_id SERIAL PRIMARY KEY, article_id INT REFERENCES articles(article_id), body TEXT, votes INT DEFAULT 0, author VARCHAR REFERENCES users(username), created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP);`)})
  .then(()=>{
    const formattedTopics = topicData.map((topic)=> {return [topic.slug, topic.description, topic.img_url]})
    const sqlString = format("INSERT INTO topics(slug, description, img_url) VALUES %L", formattedTopics)
    console.log(sqlString)
    return db.query(sqlString)
  })
    .then(()=>{
    const formattedUsers = userData.map((user)=> {return [user.username, user.name, user.avatar_url]})
    const sqlString = format("INSERT INTO users(username, name, avatar_url) VALUES %L", formattedUsers)
    console.log(sqlString)
    return db.query(sqlString)
  })
  .then(()=>{
    const formattedArticles = articleData.map((article)=> {
      const timestampObj = convertTimestampToDate(article)
      return [article.title, article.topic, article.author, article.body, timestampObj.created_at, article.votes, article.article_img_url]})
    const sqlString = format("INSERT INTO articles(title, topic, author, body, created_at, votes, article_img_url) VALUES %L", formattedArticles)
    return db.query(sqlString)
  })
  .then(()=>{
    const formattedComments = commentData.map((Comment)=> {
      const timestampObj = convertTimestampToDate(Comment)
      return [Comment.article_id, Comment.body, Comment.votes, Comment.author, timestampObj.created_at]})
    const sqlString = format("INSERT INTO comments(article_id, body, votes, author, created_at) VALUES %L", formattedComments)
    return db.query(sqlString)
  })
  .then(()=>{return db.query(`SELECT * FROM users`)})
};
module.exports = seed;

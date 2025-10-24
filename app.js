const express = require("express");
const app = express();
const db = require("./db/connection");


app.use(express.json());

app.get("/", (req, res) => {
    res.send("Connected at endpoint: /")
})
app.get("/api/topics", (req, res) => {
    db.query("SELECT * FROM topics",).then((({rows})=>{
        res.status(200).send(rows)
    }))
    
});

app.get("/api/articles", (req, res) => {
    const articleQuery = `SELECT a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url, 
    COUNT(c.comment_id)::INT AS comment_count 
    FROM articles a 
    LEFT JOIN comments c ON a.article_id = c.article_id
    GROUP BY a.article_id`
    db.query(articleQuery).then(({rows})=>{//(SELECT COUNT(*) AS comment_count FROM comments WHERE a.article_id = c.article_id)
            res.status(200).send({articles : rows})
    })
});

app.use((error, request, response, next) => {
    console.error(error)
    response.status(500).send(error)
}
)
module.exports = app

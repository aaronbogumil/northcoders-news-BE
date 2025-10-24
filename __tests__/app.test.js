const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")
const request = require("supertest")
const app = require("../app.js")

beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    return db.end()
})

describe("GET /api/topics", () => { 
    test("200: Responds with the topics object",() => { 
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({body}) => {
                expect(body.length).toBe(3)
                expect(Array.isArray(body)).toBe(true)
                expect(body).toEqual([
                    {slug: 'mitch', description: 'The man, the Mitch, the legend', img_url: ''},
                    {slug: 'cats', description: 'Not dogs', img_url: ''},
                    {slug: 'paper', description: 'what books are made of', img_url: ''}
                ])
               
            })
    })
})

describe.only("GET /api/articles", () => { 
    test('should give an array of 13 articles', () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body})=>{
                expect(body.articles.length).toBe(13)
            })
        
    });
    test("should respond with 200: 'Responds with the articles object 'when passed no comment count but  and all values from the articles table",() => { 
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body}) => {
                body.articles.forEach(article => {
                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                })
                })
            })
    })
    test("should respond with 200: 'Responds with the articles object 'when passed no comment count but  and all values from the articles table excluding the body", () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body}) => {
                body.articles.forEach(article => {
                    article.hasOwnProperty("body") === false
                })
            })
    });
    test("should respond with 200: 'Responds with the articles object 'when passed a comment count  and all values from the articles table excluding the body", () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body}) => {
                body.articles.forEach(article => {
                    expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(Number),
                    })
                })
            })
    });
})

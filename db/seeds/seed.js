const db = require("../connection");
const format = require("pg-format");
const {
  convertTimestampToDate,
  createArticleRef,
  formatComments,
} = require("./utils");

const seed = ({ topicData,
  userData,
  articleData,
  commentData }) => {
  return db
    .query("DROP TABLE IF EXISTS comments;")
    .then(() => db.query("DROP TABLE IF EXISTS articles;"))
    .then(() => db.query("DROP TABLE IF EXISTS users;"))
    .then(() => db.query("DROP TABLE IF EXISTS topics;"))
    .then(() => {
      return db.query(`CREATE TABLE topics(
        slug VARCHAR(20) PRIMARY KEY,
        description VARCHAR(1000) NOT NULL,
        img_url VARCHAR(1000)
        );
      `);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE users (
          username VARCHAR(20) PRIMARY KEY,
          name VARCHAR(20) NOT NULL,
          avatar_url VARCHAR(1000) NOT NULL
        );
      `);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE articles (
          article_id SERIAL PRIMARY KEY,
          title VARCHAR(250) NOT NULL,
          topic VARCHAR(20) REFERENCES topics(slug),
          author VARCHAR(20) REFERENCES users(username),
          body TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          votes INT DEFAULT 0,
          article_img_url VARCHAR(1000)
        );
      `);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE comments (
          comment_id SERIAL PRIMARY KEY,
          article_id INT REFERENCES articles(article_id),
          body TEXT,
          votes INTEGER DEFAULT 0,
          author VARCHAR(50) REFERENCES users(username),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    })

    // topics
    .then(() => {
      const insertTopicsQueryStr = format(
        "INSERT INTO topics (slug, description) VALUES %L RETURNING *;",
        topicData.map(({ slug, description }) => [slug, description])
      );
      return db.query(insertTopicsQueryStr);
    })
    //users
    .then(() => {
      const insertUsersQueryStr = format(
        "INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING *;",
        userData.map(({ username, name, avatar_url }) => [
          username,
          name,
          avatar_url,
        ])
      );
      return db.query(insertUsersQueryStr);
    })
    //articles
    .then(() => {
      const formattedArticles = articleData.map(convertTimestampToDate);
      const insertArticlesQueryStr = format(
        `INSERT INTO articles (title, topic, author, body, created_at, votes)
         VALUES %L RETURNING *;`,
        formattedArticles.map(
          ({ title, topic, author, body, created_at, votes = 0 }) => [
            title,
            topic,
            author,
            body,
            created_at,
            votes,
          ]
        )
      );
      return db.query(insertArticlesQueryStr);
    })
    .then((result) => {
      const articleRows = result.rows;
      const articleRef = createArticleRef(articleRows);

      //comments
      const insertCommentsQueryStr = format(
        `INSERT INTO comments (author, article_id, votes, created_at, body)
         VALUES %L RETURNING *;`,
        commentData.map(
          ({ author, article_title, votes = 0, created_at, body }) => {
            return [
            author,
            articleRef[article_title],
            votes,
            new Date(created_at),
            body,
          ]
        }
        )
      );
      return db.query(insertCommentsQueryStr);
    });
};

module.exports = seed;

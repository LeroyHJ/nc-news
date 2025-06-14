const express = require("express");
const { getApi } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/topics.controller");
const {
  getArticles,
  getArticleById,
  patchArticleVotesById,
} = require("./controllers/articles.controller");
const { getUsers } = require("./controllers/users.controller");
const {
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("./controllers/comments.controller");

const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerError,
} = require("./errors/handleErrors");

const app = express();
//aaa
app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/users", getUsers);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", patchArticleVotesById);

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerError);

module.exports = app;
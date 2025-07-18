const { fetchCommentsByArticleId } = require("../models/comments.model");
const { insertComment } = require("../models/comments.model");
const { checkExists } = require("../db/seeds/utils");

const getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;

  if (isNaN(Number(article_id))) {
    return response.status(400).send({ msg: "Invalid article ID" });
  }

  checkExists("articles", "article_id", article_id)
    .then(() => {
      return fetchCommentsByArticleId(article_id);
    })
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch(next);
};
const postCommentByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  const { username, body } = request.body;

  if (!username || !body) {
    return response
      .status(400)
      .send({ msg: "Missing required fields: username and body" });
  }
  if (isNaN(Number(article_id))) {
    return response.status(400).send({ msg: "Invalid article ID" });
  }

  const id = Number(article_id);

  Promise.all([
    checkExists("articles", "article_id", id),
    checkExists("users", "username", username),
  ])
    .then(() => insertComment(id, username, body))
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
module.exports = { getCommentsByArticleId, postCommentByArticleId };
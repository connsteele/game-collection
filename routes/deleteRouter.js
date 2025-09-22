const {Router} = require("express");
const deleteRouter = Router();
const deleteController = require("../controllers/deleteController");

deleteRouter.post("/:id", deleteController.deleteGame);

module.exports = deleteRouter;
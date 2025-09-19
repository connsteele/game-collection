const {Router} = require("express");
const newRouter = Router();
const newController = require("../controllers/newController");

newRouter.get("/", newController.addGameGet);
newRouter.post("/", newController.addGamePost);


module.exports = newRouter;
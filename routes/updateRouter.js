const {Router} = require("express");
const updateRouter = Router();
const updateController = require("../controllers/updateController");

updateRouter.get("/:id", updateController.updateEntryGet);
updateRouter.get("/:id", updateController.updateEntryPost);

module.exports = updateRouter;
const express = require("express");
const controller = require("../controllers/shopController");

const router = express.Router();

router.get("/:id", controller.get);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.get("/:id/summary", controller.summary);

module.exports = router;

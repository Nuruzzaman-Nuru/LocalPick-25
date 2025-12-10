const express = require("express");
const controller = require("../controllers/orderController");

const router = express.Router();

router.get("/", controller.list);
router.get("/:id", controller.get);
router.post("/", controller.create);
router.patch("/:id/status", controller.updateStatus);

module.exports = router;

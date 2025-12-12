const express = require("express");
const controller = require("../controllers/shopController");
const { requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/:id", controller.get);
router.post("/", requireRole(["shop_owner", "admin"]), controller.create);
router.put("/:id", requireRole(["shop_owner", "admin"]), controller.update);
router.get("/:id/summary", requireRole(["shop_owner", "admin"]), controller.summary);

module.exports = router;

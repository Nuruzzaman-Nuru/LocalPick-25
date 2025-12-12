const express = require("express");
const controller = require("../controllers/orderController");
const { requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/", requireRole(["shop_owner", "admin"]), controller.list);
router.get("/:id", requireRole(["shop_owner", "admin"]), controller.get);
router.post("/", requireRole(["shop_owner", "admin"]), controller.create);
router.patch("/:id/status", requireRole(["shop_owner", "admin"]), controller.updateStatus);

module.exports = router;

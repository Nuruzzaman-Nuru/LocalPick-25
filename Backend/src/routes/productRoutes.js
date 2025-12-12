const express = require("express");
const controller = require("../controllers/productController");
const { requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/", controller.list);
router.get("/:id", controller.get);
router.post("/", requireRole(["shop_owner", "admin"]), controller.create);
router.put("/:id", requireRole(["shop_owner", "admin"]), controller.update);
router.patch("/:id/status", requireRole(["shop_owner", "admin"]), controller.toggleStatus);
router.delete("/:id", requireRole(["shop_owner", "admin"]), controller.remove);

module.exports = router;

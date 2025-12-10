const express = require("express");
const controller = require("../controllers/productController");

const router = express.Router();

router.get("/", controller.list);
router.get("/:id", controller.get);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.patch("/:id/status", controller.toggleStatus);
router.delete("/:id", controller.remove);

module.exports = router;

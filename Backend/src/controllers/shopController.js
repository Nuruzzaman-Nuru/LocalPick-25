const mongoose = require("mongoose");
const Shop = require("../models/Shop");
const Product = require("../models/Product");
const Order = require("../models/Order");

exports.get = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ message: "Shop not found" });
    return res.json(shop);
  } catch (err) {
    console.error("Get shop error:", err);
    return res.status(500).json({ message: "Failed to load shop" });
  }
};

exports.create = async (req, res) => {
  try {
    const shop = await Shop.create(req.body);
    return res.status(201).json(shop);
  } catch (err) {
    console.error("Create shop error:", err);
    return res.status(500).json({ message: "Failed to create shop" });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await Shop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Shop not found" });
    return res.json(updated);
  } catch (err) {
    console.error("Update shop error:", err);
    return res.status(500).json({ message: "Failed to update shop" });
  }
};

exports.summary = async (req, res) => {
  try {
    const shopId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(shopId)) return res.status(400).json({ message: "Invalid shop id" });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [totalProducts, todayOrders, weekRevenueAgg, pendingOrders, lowStock, recentOrders] = await Promise.all([
      Product.countDocuments({ shopId }),
      Order.countDocuments({ shopId, createdAt: { $gte: todayStart } }),
      Order.aggregate([
        { $match: { shopId: new mongoose.Types.ObjectId(shopId), createdAt: { $gte: weekAgo } } },
        { $group: { _id: null, total: { $sum: "$totals.grandTotal" } } },
      ]),
      Order.countDocuments({ shopId, status: "pending" }),
      Product.countDocuments({ shopId, stock: { $lte: 5 } }),
      Order.find({ shopId }).sort({ createdAt: -1 }).limit(5),
    ]);

    return res.json({
      metrics: {
        totalProducts,
        todayOrders,
        weekRevenue: weekRevenueAgg[0]?.total || 0,
        pendingOrders,
        lowStock,
      },
      recentOrders,
    });
  } catch (err) {
    console.error("Shop summary error:", err);
    return res.status(500).json({ message: "Failed to load summary" });
  }
};

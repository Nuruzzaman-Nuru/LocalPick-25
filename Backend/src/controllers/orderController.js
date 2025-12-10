const Order = require("../models/Order");
const Shop = require("../models/Shop");

const parsePagination = (req) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

exports.list = async (req, res) => {
  try {
    const { shopId, status, q, from, to } = req.query;
    const { limit, skip, page } = parsePagination(req);
    const filter = {};

    if (shopId) filter.shopId = shopId;
    if (status) filter.status = status;
    if (q) {
      filter.$or = [
        { _id: q },
        { "customer.phone": { $regex: q, $options: "i" } },
        { "customer.name": { $regex: q, $options: "i" } },
      ];
    }
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const [items, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(filter),
    ]);

    return res.json({
      items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("List orders error:", err);
    return res.status(500).json({ message: "Failed to list orders" });
  }
};

exports.get = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.json(order);
  } catch (err) {
    console.error("Get order error:", err);
    return res.status(500).json({ message: "Failed to load order" });
  }
};

exports.create = async (req, res) => {
  try {
    const data = req.body;
    if (!data.shopId) return res.status(400).json({ message: "shopId is required" });
    const shopExists = await Shop.exists({ _id: data.shopId });
    if (!shopExists) return res.status(400).json({ message: "Invalid shopId" });

    if (!data.items || data.items.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }

    const order = await Order.create(data);
    return res.status(201).json(order);
  } catch (err) {
    console.error("Create order error:", err);
    return res.status(500).json({ message: "Failed to create order" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const allowed = ["pending", "confirmed", "packed", "out_for_delivery", "delivered", "cancelled"];
    if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });

    const updated = await Order.findByIdAndUpdate(
      id,
      { status, ...(notes ? { notes } : {}) },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Order not found" });
    return res.json(updated);
  } catch (err) {
    console.error("Update order status error:", err);
    return res.status(500).json({ message: "Failed to update order status" });
  }
};

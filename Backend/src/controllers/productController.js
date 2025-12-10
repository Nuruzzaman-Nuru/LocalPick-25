const Product = require("../models/Product");
const Shop = require("../models/Shop");

const parsePagination = (req) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

exports.list = async (req, res) => {
  try {
    const { shopId, status, category, q } = req.query;
    const { limit, skip, page } = parsePagination(req);
    const filter = {};

    if (shopId) filter.shopId = shopId;
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { slug: { $regex: q, $options: "i" } },
        { sku: { $regex: q, $options: "i" } },
      ];
    }

    const [items, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    return res.json({
      items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("List products error:", err);
    return res.status(500).json({ message: "Failed to list products" });
  }
};

exports.get = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.json(product);
  } catch (err) {
    console.error("Get product error:", err);
    return res.status(500).json({ message: "Failed to load product" });
  }
};

exports.create = async (req, res) => {
  try {
    const data = req.body;
    if (data.shopId) {
      const shopExists = await Shop.exists({ _id: data.shopId });
      if (!shopExists) {
        return res.status(400).json({ message: "Invalid shopId" });
      }
    } else {
      return res.status(400).json({ message: "shopId is required" });
    }

    const product = await Product.create(data);
    return res.status(201).json(product);
  } catch (err) {
    console.error("Create product error:", err);
    return res.status(500).json({ message: "Failed to create product" });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    return res.json(updated);
  } catch (err) {
    console.error("Update product error:", err);
    return res.status(500).json({ message: "Failed to update product" });
  }
};

exports.toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const updated = await Product.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    return res.json(updated);
  } catch (err) {
    console.error("Toggle product status error:", err);
    return res.status(500).json({ message: "Failed to update status" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    return res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("Delete product error:", err);
    return res.status(500).json({ message: "Failed to delete product" });
  }
};

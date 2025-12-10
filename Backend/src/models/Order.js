const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, default: "piece" },
    price: { type: Number, required: true },
    lineTotal: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true, index: true },
    customer: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
      area: { type: String, default: "" },
    },
    items: { type: [orderItemSchema], default: [] },
    totals: {
      subtotal: { type: Number, required: true },
      deliveryCharge: { type: Number, default: 0 },
      grandTotal: { type: Number, required: true },
    },
    paymentMethod: { type: String, enum: ["cod", "online"], default: "cod" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "packed", "out_for_delivery", "delivered", "cancelled"],
      default: "pending",
      index: true,
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

orderSchema.index({ "customer.phone": 1, "customer.name": 1 });

module.exports = mongoose.model("Order", orderSchema);

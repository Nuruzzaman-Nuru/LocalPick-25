const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true, index: true },
    description: { type: String, default: "" },
    category: { type: String, default: "" },
    price: { type: Number, required: true },
    salePrice: { type: Number, default: null },
    stock: { type: Number, default: 0 },
    sku: { type: String, default: "" },
    unit: { type: String, default: "piece" },
    status: { type: String, enum: ["active", "inactive"], default: "active", index: true },
    tags: { type: [String], default: [] },
    variants: {
      type: [
        {
          name: String,
          value: String,
        },
      ],
      default: [],
    },
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", sku: "text" });

productSchema.pre("validate", function ensureSlug(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
  return next();
});

module.exports = mongoose.model("Product", productSchema);

const mongoose = require("mongoose");

const socialSchema = new mongoose.Schema(
  {
    facebook: String,
    instagram: String,
    website: String,
  },
  { _id: false }
);

const shopSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    name: { type: String, required: true, trim: true },
    logo: { type: String, default: "" },
    banner: { type: String, default: "" },
    tagline: { type: String, default: "" },
    description: { type: String, default: "" },
    address: { type: String, default: "" },
    mapLink: { type: String, default: "" },
    phone: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    email: { type: String, default: "" },
    socialLinks: { type: socialSchema, default: () => ({}) },
    minOrderAmount: { type: Number, default: 0 },
    deliveryAreas: { type: String, default: "" },
    openingHours: { type: String, default: "" },
    notifications: {
      sms: { type: Boolean, default: false },
      email: { type: Boolean, default: false },
      app: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shop", shopSchema);

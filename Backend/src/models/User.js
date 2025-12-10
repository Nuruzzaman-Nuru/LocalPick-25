const crypto = require("crypto");
const mongoose = require("mongoose");

const roles = ["user", "shop_owner", "delivery", "admin"];

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: roles, default: "user" },
    address: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

async function generateUserId() {
  const candidate = `LP-${crypto.randomInt(100000, 999999)}`;
  const exists = await mongoose.models.User.exists({ userId: candidate });
  return exists ? generateUserId() : candidate;
}

userSchema.pre("save", async function preSave(next) {
  if (this.userId) return next();
  this.userId = await generateUserId();
  return next();
});

module.exports = mongoose.model("User", userSchema);
module.exports.roles = roles;

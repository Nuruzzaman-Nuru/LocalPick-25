require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");

const requiredEnv = ["ADMIN_NAME", "ADMIN_EMAIL", "ADMIN_PHONE", "ADMIN_PASSWORD", "ADMIN_ADDRESS"];
const missing = requiredEnv.filter((key) => !process.env[key]);

if (missing.length) {
  console.error(`Missing required env vars: ${missing.join(", ")}`);
  console.error("Set them in .env and re-run: npm run seed:admin");
  process.exit(1);
}

async function createAdmin() {
  await connectDB();

  const email = process.env.ADMIN_EMAIL.toLowerCase();
  const phone = process.env.ADMIN_PHONE;

  const existing = await User.findOne({ $or: [{ email }, { phone }], role: "admin" });
  if (existing) {
    console.log("Admin already exists:", existing.userId, existing.email);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);

  const admin = await User.create({
    name: process.env.ADMIN_NAME,
    email,
    phone,
    address: process.env.ADMIN_ADDRESS,
    passwordHash,
    role: "admin",
  });

  console.log("Admin created:");
  console.log("Name:", admin.name);
  console.log("Email:", admin.email);
  console.log("User ID:", admin.userId);
  console.log("Use this ID or email with the admin password to log in.");
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error("Failed to create admin:", err);
  process.exit(1);
});

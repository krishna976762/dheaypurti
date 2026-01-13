require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../src/models/user");

async function seedOwner() {
  await mongoose.connect(process.env.MONGO_URI);
  const existingOwner = await User.findOne({ role: "owner" });
  if (existingOwner) return console.log("Owner already exists");

  const hashedPassword = await bcrypt.hash("owner@123", 10);
  const owner = new User({
    name: "System Owner",
    email: "owner@dheypurti.com",
    password: hashedPassword,
    role: "owner",
    isActive: true
  });

  await owner.save();
  console.log("✅ Owner created:", owner.email);
  process.exit(0);
}

seedOwner();

/**
 * Script to set a user as admin
 * 
 * Usage:
 * node server/scripts/setAdmin.js <user-email>
 * 
 * Example:
 * node server/scripts/setAdmin.js admin@example.com
 */

import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const setAdmin = async () => {
  try {
    const email = process.argv[2];

    if (!email) {
      console.error("❌ Error: Please provide an email address");
      console.log("Usage: node server/scripts/setAdmin.js <user-email>");
      process.exit(1);
    }

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      console.error(`❌ Error: User with email "${email}" not found`);
      process.exit(1);
    }

    if (user.role === "admin") {
      console.log(`✅ User "${email}" is already an admin`);
      process.exit(0);
    }

    user.role = "admin";
    await user.save();

    console.log(`✅ Successfully set user "${email}" as admin`);
    console.log(`   User: ${user.fullName || email}`);
    console.log(`   Role: ${user.role}`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

setAdmin();


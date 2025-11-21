/**
 * Script to create an admin user account
 * 
 * Usage:
 * node server/scripts/createAdmin.js
 * 
 * This will create an admin user with:
 * Email: admin@admin.com
 * Password: Admin123!
 * Role: admin
 */

import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = "admin@admin.com";
    const adminPassword = "Admin123!";
    const adminName = "Admin User";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      // Update existing user to admin
      if (existingAdmin.role !== "admin") {
        existingAdmin.role = "admin";
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        existingAdmin.password = hashedPassword;
        existingAdmin.fullName = adminName;
        await existingAdmin.save();
        console.log(`✅ Updated existing user to admin`);
      } else {
        console.log(`✅ Admin user already exists`);
      }
      
      console.log(`\n📧 Email: ${adminEmail}`);
      console.log(`🔑 Password: ${adminPassword}`);
      console.log(`👤 Name: ${existingAdmin.fullName}`);
      console.log(`🆔 User ID: ${existingAdmin._id}`);
      console.log(`👑 Role: ${existingAdmin.role}`);
      process.exit(0);
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await User.create({
      fullName: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      isVerified: true,
    });

    console.log(`\n✅ Admin user created successfully!\n`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`   ADMIN CREDENTIALS`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📧 Email:    ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log(`👤 Name:     ${admin.fullName}`);
    console.log(`🆔 User ID:  ${admin._id}`);
    console.log(`👑 Role:     ${admin.role}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    console.log(`💡 You can now login with these credentials at /login`);
    console.log(`🔗 Admin Panel: http://localhost:5173/admin\n`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
    if (error.code === 11000) {
      console.error("   User with this email already exists");
    }
    process.exit(1);
  }
};

createAdmin();


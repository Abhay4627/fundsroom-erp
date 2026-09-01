import bcrypt from "bcryptjs";
import pool from "./config/database";

const createAdmin = async () => {
  const password = await bcrypt.hash("Admin@123", 10);

  await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)`,
    ["Admin", "admin@fundsroom.com", password, "ADMIN"]
  );

  console.log("Admin user created successfully!");
  await pool.end();
};

createAdmin().catch((error) => {
  console.error("Error:", error.message);
  process.exit(1);
});
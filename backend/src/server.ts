import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/database";
import authRoutes from "./routes/authRoutes";
import customerRoutes from "./routes/customerRoutes";
import productRoutes from "./routes/productRoutes";
import stockRoutes from "./routes/stockRoutes";
import challanRoutes from "./routes/challanRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/customers", customerRoutes);
app.use("/products", productRoutes);
app.use("/stock-movements", stockRoutes);
app.use("/challans", challanRoutes);

pool.query("SELECT NOW()")
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
  });

app.get("/", (req, res) => {
  res.json({ message: "Fundsroom ERP Backend is running!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
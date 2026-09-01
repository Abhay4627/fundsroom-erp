import { Request, Response } from "express";
import pool from "../config/database";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch product",
    });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      product_name,
      sku,
      category,
      unit_price,
      current_stock,
      minimum_stock_quantity,
      warehouse_location,
    } = req.body;

    if (!product_name || !sku || unit_price === undefined) {
      return res.status(400).json({
        message: "Product name, SKU and unit price are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO products
      (product_name, sku, category, unit_price, current_stock,
       minimum_stock_quantity, warehouse_location)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [
        product_name,
        sku,
        category,
        unit_price,
        current_stock || 0,
        minimum_stock_quantity || 0,
        warehouse_location,
      ]
    );

    res.status(201).json({
      message: "Product created successfully",
      product: result.rows[0],
    });
  } catch (error: any) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(409).json({
        message: "SKU already exists",
      });
    }

    res.status(500).json({
      message: "Failed to create product",
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const {
      product_name,
      sku,
      category,
      unit_price,
      current_stock,
      minimum_stock_quantity,
      warehouse_location,
    } = req.body;

    const result = await pool.query(
      `UPDATE products SET
       product_name = $1,
       sku = $2,
       category = $3,
       unit_price = $4,
       current_stock = $5,
       minimum_stock_quantity = $6,
       warehouse_location = $7,
       updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [
        product_name,
        sku,
        category,
        unit_price,
        current_stock,
        minimum_stock_quantity,
        warehouse_location,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product updated successfully",
      product: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update product",
    });
  }
};
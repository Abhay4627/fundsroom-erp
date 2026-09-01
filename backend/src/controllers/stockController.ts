import { Request, Response } from "express";
import pool from "../config/database";

export const getStockMovements = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        sm.id,
        sm.product_id,
        p.product_name,
        sm.quantity,
        sm.movement_type,
        sm.reason,
        sm.created_by,
        sm.created_at
      FROM stock_movements sm
      JOIN products p ON p.id = sm.product_id
      ORDER BY sm.id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch stock movements",
    });
  }
};

export const createStockMovement = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      product_id,
      quantity,
      movement_type,
      reason,
      created_by,
    } = req.body;

    if (!product_id || !quantity || !movement_type) {
      return res.status(400).json({
        message: "Product, quantity and movement type are required",
      });
    }

    if (!["IN", "OUT"].includes(movement_type)) {
      return res.status(400).json({
        message: "Movement type must be IN or OUT",
      });
    }

    const result = await pool.query(
      `INSERT INTO stock_movements
      (product_id, quantity, movement_type, reason, created_by)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        product_id,
        quantity,
        movement_type,
        reason,
        created_by || null,
      ]
    );

    res.status(201).json({
      message: "Stock movement created successfully",
      movement: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create stock movement",
    });
  }
};
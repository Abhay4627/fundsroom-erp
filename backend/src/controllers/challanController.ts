import { Request, Response } from "express";
import pool from "../config/database";

export const getChallans = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id,
        c.challan_number,
        c.customer_id,
        cu.customer_name,
        c.total_quantity,
        c.status,
        c.created_by,
        c.created_at
      FROM challans c
      JOIN customers cu ON cu.id = c.customer_id
      ORDER BY c.id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch challans",
    });
  }
};

export const getChallanById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const challan = await pool.query(
      `
      SELECT 
        c.*,
        cu.customer_name,
        cu.business_name
      FROM challans c
      JOIN customers cu ON cu.id = c.customer_id
      WHERE c.id = $1
      `,
      [id]
    );

    if (challan.rows.length === 0) {
      return res.status(404).json({
        message: "Challan not found",
      });
    }

    const items = await pool.query(
      `
      SELECT *
      FROM challan_items
      WHERE challan_id = $1
      ORDER BY id
      `,
      [id]
    );

    res.json({
      challan: challan.rows[0],
      items: items.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch challan",
    });
  }
};

export const createChallan = async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    const {
      customer_id,
      products,
      status = "Draft",
      created_by,
    } = req.body;

    if (!customer_id || !products || !Array.isArray(products)) {
      return res.status(400).json({
        message: "Customer and products are required",
      });
    }

    if (products.length === 0) {
      return res.status(400).json({
        message: "At least one product is required",
      });
    }

    await client.query("BEGIN");

    // Generate challan number
    const countResult = await client.query(
      "SELECT COUNT(*) FROM challans"
    );

    const nextNumber = Number(countResult.rows[0].count) + 1;

    const challanNumber = `CH-${String(nextNumber).padStart(4, "0")}`;

    let totalQuantity = 0;

    // Check products and calculate total quantity
    for (const item of products) {
      if (!item.product_id || !item.quantity || item.quantity <= 0) {
        throw new Error("Invalid product or quantity");
      }

      const productResult = await client.query(
        "SELECT * FROM products WHERE id = $1 FOR UPDATE",
        [item.product_id]
      );

      if (productResult.rows.length === 0) {
        throw new Error(`Product ${item.product_id} not found`);
      }

      const product = productResult.rows[0];

      if (status === "Confirmed" && product.current_stock < item.quantity) {
        throw new Error(
          `Insufficient stock for ${product.product_name}. Available: ${product.current_stock}, Requested: ${item.quantity}`
        );
      }

      totalQuantity += item.quantity;
    }

    // Create challan
    const challanResult = await client.query(
      `
      INSERT INTO challans
      (challan_number, customer_id, total_quantity, status, created_by)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        challanNumber,
        customer_id,
        totalQuantity,
        status,
        created_by || null,
      ]
    );

    const challan = challanResult.rows[0];

    // Create challan items using product snapshot
    for (const item of products) {
      const productResult = await client.query(
        "SELECT * FROM products WHERE id = $1",
        [item.product_id]
      );

      const product = productResult.rows[0];

      await client.query(
        `
        INSERT INTO challan_items
        (challan_id, product_id, product_name, sku, unit_price, quantity)
        VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
          challan.id,
          product.id,
          product.product_name,
          product.sku,
          product.unit_price,
          item.quantity,
        ]
      );

      // Reduce stock only when confirmed
      if (status === "Confirmed") {
        await client.query(
          `
          UPDATE products
          SET current_stock = current_stock - $1,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $2
          `,
          [item.quantity, product.id]
        );

        // Create OUT stock movement
        await client.query(
          `
          INSERT INTO stock_movements
          (product_id, quantity, movement_type, reason, created_by)
          VALUES ($1, $2, 'OUT', $3, $4)
          `,
          [
            product.id,
            item.quantity,
            `Sales Challan ${challanNumber}`,
            created_by || null,
          ]
        );
      }
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Challan created successfully",
      challan,
    });
  } catch (error: any) {
    await client.query("ROLLBACK");

    console.error(error);

    res.status(400).json({
      message: error.message || "Failed to create challan",
    });
  } finally {
    client.release();
  }
};
import { Request, Response } from "express";
import pool from "../config/database";

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;

    let query = "SELECT * FROM customers";
    const values: string[] = [];

    if (search) {
      query += `
        WHERE customer_name ILIKE $1
        OR business_name ILIKE $1
        OR mobile ILIKE $1
      `;
      values.push(`%${search}%`);
    }

    query += " ORDER BY id DESC";

    const result = await pool.query(query, values);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch customers",
    });
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM customers WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch customer",
    });
  }
};

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const {
      customer_name,
      mobile,
      email,
      business_name,
      gst_number,
      customer_type,
      address,
      status,
      follow_up_date,
      notes,
    } = req.body;

    if (!customer_name || !mobile || !customer_type) {
      return res.status(400).json({
        message: "Customer name, mobile and customer type are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO customers
      (customer_name, mobile, email, business_name, gst_number,
       customer_type, address, status, follow_up_date, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [
        customer_name,
        mobile,
        email,
        business_name,
        gst_number,
        customer_type,
        address,
        status || "Lead",
        follow_up_date,
        notes,
      ]
    );

    res.status(201).json({
      message: "Customer created successfully",
      customer: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create customer",
    });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const {
      customer_name,
      mobile,
      email,
      business_name,
      gst_number,
      customer_type,
      address,
      status,
      follow_up_date,
      notes,
    } = req.body;

    const result = await pool.query(
      `UPDATE customers SET
       customer_name = $1,
       mobile = $2,
       email = $3,
       business_name = $4,
       gst_number = $5,
       customer_type = $6,
       address = $7,
       status = $8,
       follow_up_date = $9,
       notes = $10,
       updated_at = CURRENT_TIMESTAMP
       WHERE id = $11
       RETURNING *`,
      [
        customer_name,
        mobile,
        email,
        business_name,
        gst_number,
        customer_type,
        address,
        status,
        follow_up_date,
        notes,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.json({
      message: "Customer updated successfully",
      customer: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update customer",
    });
  }
};
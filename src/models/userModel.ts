import pool from "../db";

// User type definition
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
  created_at: Date;
}

// Create a new user
export const createUser = async (
  name: string,
  email: string,
  password: string,
  role: string = "user",
  status: string = "active"
): Promise<User> => {
  const query = `
    INSERT INTO users (name, email, password, role, status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const values = [name, email, password, role, status];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Get user by email
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const query = `SELECT * FROM users WHERE email = $1`;
  const result = await pool.query(query, [email]);
  return result.rows[0] || null;
};

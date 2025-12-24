import pool from "../db";

// Driving License type definition
export interface DrivingLicense {
  id: string;
  user_id: string;
  dl_number: string;
  issue_date: Date;
  expiry_date: Date;
  status: string;
}

// Generate a simple DL number
const generateDlNumber = (): string => {
  const prefix = "DL";
  const timestamp = Date.now();
  return `${prefix}${timestamp}`;
};

// Create a new driving license
export const createDrivingLicense = async (
  user_id: string
): Promise<DrivingLicense> => {
  const dl_number = generateDlNumber();
  const issue_date = new Date();
  const expiry_date = new Date();
  expiry_date.setFullYear(expiry_date.getFullYear() + 20); // 20 years validity

  const query = `
    INSERT INTO driving_licenses (user_id, dl_number, issue_date, expiry_date, status)
    VALUES ($1, $2, $3, $4, 'ACTIVE')
    RETURNING *
  `;
  const values = [user_id, dl_number, issue_date, expiry_date];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Check if user already has a driving license
export const getDrivingLicenseByUserId = async (
  user_id: string
): Promise<DrivingLicense | null> => {
  const query = `SELECT * FROM driving_licenses WHERE user_id = $1`;
  const result = await pool.query(query, [user_id]);
  return result.rows[0] || null;
};

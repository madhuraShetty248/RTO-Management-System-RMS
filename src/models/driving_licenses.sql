-- Driving Licenses table for RTO Management System
-- Run this SQL manually in PostgreSQL to create the table

CREATE TABLE IF NOT EXISTS driving_licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    dl_number TEXT UNIQUE NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE'
);

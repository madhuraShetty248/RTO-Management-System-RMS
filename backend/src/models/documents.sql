CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  entity_type VARCHAR(50) NOT NULL, -- 'VEHICLE' or 'DL_APPLICATION'
  entity_id UUID NOT NULL,
  document_type VARCHAR(50) NOT NULL, -- 'AADHAAR', 'PAN', 'ADDRESS_PROOF', 'PHOTO', 'SIGNATURE'
  file_path TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100),
  size INTEGER,
  status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'VERIFIED', 'REJECTED'
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

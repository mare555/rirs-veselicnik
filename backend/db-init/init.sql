-- Initialization SQL for PostgreSQL (runs only on first container initialization)
-- Creates the application's tables with PostgreSQL-compatible types.

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('hr', 'manager', 'applicant')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  job_title TEXT NOT NULL,
  job_description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS job_positions (
  id SERIAL PRIMARY KEY,
  position_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS job_applications (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  description TEXT,
  has_b_category_license BOOLEAN,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  job_id INT NOT NULL REFERENCES jobs(id)
);

-- Messages table used by the API routes
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  applicant_id INT REFERENCES users(id),
  message TEXT NOT NULL,
  sender_role TEXT,
  hr_id INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTE: Do not seed users with a plaintext password here; the application
-- will insert a bcrypt-hashed default HR user on first connection.

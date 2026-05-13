export const schemaSql = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL,
  account_status TEXT NOT NULL,
  profile_image_uri TEXT
);

CREATE TABLE IF NOT EXISTS visitors (
  visitor_id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  address TEXT NOT NULL,
  id_type TEXT NOT NULL,
  id_number TEXT NOT NULL,
  id_image_uri TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS visitor_logs (
  log_id INTEGER PRIMARY KEY AUTOINCREMENT,
  visitor_id INTEGER NOT NULL,
  purpose_of_visit TEXT NOT NULL,
  log_date TEXT NOT NULL,
  time_in TEXT NOT NULL,
  time_out TEXT,
  log_status TEXT NOT NULL,
  surrendered_id_status TEXT NOT NULL,
  checkout_method TEXT,
  FOREIGN KEY (visitor_id) REFERENCES visitors (visitor_id)
);

CREATE TABLE IF NOT EXISTS visitor_images (
  image_id INTEGER PRIMARY KEY AUTOINCREMENT,
  visitor_id INTEGER NOT NULL,
  checkin_face_uri TEXT,
  checkout_face_uri TEXT,
  FOREIGN KEY (visitor_id) REFERENCES visitors (visitor_id)
);

CREATE TABLE IF NOT EXISTS visitor_passes (
  pass_id INTEGER PRIMARY KEY AUTOINCREMENT,
  visitor_id INTEGER NOT NULL,
  visitor_pass_number TEXT NOT NULL,
  visitor_pass_qr_value TEXT NOT NULL,
  pass_return_status TEXT NOT NULL,
  FOREIGN KEY (visitor_id) REFERENCES visitors (visitor_id)
);

CREATE TABLE IF NOT EXISTS face_verifications (
  verification_id INTEGER PRIMARY KEY AUTOINCREMENT,
  visitor_id INTEGER NOT NULL,
  log_id INTEGER NOT NULL,
  face_verification_status TEXT NOT NULL,
  verification_notes TEXT,
  verified_at TEXT,
  FOREIGN KEY (visitor_id) REFERENCES visitors (visitor_id),
  FOREIGN KEY (log_id) REFERENCES visitor_logs (log_id)
);
`;

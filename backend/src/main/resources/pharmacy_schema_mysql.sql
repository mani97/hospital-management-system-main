-- =====================================================================
-- Pharmacy module schema (MySQL 8). Hibernate (ddl-auto=update) creates
-- these automatically; use this script for manual provisioning.
-- Assumes existing tables patient_tbl and doctor_tbl (id BIGINT).
-- =====================================================================
CREATE TABLE IF NOT EXISTS medicines (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  medicine_name VARCHAR(100)   NOT NULL,
  category      VARCHAR(50)    NOT NULL,
  manufacturer  VARCHAR(100)   NOT NULL,
  batch_number  VARCHAR(50)    NOT NULL UNIQUE,
  expiry_date   DATE           NOT NULL,
  quantity      INT            NOT NULL CHECK (quantity >= 0),
  price         DECIMAL(10,2)  NOT NULL CHECK (price > 0),
  created_date  DATETIME       DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_med_name (medicine_name),
  INDEX idx_med_expiry (expiry_date)
);

CREATE TABLE IF NOT EXISTS prescriptions (
  id                BIGINT AUTO_INCREMENT PRIMARY KEY,
  doctor_id         BIGINT      NOT NULL,
  patient_id        BIGINT      NOT NULL,
  prescription_date DATE        NOT NULL,
  notes             VARCHAR(500),
  status            VARCHAR(20) DEFAULT 'PENDING',
  FOREIGN KEY (doctor_id)  REFERENCES doctor_tbl(id),
  FOREIGN KEY (patient_id) REFERENCES patient_tbl(id)
);

CREATE TABLE IF NOT EXISTS prescription_items (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  prescription_id BIGINT       NOT NULL,
  medicine_id     BIGINT       NOT NULL,
  quantity        INT          NOT NULL CHECK (quantity >= 1),
  dosage          VARCHAR(200) NOT NULL,
  duration_days   INT,
  FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE,
  FOREIGN KEY (medicine_id)     REFERENCES medicines(id)
);

CREATE TABLE IF NOT EXISTS pharmacy_bills (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  patient_id      BIGINT        NOT NULL,
  prescription_id BIGINT,
  subtotal        DECIMAL(10,2) DEFAULT 0,
  tax_percent     DECIMAL(5,2)  DEFAULT 0,
  tax_amount      DECIMAL(10,2) DEFAULT 0,
  total_amount    DECIMAL(10,2) DEFAULT 0,
  payment_status  VARCHAR(20)   DEFAULT 'PENDING',
  payment_mode    VARCHAR(20),
  bill_date       DATETIME      DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id)      REFERENCES patient_tbl(id),
  FOREIGN KEY (prescription_id) REFERENCES prescriptions(id)
);

CREATE TABLE IF NOT EXISTS bill_items (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  bill_id     BIGINT        NOT NULL,
  medicine_id BIGINT        NOT NULL,
  quantity    INT           NOT NULL,
  unit_price  DECIMAL(10,2),
  line_total  DECIMAL(10,2),
  FOREIGN KEY (bill_id)     REFERENCES pharmacy_bills(id) ON DELETE CASCADE,
  FOREIGN KEY (medicine_id) REFERENCES medicines(id)
);

-- ---------------------------- Sample data ----------------------------
INSERT INTO medicines (medicine_name, category, manufacturer, batch_number, expiry_date, quantity, price) VALUES
('Paracetamol 500mg', 'Analgesic',     'Cipla',        'PCM-2026-001', '2027-12-31', 200, 2.50),
('Amoxicillin 250mg', 'Antibiotic',    'Sun Pharma',   'AMX-2026-014', '2027-06-30',  80, 8.75),
('Cetirizine 10mg',   'Antihistamine', 'Dr. Reddys',   'CTZ-2026-032', '2027-03-31',   8, 3.20),
('Metformin 500mg',   'Antidiabetic',  'Lupin',        'MET-2026-007', '2027-09-30', 150, 4.10),
('Omeprazole 20mg',   'Antacid',       'Zydus',        'OMP-2026-021', '2026-12-05',  45, 6.00),
('Ibuprofen 400mg',   'Analgesic',     'Abbott',       'IBU-2026-044', '2027-01-31',   5, 5.25);


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
('Paracetamol 500mg','General','Cipla','GEN-001','2028-12-31',496,2.50),
('Cetirizine 10mg','General','Sun Pharma','GEN-002','2028-11-30',420,3.50),
('Pantoprazole 40mg','General','Alkem','GEN-003','2028-10-31',350,5.75),
('Dolo 650mg','General','Mankind','GEN-004','2028-09-30',600,4.50),
('Vitamin C Tablet','General','Cipla','GEN-005','2028-12-31',450,2.25),
('Crocin Advance','General','Abbott','GEN-006','2028-12-31',500,3.25),
('Levocetirizine 5mg','General','Zydus','GEN-007','2028-08-31',430,3.00),
('Calcium Tablet','General','Lupin','GEN-008','2028-09-30',250,6.50),
('Multivitamin','General','Torrent','GEN-009','2028-12-31',350,4.75),
('Iron Tablet','General','Dr Reddys','GEN-010','2028-11-30',320,5.25),
('Atorvastatin 10mg','Cardiac','Torrent','CAR-001','2028-12-31',300,12.50),
('Clopidogrel 75mg','Cardiac','Lupin','CAR-002','2028-12-31',250,10.50),
('Aspirin 75mg','Cardiac','Cipla','CAR-003','2028-09-30',500,2.50),
('Rosuvastatin 10mg','Cardiac','Sun Pharma','CAR-004','2028-10-31',200,15.50),
('Nicorandil 5mg','Cardiac','Abbott','CAR-005','2028-08-31',220,13.25),
('Bisoprolol 5mg','Cardiac','Alkem','CAR-006','2028-12-31',280,8.50),
('Ivabradine 5mg','Cardiac','Mankind','CAR-007','2028-11-30',180,18.25),
('Ramipril 5mg','Cardiac','Lupin','CAR-008','2028-12-31',220,9.25),
('Carvedilol 6.25mg','Cardiac','Torrent','CAR-009','2028-12-31',260,7.75),
('Isosorbide Mononitrate','Cardiac','Cipla','CAR-010','2028-10-31',180,11.00),
('Metformin 500mg','Diabetic','USV','DIA-001','2028-12-31',600,5.50),
('Glimepiride 2mg','Diabetic','Sun Pharma','DIA-002','2028-12-31',450,7.25),
('Voglibose 0.3mg','Diabetic','Lupin','DIA-003','2028-09-30',250,10.50),
('Teneligliptin 20mg','Diabetic','Torrent','DIA-004','2028-08-31',220,16.25),
('Sitagliptin 50mg','Diabetic','Cipla','DIA-005','2028-11-30',190,24.50),
('Empagliflozin 10mg','Diabetic','Mankind','DIA-006','2028-12-31',200,28.75),
('Pioglitazone 15mg','Diabetic','Dr Reddys','DIA-007','2028-09-30',300,7.75),
('Gliclazide MR','Diabetic','Alkem','DIA-008','2028-10-31',240,11.20),
('Linagliptin 5mg','Diabetic','Abbott','DIA-009','2028-12-31',180,22.50),
('Metformin SR 1000mg','Diabetic','Lupin','DIA-010','2028-11-30',350,9.90);

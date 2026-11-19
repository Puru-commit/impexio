-- Run this ONCE on the "impexio" database (click impexio in the left list first).
CREATE TABLE IF NOT EXISTS payments (
  id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id             BIGINT UNSIGNED NOT NULL,
  razorpay_order_id   VARCHAR(80) NOT NULL,
  razorpay_payment_id VARCHAR(80) NULL,
  amount_paise        INT UNSIGNED NOT NULL,
  currency            CHAR(3) NOT NULL DEFAULT 'INR',
  status              ENUM('created','paid') NOT NULL DEFAULT 'created',
  created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  paid_at             DATETIME NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_payments_order (razorpay_order_id),
  KEY idx_payments_user (user_id),
  CONSTRAINT fk_payments_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

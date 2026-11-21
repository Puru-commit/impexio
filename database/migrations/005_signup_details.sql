-- Run this ONCE on the "impexio" database (click impexio in the left list first).
CREATE TABLE IF NOT EXISTS user_onboarding (
  user_id       BIGINT UNSIGNED NOT NULL,
  full_name     VARCHAR(120) NULL,
  company_name  VARCHAR(255) NULL,
  trade_type    VARCHAR(20)  NULL,
  business_type VARCHAR(40)  NULL,
  main_product  VARCHAR(160) NULL,
  phone         VARCHAR(40)  NULL,
  iec_code      VARCHAR(30)  NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  CONSTRAINT fk_onboarding_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

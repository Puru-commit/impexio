-- IMPEXIO database. Works on MySQL 8 and MariaDB (Hostinger).
-- Run this once on an empty database named "impexio".

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS users (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  google_id     VARCHAR(64)  NOT NULL,
  email         VARCHAR(255) NOT NULL,
  name          VARCHAR(255) NULL,
  image_url     VARCHAR(500) NULL,
  role          ENUM('user','admin') NOT NULL DEFAULT 'user',
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_google (google_id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- One company profile per user, reused on every document.
CREATE TABLE IF NOT EXISTS companies (
  id                BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id           BIGINT UNSIGNED NOT NULL,
  company_name      VARCHAR(255) NULL,
  address           VARCHAR(500) NULL,
  city              VARCHAR(120) NULL,
  state             VARCHAR(120) NULL,
  country           VARCHAR(120) NULL,
  pincode           VARCHAR(20)  NULL,
  phone             VARCHAR(40)  NULL,
  email             VARCHAR(255) NULL,
  website           VARCHAR(255) NULL,
  gstin             VARCHAR(30)  NULL,
  iec_code          VARCHAR(30)  NULL,
  pan               VARCHAR(20)  NULL,
  bank_name         VARCHAR(255) NULL,
  bank_account_name VARCHAR(255) NULL,
  bank_account_no   VARCHAR(60)  NULL,
  bank_ifsc         VARCHAR(30)  NULL,
  bank_swift        VARCHAR(30)  NULL,
  updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_companies_user (user_id),
  CONSTRAINT fk_companies_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Every document and costing sheet. doc_type is the tool slug,
-- for example "export-proforma-invoice". The form values live in data.
CREATE TABLE IF NOT EXISTS documents (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    BIGINT UNSIGNED NOT NULL,
  doc_type   VARCHAR(80)  NOT NULL,
  title      VARCHAR(255) NOT NULL DEFAULT 'Untitled',
  status     ENUM('draft','final') NOT NULL DEFAULT 'draft',
  data       LONGTEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_documents_user_type (user_id, doc_type),
  KEY idx_documents_user_updated (user_id, updated_at),
  CONSTRAINT fk_documents_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Buyers and suppliers (the light EXIM CRM).
CREATE TABLE IF NOT EXISTS contacts (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id          BIGINT UNSIGNED NOT NULL,
  kind             ENUM('buyer','supplier') NOT NULL,
  name             VARCHAR(255) NOT NULL,
  company          VARCHAR(255) NULL,
  email            VARCHAR(255) NULL,
  phone            VARCHAR(40)  NULL,
  country          VARCHAR(120) NULL,
  notes            TEXT NULL,
  next_followup_at DATE NULL,
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_contacts_user_kind (user_id, kind),
  KEY idx_contacts_followup (user_id, next_followup_at),
  CONSTRAINT fk_contacts_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Plan and free-trial usage. The server checks this, never the browser.
CREATE TABLE IF NOT EXISTS subscriptions (
  id                       BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id                  BIGINT UNSIGNED NOT NULL,
  status                   ENUM('free','active','cancelled','expired') NOT NULL DEFAULT 'free',
  free_docs_used           SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  razorpay_customer_id     VARCHAR(80) NULL,
  razorpay_subscription_id VARCHAR(80) NULL,
  current_period_end       DATETIME NULL,
  created_at               TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at               TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_subscriptions_user (user_id),
  CONSTRAINT fk_subscriptions_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- HS code reference data (you import your own data into this later).
CREATE TABLE IF NOT EXISTS hs_codes (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  code        VARCHAR(16)  NOT NULL,
  description TEXT NOT NULL,
  chapter     VARCHAR(4) NULL,
  PRIMARY KEY (id),
  KEY idx_hs_code (code),
  KEY idx_hs_chapter (chapter),
  FULLTEXT KEY ft_hs_description (description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

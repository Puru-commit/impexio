-- Run this ONCE on the "impexio" database (after schema.sql).

-- 1. Master profile: details you fill in once and reuse on every document.
ALTER TABLE companies
  ADD COLUMN branch                VARCHAR(120) NULL AFTER company_name,
  ADD COLUMN location              VARCHAR(120) NULL AFTER branch,
  ADD COLUMN day_book              VARCHAR(80)  NULL AFTER location,
  ADD COLUMN prepared_by           VARCHAR(120) NULL,
  ADD COLUMN default_currency      VARCHAR(3)   NULL,
  ADD COLUMN default_incoterm      VARCHAR(4)   NULL,
  ADD COLUMN default_port_loading  VARCHAR(120) NULL,
  ADD COLUMN default_payment_terms VARCHAR(300) NULL;

-- 2. Numbered documents (PI-2026-0001) and a Cancelled status.
ALTER TABLE documents
  ADD COLUMN ref_no VARCHAR(40) NULL AFTER doc_type,
  MODIFY COLUMN status ENUM('draft','final','cancelled') NOT NULL DEFAULT 'draft',
  ADD UNIQUE KEY uq_documents_ref (user_id, doc_type, ref_no);

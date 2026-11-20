-- Run this ONCE on the "impexio" database, BEFORE loading the HS code data.
ALTER TABLE hs_codes
  ADD COLUMN level   TINYINT UNSIGNED NOT NULL DEFAULT 8 AFTER chapter,
  ADD COLUMN heading VARCHAR(600) NULL AFTER level,
  ADD COLUMN context VARCHAR(600) NULL AFTER heading;

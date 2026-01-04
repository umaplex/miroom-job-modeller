-- DANGER: This script will delete ALL Organization Data.
-- It resets the application to a blank slate (except for Pillar Configs).

BEGIN;

-- 1. Truncate Organizations with CASCADE
-- This deletes the root records and anything with ON DELETE CASCADE foreign keys
TRUNCATE TABLE organizations CASCADE;

-- 2. Explicitly Truncate Child Tables with CASCADE to handle any missing FK cascades
-- (Using CASCADE here ensures grandchildren like org_field_evidence are also wiped)
TRUNCATE TABLE research_audit_logs CASCADE;
TRUNCATE TABLE prep_logs CASCADE;
TRUNCATE TABLE org_pillar_status CASCADE;
TRUNCATE TABLE org_pillar_data CASCADE;
TRUNCATE TABLE org_field_observations CASCADE;
TRUNCATE TABLE org_field_evidence CASCADE; -- Added this table

COMMIT;

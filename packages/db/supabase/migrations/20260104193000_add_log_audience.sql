-- Add audience level to logs for filtering (User vs Admin/Debug)
ALTER TABLE prep_logs 
ADD COLUMN IF NOT EXISTS audience TEXT DEFAULT 'USER';

-- Optional: Add check constraint if we want strict types, but text is fine for MVP
-- CHECK (audience IN ('USER', 'ADMIN', 'DEBUG'));

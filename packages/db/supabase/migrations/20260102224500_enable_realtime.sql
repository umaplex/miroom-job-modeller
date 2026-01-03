-- Enable Realtime for relevant tables
BEGIN;
  -- Check if publication exists (standard in Supabase) and add tables
  -- We wrap in dynamic SQL or just assume standard setup. 
  -- Supabase 'supabase_realtime' publication usually exists.
  
  ALTER PUBLICATION supabase_realtime ADD TABLE org_pillar_status;
  ALTER PUBLICATION supabase_realtime ADD TABLE prep_logs;
  
COMMIT;

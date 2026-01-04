from supabase import Client
from app.core.llm_factory import ModelFactory, ModelProvider
import asyncio

class PrepEngine:
    def __init__(self, supabase_client: Client):
        self.supabase = supabase_client

    async def trigger_prep_workflow(self, org_id: str):
        """
        Orchestrator:
        1. Fetch active pillars
        2. Initialize org_pillar_status rows
        3. Trigger workers for each pillar
        """
        # 1. Fetch Pillars (mock for MVP 1 Part 1 if table empty, assuming db migration populated some)
        # For now, let's assume we have at least one pillar or we default to a hardcoded list if empty
        pillars = self.supabase.table("pillar_definitions").select("*").execute()
        
        active_pillars = pillars.data
        if not active_pillars:
            # Fallback for MVP if no pillars defined yet
            active_pillars = [{"id": "econ_engine", "name": "Economic Engine"}]

        # 2. Init Status
        for p in active_pillars:
            try:
                self.supabase.table("org_pillar_status").upsert({
                    "org_id": org_id,
                    "pillar_id": p['id'],
                    "status": "PENDING"
                }).execute()
            except:
                pass

        # 3. Trigger Workers (In a real queue, this would be dispatch. Here we just run sequential or gather)
        # We will let the BackgroundTask caller handle the async execution, 
        # or we can do it here if we are inside the background thread.
        
        for p in active_pillars:
            await self.execute_pillar_worker(org_id, p['id'])

    async def execute_pillar_worker(self, org_id: str, pillar_id: str):
        """
        The actual 'Thinking' worker.
        Now delegated to the Research OS Analyst.
        """
        def log(msg, code="INFO"):
            # Print to console for immediate visibility
            print(f"[PrepEngine] [{code}] {msg}")
            try:
                self.supabase.table("prep_logs").insert({
                    "org_id": org_id,
                    "pillar_id": pillar_id,
                    "internal_code": code,
                    "display_text": msg
                }).execute()
            except Exception as e:
                print(f"Log Error: {e}")

        try:
            # 1. Fetch Context
            log(f"Initializing Research OS for {pillar_id}...", "WORKER_START")
            
            # Fetch Org Data
            org_res = self.supabase.table("organizations").select("*").eq("id", org_id).single().execute()
            org = org_res.data
            
            # Fetch Pillar Config
            # Note: We need the full config including strategies
            pillar_res = self.supabase.table("pillar_definitions").select("*").eq("id", pillar_id).single().execute()
            pillar_def = pillar_res.data

            # 2. Update Status -> SEARCHING
            self.supabase.table("org_pillar_status").update({"status": "SEARCHING"}).eq("org_id", org_id).eq("pillar_id", pillar_id).execute()

            # 3. Dispatch to Analyst (Strategy Pattern)
            # Future: Check 'agent_version' in request or config to swap classes
            from app.research_engine.standard_analyst import StandardAnalyst
            
            analyst = StandardAnalyst(self.supabase, org, pillar_def)
            await analyst.run()
            
            # 4. Finalize
            self.supabase.table("org_pillar_status").update({"status": "COMPLETED"}).eq("org_id", org_id).eq("pillar_id", pillar_id).execute()
            log("Pillar analysis complete.", "WORKER_DONE")

        except Exception as e:
            log(f"Worker Failed: {str(e)}", "ERROR")
            self.supabase.table("org_pillar_status").update({"status": "FAILED"}).eq("org_id", org_id).eq("pillar_id", pillar_id).execute()


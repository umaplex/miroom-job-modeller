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
        """
        def log(msg, code="INFO"):
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
            # Update Status -> SEARCHING
            self.supabase.table("org_pillar_status").update({"status": "SEARCHING"}).eq("org_id", org_id).eq("pillar_id", pillar_id).execute()
            log(f"Starting research for {pillar_id}...", "WORKER_START")

            # Simulate Tavily Search (Placeholder for Part 2)
            await asyncio.sleep(2) # Fake latency
            log("Querying financial databases...", "SEARCH_EXEC")
            
            # Update Status -> SYNTHESIZING
            self.supabase.table("org_pillar_status").update({"status": "SYNTHESIZING"}).eq("org_id", org_id).eq("pillar_id", pillar_id).execute()
            
            # Simulate LLM
            llm = ModelFactory.get_model(ModelProvider.OPENAI)
            # prompt = ... (Load from pillar config)
            # resp = llm.invoke(...)
            await asyncio.sleep(2) # Fake latency
            log("Synthesizing insights...", "LLM_REASONING")

            # Finalize
            # Finalize
            if pillar_id == 'general':
                mock_content = {
                    "summary": "General Vital Signs Analysis",
                    "metrics": {
                        "headcount_velocity": "+15% YoY",
                        "talent_density": "High (ex-Google, Stripe)",
                        "leadership_stability": "Stable (CEO 4y)"
                    }
                }
            else:
                mock_content = {
                    "summary": f"This is a generated insight for {pillar_id}.",
                    "metrics": {"av_revenue": "$100M"}
                }
            
            self.supabase.table("org_pillar_data").upsert({
                "org_id": org_id, 
                "pillar_id": pillar_id,
                "content": mock_content,
                "version": 1
            }, on_conflict="org_id, pillar_id, version").execute()

            self.supabase.table("org_pillar_status").update({"status": "COMPLETED"}).eq("org_id", org_id).eq("pillar_id", pillar_id).execute()
            log("Pillar analysis complete.", "WORKER_DONE")

        except Exception as e:
            log(f"Worker Failed: {str(e)}", "ERROR")
            self.supabase.table("org_pillar_status").update({"status": "FAILED"}).eq("org_id", org_id).eq("pillar_id", pillar_id).execute()

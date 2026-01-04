import uuid
from abc import ABC, abstractmethod
from datetime import datetime
from supabase import Client
import logging

logger = logging.getLogger("research_engine")

class BaseAnalyst(ABC):
    """
    Abstract Base Class for all Research Analyst Personas.
    Enforces the 'Knowledge Factory' pipeline and handles audit logging.
    """

    def __init__(self, supabase: Client, org: dict, pillar_def: dict, run_id: str = None):
        self.supabase = supabase
        self.org = org
        self.pillar = pillar_def
        self.run_id = run_id or str(uuid.uuid4())
        self.agent_version = self.__class__.__name__

    @abstractmethod
    async def run(self):
        """
        The main execution entry point.
        Must implement the specific pipeline (Query -> Search -> Scrape -> Synthesis).
        """
        pass

    def log_audit(self, step_type: str, input_context: dict, output_result: dict = None, 
                  provider: str = None, model: str = None, 
                  tokens_in: int = 0, tokens_out: int = 0, cost_usd: float = 0.0, latency_ms: int = 0):
        """
        Writes to research_audit_logs table.
        """
        # Print to console for debugging
        print(f"[{self.agent_version}] [{step_type}] Prov: {provider} | Mod: {model} | Lat: {latency_ms}ms")
        if step_type == "ERROR":
             print(f"[{self.agent_version}] ERROR MAP: {input_context}")

        try:
            payload = {
                "org_id": self.org['id'],
                "pillar_id": self.pillar['id'],
                "run_id": self.run_id,
                "agent_version": self.agent_version,
                "step_type": step_type,
                "input_context": input_context,
                "output_result": output_result,
                "provider": provider,
                "model": model,
                "tokens_in": tokens_in,
                "tokens_out": tokens_out,
                "cost_usd": cost_usd,
                "latency_ms": latency_ms
            }
            self.supabase.table("research_audit_logs").insert(payload).execute()
        except Exception as e:
            logger.error(f"Failed to write audit log: {e}")

    async def get_field_definitions(self):
        """Helper to fetch rubric for this pillar"""

        
        # We need to find dimensions first
        dims = self.supabase.table("dimension_definitions").select("id").eq("pillar_id", self.pillar['id']).execute()
        dim_ids = [d['id'] for d in dims.data]
        
        if not dim_ids:
            return []
            
        fields = self.supabase.table("field_definitions").select("*").in_("dimension_id", dim_ids).execute()
        return fields.data

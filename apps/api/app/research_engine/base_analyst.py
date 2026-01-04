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
                  tokens_in: int = 0, tokens_out: int = 0, cost_usd: float = 0.0, latency_ms: int = 0,
                  audience: str = "USER"):
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

            # --- DUAL LOGGING: Write to prep_logs for "Neural Feed" UI ---
            # Define human-friendly messages for key steps
            user_msg = None
            audience = "ADMIN" # Default to hidden
            
            if step_type == "QUERY_GEN":
                user_msg = f"Generated search strategies based on {self.pillar['name']} rubric."
                audience = "USER"
            elif step_type == "SEARCH":
                query_count = len(output_result.get('urls', [])) if output_result else 0
                user_msg = f"Deep Search via {provider}: Found {query_count} relevant sources."
                audience = "USER"
            elif step_type == "SCRAPE":
                bytes_len = output_result.get('bytes', 0) if output_result else 0
                user_msg = f"Reading & Extracting content from {len(input_context.get('urls', []))} pages ({bytes_len} bytes)."
                audience = "USER"
            elif step_type == "SYNTHESIS":
                count = output_result.get('count', 0) if output_result else 0
                user_msg = f"Synthesizing {count} data points using {model}."
                audience = "USER"
            elif step_type == "ERROR":
                user_msg = f"Error in {input_context.get('step', 'process')}: {input_context.get('error', 'unknown error')}"
                audience = "ADMIN" # Users see "Failed", Admins see details

            if user_msg:
                 self.supabase.table("prep_logs").insert({
                    "org_id": self.org['id'],
                    "pillar_id": self.pillar['id'],
                    "internal_code": step_type,
                    "display_text": user_msg,
                    "audience": audience
                }).execute()

            # --- DEBUG LOGGING (ADMIN ONLY) ---
            # Comprehensive audit trial: Log hits AND misses
            debug_msg = None
            if step_type == "QUERY_GEN":
                 queries = input_context.get('queries', []) or output_result.get('queries', [])
                 if queries:
                     debug_msg = f"DEBUG: Generated {len(queries)} queries: {str(queries)}"
                 else:
                     debug_msg = "DEBUG: WARNING - No queries were generated. Discovery phase effectively skipped."

            elif step_type == "SEARCH":
                 urls = output_result.get('urls', [])
                 if urls:
                     debug_msg = f"DEBUG: Search successful. Found {len(urls)} sources: {str(urls)}"
                 else:
                     debug_msg = "DEBUG: WARNING - Search returned 0 URLs. No external evidence found."

            elif step_type == "SCRAPE":
                 bytes_len = output_result.get('bytes', 0) if output_result else 0
                 urls_count = len(input_context.get('urls', []))
                 if bytes_len > 0:
                     debug_msg = f"DEBUG: Scraped {urls_count} pages successfully. Total content: {bytes_len} chars."
                 else:
                     debug_msg = f"DEBUG: WARNING - Scrape of {urls_count} pages yielded 0 bytes of content."

            elif step_type == "SYNTHESIS":
                 count = output_result.get('count', 0) if output_result else 0
                 if count > 0:
                     debug_msg = f"DEBUG: Synthesis produced {count} observations."
                 else:
                     debug_msg = "DEBUG: WARNING - Synthesis loop produced 0 observations. LLM likely found no matching data in context."

            if debug_msg:
                 self.supabase.table("prep_logs").insert({
                    "org_id": self.org['id'],
                    "pillar_id": self.pillar['id'],
                    "internal_code": "DEBUG",
                    "display_text": debug_msg,
                    "audience": "ADMIN"
                }).execute()
                
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

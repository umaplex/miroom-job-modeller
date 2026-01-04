from .base_analyst import BaseAnalyst
import time
import json
import asyncio
from typing import List, Dict, Any
from tavily import TavilyClient
from firecrawl import FirecrawlApp
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from app.core.config import get_settings
from app.core.llm_factory import ModelFactory, ModelProvider

settings = get_settings()

class StandardAnalyst(BaseAnalyst):
    """
    The V1 'Standard' Analyst.
    Uses Tavily for discovery and Firecrawl for scraping.
    """

    async def run(self):
        print(f"[StandardAnalyst] Starting run for Pillar: {self.pillar.get('name')} (ID: {self.pillar['id']})")
        start_time = time.time()
        
        # Verify Keys
        if not settings.OPENAI_API_KEY:
            print("[StandardAnalyst] CRITICAL: OPENAI_API_KEY is missing.")
            self.log_audit("ERROR", {"message": "OPENAI_API_KEY missing"})
            return

        # 1. Fetch Rubric
        fields = await self.get_field_definitions()
        if not fields:
            print("[StandardAnalyst] ERROR: No fields definition found.")
            self.log_audit("ERROR", {"message": "No fields definition found for this pillar"})
            return

        # 2. Query Generation (Step A: Hunter)
        queries = await self.generate_queries(fields)
        if not queries:
            # Fallback strategy if generation fails
            queries = [f"{self.org['name']} {self.pillar.get('search_strategy_prompt', 'business model')}"]
        
        # 3. Discovery & Extraction (Step B: Clerk)
        evidence_content, evidence_metadata = await self.gather_evidence(queries)
        
        # 4. Synthesis (Step C: Director)
        if not evidence_content:
            evidence_content = "No external evidence found. Rely on internal knowledge."
            
        observations = await self.synthesize(fields, evidence_content, evidence_metadata)
        
        # 5. Persist
        await self.persist_results(observations)
        
        total_latency = int((time.time() - start_time) * 1000)
        self.log_audit("COMPLETE", {"status": "success"}, {"count": len(observations)}, latency_ms=total_latency)

    async def generate_queries(self, fields) -> List[str]:
        """
        Uses LLM + Pillar Strategy to generate search queries.
        """
        strategy = self.pillar.get('search_strategy_prompt', 'Find general info')
        target = f"{self.org['name']} ({self.org.get('domain', '')})"
        
        system_prompt = (
            "You are a Research Analyst. Generate 3 specific search queries to find information "
            f"about the '{self.pillar['name']}' for the organization '{target}'.\n"
            f"Strategy: {strategy}\n"
            "Return ONLY a JSON array of strings, e.g. [\"query1\", \"query2\"]"
        )
        
        try:
            llm = ModelFactory.get_configured_model(settings.DEFAULT_QUERY_MODEL)
            response = llm.invoke(system_prompt)
            content = response.content.replace("```json", "").replace("```", "").strip()
            queries = json.loads(content)
            
            self.log_audit("QUERY_GEN", {"strategy": strategy}, {"queries": queries}, model=settings.DEFAULT_QUERY_MODEL)
            return queries[:5]
        except Exception as e:
            self.log_audit("ERROR", {"step": "QUERY_GEN", "error": str(e)})
            return []

    async def gather_evidence(self, queries: List[str]):
        """
        Executes Search (Tavily) + Scrape (Firecrawl).
        Returns (combined_markdown, metadata_list)
        """
        combined_markdown = ""
        all_metadata = []
        
        # A. DISCOVERY (Tavily)
        urls_to_scrape = []
        try:
            if settings.TAVILY_API_KEY:
                tavily = TavilyClient(api_key=settings.TAVILY_API_KEY)
                for q in queries[:2]:
                    resp = tavily.search(query=q, search_depth="basic", max_results=2)
                    for result in resp.get('results', []):
                        urls_to_scrape.append(result['url'])
                
                urls_to_scrape = list(set(urls_to_scrape))
                self.log_audit("SEARCH", {"queries": queries[:2]}, {"urls": urls_to_scrape}, provider="tavily")
            else:
                self.log_audit("WARNING", {"message": "TAVILY_API_KEY missing, skipping search"})
        except Exception as e:
             self.log_audit("ERROR", {"step": "SEARCH", "error": str(e)})

        # B. EXTRACTION (Firecrawl)
        if not settings.FIRECRAWL_API_KEY:
             self.log_audit("WARNING", {"message": "FIRECRAWL_API_KEY missing, skipping scrape"})
             return "", []

        firecrawl = FirecrawlApp(api_key=settings.FIRECRAWL_API_KEY)
        
        for url in urls_to_scrape[:3]: 
            try:
                scrape_res = firecrawl.scrape_url(url, params={'formats': ['markdown']})
                markdown = scrape_res.get('markdown', '')
                
                if markdown:
                    combined_markdown += f"\n\n--- SOURCE: {url} ---\n{markdown[:8000]}" 
                    all_metadata.append({"url": url, "source": "web"})
            except Exception as e:
                self.log_audit("ERROR", {"step": "SCRAPE", "url": url, "error": str(e)})

        self.log_audit("SCRAPE", {"urls": urls_to_scrape}, {"bytes": len(combined_markdown)}, provider="firecrawl")
        return combined_markdown, all_metadata

    async def synthesize(self, fields: List[Dict], evidence: str, metadata: List[Dict]):
        """
        Generates structured observations.
        """
        observations = []
        
        field_instructions = []
        for f in fields:
            field_instructions.append(f"{f['key']}: {f.get('rubric_prompt', 'Extract relevant info')}")
        
        system_prompt = (
            f"You are a Senior Analyst analyzing '{self.org['name']}' for the '{self.pillar['name']}' pillar.\n"
            "Analyze the provided Text Context and extract structured data for the following fields.\n\n"
            "FIELDS TO FILL:\n" + "\n".join(field_instructions) + "\n\n"
            "OUTPUT FORMAT:\n"
            "Return a JSON Object where keys are field_keys (e.g. 'gtm_motion') and values are objects with:\n"
            "  - 'value': The structured answer (string/enum)\n"
            "  - 'analysis': A markdown analysis (< 50 words)\n"
            "  - 'confidence': 0.0 to 1.0\n"
            "  - 'quote': A direct quote from the text supporting this\n"
            "If no info found, return null for that key."
        )
        
        try:
            llm = ModelFactory.get_configured_model(settings.DEFAULT_SYNTHESIS_MODEL)
            response = llm.invoke([
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"CONTEXT DATA:\n{evidence}"}
            ])
            
            content = response.content.replace("```json", "").replace("```", "").strip()
            data = json.loads(content)
            
            for f in fields:
                key = f['key']
                if key in data and data[key]:
                    item = data[key]
                    observations.append({
                        "org_id": self.org['id'],
                        "field_id": f['id'],
                        "structured_value": {"value": item.get("value")},
                        "analysis_markdown": item.get("analysis"),
                        "confidence_score": item.get("confidence", 0.5),
                        "evidence": metadata if metadata else [],
                        "is_synthetic": False
                    })
            
            self.log_audit("SYNTHESIS", {"model": settings.DEFAULT_SYNTHESIS_MODEL}, {"count": len(observations)}, model=settings.DEFAULT_SYNTHESIS_MODEL)
            return observations
            
        except Exception as e:
            self.log_audit("ERROR", {"step": "SYNTHESIS", "error": str(e)})
            return []

    async def persist_results(self, observations):
        if not observations:
            return

        for obs in observations:
            try:
                existing = self.supabase.table("org_field_observations")\
                    .select("id")\
                    .eq("org_id", obs['org_id'])\
                    .eq("field_id", obs['field_id'])\
                    .execute()
                
                if existing.data:
                    obs['id'] = existing.data[0]['id']
                    self.supabase.table("org_field_observations").update(obs).eq("id", obs['id']).execute()
                else:
                    self.supabase.table("org_field_observations").insert(obs).execute()
                    
            except Exception as e:
                self.log_audit("ERROR", {"step": "PERSIST", "field": obs.get('field_id'), "error": str(e)})

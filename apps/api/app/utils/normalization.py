from pydantic import BaseModel

class NormalizationResult(BaseModel):
    display_name: str
    domain: str
    cleaned_url: str

async def normalize_org_identity(raw_input: str) -> NormalizationResult:
    """
    Uses LLM (or simple heuristic for MVP) to normalize input.
    e.g. "https://www.pagerduty.com/pricing" -> "PagerDuty", "pagerduty.com"
    """
    # MVP 0.5 Implementation: Simple Heuristics (to avoid LLM cost/latency loop for now)
    # In full MVP 1, we will connect this to the LLM Factory.
    
    clean = raw_input.lower().replace("https://", "").replace("http://", "").replace("www.", "")
    domain_part = clean.split("/")[0]
    
    # Simple capitalization strategy for MVP
    name_guess = domain_part.split(".")[0].capitalize()
    
    return NormalizationResult(
        display_name=name_guess,
        domain=domain_part,
        cleaned_url=f"https://{domain_part}"
    )

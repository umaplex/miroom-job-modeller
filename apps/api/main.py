from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends, Header
from pydantic import BaseModel
from typing import Optional
from supabase import create_client, Client
from app.core.config import get_settings
from app.services.org_service import OrgService
from app.services.prep_engine import PrepEngine

settings = get_settings()
app = FastAPI(title="Job Modeller API (MVP 1)")

from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Core Dependencies
def get_supabase() -> Client:
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

def get_org_service(sb: Client = Depends(get_supabase)) -> OrgService:
    return OrgService(sb)

def get_prep_engine(sb: Client = Depends(get_supabase)) -> PrepEngine:
    return PrepEngine(sb)

# Schemas
class IngestRequest(BaseModel):
    url: str
    user_id: str # Sent from frontend (extracted from auth session there)

# Endpoints

@app.get("/health")
def health_check():
    return {"status": "ok", "version": "mvp1.0"}

@app.post("/orgs/ingest")
async def ingest_org_endpoint(
    req: IngestRequest, 
    background_tasks: BackgroundTasks,
    org_service: OrgService = Depends(get_org_service),
    prep_engine: PrepEngine = Depends(get_prep_engine)
):
    try:
        # 1. Ingest (Sync)
        result = await org_service.ingest_org(req.url, req.user_id)
        
        # 2. Trigger Prep if new or re-requested
        # For simple MVP, we always trigger prep check logic
        background_tasks.add_task(prep_engine.trigger_prep_workflow, result["org_id"])
        
        return result
    except Exception as e:
        print(f"Ingest Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/orgs/recents")
async def get_recents_endpoint(
    user_id: str, 
    org_service: OrgService = Depends(get_org_service)
):
    try:
        return await org_service.get_recents(user_id)
    except Exception as e:
        print(f"Recents Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/orgs/search")
async def search_orgs_endpoint(
    q: str, 
    org_service: OrgService = Depends(get_org_service)
):
    return await org_service.search_orgs(q)

@app.get("/orgs/{org_id}")
async def get_org_endpoint(
    org_id: str,
    org_service: OrgService = Depends(get_org_service)
):
    res = await org_service.get_org_details(org_id)
    if not res:
        raise HTTPException(status_code=404, detail="Org not found")
    return res

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

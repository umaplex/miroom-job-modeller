from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Job Modeller API")

class MockTrigger(BaseModel):
    url: str

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "job-modeller-api"}

@app.post("/api/trigger-mock")
def trigger_mock(payload: MockTrigger):
    return {
        "status": "triggered", 
        "message": f"Started detailed research for {payload.url}",
        "job_id": "mock_12345"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

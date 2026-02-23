from fastapi import FastAPI
from app.routes.score import router as score_router

app = FastAPI(title="MicroTrust ML Service")

app.include_router(score_router)


@app.get("/health")
def health():
    return {"status": "ok"}

from fastapi import APIRouter
from app.models.score import ScoreRequest, ScoreResponse
from pipeline.scoring_pipeline import compute_score

router = APIRouter()


@router.post("/generate-score", response_model=ScoreResponse)
def generate_score(payload: ScoreRequest):
    result = compute_score(payload.user_id, payload.features)
    return result

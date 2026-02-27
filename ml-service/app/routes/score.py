"""
MicroTrust — Score Route
========================
POST /generate-score
Accepts behavioral features, runs them through the ML scoring pipeline,
and returns a MicroTrust score with risk classification.
"""

from fastapi import APIRouter

from app.models.score import ScoreRequest, ScoreResponse
from pipeline.scoring_pipeline import score

router = APIRouter()


@router.post("/generate-score", response_model=ScoreResponse)
def generate_score(data: ScoreRequest) -> ScoreResponse:
    """
    Generate a MicroTrust score for the given user behavioral features.

    1. Validate incoming payload via ScoreRequest.
    2. Convert to plain dict for the scoring pipeline.
    3. Run through the ML pipeline (scale → predict_proba → score).
    4. Return structured ScoreResponse.
    """
    result = score(data.model_dump())
    return ScoreResponse(**result)
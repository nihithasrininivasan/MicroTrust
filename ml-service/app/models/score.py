from pydantic import BaseModel
from typing import Any, Dict


class ScoreRequest(BaseModel):
    user_id: str
    features: Dict[str, Any]


class ScoreResponse(BaseModel):
    score: float
    risk: str

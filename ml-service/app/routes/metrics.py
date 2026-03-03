"""
MicroTrust — Model Metrics Route
=================================
GET /model-metrics
Loads persisted evaluation metrics from metrics.json and returns them
as a structured JSON response.
"""

import json
import os

from fastapi import APIRouter, HTTPException

router = APIRouter()

# Path to the metrics artifact (relative to this file → ml-service/pipeline/models/)
_METRICS_PATH = os.path.join(
    os.path.dirname(__file__),  # app/routes/
    os.pardir,                  # app/
    os.pardir,                  # ml-service/
    "pipeline",
    "models",
    "metrics.json",
)


@router.get("/model-metrics")
def get_model_metrics() -> dict:
    """
    Return evaluation metrics for all trained models.

    Loads metrics.json produced by the training pipeline. If the file
    has not been generated yet (i.e. training has not been run),
    returns a clear 404 error.
    """
    resolved = os.path.normpath(_METRICS_PATH)

    if not os.path.isfile(resolved):
        raise HTTPException(
            status_code=404,
            detail=(
                "metrics.json not found. "
                "Run 'python pipeline/train_model.py' to generate evaluation metrics."
            ),
        )

    with open(resolved, "r", encoding="utf-8") as fh:
        metrics = json.load(fh)

    return metrics

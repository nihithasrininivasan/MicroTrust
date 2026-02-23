from typing import Any, Dict


def compute_score(user_id: str, features: Dict[str, Any]) -> Dict[str, Any]:
    weight_sum = sum(
        float(v) for v in features.values() if isinstance(v, (int, float))
    )
    feature_count = len(features) or 1
    raw_score = round(weight_sum / feature_count, 4)

    if raw_score >= 0.7:
        risk = "high"
    elif raw_score >= 0.4:
        risk = "medium"
    else:
        risk = "low"

    return {"score": raw_score, "risk": risk}

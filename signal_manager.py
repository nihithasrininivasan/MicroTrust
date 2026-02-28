"""
MicroTrust — Signal Manager Service (Senior Data Infra Edition)
==============================================================
Implements Versioning, Network Weighting, and Production logic.
Direct SQL implementation for maximum reliability and speed.
"""

from typing import List, Dict, Any, Optional
from database import ProductionDB
from datetime import datetime
import json
import sqlite3

class SignalManager:
    def __init__(self, db: ProductionDB):
        self.db = db

    def _get_conn(self):
        return self.db.get_connection()

    # -----------------------------------------------------------------------
    # User Management (Production-Grade Upsert)
    # -----------------------------------------------------------------------

    def sync_firebase_user(self, firebase_uid: str, **kwargs):
        conn = self._get_conn()
        cursor = conn.cursor()
        
        # Upsert Logic
        cursor.execute("SELECT id FROM users WHERE firebase_uid = ?", (firebase_uid,))
        res = cursor.fetchone()
        
        if res:
            user_id = res['id']
            # Update dynamic fields
            updates = []
            params = []
            for k, v in kwargs.items():
                if v is not None:
                    updates.append(f"{k} = ?")
                    params.append(v)
            
            if updates:
                updates.append("last_login = ?")
                params.append(datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S'))
                params.append(user_id)
                query = f"UPDATE users SET {', '.join(updates)} WHERE id = ?"
                cursor.execute(query, tuple(params))
        else:
            # Create New
            fields = ['firebase_uid'] + [k for k, v in kwargs.items() if v is not None]
            placeholders = ['?'] * len(fields)
            values = [firebase_uid] + [v for k, v in kwargs.items() if v is not None]
            query = f"INSERT INTO users ({', '.join(fields)}) VALUES ({', '.join(placeholders)})"
            cursor.execute(query, tuple(values))
            user_id = cursor.lastrowid
            
        conn.commit()
        conn.close()
        return user_id

    # -----------------------------------------------------------------------
    # Behavior Signals (Advanced Latest-Value Versioning)
    # -----------------------------------------------------------------------

    def store_behavior_signals(self, user_id: int, signals: Dict[str, float], category: str):
        conn = self._get_conn()
        cursor = conn.cursor()
        for key, value in signals.items():
            cursor.execute("""
                INSERT INTO behavior_signals (user_id, category, signal_key, signal_value)
                VALUES (?, ?, ?, ?)
            """, (user_id, category, key, value))
        conn.commit()
        conn.close()

    def get_latest_signals(self, user_id: int) -> Dict[str, float]:
        """
        PRODUCTION LOGIC: Implements versioning via Correlated Subquery.
        Ensures we only get the single most recent value per signal_key.
        """
        conn = self._get_conn()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT signal_key, signal_value
            FROM behavior_signals t1
            WHERE user_id = ? 
            AND timestamp = (
                SELECT MAX(timestamp) 
                FROM behavior_signals t2 
                WHERE t2.user_id = t1.user_id AND t2.signal_key = t1.signal_key
            )
        """, (user_id,))
        results = {row['signal_key']: row['signal_value'] for row in cursor.fetchall()}
        conn.close()
        return results

    # -----------------------------------------------------------------------
    # Community Trust (Unique Endorsements + Aggregated Weighting)
    # -----------------------------------------------------------------------

    def add_endorsement(self, source_uid: str, target_uid: str, endorsement_type: str = "peer"):
        conn = self._get_conn()
        cursor = conn.cursor()
        
        # Get IDs
        cursor.execute("SELECT id FROM users WHERE firebase_uid = ?", (source_uid,))
        endorser = cursor.fetchone()
        cursor.execute("SELECT id FROM users WHERE firebase_uid = ?", (target_uid,))
        recipient = cursor.fetchone()
        
        if not endorser or not recipient:
            conn.close()
            raise ValueError("Endorser or Recipient not found.")

        try:
            cursor.execute("""
                INSERT INTO community_trust (endorser_id, recipient_id, endorsement_type)
                VALUES (?, ?, ?)
            """, (endorser['id'], recipient['id'], endorsement_type))
            conn.commit()
        except sqlite3.IntegrityError:
            conn.close()
            raise ValueError("Endorsement already exists (Unique constraint enforcement).")
        
        conn.close()
        return True

    def get_network_trust_weight(self, user_id: int) -> float:
        """
        SENIOR LOGIC: Calculates weighted trust metrics based on endorser's own scores.
        """
        conn = self._get_conn()
        cursor = conn.cursor()
        # Find all endorsers and their LATEST microtrust score
        cursor.execute("""
            SELECT s.microtrust_score 
            FROM community_trust t
            JOIN scores s ON t.endorser_id = s.user_id
            WHERE t.recipient_id = ?
            AND s.created_at = (SELECT MAX(created_at) FROM scores s2 WHERE s2.user_id = s.user_id)
        """, (user_id,))
        
        results = cursor.fetchall()
        scores = [row['microtrust_score'] for row in results]
        conn.close()
        
        if not scores: return 0.0
        # Calculate sum of normalized weights (Score/900)
        return sum([s / 900.0 for s in scores])

    # -----------------------------------------------------------------------
    # Scoring
    # -----------------------------------------------------------------------

    def save_score(self, user_id: int, score_val: int, prob: float, shap: Dict):
        conn = self._get_conn()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO scores (user_id, microtrust_score, repayment_probability, shap_explanations)
            VALUES (?, ?, ?, ?)
        """, (user_id, score_val, prob, json.dumps(shap)))
        conn.commit()
        conn.close()

    def get_latest_score(self, user_id: int):
        conn = self._get_conn()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM scores WHERE user_id = ? ORDER BY created_at DESC LIMIT 1", (user_id,))
        res = cursor.fetchone()
        conn.close()
        return dict(res) if res else None

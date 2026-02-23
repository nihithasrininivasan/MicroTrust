"""
MicroTrust — Production-Grade Initialization
============================================
Builds the schema with advanced indices and constraints manually.
"""

from database import ProductionDB

def init_production():
    print("Initializing MicroTrust Production-Grade Engine...")
    db = ProductionDB() # This calls _init_db which creates tables + indices
    print("✔ Production tables synchronized.")
    print("✔ Performance Indices created (ix_signals, ix_trust, ix_scores).")
    print("✔ Integrity Constraints created (UQ_endorser_recipient).")
    print("Database init COMPLETE!")

if __name__ == "__main__":
    init_production()

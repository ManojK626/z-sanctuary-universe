import sys
from pathlib import Path
import json

data_dir = Path(__file__).resolve().parents[1]/"data"
file = data_dir/"challenges.json"
if not file.exists():
    print("No challenges file yet.")
    sys.exit(1)
with file.open("r", encoding="utf-8") as f:
    data = json.load(f)
print("Current Leaderboard")
for ch in data.get("challenges", []):
    print(f"Challenge {ch['id']} — {ch['title']}")
    for idx, score in enumerate(ch.get("scores", []), 1):
        print(f"  {idx}. {score['user']} — {score['value']} pts @ {score['ts']}")


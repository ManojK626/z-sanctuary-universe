from pathlib import Path
import json
import uuid
import random
from datetime import datetime

root = Path(__file__).resolve().parents[1]
data_dir = root / "data"
data_dir.mkdir(parents=True, exist_ok=True)
challenges_file = data_dir / "challenges.json"

if not challenges_file.exists():
    challenges_file.write_text(json.dumps({"challenges": []}, indent=2))

with challenges_file.open("r", encoding="utf-8") as f:
    data = json.load(f)

challenge_id = data.get("challenges", [])[0]["id"] if data.get("challenges") else "challenge-1"

if not data.get("challenges"):
    data["challenges"].append({
        "id": challenge_id,
        "title": "Flow Power Trial",
        "scores": []
    })
    challenge_id = "challenge-1"

challenge = next((ch for ch in data["challenges"] if ch["id"] == challenge_id), None)
if not challenge:
    challenge = {"id": challenge_id, "title": "Flow Power Trial", "scores": []}
    data["challenges"].append(challenge)

new_score = {
    "user": f"warrior-{uuid.uuid4().hex[:6]}",
    "value": random.randint(60, 130),
    "ts": datetime.utcnow().isoformat() + "Z"
}
challenge["scores"].append(new_score)
challenge["scores"].sort(key=lambda x: x["value"], reverse=True)
challenge["scores"] = challenge["scores"][:12]

with challenges_file.open("w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print("Created challenge entry:")
print(f"  ID: {challenge_id}")
print("Top scores:")
for idx, score in enumerate(challenge["scores"], 1):
    print(f"  {idx:>2}. {score['user']} — {score['value']} pts at {score['ts']}")

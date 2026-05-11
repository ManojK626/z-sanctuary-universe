from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
import json
import urllib.parse
from datetime import datetime
import uuid

DATA_PATH = Path(__file__).resolve().parents[1]/"data"/"challenges.json"
DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
if not DATA_PATH.exists():
    DATA_PATH.write_text(json.dumps({"challenges": []}, indent=2))

class Handler(BaseHTTPRequestHandler):
    def _load(self):
        with DATA_PATH.open("r", encoding="utf-8") as f:
            return json.load(f)

    def _save(self, data):
        with DATA_PATH.open("w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

    def _send_json(self, obj, status=200):
        raw = json.dumps(obj).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/leaderboard":
            data = self._load()
            return self._send_json(data)
        if parsed.path == "/spectator":
            data = self._load()
            total_scores = sum(score["value"] for ch in data.get("challenges", []) for score in ch.get("scores", []))
            all_scores = [score["value"] for ch in data.get("challenges", []) for score in ch.get("scores", [])]
            highest = max(all_scores) if all_scores else 0
            average = round(total_scores / len(all_scores), 2) if all_scores else 0
            return self._send_json({
                "challenge_count": len(data.get("challenges", [])),
                "score_count": len(all_scores),
                "total_score": total_scores,
                "highest_score": highest,
                "average_score": average,
            })
        return self._send_json({"error": "Unknown endpoint"}, status=404)

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length).decode("utf-8") if length else ""
        payload = json.loads(body) if body else {}
        data = self._load()
        challenge = data.get("challenges", [])
        if parsed.path == "/challenge":
            new_id = payload.get("id") or f"challenge-{len(challenge)+1}"
            data.get("challenges").append({
                "id": new_id,
                "title": payload.get("title", "Flow Power Trial"),
                "scores": []
            })
            self._save(data)
            return self._send_json({"status": "created", "id": new_id})
        if parsed.path == "/score":
            challenge_id = payload.get("challengeId", "challenge-1")
            chall = next((c for c in data.get("challenges", []) if c["id"] == challenge_id), None)
            if not chall:
                return self._send_json({"error": "challenge not found"}, status=404)
            new_score = {
                "user": payload.get("user", f"user-{uuid.uuid4().hex[:6]}") ,
                "value": int(payload.get("value", 75)),
                "ts": datetime.utcnow().isoformat() + "Z"
            }
            chall["scores"].append(new_score)
            chall["scores"].sort(key=lambda x: x["value"], reverse=True)
            chall["scores"] = chall["scores"][:12]
            self._save(data)
            return self._send_json({"status": "score saved", "score": new_score})
        if parsed.path == "/reset":
            data = {
                "challenges": [
                    {
                        "id": "challenge-1",
                        "title": "Flow Power Trial",
                        "scores": []
                    }
                ]
            }
            self._save(data)
            return self._send_json({"status": "reset", "challengeId": "challenge-1"})
        return self._send_json({"error": "Unknown POST endpoint"}, status=404)

if __name__ == "__main__":
    server = HTTPServer(("localhost", 8008), Handler)
    print("Starting Phase1 API at http://localhost:8008")
    server.serve_forever()

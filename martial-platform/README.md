# Martial Platform Skeleton

This folder contains the Phase 1 core for the martial module. Run `python core/challenge_loop.py` to exercise the minimal create-score-read loop.
If you prefer the tiny HTTP API, launch `python backend/api.py` and then run `python backend/runner.py` to create a challenge, submit scores, and print the leaderboard via the API.

Files:

- `core/challenge_loop.py`: Minimal script that stores a challenge entry, inserts a randomized score, and prints the leaderboard.
- `data/challenges.json`: Persisted data store for challenges and scores (created automatically).
- `PHASE_1_LOCK.md`: Locks Phase 1 scope; no advanced features until future phases.

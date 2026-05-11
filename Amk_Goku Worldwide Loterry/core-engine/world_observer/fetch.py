"""Fetch a lightweight world-observer feed and store it for the UI panels."""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Dict

import requests

REPO_ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = REPO_ROOT / "data" / "world_observer"
NEWS_JSON = DATA_DIR / "news.json"
SUMMARY_JSON = DATA_DIR / "summary.json"
WORLD_FEED = "https://inshortsapi.vercel.app/news?category=world"
REDDIT_FEED = "https://www.reddit.com/r/worldnews/top/.json?t=day"


def normalize_article(raw: Dict[str, str]) -> Dict[str, str]:
    return {
        "title": raw.get("title", "").strip(),
        "author": raw.get("author", ""),
        "time": raw.get("time", ""),
        "content": raw.get("content", "").strip(),
        "date": raw.get("date", ""),
        "read_more": raw.get("readMoreUrl", ""),
    }


def normalize_reddit_article(raw: Dict[str, object]) -> Dict[str, str]:
    data = raw.get("data", {})
    title = data.get("title", "").strip()
    url = data.get("url", "")
    created = data.get("created_utc")
    return {
        "title": title,
        "author": data.get("author", "reddit"),
        "time": datetime.fromtimestamp(created, timezone.utc).strftime("%H:%M") if created else "",
        "content": data.get("selftext", "").strip() or title,
        "date": datetime.fromtimestamp(created, timezone.utc).strftime("%Y-%m-%d") if created else "",
        "read_more": url,
    }


def fetch_world_feed(limit: int = 8) -> List[Dict[str, str]]:
    resp = requests.get(WORLD_FEED, timeout=25)
    resp.raise_for_status()
    payload = resp.json()
    entries = payload.get("data", [])
    normalized = [normalize_article(article) for article in entries[:limit]]
    return normalized


def fetch_reddit_feed(limit: int = 8) -> List[Dict[str, str]]:
    resp = requests.get(REDDIT_FEED, timeout=25, headers={"User-Agent": "Z-Sanctuary Agent"})
    resp.raise_for_status()
    payload = resp.json()
    entries = payload.get("data", {}).get("children", [])
    normalized = [normalize_reddit_article(entry) for entry in entries[:limit]]
    return normalized


def summarize(articles: List[Dict[str, str]]) -> Dict[str, object]:
    by_author = {}
    for article in articles:
        author = article["author"] or "anonymous"
        by_author.setdefault(author, 0)
        by_author[author] += 1
    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "article_count": len(articles),
        "authors": sorted(by_author.items(), key=lambda item: -item[1])[:4],
    }


def ensure_dirs() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)


def save_json(path: Path, payload: object) -> None:
    path.write_text(json.dumps(payload, indent=2))


def run(limit: int = 8) -> Path:
    ensure_dirs()
    try:
        articles = fetch_world_feed(limit)
    except requests.HTTPError as err:
        print("Primary world feed failed:", err)
        articles = fetch_reddit_feed(limit)
    save_json(NEWS_JSON, articles)
    save_json(SUMMARY_JSON, summarize(articles))
    return NEWS_JSON


def main() -> None:
    import argparse

    parser = argparse.ArgumentParser(description="Refresh the world-observer feed")
    parser.add_argument("--limit", type=int, default=8, help="Number of news entries to keep")
    args = parser.parse_args()
    path = run(args.limit)
    print("World observer feed saved to", path)


if __name__ == "__main__":
    main()

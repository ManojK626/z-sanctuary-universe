import json
import pathlib
import datetime


def _load_registry(root: pathlib.Path, paths):
    """Load the first registry that exists."""
    for path in paths:
        if path.exists():
            return json.loads(path.read_text(encoding="utf8"))
    raise FileNotFoundError("No registry JSON found.")


def _write_json(export_dir: pathlib.Path, timestamp: str, payload: dict):
    target = export_dir / f"registry_snapshot_{timestamp}.json"
    target.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf8")
    return target


HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>Registry Snapshot {timestamp}</title>
    <style>
      body {{ background:#050607; color:#e6ecff; font-family: "Exo 2", system-ui, sans-serif; padding:24px; }}
      .badge {{ display:inline-block; border-radius:999px; padding:10px 18px; font-weight:700;
        background:{bg}; color:#050505; box-shadow:0 0 24px rgba(0,0,0,0.45); }}
      .progress {{ width:100%; height:12px; background:#1b1d2b; border-radius:999px; margin-top:12px; }}
      .progress span {{ display:block; height:100%; width:{percent}%; border-radius:999px;
        background:linear-gradient(90deg,#4fffd7,#12b7ff); transition:width .35s ease; }}
      table {{ border-collapse:collapse; width:100%; margin-top:20px; }}
      th,td {{ border:1px solid rgba(255,255,255,0.15); padding:8px 12px; }}
      th {{ background:rgba(255,255,255,0.08); text-align:left; }}
    </style>
  </head>
  <body>
    <div class="badge">Z-Registry {completion}% ({indicator})</div>
    <p>Snapshot time (UTC): {timestamp}</p>
    <div class="progress"><span></span></div>
    <h2>Completed modules</h2>
    <ul>
      {modules_list}
    </ul>
    <h2>Future modules</h2>
    <ul>
      {future_list}
    </ul>
  </body>
</html>"""


def _write_html(export_dir: pathlib.Path, timestamp: str, payload: dict):
    modules = "\n      ".join(f"<li>{m}</li>" for m in payload.get("modules_completed", []))
    future = "\n      ".join(f"<li>{m}</li>" for m in payload.get("future_modules", []))
    bg = "#1d8c6f" if payload.get("indicator") == "green" else "#fdba74"
    percent = max(0, min(100, payload.get("completion_percent", 0)))
    content = HTML_TEMPLATE.format(
        timestamp=timestamp,
        completion=percent,
        indicator=payload.get("indicator", "unknown").upper(),
        bg=bg,
        percent=percent,
        modules_list=modules or "<li>None</li>",
        future_list=future or "<li>None</li>",
    )
    target = export_dir / f"registry_snapshot_{timestamp}.html"
    target.write_text(content, encoding="utf8")
    return target


def _write_metadata(export_dir: pathlib.Path, timestamp: str, payload: dict):
    metadata = {
        "snapshot": timestamp,
        "generated_at": datetime.datetime.utcnow().isoformat() + "Z",
        "completion_percent": payload.get("completion_percent"),
        "indicator": payload.get("indicator"),
        "modules_completed": payload.get("modules_completed"),
        "future_modules": payload.get("future_modules"),
    }
    target = export_dir / f"metadata_snapshot_{timestamp}.json"
    target.write_text(json.dumps(metadata, ensure_ascii=False, indent=2), encoding="utf8")
    return target


def main():
    root = pathlib.Path(__file__).resolve().parent.parent
    export_dir = root / "exports"
    export_dir.mkdir(exist_ok=True)
    timestamp = datetime.datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
    paths = [
        root / "data" / "Z_module_registry.json",
        root / "core" / "data" / "Z_module_registry.json",
    ]
    payload = _load_registry(root, paths)
    payload.update(
        {
            "snapshot": timestamp,
            "note": "Automated registry export",
        }
    )
    json_path = _write_json(export_dir, timestamp, payload)
    html_path = _write_html(export_dir, timestamp, payload)
    metadata_path = _write_metadata(export_dir, timestamp, payload)
    package = root / "release_snapshot.zip"
    # include latest snapshot in release export
    import zipfile, shutil

    snapshot_dir = root / "release_snapshot"
    if snapshot_dir.exists():
        shutil.rmtree(snapshot_dir)
    snapshot_dir.mkdir()
    shutil.copy(root / "index.html", snapshot_dir / "index.html")
    shutil.copy(root / "z_registry_badge.js", snapshot_dir / "z_registry_badge.js")
    shutil.copy(json_path, snapshot_dir / json_path.name)
    shutil.copy(metadata_path, snapshot_dir / metadata_path.name)
    if package.exists():
        package.unlink()
    with zipfile.ZipFile(package, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for item in snapshot_dir.iterdir():
            archive.write(item, arcname=item.name)
    print("Registry export complete:", json_path.name, html_path.name, "package:", package.name)


if __name__ == "__main__":
    main()

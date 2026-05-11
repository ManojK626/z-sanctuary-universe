import glob
import json
import pathlib
import datetime


def latest_snapshot_dir(directory: pathlib.Path):
    snapshots = sorted(directory.glob("registry_snapshot_*.json"))
    return snapshots[-1] if snapshots else None


def main():
    exports_dir = pathlib.Path(__file__).resolve().parent.parent / "exports"
    snapshot = latest_snapshot_dir(exports_dir)
    if not snapshot:
        print("No registry snapshot found.")
        return
    data = json.loads(snapshot.read_text(encoding="utf8"))
    print(f"Snapshot: {snapshot.name}")
    print(f" Timestamp: {data.get('snapshot')}")
    print(f" Completion: {data.get('completion_percent')}%")
    print(f" Indicator: {data.get('indicator')}")
    print(f" Modules completed: {len(data.get('modules_completed', []))}")
    log = pathlib.Path(__file__).resolve().parent.parent / "logs"
    log.mkdir(exist_ok=True)
    msg = f"{datetime.datetime.utcnow().isoformat()}Z | snapshot={snapshot.name} | completion={data.get('completion_percent')}%\n"
    (log / "registry_hook.log").write_text(msg, encoding="utf8")
    print("Logged to logs/registry_hook.log")


if __name__ == "__main__":
    main()

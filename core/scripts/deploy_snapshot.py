import pathlib
import shutil
import os


def main():
    target = pathlib.Path(os.getenv("Z_SNAPSHOT_DEST", "deployments/registry"))
    source = pathlib.Path(__file__).resolve().parent.parent / "release_snapshot.zip"
    if not source.exists():
        raise FileNotFoundError("release_snapshot.zip missing")
    target.mkdir(parents=True, exist_ok=True)
    dest = target / source.name
    shutil.copy2(source, dest)
    print(f"Copied {source.name} → {dest}")


if __name__ == "__main__":
    main()

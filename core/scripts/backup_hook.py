import subprocess
import pathlib

def main():
    venv_python = pathlib.Path(__file__).resolve().parent / "venv" / "Scripts" / "python.exe"
    if not venv_python.exists():
        venv_python = "python"
    snapshot_script = pathlib.Path(__file__).resolve().parent / "export_registry_snapshot.py"
    print("Running registry export snapshot...")
    subprocess.run([str(venv_python), str(snapshot_script)], check=True)
    print("Registry export done. Run your backup or safe-pack process now.")


if __name__ == "__main__":
    main()

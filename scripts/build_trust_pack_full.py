import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

GENERATORS = [
    ROOT / "Amk_Goku Worldwide Loterry" / "scripts" / "system_status.py",
    ROOT / "scripts" / "gen_rhythm_digest.py",
    ROOT / "scripts" / "gen_jailcell_trust.py",
    ROOT / "scripts" / "gen_learning_digest.py",
    ROOT / "scripts" / "gen_monthly_change_log.py"
]

def run_script(path: Path) -> None:
    if not path.exists():
        return
    subprocess.run(["python", str(path)], check=True)

def main() -> None:
    for script in GENERATORS:
        run_script(script)
    subprocess.run(["python", str(ROOT / "scripts" / "build_trust_pack.py")], check=True)

if __name__ == "__main__":
    main()

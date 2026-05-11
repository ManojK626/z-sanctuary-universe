import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CORE_ENGINE = ROOT / "core-engine"

if str(CORE_ENGINE) not in sys.path:
    sys.path.insert(0, str(CORE_ENGINE))

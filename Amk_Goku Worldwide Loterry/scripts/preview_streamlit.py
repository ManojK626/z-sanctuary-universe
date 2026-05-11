"""Convenience launcher for the Streamlit CSV validator."""

from __future__ import annotations

import subprocess
import sys


def main() -> None:
    cmd = ["streamlit", "run", "core-engine/ingest/streamlit_validate.py"]
    try:
        subprocess.run(cmd, check=True)
    except FileNotFoundError:
        print("Streamlit is not available in this environment. Run `python -m pip install streamlit` first.")
        sys.exit(1)
    except subprocess.CalledProcessError as exc:
        print("Streamlit exited with an error:", exc.returncode)
        sys.exit(exc.returncode)


if __name__ == "__main__":
    main()

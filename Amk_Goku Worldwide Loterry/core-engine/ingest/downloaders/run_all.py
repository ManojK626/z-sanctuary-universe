"""Convenience runner to pull all accessible lottery CSV feeds."""

from __future__ import annotations

from importlib import util
from importlib.machinery import SourceFileLoader
from pathlib import Path
from typing import List
import sys
import types

DOWNLOADERS_DIR = Path(__file__).resolve().parent
PACKAGE_NAME = "downloaders"


def ensure_downloaders_package() -> types.ModuleType:
    pkg = sys.modules.get(PACKAGE_NAME)
    if pkg is None:
        pkg = types.ModuleType(PACKAGE_NAME)
        pkg.__path__ = [str(DOWNLOADERS_DIR)]
        sys.modules[PACKAGE_NAME] = pkg
    return pkg


def load_loader(name: str):
    path = DOWNLOADERS_DIR / f"{name}.py"
    qualified_name = f"{PACKAGE_NAME}.{name}"
    loader = SourceFileLoader(qualified_name, str(path))
    ensure_downloaders_package()
    spec = util.spec_from_loader(qualified_name, loader)
    if spec and spec.loader:
        module = util.module_from_spec(spec)
        spec.loader.exec_module(module)
        return module
    raise ImportError(f"Cannot load downloader module {name}")


def fetch_lottery(name: str, attr: str):
    module = load_loader(name)
    return getattr(module, attr)()


def run_all() -> List[dict[str, str]]:
    """Download every supported CSV feed and report the outcome."""
    tasks = [
        ("Powerball", "powerball", "fetch"),
        ("Mega Millions", "mega_millions", "fetch"),
        ("UK Lotto", "uk_lotto", "fetch"),
        ("La Primitiva", "la_primitiva_auto", "fetch"),
        ("Mauritius Loto Vert", "mauritius_auto", "fetch"),
    ]
    results: List[dict[str, str]] = []

    for name, module_name, attr in tasks:
        try:
            result = fetch_lottery(module_name, attr)
        except Exception as exc:
            result = {"lottery": name, "error": str(exc)}
        else:
            result = {"lottery": name, **result}
        results.append(result)

    return results


if __name__ == "__main__":
    for entry in run_all():
        print(entry)

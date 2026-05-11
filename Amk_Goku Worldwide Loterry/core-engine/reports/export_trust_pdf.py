"""Export the trust bundle into a human-readable PDF."""
from __future__ import annotations

import argparse
import json
from pathlib import Path

try:
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.units import cm
    from reportlab.pdfgen import canvas
except ImportError:
    canvas = None
    A4 = (0, 0)
    cm = 1


def _write_lines(c: "canvas.Canvas", x: float, y: float, lines: list[str], height: float) -> float:
    for line in lines:
        if y < 3 * cm:
            c.showPage()
            y = height - 4 * cm
        c.drawString(x, y, line[:110])
        y -= 12
    return y


def export_trust_pdf(bundle_path: Path) -> Path | None:
    if canvas is None:
        print("ReportLab missing; PDF export skipped.")
        return None

    bundle = json.loads(bundle_path.read_text())
    run_id = bundle["run"]["run_id"]
    out_dir = bundle_path.parent
    out_pdf = out_dir / f"trust_bundle_{run_id}.pdf"
    width, height = A4
    c = canvas.Canvas(str(out_pdf), pagesize=A4)

    def header(title: str) -> None:
        c.setFont("Helvetica-Bold", 16)
        c.drawString(2 * cm, height - 2 * cm, title)
        c.setFont("Helvetica", 9)
        c.drawString(2 * cm, height - 2.5 * cm, f"Run {run_id} | {bundle['run']['engine_version']}")
        c.line(2 * cm, height - 2.7 * cm, width - 2 * cm, height - 2.7 * cm)

    header("Z-Sanctuary Trust Report")
    y = height - 3.5 * cm
    c.setFont("Helvetica", 10)
    lines = [
        "Evidence-backed summary of inputs, metrics, and verification.",
        "This is not a prediction promise; it documents measurable behavior.",
    ]
    y = _write_lines(c, 2 * cm, y, lines, height)

    header("Entropy Metrics")
    y = height - 3.5 * cm
    c.setFont("Helvetica", 9)
    metrics = bundle["outputs"].get("lottery_metrics", [])
    if metrics:
        for entry in metrics[:10]:
            content = entry.get("content", {})
            e = content.get("entropy", {})
            code = content.get("lottery_code", "unknown")
            y = _write_lines(
                c,
                2 * cm,
                y,
                [
                    f"{code}: freq={e.get('frequency_entropy', 'n/a')} "
                    f"gap={e.get('gap_entropy', 'n/a')}"
                ],
                height,
            )
    else:
        y = _write_lines(c, 2 * cm, y, ["Metrics not available."], height)

    header("Regional Divergence")
    y = height - 3.5 * cm
    c.setFont("Helvetica", 9)
    region_summary = bundle["outputs"].get("region_summary")
    divergence = {}
    if region_summary and region_summary.get("content"):
        divergence = region_summary["content"].get("divergence", {})
    lines = [f"{k}: {v}" for k, v in divergence.items()] or ["(not available)"]
    y = _write_lines(c, 2 * cm, y, lines, height)

    header("Simulation Delta")
    y = height - 3.5 * cm
    c.setFont("Helvetica", 9)
    deltas = bundle["outputs"].get("delta_reports", [])
    lines = []
    for delta in deltas[:10]:
        dc = delta.get("content", {})
        d = dc.get("delta", {})
        lines.append(
            f"{dc.get('lottery_code','unknown')}: Δfreq={d.get('frequency_entropy','n/a')} "
            f"Δgap={d.get('gap_entropy','n/a')}"
        )
    if not lines:
        lines = ["Delta reports not available."]
    y = _write_lines(c, 2 * cm, y, lines, height)

    header("Verification Notes")
    y = height - 3.5 * cm
    c.setFont("Helvetica", 9)
    notes = bundle.get("verification_notes", [])
    y = _write_lines(c, 2 * cm, y, notes or ["No additional notes."], height)

    c.save()
    return out_pdf


def main() -> None:
    parser = argparse.ArgumentParser(description="Export trust bundle as PDF")
    parser.add_argument("bundle", type=Path, help="Path to trust bundle JSON")
    args = parser.parse_args()
    pdf_path = export_trust_pdf(args.bundle)
    if pdf_path:
        print("PDF saved to", pdf_path)

if __name__ == "__main__":
    main()

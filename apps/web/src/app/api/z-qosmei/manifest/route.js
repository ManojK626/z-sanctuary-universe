import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Serves the single canonical hub manifest from ../../../../../data (no duplicate JSON). */
export async function GET() {
  // manifest/ → z-qosmei → api → app → src → web → apps → ZSanctuary_Universe
  const manifestPath = path.join(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    '..',
    '..',
    '..',
    'data',
    'z_qosmei_manifest.json'
  );
  try {
    const raw = await readFile(manifestPath, 'utf8');
    return new Response(raw, {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=60',
      },
    });
  } catch (e) {
    return Response.json(
      { error: 'manifest_unavailable', message: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}

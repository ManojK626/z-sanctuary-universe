// Z: apps\api\src\server.js
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import cors from 'cors';
import { registerMirrorSoulRoutes } from './mirrorsoul_routes.mjs';
import { createMirrorSoulRouter } from './modules/mirrorSoul/routes.mjs';
import { createZunoFlowRouter } from './zuno_flow_routes.mjs';

function resolveHubDataRoot(ROOT) {
  if (process.env.Z_SANCTUARY_HUB_ROOT) {
    return path.resolve(process.env.Z_SANCTUARY_HUB_ROOT);
  }
  if (fs.existsSync(path.join(ROOT, 'data', 'reports'))) {
    return ROOT;
  }
  const fromApiCwd = path.join(ROOT, '..', '..');
  if (fs.existsSync(path.join(fromApiCwd, 'data', 'reports'))) {
    return fromApiCwd;
  }
  return fromApiCwd;
}

async function resolveExpress() {
  try {
    const mod = await import('express');
    return mod.default || mod;
  } catch {
    const mod = await import('./mini_express.js');
    return mod.default || mod;
  }
}

const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || 'development';
const ROOT_DIR = process.cwd();

function log(level, message, meta = {}) {
  const ts = new Date().toISOString();
  console.log(JSON.stringify({ ts, level, message, ...meta }));
}

function verifyEnvironment() {
  const nodeMajor = Number(process.versions.node.split('.')[0]);
  if (nodeMajor < 18) {
    throw new Error('Node.js >= 18 is required');
  }
  log('info', 'Environment verified', { node: process.versions.node, env: ENV });
}

async function createApp() {
  const express = await resolveExpress();
  const app = express();
  const hubDataRoot = resolveHubDataRoot(ROOT_DIR);
  app.use(
    cors({
      origin: true,
      methods: ['GET', 'POST', 'OPTIONS'],
      maxAge: 600,
    })
  );
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  // Legacy full-path POST /api/mirrorsoul (exact) before v2 /api/mirrorsoul/* on same prefix
  registerMirrorSoulRoutes(app, { hubRoot: hubDataRoot });
  app.use('/api/mirrorsoul', createMirrorSoulRouter(hubDataRoot));
  app.use('/api/zuno/flow', createZunoFlowRouter(hubDataRoot));
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', env: ENV, timestamp: Date.now() });
  });
  app.use(
    '/',
    express.static(path.join(ROOT_DIR, 'core'), {
      extensions: ['html'],
    })
  );
  return app;
}

async function bootstrap() {
  try {
    verifyEnvironment();
    const app = await createApp();
    const server = http.createServer(app);
    server.listen(PORT, () => {
      log('info', 'Z-Sanctuary server online', { port: PORT, mode: ENV });
    });
    process.on('SIGINT', () => {
      log('warn', 'Shutdown signal received');
      server.close(() => {
        log('info', 'Server closed cleanly');
        process.exit(0);
      });
    });
    return server;
  } catch (err) {
    log('error', 'Bootstrap failure', { error: err.message });
    process.exit(1);
  }
}

export { createApp, verifyEnvironment, bootstrap };

if (process.env.NODE_ENV !== 'test') {
  bootstrap();
}

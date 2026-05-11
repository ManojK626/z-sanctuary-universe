import fs from 'node:fs';
import { zBridgePaths } from './z_bridge_loader.mjs';

const USERS_PATH = zBridgePaths().users;

function readUsersDoc() {
  const raw = fs.readFileSync(USERS_PATH, 'utf8');
  const doc = JSON.parse(raw);
  if (!doc || typeof doc !== 'object' || !Array.isArray(doc.users)) {
    throw new Error('users_shape_invalid');
  }
  return doc;
}

function writeUsersDoc(doc) {
  fs.writeFileSync(USERS_PATH, `${JSON.stringify(doc, null, 2)}\n`, 'utf8');
}

export function loadUsers() {
  return readUsersDoc();
}

export function saveUsers(doc) {
  if (!doc || typeof doc !== 'object' || !Array.isArray(doc.users)) {
    throw new Error('users_shape_invalid');
  }
  writeUsersDoc(doc);
}

export function findUserById(doc, id) {
  return doc.users.find((u) => u && typeof u === 'object' && u.id === id) || null;
}

export function createUser(id) {
  if (typeof id !== 'string' || id.trim().length === 0) {
    throw new Error('user_id_required');
  }
  const userId = id.trim();
  const usersDoc = readUsersDoc();
  const existing = findUserById(usersDoc, userId);
  if (existing) return { status: 'EXISTS', user: existing };

  const user = {
    id: userId,
    credits: 0,
    daily_allocated: 0,
    reputation_score: 1,
    last_daily_reset: new Date().toISOString(),
    flagged: false,
    created_at: new Date().toISOString(),
    last_allocation: null
  };
  usersDoc.users.push(user);
  writeUsersDoc(usersDoc);
  return { status: 'CREATED', user };
}

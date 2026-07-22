// ============================================
// notification.service.js — Notification Firestore Operations
// ============================================
import { db } from '../config/firebase.js';
import logger from '../config/logger.js';

const COLLECTION = 'notifications';

/**
 * Default notifications document for a new user.
 */
export function buildDefaultNotifications(uid) {
  const now = new Date().toISOString();
  return {
    uid,
    notifications: [],
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Fetch notifications by UID. Returns null if not found.
 */
export async function getNotifications(uid) {
  const doc = await db.collection(COLLECTION).doc(uid).get();
  if (!doc.exists) return null;
  return doc.data();
}

/**
 * Create notifications document.
 */
export async function createNotifications(uid) {
  const notifications = buildDefaultNotifications(uid);
  await db.collection(COLLECTION).doc(uid).set(notifications, { merge: true });
  logger.info('Default notifications record created.', { uid });
  return notifications;
}

/**
 * Update notifications fields.
 */
export async function updateNotifications(uid, updates) {
  updates.updatedAt = new Date().toISOString();
  await db.collection(COLLECTION).doc(uid).set(updates, { merge: true });
  return { uid, ...updates };
}

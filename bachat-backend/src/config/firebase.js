import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// In-memory Firestore mock database store for fallback when live Firebase credentials are not provided
class InMemoryDb {
  constructor() {
    this.collections = {
      users: new Map(),
      wallets: new Map(),
      transactions: new Map(),
      analytics: new Map()
    };
  }

  collection(name) {
    if (!this.collections[name]) {
      this.collections[name] = new Map();
    }
    const store = this.collections[name];

    return {
      doc: (docId) => {
        const id = docId || `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return {
          id,
          get: async () => {
            const data = store.get(id);
            return {
              exists: !!data,
              id,
              data: () => data
            };
          },
          set: async (data, options = {}) => {
            const existing = store.get(id) || {};
            const updated = options.merge ? { ...existing, ...data } : { ...data };
            store.set(id, updated);
            return updated;
          },
          update: async (data) => {
            const existing = store.get(id) || {};
            const updated = { ...existing, ...data };
            store.set(id, updated);
            return updated;
          },
          delete: async () => {
            store.delete(id);
          }
        };
      },
      add: async (data) => {
        const id = data.id || `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const docData = { ...data, id };
        store.set(id, docData);
        return { id, get: async () => ({ exists: true, id, data: () => docData }) };
      },
      where: (field, op, value) => {
        return {
          orderBy: (orderField, direction = 'asc') => {
            return {
              get: async () => {
                const results = Array.from(store.values()).filter(item => {
                  if (op === '==') return item[field] === value;
                  return true;
                });
                results.sort((a, b) => {
                  const valA = a[orderField] || '';
                  const valB = b[orderField] || '';
                  if (direction === 'desc') return valB > valA ? 1 : -1;
                  return valA > valB ? 1 : -1;
                });
                return {
                  docs: results.map(item => ({
                    id: item.id,
                    data: () => item
                  })),
                  size: results.length
                };
              }
            };
          },
          get: async () => {
            const results = Array.from(store.values()).filter(item => {
              if (op === '==') return item[field] === value;
              return true;
            });
            return {
              docs: results.map(item => ({
                id: item.id,
                data: () => item
              })),
              size: results.length
            };
          }
        };
      },
      get: async () => {
        const results = Array.from(store.values());
        return {
          docs: results.map(item => ({ id: item.id, data: () => item })),
          size: results.length
        };
      }
    };
  }
}

let db;

try {
  if (admin.apps.length === 0) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      db = admin.firestore();
      console.log('⚡ Firebase Admin initialized with service account.');
    } else {
      admin.initializeApp();
      db = admin.firestore();
      console.log('⚡ Firebase Admin initialized with default credentials.');
    }
  } else {
    db = admin.firestore();
  }
} catch (err) {
  console.warn('⚠️ Firebase initialization skipped or credentials missing. Using in-memory Firestore engine for dev/testing.');
  db = new InMemoryDb();
}

export { db, admin };
export default db;

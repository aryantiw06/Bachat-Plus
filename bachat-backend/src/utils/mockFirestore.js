// ============================================
// mockFirestore.js — In-Memory Firestore for Mock Mode
// ============================================

const store = new Map();

const docKey = (collection, id) => `${collection}/${id}`;

class MockDocumentSnapshot {
  constructor(exists, data) {
    this.exists = exists;
    this._data = data;
  }

  data() {
    return this._data ? { ...this._data } : undefined;
  }
}

class MockDocumentReference {
  constructor(collection, id) {
    this.collection = collection;
    this.id = id;
  }

  async get() {
    const data = store.get(docKey(this.collection, this.id));
    return new MockDocumentSnapshot(!!data, data);
  }

  async set(data, options = {}) {
    const key = docKey(this.collection, this.id);
    if (options.merge && store.has(key)) {
      store.set(key, { ...store.get(key), ...data });
    } else {
      store.set(key, { ...data });
    }
  }

  async update(data) {
    const key = docKey(this.collection, this.id);
    if (!store.has(key)) {
      throw new Error(`Document ${key} not found`);
    }
    store.set(key, { ...store.get(key), ...data });
  }
}

class MockQuerySnapshot {
  constructor(docs) {
    this.docs = docs;
    this.empty = docs.length === 0;
    this.size = docs.length;
  }
}

class MockQuery {
  constructor(collection, filters = []) {
    this.collection = collection;
    this.filters = filters;
    this._orderBy = null;
    this._limit = null;
    this._offset = 0;
  }

  where(field, op, value) {
    return new MockQuery(this.collection, [...this.filters, { field, op, value }]);
  }

  orderBy(field, direction = 'asc') {
    const query = new MockQuery(this.collection, this.filters);
    query._orderBy = { field, direction };
    query._limit = this._limit;
    query._offset = this._offset;
    return query;
  }

  limit(n) {
    const query = new MockQuery(this.collection, this.filters);
    query._orderBy = this._orderBy;
    query._limit = n;
    query._offset = this._offset;
    return query;
  }

  offset(n) {
    const query = new MockQuery(this.collection, this.filters);
    query._orderBy = this._orderBy;
    query._limit = this._limit;
    query._offset = n;
    return query;
  }

  _matches(data, filter) {
    const fieldValue = data[filter.field];
    if (filter.op === '==') return fieldValue === filter.value;
    return false;
  }

  async get() {
    const prefix = `${this.collection}/`;
    let results = [];

    for (const [key, data] of store.entries()) {
      if (!key.startsWith(prefix)) continue;
      if (this.filters.every((f) => this._matches(data, f))) {
        const id = key.slice(prefix.length);
        results.push({
          id,
          data: () => ({ ...data }),
        });
      }
    }

    if (this._orderBy) {
      const { field, direction } = this._orderBy;
      results.sort((a, b) => {
        const aVal = a.data()[field];
        const bVal = b.data()[field];
        if (aVal < bVal) return direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    if (this._offset) {
      results = results.slice(this._offset);
    }

    if (this._limit !== null) {
      results = results.slice(0, this._limit);
    }

    return new MockQuerySnapshot(results);
  }
}

class MockWriteBatch {
  constructor() {
    this.operations = [];
  }

  set(ref, data, options) {
    this.operations.push(() => ref.set(data, options));
    return this;
  }

  update(ref, data) {
    this.operations.push(() => ref.update(data));
    return this;
  }

  async commit() {
    for (const op of this.operations) {
      await op();
    }
  }
}

class MockCollectionReference {
  constructor(name) {
    this.name = name;
  }

  doc(id) {
    return new MockDocumentReference(this.name, id);
  }

  where(field, op, value) {
    return new MockQuery(this.name, [{ field, op, value }]);
  }
}

export function createMockFirestore() {
  return {
    collection: (name) => new MockCollectionReference(name),
    batch: () => new MockWriteBatch(),
  };
}

export function clearMockFirestore() {
  store.clear();
}

export default createMockFirestore;

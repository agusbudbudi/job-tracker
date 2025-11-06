// Mock storage untuk local development
const storage = {
  async get(key) {
    const data = localStorage.getItem(key);
    return data ? { key, value: data, shared: false } : null;
  },

  async set(key, value) {
    localStorage.setItem(key, value);
    return { key, value, shared: false };
  },

  async delete(key) {
    localStorage.removeItem(key);
    return { key, deleted: true, shared: false };
  },

  async list(prefix = "") {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keys.push(key);
      }
    }
    return { keys, prefix, shared: false };
  },
};

// Setup window.storage untuk compatibility
if (typeof window !== "undefined") {
  window.storage = storage;
}

export default storage;

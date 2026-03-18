
class MockDb {
  constructor() {
    this.data = {
      tasks: [],
      notifications: [],
      users: []
    };
    this.subscribers = {
      tasks: [],
      notifications: [],
      users: []
    };
    this.currentUser = null;
    this.authSubscribers = [];
  }

  // Auth methods
  setCurrentUser(user) {
    this.currentUser = user;
    this.authSubscribers.forEach(cb => cb(user));
  }

  subscribeAuth(cb) {
    this.authSubscribers.push(cb);
    cb(this.currentUser);
    return () => {
      this.authSubscribers = this.authSubscribers.filter(sub => sub !== cb);
    };
  }

  addUser(user) {
    this.data.users.push(user);
  }

  findUserByEmail(email) {
    return this.data.users.find(u => u.email === email);
  }

  // DB methods
  getCollection(name) {
    return this.data[name] || [];
  }

  addDoc(collectionName, doc) {
    if (!this.data[collectionName]) {
      this.data[collectionName] = [];
    }
    const newDoc = { id: 'mock-doc-' + Date.now() + Math.random().toString(36).substr(2, 9), ...doc };
    this.data[collectionName].push(newDoc);
    this.notifySubscribers(collectionName);
    return newDoc;
  }

  updateDoc(collectionName, docId, updates) {
    if (!this.data[collectionName]) return;
    const index = this.data[collectionName].findIndex(d => d.id === docId);
    if (index !== -1) {
      const oldDoc = this.data[collectionName][index];
      const newDoc = { ...oldDoc, ...updates };
      this.data[collectionName][index] = newDoc;
      this.notifySubscribers(collectionName);
      return { oldDoc, newDoc };
    }
    return null;
  }

  deleteDoc(collectionName, docId) {
     if (!this.data[collectionName]) return;
     this.data[collectionName] = this.data[collectionName].filter(d => d.id !== docId);
     this.notifySubscribers(collectionName);
  }

  subscribe(collectionName, cb) {
    if (!this.subscribers[collectionName]) {
      this.subscribers[collectionName] = [];
    }
    this.subscribers[collectionName].push(cb);
    return () => {
      this.subscribers[collectionName] = this.subscribers[collectionName].filter(sub => sub !== cb);
    };
  }

  notifySubscribers(collectionName) {
    if (this.subscribers[collectionName]) {
      this.subscribers[collectionName].forEach(cb => cb(this.data[collectionName]));
    }
  }

  // Helper to clear data (useful for tests if needed)
  clear() {
      this.data = { tasks: [], notifications: [], users: [] };
      this.currentUser = null;
  }
}

export const mockDb = new MockDb();

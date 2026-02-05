import { mockDb } from './mockDb';

export const getAuth = (app) => {
  return { app, currentUser: mockDb.currentUser };
};

export const createUserWithEmailAndPassword = async (auth, email, password) => {
  const existing = mockDb.findUserByEmail(email);
  if (existing) throw new Error('Email already in use');

  const user = {
    uid: 'mock-user-' + Date.now(),
    email,
    emailVerified: false
  };
  mockDb.addUser(user);
  mockDb.setCurrentUser(user);
  return { user };
};

export const signInWithEmailAndPassword = async (auth, email, password) => {
  let user = mockDb.findUserByEmail(email);

  if (!user) {
    if (email === 'demo@teamquill.test') {
       user = {
          uid: 'demo-user-id',
          email,
          emailVerified: true
       };
       mockDb.addUser(user);
    } else {
       // Allow implicit signup for tests if user not found?
       // No, the test did a signup first. User should be found.
       // If not found, it's an error in our mock state management or the test expectation.
       throw new Error('User not found: ' + email);
    }
  }

  mockDb.setCurrentUser(user);
  return { user };
};

export const signOut = async (auth) => {
  mockDb.setCurrentUser(null);
};

export const onAuthStateChanged = (auth, callback) => {
  return mockDb.subscribeAuth(callback);
};

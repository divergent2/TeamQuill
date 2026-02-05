// src/mocks/firebase-app.js
export const initializeApp = (config) => {
  console.log('Mock Firebase App Initialized', config);
  return { name: '[DEFAULT]', options: config };
};

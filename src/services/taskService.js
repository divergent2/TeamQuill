import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export const createTask = async (taskData) => {
  const tasksRef = collection(db, 'tasks');
  const docRef = await addDoc(tasksRef, {
    ...taskData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateTask = async (taskId, updates) => {
  const taskRef = doc(db, 'tasks', taskId);
  await updateDoc(taskRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const deleteTask = async (taskId) => {
  const taskRef = doc(db, 'tasks', taskId);
  await deleteDoc(taskRef);
};

export const subscribeToTasks = (userId, callback) => {
  const tasksRef = collection(db, 'tasks');
  const q = query(
    tasksRef,
    where('assignedTo', '==', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(tasks);
  });
};

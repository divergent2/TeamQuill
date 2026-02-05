import { mockDb } from './mockDb';

export const getFirestore = (app) => {
  return mockDb;
};

export const collection = (db, path) => {
  return { type: 'collection', path, db };
};

export const doc = (db, path, ...pathSegments) => {
  let collectionName;
  let docId;

  if (pathSegments.length > 0) {
     collectionName = path;
     docId = pathSegments[0];
  } else {
     // handle "collection/docId" format if needed, but the code seems to use the 3-arg version
     const parts = path.split('/');
     collectionName = parts[0];
     docId = parts[1];
  }
  return { type: 'doc', path: `${collectionName}/${docId}`, collection: collectionName, id: docId, db };
};

export const query = (queryRef, ...constraints) => {
  return { type: 'query', queryRef, constraints };
};

export const where = (field, op, value) => {
  return { type: 'where', field, op, value };
};

export const orderBy = (field, direction) => {
  return { type: 'orderBy', field, direction };
};

export const onSnapshot = (queryObj, callback) => {
  const collectionName = queryObj.queryRef ? queryObj.queryRef.path : queryObj.path;

  const runQuery = (data) => {
    let results = [...data];
    if (queryObj.constraints) {
      queryObj.constraints.forEach(c => {
        if (c.type === 'where') {
           results = results.filter(d => {
             if (c.op === '==') return d[c.field] === c.value;
             return true;
           });
        }
        if (c.type === 'orderBy') {
           results.sort((a, b) => {
             const valA = a[c.field]?.seconds || (a[c.field] instanceof Date ? a[c.field].getTime()/1000 : 0);
             const valB = b[c.field]?.seconds || (b[c.field] instanceof Date ? b[c.field].getTime()/1000 : 0);
             return c.direction === 'desc' ? valB - valA : valA - valB;
           });
        }
      });
    }

    const snapshot = {
      docs: results.map(d => ({
        id: d.id,
        data: () => d
      })),
      empty: results.length === 0,
      size: results.length
    };
    callback(snapshot);
  };

  runQuery(mockDb.getCollection(collectionName));

  return mockDb.subscribe(collectionName, (newData) => {
    runQuery(newData);
  });
};

export const addDoc = async (ref, data) => {
  const collectionName = ref.path;
  const newDoc = mockDb.addDoc(collectionName, data);

  // Trigger Logic
  if (collectionName === 'tasks') {
    if (data.assignedTo) {
      // Simulate delay for cloud function
      setTimeout(() => {
        mockDb.addDoc('notifications', {
            recipientUserId: data.assignedTo,
            taskId: newDoc.id,
            message: `New task assigned: ${data.title}`,
            read: false,
            createdAt: serverTimestamp()
        });
      }, 100);
    }
  }

  return { id: newDoc.id };
};

export const updateDoc = async (ref, data) => {
  const collectionName = ref.collection;
  const docId = ref.id;
  const result = mockDb.updateDoc(collectionName, docId, data);

  if (collectionName === 'tasks' && result) {
      const { oldDoc, newDoc } = result;
      let message = null;
      if (oldDoc.status !== newDoc.status) {
          message = `Task "${newDoc.title}" status changed from ${oldDoc.status} to ${newDoc.status}`;
      } else if (oldDoc.assignedTo !== newDoc.assignedTo) {
          message = `Task "${newDoc.title}" was reassigned to you`;
      }

      if (message && newDoc.assignedTo) {
           setTimeout(() => {
             mockDb.addDoc('notifications', {
                recipientUserId: newDoc.assignedTo,
                taskId: docId,
                message: message,
                read: false,
                createdAt: serverTimestamp()
            });
           }, 100);
      }
  }
};

export const deleteDoc = async (ref) => {
  const collectionName = ref.collection;
  const docId = ref.id;
  mockDb.deleteDoc(collectionName, docId);
};

export const serverTimestamp = () => {
  const now = new Date();
  return {
      seconds: Math.floor(now.getTime() / 1000),
      toDate: () => now
  };
};

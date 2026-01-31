const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Trigger when a task is created
exports.onTaskCreated = functions.firestore
  .document('tasks/{taskId}')
  .onCreate(async (snap, context) => {
    const task = snap.data();
    const taskId = context.params.taskId;

    // Create notification for the assigned user
    if (task.assignedTo) {
      await admin.firestore().collection('notifications').add({
        recipientUserId: task.assignedTo,
        taskId: taskId,
        message: `New task assigned: ${task.title}`,
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    return null;
  });

// Trigger when a task is updated
exports.onTaskUpdated = functions.firestore
  .document('tasks/{taskId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    const taskId = context.params.taskId;

    let message = null;

    // Check if status changed
    if (before.status !== after.status) {
      message = `Task "${after.title}" status changed from ${before.status} to ${after.status}`;
    }
    // Check if assignment changed
    else if (before.assignedTo !== after.assignedTo) {
      message = `Task "${after.title}" was reassigned to you`;
    }

    // Create notification if there's a change worth notifying
    if (message && after.assignedTo) {
      await admin.firestore().collection('notifications').add({
        recipientUserId: after.assignedTo,
        taskId: taskId,
        message: message,
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    return null;
  });

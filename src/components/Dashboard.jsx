import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createTask, updateTask, subscribeToTasks } from '../services/taskService';
import { subscribeToNotifications, markNotificationAsRead } from '../services/notificationService';
import './Dashboard.css';

export const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribeTasks = subscribeToTasks(currentUser.uid, setTasks);
    const unsubscribeNotifications = subscribeToNotifications(
      currentUser.uid,
      setNotifications
    );

    return () => {
      unsubscribeTasks();
      unsubscribeNotifications();
    };
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      setLoading(true);
      await createTask({
        title: newTaskTitle,
        description: newTaskDescription,
        assignedTo: currentUser.uid,
        status: 'todo',
      });
      setNewTaskTitle('');
      setNewTaskDescription('');
    } catch (err) {
      console.error('Failed to create task:', err);
    }
    setLoading(false);
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markNotificationAsRead(notification.id);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>TeamQuill Dashboard</h1>
        <div className="header-actions">
          <button
            className="notification-button"
            onClick={() => setShowNotifications(!showNotifications)}
            data-testid="notification-button"
          >
            🔔 Notifications {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </button>
          <button onClick={handleLogout} data-testid="logout-button">Logout</button>
        </div>
      </header>

      {showNotifications && (
        <div className="notifications-panel" data-testid="notifications-panel">
          <h3>Notifications</h3>
          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            <ul className="notification-list">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={notification.read ? 'read' : 'unread'}
                  onClick={() => handleNotificationClick(notification)}
                  data-testid="notification-item"
                >
                  <p>{notification.message}</p>
                  <small>
                    {notification.createdAt?.toDate().toLocaleString()}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="dashboard-content">
        <section className="create-task-section">
          <h2>Create New Task</h2>
          <form onSubmit={handleCreateTask}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Task title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                required
                data-testid="task-title-input"
              />
            </div>
            <div className="form-group">
              <textarea
                placeholder="Task description"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                rows="3"
                data-testid="task-description-input"
              />
            </div>
            <button type="submit" disabled={loading} data-testid="create-task-button">
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </form>
        </section>

        <section className="tasks-section">
          <h2>My Tasks</h2>
          {tasks.length === 0 ? (
            <p>No tasks yet. Create one above!</p>
          ) : (
            <div className="tasks-grid">
              {tasks.map((task) => (
                <div key={task.id} className="task-card" data-testid="task-card">
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <div className="task-status">
                    <label>Status: </label>
                    <select
                      value={task.status}
                      onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                      data-testid="task-status-select"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

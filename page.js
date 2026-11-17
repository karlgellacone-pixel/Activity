'use client';

import { useState } from 'react';

export default function TaskTracker() {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState('all');

  const handleChange = (e) => {
    setTaskTitle(e.target.value);
    if (errorMessage) setErrorMessage('');
  };

  const handleAddTask = (e) => {
    e.preventDefault();

    const trimmed = taskTitle.trim();

    if (!trimmed) {
      setErrorMessage('Task title cannot be empty.');
      return;
    }

    const newTask = {
      id: Date.now(),
      title: trimmed,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setTaskTitle('');
    setErrorMessage('');
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const activeCount = tasks.length - completedCount;

  const visibleTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'done') return task.completed;
    return true;
  });

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'done', label: 'Done' },
  ];

  return (
    <div style={styles.page}>
      <main style={styles.container}>
        <div style={styles.topRow}>
          <h1 style={styles.heading}>
            TASK<span style={styles.accent}>.</span>TRACKER
          </h1>
          <span style={styles.badge}>{activeCount} left</span>
        </div>

        <form onSubmit={handleAddTask} style={styles.form}>
          <input
            type="text"
            value={taskTitle}
            onChange={handleChange}
            placeholder="Type a task and press Enter..."
            style={{
              ...styles.input,
              borderColor: errorMessage ? '#ff4d6d' : '#2a2f3a',
            }}
          />
          <button type="submit" style={styles.addButton}>
            ADD
          </button>
        </form>

        {errorMessage && <p style={styles.error}>⚠ {errorMessage}</p>}

        {tasks.length > 0 && (
          <div style={styles.filterBar}>
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{
                  ...styles.filterButton,
                  color: filter === f.key ? '#0b0d12' : '#8b93a7',
                  background: filter === f.key ? '#00f5a0' : 'transparent',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        {tasks.length === 0 ? (
          <div style={styles.emptyBox}>
            <div style={styles.emptyIcon}>▢</div>
            <p style={styles.empty}>
              No tasks added yet. Start by creating one above!
            </p>
          </div>
        ) : visibleTasks.length === 0 ? (
          <p style={styles.noMatch}>Nothing here for this filter.</p>
        ) : (
          <ul style={styles.list}>
            {visibleTasks.map((task) => (
              <li key={task.id} style={styles.listItem}>
                <button
                  onClick={() => toggleTask(task.id)}
                  aria-label="Toggle task"
                  style={{
                    ...styles.circle,
                    background: task.completed ? '#00f5a0' : 'transparent',
                    borderColor: task.completed ? '#00f5a0' : '#3a4152',
                  }}
                >
                  {task.completed ? '✓' : ''}
                </button>
                <span
                  onClick={() => toggleTask(task.id)}
                  style={{
                    ...styles.taskText,
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? '#5b6377' : '#e8ecf4',
                  }}
                >
                  {task.title}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  style={styles.deleteButton}
                  aria-label="Delete task"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        {completedCount > 0 && (
          <button onClick={clearCompleted} style={styles.clearButton}>
            Clear completed ({completedCount})
          </button>
        )}
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '60px 16px',
    background: '#0b0d12',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  container: {
    width: '100%',
    maxWidth: '560px',
    background: '#141821',
    border: '1px solid #232938',
    borderRadius: '16px',
    padding: '28px',
    boxShadow: '0 0 40px rgba(0, 245, 160, 0.08)',
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  heading: {
    margin: 0,
    fontSize: '22px',
    fontWeight: 800,
    letterSpacing: '3px',
    color: '#e8ecf4',
  },
  accent: {
    color: '#00f5a0',
  },
  badge: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#00f5a0',
    background: 'rgba(0, 245, 160, 0.1)',
    border: '1px solid rgba(0, 245, 160, 0.3)',
    padding: '4px 12px',
    borderRadius: '999px',
  },
  form: {
    display: 'flex',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '13px 14px',
    fontSize: '15px',
    color: '#e8ecf4',
    background: '#0b0d12',
    border: '1px solid #2a2f3a',
    borderRadius: '10px',
    outline: 'none',
  },
  addButton: {
    padding: '13px 22px',
    fontSize: '13px',
    fontWeight: 800,
    letterSpacing: '2px',
    color: '#0b0d12',
    background: '#00f5a0',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  error: {
    margin: '10px 0 0',
    fontSize: '13px',
    color: '#ff4d6d',
  },
  filterBar: {
    display: 'flex',
    gap: '6px',
    marginTop: '22px',
    padding: '4px',
    background: '#0b0d12',
    border: '1px solid #232938',
    borderRadius: '10px',
  },
  filterButton: {
    flex: 1,
    padding: '8px 0',
    fontSize: '13px',
    fontWeight: 600,
    border: 'none',
    borderRadius: '7px',
    cursor: 'pointer',
  },
  emptyBox: {
    textAlign: 'center',
    padding: '48px 0 20px',
  },
  emptyIcon: {
    fontSize: '36px',
    color: '#2a2f3a',
    marginBottom: '10px',
  },
  empty: {
    margin: 0,
    color: '#5b6377',
    fontSize: '15px',
  },
  noMatch: {
    textAlign: 'center',
    color: '#5b6377',
    fontSize: '14px',
    padding: '28px 0 8px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: '18px 0 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '13px 14px',
    background: '#0b0d12',
    border: '1px solid #232938',
    borderRadius: '10px',
  },
  circle: {
    width: '24px',
    height: '24px',
    flexShrink: 0,
    fontSize: '13px',
    fontWeight: 800,
    color: '#0b0d12',
    border: '2px solid #3a4152',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  taskText: {
    flex: 1,
    fontSize: '15px',
    cursor: 'pointer',
    wordBreak: 'break-word',
  },
  deleteButton: {
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#ff4d6d',
    background: 'rgba(255, 77, 109, 0.1)',
    border: '1px solid rgba(255, 77, 109, 0.3)',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  clearButton: {
    marginTop: '18px',
    width: '100%',
    padding: '10px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#8b93a7',
    background: 'transparent',
    border: '1px dashed #2a2f3a',
    borderRadius: '10px',
    cursor: 'pointer',
  },
};

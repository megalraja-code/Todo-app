import { useState, useRef, useEffect } from "react";

const FILTERS = ["All", "Active", "Completed"];

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

const initialTasks = [
  { id: generateId(), text: "Design the UI for the new landing page", done: false },
  { id: generateId(), text: "Review pull requests from the team", done: true },
  { id: generateId(), text: "Write unit tests for the auth module", done: false },
];

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <polyline points="2,6 5,9 10,3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 4h10M5 4V2.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5V4M5.5 6.5v4M8.5 6.5v4M3 4l.7 7.3A.7.7 0 003.7 12h6.6a.7.7 0 00.7-.7L11 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M9.5 1.5l2 2L4 11H2v-2L9.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.text);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commitEdit = () => {
    const trimmed = draft.trim();
    if (trimmed) onEdit(task.id, trimmed);
    else setDraft(task.text);
    setEditing(false);
  };

  return (
    <div className={`task-row ${task.done ? "done" : ""}`}>
      <button
        className={`checkbox ${task.done ? "checked" : ""}`}
        onClick={() => onToggle(task.id)}
        aria-label={task.done ? "Mark incomplete" : "Mark complete"}
      >
        {task.done && <CheckIcon />}
      </button>

      <div className="task-content">
        {editing ? (
          <input
            ref={inputRef}
            className="edit-input"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={e => {
              if (e.key === "Enter") commitEdit();
              if (e.key === "Escape") { setDraft(task.text); setEditing(false); }
            }}
          />
        ) : (
          <span className="task-text" onDoubleClick={() => !task.done && setEditing(true)}>
            {task.text}
          </span>
        )}
      </div>

      <div className="task-actions">
        {!task.done && (
          <button className="icon-btn edit-btn" onClick={() => setEditing(true)} aria-label="Edit">
            <PencilIcon />
          </button>
        )}
        <button className="icon-btn delete-btn" onClick={() => onDelete(task.id)} aria-label="Delete">
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("All");
  const inputRef = useRef(null);

  const addTask = () => {
    const text = input.trim();
    if (!text) return;
    setTasks(prev => [{ id: generateId(), text, done: false }, ...prev]);
    setInput("");
    inputRef.current?.focus();
  };

  const toggleTask = id => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const deleteTask = id => setTasks(prev => prev.filter(t => t.id !== id));
  const editTask = (id, text) => setTasks(prev => prev.map(t => t.id === id ? { ...t, text } : t));
  const clearCompleted = () => setTasks(prev => prev.filter(t => !t.done));

  const filtered = tasks.filter(t => {
    if (filter === "Active") return !t.done;
    if (filter === "Completed") return t.done;
    return true;
  });

  const activeCount = tasks.filter(t => !t.done).length;
  const completedCount = tasks.filter(t => t.done).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          min-height: 100vh;
          background: #f5f0e8;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 3rem 1rem;
          font-family: 'IBM Plex Mono', monospace;
        }

        .app {
          width: 100%;
          max-width: 580px;
        }

        .header {
          margin-bottom: 2.5rem;
        }

        .title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 3rem;
          font-weight: 400;
          color: #1a1208;
          letter-spacing: -0.02em;
          line-height: 1;
        }

        .subtitle {
          margin-top: 6px;
          font-size: 11px;
          color: #9a8c78;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .add-row {
          display: flex;
          gap: 0;
          margin-bottom: 2rem;
          border: 1.5px solid #c8b99a;
          border-radius: 4px;
          overflow: hidden;
          background: #fffdf8;
          transition: border-color 0.15s;
        }

        .add-row:focus-within {
          border-color: #8b6914;
        }

        .add-input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 14px 16px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          color: #1a1208;
          outline: none;
        }

        .add-input::placeholder { color: #b5a48e; }

        .add-btn {
          border: none;
          border-left: 1.5px solid #c8b99a;
          background: #f0e6cc;
          padding: 0 20px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #5c4a1e;
          cursor: pointer;
          transition: background 0.15s;
        }

        .add-btn:hover { background: #e8d9b4; }
        .add-btn:active { background: #dece9c; }

        .stats-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #d4c4a8;
        }

        .count-label {
          font-size: 11px;
          color: #9a8c78;
          letter-spacing: 0.08em;
        }

        .count-label strong { color: #5c4a1e; font-weight: 500; }

        .filters {
          display: flex;
          gap: 2px;
          background: #e8dcc8;
          border-radius: 3px;
          padding: 2px;
        }

        .filter-btn {
          border: none;
          background: transparent;
          padding: 5px 12px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #8b7a60;
          cursor: pointer;
          border-radius: 2px;
          transition: all 0.12s;
        }

        .filter-btn.active {
          background: #fffdf8;
          color: #3d2e0e;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .task-list {
          display: flex;
          flex-direction: column;
        }

        .task-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 0;
          border-bottom: 1px solid #e4d8c4;
          position: relative;
          transition: opacity 0.2s;
          animation: slideIn 0.2s ease;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .task-row.done { opacity: 0.55; }

        .checkbox {
          width: 22px;
          height: 22px;
          flex-shrink: 0;
          border: 1.5px solid #b5a48e;
          border-radius: 3px;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fffdf8;
          transition: all 0.15s;
        }

        .checkbox:hover { border-color: #8b6914; }

        .checkbox.checked {
          background: #5c4a1e;
          border-color: #5c4a1e;
          color: #f5e9cc;
        }

        .task-content {
          flex: 1;
          min-width: 0;
        }

        .task-text {
          font-size: 13px;
          color: #1a1208;
          line-height: 1.5;
          cursor: default;
          display: block;
        }

        .task-row.done .task-text {
          text-decoration: line-through;
          color: #9a8c78;
        }

        .edit-input {
          width: 100%;
          border: none;
          border-bottom: 1.5px solid #8b6914;
          background: transparent;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          color: #1a1208;
          outline: none;
          padding-bottom: 2px;
        }

        .task-actions {
          display: flex;
          gap: 6px;
          opacity: 0;
          transition: opacity 0.15s;
        }

        .task-row:hover .task-actions { opacity: 1; }

        .icon-btn {
          border: none;
          background: transparent;
          cursor: pointer;
          padding: 4px;
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.12s;
        }

        .edit-btn { color: #8b7a60; }
        .edit-btn:hover { background: #e8d9b4; color: #5c4a1e; }
        .delete-btn { color: #b5a48e; }
        .delete-btn:hover { background: #f5dcd0; color: #993c1d; }

        .footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.5rem;
          padding-top: 1rem;
        }

        .hint {
          font-size: 10px;
          color: #b5a48e;
          letter-spacing: 0.08em;
        }

        .clear-btn {
          border: none;
          background: none;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #b5a48e;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: color 0.12s;
        }

        .clear-btn:hover { color: #993c1d; }

        .empty {
          text-align: center;
          padding: 3rem 0;
          font-size: 12px;
          color: #b5a48e;
          letter-spacing: 0.08em;
        }

        .ruled-line {
          height: 1px;
          background: repeating-linear-gradient(to right, #d4c4a8 0, #d4c4a8 4px, transparent 4px, transparent 8px);
          margin: 2rem 0 1.5rem;
        }
      `}</style>

      <div className="app">
        <div className="header">
          <h1 className="title">My Tasks</h1>
          <p className="subtitle">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
        </div>

        <div className="add-row">
          <input
            ref={inputRef}
            className="add-input"
            placeholder="Add a new task…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addTask()}
          />
          <button className="add-btn" onClick={addTask}>Add</button>
        </div>

        <div className="stats-row">
          <p className="count-label">
            <strong>{activeCount}</strong> task{activeCount !== 1 ? "s" : ""} remaining
          </p>
          <div className="filters">
            {FILTERS.map(f => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="task-list">
          {filtered.length === 0 ? (
            <div className="empty">
              {filter === "Completed" ? "No completed tasks yet." : "Nothing here — add a task above."}
            </div>
          ) : (
            filtered.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onEdit={editTask}
              />
            ))
          )}
        </div>

        <div className="footer">
          <span className="hint">Double-click to edit · Enter to add</span>
          {completedCount > 0 && (
            <button className="clear-btn" onClick={clearCompleted}>
              Clear {completedCount} completed
            </button>
          )}
        </div>
      </div>
    </>
  );
}

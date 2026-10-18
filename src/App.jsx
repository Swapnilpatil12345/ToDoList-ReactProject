import { useState, useEffect, useRef } from 'react'
import './App.css'

const STORAGE_KEY = "todo-tasks";

const loadTasks = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(saved)) return [];
    // Older versions stored tasks as plain strings
    return saved.map((t) =>
      typeof t === "string" ? { id: crypto.randomUUID(), text: t, completed: false } : t
    );
  } catch {
    return [];
  }
};

function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const cancelledRef = useRef(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addNewTask = ()=>{
    const text = newTask.trim();
    if (!text) return;
    setTasks([...tasks, { id: crypto.randomUUID(), text, completed: false }]);
    setNewTask("");
  }
  const getNewTask = (event)=>{
    setNewTask(event.target.value);
  }
  const deleteTask = (id)=>{
    setTasks(tasks.filter((task) => task.id !== id));
  }
  const toggleTask = (id)=>{
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  }

  const startEditing = (task)=>{
    cancelledRef.current = false;
    setEditingId(task.id);
    setEditText(task.text);
  }
  const saveEdit = ()=>{
    if (cancelledRef.current) {
      cancelledRef.current = false;
      return;
    }
    const text = editText.trim();
    if (text) {
      setTasks(tasks.map((task) => task.id === editingId ? { ...task, text } : task));
    }
    setEditingId(null);
  }
  const cancelEdit = ()=>{
    // Unmounting the focused input can fire onBlur, which would otherwise save
    cancelledRef.current = true;
    setEditingId(null);
  }

  const remaining = tasks.filter((task) => !task.completed).length;
  const visibleTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <>
      <div className="heading">To Do React App</div>
      <p style={{ textAlign: "center", color: "#666" }}>Welcome back! Stay productive 💪</p>

      <div className="App">
        <div className="header">
          <input id='user-input' value={newTask} type="text" onChange={getNewTask} onKeyDown={(event)=>{ if(event.key === "Enter"){addNewTask()}}} placeholder='Add a new task' />
          <button className='addButton' onClick={addNewTask} >Add</button>
        </div>

        <hr/>

        <div className="toolbar">
          <span className="counter">{remaining} of {tasks.length} tasks remaining</span>
          <div className="filters">
            {["all", "active", "completed"].map((name) => (
              <button
                key={name}
                className={filter === name ? "active" : ""}
                onClick={() => setFilter(name)}
              >
                {name[0].toUpperCase() + name.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="tasks-list">
          {visibleTasks.length === 0 && <p className="empty">No tasks here</p>}
          {
            visibleTasks.map((task)=>{
              return(<div className={`task ${task.completed ? "completed" : ""}`} key={task.id}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                {editingId === task.id ? (
                  <input
                    className="edit-input"
                    type="text"
                    value={editText}
                    autoFocus
                    onChange={(event) => setEditText(event.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") saveEdit();
                      if (event.key === "Escape") cancelEdit();
                    }}
                  />
                ) : (
                  <span className="task-text" onDoubleClick={() => startEditing(task)} title="Double-click to edit">
                    {task.text}
                  </span>
                )}
                <button onClick={()=>{deleteTask(task.id)}}>Delete</button>
              </div>)
            })
          }
        </div>
      </div>
    </>
  )
}

export default App

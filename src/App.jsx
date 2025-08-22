import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [filter, setFilter] = useState('all')

  
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks')
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
  }, [])


  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

 
  const addTask = (e) => {
    e.preventDefault()
    if (title.trim() === '') return

    const newTask = {
      id: Date.now(),
      title,
      description,
      completed: false,
      createdAt: new Date()
    }

    setTasks([...tasks, newTask])
    setTitle('')
    setDescription('')
  }


  const toggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }


  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
  }


  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true
    if (filter === 'completed') return task.completed
    if (filter === 'pending') return !task.completed
    return true
  })

  return (
    <div className="task-manager">
      <h1>Task Manager</h1>
      
      {/* Task Form */}
      <div className="task-form">
        <h2>Add New Task</h2>
        <form onSubmit={addTask}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input 
              type="text" 
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea 
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows="3"
            />
          </div>
          <button type="submit" className="btn-add">Add Task</button>
        </form>
      </div>


      <div className="task-filter">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button 
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>


      <div className="task-list">
        <h2>Tasks ({filteredTasks.length})</h2>
        {filteredTasks.length === 0 ? (
          <p className="no-tasks">No tasks found.</p>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <div className="task-content">
                <h3>{task.title}</h3>
                {task.description && <p>{task.description}</p>}
                <small>Created: {new Date(task.createdAt).toLocaleString()}</small>
              </div>
              <div className="task-actions">
                <button 
                  className="btn-toggle" 
                  onClick={() => toggleComplete(task.id)}
                >
                  {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
                </button>
                <button 
                  className="btn-delete" 
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App

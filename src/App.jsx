import { useState } from 'react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  
  const addNewTask = ()=>{
    setTasks([...tasks, newTask])
    setNewTask("");
  }
  const getNewTask = (event)=>{
    setNewTask(event.target.value);
  }
  const deleteTask = (index)=>{
    const newList = tasks.filter((ele, i)=>{
      return i != index;
    })
    setTasks(newList);
  }


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

        <div className="tasks-list">
          {
            tasks.map((ele,index)=>{
              return(<div className="task">
                {ele} 
                <button onClick={()=>{deleteTask(index)}}>Done</button>
              </div>)
            })
          }
          
        </div>
      </div>
    </>
  )
}

export default App

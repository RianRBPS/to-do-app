import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:4200/api/todos";

function App() {
  const [todos, setTodos] = useState([]); // setTodos: Function to update the todos state. 
  const [newTodo, setNewTodo] = useState(""); // newTodo: Holds the value of the input field for adding a new todo.

  // Fetch todos from the backend
  // send a GET request to the API_URL, converts the response to JSON and updates the todos state with the fetched data
  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL); // fetch() returns a promise which is fulfilled with a response object representing the server's response
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();  // useEffect runs fetchTodos() when the component mounts ([] means it runs only once), fetches todos from the backend when the app starts
  }, []);

  // Add a new todo
  const addTodo = async () => {
    console.log("add button clicked!"); // debugging line
    if (!newTodo.trim()) return; // prevents empty todos
    try {
      console.log("sending requests with:", newTodo); // debugging line
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTodo }),
      });
      console.log("response receveid", response); // debugging line
      const data = await response.json();
      console.log("todo added:", data); // debugging line
      setTodos([data, ...todos]); // adds new todo to the list
      setNewTodo(""); // clears the input field
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // Toggle todo completion
  const toggleTodo = async (id, completed, title) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, completed: !completed }),
      });
      const updatedTodo = await response.json();
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div className="app">
      <h1>Todo List</h1>
      <div className="todo-input">
        <input
          type="text"
          placeholder="Add a new todo..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? "completed" : ""}>
            <span onClick={() => toggleTodo(todo.id, todo.completed, todo.title)}>
              {todo.title}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

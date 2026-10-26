
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Search from "./pages/Search.jsx";
import All_Tasks from "./pages/All_Tasks.jsx";
import Update from "./pages/Update.jsx";

const API_URL = "http://localhost:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchTasks() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  async function handleDeleteTask(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete task");
      }

      setTasks((previousTasks) =>
        previousTasks.filter((task) => (task._id || task.id) !== id)
      );
    } catch (error) {
      console.error("Error deleting task:", error);
      alert(error.message || "Could not delete task. Please try again.");
    }
  }

  return (
    <BrowserRouter>
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <Home
                tasks={tasks}
                setTasks={setTasks}
                refreshTasks={fetchTasks}
              />
            }
          />

          <Route
            path="/search"
            element={<Search tasks={tasks} />}
          />

          <Route
            path="/all-tasks"
            element={
              <All_Tasks
                tasks={tasks}
                onDelete={handleDeleteTask}
              />
            }
          />

          <Route
            path="/update-task"
            element={
              <Update
                tasks={tasks}
                setTasks={setTasks}
                refreshTasks={fetchTasks}
              />
            }
          />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;


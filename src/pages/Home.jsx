
import { useState } from "react";
import { Link } from "react-router-dom";
import "../../Style/Home.css";

export default function Home({ tasks, setTasks,refreshTasks  }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [modal, setModal] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
  });

  const [filters, setFilters] = useState({
    incomplete: false,
    inProgress: false,
    completed: false,
    overdue: false,
    dueToday: false,
    dueNextDays: false,
    nextDays: 1,
  });

  const today = new Date().toISOString().split("T")[0];

  const filteredTasks = tasks.filter((task) => {
    if (filters.completed && !task.completed) return false;
    if (filters.incomplete && task.completed) return false;

    if (filters.overdue && !(task.due_date < today && !task.completed)) {
      return false;
    }

    if (filters.dueToday && task.due_date !== today) {
      return false;
    }

    if (filters.dueNextDays) {
      const dueDate = new Date(`${task.due_date}T00:00:00`);
      const todayDate = new Date(`${today}T00:00:00`);
      const difference =
        (dueDate - todayDate) / (1000 * 60 * 60 * 24);

      if (difference < 0 || difference > Number(filters.nextDays)) {
        return false;
      }
    }

    return true;
  });

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }


async function handleTaskSubmit(event) {
  event.preventDefault();

  if (!formData.title.trim() || !formData.description.trim()) {
    alert("Please enter a title and description.");
    return;
  }

  const taskId = editingTaskId;

  const taskData = {
    title: formData.title.trim(),
    description: formData.description.trim(),
    due_date: formData.due_date || null,
  };

  try {
    const response = await fetch(
      taskId
        ? `http://localhost:5000/api/tasks/${taskId}`
        : "http://localhost:5000/api/tasks",
      {
        method: taskId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Could not save task.");
    }

    if (refreshTasks) {
      await refreshTasks();
    } else if (taskId) {
      setTasks((previous) =>
        previous.map((task) =>
          (task._id || task.id) === taskId ? result : task
        )
      );
    } else {
      setTasks((previous) => [...previous, result]);
    }

    setFormData({
      title: "",
      description: "",
      due_date: "",
    });

    setEditingTaskId(null);
    setShowTaskForm(false);
  } catch (error) {
    console.error("Error saving task:", error);
    alert(error.message || "Could not save task. Please try again.");
  }
}


 function handleEditTask(task) {
  setFormData({
    title: task.title || "",
    description: task.description || "",
    due_date: task.due_date
      ? String(task.due_date).slice(0, 10)
      : "",
  });

  setEditingTaskId(task._id || task.id);
  setShowTaskForm(true);
}

 async function handleDeleteTask(id) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/tasks/${id}`,
      {
        method: "DELETE",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Could not delete task.");
    }

    if (refreshTasks) {
      await refreshTasks();
    } else {
      setTasks((previous) =>
        previous.filter((task) => (task._id || task.id) !== id)
      );
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    alert(error.message || "Could not delete task.");
  }
}

  function toggleTaskCompleted(id) {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function openTaskForm() {
    setEditingTaskId(null);
    setFormData({
      title: "",
      description: "",
      due_date: "",
    });
    setShowTaskForm(true);
    setSidebarOpen(false);
  }

  function toggleDropdown(name) {
    setActiveDropdown((previous) =>
      previous === name ? null : name
    );
  }

  function handlePrint() {
    window.print();
    setActiveDropdown(null);
  }

  function handleFilterChange(name, checked) {
    setFilters((previous) => ({
      ...previous,
      [name]: checked,
    }));
  }

  return (
    <>
      {/* Sidebar toggle */}
      <button
        id="toggle-btn"
        type="button"
        onClick={() => setSidebarOpen((previous) => !previous)}
        aria-label="Toggle sidebar"
      >
        <i className="fas fa-bars"></i>
      </button>

      {/* Sidebar */}
      <div
        id="sidebar"
        className={sidebarOpen ? "show" : "hide"}
      >
        <div className="offcanvas-body">
          <h1 className="text-xs">
            <i className="fa-solid fa-layer-group"></i> Organizr
          </h1>

          <Link
            className="iconsonbar button text-muted"
            to="/"
            onClick={() => setSidebarOpen(false)}
          >
            <i className="con fas fa-house p-2"></i>
            Home
          </Link>

          <Link
            className="iconsonbar button text-muted"
            to="/search"
            onClick={() => setSidebarOpen(false)}
          >
            <i className="con fas fa-search p-2"></i>
            Search
          </Link>

          <a
            className="iconsonbar button text-muted"
            href="#task-form"
            onClick={openTaskForm}
          >
            <i className="con fas fa-plus p-2"></i>
            Add Task
          </a>

          <hr />

          <p className="fw-semibold mtdd">My Tasks</p>

          <a
            className="text-start iconsonbar2"
            href="#all-tasks"
            onClick={() => setSidebarOpen(false)}
          >
            <i className="fas fa-check icon-gap"></i>
            All Tasks
          </a>
        </div>
      </div>

      {/* Main page */}
      <div
        id="main-content"
        className={sidebarOpen ? "shifted" : ""}
      >
        <header>
          <div className="logo">
            <i className="fa-solid fa-layer-group"></i>
            Organizr
          </div>

          <div className="right-header">
            <div className="btn-group">
              {/* Export dropdown */}
              <div className="dropdown-container">
                <button
                  type="button"
                  className="btn btn-secondary dropdown-toggle"
                  onClick={() => toggleDropdown("export")}
                >
                  <i className="fa-solid fa-download"></i>
                  Export
                </button>

                {activeDropdown === "export" && (
                  <ul className="dropdown-menu X">
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={handlePrint}
                      >
                        <i className="fa-solid fa-print"></i>
                        Print todo-list
                      </button>
                    </li>

                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => {
                          alert(
                            "PDF export can be added later."
                          );
                          setActiveDropdown(null);
                        }}
                      >
                        <i className="fa-solid fa-file-pdf"></i>
                        Save as PDF
                      </button>
                    </li>
                  </ul>
                )}
              </div>

              {/* View dropdown */}
              <div className="dropdown-container">
                <button
                  type="button"
                  className="btn btn-secondary dropdown-toggle"
                  onClick={() => toggleDropdown("view")}
                >
                  <i className="fa-solid fa-hand-pointer"></i>
                  Select
                </button>

                {activeDropdown === "view" && (
                  <ul className="dropdown-menu Y">
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <i className="fa-solid fa-list"></i>
                        List View
                      </button>
                    </li>

                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <i className="fa-solid fa-table"></i>
                        Tiles View
                      </button>
                    </li>
                  </ul>
                )}
              </div>

              {/* Filtering dropdown */}
              <div className="dropdown-container">
                <button
                  type="button"
                  className="btn btn-secondary dropdown-toggle"
                  onClick={() => toggleDropdown("filter")}
                >
                  <i className="fa-solid fa-arrow-down-short-wide"></i>
                  Filtering
                </button>

                {activeDropdown === "filter" && (
                  <ul className="dropdown-menu Z">
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() =>
                          setShowFilters((previous) => !previous)
                        }
                      >
                        Filters
                      </button>
                    </li>

                    {showFilters && (
                      <div id="filter" className="filter-section">
                        <span
                          className="close-modal"
                          onClick={() => setShowFilters(false)}
                        >
                          &times;
                        </span>

                        <h4>Progress</h4>

                        <label>
                          <input
                            type="checkbox"
                            className="checkbox"
                            checked={filters.incomplete}
                            onChange={(event) =>
                              handleFilterChange(
                                "incomplete",
                                event.target.checked
                              )
                            }
                          />
                          <i className="fa-solid fa-clock"></i>
                          Incomplete tasks
                        </label>

                        <label>
                          <input
                            type="checkbox"
                            className="checkbox"
                            checked={filters.inProgress}
                            onChange={(event) =>
                              handleFilterChange(
                                "inProgress",
                                event.target.checked
                              )
                            }
                          />
                          <i className="fa-solid fa-person-walking-arrow-right"></i>
                          Marked in progress
                        </label>

                        <label>
                          <input
                            type="checkbox"
                            className="checkbox"
                            checked={filters.completed}
                            onChange={(event) =>
                              handleFilterChange(
                                "completed",
                                event.target.checked
                              )
                            }
                          />
                          <i className="fa-solid fa-check-to-slot"></i>
                          Completed tasks
                        </label>

                        <h4>Due Date</h4>

                        <label>
                          <input
                            type="checkbox"
                            className="checkbox"
                            checked={filters.overdue}
                            onChange={(event) =>
                              handleFilterChange(
                                "overdue",
                                event.target.checked
                              )
                            }
                          />
                          <i className="fa-solid fa-flag-checkered"></i>
                          Overdue
                        </label>

                        <label>
                          <input
                            type="checkbox"
                            className="checkbox"
                            checked={filters.dueToday}
                            onChange={(event) =>
                              handleFilterChange(
                                "dueToday",
                                event.target.checked
                              )
                            }
                          />
                          <i className="fa-solid fa-flag-checkered"></i>
                          Due Today
                        </label>

                        <label>
                          <input
                            type="checkbox"
                            className="checkbox"
                            checked={filters.dueNextDays}
                            onChange={(event) =>
                              handleFilterChange(
                                "dueNextDays",
                                event.target.checked
                              )
                            }
                          />
                          <i className="fa-solid fa-flag-checkered"></i>
                          Due Next
                          <input
                            type="number"
                            min="0"
                            value={filters.nextDays}
                            onChange={(event) =>
                              setFilters((previous) => ({
                                ...previous,
                                nextDays: event.target.value,
                              }))
                            }
                          />
                          days
                        </label>
                      </div>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Task panel */}
        <main>
          <div className="task-panel" id="all-tasks">
            <h2>All Tasks</h2>

            <button
              className="add-btn"
              id="show-task-form"
              type="button"
              onClick={() =>
                setShowTaskForm((previous) => !previous)
              }
            >
              + Add Task
            </button>

            {showTaskForm && (
              <form
                id="task-form"
                onSubmit={handleTaskSubmit}
              >
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />

                <textarea
                  id="description"
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />

                <input
                  type="date"
                  name="due_date"
                  id="due_date"
                  value={formData.due_date}
                  onChange={handleInputChange}
                  required
                />

                <button type="submit">
                  {editingTaskId !== null
                    ? "Update Task"
                    : "Submit"}
                </button>

                <button
                  type="button"
                  className="add-btn"
                  onClick={() => {
                    setShowTaskForm(false);
                    setEditingTaskId(null);
                  }}
                >
                  Cancel
                </button>
              </form>
            )}

            {/* Task list */}
            <div id="task-list">
              {filteredTasks.length === 0 ? (
                <p className="empty-tasks">
                  No tasks found. Click “Add Task” to get started.
                </p>
              ) : (
                filteredTasks.map((task) => (
                  <div className="task-item" key={task._id || task.id}>
                    <h3
                      style={{
                        textDecoration: task.completed
                          ? "line-through"
                          : "none",
                      }}
                    >
                      {task.title}
                    </h3>

                    <p>{task.description}</p>

                    <p>
                      <small>Due: {task.due_date ? String(task.due_date).slice(0, 10) : "No due date"}</small>
                    </p>

                    <div className="task-actions">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => toggleTaskCompleted(task.id)}
                      >
                        {task.completed
                          ? "Mark Incomplete"
                          : "Complete"}
                      </button>

                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => handleEditTask(task)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => handleDeleteTask(task._id || task.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="tm-footer">
          <div className="tm-footer-main">
            <div className="tm-logo">
              <i className="fa-solid fa-layer-group"></i>
              Organizr
            </div>

            <div className="tm-col">
              <Link to="/">
                <h4>Home</h4>
                <br />
              </Link>
              <a href="#about">About us</a>
              <br />
              <a href="#blog">Blog</a>
              <br />
              <a href="#careers">Careers</a>
              <br />
            </div>

            <div className="tm-col">
              <h4>Support</h4>
              <br />
              <a href="#contact">Contact</a>
              <br />
              <a href="#help">Help Center</a>
              <br />
              <a href="#privacy">Privacy Policy</a>
            </div>
          </div>

          <div className="tm-footer-bottom">
            <p>&copy; 2025 tm. All rights reserved.</p>

            <div className="tm-social">
              <a href="#twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#linkedin">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </footer>
      </div>

      {/* Login modal */}
      {modal === "login" && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span
              className="close-modal"
              onClick={() => setModal(null)}
            >
              &times;
            </span>

            <h1>Organizr</h1>
            <h4>Sign in to Organizr</h4>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                alert("Login is frontend-only for now.");
                setModal(null);
              }}
            >
              <label htmlFor="login_email">Email</label>
              <input
                type="email"
                id="login_email"
                placeholder="Enter your email"
                required
              />

              <label htmlFor="login_password">Password</label>
              <input
                type="password"
                id="login_password"
                placeholder="Enter your password"
                required
              />

              <button
                type="submit"
                className="add-btn"
                style={{
                  width: "100%",
                  marginBottom: "1.5rem",
                }}
              >
                Login
              </button>

              <p
                style={{ textAlign: "center" }}
                className="create-account"
              >
                Don't have an account?{" "}
                <a
                  href="#register"
                  onClick={(event) => {
                    event.preventDefault();
                    setModal("register");
                  }}
                >
                  Create Account
                </a>
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Registration modal */}
      {modal === "register" && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span
              className="close-modal"
              onClick={() => setModal(null)}
            >
              &times;
            </span>

            <h1>Organizr</h1>
            <h4>Create a new account</h4>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                alert("Registration is frontend-only for now.");
                setModal(null);
              }}
            >
              <label htmlFor="register_name">Full Name</label>
              <input
                type="text"
                id="register_name"
                placeholder="Enter your full name"
                required
              />

              <label htmlFor="register_email">Email</label>
              <input
                type="email"
                id="register_email"
                placeholder="Enter your email"
                required
              />

              <label htmlFor="register_password">Password</label>
              <input
                type="password"
                id="register_password"
                placeholder="Create a password"
                required
              />

              <label htmlFor="register_confirm_password">
                Confirm Password
              </label>
              <input
                type="password"
                id="register_confirm_password"
                placeholder="Confirm your password"
                required
              />

              <button
                type="submit"
                className="add-btn"
                style={{
                  width: "100%",
                  marginBottom: "1.5rem",
                }}
              >
                Create Account
              </button>

              <p
                style={{ textAlign: "center" }}
                className="forgot-password"
              >
                Already have an account?{" "}
                <a
                  href="#login"
                  onClick={(event) => {
                    event.preventDefault();
                    setModal("login");
                  }}
                >
                  Sign in
                </a>
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

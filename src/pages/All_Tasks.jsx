
import { useEffect, useState } from "react";
import "../../Style/All_Tasks.css";
import { Link, useNavigate } from "react-router-dom";

function AllTasks({ tasks = [], onDelete }) {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleOutsideClick = (event) => {
            const sidebar = document.getElementById("sidebar");
            const toggleButton = document.getElementById("toggle-btn");

            if (
                sidebar &&
                toggleButton &&
                !sidebar.contains(event.target) &&
                !toggleButton.contains(event.target)
            ) {
                setSidebarOpen(false);
            }
        };

        document.addEventListener("click", handleOutsideClick);

        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, []);

    // Sort tasks by due date
    const sortedTasks = [...tasks].sort((a, b) => {
        const dateA = new Date(
            a.due_date || a.date || a.dueDate || "9999-12-31"
        );

        const dateB = new Date(
            b.due_date || b.date || b.dueDate || "9999-12-31"
        );

        return dateA - dateB;
    });

    // Delete task
    const handleDelete = (taskId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (confirmDelete && onDelete) {
            onDelete(taskId);
        }
    };

    // Navigate to Update page with selected task
    const handleUpdate = (task) => {
        navigate("/update-task", {
            state: { task },
        });
    };

    return (
        <>
            {/* Sidebar Toggle Button */}
            <button
                id="toggle-btn"
                type="button"
                onClick={(event) => {
                    event.stopPropagation();
                    setSidebarOpen((previous) => !previous);
                }}
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
                        <i className="con fas fa-home p-2"></i>
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

                    <Link
                        className="iconsonbar button text-muted"
                        to="/"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <i className="con fas fa-plus p-2"></i>
                        Add Task
                    </Link>

                    <hr />

                    <p className="fw-semibold mtdd">My Tasks</p>

                    <Link
                        className="text-start iconsonbar2"
                        to="/all-tasks"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <i className="fas fa-check icon-gap"></i>
                        All Tasks
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div
                id="main-content"
                className={sidebarOpen ? "shifted" : ""}
            >
                <header>
                    <div className="logo">
                        <i className="fa-solid fa-layer-group"></i>
                        Organizr
                    </div>
                </header>

                <main>
                    <div className="task-panel">
                        <h2>All Tasks</h2>

                        {sortedTasks.length > 0 ? (
                            <ul className="task-list">
                                {sortedTasks.map((task) => (
                                    <li
                                        className="task-item"
                                        key={task.id}
                                    >
                                        <h3>{task.title}</h3>

                                        <p>{task.description}</p>

                                        <small>
                                            Due:{" "}
                                            {task.due_date ||
                                                task.date ||
                                                task.dueDate ||
                                                "No due date"}
                                        </small>

                                        <hr />

                                        <button
                                            type="button"
                                            className="update-btn"
                                            onClick={() =>
                                                handleUpdate(task)
                                            }
                                        >
                                            Update
                                        </button>

                                        <button
                                            type="button"
                                            className="delete-btn"
                                            onClick={() =>
                                                handleDelete(task.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No tasks found.</p>
                        )}
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
                            </Link>

                            <Link to="/about">About us</Link>
                            <Link to="/blog">Blog</Link>
                            <Link to="/careers">Careers</Link>
                        </div>

                        <div className="tm-col">
                            <h4>Support</h4>

                            <Link to="/contact">Contact</Link>
                            <Link to="/help">Help Center</Link>
                            <Link to="/privacy-policy">
                                Privacy Policy
                            </Link>
                        </div>
                    </div>

                    <div className="tm-footer-bottom">
                        <p>&copy; 2025 tm. All rights reserved.</p>

                        <div className="tm-social">
                            <a href="#" aria-label="Twitter">
                                <i className="fab fa-twitter"></i>
                            </a>

                            <a href="#" aria-label="Instagram">
                                <i className="fab fa-instagram"></i>
                            </a>

                            <a href="#" aria-label="LinkedIn">
                                <i className="fab fa-linkedin"></i>
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

export default AllTasks;

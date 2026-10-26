import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../Style/Update.css";

function Update({ tasks = [], setTasks }) {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedTask = location.state?.task;

  const [formData, setFormData] = useState({
    title: selectedTask?.title || "",
    description: selectedTask?.description || "",
    date:
      selectedTask?.date ||
      selectedTask?.due_date ||
      selectedTask?.dueDate ||
      "",
  });

  useEffect(() => {
    if (!selectedTask) {
      navigate("/all-tasks");
    }
  }, [selectedTask, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedTask || !setTasks) return;

    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === selectedTask.id
          ? {
              ...task,
              ...formData,
              date: formData.date,
              due_date: formData.date,
            }
          : task
      )
    );

    navigate("/all-tasks");
  };

  if (!selectedTask) return null;

  return (
    <div className="update-form-container">
      <h2>Update Task</h2>

      <form onSubmit={handleSubmit}>
        <div className="update-form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="update-form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="update-form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="update-button-group">
          <button type="submit" className="update-btn-primary">
            Save Changes
          </button>

          <Link to="/all-tasks" className="update-btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Update;
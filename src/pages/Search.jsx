import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../Style/Search.css';

function Search() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');

  const tasks = [
    {
      id: 1,
      title: 'Complete DSA Assignment',
      description: 'Complete the linked list and array problems.',
      dueDate: '2026-08-25',
    },
    {
      id: 2,
      title: 'Prepare DBMS Notes',
      description: 'Revise normalization, transactions and SQL queries.',
      dueDate: '2026-08-27',
    },
    {
      id: 3,
      title: 'Full Stack Project',
      description: 'Complete the task management system project.',
      dueDate: '2026-08-30',
    },
    {
      id: 4,
      title: 'ML Project',
      description:
        'Work on the machine learning project and prepare the presentation.',
      dueDate: '2026-09-02',
    },
  ];

  const filteredTasks = tasks.filter((task) => {
    const query = submittedQuery.toLowerCase().trim();

    return (
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query)
    );
  });

  function handleSearch(event) {
    event.preventDefault();
    setSubmittedQuery(searchInput.trim());
  }

  const heading = submittedQuery
    ? `Search Results for "${submittedQuery}"`
    : 'All Tasks';

  return (
    <div className="search-page">
      {/* Sidebar toggle */}
      <button
        id="toggle-btn"
        type="button"
        aria-label="Toggle sidebar"
        onClick={() => setSidebarOpen((open) => !open)}
      >
        <i className="fas fa-bars"></i>
      </button>

      {/* Sidebar */}
      <div id="sidebar" className={sidebarOpen ? '' : 'hide'}>
        <div className="offcanvas-body">
          <h1 className="text-xs">
            <i className="fa-solid fa-layer-group"></i>
            Organizr
          </h1>

          <nav>
            <Link className="iconsonbar button text-muted" to="/home">
              <i className="con fas fa-home p-2"></i>
              Home
            </Link>

            <Link className="iconsonbar button text-muted" to="/search">
              <i className="con fas fa-search p-2"></i>
              Search
            </Link>

            <Link className="iconsonbar button text-muted" to="/">
              <i className="con fas fa-plus p-2"></i>
              Add Task
            </Link>

            <hr />

            <p className="fw-semibold mtdd">My Tasks</p>

            <Link className="text-start iconsonbar2" to="/tasks">
              <i className="fas fa-check icon-gap"></i>
              All Tasks
            </Link>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div id="main-content" className={sidebarOpen ? 'shifted' : ''}>
        {/* Header */}
        <header>
          <div className="logo">
            <i className="fa-solid fa-layer-group"></i>
            Organizr
          </div>

          {/* Search form */}
          <div className="header-search-form">
            <form id="header-search-form" onSubmit={handleSearch}>
              <input
                type="text"
                id="searchInput"
                placeholder="Search for tasks..."
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
              />

              <button type="submit" aria-label="Search tasks">
                <i className="fas fa-search"></i>
              </button>
            </form>
          </div>
        </header>

        {/* Tasks */}
        <main>
          <div className="task-panel">
            <h2 id="heading">{heading}</h2>

            <ul className="task-list" id="taskList">
              {filteredTasks.map((task) => (
                <li className="task-item" key={task.id}>
                  <h3>{task.title}</h3>

                  <p>{task.description}</p>

                  <small>Due: {task.dueDate}</small>
                </li>
              ))}
            </ul>

            {filteredTasks.length === 0 && (
              <p id="noResults">
                No tasks found matching your search query.
              </p>
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

              <br />

              <a href="/About_Us.html">About us</a>
              <br />

              <a href="/Blog.html">Blog</a>
              <br />

              <a href="/Careers.html">Careers</a>
              <br />
            </div>

            <div className="tm-col">
              <h4>Support</h4>

              <br />

              <a href="/Contact.html">Contact</a>
              <br />

              <a href="/Help_Centre.html">Help Center</a>
              <br />

              <a href="/Privacy_Policy.html">Privacy Policy</a>
            </div>
          </div>

          <div className="tm-footer-bottom">
            <p>&copy; 2025 Organizr. All rights reserved.</p>

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
    </div>
  );
}

export default Search;
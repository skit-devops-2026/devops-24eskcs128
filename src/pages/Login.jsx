import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
const navigate = useNavigate();

const [loginOpen, setLoginOpen] = useState(false);
const [registerOpen, setRegisterOpen] = useState(false);

const [loginEmail, setLoginEmail] = useState("");
const [loginPassword, setLoginPassword] = useState("");

const [registerName, setRegisterName] = useState("");
const [registerEmail, setRegisterEmail] = useState("");
const [registerPassword, setRegisterPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const [error, setError] = useState("");
const [success, setSuccess] = useState("");

function openLogin() {
setError("");
setSuccess("");
setRegisterOpen(false);
setLoginOpen(true);
}

function openRegister() {
setError("");
setSuccess("");
setLoginOpen(false);
setRegisterOpen(true);
}

function closeModals() {
setLoginOpen(false);
setRegisterOpen(false);
setError("");
setSuccess("");
}

async function handleLogin(event) {
  event.preventDefault();
  setError("");
  setSuccess("");

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed.");
    }

    // Save the authentication token and user information.
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("user", JSON.stringify(data.user));

    // Close the modal and open the dashboard.
    setLoginOpen(false);
    navigate("/home");
  } catch (error) {
    setError(
      error.message === "Failed to fetch"
        ? "Unable to connect to the server. Please try again."
        : error.message || "Login failed. Please try again."
    );
  }
}


// Authentication API will be connected in the next step.

async function handleRegister(event) {
  event.preventDefault();
  setError("");
  setSuccess("");

  if (registerPassword !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: registerName,
          email: registerEmail,
          password: registerPassword,
          confirmPassword: confirmPassword,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed.");
    }

    // Show the success message and return to the login form.
    setSuccess(data.message || "Registration successful! You can now log in.");

    setRegisterOpen(false);
    setLoginOpen(true);

    // Clear the registration form.
    setRegisterName("");
    setRegisterEmail("");
    setRegisterPassword("");
    setConfirmPassword("");
    setError("");
  } catch (error) {
    setError(
      error.message === "Failed to fetch"
        ? "Unable to connect to the server. Please try again."
        : error.message || "Registration failed. Please try again."
    );
  }
}

return ( <div className="login-page"> <header className="header"> <div className="logo"> <i className="fa-solid fa-layer-group"></i> Organizr </div> </header>


  <div className="container">
    <div className="box">
      <img
        src="/Images/Index.png"
        className="img1"
        alt="Login Illustration"
      />
    </div>

    <div className="box2">
      <h1>Welcome!</h1>
      <p>Manage your tasks with Organizr</p>

      <div className="btn-group">
        <button
          type="button"
          className="btn login-btn"
          onClick={openLogin}
        >
          Log In to Dashboard
        </button>

        <button
          type="button"
          className="btn demo-btn"
          onClick={() => navigate("/home")}
        >
          Take Free Demo
        </button>
      </div>
    </div>
  </div>

  {loginOpen && (
    <div
      className="modal-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) closeModals();
      }}
    >
      <div className="modal-content">
        <button
          type="button"
          className="close-modal"
          onClick={closeModals}
          aria-label="Close login"
        >
          &times;
        </button>

        <h1>Organizr</h1>
        <h4>Sign in to Organizr</h4>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && (
          <div className="alert alert-success">{success}</div>
        )}

        <form id="login-form" onSubmit={handleLogin}>
          <label htmlFor="login_email">Email</label>
          <input
            type="email"
            id="login_email"
            name="login_email"
            placeholder="Enter your email"
            value={loginEmail}
            onChange={(event) => setLoginEmail(event.target.value)}
            required
          />

          <label htmlFor="login_password">Password</label>
          <input
            type="password"
            id="login_password"
            name="login_password"
            placeholder="Enter your password"
            value={loginPassword}
            onChange={(event) => setLoginPassword(event.target.value)}
            required
          />

          <button
            type="submit"
            className="add-btn"
            style={{ width: "100%", marginBottom: "1.5rem" }}
          >
            Login
          </button>

          <p className="create-account" style={{ textAlign: "center" }}>
            Don't have an account?{" "}
            <a
              href="#register"
              onClick={(event) => {
                event.preventDefault();
                openRegister();
              }}
            >
              Create Account
            </a>
          </p>
        </form>
      </div>
    </div>
  )}

  {registerOpen && (
    <div
      className="modal-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) closeModals();
      }}
    >
      <div className="modal-content">
        <button
          type="button"
          className="close-modal"
          onClick={closeModals}
          aria-label="Close registration"
        >
          &times;
        </button>

        <h1>Organizr</h1>
        <h4>Create a new account</h4>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && (
          <div className="alert alert-success">{success}</div>
        )}

        <form id="register-form" onSubmit={handleRegister}>
          <label htmlFor="register_name">Full Name</label>
          <input
            type="text"
            id="register_name"
            name="register_name"
            placeholder="Enter your full name"
            value={registerName}
            onChange={(event) => setRegisterName(event.target.value)}
            required
          />

          <label htmlFor="register_email">Email</label>
          <input
            type="email"
            id="register_email"
            name="register_email"
            placeholder="Enter your email"
            value={registerEmail}
            onChange={(event) => setRegisterEmail(event.target.value)}
            required
          />

          <label htmlFor="register_password">Password</label>
          <input
            type="password"
            id="register_password"
            name="register_password"
            placeholder="Create a password"
            value={registerPassword}
            onChange={(event) => setRegisterPassword(event.target.value)}
            required
          />

          <label htmlFor="register_confirm_password">
            Confirm Password
          </label>
          <input
            type="password"
            id="register_confirm_password"
            name="register_confirm_password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />

          <button
            type="submit"
            className="add-btn"
            style={{ width: "100%", marginBottom: "1.5rem" }}
          >
            Create Account
          </button>

          <p className="forgot-password" style={{ textAlign: "center" }}>
            Already have an account?{" "}
            <a
              href="#login"
              onClick={(event) => {
                event.preventDefault();
                openLogin();
              }}
            >
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  )}
</div>


);
}

export default Login;

import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const AuthForm = ({ isLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Input validation
    if (!username || !password) {
      setError("Please fill out both fields.");
      return;
    }

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const result = await axios.post(`${process.env.REACT_APP_API_BASE_URL}${endpoint}`, {
        username,
        password,
      });

      if (isLogin) {
        setCookies("access_token", result.data.token);
        window.localStorage.setItem("userID", result.data.userID);
        setUsername(""); // Clear form fields
        setPassword("");
        navigate("/");
      } else {
        alert("Registration Completed! Now login.");
      }
    } catch (error) {
      console.error(error);
      setError("Authentication failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit}>
        <h2>{isLogin ? "Login" : "Register"}</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button type="submit">{isLogin ? "Login" : "Register"}</button>
      </form>
    </div>
  );
};

export const Auth = () => {
  return (
    <div className="auth">
      <AuthForm isLogin />
      <AuthForm />
    </div>
  );
};

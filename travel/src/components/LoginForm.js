// src/components/LoginForm.js
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await login(email, password);
    if (success) {
      alert("Login successful!");
    } else {
      alert("Invalid credentials!");
    }
  };

  const writingEmail = (e) => {
    setEmail(e.target.value);
  };

  const writingPassword = (e) => {
    setPassword(e.target.value);
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2 className="mb-3">Login</h2>

      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={writingEmail}
        className="form-control mb-2"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={writingPassword}
        className="form-control mb-3"
      />

      <button type="submit" className="btn btn-primary w-100">
        Login
      </button>
    </form>
  );
}

export default LoginForm;

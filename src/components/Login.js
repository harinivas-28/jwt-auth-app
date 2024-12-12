import React, { useState } from "react";
import axios from "axios";
import './Form.css'

function Login({ onLogin }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://f5b4-2401-4900-4e0b-21d3-7cf1-8ae2-6fcb-4bd4.ngrok-free.app/auth/login", formData);
      sessionStorage.setItem("token", response.data.token);
      onLogin(response.data.user);
      setMessage("Login successful!");
    } catch (error) {
      setMessage(error.response.data.message || "Error logging in");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">Login</button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default Login;

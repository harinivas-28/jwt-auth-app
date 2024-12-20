import React, { useState } from "react";
import axios from "axios";
import './Form.css'

function Signup() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://localhost:5000/auth/signup", formData);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.message || "Error signing up");
    }
  };

  return (
    <div>
        <form onSubmit={handleSubmit}>
        <h2>Signup</h2>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Signup</button>
        {message && <p>{message}</p>}
        </form>
    </div>
  );
}

export default Signup;

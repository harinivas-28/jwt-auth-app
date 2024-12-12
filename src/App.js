import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Signup from "./components/SignUp";
import Login from "./components/Login";
import Dashboard from "./components/DashBoard";


function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
  };

  return (
    <Router>
      <nav>
        <Link to="/signup">Signup</Link><>     </>
        <Link to="/login">Login</Link><>   </>
        {user && <Link to="/dashboard">Dashboard</Link>}
        {user && <button onClick={handleLogout}>Logout</button>}
      </nav>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;

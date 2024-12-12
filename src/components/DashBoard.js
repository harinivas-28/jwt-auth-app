import React from "react";

function Dashboard({ user }) {
  return (
    <div>
      <h2>Welcome to {user.name}!</h2>
      <p>You have successfully logged in.</p>
    </div>
  );
}

export default Dashboard;

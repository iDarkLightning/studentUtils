import React from "react";

const Nav = () => {
  return (
    <nav className="nav-bar">
      <h2 className="navbar-title">Student Utilites</h2>
      <div className="login">
        <button className="navbar-login">Sign In</button>
        <button className="navbar-register">Register</button>
      </div>
    </nav>
  );
};

export default Nav;

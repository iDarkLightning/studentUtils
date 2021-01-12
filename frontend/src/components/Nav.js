import React from "react";

const Nav = () => {
  return (
    <nav className="nav-bar">
      <a href="/" className="nav-title-link">
        <h2 className="navbar-title">Scerep</h2>
      </a>
      <div className="nav-content">
        <div className="nav-links">
          <a href="/calculator">
            <h3>Calculators</h3>
          </a>
          <a href="/references">
            <h3>References</h3>
          </a>
          <a href="/translator">
            <h3>Translator</h3>
          </a>
          <a href="/dictionary">
            <h3>Dictionary</h3>
          </a>
        </div>
        <div className="login">
          <button className="navbar-login">Sign In</button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;

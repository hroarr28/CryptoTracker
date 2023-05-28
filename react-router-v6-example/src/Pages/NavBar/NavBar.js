import React from "react";
import "./NavBar.css";
// import {useState, useEffect} from "react";
// import {useNavigate} from "react-router-dom"
import {Link} from "react-router-dom";

function NavBar() {
  return (
    <header className='header'>
          <h1>Expense Tracker</h1>
          
      <nav className='link'>
        <ul>
          <Link to='/login'>Log In</Link>
        </ul>
      </nav>
    </header>
  );
}

export default NavBar;

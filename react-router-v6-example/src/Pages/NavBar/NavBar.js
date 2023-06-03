import React, {useEffect, useState} from "react";
import "./NavBar.css";
import {useCustomState} from "../useStates/useCustomState";
import {Link} from "react-router-dom";

function NavBar({loggedin}) {
  return (
    <header className='header'>
      <h1>Expense Tracker</h1>

      <nav className='link'>
        <ul>
          <Link to='/'>Home</Link>

          {!loggedin && <Link to='/login'>Log In</Link>}
          {loggedin && <Link to='/user'>Profile</Link>}
        </ul>
      </nav>
    </header>
  );
}

export default NavBar;

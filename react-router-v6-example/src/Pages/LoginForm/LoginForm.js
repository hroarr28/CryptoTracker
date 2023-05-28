import React from "react";
import "./LoginForm.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function LoginForm(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  
  const handleClick = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
   
      // No need to redirect here, useEffect will handle it
      navigate("/user");
    } else {
      alert("Invalid username or password");
    }
  };


  return (
    <div className='login-form'>
      <form >
        <label htmlFor='username'>Username</label>
        <input
          type='text'
          id='username'
          name='username'
          value={username}
          onChange={handleUsername}
        />
        <label htmlFor='password'>Password</label>
        <input
          type='password'
          id='password'
          name='password'
          value={password}
          onChange={handlePassword}
        />

        <button onClick={handleClick} type='submit'>Log In</button>
      </form>
    </div>
  );
}

export default LoginForm;

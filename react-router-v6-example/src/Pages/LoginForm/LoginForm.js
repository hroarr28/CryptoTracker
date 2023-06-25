import React, {useState} from "react";
import "./LoginForm.css";
import {useNavigate} from "react-router-dom";

function LoginForm({setLoggedin}) {
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
      navigate("/user");
      setLoggedin(true);
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <div className='login-form'>
      <form>
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

        <button onClick={handleClick} type='submit'>
          Log In
        </button>
      </form>
    </div>
  );
}

export default LoginForm;

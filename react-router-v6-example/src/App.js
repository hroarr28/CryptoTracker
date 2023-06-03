import "./App.css";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import NavBar from "./Pages/NavBar/NavBar";
import LoginForm from "./Pages/LoginForm/LoginForm";
import Home from "./Pages/Home/Home";
import LoggedIn from "./Pages/LoggedIn/LoggedIn";
import {useState} from "react";

function App() {
  const [loggedin, setLoggedin] = useState(false);

  return (
    <BrowserRouter>
      <NavBar loggedin={loggedin} />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route
          path='/login'
          element={<LoginForm setLoggedin={setLoggedin} />}
        />
        <Route path='/user' element={<LoggedIn />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

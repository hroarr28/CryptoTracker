import "./App.css";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import NavBar from "./Pages/NavBar/NavBar";
import LoginForm from "./Pages/LoginForm/LoginForm";
import Home from "./Pages/Home/Home";
import LoggedIn from "./Pages/LoggedIn/LoggedIn";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LoginForm />} />
        <Route path='/user' element={<LoggedIn />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import HomePage from "./page/HomePage";
import { Route, Routes, BrowserRouter as Router, useLocation } from "react-router-dom";
import LoginPage from "./page/LoginPage";
import SignupPage from "./page/SignupPage";
import { Toaster } from "react-hot-toast";
import CreatePollPage from "./page/poll/CreatePollPage";
import Navbar from "./components/User/Navbar";

function App() {
  return (
    <Router>
      <NavbarWrapper />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/"
          element={<HomePage />} />
        <Route path="/createPoll"
          element={<CreatePollPage />} />
      </Routes>
      <Toaster />
    </Router >
  );
}


function NavbarWrapper() {
  const location = useLocation()

  const noNavPaths = ['/login', '/register']

  return !noNavPaths.includes(location.pathname) ? <Navbar /> : null

}

export default App;

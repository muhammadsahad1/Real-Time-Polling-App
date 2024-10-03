import React, { useState, useEffect } from "react";
import HomePage from "./page/HomePage";
import { Route, Routes, BrowserRouter as Router, useLocation } from "react-router-dom";
import LoginPage from "./page/LoginPage";
import SignupPage from "./page/SignupPage";
import { Toaster } from "react-hot-toast";
import CreatePollPage from "./page/poll/CreatePollPage";
import Navbar from "./components/User/Navbar";
import BeatLoader from "react-spinners/BeatLoader";
import { SocketProvider } from './context/SocketContext'

function App() {

  const [loading, setLoading] = useState(false);


  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SocketProvider>
      <Router>
        <NavbarWrapper />
        {loading ? (
          <div style={spinnerStyle}>
            <BeatLoader color={"black"} loading={loading} size={15} />
          </div>
        ) : (
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<SignupPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/createPoll" element={<CreatePollPage />} />
          </Routes>
        )}

        <Toaster />
      </Router>
    </SocketProvider>
  );
}

function NavbarWrapper() {
  const location = useLocation();
  const noNavPaths = ['/login', '/register'];
  return !noNavPaths.includes(location.pathname) ? <Navbar /> : null;
}


const spinnerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  width: '100vw',
};

export default App;

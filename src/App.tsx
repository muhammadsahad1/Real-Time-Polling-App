
import HomePage from "./page/HomePage"
import { Route, Routes, BrowserRouter as Router } from "react-router-dom"
import LoginPage from "./page/LoginPage"
import SignupPage from "./page/SignupPage"
import { Toaster } from "react-hot-toast"

function App() {

  return (
    <Router>
      <Routes>
        <Toaster />
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        {/* <Navbar /> */}
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  )
}

export default App

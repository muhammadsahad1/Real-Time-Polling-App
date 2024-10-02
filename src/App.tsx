
import HomePage from "./page/HomePage"
import { Route, Routes, BrowserRouter as Router } from "react-router-dom"
import LoginPage from "./page/LoginPage"
import SignupPage from "./page/SignupPage"
import { Toaster } from "react-hot-toast"

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        {/* <Navbar /> */}
        <Route path="/" element={<HomePage />} />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App

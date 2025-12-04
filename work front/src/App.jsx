import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import { Routes, Route } from "react-router-dom"

// Import page components
import Home from "./components/pages/Home.jsx"
import Profile from "./components/pages/Profile.jsx"
import UserDashboard from "./components/pages/UserDashboard.jsx"
import Dashboard from "./components/pages/Dashboard.jsx"
import Offers from "./components/pages/Offers.jsx"
import Login from "./components/pages/Login.jsx"
import AdminDashboard from "./components/pages/AdminDashboard.jsx"
import EntrepriseDashboard from "./components/pages/EntrepriseDashboard.jsx"
import Singup from "./components/pages/Singup.jsx"
import ForgotPassWord from "./components/pages/ForgotPassWord.jsx"





function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        
  {/* principal /dashboard route renders appropriate content depending on role */}
  <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/entreprise-dashboard" element={<EntrepriseDashboard />} />
        <Route path="/offers" element={<Offers />} />
         <Route path="/Profile" element={<Profile />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Singup />} />
        <Route path="/forgot-password" element={<ForgotPassWord />} />
      </Routes>

      <Footer />
    </>
  )
}

export default App

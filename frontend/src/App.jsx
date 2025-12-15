import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import useAuth from "./components/context/useAuth"

// Import page components
import Home from "./components/pages/Home.jsx"
import Profile from "./components/pages/Profile.jsx"
import UserDashboard from "./components/pages/UserDashboard.jsx"
import Dashboard from "./components/pages/Dashboard.jsx"
import Offers from "./components/pages/Offers.jsx"
import Posts from "./components/pages/Posts.jsx"
import Login from "./components/pages/Login.jsx"
import AdminDashboard from "./components/pages/AdminDashboard.jsx"
import EntrepriseDashboard from "./components/pages/EntrepriseDashboard.jsx"
import Signup from "./components/pages/Signup.jsx"
import ForgotPassWord from "./components/pages/ForgotPassWord.jsx"

/**
 * RequireAuth Wrapper
 * Protects routes that require authentication.
 * Redirects to login if not authenticated.
 * Redirects to dashboard if role is not allowed.
 */
function RequireAuth({ children, allowedRoles }) {
  const { token, role } = useAuth()
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

/**
 * RequireGuest Wrapper
 * Protects routes that are only for guests (e.g. Login, Signup).
 * Redirects to dashboard if already authenticated.
 */
function RequireGuest({ children }) {
  const { token } = useAuth()
  if (token) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        {/* principal /dashboard route renders appropriate content depending on role */}
        <Route
          path="/dashboard"
          element={(
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          )}
        />
        <Route
          path="/user-dashboard"
          element={(
            <RequireAuth allowedRoles={["freelancer", "stagiaire"]}>
              <UserDashboard />
            </RequireAuth>
          )}
        />
        <Route
          path="/admin-dashboard"
          element={(
            <RequireAuth allowedRoles={["admin"]}>
              <AdminDashboard />
            </RequireAuth>
          )}
        />
        <Route
          path="/entreprise-dashboard"
          element={(
            <RequireAuth allowedRoles={["entreprise"]}>
              <EntrepriseDashboard />
            </RequireAuth>
          )}
        />
        <Route path="/offers" element={<Offers />} />
        <Route path="/posts" element={<Posts />} />
        <Route
          path="/Profile"
          element={(
            <RequireAuth>
              <Profile />
            </RequireAuth>
          )}
        />
        <Route
          path="/login"
          element={(
            <RequireGuest>
              <Login />
            </RequireGuest>
          )}
        />
        <Route
          path="/signup"
          element={(
            <RequireGuest>
              <Signup />
            </RequireGuest>
          )}
        />
        <Route path="/forgot-password" element={<ForgotPassWord />} />
      </Routes>

      <Footer />
    </>
  )
}

export default App

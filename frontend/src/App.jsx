import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Projects from "./pages/Projects"
import ProjectDetail from "./pages/ProjectDetail"
import Login from "./pages/Login"
import Register from "./pages/Register"

function isAuthenticated() {
  const user = localStorage.getItem("user")
  return !!user
}

// 🔒 Protected Route
function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />
}

function Sidebar() {
  const location = useLocation()

  return (
    <div className="sidebar">
      <div className="logo">InfraLog</div>

      <Link
        to="/"
        className={`nav ${location.pathname === "/" ? "active" : ""}`}
      >
        Dashboard
      </Link>

      <Link
        to="/projects"
        className={`nav ${location.pathname === "/projects" ? "active" : ""}`}
      >
        Projects
      </Link>
    </div>
  )
}

function Layout() {
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Routes>

          {/* 🔓 Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 🔒 Protected */}
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/projects" element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          } />

          <Route path="/projects/:id" element={
            <ProtectedRoute>
              <ProjectDetail />
            </ProtectedRoute>
          } />

        </Routes>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
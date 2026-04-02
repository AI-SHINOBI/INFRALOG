import "./styles.css";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Logs from "./pages/Logs";
import ProjectDetail from "./pages/ProjectDetail";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="app">
      <Sidebar />

      <div className="main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
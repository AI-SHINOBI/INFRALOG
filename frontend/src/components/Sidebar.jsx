import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo">InfraLog</div>

      <NavLink to="/" className="nav">
        Dashboard
      </NavLink>

      <NavLink to="/projects" className="nav">
        Projects
      </NavLink>
    </div>
  );
}
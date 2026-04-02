import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/projects/", {
      credentials: "include", // ✅ IMPORTANT (auth fix)
    })
      .then(res => {
        if (res.status === 302 || res.status === 403) {
          throw new Error("Unauthorized");
        }
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        return res.json();
      })
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);

        if (err.message === "Unauthorized") {
          setError("Login required. Open Django and login first.");
        } else {
          setError("API not responding");
        }

        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1 className="page-title">Projects</h1>

      {/* 🔄 Loading */}
      {loading && (
        <div className="card">
          <p className="muted">Fetching infrastructure projects...</p>
        </div>
      )}

      {/* ❌ Error */}
      {error && (
        <div className="card error-card">
          <p>{error}</p>
        </div>
      )}

      {/* 📭 Empty */}
      {!loading && !error && projects.length === 0 && (
        <div className="card empty-card">
          <p>No projects found</p>
          <span>Create one from Django panel</span>
        </div>
      )}

      {/* ✅ Projects */}
      {!loading && !error && projects.length > 0 && (
        <div className="grid">
          {projects.map(project => (
            <div
              className="card project-card"
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <h3>{project.name}</h3>

              <p className="muted">
                {new Date(project.created_at).toLocaleString()}
              </p>

              <div className="project-meta">
                <span className="status-dot"></span>
                <span>Active</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
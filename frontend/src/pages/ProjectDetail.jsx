import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProjectDetail() {
  const { id } = useParams();

  const [logs, setLogs] = useState([]);
  const [project, setProject] = useState(null);
  const [stats, setStats] = useState({
    error: 0,
    warning: 0,
    info: 0,
  });

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/projects/`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        const found = data.find(p => p.id == id);
        setProject(found);
      });

    fetch(`http://127.0.0.1:8000/api/projects/${id}/logs/`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        setLogs(data);

        let error = 0,
          warning = 0,
          info = 0;

        data.forEach(log => {
          if (log.type === "ERROR") error++;
          if (log.type === "WARNING") warning++;
          if (log.type === "INFO") info++;
        });

        setStats({ error, warning, info });
      });
  }, [id]);

  const getHealth = () => {
    if (stats.error > 5) return "Critical";
    if (stats.warning > 5) return "Moderate";
    return "Healthy";
  };

  return (
    <div>
      {/* HEADER */}
      <div className="workspace-header">
        <h1>{project?.name || "Project"}</h1>
        <span className={`status ${getHealth().toLowerCase()}`}>
          {getHealth()}
        </span>
      </div>

      {/* STATS */}
      <div className="grid">
        <div className="card stat error">
          <h3>{stats.error}</h3>
          <p>Errors</p>
        </div>

        <div className="card stat warning">
          <h3>{stats.warning}</h3>
          <p>Warnings</p>
        </div>

        <div className="card stat info">
          <h3>{stats.info}</h3>
          <p>Info Logs</p>
        </div>
      </div>

      {/* ACTIVITY FEED */}
      <div className="card">
        <h2>Activity Feed</h2>

        {logs.length === 0 && (
          <p className="muted">No activity yet</p>
        )}

        {logs.map(log => (
          <div key={log.id} className={`log-item ${log.type.toLowerCase()}`}>
            <span className="badge">{log.type}</span>
            <p>{log.message}</p>
            <small>{new Date(log.created_at).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
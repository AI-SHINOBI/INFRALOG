import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const API = "http://localhost:8000/api"

export default function ProjectDetail() {
  const { id } = useParams()

  const [project, setProject] = useState(null)
  const [logs, setLogs] = useState([])
  const [type, setType] = useState("INFO")
  const [message, setMessage] = useState("")
  const [error, setError] = useState(null)

  // ================= LOAD PROJECT =================
  const loadProject = async () => {
    if (!id) return

    try {
      const res = await fetch(`${API}/projects/${id}/`, {
        credentials: "include", // ✅ FIX
      })

      const text = await res.text()

      let json
      try {
        json = JSON.parse(text)
      } catch {
        console.error("Project not JSON:", text)
        return
      }

      if (json.success) {
        setProject(json.data)
      }
    } catch (err) {
      console.error("Project load error:", err)
      setError("Failed to load project")
    }
  }

  // ================= LOAD LOGS =================
  const loadLogs = async () => {
    if (!id) return

    try {
      const res = await fetch(`${API}/projects/${id}/logs/`, {
        credentials: "include", // ✅ FIX
      })

      const text = await res.text()

      let json
      try {
        json = JSON.parse(text)
      } catch {
        console.error("Logs not JSON:", text)
        setLogs([])
        return
      }

      if (json.success && Array.isArray(json.data)) {
        setLogs(json.data)
      } else {
        setLogs([])
      }
    } catch (err) {
      console.error("Logs load error:", err)
      setLogs([])
    }
  }

  // ================= EFFECT =================
  useEffect(() => {
    if (!id) return

    loadProject()
    loadLogs()

    const interval = setInterval(() => {
      loadLogs()
    }, 4000)

    return () => clearInterval(interval)
  }, [id])

  // ================= CREATE LOG =================
  const createLog = async () => {
    if (!message.trim() || !id) return

    try {
      const res = await fetch(`${API}/projects/${id}/logs/create/`, {
        method: "POST",
        credentials: "include", // ✅ FIX
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, message }),
      })

      const text = await res.text()
      let json

      try {
        json = JSON.parse(text)
      } catch {
        console.error("Create log bad response:", text)
        return
      }

      if (json.success) {
        setMessage("")
        loadLogs()
      }
    } catch (err) {
      console.error("Create log error:", err)
    }
  }

  // ================= DELETE LOG =================
  const deleteLog = async (logId) => {
    if (!logId) return

    try {
      const res = await fetch(`${API}/logs/${logId}/delete/`, {
        method: "POST",
        credentials: "include", // ✅ FIX
      })

      const text = await res.text()
      let json

      try {
        json = JSON.parse(text)
      } catch {
        console.error("Delete log bad response:", text)
        return
      }

      if (json.success) {
        loadLogs()
      }
    } catch (err) {
      console.error("Delete log error:", err)
    }
  }

  // ================= SAFETY =================
  if (!id) return <p>Invalid project ID</p>
  if (error) return <p>{error}</p>
  if (!project) return <p>Loading project...</p>

  // ================= ANALYSIS =================
  const errorCount = logs.filter((l) => l.type === "ERROR").length
  const warningCount = logs.filter((l) => l.type === "WARNING").length

  let analysis = "System Stable"

  if (errorCount >= 5) {
    analysis = "High error frequency detected"
  } else if (warningCount >= 5) {
    analysis = "Warnings increasing — monitor system"
  }

  return (
    <div>
      <h1>{project.name}</h1>

      {/* HEALTH */}
      <div className="card">
        <h3>Status: {project.health?.status}</h3>
        <p>Score: {project.health?.score}</p>
      </div>

      {/* ANALYSIS */}
      <div className="card">
        <h3>AI Analysis</h3>
        <p>⚡️ {analysis}</p>
        <p>Errors: {errorCount} | Warnings: {warningCount}</p>
      </div>

      {/* INSIGHTS */}
      {Array.isArray(project.insights) && project.insights.length > 0 && (
        <div className="card">
          <h3>Insights</h3>
          {project.insights.map((i, index) => (
            <p key={index}>⚡️ {i}</p>
          ))}
        </div>
      )}

      {/* ALERTS */}
      <div className="alert-container">
        {Array.isArray(project.alerts) &&
          project.alerts.map((a, i) => (
            <div key={i} className={`alert ${a.type}`}>
              {a.message}
            </div>
          ))}
      </div>

      {/* CREATE LOG */}
      <div className="card" style={{ display: "flex", gap: "10px" }}>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="INFO">INFO</option>
          <option value="WARNING">WARNING</option>
          <option value="ERROR">ERROR</option>
        </select>

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Log message..."
          style={{ flex: 1 }}
        />

        <button onClick={createLog}>Add Log</button>
      </div>

      {/* TIMELINE */}
      <div className="timeline">
        {!Array.isArray(logs) || logs.length === 0 ? (
          <p style={{ opacity: 0.6 }}>No logs yet</p>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className={`timeline-item ${log.type.toLowerCase()}`}
            >
              <div className="timeline-left">
                <div className="dot"></div>
              </div>

              <div className="timeline-content">
                <div className="timeline-header">
                  <b>{log.type}</b>
                  <span>{log.relative_time || log.created_at}</span>
                </div>

                <p>{log.message}</p>

                <button onClick={() => deleteLog(log.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
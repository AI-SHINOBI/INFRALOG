import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const API = "http://localhost:8000/api"

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [name, setName] = useState("")
  const [selected, setSelected] = useState(null)

  const navigate = useNavigate()

  // LOAD PROJECTS
  const loadProjects = async () => {
    try {
      const res = await fetch(`${API}/projects/`, {
      })

      const text = await res.text()
      let json

      try {
        json = JSON.parse(text)
      } catch {
        console.error("Projects not JSON:", text)
        setProjects([])
        return
      }

      if (json.success && Array.isArray(json.data)) {
        setProjects(json.data)
      } else {
        setProjects([])
      }
    } catch (err) {
      console.error("Load error:", err)
      setProjects([])
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  // CREATE PROJECT
  const createProject = async () => {
    if (!name.trim()) return

    try {
      const res = await fetch(`${API}/projects/create/`, {
        method: "POST",
        
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })

      const text = await res.text()
      let json

      try {
        json = JSON.parse(text)
      } catch {
        console.error("Create not JSON:", text)
        return
      }

      if (json.success) {
        setName("")
        loadProjects()
      } else {
        console.error("Create failed:", json)
        alert(json.error || "Create failed")
      }
    } catch (err) {
      console.error("Create error:", err)
    }
  }

  // DELETE PROJECT
  const deleteProject = async () => {
    if (!selected) return

    try {
      const res = await fetch(`${API}/projects/${selected}/delete/`, {
        method: "POST",
        
      })

      const text = await res.text()
      let json

      try {
        json = JSON.parse(text)
      } catch {
        console.error("Delete not JSON:", text)
        return
      }

      if (json.success) {
        setSelected(null)
        loadProjects()
      }
    } catch (err) {
      console.error("Delete error:", err)
    }
  }

  return (
    <>
      <h1>Projects</h1>

      {/* CREATE */}
      <div className="card" style={{ display: "flex", gap: "10px" }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project name..."
          style={{ flex: 1 }}
        />
        <button onClick={createProject}>Create</button>
      </div>

      {/* ACTION PANEL */}
      {selected && (
        <div className="card">
          <p>Selected: {selected}</p>

          <button onClick={() => navigate(`/projects/${selected}`)}>
            Open
          </button>

          <button
            onClick={deleteProject}
            style={{ background: "#ef4444" }}
          >
            Delete
          </button>
        </div>
      )}

      {/* PROJECT GRID */}
      <div className="grid">
        {projects.length === 0 && (
          <p style={{ opacity: 0.6 }}>No projects available</p>
        )}

        {projects.map((p) => (
          <div
            key={p.id}
            className={`card project-card ${
              selected === p.id ? "active" : ""
            }`}
            onClick={() => setSelected(p.id)}
            onDoubleClick={() => navigate(`/projects/${p.id}`)}
          >
            <h3>{p.name}</h3>
            <p>{p.created_at}</p>
          </div>
        ))}
      </div>
    </>
  )
}
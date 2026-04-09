import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

const API = "http://127.0.0.1:8000/api"

export default function Dashboard() {
  const [data, setData] = useState(null)

  const load = async () => {
    try {
      const res = await fetch(`${API}/dashboard/`)
      const json = await res.json()
      if (json.success) setData(json.data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    setTimeout(load, 0)
    const i = setInterval(load, 5000)
    return () => clearInterval(i)
  }, [])

  if (!data) return <p>Loading dashboard...</p>

  const dist = data.distribution || { error: 0, warning: 0, info: 0 }

  const chartData = [
    { name: "Errors", value: dist.error },
    { name: "Warnings", value: dist.warning },
    { name: "Info", value: dist.info },
  ]

  const COLORS = ["#ef4444", "#f59e0b", "#3b82f6"]

  // 🧠 FRONTEND INTELLIGENCE
  const total = dist.error + dist.warning + dist.info || 1
  const errorRate = Math.round((dist.error / total) * 100)

  let insight = "System Stable"
  if (errorRate > 40) insight = "Critical error spike detected"
  else if (errorRate > 20) insight = "Moderate instability"

  return (
    <>
      <h1>Dashboard</h1>

      <div className="grid">
        <div className="card stat">
          <h2>{data.total_projects}</h2>
          <p>Projects</p>
        </div>

        <div className="card stat">
          <h2>{data.total_logs}</h2>
          <p>Logs</p>
        </div>

        <div className="card stat">
          <h2>{data.health?.status}</h2>
          <p>Health</p>
        </div>
      </div>

      {/* 🧠 INSIGHT PANEL */}
      <div className="card">
        <h3>AI Insight</h3>
        <p>⚡️ {insight}</p>
        <p>Error Rate: {errorRate}%</p>
      </div>

      <div className="card" style={{ height: "320px" }}>
        <h3>Log Distribution</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} dataKey="value" outerRadius={100}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}
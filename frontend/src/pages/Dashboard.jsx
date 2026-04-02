import { useEffect, useState } from "react";
import API from "../services/api";
import Card from "../components/Card";
import StatusBadge from "../components/StatusBadge";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get("dashboard/")
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h1 style={{ marginBottom: "20px" }}>System Control Center</h1>

      {/* GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        
        <Card>
          <h3>Total Projects</h3>
          <h1>{data.total_projects}</h1>
        </Card>

        <Card>
          <h3>Total Logs</h3>
          <h1>{data.total_logs}</h1>
        </Card>

        <Card>
          <h3>Error Logs</h3>
          <h1>{data.error_count}</h1>
        </Card>

      </div>

      <Card>
        <h3>System Status</h3>
        <StatusBadge status={data.system_status} />
      </Card>
      
      {/* 🚨 ALERT PANEL */}
      {data.alerts && data.alerts.length > 0 && (
        <div className="alert-container">
          {data.alerts.map((alert, index) => (
            <div key={index} className={`alert ${alert.type.toLowerCase()}`}>
              <strong>{alert.type}</strong> — {alert.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
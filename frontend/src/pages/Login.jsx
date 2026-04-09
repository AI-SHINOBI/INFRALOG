import { useState } from "react"

const API = "http://localhost:8000/api"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  
  const handleLogin = async () => {
    if (!username || !password) {
      alert("Enter credentials")
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${API}/auth/login/`, {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const text = await res.text()

      let json
      try {
        json = JSON.parse(text)
      } catch {
        alert("Server error")
        setLoading(false)
        return
      }

      if (json.success) {
        localStorage.setItem("user", JSON.stringify(json.data))
        window.location.href = "/"
      } else {
        alert(json.error || "Login failed")
      }
    } catch (err) {
      alert("Network error")
      console.error(err)
    }

    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  )
}

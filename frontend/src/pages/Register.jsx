import { useState } from "react"

const API = "http://localhost:8000/api"

export default function Register() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    if (!username || !password) {
      alert("Enter username & password")
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${API}/auth/register/`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
        alert("Registered successfully")
        window.location.href = "/login"
      } else {
        alert(json.error || "Registration failed")
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
        <h2>Register</h2>

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

        <button onClick={handleRegister}>
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
    </div>
  )
}
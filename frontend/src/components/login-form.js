import React, { useState } from "react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.message || "Login failed")
        setIsSuccess(false)
      } else {
        setMessage("Login successful! Redirecting...")
        setIsSuccess(true)
        setEmail("")
        setPassword("")
        // TODO: handle redirect / token save
      }
    } catch (err) {
      console.error("Error:", err)
      setMessage("Something went wrong. Please check the backend.")
      setIsSuccess(false)
    } finally {
      setIsLoading(false)
    }
  }

  // --- Styles (same vibe as register) ---
  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "system-ui, -apple-system, sans-serif"
  }

  const wrapperStyle = { width: "100%", maxWidth: "450px" }

  const headerStyle = { textAlign: "center", marginBottom: "40px" }

  const titleStyle = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#15803d",
    margin: "0 0 12px 0"
  }

  const subtitleStyle = {
    color: "#16a34a",
    fontSize: "1.125rem",
    margin: "0"
  }

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "20px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    padding: "40px",
    width: "100%"
  }

  const formTitleStyle = {
    fontSize: "1.75rem",
    fontWeight: "bold",
    color: "#15803d",
    textAlign: "center",
    margin: "0 0 40px 0"
  }

  const inputGroupStyle = { marginBottom: "28px" }

  const labelStyle = {
    display: "block",
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "#15803d",
    marginBottom: "10px"
  }

  const inputStyle = {
    width: "100%",
    padding: "14px 18px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    fontSize: "16px",
    outline: "none",
    transition: "all 0.2s ease-in-out",
    color: "#374151",
    boxSizing: "border-box"
  }

  const inputFocusStyle = {
    borderColor: "#16a34a",
    boxShadow: "0 0 0 3px rgba(22, 163, 74, 0.1)"
  }

  const buttonStyle = {
    width: "100%",
    backgroundColor: isLoading ? "#9ca3af" : "#16a34a",
    color: "white",
    fontWeight: "600",
    padding: "16px 20px",
    borderRadius: "10px",
    border: "none",
    cursor: isLoading ? "not-allowed" : "pointer",
    transition: "all 0.2s ease-in-out",
    marginTop: "12px",
    fontSize: "1.1rem"
  }

  const linkContainerStyle = {
    textAlign: "center",
    marginTop: "30px",
    color: "#15803d",
    fontSize: "0.95rem"
  }

  const linkStyle = {
    fontWeight: "600",
    color: "#16a34a",
    textDecoration: "underline",
    cursor: "pointer"
  }

  const messageStyle = {
    marginBottom: "28px",
    padding: "16px 20px",
    borderRadius: "10px",
    fontWeight: "500",
    backgroundColor: isSuccess ? "#dcfce7" : "#fef2f2",
    color: isSuccess ? "#15803d" : "#dc2626",
    border: `1px solid ${isSuccess ? "#bbf7d0" : "#fecaca"}`,
    textAlign: "center"
  }

  return (
    <div style={containerStyle}>
      <div style={wrapperStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Welcome Back</h1>
          <p style={subtitleStyle}>Login to continue your journey</p>
        </div>

        <div style={cardStyle}>
          <h2 style={formTitleStyle}>Sign In</h2>

          {message && <div style={messageStyle}>{message}</div>}

          <form onSubmit={handleSubmit}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle}
                placeholder="Enter your email address"
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => {
                  e.target.style.borderColor = "#d1d5db"
                  e.target.style.boxShadow = "none"
                }}
              />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={inputStyle}
                placeholder="Enter your password"
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => {
                  e.target.style.borderColor = "#d1d5db"
                  e.target.style.boxShadow = "none"
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={buttonStyle}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = "#15803d"
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = "#16a34a"
                }
              }}
            >
              {isLoading ? "Signing In..." : "Login"}
            </button>
          </form>

          <div style={linkContainerStyle}>
            Don’t have an account?{" "}
            <a href="/register" style={linkStyle}>
              Register here
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

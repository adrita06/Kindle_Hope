import React, { useState } from "react";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Donor");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Registration failed");
        setIsSuccess(false);
      } else {
        setMessage("Registration successful!");
        setIsSuccess(true);
        setName("");
        setEmail("");
        setPassword("");
        setRole("Donor");
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("Something went wrong. Please check the backend.");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Compact Styles ---
  const containerStyle = {
    height: "100vh",
    width: "100vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)",
    fontFamily: "system-ui, -apple-system, sans-serif",
    overflow: "hidden",
    padding: "20px",
    boxSizing: "border-box"
  };

  const leftStyle = {
    flex: 1,
    paddingRight: "30px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    color: "#15803d",
    maxWidth: "45%"
  };

  const titleStyle = { fontSize: "2.5rem", fontWeight: "bold", marginBottom: "15px" };
  const subtitleStyle = { fontSize: "1.1rem", color: "#16a34a" };

  const rightStyle = {
    flex: 1,
    maxWidth: "380px",
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 20px 40px -12px rgba(0,0,0,0.25)",
    padding: "24px",
    height: "fit-content"
  };

  const formTitleStyle = { 
    fontSize: "1.5rem", 
    fontWeight: "bold", 
    color: "#15803d", 
    textAlign: "center", 
    marginBottom: "20px" 
  };
  
  const inputGroupStyle = { marginBottom: "16px" };
  const labelStyle = { 
    display: "block", 
    fontSize: "0.9rem", 
    fontWeight: "600", 
    color: "#15803d", 
    marginBottom: "6px" 
  };
  
  const inputStyle = { 
    width: "100%", 
    padding: "10px 14px", 
    border: "1px solid #d1d5db", 
    borderRadius: "8px", 
    fontSize: "15px", 
    outline: "none", 
    transition: "all 0.2s ease-in-out", 
    color: "#374151", 
    boxSizing: "border-box" 
  };
  
  const inputFocusStyle = { borderColor: "#16a34a", boxShadow: "0 0 0 3px rgba(22,163,74,0.1)" };
  
  const buttonStyle = { 
    width: "100%", 
    backgroundColor: isLoading ? "#9ca3af" : "#16a34a", 
    color: "white", 
    fontWeight: "600", 
    padding: "12px 16px", 
    borderRadius: "8px", 
    border: "none", 
    cursor: isLoading ? "not-allowed" : "pointer", 
    transition: "all 0.2s ease-in-out", 
    marginTop: "8px", 
    fontSize: "1rem" 
  };
  
  const linkContainerStyle = { 
    textAlign: "center", 
    marginTop: "16px", 
    color: "#15803d", 
    fontSize: "0.9rem" 
  };
  
  const linkStyle = { 
    fontWeight: "600", 
    color: "#16a34a", 
    textDecoration: "underline", 
    cursor: "pointer" 
  };
  
  const messageStyle = { 
    marginBottom: "16px", 
    padding: "10px 14px", 
    borderRadius: "8px", 
    fontWeight: "500", 
    backgroundColor: isSuccess ? "#dcfce7" : "#fef2f2", 
    color: isSuccess ? "#15803d" : "#dc2626", 
    border: `1px solid ${isSuccess ? "#bbf7d0" : "#fecaca"}`, 
    textAlign: "center",
    fontSize: "0.9rem"
  };

  return (
    <div style={containerStyle}>
      <div style={leftStyle}>
        <h1 style={titleStyle}>Join Our Community as Donor</h1>
        <p style={subtitleStyle}>Register for the donation management system</p>
      </div>

      <div style={rightStyle}>
        <h2 style={formTitleStyle}>Create Account</h2>
        {message && <div style={messageStyle}>{message}</div>}
        <div onSubmit={handleSubmit}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              style={inputStyle} 
              placeholder="Enter your full name" 
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)} 
              onBlur={(e) => { 
                e.target.style.borderColor = "#d1d5db"; 
                e.target.style.boxShadow = "none"; 
              }} 
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={inputStyle} 
              placeholder="Enter your email" 
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)} 
              onBlur={(e) => { 
                e.target.style.borderColor = "#d1d5db"; 
                e.target.style.boxShadow = "none"; 
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
              placeholder="Create a secure password" 
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)} 
              onBlur={(e) => { 
                e.target.style.borderColor = "#d1d5db"; 
                e.target.style.boxShadow = "none"; 
              }} 
            />
          </div>

          <button type="submit" disabled={isLoading} style={buttonStyle} onClick={handleSubmit}>
            {isLoading ? "Creating Account..." : "Register"}
          </button>
        </div>
        <div style={linkContainerStyle}>
          Already have an account? <a href="/login" style={linkStyle}>Sign in here</a>
        </div>
      </div>
    </div>
  );
}
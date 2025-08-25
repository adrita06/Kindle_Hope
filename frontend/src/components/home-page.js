import React from "react"
import { useNavigate } from "react-router-dom"

export default function HomePage() {
  const navigate = useNavigate()

  const handleJoinCommunity = () => {
    navigate('/register')
  }

  const handleSignIn = () => {
    navigate('/login')
  }

  const containerStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)",
    padding: "40px 20px",
    fontFamily: "system-ui, -apple-system, sans-serif"
  }

  const headerStyle = {
    textAlign: "center",
    marginBottom: "60px"
  }

  const titleStyle = {
    fontSize: "3.5rem",
    fontWeight: "bold",
    color: "#15803d",
    marginBottom: "20px",
    margin: "0 0 20px 0"
  }

  const subtitleStyle = {
    fontSize: "1.5rem",
    color: "#16a34a",
    marginBottom: "40px",
    margin: "0 0 40px 0"
  }

  const contentStyle = {
    maxWidth: "800px",
    margin: "0 auto",
    backgroundColor: "white",
    borderRadius: "20px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    padding: "50px",
    textAlign: "center"
  }

  const descriptionStyle = {
    fontSize: "1.125rem",
    color: "#374151",
    lineHeight: "1.8",
    marginBottom: "40px"
  }

  const buttonContainerStyle = {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    flexWrap: "wrap"
  }

  const primaryButtonStyle = {
    backgroundColor: "#16a34a",
    color: "white",
    padding: "15px 30px",
    borderRadius: "10px",
    border: "none",
    fontSize: "1.125rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out"
  }

  const secondaryButtonStyle = {
    backgroundColor: "transparent",
    color: "#16a34a",
    padding: "15px 30px",
    borderRadius: "10px",
    border: "2px solid #16a34a",
    fontSize: "1.125rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out"
  }

  const featuresStyle = {
    marginTop: "60px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "30px"
  }

  const featureCardStyle = {
    backgroundColor: "#f0fdf4",
    padding: "30px",
    borderRadius: "15px",
    border: "1px solid #bbf7d0"
  }

  const featureIconStyle = {
    fontSize: "2rem",
    marginBottom: "15px"
  }

  const featureTitleStyle = {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "#15803d",
    marginBottom: "10px",
    margin: "0 0 10px 0"
  }

  const featureDescStyle = {
    color: "#374151",
    lineHeight: "1.6"
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Welcome to Kindle Hope</h1>
        <p style={subtitleStyle}>Making a difference through community-driven donations</p>
      </div>

      <div style={contentStyle}>
        <p style={descriptionStyle}>
          Join our community-driven donation management platform where kindness meets efficiency. 
          Connect with those in need, contribute to meaningful causes, and track the impact of your generosity.
        </p>

        <div style={buttonContainerStyle}>
          <button 
            onClick={handleJoinCommunity}
            style={primaryButtonStyle}
            onMouseOver={(e) => e.target.style.backgroundColor = "#15803d"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#16a34a"}
          >
            Join Our Community
          </button>
          <button 
            onClick={handleSignIn}
            style={secondaryButtonStyle}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#16a34a"
              e.target.style.color = "white"
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "transparent"
              e.target.style.color = "#16a34a"
            }}
          >
            Sign In
          </button>
        </div>

        <div style={featuresStyle}>
          <div style={featureCardStyle}>
            <div style={featureIconStyle}>🤝</div>
            <h3 style={featureTitleStyle}>Community Driven</h3>
            <p style={featureDescStyle}>
              Connect with donors and trustable organizations to build a stronger, more supportive community.
            </p>
          </div>
          
          <div style={featureCardStyle}>
            <div style={featureIconStyle}>💝</div>
            <h3 style={featureTitleStyle}>Easy Donations</h3>
            <p style={featureDescStyle}>
              Simple and secure donation process that makes helping others effortless and transparent.
            </p>
          </div>
          
          <div style={featureCardStyle}>
            <div style={featureIconStyle}>📊</div>
            <h3 style={featureTitleStyle}>Track Impact</h3>
            <p style={featureDescStyle}>
              See the real impact of your contributions and how they're making a difference in people's lives.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
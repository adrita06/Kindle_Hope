import React, { useEffect, useState } from "react";

export function HomePage() {
  const [causes, setCauses] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCauses();
  }, []);

  const loadCauses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/causes"); // public endpoint
      const data = await res.json();
      if (res.ok) {
        setCauses(data);
      } else {
        setMessage(data.message || "Failed to fetch causes");
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong while fetching causes");
    }
  };

  // --- Styles ---
  const container = { padding: "20px", fontFamily: "Arial, sans-serif" };
  const header = { textAlign: "center", marginBottom: "30px", color: "#1f2937" };
  const causesGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  };
  const causeCard = {
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    backgroundColor: "white",
  };
  const messageStyle = {
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "20px",
    backgroundColor: "#fef3c7",
    color: "#b45309",
    textAlign: "center",
  };

  return (
    <div style={container}>
      <h1 style={header}>🌟 Welcome to Our Causes</h1>
      {message && <div style={messageStyle}>{message}</div>}
      <div style={causesGrid}>
        {causes.map((c) => (
          <div key={c.cause_id} style={causeCard}>
            <h3>{c.title}</h3>
            <p>{c.description}</p>
            <p>
              <strong>Goal:</strong> ${c.goal_amount} | <strong>Collected:</strong> $
              {c.collected_amount || 0}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

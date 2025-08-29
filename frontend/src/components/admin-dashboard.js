import React, { useEffect, useState } from "react";

export function AdminDashboard() {
  const [causes, setCauses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadCauses();
  }, []);

  const loadCauses = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/causes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCauses(data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load causes.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCause = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/admin/causes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, goal_amount: goal }),
      });
      const data = await res.json();
      if (data.message) setMessage(data.message);
      setTitle("");
      setDescription("");
      setGoal("");
      loadCauses();
    } catch (err) {
      console.error(err);
      setMessage("Failed to add cause.");
    }
  };

const handleRunRecurring = async () => {
  try {
    setIsLoading(true);
    console.log('Making request to:', "http://localhost:5000/api/recurringDonation/run-recurring");
    
    const res = await fetch("http://localhost:5000/api/recurringDonation/run-recurring", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    
    console.log('Response status:', res.status);
    console.log('Response ok:', res.ok);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
    
    const data = await res.json();
    console.log('Success response:', data);
    alert(data.message || "Recurring donations processed!");
  } catch (err) {
    console.error('Full error:', err);
    alert(`Failed to run recurring payments: ${err.message}`);
  } finally {
    setIsLoading(false);
  }
};

  const formatNumber = (num) => new Intl.NumberFormat().format(num || 0);
  const calculateProgress = (collected, goal) => (goal ? (collected / goal) * 100 : 0);

  return (
    <div style={{ padding: "20px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1 style={{ fontSize: "1.8rem", color: "#1e293b", marginBottom: "4px", fontWeight: "600" }}>Admin Dashboard</h1>
          <button
            onClick={handleRunRecurring}
            disabled={isLoading}
            style={{
              backgroundColor: "#10b981",
              color: "white",
              padding: "8px 16px",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              fontWeight: "500",
              marginTop: "12px",
              opacity: isLoading ? 0.6 : 1,
            }}
            onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = "#059669")}
            onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = "#10b981")}
          >
            {isLoading ? "Processing..." : "Send Recurring Payments"}
          </button>
           <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Manage your causes</p>
        </div>

        {/* Message */}
        {message && <div style={{ padding: "10px 16px", borderRadius: "8px", marginBottom: "20px", backgroundColor: "#dcfce7", color: "#15803d", textAlign: "center", fontSize: "0.9rem" }}>{message}</div>}

        {/* Add Cause Form */}
        <div style={{ backgroundColor: "#f9fafb", padding: "20px", borderRadius: "8px", marginBottom: "24px", border: "1px solid #e5e7eb" }}>
          <h2 style={{ color: "#374151", fontSize: "1.2rem", fontWeight: "600", marginBottom: "16px" }}>Add New Cause</h2>
          <form onSubmit={handleAddCause} style={{ display: "grid", gap: "16px" }}>
            <input
              style={{ padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "6px" }}
              placeholder="Cause title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              style={{ padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "6px" }}
              type="number"
              placeholder="Goal amount..."
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              required
            />
            <textarea
              style={{ padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: "6px", minHeight: "60px" }}
              placeholder="Description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <button type="submit" style={{ backgroundColor: "#2563eb", color: "white", padding: "8px 16px", borderRadius: "6px", border: "none", fontWeight: "500", cursor: "pointer" }}>
              Add Cause
            </button>
          </form>
        </div>

        {/* Causes Grid */}
        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>Processing...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            {causes.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#9ca3af", gridColumn: "1 / -1" }}>
                <div style={{ fontSize: "2rem", marginBottom: "8px" }}>📝</div>
                <h3>No causes yet</h3>
                <p>Add your first cause using the form above</p>
              </div>
            ) : (
              causes.map((cause) => {
                const progress = calculateProgress(cause.collected_amount, cause.goal_amount);
                return (
                  <div key={cause.cause_id} style={{ backgroundColor: "white", borderRadius: "8px", padding: "16px", border: "1px solid #e5e7eb" }}>
                    <h3 style={{ color: "#1f2937", fontSize: "1.1rem", fontWeight: "600", marginBottom: "8px" }}>{cause.title}</h3>
                    <p style={{ color: "#6b7280", fontSize: "0.85rem", lineHeight: "1.4", marginBottom: "12px" }}>{cause.description}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: "1px solid #f3f4f6" }}>
                      <div style={{ textAlign: "center", fontSize: "0.8rem" }}>
                        <div style={{ fontSize: "1rem", fontWeight: "600", color: "#059669" }}>${formatNumber(cause.goal_amount)}</div>
                        <div style={{ fontSize: "0.7rem", color: "#9ca3af", textTransform: "uppercase" }}>Goal</div>
                      </div>
                      <div style={{ textAlign: "center", fontSize: "0.8rem" }}>
                        <div style={{ fontSize: "1rem", fontWeight: "600", color: "#059669" }}>${formatNumber(cause.collected_amount)}</div>
                        <div style={{ fontSize: "0.7rem", color: "#9ca3af", textTransform: "uppercase" }}>Collected</div>
                      </div>
                      <div style={{ textAlign: "center", fontSize: "0.8rem" }}>
                        <div style={{ fontSize: "1rem", fontWeight: "600", color: "#059669" }}>{progress.toFixed(1)}%</div>
                        <div style={{ fontSize: "0.7rem", color: "#9ca3af", textTransform: "uppercase" }}>Progress</div>
                      </div>
                    </div>
                    <div style={{ width: "100%", height: "4px", backgroundColor: "#f3f4f6", borderRadius: "2px", marginTop: "8px", overflow: "hidden" }}>
                      <div style={{ height: "100%", backgroundColor: "#10b981", width: `${Math.min(progress, 100)}%`, borderRadius: "2px", transition: "width 0.3s ease" }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

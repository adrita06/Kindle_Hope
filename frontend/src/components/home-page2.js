import React, { useEffect, useState } from "react";

export function HomePage2() {
  const [causes, setCauses] = useState([]);
  const [message, setMessage] = useState("");
  const [donateCause, setDonateCause] = useState(null);
  const [donateAmount, setDonateAmount] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [recurring, setRecurring] = useState(false);
  const [frequency, setFrequency] = useState("monthly");
  const [donateMessage, setDonateMessage] = useState("");

  useEffect(() => {
    loadCauses();
  }, []);

  const loadCauses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/causes");
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

  const handleDonate = async () => {
    const token = localStorage.getItem("token"); // must be logged in
    if (!token) {
      setDonateMessage("You must be logged in to donate.");
      return;
    }

    if (!donateAmount || isNaN(donateAmount) || donateAmount <= 0) {
      setDonateMessage("Please enter a valid amount.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cause_id: donateCause.cause_id,
          amount: donateAmount,
          anonymous,
          recurring,
          frequency,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setDonateMessage(data.message || "Donation failed");
      } else {
        setDonateMessage("Donation successful! Thank you 💚");
        setDonateCause(null);
        setDonateAmount("");
        setAnonymous(false);
        setRecurring(false);
        loadCauses(); // refresh causes
      }
    } catch (err) {
      console.error(err);
      setDonateMessage("Something went wrong. Please try again.");
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
  const donateModal = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  };
  const modalContent = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "300px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
  };
  const inputStyle = { width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #ccc" };
  const checkboxLabel = { display: "block", marginBottom: "8px" };
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
            <button onClick={() => setDonateCause(c)}>Donate 💚</button>
          </div>
        ))}
      </div>

      {donateCause && (
        <div style={donateModal} onClick={() => setDonateCause(null)}>
          <div style={modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>Donate to {donateCause.title}</h3>
            <input
              type="number"
              placeholder="Enter amount"
              value={donateAmount}
              onChange={(e) => setDonateAmount(e.target.value)}
              style={inputStyle}
            />
            <label style={checkboxLabel}>
              <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} /> Donate anonymously
            </label>
            <label style={checkboxLabel}>
              <input type="checkbox" checked={recurring} onChange={(e) => setRecurring(e.target.checked)} /> Recurring donation
            </label>
            {recurring && (
              <select value={frequency} onChange={(e) => setFrequency(e.target.value)} style={inputStyle}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            )}
            <button onClick={handleDonate}>Confirm Donate</button>
            {donateMessage && <div style={messageStyle}>{donateMessage}</div>}
            <button onClick={() => setDonateCause(null)} style={{ marginTop: "10px" }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";

export function HomePage2() {
  const [causes, setCauses] = useState([]);
  const [message, setMessage] = useState("");
  const [donateCause, setDonateCause] = useState(null);
  const [donateAmount, setDonateAmount] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [recurring, setRecurring] = useState(false);
  const [frequency, setFrequency] = useState("monthly");
  const [endDate, setEndDate] = useState(""); // ✅ new field for recurring
  const [token] = useState(localStorage.getItem("token"));

  useEffect(() => {
    loadCauses();
  }, []);

  const loadCauses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/causes");
      const data = await res.json();
      if (res.ok) setCauses(data);
      else setMessage(data.message || "Failed to fetch causes");
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong while fetching causes");
    }
  };

  const handleDonate = async () => {
    if (!token) {
      alert("You must be logged in to donate!");
      return;
    }

    try {
      const url = recurring
        ? "http://localhost:5000/api/recurringDonation/create"
        : "http://localhost:5000/api/donations";

      const bodyData = recurring
        ? {
            cause_id: donateCause.cause_id,
            amount: donateAmount,
            frequency,
            end_date: endDate,
          }
        : {
            cause_id: donateCause.cause_id,
            amount: donateAmount,
            anonymous,
          };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setDonateCause(null);
        setDonateAmount("");
        setAnonymous(false);
        setRecurring(false);
        setFrequency("monthly");
        setEndDate("");
        loadCauses();
      } else {
        alert(data.message || "Donation failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong during donation");
    }
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f0fdf4", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", color: "#15803d" }}>🌱 Welcome to Our Causes</h1>
      {message && <div style={{ color: "red", textAlign: "center" }}>{message}</div>}

      {/* Causes Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {causes.map((c) => (
          <div
            key={c.cause_id}
            style={{
              padding: "15px",
              borderRadius: "12px",
              backgroundColor: "white",
              boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
              border: "2px solid #bbf7d0",
            }}
          >
            <h3 style={{ color: "#166534" }}>{c.title}</h3>
            <p style={{ color: "#374151" }}>{c.description}</p>
            <p style={{ margin: "10px 0", color: "#065f46" }}>
              <strong>Goal:</strong> ${c.goal_amount} |{" "}
              <strong>Collected:</strong> ${c.collected_amount || 0}
            </p>
            <button
              onClick={() => setDonateCause(c)}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                backgroundColor: "#16a34a",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#15803d")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#16a34a")}
            >
              Donate
            </button>
          </div>
        ))}
      </div>

      {/* Donation Modal */}
      {donateCause && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "12px",
              width: "320px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            <h2 style={{ color: "#166534" }}>Donate to {donateCause.title}</h2>
            <input
              type="number"
              placeholder="Amount"
              value={donateAmount}
              onChange={(e) => setDonateAmount(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "10px",
                marginBottom: "10px",
                borderRadius: "8px",
                border: "1px solid #86efac",
                outlineColor: "#16a34a",
              }}
            />
            <div>
              <label style={{ color: "#374151" }}>
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                  disabled={recurring} // ✅ disable anonymous when recurring
                />{" "}
                Donate anonymously
              </label>
            </div>
            <div>
              <label style={{ color: "#374151" }}>
                <input
                  type="checkbox"
                  checked={recurring}
                  onChange={(e) => setRecurring(e.target.checked)}
                />{" "}
                Recurring donation
              </label>
              {recurring && (
                <>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    style={{
                      width: "100%",
                      marginTop: "8px",
                      borderRadius: "8px",
                      padding: "6px",
                      border: "1px solid #86efac",
                    }}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{
                      width: "100%",
                      marginTop: "8px",
                      borderRadius: "8px",
                      padding: "6px",
                      border: "1px solid #86efac",
                    }}
                  />
                </>
              )}
            </div>
            <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
              <button
                onClick={handleDonate}
                style={{
                  flex: 1,
                  padding: "8px",
                  backgroundColor: "#16a34a",
                  color: "white",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Confirm
              </button>
              <button
                onClick={() => setDonateCause(null)}
                style={{
                  flex: 1,
                  padding: "8px",
                  backgroundColor: "#dcfce7",
                  color: "#166534",
                  borderRadius: "8px",
                  border: "1px solid #86efac",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";

export function HomePage2() {
  const [causes, setCauses] = useState([]);
  const [message, setMessage] = useState("");
  const [donateCause, setDonateCause] = useState(null);
  const [donateAmount, setDonateAmount] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [recurring, setRecurring] = useState(false);
  const [frequency, setFrequency] = useState("monthly");
  const [endDate, setEndDate] = useState("");
  const [token] = useState(localStorage.getItem("token"));

  // Analytics states
  const [leaderboard, setLeaderboard] = useState([]);
  const [recurringDonations, setRecurringDonations] = useState([]);
  const [oneTimeDonations, setOneTimeDonations] = useState([]);
  const [confirmEnd, setConfirmEnd] = useState(null);

  useEffect(() => {
    loadCauses();
    loadLeaderboard();
    loadRecurringDonations();
    loadOneTimeDonations();
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

  const loadLeaderboard = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/analytics/leaderboard");
      const data = await res.json();
      if (res.ok) {
        // Convert total_donated to numbers and sort by total_donated in descending order (highest first)
        const sortedData = data.map(item => ({
          ...item,
          total_donated: parseFloat(item.total_donated) || 0
        })).sort((a, b) => b.total_donated - a.total_donated);
        setLeaderboard(sortedData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadRecurringDonations = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/analytics/recurring-donations");
      const data = await res.json();
      if (res.ok) setRecurringDonations(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadOneTimeDonations = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/analytics/onetime-donations");
      const data = await res.json();
      if (res.ok) setOneTimeDonations(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEndRecurring = async (scheduleId) => {
    if (!token) {
      alert("You must be logged in!");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/analytics/end/${scheduleId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        alert("Recurring donation ended successfully");
        loadRecurringDonations(); // Refresh the table
        loadLeaderboard(); // Refresh leaderboard if needed
        setConfirmEnd(null); // Close confirmation modal
      } else {
        alert(data.message || "Failed to end recurring donation");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  // Format date for better display
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return "-";
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
        loadLeaderboard(); // Refresh leaderboard
        loadRecurringDonations(); // Refresh recurring donations
        loadOneTimeDonations(); // Refresh one-time donations
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
                boxSizing: "border-box",
              }}
            />
            <div>
              <label style={{ color: "#374151" }}>
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                  disabled={recurring}
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
                      boxSizing: "border-box",
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
                      boxSizing: "border-box",
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

      {/* --- Analytics Section --- */}
      <div style={{ marginTop: "40px" }}>
        <h2 style={{ textAlign: "center", color: "#15803d", marginBottom: "18px" }}>
          🏆 Donor Leaderboard
        </h2>
        <div style={{
          maxWidth: "600px",
          margin: "0 auto 32px auto",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
          padding: "18px",
          overflowX: "auto"
        }}>
          <table style={{ 
            width: "100%", 
            borderCollapse: "collapse",
            minWidth: "500px"
          }}>
            <thead>
              <tr style={{ background: "#dcfce7", color: "#166534" }}>
                <th style={{ 
                  padding: "12px 8px", 
                  borderRadius: "8px 0 0 0",
                  textAlign: "center",
                  width: "60px"
                }}>
                  #
                </th>
                <th style={{ 
                  padding: "12px 8px",
                  textAlign: "left",
                  width: "120px"
                }}>
                  Donor
                </th>
                <th style={{ 
                  padding: "12px 8px",
                  textAlign: "left",
                  width: "200px"
                }}>
                  Email
                </th>
                <th style={{ 
                  padding: "12px 8px", 
                  borderRadius: "0 8px 0 0",
                  textAlign: "right",
                  width: "120px"
                }}>
                  Total Donated
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((d, i) => (
                <tr key={d.id} style={{ 
                  background: i % 2 ? "#f0fdf4" : "white",
                  borderBottom: i === leaderboard.length - 1 ? "none" : "1px solid #e5e7eb"
                }}>
                  <td style={{ 
                    padding: "10px 8px", 
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#374151"
                  }}>
                    {i + 1}
                  </td>
                  <td style={{ 
                    padding: "10px 8px",
                    textAlign: "left",
                    color: "#374151"
                  }}>
                    {d.name}
                  </td>
                  <td style={{ 
                    padding: "10px 8px",
                    textAlign: "left",
                    color: "#6b7280",
                    fontSize: "14px"
                  }}>
                    {d.email}
                  </td>
                  <td style={{ 
                    padding: "10px 8px", 
                    color: "#15803d", 
                    fontWeight: "bold",
                    textAlign: "right"
                  }}>
                    ${(d.total_donated || 0).toLocaleString()}
                  </td>
                </tr>
              ))}
              {leaderboard.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ 
                    textAlign: "center", 
                    padding: "20px", 
                    color: "#dc2626",
                    fontStyle: "italic"
                  }}>
                    No donors yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <h2 style={{ textAlign: "center", color: "#15803d", marginBottom: "18px" }}>
          🔄 Recurring Donations
        </h2>
        <div style={{
          maxWidth: "1100px",
          margin: "0 auto 32px auto",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
          padding: "18px",
          overflowX: "auto"
        }}>
          <table style={{ 
            width: "100%", 
            borderCollapse: "collapse",
            minWidth: "900px"
          }}>
            <thead>
              <tr style={{ background: "#dcfce7", color: "#166534" }}>
                <th style={{ 
                  padding: "12px 8px",
                  textAlign: "left",
                  width: "130px"
                }}>
                  Donor
                </th>
                <th style={{ 
                  padding: "12px 8px",
                  textAlign: "left",
                  width: "180px"
                }}>
                  Cause
                </th>
                <th style={{ 
                  padding: "12px 8px",
                  textAlign: "right",
                  width: "100px"
                }}>
                  Amount
                </th>
                <th style={{ 
                  padding: "12px 8px",
                  textAlign: "center",
                  width: "100px"
                }}>
                  Frequency
                </th>
                <th style={{ 
                  padding: "12px 8px",
                  textAlign: "center",
                  width: "140px"
                }}>
                  Next Payment
                </th>
                <th style={{ 
                  padding: "12px 8px",
                  textAlign: "center",
                  width: "80px"
                }}>
                  Status
                </th>
                <th style={{ 
                  padding: "12px 8px",
                  textAlign: "center",
                  width: "80px"
                }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {recurringDonations.map((row, i) => (
                <tr key={row.schedule_id} style={{ 
                  background: i % 2 ? "#f0fdf4" : "white",
                  borderBottom: i === recurringDonations.length - 1 ? "none" : "1px solid #e5e7eb"
                }}>
                  <td style={{ 
                    padding: "10px 8px",
                    textAlign: "left",
                    color: "#374151",
                    fontWeight: "500"
                  }}>
                    {row.donor_name}
                  </td>
                  <td style={{ 
                    padding: "10px 8px",
                    textAlign: "left",
                    color: "#374151"
                  }}>
                    {row.cause_title}
                  </td>
                  <td style={{ 
                    padding: "10px 8px", 
                    color: "#15803d", 
                    fontWeight: "bold",
                    textAlign: "right"
                  }}>
                    ${(row.amount || 0).toLocaleString()}
                  </td>
                  <td style={{ 
                    padding: "10px 8px",
                    textAlign: "center",
                    color: "#374151",
                    textTransform: "capitalize"
                  }}>
                    {row.frequency}
                  </td>
                  <td style={{ 
                    padding: "10px 8px",
                    textAlign: "center",
                    color: "#6b7280",
                    fontSize: "14px"
                  }}>
                    {formatDate(row.next_payment_date)}
                  </td>
                  <td style={{
                    padding: "10px 8px",
                    textAlign: "center",
                    color: row.status === "Active" ? "#16a34a" : "#dc2626",
                    fontWeight: "bold",
                    fontSize: "14px"
                  }}>
                    {row.status}
                  </td>
                  <td style={{ 
                    padding: "10px 8px",
                    textAlign: "center"
                  }}>
                    {row.status === "Active" && (
                      <button
                        onClick={() => setConfirmEnd(row)}
                        style={{
                          padding: "4px 8px",
                          backgroundColor: "#dc2626",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: "bold"
                        }}
                        onMouseOver={(e) => (e.target.style.backgroundColor = "#b91c1c")}
                        onMouseOut={(e) => (e.target.style.backgroundColor = "#dc2626")}
                      >
                        End
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {recurringDonations.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ 
                    textAlign: "center", 
                    padding: "20px", 
                    color: "#dc2626",
                    fontStyle: "italic"
                  }}>
                    No recurring donations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <h2 style={{ textAlign: "center", color: "#15803d", marginBottom: "18px" }}>
          💰 One-Time Donations
        </h2>
        <div style={{
          maxWidth: "800px",
          margin: "0 auto",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
          padding: "18px",
          overflowX: "auto"
        }}>
          <table style={{ 
            width: "100%", 
            borderCollapse: "collapse",
            minWidth: "600px"
          }}>
            <thead>
              <tr style={{ background: "#dcfce7", color: "#166534" }}>
                <th style={{ 
                  padding: "12px 8px",
                  textAlign: "left",
                  width: "150px"
                }}>
                  Donor
                </th>
                <th style={{ 
                  padding: "12px 8px",
                  textAlign: "left",
                  width: "200px"
                }}>
                  Cause
                </th>
                <th style={{ 
                  padding: "12px 8px",
                  textAlign: "right",
                  width: "100px"
                }}>
                  Amount
                </th>
                <th style={{ 
                  padding: "12px 8px",
                  textAlign: "center",
                  width: "140px"
                }}>
                  Date
                </th>
                <th style={{ 
                  padding: "12px 8px",
                  textAlign: "center",
                  width: "100px"
                }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {oneTimeDonations.map((row, i) => (
                <tr key={row.donation_id} style={{ 
                  background: i % 2 ? "#f0fdf4" : "white",
                  borderBottom: i === oneTimeDonations.length - 1 ? "none" : "1px solid #e5e7eb"
                }}>
                  <td style={{ 
                    padding: "10px 8px",
                    textAlign: "left",
                    color: "#374151",
                    fontWeight: "500"
                  }}>
                    {row.donor_name}
                  </td>
                  <td style={{ 
                    padding: "10px 8px",
                    textAlign: "left",
                    color: "#374151"
                  }}>
                    {row.cause_title}
                  </td>
                  <td style={{ 
                    padding: "10px 8px", 
                    color: "#15803d", 
                    fontWeight: "bold",
                    textAlign: "right"
                  }}>
                    ${(row.amount || 0).toLocaleString()}
                  </td>
                  <td style={{ 
                    padding: "10px 8px",
                    textAlign: "center",
                    color: "#6b7280",
                    fontSize: "14px"
                  }}>
                    {formatDate(row.created_at)}
                  </td>
                  <td style={{
                    padding: "10px 8px",
                    textAlign: "center",
                    color: "#059669",
                    fontWeight: "bold",
                    fontSize: "14px"
                  }}>
                    Completed
                  </td>
                </tr>
              ))}
              {oneTimeDonations.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ 
                    textAlign: "center", 
                    padding: "20px", 
                    color: "#dc2626",
                    fontStyle: "italic"
                  }}>
                    No one-time donations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* End Recurring Donation Confirmation Modal */}
      {confirmEnd && (
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
              width: "400px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            <h2 style={{ color: "#dc2626", marginBottom: "10px" }}>⚠️ End Recurring Donation</h2>
            <p style={{ color: "#374151", marginBottom: "15px" }}>
              Are you sure you want to end the recurring donation of <strong>${confirmEnd.amount}</strong> {confirmEnd.frequency} to <strong>{confirmEnd.cause_title}</strong>?
            </p>
            <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "20px" }}>
              This action cannot be undone. You can always create a new recurring donation later.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => handleEndRecurring(confirmEnd.schedule_id)}
                style={{
                  flex: 1,
                  padding: "10px",
                  backgroundColor: "#dc2626",
                  color: "white",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                Yes, End Donation
              </button>
              <button
                onClick={() => setConfirmEnd(null)}
                style={{
                  flex: 1,
                  padding: "10px",
                  backgroundColor: "#f3f4f6",
                  color: "#374151",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
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
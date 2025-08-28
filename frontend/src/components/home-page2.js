import React, { useEffect, useState } from "react";

export  function HomePage2() {
  const [causes, setCauses] = useState([]);
  const [message, setMessage] = useState("");
  const [donateCause, setDonateCause] = useState(null);
  const [donateAmount, setDonateAmount] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [recurring, setRecurring] = useState(false);
  const [frequency, setFrequency] = useState("monthly");
  const [token, setToken] = useState(localStorage.getItem("token"));

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
      const res = await fetch("http://localhost:5000/api/donate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
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
      if (res.ok) {
        alert(data.message);
        setDonateCause(null);
        setDonateAmount("");
        loadCauses(); // refresh collected_amount
      } else {
        alert(data.message || "Donation failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong during donation");
    }
  };

  // --- Styles omitted for brevity ---

  return (
    <div style={{ padding: "20px" }}>
      <h1>🌟 Welcome to Our Causes</h1>
      {message && <div>{message}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
        {causes.map((c) => (
          <div key={c.cause_id} style={{ padding: "15px", borderRadius: "10px", backgroundColor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <h3>{c.title}</h3>
            <p>{c.description}</p>
            <p><strong>Goal:</strong> ${c.goal_amount} | <strong>Collected:</strong> ${c.collected_amount || 0}</p>
            <button onClick={() => setDonateCause(c)}>Donate</button>
          </div>
        ))}
      </div>

      {donateCause && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "10px", width: "300px" }}>
            <h2>Donate to {donateCause.title}</h2>
            <input type="number" placeholder="Amount" value={donateAmount} onChange={e => setDonateAmount(e.target.value)} />
            <div>
              <label>
                <input type="checkbox" checked={anonymous} onChange={e => setAnonymous(e.target.checked)} />
                Donate anonymously
              </label>
            </div>
            <div>
              <label>
                <input type="checkbox" checked={recurring} onChange={e => setRecurring(e.target.checked)} />
                Recurring donation
              </label>
              {recurring && (
                <select value={frequency} onChange={e => setFrequency(e.target.value)}>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              )}
            </div>
            <button onClick={handleDonate}>Confirm Donation</button>
            <button onClick={() => setDonateCause(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";

export default function HomePage2() {
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
    const token = localStorage.getItem("token");
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
        setDonateMessage("✅ Donation successful! Thank you 💚");
        setDonateCause(null);
        setDonateAmount("");
        setAnonymous(false);
        setRecurring(false);
        loadCauses();
      }
    } catch (err) {
      console.error(err);
      setDonateMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="p-6 font-sans bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        🌟 Welcome to Our Causes
      </h1>

      {message && (
        <div className="bg-yellow-100 text-yellow-700 p-3 rounded-lg mb-4 text-center">
          {message}
        </div>
      )}

      {/* Causes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {causes.map((c) => (
          <div
            key={c.cause_id}
            className="bg-white rounded-xl shadow-md p-5 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{c.title}</h3>
              <p className="text-gray-600 text-sm mt-2">{c.description}</p>
              <p className="mt-3 text-gray-700">
                <strong>Goal:</strong> ${c.goal_amount} |{" "}
                <strong>Collected:</strong> ${c.collected_amount || 0}
              </p>
            </div>
            <button
              onClick={() => setDonateCause(c)}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Donate 💚
            </button>
          </div>
        ))}
      </div>

      {/* Donate Modal */}
      {donateCause && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 relative">
            <h3 className="text-lg font-bold mb-4">
              Donate to {donateCause.title}
            </h3>

            <input
              type="number"
              placeholder="Enter amount"
              value={donateAmount}
              onChange={(e) => setDonateAmount(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            />

            <label className="block mb-2">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="mr-2"
              />
              Donate anonymously
            </label>

            <label className="block mb-2">
              <input
                type="checkbox"
                checked={recurring}
                onChange={(e) => setRecurring(e.target.checked)}
                className="mr-2"
              />
              Recurring donation
            </label>

            {recurring && (
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full border p-2 rounded mb-3"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            )}

            {donateMessage && (
              <div className="bg-blue-100 text-blue-700 p-2 rounded text-sm mb-3">
                {donateMessage}
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={handleDonate}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Confirm Donate
              </button>
              <button
                onClick={() => setDonateCause(null)}
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
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

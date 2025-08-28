import React, { useEffect, useState } from "react";

export function AdminDashboard() {
  const [causes, setCauses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadCauses();
  }, []);

  const loadCauses = async () => {
    const res = await fetch("http://localhost:5000/api/admin/causes", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setCauses(data);
  };

  const handleAddCause = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/admin/causes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description, goal_amount: goal }),
    });
    const data = await res.json();
    alert(data.message);
    loadCauses();
    setTitle("");
    setDescription("");
    setGoal("");
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <form onSubmit={handleAddCause}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          placeholder="Goal Amount"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
        <button type="submit">Add Cause</button>
      </form>

      <h3>All Causes</h3>
      <ul>
        {causes.map((c) => (
          <li key={c.cause_id}>
            {c.title} - Goal: {c.goal_amount} | Collected: {c.collected_amount}
          </li>
        ))}
      </ul>
    </div>
  );
}

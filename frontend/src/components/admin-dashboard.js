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
      // Demo data for fallback
      setCauses([
        {
          cause_id: 1,
          title: "Clean Water Initiative",
          description: "Providing clean water access to rural communities in developing countries.",
          goal_amount: 50000,
          collected_amount: 32000
        },
        {
          cause_id: 2,
          title: "Education for All",
          description: "Supporting educational programs for underprivileged children.",
          goal_amount: 25000,
          collected_amount: 18500
        }
      ]);
    }
    setIsLoading(false);
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

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num || 0);
  };

  const calculateProgress = (collected, goal) => {
    return goal ? (collected / goal) * 100 : 0;
  };

  // Compact styles
  const styles = {
    container: {
      padding: "20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "#f8fafc",
      minHeight: "auto",
    },
    
    mainContent: {
      maxWidth: "900px",
      margin: "0 auto",
      background: "white",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e2e8f0",
    },

    header: {
      textAlign: "center",
      marginBottom: "24px",
    },

    headerTitle: {
      fontSize: "1.8rem",
      color: "#1e293b",
      marginBottom: "4px",
      fontWeight: "600",
    },

    headerSubtitle: {
      color: "#64748b",
      fontSize: "0.9rem",
    },

    message: {
      padding: "10px 16px",
      borderRadius: "8px",
      marginBottom: "20px",
      backgroundColor: "#dcfce7",
      color: "#15803d",
      textAlign: "center",
      fontSize: "0.9rem",
    },

    formContainer: {
      backgroundColor: "#f9fafb",
      padding: "20px",
      borderRadius: "8px",
      marginBottom: "24px",
      border: "1px solid #e5e7eb",
    },

    formHeader: {
      marginBottom: "16px",
    },

    formHeaderTitle: {
      color: "#374151",
      fontSize: "1.2rem",
      fontWeight: "600",
      margin: "0",
    },

    formGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "16px",
      marginBottom: "16px",
    },

    formGroup: {
      display: "flex",
      flexDirection: "column",
    },

    formGroupFull: {
      display: "flex",
      flexDirection: "column",
      gridColumn: "1 / -1",
    },

    label: {
      fontWeight: "500",
      color: "#374151",
      marginBottom: "4px",
      fontSize: "0.85rem",
    },

    input: {
      padding: "8px 12px",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      fontSize: "0.9rem",
      outline: "none",
      transition: "border-color 0.2s",
    },

    inputFocus: {
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 1px #3b82f6",
    },

    textarea: {
      padding: "8px 12px",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      fontSize: "0.9rem",
      outline: "none",
      resize: "vertical",
      minHeight: "60px",
      transition: "border-color 0.2s",
    },

    submitBtn: {
      backgroundColor: "#2563eb",
      color: "white",
      border: "none",
      padding: "8px 16px",
      borderRadius: "6px",
      fontSize: "0.9rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "background-color 0.2s",
    },

    submitBtnHover: {
      backgroundColor: "#2563eb",
    },

    causesSection: {
      marginTop: "24px",
    },

    sectionHeader: {
      marginBottom: "16px",
    },

    sectionHeaderTitle: {
      color: "#374151",
      fontSize: "1.2rem",
      fontWeight: "600",
      margin: "0",
    },

    causesGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "16px",
    },

    causeCard: {
      backgroundColor: "white",
      borderRadius: "8px",
      padding: "16px",
      border: "1px solid #e5e7eb",
      transition: "box-shadow 0.2s",
    },

    causeCardHover: {
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    },

    causeTitle: {
      color: "#1f2937",
      fontSize: "1.1rem",
      fontWeight: "600",
      marginBottom: "8px",
      margin: "0 0 8px 0",
    },

    causeDescription: {
      color: "#6b7280",
      fontSize: "0.85rem",
      lineHeight: "1.4",
      marginBottom: "12px",
    },

    causeStats: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "8px 0",
      borderTop: "1px solid #f3f4f6",
    },

    stat: {
      textAlign: "center",
      fontSize: "0.8rem",
    },

    statValue: {
      fontSize: "1rem",
      fontWeight: "600",
      color: "#059669",
    },

    statLabel: {
      fontSize: "0.7rem",
      color: "#9ca3af",
      textTransform: "uppercase",
    },

    progressBar: {
      width: "100%",
      height: "4px",
      backgroundColor: "#f3f4f6",
      borderRadius: "2px",
      marginTop: "8px",
      overflow: "hidden",
    },

    progressFill: {
      height: "100%",
      backgroundColor: "#10b981",
      borderRadius: "2px",
      transition: "width 0.3s ease",
    },

    loading: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
    },

    spinner: {
      width: "20px",
      height: "20px",
      border: "2px solid #f3f4f6",
      borderTop: "2px solid #3b82f6",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },

    emptyState: {
      textAlign: "center",
      padding: "40px 20px",
      color: "#9ca3af",
      gridColumn: "1 / -1",
    },

    emptyStateIcon: {
      fontSize: "2rem",
      marginBottom: "8px",
    },
  };

  // Remove CSS animations - keep it simple
  const cssAnimation = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <>
      <style>{cssAnimation}</style>
      <div style={styles.container}>
        <div style={styles.mainContent}>
          <div style={styles.header}>
            <h1 style={styles.headerTitle}>Admin Dashboard</h1>
            <p style={styles.headerSubtitle}>Manage your causes</p>
          </div>
          
          {message && <div style={styles.message}>{message}</div>}

          <div style={styles.formContainer}>
            <div style={styles.formHeader}>
              <h2 style={styles.formHeaderTitle}>Add New Cause</h2>
            </div>
            
            <form onSubmit={handleAddCause}>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="title">Cause Title</label>
                  <input
                    style={styles.input}
                    id="title"
                    placeholder="Enter cause title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                    onBlur={(e) => Object.assign(e.target.style, styles.input)}
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="goal">Goal Amount ($)</label>
                  <input
                    style={styles.input}
                    id="goal"
                    placeholder="Enter goal amount..."
                    type="number"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    required
                    onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                    onBlur={(e) => Object.assign(e.target.style, styles.input)}
                  />
                </div>
                
                <div style={styles.formGroupFull}>
                  <label style={styles.label} htmlFor="description">Cause Description</label>
                  <textarea
                    style={styles.textarea}
                    id="description"
                    placeholder="Describe your cause in detail..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                    onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                    onBlur={(e) => Object.assign(e.target.style, styles.textarea)}
                  />
                </div>
              </div>
              
              <button
                type="submit"
                style={styles.submitBtn}
                onMouseEnter={(e) => Object.assign(e.target.style, styles.submitBtnHover)}
                onMouseLeave={(e) => Object.assign(e.target.style, styles.submitBtn)}
              >
                Add Cause
              </button>
            </form>
          </div>

          <div style={styles.causesSection}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionHeaderTitle}>All Causes</h2>
            </div>
            
            {isLoading ? (
              <div style={styles.loading}>
                <div style={styles.spinner}></div>
              </div>
            ) : (
              <div style={styles.causesGrid}>
                {causes.length === 0 ? (
                  <div style={styles.emptyState}>
                    <div style={styles.emptyStateIcon}>📝</div>
                    <h3>No causes yet</h3>
                    <p>Add your first cause using the form above</p>
                  </div>
                ) : (
                  causes.map((cause) => {
                    const progress = calculateProgress(cause.collected_amount, cause.goal_amount);
                    return (
                      <div
                        key={cause.cause_id}
                        style={styles.causeCard}
                        onMouseEnter={(e) => Object.assign(e.target.style, styles.causeCardHover)}
                        onMouseLeave={(e) => Object.assign(e.target.style, styles.causeCard)}
                      >
                        <h3 style={styles.causeTitle}>{cause.title}</h3>
                        <p style={styles.causeDescription}>{cause.description}</p>
                        
                        <div style={styles.causeStats}>
                          <div style={styles.stat}>
                            <div style={styles.statValue}>${formatNumber(cause.goal_amount)}</div>
                            <div style={styles.statLabel}>Goal</div>
                          </div>
                          <div style={styles.stat}>
                            <div style={styles.statValue}>${formatNumber(cause.collected_amount)}</div>
                            <div style={styles.statLabel}>Collected</div>
                          </div>
                          <div style={styles.stat}>
                            <div style={styles.statValue}>{progress.toFixed(1)}%</div>
                            <div style={styles.statLabel}>Progress</div>
                          </div>
                        </div>
                        
                        <div style={styles.progressBar}>
                          <div 
                            style={{
                              ...styles.progressFill,
                              width: `${Math.min(progress, 100)}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
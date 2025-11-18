// src/pages/UserHistory.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";
import "./UserHistory.css";

export default function UserHistory() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!user) return;

    const historyRef = ref(db, `users/${user.uid}/history`);
    onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setHistory([]);
        return;
      }

      const temp = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));

      temp.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setHistory(temp);
    });
  }, [user]);

  // Calculate stats
  const totalPredictions = history.length;
  const avgSalary = history.length > 0
    ? Math.round(history.reduce((sum, item) => sum + parseFloat(item.predictedSalary || 0), 0) / history.length)
    : 0;
  const maxSalary = history.length > 0
    ? Math.max(...history.map(item => parseFloat(item.predictedSalary || 0)))
    : 0;
  const minSalary = history.length > 0
    ? Math.min(...history.map(item => parseFloat(item.predictedSalary || 0)))
    : 0;

  // Helper function to get experience badge
  const getExperienceBadge = (level) => {
    const badges = {
      'EN': 'badge badge-entry',
      'MI': 'badge badge-mid',
      'SE': 'badge badge-senior',
      'EX': 'badge badge-executive'
    };
    return badges[level] || 'badge';
  };

  return (
    <div className="history-container">
      <div className="history-card">
        <div className="history-header">
          <h2 className="history-title">
            <span className="history-icon">📜</span>
            Prediction History
          </h2>
          <p className="history-subtitle">Track all your salary predictions in one place</p>
        </div>

        {history.length > 0 && (
          <div className="stats-summary">
            <div className="stat-item">
              <div className="stat-value">{totalPredictions}</div>
              <div className="stat-label">Total Predictions</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">₹ {avgSalary.toLocaleString()}</div>
              <div className="stat-label">Average Salary</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">₹ {maxSalary.toLocaleString()}</div>
              <div className="stat-label">Highest Salary</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">₹ {minSalary.toLocaleString()}</div>
              <div className="stat-label">Lowest Salary</div>
            </div>
          </div>
        )}

        {history.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p className="empty-text">No prediction history found yet.</p>
            <p className="empty-text" style={{ fontSize: '1rem', marginTop: '-1rem' }}>
              Start making predictions to see your history here!
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Experience Level</th>
                  <th>Employment Type</th>
                  <th>Job Title</th>
                  <th>Residence</th>
                  <th>Company Location</th>
                  <th>Remote %</th>
                  <th>Company Size</th>
                  <th>Education</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Years Exp.</th>
                  <th>Predicted Salary</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className={getExperienceBadge(item.experience_level)}>
                        {item.experience_level}
                      </span>
                    </td>
                    <td>{item.employment_type}</td>
                    <td>{item.job_title}</td>
                    <td>{item.employee_residence}</td>
                    <td>{item.company_location}</td>
                    <td>{item.remote_ratio}%</td>
                    <td>{item.company_size}</td>
                    <td>{item.education}</td>
                    <td>{item.age}</td>
                    <td>{item.gender}</td>
                    <td>{item.years_experience}</td>
                    <td>₹ {parseFloat(item.predictedSalary || 0).toLocaleString()}</td>
                    <td>{new Date(item.timestamp).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button className="back-button" onClick={() => navigate("/")}>
          <span className="back-button-icon">⬅</span>
          <span className="back-button-text">Back to Predict Salary</span>
        </button>
      </div>
    </div>
  );
}
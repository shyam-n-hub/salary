import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";

export default function History() {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [historyList, setHistoryList] = useState([]);

  useEffect(() => {
    if (!user) return;

    const historyRef = ref(db, `users/${user.uid}/history`);
    onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      const temp = [];

      for (let id in data) {
        temp.push({
          id,
          experience: data[id].experience,
          education: data[id].education,
          skills: data[id].skills,
          predictedSalary: data[id].predictedSalary,
          timestamp: data[id].timestamp,
        });
      }

      // Sort latest first
      temp.reverse();
      setHistoryList(temp);
    });
  }, [user]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Your Salary Prediction History 📜</h2>

        {historyList.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: 20 }}>
            No Predictions Yet..
          </p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Experience</th>
                <th>Education</th>
                <th>Skills</th>
                <th>Predicted Salary</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {historyList.map((item, index) => (
                <tr key={index}>
                  <td>{item.experience} yrs</td>
                  <td>{item.education}</td>
                  <td>{item.skills}</td>
                  <td>₹ {item.predictedSalary}</td>
                  <td>{new Date(item.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button style={styles.backBtn} onClick={() => navigate("/home")}>
          ⬅ Back to Home
        </button>
      </div>
    </div>
  );
}

// =================== STYLES ===================
const styles = {
  container: {
    height: "100vh",
    background: "#e8edff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px"
  },
  card: {
    background: "#fff",
    width: "90%",
    maxWidth: "900px",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 0 18px rgba(0,0,0,0.15)"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px"
  },
  backBtn: {
    width: "100%",
    padding: "12px",
    background: "#4b6bfb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    marginTop: "20px",
    cursor: "pointer",
    fontWeight: "bold"
  }
};

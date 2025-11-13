import React, { useState } from "react";
import { auth, db } from "../firebase";
import { ref, push } from "firebase/database";
import { useNavigate } from "react-router-dom";

export default function UserInput() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  // Form Inputs
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState("");
  const [predictedSalary, setPredictedSalary] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send data to Python Backend API
      const response = await fetch("http://localhost:5000/predict", {  // <-- CHANGE IF NEEDED
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experience,
          education,
          skills
        })
      });

      const data = await response.json();
      setPredictedSalary(data.predicted_salary);

      // Save to Firebase History
      const historyRef = ref(db, `users/${user.uid}/history`);
      await push(historyRef, {
        experience,
        education,
        skills,
        predictedSalary: data.predicted_salary,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      alert("Error connecting to prediction server.");
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handlePredict}>
        <h2>Predict Your Salary 💼</h2>

        <input
          type="number"
          placeholder="Years of Experience"
          style={styles.input}
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Education Qualification (e.g., B.Tech, MBA)"
          style={styles.input}
          value={education}
          onChange={(e) => setEducation(e.target.value)}
          required
        />

        <textarea
          placeholder="Key Skills (comma separated)"
          style={styles.textarea}
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          required
        ></textarea>

        <button style={styles.button} type="submit" disabled={loading}>
          {loading ? "Predicting..." : "Predict Salary"}
        </button>

        {predictedSalary && (
          <div style={styles.result}>
            <h3>Predicted Salary: ₹ {predictedSalary}</h3>
          </div>
        )}

    
      </form>
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
    alignItems: "center"
  },
  card: {
    background: "#fff",
    width: "400px",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 0 18px rgba(0,0,0,0.15)"
  },
  input: {
    width: "100%",
    padding: "12px",
    margin: "8px 0",
    border: "1px solid #bbb",
    borderRadius: "6px"
  },
  textarea: {
    width: "100%",
    padding: "12px",
    margin: "8px 0",
    height: "90px",
    border: "1px solid #bbb",
    borderRadius: "6px",
    resize: "vertical"
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#4b6bfb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    marginTop: "10px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  result: {
    background: "#dff9e6",
    padding: "12px",
    borderRadius: "6px",
    marginTop: "15px",
    textAlign: "center"
  },
  historyBtn: {
    width: "100%",
    padding: "12px",
    background: "#07b981",
    color: "white",
    border: "none",
    borderRadius: "6px",
    marginTop: "15px",
    cursor: "pointer",
    fontWeight: "bold"
  }
};

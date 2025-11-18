import React, { useState } from "react";
import { auth, db } from "../firebase";
import { ref, push } from "firebase/database";
import { useNavigate } from "react-router-dom";
import salaryRules from "../data/salaryRules.json";
import "./UserInput.css";

// Charts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

export default function UserInput() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  // Inputs
  const [experienceLevel, setExperienceLevel] = useState("ENTR");
  const [employmentType, setEmploymentType] = useState("Full-time");
  const [jobTitle, setJobTitle] = useState("");
  const [employeeResidence, setEmployeeResidence] = useState("Bengaluru");
  const [companyLocation, setCompanyLocation] = useState("Bengaluru");
  const [remoteRatio, setRemoteRatio] = useState(0);
  const [companySize, setCompanySize] = useState("Small");
  const [education, setEducation] = useState("Bachelor");
  const [age, setAge] = useState(23);
  const [gender, setGender] = useState("male");
  const [yearsExperience, setYearsExperience] = useState(0);

  // Results
  const [predictedSalary, setPredictedSalary] = useState(null);
  const [chartData, setChartData] = useState([]);

  const COLORS = [
    "#667eea", "#764ba2", "#f093fb", "#f5576c",
    "#4facfe", "#00f2fe", "#43e97b", "#38f9d7", "#fa709a"
  ];

  const indianCities = [
    "Bengaluru", "Hyderabad", "Chennai", "Mumbai", "Pune",
    "Delhi", "Gurugram", "Noida", "Kolkata", "Ahmedabad",
    "Jaipur", "Coimbatore", "Kochi", "Trivandrum", "Mysuru",
    "Nagpur", "Indore", "Surat", "Chandigarh", "Bhubaneswar",
    "Vishakhapatnam", "Vadodara", "Lucknow", "Patna", "Bhopal",
    "Ranchi", "Madurai", "Thane", "Rajkot", "Vijayawada"
  ];

  // Prediction Engine
  const predictSalaryFromRules = (input) => {
    let salary = salaryRules.baseSalary || 30000;

    let breakdown = {
      Experience: 0,
      Employment: 0,
      CompanySize: 0,
      Education: 0,
      RemoteRatio: 0,
      JobTitle: 0,
      Location: 0,
      MultiField: 0,
      Age: 0,
      Gender: 0,
      YearsExperience: 0
    };

    const exp = input.experience_level.toUpperCase();
    const empType = input.employment_type.toLowerCase();
    const title = input.job_title.toLowerCase();
    const empRes = input.employee_residence.toLowerCase();
    const compLoc = input.company_location.toLowerCase();
    const remote = Number(input.remote_ratio);
    const compSize = input.company_size.toLowerCase();
    const edu = input.education.toLowerCase();
    const age = Number(input.age);
    const yearsExp = Number(input.years_experience);
    const gender = input.gender.toLowerCase();

    // Apply rules (same logic as before)
    salaryRules.experienceRules.forEach((r) => {
      if (exp.includes(r.value)) {
        salary += r.impact;
        breakdown.Experience += r.impact;
      }
    });

    salaryRules.employmentRules.forEach((r) => {
      if (empType.includes(r.value.toLowerCase())) {
        salary += r.impact;
        breakdown.Employment += r.impact;
      }
    });

    salaryRules.companySizeRules.forEach((r) => {
      if (compSize.includes(r.value.toLowerCase())) {
        salary += r.impact;
        breakdown.CompanySize += r.impact;
      }
    });

    salaryRules.educationRules.forEach((r) => {
      if (edu.includes(r.contains)) {
        salary += r.impact;
        breakdown.Education += r.impact;
      }
    });

    salaryRules.remoteRatioRules.forEach((r) => {
      if (remote >= r.min && remote < r.max) {
        salary += r.impact;
        breakdown.RemoteRatio += r.impact;
      }
    });

    salaryRules.jobTitleRules.forEach((r) => {
      if (title.includes(r.contains)) {
        salary += r.impact;
        breakdown.JobTitle += r.impact;
      }
    });

    salaryRules.locationRules.forEach((r) => {
      if (empRes.includes(r.contains) || compLoc.includes(r.contains)) {
        salary += r.impact;
        breakdown.Location += r.impact;
      }
    });

    salaryRules.ageRules.forEach((r) => {
      if (age >= r.min && age < r.max) {
        salary += r.impact;
        breakdown.Age += r.impact;
      }
    });

    salaryRules.genderRules.forEach((r) => {
      if (gender === r.value.toLowerCase()) {
        salary += r.impact;
        breakdown.Gender += r.impact;
      }
    });

    salaryRules.yearsExperienceRules.forEach((r) => {
      if (yearsExp >= r.min && yearsExp < r.max) {
        salary += r.impact;
        breakdown.YearsExperience += r.impact;
      }
    });

    salaryRules.multiFieldRules.forEach((rule) => {
      let ok = true;
      const c = rule.conditions;

      if (c.experience_level)
        ok = ok && c.experience_level.some((v) => exp.includes(v));

      if (ok && c.company_size)
        ok = ok && c.company_size.some((v) => compSize.includes(v.toLowerCase()));

      if (ok && c.remote_ratio_min !== undefined)
        ok = ok && remote >= c.remote_ratio_min;

      if (ok && c.remote_ratio_max !== undefined)
        ok = ok && remote < c.remote_ratio_max;

      if (ok && c.job_title_contains)
        ok = ok && c.job_title_contains.some((v) => title.includes(v.toLowerCase()));

      if (ok && c.education_contains)
        ok = ok && c.education_contains.some((v) => edu.includes(v.toLowerCase()));

      if (ok && c.employee_residence_contains)
        ok = ok && c.employee_residence_contains.some((v) => empRes.includes(v.toLowerCase()));

      if (ok && c.company_location_contains)
        ok = ok && c.company_location_contains.some((v) => compLoc.includes(v.toLowerCase()));

      if (ok) {
        salary += rule.impact;
        breakdown.MultiField += rule.impact;
      }
    });

    const formattedChart = Object.keys(breakdown)
      .filter(key => breakdown[key] !== 0)
      .map((key) => ({
        name: key,
        value: breakdown[key]
      }));

    setChartData(formattedChart);
    return Math.round(salary);
  };

  // Submit Handler
  const handlePredict = async (e) => {
    e.preventDefault();

    const input = {
      experience_level: experienceLevel,
      employment_type: employmentType,
      job_title: jobTitle,
      employee_residence: employeeResidence,
      company_location: companyLocation,
      remote_ratio: remoteRatio.toString(),
      company_size: companySize,
      education,
      age: age.toString(),
      gender,
      years_experience: yearsExperience.toString()
    };

    const salary = predictSalaryFromRules(input);
    setPredictedSalary(salary);

    if (user) {
      await push(ref(db, `users/${user.uid}/history`), {
        ...input,
        predictedSalary: salary,
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <div className="user-input-container">
      {/* Animated Background */}
      <div className="background-animation">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      <form className="prediction-form" onSubmit={handlePredict}>
        <div className="form-header">
          <div className="header-badge">
            <span className="badge-icon">💰</span>
            <span>AI-Powered Prediction</span>
          </div>
          <h1 className="form-title">
            Salary <span className="gradient-text">Prediction</span>
          </h1>
          <p className="form-subtitle">Enter your details for intelligent salary estimation</p>
        </div>

        <div className="form-grid">
          {/* Experience Level */}
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">📊</span>
              Experience Level
            </label>
            <select 
              className="form-select"
              value={experienceLevel} 
              onChange={(e) => setExperienceLevel(e.target.value)}
            >
              <option value="ENTR">Entry (ENTR)</option>
              <option value="JR">Junior (JR)</option>
              <option value="MID">Mid (MID)</option>
              <option value="SEN">Senior (SEN)</option>
              <option value="LEAD">Lead (LEAD)</option>
              <option value="EXEC">Executive (EXEC)</option>
            </select>
          </div>

          {/* Employment Type */}
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">💼</span>
              Employment Type
            </label>
            <select 
              className="form-select"
              value={employmentType} 
              onChange={(e) => setEmploymentType(e.target.value)}
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
              <option value="Intern">Intern</option>
              <option value="Self-employed">Self-employed</option>
            </select>
          </div>

          {/* Job Title */}
          <div className="form-group full-width">
            <label className="form-label">
              <span className="label-icon">🎯</span>
              Job Title
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Software Engineer, Data Scientist..."
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
            />
          </div>

          {/* Employee Residence */}
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">🏠</span>
              Employee Residence
            </label>
            <select
              className="form-select"
              value={employeeResidence}
              onChange={(e) => setEmployeeResidence(e.target.value)}
            >
              {indianCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Company Location */}
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">🏢</span>
              Company Location
            </label>
            <select
              className="form-select"
              value={companyLocation}
              onChange={(e) => setCompanyLocation(e.target.value)}
            >
              {indianCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Remote Ratio Slider */}
          <div className="form-group full-width">
            <label className="form-label">
              <span className="label-icon">🌐</span>
              Remote Work Ratio: <span className="slider-value">{remoteRatio}%</span>
            </label>
            <div className="slider-container">
              <input
                type="range"
                className="form-slider"
                min="0"
                max="100"
                step="25"
                value={remoteRatio}
                onChange={(e) => setRemoteRatio(Number(e.target.value))}
              />
              <div className="slider-labels">
                <span>On-site</span>
                <span>Hybrid</span>
                <span>Remote</span>
              </div>
            </div>
          </div>

          {/* Company Size */}
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">🏭</span>
              Company Size
            </label>
            <select 
              className="form-select"
              value={companySize} 
              onChange={(e) => setCompanySize(e.target.value)}
            >
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
              <option value="Startup">Startup</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </div>

          {/* Education */}
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">🎓</span>
              Education
            </label>
            <select 
              className="form-select"
              value={education} 
              onChange={(e) => setEducation(e.target.value)}
            >
              <option value="High School">High School</option>
              <option value="Diploma">Diploma</option>
              <option value="Bachelor">Bachelor</option>
              <option value="B.Tech">B.Tech</option>
              <option value="Master">Master</option>
              <option value="MBA">MBA</option>
              <option value="M.Tech">M.Tech</option>
              <option value="PhD">PhD</option>
            </select>
          </div>

          {/* Age with +/- buttons */}
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">👤</span>
              Age
            </label>
            <div className="number-input">
              <button 
                type="button" 
                className="number-btn"
                onClick={() => setAge(Math.max(18, age - 1))}
              >
                −
              </button>
              <input
                type="number"
                className="form-input-number"
                value={age}
                onChange={(e) => setAge(Math.max(18, Math.min(60, Number(e.target.value))))}
                min="18"
                max="60"
              />
              <button 
                type="button" 
                className="number-btn"
                onClick={() => setAge(Math.min(60, age + 1))}
              >
                +
              </button>
            </div>
          </div>

          {/* Gender */}
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">⚧</span>
              Gender
            </label>
            <select 
              className="form-select"
              value={gender} 
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Years of Experience with +/- buttons */}
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">⏱️</span>
              Years of Experience
            </label>
            <div className="number-input">
              <button 
                type="button" 
                className="number-btn"
                onClick={() => setYearsExperience(Math.max(0, yearsExperience - 1))}
              >
                −
              </button>
              <input
                type="number"
                className="form-input-number"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(Math.max(0, Math.min(50, Number(e.target.value))))}
                min="0"
                max="50"
              />
              <button 
                type="button" 
                className="number-btn"
                onClick={() => setYearsExperience(Math.min(50, yearsExperience + 1))}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <button type="submit" className="submit-btn">
          <span>Predict Salary</span>
          <svg className="btn-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Results Section */}
        {predictedSalary && (
          <div className="results-section">
            <div className="salary-result">
              <div className="result-content">
                <span className="result-label">Predicted Annual Salary</span>
                <h2 className="result-value">₹ {predictedSalary.toLocaleString('en-IN')}</h2>
              </div>
            </div>

            {chartData.length > 0 && (
              <>
                <div className="chart-section">
                  <h3 className="chart-title">
                    <span className="chart-icon">📊</span>
                    Salary Impact Breakdown
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" />
                      <YAxis stroke="rgba(255,255,255,0.6)" />
                      <Tooltip 
                        contentStyle={{
                          background: 'rgba(255,255,255,0.1)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '10px',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {chartData.map((entry, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-section">
                  <h3 className="chart-title">
                    <span className="chart-icon">🥧</span>
                    Contribution Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {chartData.map((entry, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip 
                        contentStyle={{
                          background: 'rgba(255,255,255,0.1)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '10px',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </div>
        )}

        <button
          type="button"
          className="history-btn"
          onClick={() => navigate("/user-history")}
        >
          <span>📜 View Prediction History</span>
        </button>
      </form>
    </div>
  );
}
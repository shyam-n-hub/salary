import { useEffect, useState } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const predictionUrl = 'https://predict-employee-salary.streamlit.app';

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handlePredictionClick = () => {
    window.open(predictionUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="home-container">
      {/* Animated Background */}
      <div className="background-animation">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      {/* Hero Section */}
      <section className={`hero-section ${isVisible ? 'fade-in' : ''}`}>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">🤖</span>
            <span>AI-Powered Solution</span>
          </div>
          
          <h1 className="hero-title">
            AI Salary Prediction
            <span className="gradient-text"> System</span>
          </h1>
          
          <p className="hero-subtitle">
            Intelligent automation for data-driven salary estimation using advanced Machine Learning
          </p>
          
          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={handlePredictionClick}>
              <span>Get Started</span>
              <svg className="btn-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="btn btn-secondary">
              <span>Learn More</span>
            </button>
          </div>
        </div>

        <div className="hero-image">
          <div className="floating-card card-1">
            <div className="card-icon">💰</div>
            <div className="card-text">Real-time Predictions</div>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">📊</div>
            <div className="card-text">High Accuracy</div>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon">⚡</div>
            <div className="card-text">Lightning Fast</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Core Features</h2>
          <p className="section-subtitle">Powered by cutting-edge technology and intelligent algorithms</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon gradient-1">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>LightGBM Algorithm</h3>
            <p>High-performance gradient boosting framework optimized for speed and accuracy in salary predictions</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon gradient-2">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M3 9H21" stroke="currentColor" strokeWidth="2"/>
                <path d="M9 21V9" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h3>Multi-Factor Analysis</h3>
            <p>Evaluates age, education, job title, experience, employment type, company size, and location</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon gradient-3">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Real-Time Processing</h3>
            <p>FastAPI backend delivers instant salary predictions with low latency and high throughput</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon gradient-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M3 10H21" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h3>Interactive Dashboard</h3>
            <p>Streamlit-powered interface for intuitive data input and visualization of prediction results</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon gradient-5">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>Data Preprocessing</h3>
            <p>Advanced techniques for missing value handling, categorical encoding, and feature scaling</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon gradient-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>High Accuracy Metrics</h3>
            <p>Validated performance through MAE, RMSE, and R² Score for reliable salary estimation</p>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="tech-section">
        <div className="section-header">
          <h2 className="section-title">Technology Stack</h2>
          <p className="section-subtitle">Built with modern, industry-leading technologies</p>
        </div>

        <div className="tech-grid">
          <div className="tech-item">
            <div className="tech-logo">ML</div>
            <span>LightGBM</span>
          </div>
          <div className="tech-item">
            <div className="tech-logo">⚡</div>
            <span>FastAPI</span>
          </div>
          <div className="tech-item">
            <div className="tech-logo">📊</div>
            <span>Streamlit</span>
          </div>
          <div className="tech-item">
            <div className="tech-logo">🐍</div>
            <span>Python</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">95%+</div>
            <div className="stat-label">Prediction Accuracy</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">&lt;100ms</div>
            <div className="stat-label">Response Time</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">10K+</div>
            <div className="stat-label">Training Records</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">7+</div>
            <div className="stat-label">Key Factors</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Predict Your Salary?</h2>
          <p className="cta-text">
            Experience intelligent salary estimation powered by advanced machine learning algorithms
          </p>
          <button className="btn btn-cta" onClick={handlePredictionClick}>
            <span>Start Prediction</span>
            <svg className="btn-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
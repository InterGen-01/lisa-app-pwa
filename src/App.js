import React, { useState, useEffect } from 'react';
import './App.css';

// Financial Calculator Component
const FinancialCalculator = ({ stage, setRecommendations }) => {
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [savings, setSavings] = useState('');
  const [age, setAge] = useState('');

  const calculateRecommendations = () => {
    const monthlyIncome = parseFloat(income) || 0;
    const monthlyExpenses = parseFloat(expenses) || 0;
    const currentSavings = parseFloat(savings) || 0;
    const userAge = parseInt(age) || 25;

    const disposableIncome = monthlyIncome - monthlyExpenses;
    const savingsRate = monthlyIncome > 0 ? (disposableIncome / monthlyIncome) * 100 : 0;

    const recommendations = {
      stage,
      savingsRate: savingsRate.toFixed(1),
      emergencyFund: (monthlyExpenses * 6).toFixed(0),
      retirementSavings: (monthlyIncome * 0.15 * 12).toFixed(0),
      recommendations: getStageRecommendations(stage, savingsRate, userAge, currentSavings)
    };

    setRecommendations(recommendations);
  };

  const getStageRecommendations = (lifeStage, savingsRate, userAge, currentSavings) => {
    const recommendations = [];

    switch (lifeStage) {
      case 'student':
        recommendations.push('Build credit with a student credit card');
        recommendations.push('Start an emergency fund with $1,000');
        recommendations.push('Apply for scholarships and grants');
        if (savingsRate < 10) recommendations.push('Aim to save 10% of any income');
        break;
      
      case 'early-career':
        recommendations.push('Contribute to employer 401(k) match');
        recommendations.push('Build 3-6 months emergency fund');
        recommendations.push('Consider a Roth IRA');
        if (savingsRate < 20) recommendations.push('Increase savings rate to 20%');
        break;
      
      case 'mid-career':
        recommendations.push('Maximize retirement contributions');
        recommendations.push('Consider life insurance');
        recommendations.push('Start college savings if you have children');
        if (currentSavings < 100000) recommendations.push('Focus on reaching $100K savings milestone');
        break;
      
      case 'pre-retirement':
        recommendations.push('Catch-up contributions to retirement accounts');
        recommendations.push('Review and optimize investment portfolio');
        recommendations.push('Plan healthcare costs for retirement');
        recommendations.push('Consider long-term care insurance');
        break;
      
      case 'retirement':
        recommendations.push('Create sustainable withdrawal strategy');
        recommendations.push('Optimize Social Security claiming');
        recommendations.push('Review estate planning documents');
        recommendations.push('Consider tax-efficient withdrawal strategies');
        break;
      
      default:
        recommendations.push('Start with basic budgeting');
        recommendations.push('Build an emergency fund');
        recommendations.push('Begin retirement savings');
    }

    return recommendations;
  };

  return (
    <div className="calculator-section">
      <h3>Financial Input for {stage.replace('-', ' ').toUpperCase()}</h3>
      <div className="input-grid">
        <div className="input-group">
          <label>Monthly Income ($)</label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="5000"
          />
        </div>
        
        <div className="input-group">
          <label>Monthly Expenses ($)</label>
          <input
            type="number"
            value={expenses}
            onChange={(e) => setExpenses(e.target.value)}
            placeholder="3000"
          />
        </div>
        
        <div className="input-group">
          <label>Current Savings ($)</label>
          <input
            type="number"
            value={savings}
            onChange={(e) => setSavings(e.target.value)}
            placeholder="10000"
          />
        </div>
        
        <div className="input-group">
          <label>Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="30"
          />
        </div>
      </div>
      
      <button onClick={calculateRecommendations} className="calculate-btn">
        Get AI Recommendations
      </button>
    </div>
  );
};

// Life Stage Timeline Component
const LifeStageTimeline = ({ currentStage, setCurrentStage }) => {
  const stages = [
    { id: 'student', label: 'Student', age: '18-22' },
    { id: 'early-career', label: 'Early Career', age: '23-35' },
    { id: 'mid-career', label: 'Mid Career', age: '36-50' },
    { id: 'pre-retirement', label: 'Pre-Retirement', age: '51-65' },
    { id: 'retirement', label: 'Retirement', age: '65+' }
  ];

  return (
    <div className="timeline-section">
      <h3>Select Your Life Stage</h3>
      <div className="timeline">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className={`timeline-item ${currentStage === stage.id ? 'active' : ''}`}
            onClick={() => setCurrentStage(stage.id)}
          >
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <h4>{stage.label}</h4>
              <p>{stage.age}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Recommendations Display Component
const RecommendationsDisplay = ({ recommendations }) => {
  if (!recommendations) return null;

  return (
    <div className="recommendations-section">
      <h3>AI-Powered Recommendations</h3>
      
      <div className="metrics-grid">
        <div className="metric">
          <h4>Savings Rate</h4>
          <span className="metric-value">{recommendations.savingsRate}%</span>
        </div>
        
        <div className="metric">
          <h4>Emergency Fund Target</h4>
          <span className="metric-value">${recommendations.emergencyFund}</span>
        </div>
        
        <div className="metric">
          <h4>Annual Retirement Savings</h4>
          <span className="metric-value">${recommendations.retirementSavings}</span>
        </div>
      </div>
      
      <div className="recommendations-list">
        <h4>Personalized Action Items:</h4>
        <ul>
          {recommendations.recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [currentStage, setCurrentStage] = useState('early-career');
  const [recommendations, setRecommendations] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  // PWA Installation
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setIsInstallable(true);
      window.deferredPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      const { outcome } = await window.deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
      }
      window.deferredPrompt = null;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1>🤖 LiSA</h1>
          <p>AI-Powered Financial Planning Assistant</p>
          {isInstallable && (
            <button onClick={handleInstall} className="install-btn">
              📱 Install App
            </button>
          )}
        </div>
      </header>

      <main className="main-content">
        <LifeStageTimeline 
          currentStage={currentStage} 
          setCurrentStage={setCurrentStage}
        />
        
        <FinancialCalculator 
          stage={currentStage} 
          setRecommendations={setRecommendations}
        />
        
        <RecommendationsDisplay recommendations={recommendations} />
      </main>

      <footer className="App-footer">
        <p>© 2025 LiSA Financial Advisor - Built with AI for every life stage</p>
      </footer>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalEntries: 0,
    recentEntries: [],
    topQuestionTypes: [],
    avgEnergyLevel: 0,
    streakDays: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/dashboard');
        setSummary(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Curiosity Tracker Dashboard</h2>
        <Link to="/add" className="add-button">Record New Activity</Link>
      </div>
      
      <div className="stats-summary">
        <div className="stat-box">
          <h3>{summary.totalEntries}</h3>
          <p>Total Activities</p>
        </div>
        <div className="stat-box">
          <h3>{summary.avgEnergyLevel.toFixed(1)}</h3>
          <p>Avg. Energy Level</p>
        </div>
        <div className="stat-box">
          <h3>{summary.streakDays}</h3>
          <p>Day Streak</p>
        </div>
        <div className="stat-box">
          <h3>{summary.topQuestionTypes[0]?.name || 'N/A'}</h3>
          <p>Top Question Type</p>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="recent-activities">
          <h3>Recent Curious Activities</h3>
          {summary.recentEntries.length === 0 ? (
            <p>No activities recorded yet. Start your curiosity journey!</p>
          ) : (
            <ul className="activity-list">
              {summary.recentEntries.map(entry => (
                <li key={entry._id} className="activity-item">
                  <div className="activity-title">
                    <h4>{entry.title}</h4>
                    <span className="activity-date">{format(new Date(entry.date), 'MMM d')}</span>
                  </div>
                  <div className="activity-details">
                    <span className="energy-indicator" style={{backgroundColor: `hsl(${entry.energyLevel * 12}, 70%, 50%)`}}>
                      {entry.energyLevel}/10
                    </span>
                    <div className="question-types">
                      {entry.questionTypes.map((type, i) => (
                        <span key={i} className="question-badge">{type}</span>
                      ))}
                    </div>
                  </div>
                  <p className="activity-output">{entry.output.substring(0, 100)}...</p>
                </li>
              ))}
            </ul>
          )}
          <Link to="/entries" className="view-all-link">View All Entries →</Link>
        </div>
        
        <div className="quick-insights">
          <h3>Question Type Distribution</h3>
          <div className="question-distribution">
            {summary.topQuestionTypes.map((type, index) => (
              <div key={index} className="question-type-bar">
                <span className="type-name">{type.name}</span>
                <div className="type-bar-container">
                  <div 
                    className="type-bar-fill" 
                    style={{
                      width: `${type.percentage}%`,
                      backgroundColor: COLORS[index % COLORS.length]
                    }}
                  ></div>
                </div>
                <span className="type-percentage">{type.percentage}%</span>
              </div>
            ))}
          </div>
          <Link to="/stats" className="view-all-link">View Detailed Analytics →</Link>
        </div>
      </div>
    </div>
  );
};

// Define COLORS for the Dashboard component
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default Dashboard;

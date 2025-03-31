import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, ResponsiveContainer 
} from 'recharts';

const Stats = () => {
  const [stats, setStats] = useState({
    questionTypes: [],
    energyLevels: [],
    timeSpent: [],
    entriesPerDay: []
  });
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState('month');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/stats?timeFrame=${timeFrame}`);
        setStats(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, [timeFrame]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  if (loading) {
    return <div className="loading">Loading statistics...</div>;
  }

  return (
    <div className="stats-container">
      <h2>Your Curiosity Analytics</h2>
      
      <div className="filter-controls">
        <label>Time Frame:</label>
        <select value={timeFrame} onChange={(e) => setTimeFrame(e.target.value)}>
          <option value="week">Past Week</option>
          <option value="month">Past Month</option>
          <option value="year">Past Year</option>
          <option value="all">All Time</option>
        </select>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Question Types Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.questionTypes}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {stats.questionTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="stat-card">
          <h3>Energy Levels by Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.energyLevels}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name="Avg. Energy Level" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="stat-card">
          <h3>Time Spent on Curious Activities</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.timeSpent}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="hours" fill="#82ca9d" name="Hours Spent" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="stat-card">
          <h3>Curiosity Activities per Day</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.entriesPerDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#FF8042" name="# of Activities" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Stats;


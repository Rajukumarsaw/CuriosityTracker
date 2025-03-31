import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const ViewEntries = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/entries');
        setEntries(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching entries:', error);
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const calculateDuration = (start, end) => {
    if (!start || !end) return 'N/A';
    
    const [startHours, startMinutes] = start.split(':').map(Number);
    const [endHours, endMinutes] = end.split(':').map(Number);
    
    let durationMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
    if (durationMinutes < 0) durationMinutes += 24 * 60; // Handle crossing midnight
    
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return <div className="loading">Loading entries...</div>;
  }

  return (
    <div className="view-entries-container">
      <h2>Your Curiosity Journal</h2>
      
      {entries.length === 0 ? (
        <p>No entries yet. Start tracking your curious work!</p>
      ) : (
        <div className="entries-list">
          {entries.map(entry => (
            <div key={entry._id} className="entry-card">
              <div className="entry-header">
                <h3>{entry.title}</h3>
                <div className="entry-meta">
                  <span>{format(new Date(entry.date), 'MMM d, yyyy')}</span>
                  <span>Duration: {calculateDuration(entry.startTime, entry.endTime)}</span>
                  <span className="energy-badge" style={{backgroundColor: `hsl(${entry.energyLevel * 12}, 70%, 50%)`}}>
                    Energy: {entry.energyLevel}/10
                  </span>
                </div>
              </div>
              
              <p className="entry-description">{entry.description}</p>
              
              <div className="questions-container">
                <h4>Questions Asked:</h4>
                <ul>
                  {entry.questions.map((question, i) => (
                    <li key={i}>
                      <span className="question-type-badge">{entry.questionTypes[i]}</span>
                      {question}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="output-container">
                <h4>Results/Output:</h4>
                <p>{entry.output}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewEntries;

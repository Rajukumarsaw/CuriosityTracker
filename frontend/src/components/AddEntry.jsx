import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddEntry = () => {
  const navigate = useNavigate();
  const [entry, setEntry] = useState({
    title: '',
    description: '',
    questions: [''], // Array of questions asked
    questionTypes: [''], // Array of question types (How, Why, What if, etc.)
    output: '',
    energyLevel: 5,
    date: new Date().toISOString().substr(0, 10),
    startTime: '',
    endTime: ''
  });

  // Add additional question field
  const addQuestionField = () => {
    setEntry({
      ...entry,
      questions: [...entry.questions, ''],
      questionTypes: [...entry.questionTypes, '']
    });
  };

  // Update question at specific index
  const updateQuestion = (index, value) => {
    const updatedQuestions = [...entry.questions];
    updatedQuestions[index] = value;
    setEntry({
      ...entry,
      questions: updatedQuestions
    });
  };

  // Update question type at specific index
  const updateQuestionType = (index, value) => {
    const updatedTypes = [...entry.questionTypes];
    updatedTypes[index] = value;
    setEntry({
      ...entry,
      questionTypes: updatedTypes
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post('http://localhost:5000/api/entries', entry);
      navigate('/entries');
    } catch (error) {
      console.error('Error submitting entry:', error);
    }
  };

  return (
    <div className="add-entry-container">
      <h2>Record Curious Work</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input 
            type="text" 
            value={entry.title} 
            onChange={(e) => setEntry({...entry, title: e.target.value})} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea 
            value={entry.description} 
            onChange={(e) => setEntry({...entry, description: e.target.value})} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Date:</label>
          <input 
            type="date" 
            value={entry.date} 
            onChange={(e) => setEntry({...entry, date: e.target.value})} 
            required 
          />
        </div>

        <div className="form-group time-group">
          <div>
            <label>Start Time:</label>
            <input 
              type="time" 
              value={entry.startTime} 
              onChange={(e) => setEntry({...entry, startTime: e.target.value})} 
              required 
            />
          </div>
          <div>
            <label>End Time:</label>
            <input 
              type="time" 
              value={entry.endTime} 
              onChange={(e) => setEntry({...entry, endTime: e.target.value})} 
              required 
            />
          </div>
        </div>

        <div className="questions-section">
          <h3>Questions Asked</h3>
          {entry.questions.map((question, index) => (
            <div key={index} className="question-group">
              <div className="question-type">
                <label>Question Type:</label>
                <select 
                  value={entry.questionTypes[index]} 
                  onChange={(e) => updateQuestionType(index, e.target.value)}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="How">How</option>
                  <option value="Why">Why</option>
                  <option value="What">What</option>
                  <option value="What if">What if</option>
                  <option value="When">When</option>
                  <option value="Where">Where</option>
                  <option value="Who">Who</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="question-content">
                <label>Question:</label>
                <input 
                  type="text" 
                  value={question} 
                  onChange={(e) => updateQuestion(index, e.target.value)} 
                  required 
                />
              </div>
            </div>
          ))}
          <button type="button" onClick={addQuestionField} className="add-question-btn">
            + Add Another Question
          </button>
        </div>

        <div className="form-group">
          <label>Output/Results:</label>
          <textarea 
            value={entry.output} 
            onChange={(e) => setEntry({...entry, output: e.target.value})} 
            placeholder="What discoveries or insights resulted from your curiosity?"
            required 
          />
        </div>

        <div className="form-group">
          <label>Energy Level (1-10): {entry.energyLevel}</label>
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={entry.energyLevel} 
            onChange={(e) => setEntry({...entry, energyLevel: parseInt(e.target.value)})} 
          />
          <div className="range-labels">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        <button type="submit" className="submit-btn">Save Entry</button>
      </form>
    </div>
  );
};

export default AddEntry;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
import { URL } from '../constants'

const RecordsList = () => {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [therapistFeedback, setTherapistFeedback] = useState('');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await axios.get(`${URL}/api/records`); // Assuming the backend API is running on the same host
      setRecords(response.data);
    } catch (error) {
      console.error('Error retrieving records', error);
    }
  };

  const handleRecordClick = async (recordId) => {
    try {
      const response = await axios.get(`${URL}/api/records/${recordId}`); // Assuming the backend API has an endpoint to fetch a specific record
      setSelectedRecord(response.data);

      const feedbackResponse = await axios.get(`${URL}/api/records/${recordId}/feedback`); // Assuming the backend API has an endpoint to fetch the therapist feedback for a specific record
      setTherapistFeedback(feedbackResponse.data.feedback);
    } catch (error) {
      console.error('Error retrieving record details or feedback', error);
    }
  };

  return (
    <div className="container">
      <h1>Records List</h1>
      {records.map((record) => (
        <div key={record._id} className="record-item">
          <h2>{record.video_id}</h2>
          <p>Self-score: {record.self_score}</p>
          <p>Therapist score: {record.therapist_score}</p>
          <p>Feedback: {record.feedback}</p>
          <button onClick={() => handleRecordClick(record._id)}>View Record</button>
        </div>
      ))}
      {selectedRecord && (
        <div className="selected-record">
          <h2>Selected Record Details</h2>
          <div className="video-container">
            <YouTube videoId={selectedRecord.video_id} />
          </div>
          <div className="details-container">
            <div className="details-item">
              <span className="details-label">Self-score:</span>
              <span className="details-value">{selectedRecord.self_score}</span>
            </div>
            <div className="details-item">
              <span className="details-label">Therapist score:</span>
              <span className="details-value">{selectedRecord.therapist_score}</span>
            </div>
          </div>
          <div className="feedback-container">
            <h2>Therapist Feedback</h2>
            <p>{therapistFeedback}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordsList;

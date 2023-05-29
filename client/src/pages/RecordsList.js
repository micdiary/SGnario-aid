import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { URL } from '../constants';

import '../css/RecordsList.css'; // Import custom CSS styles
import RecordModal from './RecordModal'; // Import the RecordModal component

const RecordsList = () => {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [therapistFeedback, setTherapistFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${URL}/api/records`);
      setRecords(response.data);
    } catch (error) {
      setError('Error retrieving records');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecordClick = async (recordId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${URL}/api/records/${recordId}`);
      setSelectedRecord(response.data);

      const feedbackResponse = await axios.get(`${URL}/api/records/${recordId}/feedback`);
      setTherapistFeedback(feedbackResponse.data.feedback);
    } catch (error) {
      setError('Error retrieving record details or feedback');
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedRecord(null);
    setTherapistFeedback('');
  };

  return (
    <div className="container">
      <h1>Records List</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!isLoading && !error && (
        <div className="records-grid">
          {records.map((record) => (
            <div key={record._id} className="record-item" onClick={() => handleRecordClick(record._id)}>
              <div className="record-details">
                <h2>{record.video_name}</h2>
                <p>Self-score: {record.self_score}</p>
                <p>Therapist score: {record.therapist_score}</p>
                <p>Feedback: {record.feedback}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedRecord && (
        <RecordModal record={selectedRecord} onClose={closeModal} />
      )}
    </div>
  );
};

export default RecordsList;

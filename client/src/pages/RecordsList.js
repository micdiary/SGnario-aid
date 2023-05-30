import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { URL } from '../constants';

import '../css/RecordsList.css';
import RecordModal from './RecordModal';

const RecordsList = () => {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [therapistFeedback, setTherapistFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortBy, setSortBy] = useState('video_name');

  useEffect(() => {
    fetchRecords();
  }, [currentPage, searchQuery, sortOrder, sortBy]);

  const fetchRecords = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${URL}/api/records`, {
        params: {
          page: currentPage,
          search: searchQuery,
          sort: sortBy,
          order: sortOrder,
        },
      });
      setRecords(response.data.records);
      setTotalPages(response.data.totalPages);
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

      const feedbackResponse = await axios.get(
        `${URL}/api/records/${recordId}/feedback`
      );
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container">
      <h1>Records List</h1>
      <div className="controls">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search..."
        />
        <select value={sortBy} onChange={handleSortChange}>
          <option value="video_name">Video Name</option>
          <option value="self_score">Self Score</option>
          <option value="therapist_score">Therapist Score</option>
        </select>
        <select value={sortOrder} onChange={handleOrderChange}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!isLoading && !error && (
        <>
          <div className="records-grid">
            {records.map((record) => (
              <div
                key={record._id}
                className="record-item"
                onClick={() => handleRecordClick(record._id)}
              >
                <div className="record-details">
                  <h2>{record.video_name}</h2>
                  <p>Self-score: {record.self_score}</p>
                  <p>Therapist score: {record.therapist_score}</p>
                  <p>Feedback: {record.feedback}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={currentPage === page ? 'active' : ''}
                >
                  {page}
                </button>
              )
            )}
          </div>
        </>
      )}
      {selectedRecord && (
        <RecordModal record={selectedRecord} onClose={closeModal} />
      )}
    </div>
  );
};

export default RecordsList;

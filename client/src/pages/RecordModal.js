import React from 'react';
import YouTube from 'react-youtube';

const RecordModal = ({ record, onClose }) => {
  return (
    <div className="record-modal">
      <div className="modal-content">
        <h2>{record.video_name}</h2>
        <div className="video-container">
          <YouTube videoId={record.video_id} />
        </div>
        <div className="details-container">
          <div className="details-item">
            <span className="details-label">Self-score:</span>
            <span className="details-value">{record.self_score}</span>
          </div>
          <div className="details-item">
            <span className="details-label">Therapist score:</span>
            <span className="details-value">{record.therapist_score}</span>
          </div>
        </div>
        <div className="feedback-container">
          <h2>Therapist Feedback</h2>
          <p>{record.feedback}</p>
        </div>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default RecordModal;

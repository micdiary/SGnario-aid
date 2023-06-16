import React, { useState, useEffect } from 'react';
import { Input, Select, Button, Spin, Typography } from 'antd';
import { getScenarios } from '../api/scenarios';
import YouTube from 'react-youtube';

const { Option } = Select;
const { Text } = Typography;

const Scenarios = () => {
  const [scenarios, setScenarios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortBy, setSortBy] = useState('videoName');

  useEffect(() => {
    fetchScenarios();
  }, [currentPage, searchQuery, sortOrder, sortBy]);

  const fetchScenarios = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {
        page: currentPage,
        search: searchQuery,
        sort: sortBy,
        order: sortOrder,
      };
      const response = await getScenarios(params);
      console.log(response);

      setScenarios(response?.data ?? []);
      setTotalPages(response?.totalPages ?? 1);
    } catch (error) {
      setError('Error retrieving scenarios');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleOrderChange = (value) => {
    setSortOrder(value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container">
      <h1>Scenarios</h1>
      <div className="controls">
        <Input.Search
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search..."
        />
        <Select value={sortBy} onChange={handleSortChange}>
          <Option value="category">Category</Option>
          <Option value="dateAdded">Date Added</Option>
          <Option value="scenario">Scenario</Option>
          <Option value="videoName">Video Name</Option>
        </Select>
        <Select value={sortOrder} onChange={handleOrderChange}>
          <Option value="asc">Ascending</Option>
          <Option value="desc">Descending</Option>
        </Select>
      </div>
      {isLoading && <Spin tip="Loading..." />}
      {error && <Text type="danger">{error}</Text>}
      {!isLoading && !error && scenarios.length > 0 && (
        <>
          <div className="records-grid">
            {scenarios.map((scenario) => (
              <div key={scenario._id} className="record-item">
                <div className="record-details">
                  <h2>{scenario.videoName}</h2>
                  <div className="video-container">
                    <YouTube videoId={scenario.videoId} />
                  </div>
                  <p>Date Added: {scenario.dateAdded}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <Button
                key={page}
                onClick={() => handlePageChange(page)}
                className={page === currentPage ? 'active' : ''}
              >
                {page}
              </Button>
            ))}
          </div>
        </>
      )}
      {!isLoading && !error && scenarios.length === 0 && <Text>No scenarios found.</Text>}
    </div>
  );
};

export default Scenarios;

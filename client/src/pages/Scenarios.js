import React, { useEffect, useState } from 'react';
import { List, Card, Input, Select, Button, Pagination } from 'antd';
import YouTube from 'react-youtube';
import { getScenarios } from '../api/scenarios';

const { Option } = Select;

const ScenarioList = () => {
  const [scenarios, setScenarios] = useState([]);
  const [filteredScenarios, setFilteredScenarios] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const response = await getScenarios();
        setScenarios(response);
      } catch (error) {
        console.error('Error fetching scenarios:', error);
        // Handle the error (e.g., show error message to the user)
      }
    };

    fetchScenarios();
  }, []);

  useEffect(() => {
    filterScenarios();
  }, [scenarios, searchQuery, categoryFilter]);

  const filterScenarios = () => {
    let filtered = scenarios;

    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (scenario) =>
          scenario.videoName.toLowerCase().includes(lowercaseQuery) ||
          scenario.category.toLowerCase().includes(lowercaseQuery) ||
          scenario.scenario.toLowerCase().includes(lowercaseQuery)
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter((scenario) => scenario.category === categoryFilter);
    }

    setFilteredScenarios(filtered);
  };

  const sortScenarios = (field, order) => {
    let sorted = [...filteredScenarios];

    if (field && order) {
      sorted.sort((a, b) => {
        const aValue = a[field]?.toLowerCase() ?? '';
        const bValue = b[field]?.toLowerCase() ?? '';
        return aValue.localeCompare(bValue, undefined, { sensitivity: 'base' }) * (order === 'asc' ? 1 : -1);
      });
    }

    setFilteredScenarios(sorted);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleCategoryFilter = (value) => {
    setCategoryFilter(value);
  };

  const handleSortFieldChange = (value) => {
    setSortField(value);
    sortScenarios(value, sortOrder);
  };

  const handleSortOrderChange = (value) => {
    setSortOrder(value);
    sortScenarios(sortField, value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderVideo = (videoId) => {
    const opts = {
      width: '100%',
      height: '400px',
    };

    return <YouTube videoId={videoId} opts={opts} />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredScenarios.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <Input.Search
          placeholder="Search"
          onSearch={handleSearch}
          style={{ width: '200px', marginRight: '16px' }}
        />
        <Select
          placeholder="Filter by category"
          onChange={handleCategoryFilter}
          style={{ width: '200px', marginRight: '16px' }}
        >
          <Option value="">All Categories</Option>
          <Option value="Category 1">Category 1</Option>
          <Option value="Category 2">Category 2</Option>
          <Option value="Category 3">Category 3</Option>
        </Select>
        <Select
          placeholder="Sort by"
          onChange={handleSortFieldChange}
          style={{ width: '200px', marginRight: '16px' }}
        >
          <Option value="">None</Option>
          <Option value="videoName">Video Name</Option>
          <Option value="category">Category</Option>
          <Option value="scenario">Scenario</Option>
        </Select>
        <Select
          placeholder="Sort order"
          onChange={handleSortOrderChange}
          style={{ width: '200px', marginRight: '16px' }}
        >
          <Option value="asc">Ascending</Option>
          <Option value="desc">Descending</Option>
        </Select>
      </div>
      <List
        grid={{ gutter: 16, column: 2 }}
        dataSource={currentItems}
        renderItem={(scenario) => (
          <List.Item key={scenario.id}>
            <Card title={scenario.videoName}>
              <p>Category: {scenario.category}</p>
              <p>Scenario: {scenario.scenario}</p>
              {renderVideo(scenario.videoId)}
              <p>Created on: {formatDate(scenario.dateAdded)}</p>
            </Card>
          </List.Item>
        )}
      />
      <Pagination
        current={currentPage}
        pageSize={itemsPerPage}
        total={filteredScenarios.length}
        onChange={handlePageChange}
        style={{ marginTop: '16px', textAlign: 'center' }}
      />
    </div>
  );
};

export default ScenarioList;

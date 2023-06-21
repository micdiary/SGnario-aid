import React, { useEffect, useState } from 'react';
import { List, Card, Input, Select, Button, Pagination } from 'antd';
import YouTube from 'react-youtube';
import { getScenarios } from '../api/scenarios';
import { useLocation } from "react-router-dom";

const { Option } = Select;

const ScenarioList = ({ scenarioFilter, categoryFilter }) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const scenarioName = searchParams.get("scenario");
    const category = searchParams.get("category");

    const [scenarios, setScenarios] = useState([]);
    const [filteredScenarios, setFilteredScenarios] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortField, setSortField] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);

    const [selectedScenario, setSelectedScenario] = useState(null);

    const handleScenarioSelect = (scenario) => {
        setSelectedScenario(scenario);
    };

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
    }, [scenarios, searchQuery, scenarioFilter, categoryFilter]);

    const filterScenarios = () => {
        let filtered = scenarios;

        if (searchQuery) {
            const lowercaseQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (scenario) =>
                scenario.videos.some((video) => video.videoName.toLowerCase().includes(lowercaseQuery)) ||
                scenario.category.toLowerCase().includes(lowercaseQuery) ||
                scenario.scenario.toLowerCase().includes(lowercaseQuery)
            );
        }
        if (scenarioFilter && categoryFilter) {
            filtered = filtered.filter((scenario) => scenario.scenario === scenarioFilter && scenario.category === categoryFilter);
        }



        setFilteredScenarios(filtered);
    };

    const sortScenarios = (field, order) => {
        let sorted = [...filteredScenarios];

        if (field && order) {
            sorted.sort((a, b) => {
                const aValue = a[field] ?.toLowerCase() ?? '';
                const bValue = b[field] ?.toLowerCase() ?? '';
                return aValue.localeCompare(bValue, undefined, { sensitivity: 'base' }) * (order === 'asc' ? 1 : -1);
            });
        }

        setFilteredScenarios(sorted);
    };

    const handleSearch = (value) => {
        setSearchQuery(value);
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

    const opts = {
        width: '100%',
        height: '400px',
    };

    return (
        <div>
        {/* Category and Scenario */}
      {filteredScenarios.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                    <h1>Category: {filteredScenarios[0].category} </h1>
                    <h1>Scenario: {filteredScenarios[0].scenario}</h1>
                </div>
            )}
      <div style={{ marginBottom: '16px' }}>
        <Input.Search
          placeholder="Search"
          onSearch={handleSearch}
          style={{ width: '200px', marginRight: '16px' }}
        />
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
            dataSource={currentItems.flatMap((scenario) => scenario.videos.map((video) => ({ scenario, video })))}
            renderItem={({ scenario, video }) => (
              <List.Item key={`${scenario.id}-${video.videoId}`}>
                <Card title={video.videoName}>
                  <YouTube videoId={video.videoId} opts={opts}/>
                  <div>
                    <p>Created on: {formatDate(scenario.dateAdded)}</p>
                  </div>
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
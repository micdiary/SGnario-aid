import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import YouTube from "react-youtube";
import { Card, List, Pagination, Input, Select } from "antd";

const { Search } = Input;
const { Option } = Select;

const opts = {
  width: "100%",
  height: "400px",
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  return formattedDate;
};

const Scenarios = ({ allScenarios, filteredScenarios }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get("category");
  const scenario = searchParams.get("scenario");
  console.log(category, scenario);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("nameAsc"); // Set default sort option
  const itemsPerPage = 4;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleSortChange = (value) => {
    setSortOption(value);
    setSearchQuery(""); // Clear the search query on sort change
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortOption]);

  const scenarios = filteredScenarios.length > 0 ? filteredScenarios : allScenarios;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredItems = scenarios
    .flatMap((scenario) => scenario.videos.map((video) => ({ scenario, video })))
    .filter((item) =>
      item.video.videoName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "nameAsc") {
        return a.video.videoName.localeCompare(b.video.videoName);
      } else if (sortOption === "nameDesc") {
        return b.video.videoName.localeCompare(a.video.videoName);
      } else if (sortOption === "dateAsc") {
        return new Date(a.scenario.dateAdded) - new Date(b.scenario.dateAdded);
      } else if (sortOption === "dateDesc") {
        return new Date(b.scenario.dateAdded) - new Date(a.scenario.dateAdded);
      }
      return 0;
    });

  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      {scenarios.length === 0 ? (
        null
      ) : (
        <div>
          {category && scenario ? (
            scenarios.map((scenarioItem) => {
              if (scenarioItem.category === category && scenarioItem.scenario === scenario) {
                return (
                  <div key={`${scenarioItem.category}-${scenarioItem.scenario}`}>
                    <h1>{scenarioItem.category}</h1>
                    <p>{scenarioItem.scenario}</p>
                    <div style={{ display: "flex", marginBottom: "16px" }}>
                      <Search
                        placeholder="Search video name"
                        allowClear
                        enterButton="Search"
                        onSearch={handleSearch}
                        style={{ marginRight: "16px" }}
                      />
                      <Select
                        defaultValue="none"
                        style={{ width: 200 }}
                        onChange={handleSortChange}
                      >
                        <Option value="none">Sort by</Option>
                        <Option value="nameAsc">Name (A-Z)</Option>
                        <Option value="nameDesc">Name (Z-A)</Option>
                        <Option value="dateAsc">Date Added (Oldest)</Option>
                        <Option value="dateDesc">Date Added (Newest)</Option>
                      </Select>
                    </div>
                    <List
                      grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}
                      dataSource={currentItems}
                      renderItem={({ scenario, video }) => (
                        <List.Item key={`${scenario.scenario}-${video.videoId}`}>
                          <Card title={video.videoName}>
                            <YouTube videoId={video.videoId} opts={opts} />
                            <p>Created on: {formatDate(scenario.dateAdded)}</p>
                          </Card>
                        </List.Item>
                      )}
                    />
                    <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                      <Pagination
                        current={currentPage}
                        total={filteredItems.length}
                        pageSize={itemsPerPage}
                        onChange={handlePageChange}
                      />
                    </div>
                  </div>
                );
              }
              return null;
            })
          ) : (
            <>
              <h1>All Scenarios</h1>
              <div style={{ display: "flex", marginBottom: "16px" }}>
                <Search
                  placeholder="Search video name"
                  allowClear
                  enterButton="Search"
                  onSearch={handleSearch}
                  style={{ marginRight: "16px" }}
                />
                <Select
                  defaultValue="none"
                  style={{ width: 200 }}
                  onChange={handleSortChange}
                >
                  <Option value="none">Sort by</Option>
                  <Option value="nameAsc">Name (A-Z)</Option>
                  <Option value="nameDesc">Name (Z-A)</Option>
                  <Option value="dateAsc">Date Added (Oldest)</Option>
                  <Option value="dateDesc">Date Added (Newest)</Option>
                </Select>
              </div>
              <List
                grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}
                dataSource={currentItems}
                renderItem={({ scenario, video }) => (
                  <List.Item key={`${scenario.scenario}-${video.videoId}`}>
                    <Card title={video.videoName}>
                      <YouTube videoId={video.videoId} opts={opts} />
                      <p>Created on: {formatDate(scenario.dateAdded)}</p>
                    </Card>
                  </List.Item>
                )}
              />
              <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                <Pagination
                  current={currentPage}
                  total={filteredItems.length}
                  pageSize={itemsPerPage}
                  onChange={handlePageChange}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Scenarios;

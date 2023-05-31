import React, { useState } from "react";
import { Menu, Row, Col } from "antd";
import {
  UserOutlined,
  HomeOutlined,
  VideoCameraOutlined,
  HistoryOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

import Profile from "./Profile";
import Recordings from "./Recordings";
import Dashboard from "./Dashboard";
import Evaluation from "./Evaluation";
import Upload from "./Upload";

const menuItems = [
  {
    label: "Profile",
    key: "profile",
    icon: <UserOutlined />,
  },
  {
    label: "Dashboard",
    key: "dashboard",
    icon: <HomeOutlined />,
  },
  {
    label: "Upload Recordings",
    key: "upload-recordings",
    icon: <VideoCameraOutlined />,
  },
  {
    label: "Past Recordings",
    key: "past-recordings",
    icon: <HistoryOutlined />,
  },
  {
    label: "Self Evaluation",
    key: "self-evaluation",
    icon: <BarChartOutlined />,
  },
];

const Account = () => {
  const [view, setView] = useState("profile");
  // change views between menus
  const menuOnClick = (e) => {
    setView(e.key);
  };

  return (
    <Row gutter={24}>
      <Col>
        <Menu
          onClick={menuOnClick}
          style={{
            width: 172,
          }}
          defaultSelectedKeys={["profile"]}
          defaultOpenKeys={["sub1"]}
          mode="inline"
          items={menuItems}
        />
      </Col>
      <Col>
        {view === "profile" && <Profile />}
        {view === "past-recordings" && <Recordings />}
        {view === "self-evaluation" && <Evaluation />}
        {view === "dashboard" && <Dashboard />}
        {view === "upload-recordings" && <Upload />}
      </Col>
    </Row>
  );
};

export default Account;

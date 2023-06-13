import React, { useState } from "react";
import { Menu, Row, Col } from "antd";
import { UserOutlined, HomeOutlined } from "@ant-design/icons";

import Profile from "./Profile";
import Dashboard from "./Dashboard";
import Evaluation from "./Evaluation";

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
];

const Account = () => {
  const [view, setView] = useState("profile");
  const [evaluationID, setEvaluationID] = useState(null);
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
        {view === "dashboard" && <Dashboard setView={setView} setEvaluationID={setEvaluationID} />}
        {view === "evaluation" && <Evaluation evaluationID={evaluationID} />}
      </Col>
    </Row>
  );
};

export default Account;

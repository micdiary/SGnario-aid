import React, { useState, useEffect } from "react";
import { Menu, Row, Col } from "antd";
import { UserOutlined, HomeOutlined } from "@ant-design/icons";

import SuperUserProfile from "./SuperUserProfile/Profile";
import SuperUserDashboard from "./SuperUserProfile/Dashboard";

import Profile from "./UserProfile/Profile";
import Dashboard from "./UserProfile/Dashboard";
import Evaluation from "./Evaluation";
import { getUserType } from "../../utils/account";
import { getProfile } from "../../api/profile";

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
  const [userType, setUserType] = useState(null);
  const [profile, setProfile] = useState({});

  // change views between menus
  const menuOnClick = (e) => {
    setView(e.key);
  };

  useEffect(() => {
    setUserType(getUserType());

    getProfile().then((res) => {
      setProfile(res);
    });
  }, []);

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
        {view === "profile" &&
          (userType === "therapist" || userType === "educator" ? (
            <SuperUserProfile profile={profile}/>
          ) : (
            <Profile profile={profile}/>
          ))}
        {view === "dashboard" &&
          (userType === "therapist" || userType === "educator" ? (
            <SuperUserDashboard profile={profile} />
          ) : (
            <Dashboard setView={setView} setEvaluationID={setEvaluationID} />
          ))}
        {view === "evaluation" && <Evaluation evaluationID={evaluationID} />}
      </Col>
    </Row>
  );
};

export default Account;

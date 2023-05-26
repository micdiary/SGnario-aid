import React, { useState } from "react";
import { Menu, Row, Col, Card, Input, Button } from "antd";
import { UserOutlined, VideoCameraOutlined } from "@ant-design/icons";

const menuItems = [
  {
    label: "Profile",
    key: "profile",
    icon: <UserOutlined />,
  },
  {
    label: "Past Recordings",
    key: "past-recordings",
    icon: <VideoCameraOutlined />,
  },
];

const generateProfile = (isDisabled, setIsDisabled) => {
  // TODO - get user info from backend

  return (
    <Card
      title="Username"
      extra={
        <Button onClick={() => setIsDisabled(!isDisabled)}>Edit Profile</Button>
      }
      style={{
        width: 720,
      }}
    >
      <Row gutter={[0, 24]}>
        <Col span={6}>Username</Col>
        <Col span={18}>
          <Input placeholder="username data" disabled={isDisabled} />
        </Col>
        <Col span={6}>Email</Col>
        <Col span={18}>
          <Input placeholder="email data" disabled={isDisabled}/>
        </Col>
        <Col span={6}>Password</Col>
        <Col span={18}>
          <Input placeholder="password data" disabled={isDisabled}/>
        </Col>
      </Row>
      <Row gutter={[24, 48]}></Row>
      <Row gutter={[24, 48]}></Row>
    </Card>
  );
};

const generateRecordings = () => {
  // TODO - get user recordings from backend

  return <div>Recordings</div>;
};

const Account = () => {
  const [view, setView] = useState("profile");
  const [isDisabled, setIsDisabled] = useState(true);
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
        {view === "profile"
          ? generateProfile(isDisabled, setIsDisabled)
          : generateRecordings()}
      </Col>
    </Row>
  );
};

export default Account;

import React, { useState } from "react";
import { Row, Col, Card, Input, Button } from "antd";

const Profile = () => {
  const [isDisabled, setIsDisabled] = useState(true);

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
          <Input placeholder="email data" disabled={isDisabled} />
        </Col>
        <Col span={6}>Password</Col>
        <Col span={18}>
          <Input placeholder="password data" disabled={isDisabled} />
        </Col>
      </Row>
      <Row gutter={[24, 48]}></Row>
      <Row gutter={[24, 48]}></Row>
    </Card>
  );
};

export default Profile;

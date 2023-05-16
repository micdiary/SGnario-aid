import React from "react";
import { Link } from "react-router-dom";
import { Menu, Row, Breadcrumb, Col } from "antd";

import * as constants from "../constants";

const Header = () => {
  const config = [
    {
      label: "Home",
      url: constants.HOME_URL,
    },
    {
      label: "About Us",
      url: constants.ABOUT_US_URL,
    },
    {
      label: "Tutorial",
      url: constants.TUTORIAL_URL,
    },
    {
      label: "Contact",
      url: constants.CONTACT_URL,
    },
    {
      label: "Terms & Conditions",
      url: constants.TERMS_CONDITIONS_URL,
    },
    {
      label: "Account",
      url: constants.ACCOUNT_URL,
    },
  ];

  return (
    <>
      <Row>
        <Menu theme="dark" mode="horizontal" disabledOverflow>
          {config.map((item, index) => {
            return (
              <Menu.Item key={index}>
                <Link to={item.url}>{item.label}</Link>
              </Menu.Item>
            );
          })}
        </Menu>
      </Row>
      <Row justify="start">
        <Col span={8}>
          <Breadcrumb>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col span={8} offset={8} push={6}>
          <Breadcrumb>
            <Breadcrumb.Item href={constants.LOGIN_URL}>Login</Breadcrumb.Item>
            <Breadcrumb.Item href={constants.REGISTER_URL}>Register</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>
    </>
  );
};

export default Header;

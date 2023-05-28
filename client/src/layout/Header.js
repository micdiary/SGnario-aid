import React from "react";
import { Link } from "react-router-dom";
import { Menu, Row, Breadcrumb, Col } from "antd";

import * as constants from "../constants";

const Header = () => {
  const menuItems = [
    {
      label: <a href={constants.HOME_URL}>Home</a>,
      key: "home",
    },
    {
      label: <a href={constants.ABOUT_US_URL}>About Us</a>,
      key: "about-us",
    },
    {
      label: <a href={constants.TUTORIAL_URL}>Tutorial</a>,
      key: "tutorial",
    },
    {
      label: <a href={constants.CONTACT_URL}>Contact</a>,
      key: "contact",
    },
    {
      label: <a href={constants.TERMS_CONDITIONS_URL}>Terms & Conditions</a>,
      key: "terms-conditions",
    },
    {
      label: <a href={constants.ACCOUNT_URL}>Account</a>,
      key: "account",
    },
    {
      label: <a href={constants.RECORDS}>Records</a>,
      key: "records",
    },
  ];

  const pathBreadcrumbItems = [
    {
      title: <a href={constants.HOME_URL}>Home</a>,
    },
  ];

  const loginBreadcrumbItems = [
    {
      title: <a href={constants.LOGIN_URL}>Login</a>,
    },
    {
      title: <a href={constants.REGISTER_URL}>Register</a>,
    },
  ];

  return (
    <>
      <Row>
        <Menu
          theme="dark"
          mode="horizontal"
          disabledOverflow
          triggerSubMenuAction="hover"
          forceSubMenuRender
          items={menuItems}
        />
      </Row>
      <Row justify="start">
        <Col span={8}>
          <Breadcrumb items={pathBreadcrumbItems} />
        </Col>
        <Col span={8} offset={8} push={6}>
          <Breadcrumb items={loginBreadcrumbItems} />
        </Col>
      </Row>
    </>
  );
};

export default Header;

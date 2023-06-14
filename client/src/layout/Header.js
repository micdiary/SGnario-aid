import React, { useEffect, useState } from "react";
import { Menu, Row, Breadcrumb, Col } from "antd";

import * as constants from "../constants";
import { removeToken, removeUserID, getUserID } from "../utils/account";
import { userStore } from "../utils/store";

const Header = () => {
  const localUserID = getUserID();
  const storeUserID = userStore((state) => state.userID);
  const [userID, setUserID] = useState(
    localUserID !== null ? localUserID : storeUserID
  );
  useEffect(() => {
    setUserID(localUserID !== null ? localUserID : storeUserID);
  }, [localUserID, storeUserID]);

  const removeID = userStore((state) => state.removeID);
  const menuItems = [
    {
      label: <a href={constants.HOME_URL}>Home</a>,
      key: "home",
    },
    {
      label: <a href={constants.SCENARIOS_URL}>Scenarios</a>,
      key: "scenarios",
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
      hidden : userID === null,
    },
  ];

  const pathBreadcrumbItems = [
    {
      title: <a href={constants.HOME_URL}>Home</a>,
    },
  ];

  const loginBreadcrumbItems =
    userID !== null
      ? [
          {
            title: (
              <a
                href={constants.HOME_URL}
                onClick={() => {
                  removeToken();
                  removeUserID();
                  removeID();
                }}
              >
                Logout
              </a>
            ),
          },
        ]
      : [
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

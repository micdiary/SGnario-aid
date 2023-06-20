import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Row, Breadcrumb, Col } from "antd";

import * as constants from "../constants";
import {
    removeToken,
    removeUserID,
    getUserID,
    getUserType,
    removeUserType,
} from "../utils/account";
import { userStore } from "../utils/store";

import { getScenarios } from "../api/scenarios";

const Header = ({ handleCategoryFilter }) => {
    const navigate = useNavigate();
    const localUserID = getUserID();
    const storeUserID = userStore((state) => state.userID);
    const [userID, setUserID] = useState(
        localUserID !== null ? localUserID : storeUserID
    );

    const [scenarios, setScenarios] = useState([]);

    useEffect(() => {
        setUserID(localUserID !== null ? localUserID : storeUserID);
    }, [localUserID, storeUserID]);

    const localUserRole = getUserType();
    const storeUserRole = userStore((state) => state.userType);
    const [userRole, setUserRole] = useState(
        localUserRole !== null ? localUserRole : storeUserRole
    );

    useEffect(() => {
        setUserRole(localUserRole !== null ? localUserRole : storeUserRole);
    }, [localUserRole, storeUserRole]);

    useEffect(() => {
        const fetchScenarios = async () => {
            try {
                const response = await getScenarios();
                setScenarios(response);
            } catch (error) {
                console.error("Error fetching scenarios:", error);
                // Handle the error (e.g., show error message to the user)
            }
        };

        fetchScenarios();
    }, []);

    const removeUserStore = userStore((state) => state.removeUser);

    const submenuItems = scenarios.reduce((acc, scenario, index) => {
        const { scenario: scenarioName, category } = scenario;

        const existingScenarioIndex = acc.findIndex(
            (item) => item.label === scenarioName
        );

        if (existingScenarioIndex !== -1) {
            const existingScenario = acc[existingScenarioIndex];
            const existingCategoryIndex = existingScenario.children.findIndex(
                (item) => item.label === category
            );
            if (existingCategoryIndex === -1) {

                existingScenario.children.push({
                    label: category,
                    key: `${category}-${index}`,
                    onClick: () => handleCategoryFilter(scenarioName, category),
                });
            }
        } else {

            acc.push({
                label: scenarioName,
                key: `${scenarioName}-${category}-${index}`,
                children: [{
                    label: category,
                    key: `${category}-${index}`,
                    onClick: () => handleCategoryFilter(scenarioName, category),
                }, ],
            });
        }

        return acc;
    }, []);

    const menuItems = [{
            label: <a href={constants.HOME_URL}>Home</a>,
            key: "home",
        },
        {
            label: "Scenarios",
            key: "scenarios",
            children: submenuItems,
        },
        {
            label: <a href={constants.SCENARIOS_FORM}>Scenarios Form</a>,
            key: "scenario-form",
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
            hidden: userID === null,
        },
    ];

    const adminMenuItems = [{
        label: <a href={constants.ADMIN_URL}>Admin</a>,
        key: "admin",
        hidden: userID === "admin",
    }, ];

    const pathBreadcrumbItems = [{
        title: <a href={constants.HOME_URL}>Home</a>,
    }, ];

    const loginBreadcrumbItems =
        userID !== null ? [{
            title: (
                <a
                href={constants.HOME_URL}
                onClick={() => {
                  removeToken();
                  removeUserID();
                  removeUserType();
                  removeUserStore();
                }}
              >
                Logout
              </a>
            ),
        }, ] : [{
                title: <a href={constants.LOGIN_URL}>Login</a>,
            },
            {
                title: <a href={constants.REGISTER_URL}>Register</a>,
            },
        ];

    const handleMenuClick = (event) => {
        navigate("/scenarios");
    };


    return ( <
        >
        <Row>
        <Menu
          theme="dark"
          mode="horizontal"
          disabledOverflow
          triggerSubMenuAction="hover"
          forceSubMenuRender
          items={userRole === "admin" ? adminMenuItems : menuItems}
          onClick={handleMenuClick}
        />
      </Row> <
        Row justify = "start" >
        <Col span={8}>
          <Breadcrumb items={pathBreadcrumbItems} />
        </Col> <
        Col span = { 8 } offset = { 8 } push = { 6 } >
        <Breadcrumb items={loginBreadcrumbItems} /> <
        /Col> < /
        Row > <
        />
    );
};

export default Header;
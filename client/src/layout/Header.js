import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Menu, Row, Button, Space, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import * as constants from "../constants";
import { getUserID, getUserType } from "../utils/account";
import { userStore } from "../utils/store";

import { getScenarios } from "../api/scenarios";

const Header = ({ handleCategoryFilter }) => {
	const navigate = useNavigate();
	const location = useLocation();
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

	const submenuItems = scenarios.reduce((acc, scenario, index) => {
		const { scenario: scenarioName, category } = scenario;

		const existingScenarioIndex = acc.findIndex(
			(item) => item.label === category
		);

		if (existingScenarioIndex !== -1) {
			const existingScenario = acc[existingScenarioIndex];
			const existingCategoryIndex = existingScenario.children.findIndex(
				(item) => item.label === scenarioName
			);
			if (existingCategoryIndex === -1) {
				existingScenario.children.push({
					label: scenarioName,
					key: `${scenarioName}-${index}`,
					onClick: () => {
						handleCategoryFilter(scenarioName, category);
						navigate(
							`${constants.SCENARIOS_URL}?category=${encodeURIComponent(
								category
							)}&scenario=${encodeURIComponent(scenarioName)}`
						);
					},
				});
			}
		} else {
			acc.push({
				label: category,
				key: `${category}-${scenarioName}-${index}`,
				children: [
					{
						label: scenarioName,
						key: `${scenarioName}-${index}`,
						onClick: () => {
							handleCategoryFilter(scenarioName, category);
							navigate(
								`${constants.SCENARIOS_URL}?category=${encodeURIComponent(
									category
								)}&scenario=${encodeURIComponent(scenarioName)}`
							);
						},
					},
				],
			});
		}

		return acc;
	}, []);

	const menuItems = [
		{
			label: <a href={constants.HOME_URL}>Home</a>,
			key: "home",
		},
		{
			label: (
				<a
					className="ant-dropdown-link"
					href={constants.SCENARIOS_URL}
					style={{
						color: "white",
						opacity: 0.65,
					}}
				>
					Scenarios
				</a>
			),
			key: "scenarios",
			children: submenuItems,
		},

		{
			label: "Others",
			key: "others",
			children: [
				{
					label: <a href={constants.ABOUT_US_URL}>About Us</a>,
					key: "about-us",
				},
				{
					label: (
						<a href={constants.TERMS_CONDITIONS_URL}>Terms & Conditions</a>
					),
					key: "terms-conditions",
				},
			],
		},
	];

	const adminMenuItems = [
		{
			label: <a href={constants.ADMIN_URL}>Admin</a>,
			key: "admin",
			hidden: userID === "admin",
		},
	];

	// Retrieve category and scenario from the URL query parameters
	const urlParams = new URLSearchParams(location.search);
	const category = urlParams.get("category");
	const scenario = urlParams.get("scenario");

	useEffect(() => {
		if (category && scenario) {
			handleCategoryFilter(scenario, category);
		}
	}, [category, scenario, handleCategoryFilter]);

	return (
		<>
			<Row justify={"space-between"} align={"middle"}>
				<Menu
					theme="dark"
					mode="horizontal"
					disabledOverflow
					selectedKeys={[-1]}
					triggerSubMenuAction="hover"
					forceSubMenuRender
					items={userRole === "admin" ? adminMenuItems : menuItems}
				/>
				<Space>
					{userID === null ? (
						<>
							<Link to={constants.REGISTER_URL}>
								<Button
									type={"text"}
									style={{
										color: "white",
										opacity: 0.65,
									}}
								>
									Register
								</Button>
							</Link>
							<Link to={constants.LOGIN_URL}>
								<Button type={"primary"}>Login</Button>
							</Link>
						</>
					) : userRole === "admin" ? (
						<></>
					) : (
						<Link to={constants.ACCOUNT_URL}>
							<Avatar
								size={32}
								icon={
									<UserOutlined
										style={{
											color: "black",
											opacity: 0.88,
										}}
									/>
								}
								style={{
									opacity: 0.65,
									backgroundColor: "white",
								}}
							/>
						</Link>
					)}
				</Space>
			</Row>
		</>
	);
};

export default Header;

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Menu, Row, Button, Space, Avatar, Typography, Drawer } from "antd";
import { UserOutlined, DownOutlined, MenuOutlined } from "@ant-design/icons";
import * as constants from "../constants";
import { getToken, getUserType } from "../utils/account";
import { userStore } from "../utils/store";
import logo from "../assets/logo.jpg";
import { useMediaQuery } from "react-responsive";
import { getScenarios } from "../api/scenarios";

const Header = ({ handleCategoryFilter }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const localToken = getToken();
	const storeToken = userStore((state) => state.token);
	const setStoreToken = userStore((state) => state.setToken);
	const [token, setToken] = useState(
		localToken !== null ? localToken : storeToken
	);

	const [scenarios, setScenarios] = useState([]);

	useEffect(() => {
		setToken(localToken !== null ? localToken : storeToken);
		setStoreToken(localToken !== null ? localToken : storeToken);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [localToken, storeToken]);

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

	// media query for mobile
	const isLaptop = useMediaQuery({
		query: "(min-width: 1024px)",
	});
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const menuItems = [
		{
			label: (
				<a href={constants.HOME_URL}>
					<img
						src={logo}
						alt="logo"
						style={{
							width: "50px",
						}}
					/>
				</a>
			),
			key: "home",
		},
		{
			label: isLaptop ? (
				<a
					className="ant-dropdown-link"
					href={constants.SCENARIOS_URL}
					style={{
						color: "#436A71",
					}}
				>
					Scenarios{" "}
					<DownOutlined
						style={{
							fontSize: "10px",
						}}
					/>
				</a>
			) : (
				<a
					className="ant-dropdown-link"
					href={constants.SCENARIOS_URL}
					style={{
						color: "#436A71",
					}}
				>
					Scenarios{" "}
				</a>
			),
			key: "scenarios",
			children: submenuItems,
		},
		{
			label: isLaptop ? (
				<>
					About{" "}
					<DownOutlined
						style={{
							fontSize: "10px",
						}}
					/>
				</>
			) : (
				"About"
			),
			key: "about",
			children: [
				{
					label: <a href={constants.ABOUT_US_URL}>Speech Therapy</a>,
					key: "speech-therapy",
				},
				{
					label: (
						<a href={constants.TERMS_CONDITIONS_URL}>Terms & Conditions</a>
					),
					key: "terms-conditions",
				},
			],
		},
		{
			label: <a href={constants.CONTACT_US_URL}>Contact Us</a>,
			key: "contact-us",
		},
	];

	const adminMenuItems = [
		{
			label: <a href={constants.ADMIN_URL}>Admin</a>,
			key: "admin",
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

	return isLaptop ? (
		<>
			<Row justify={"space-between"} align={"middle"} style={{ width: "100%" }}>
				<Menu
					style={{
						backgroundColor: "transparent",
						display: "flex",
						alignItems: "center",
						margin: "0 -32px",
						borderBottom: "none",
					}}
					mode="horizontal"
					triggerSubMenuAction="hover"
					items={userRole === "admin" ? adminMenuItems : menuItems}
				/>
				<Space>
					{token === null ? (
						<>
							<Link to={constants.REGISTER_URL}>
								<Button type={"text"}>Register</Button>
							</Link>
							<Link to={constants.LOGIN_URL}>
								<Button type={"primary"}>Login</Button>
							</Link>
						</>
					) : userRole === "admin" ? (
						<></>
					) : (
						<Row justify={"center"} align={"middle"}>
							{userRole === "therapist" || userRole === "educator" ? (
								<Typography style={{ textTransform: "capitalize" }}>
									{userRole} &nbsp;
								</Typography>
							) : (
								<></>
							)}
							<Link to={constants.ACCOUNT_URL}>
								<Avatar
									size={32}
									icon={
										<UserOutlined
											style={{
												color: "#FFEBC9",
											}}
										/>
									}
									style={{
										backgroundColor: "#2F4858",
										opacity: 0.8,
									}}
								/>
							</Link>
						</Row>
					)}
				</Space>
			</Row>
		</>
	) : (
		<>
			<Row justify="space-between" align="middle" style={{ height: "100%" }}>
				<a href={constants.HOME_URL}>
					<img
						src={logo}
						alt="logo"
						style={{
							width: "50px",
						}}
					/>
				</a>
				<div>
					<Space>
						{token === null ? (
							<>
								<Link to={constants.REGISTER_URL}>
									<Button type={"text"}>Register</Button>
								</Link>
								<Link to={constants.LOGIN_URL}>
									<Button type={"primary"}>Login</Button>
								</Link>
							</>
						) : userRole === "admin" ? (
							<></>
						) : (
							<Row justify={"center"} align={"middle"}>
								{userRole === "therapist" || userRole === "educator" ? (
									<Typography style={{ textTransform: "capitalize" }}>
										{userRole} &nbsp;
									</Typography>
								) : (
									<></>
								)}
								<Link to={constants.ACCOUNT_URL}>
									<Avatar
										size={32}
										icon={
											<UserOutlined
												style={{
													color: "#FFEBC9",
												}}
											/>
										}
										style={{
											backgroundColor: "#2F4858",
											opacity: 0.8,
										}}
									/>
								</Link>
							</Row>
						)}
					</Space>
					<MenuOutlined
						style={{
							marginLeft: "24px",
						}}
						onClick={() => setIsDrawerOpen(!isDrawerOpen)}
					></MenuOutlined>
					<Drawer
						headerStyle={{
							backgroundColor: "#FFEBC9",
						}}
						title={
							<Link to={constants.HOME_URL}>
								<Typography onClick={() => setIsDrawerOpen(false)}>
									SGnario-Aid
								</Typography>
							</Link>
						}
						placement="right"
						onClose={() => setIsDrawerOpen(false)}
						open={isDrawerOpen}
					>
						<Menu
							style={{
								backgroundColor: "transparent",
								border: "none",
							}}
							forceSubMenuRender
							mode="vertical"
							selectedKeys={[-1]}
							triggerSubMenuAction="hover"
							items={userRole === "admin" ? adminMenuItems : menuItems.slice(1)}
						/>
					</Drawer>
				</div>
			</Row>
		</>
	);
};

export default Header;

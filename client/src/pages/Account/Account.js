import React, { useState, useEffect, useRef } from "react";
import { Menu, Layout, Button, Space, Spin } from "antd";
import {
	UserOutlined,
	LockOutlined,
	HomeOutlined,
	AppstoreOutlined,
	MailOutlined,
} from "@ant-design/icons";
import { Navigate } from "react-router-dom";
import SuperUserProfile from "./SuperUserProfile/Profile";
import SuperUserDashboard from "./SuperUserProfile/Dashboard";
import SuperUserTask from "./SuperUserProfile/Task";
import SuperUserStorage from "./SuperUserProfile/Storage";

import Profile from "./UserProfile/Profile";
import Dashboard from "./UserProfile/Dashboard";
import Task from "./UserProfile/Task";
import Request from "./UserProfile/Request";

import Password from "./Password";

import {
	getToken,
	getUserType,
	removeToken,
	removeUserType,
} from "../../utils/account";
import { getProfile } from "../../api/profile";
import { userStore } from "../../utils/store";
import * as constants from "../../constants";
import { showNotification } from "../../components/Notification";

const Account = () => {
	const [view, setView] = useState("dashboard");
	const [task, setTask] = useState(null);
	const [userType, setUserType] = useState(null);
	const [profile, setProfile] = useState({});

	const profileRef = useRef(null);

	// change views between menus
	const menuOnClick = (e) => {
		setView(e.key);
	};

	const storeToken = userStore((state) => state.token);
	const removeUserStore = userStore((state) => state.removeUser);
	useEffect(() => {
		if (storeToken !== null) {
			setUserType(getUserType());
			getProfile()
				.then((res) => {
					setProfile(res);
				})
				.catch((err) => {
					showNotification(
						"Your account has been deleted. Please contact administrator for more information.",
						"error"
					);
					removeToken();
					removeUserType();
					removeUserStore();
				});
		}
	}, [storeToken]);

	const menuItems = [
		{
			type: "group",
			label: "Tools",
			children: [
				{
					label: "Dashboard",
					key: "dashboard",
					icon: <HomeOutlined />,
				},
			],
		},
		{
			type: "group",
			label: "Settings",
			children: [
				{
					label: "Profile",
					key: "profile",
					icon: <UserOutlined />,
				},
				{
					label: "Password",
					key: "password",
					icon: <LockOutlined />,
				},
				{
					label: "Request",
					key: "request",
					icon: <MailOutlined />,
					hidden: userType === "therapist" || userType === "educator",
				},
				{
					label: "Storage",
					key: "storage",
					icon: <AppstoreOutlined />,
					hidden: userType === "user",
				},
			],
		},
	];

	const generateContent = () => {
		if (userType === "user") {
			switch (view) {
				case "dashboard":
					return (
						<Dashboard setView={setView} setTask={setTask} ref={profileRef} />
					);
				case "task":
					return <Task task={task} setTask={setTask} setView={setView} />;
				case "profile":
					return <Profile profile={profile} setProfile={setProfile} />;
				case "password":
					return <Password profile={profile} />;
				case "request":
					return <Request profile={profile} setProfile={setProfile} />;
				default:
					return <Spin spinning />;
			}
		} else if (userType === "therapist" || userType === "educator") {
			switch (view) {
				case "dashboard":
					return (
						<SuperUserDashboard
							profile={profile}
							setProfile={setProfile}
							setView={setView}
							setTask={setTask}
						/>
					);
				case "task":
					return (
						<SuperUserTask task={task} setTask={setTask} setView={setView} />
					);
				case "profile":
					return <SuperUserProfile profile={profile} setProfile={setProfile} />;
				case "password":
					return <Password profile={profile} setProfile={setProfile} />;
				case "storage":
					return <SuperUserStorage profile={profile} setProfile={setProfile} />;
				default:
					return <Spin spinning />;
			}
		}
	};

	return (
		<Layout
			style={{
				margin: "0 -50px",
			}}
		>
			<Layout.Sider
				theme="light"
				breakpoint="lg"
				collapsedWidth="0"
				zeroWidthTriggerStyle={{
					top: "50px",
				}}
				style={{
					height: "calc(100vh - 152px)",
				}}
			>
				<Space
					direction="vertical"
					size={"large"}
					style={{
						width: "100%",
					}}
				>
					<Menu
						ref={profileRef}
						onClick={menuOnClick}
						style={{
							width: "100%",
							borderRight: "none",
							height: "calc(100vh - 238px)",
						}}
						defaultSelectedKeys={["dashboard"]}
						mode="inline"
						items={menuItems}
					/>
					<a href={constants.HOME_URL}>
						<Button
							style={{
								width: "calc(100% - 16px)",
								margin: "8px",
							}}
							onClick={() => {
								removeToken();
								removeUserType();
								removeUserStore();
							}}
						>
							Sign out
						</Button>
					</a>
				</Space>
			</Layout.Sider>
			<Layout.Content
				style={{
					padding: 24,
				}}
			>
				{generateContent()}
			</Layout.Content>
		</Layout>
	);
};

export default Account;

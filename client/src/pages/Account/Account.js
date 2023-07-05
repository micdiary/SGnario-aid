import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, Layout, Button, Space } from "antd";
import {
	UserOutlined,
	LockOutlined,
	HomeOutlined,
	AppstoreOutlined,
} from "@ant-design/icons";

import SuperUserProfile from "./SuperUserProfile/Profile";
import SuperUserDashboard from "./SuperUserProfile/Dashboard";
import SuperUserTask from "./SuperUserProfile/Task";
import SuperUserStorage from "./SuperUserProfile/Storage";

import Profile from "./UserProfile/Profile";
import Dashboard from "./UserProfile/Dashboard";
import Task from "./UserProfile/Task";
import Password from "./UserProfile/Password";

import {
	getUserType,
	removeToken,
	removeUserID,
	removeUserType,
} from "../../utils/account";
import { getProfile } from "../../api/profile";
import { userStore } from "../../utils/store";
import * as constants from "../../constants";
import Loader from "../../components/Loader";

const Account = () => {
	const [view, setView] = useState("dashboard");
	const [task, setTask] = useState(null);
	const [userType, setUserType] = useState(null);
	const [profile, setProfile] = useState({});

	// change views between menus
	const menuOnClick = (e) => {
		setView(e.key);
	};

	const removeUserStore = userStore((state) => state.removeUser);

	useEffect(() => {
		setUserType(getUserType());
		getProfile().then((res) => {
			setProfile(res);
		});
	}, []);

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
					label: "Storage Configurations",
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
					return <Dashboard setView={setView} setTask={setTask} />;
				case "task":
					return <Task task={task} setTask={setTask} setView={setView} />;
				case "profile":
					return <Profile profile={profile} setProfile={setProfile} />;
				case "password":
					return <Password profile={profile} />;
				default:
					return <Loader />;
			}
		} else if (userType === "therapist" || userType === "educator") {
			switch (view) {
				case "dashboard":
					return (
						<SuperUserDashboard
							profile={profile}
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
					return <Password profile={profile} />;
				case "storage":
					return <SuperUserStorage profile={profile} />;
				default:
					return <Loader />;
			}
		}
	};

	return (
		<Layout>
			<Layout.Sider
				style={{
					backgroundColor: "white",
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
						onClick={menuOnClick}
						style={{
							width: "100%",
							borderRight: "none",
						}}
						defaultSelectedKeys={["dashboard"]}
						mode="inline"
						items={menuItems}
					/>
					<Link to={constants.HOME_URL}>
						<Button
							style={{
								width: "calc(100% - 16px)",
								margin: "8px",
								position: "absolute",
								bottom: 0,
							}}
							onClick={() => {
								removeToken();
								removeUserID();
								removeUserType();
								removeUserStore();
							}}
						>
							Sign out
						</Button>
					</Link>
				</Space>
			</Layout.Sider>
			<Layout.Content
				style={{
					padding: 24,
					height: "calc(100vh - 376px)",
				}}
			>
				{generateContent()}
			</Layout.Content>
		</Layout>
	);
};

export default Account;

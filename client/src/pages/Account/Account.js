import React, { useState, useEffect } from "react";
import { Menu, Row, Col } from "antd";
import {
	UserOutlined,
	HomeOutlined,
	AppstoreOutlined,
} from "@ant-design/icons";

import SuperUserProfile from "./SuperUserProfile/Profile";
import SuperUserDashboard from "./SuperUserProfile/Dashboard";
import SuperUserTask from "./SuperUserProfile/Task";

import Profile from "./UserProfile/Profile";
import Dashboard from "./UserProfile/Dashboard";
import Task from "./UserProfile/Task";
import { getUserType } from "../../utils/account";
import { getProfile } from "../../api/profile";

const Account = () => {
	const [view, setView] = useState("profile");
	const [task, setTask] = useState(null);
	const [userType, setUserType] = useState(null);
	const [profile, setProfile] = useState({});

	// change views between menus
	const menuOnClick = (e) => {
		setView(e.key);
	};

	useEffect(() => {
		setUserType(getUserType());
		getProfile().then((res) => {
			setProfile(res);
		});
	}, []);

	const menuItems = [
		{
			label: "Profile",
			key: "profile",
			icon: <UserOutlined />,
		},
		{
			label: "Dashboard",
			key: "dashboard",
			icon: <HomeOutlined />,
		},
		{
			label: "Storage Configurations",
			key: "storage",
			icon: <AppstoreOutlined />,
			hidden: userType === "user",
		},
	];

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
				{view === "profile" &&
					(userType === "therapist" || userType === "educator" ? (
						<SuperUserProfile profile={profile} />
					) : (
						<Profile profile={profile} />
					))}
				{view === "dashboard" &&
					(userType === "therapist" || userType === "educator" ? (
						<SuperUserDashboard
							profile={profile}
							setView={setView}
							setTask={setTask}
						/>
					) : (
						<Dashboard setView={setView} setTask={setTask} />
					))}
				{view === "task" &&
					(userType === "therapist" || userType === "educator" ? (
						<SuperUserTask task={task} setTask={setTask} setView={setView} />
					) : (
						<Task task={task} setTask={setTask} setView={setView} />
					))}
			</Col>
		</Row>
	);
};

export default Account;

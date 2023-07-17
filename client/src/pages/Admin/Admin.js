import React, { useState } from "react";
import { Button, Layout, Menu, Space } from "antd";
import { LaptopOutlined, UserOutlined, TeamOutlined } from "@ant-design/icons";
import UserManagement from "./UserManagement";
import Scenarios from "./Scenarios";
import SuperuserManagement from "./SuperuserManagement";
import { Link } from "react-router-dom";
import { removeToken, removeUserID, removeUserType } from "../../utils/account";
import { userStore } from "../../utils/store";
import * as constants from "../../constants";
const { Content, Sider } = Layout;
const Admin = () => {
	const [selectedKey, setSelectedKey] = useState("1");
	const removeUserStore = userStore((state) => state.removeUser);

	const menuItems = [
		{
			key: "1",
			icon: <UserOutlined />,
			label: "User Management",
		},
		{
			key: "2",
			icon: <TeamOutlined />,
			label: "Therapist Management",
		},
		{
			key: "3",
			icon: <LaptopOutlined />,
			label: "Scenarios",
		},
	];

	return (
		<>
			<Layout
				style={{
					margin: "0 -50px",
				}}
			>
				<Sider
					theme="light"
					collapsedWidth="0"
					style={{
						height: "30vh",
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
							theme="light"
							mode="inline"
							defaultSelectedKeys={["1"]}
							onSelect={(item) => setSelectedKey(item.key)}
							items={menuItems}
						/>
						<Link to={constants.HOME_URL}>
							<Button
								style={{
									width: "calc(100% - 16px)",
									margin: "8px",
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
				</Sider>
				<Content
					style={{
						padding: "0 24px",
					}}
				>
					{selectedKey === "1" && <UserManagement />}
					{selectedKey === "2" && <SuperuserManagement />}
					{selectedKey === "3" && <Scenarios />}
				</Content>
			</Layout>
		</>
	);
};

export default Admin;

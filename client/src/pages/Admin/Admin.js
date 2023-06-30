import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { LaptopOutlined, UserOutlined, TeamOutlined } from "@ant-design/icons";
import UserManagement from "./UserManagement";
import Scenarios from "./Scenarios";
import SuperuserManagement from "./SuperuserManagement";

const { Content, Sider } = Layout;
const Admin = () => {
	const [selectedKey, setSelectedKey] = useState("1");

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
					padding: "24px 0",
				}}
			>
				<Sider
					width={200}
					theme="light"
					style={{
						height: "15vh",
					}}
				>
					<Menu
						theme="light"
						mode="inline"
						defaultSelectedKeys={["1"]}
						onSelect={(item) => setSelectedKey(item.key)}
						items={menuItems}
					/>
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

import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { LaptopOutlined, UserOutlined } from "@ant-design/icons";
import AccountManagement from "./AccountManagement";
import Scenarios from "./Scenarios";

const { Content, Sider } = Layout;
const Admin = () => {
  const [selectedKey, setSelectedKey] = useState("1");

  const menuItems = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: "Accounts Management",
    },
    {
      key: "2",
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
        <Sider width={200}>
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            style={{
              height: "100%",
            }}
            onSelect={(item) => setSelectedKey(item.key)}
            items={menuItems}
          />
        </Sider>
        <Content
          style={{
            padding: "0 24px",
            minHeight: 280,
          }}
        >
          {selectedKey === "1" && <AccountManagement />}
          {selectedKey === "2" && <Scenarios/>}
        </Content>
      </Layout>
    </>
  );
};

export default Admin;

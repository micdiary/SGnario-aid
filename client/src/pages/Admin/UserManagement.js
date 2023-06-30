import React, { useEffect, useState } from "react";
import { Space, Table, Typography, Popconfirm } from "antd";
import { deleteUser, getPatients } from "../../api/admin";

const UserManagement = () => {
	const [data, setData] = useState([]);

	useEffect(() => {
		getPatients().then((res) => {
			setData(res.users);
		});
	}, []);

	const deleteBtn = (value) => {
		deleteUser(value._id).then((res) => {
			alert(res.message);
			const newData = data.filter((item) => item._id !== value._id);
			setData(newData);
		});
	};

	const columns = [
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
		},
		{
			title: "Role",
			dataIndex: "role",
			key: "role",
		},
		{
			title: "Action",
			key: "action",
			render: (value) => (
				<Space size="middle">
					<Popconfirm
						title="Sure to delete?"
						onConfirm={() => deleteBtn(value)}
					>
						<Typography.Link>Delete</Typography.Link>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<>
			<Table columns={columns} dataSource={data} rowKey="_id" />
		</>
	);
};

export default UserManagement;

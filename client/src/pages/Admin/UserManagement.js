import React, { useEffect, useState } from "react";
import { Space, Table, Typography, Popconfirm, Input } from "antd";
import { deleteUser, getPatients } from "../../api/admin";
import { showNotification } from "../../components/Notification";

const UserManagement = () => {
	const [data, setData] = useState([]);
	const [search, setSearch] = useState("");

	useEffect(() => {
		getPatients().then((res) => {
			setData(res.users);
		});
	}, []);

	const deleteBtn = (value) => {
		deleteUser(value._id)
			.then((res) => {
				showNotification(res.message);
				const newData = data.filter((item) => item._id !== value._id);
				setData(newData);
			})
			.catch((err) => {
				showNotification(err.message, "error");
			});
	};

	const onSearch = (value) => {
		setSearch(value);
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
			<Input.Search
				placeholder="search user"
				onSearch={onSearch}
				onChange={(e) => onSearch(e.target.value)}
				style={{
					width: 200,
					marginBottom: 16,
				}}
			></Input.Search>
			<Table
				columns={columns}
				dataSource={
					search === ""
						? data
						: data.filter(
								(item) =>
									item.name.toLowerCase().includes(search.toLowerCase()) ||
									item.email.toLowerCase().includes(search.toLowerCase())
						  )
				}
				rowKey="_id"
			/>
		</>
	);
};

export default UserManagement;

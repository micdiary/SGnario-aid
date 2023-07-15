import React, { useState, useEffect } from "react";
import { Button, Spin, Table, Tag, Input } from "antd";
import { TAG } from "../../../constants";
import { getTasksByToken } from "../../../api/task";

const Dashboard = ({ setView, setTask }) => {
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");

	useEffect(() => {
		setLoading(true);
		getTasksByToken().then((res) => {
			setTasks(res);
			setLoading(false);
		});
	}, []);

	const onSearch = (value) => {
		setSearch(value);
	};

	const columns = [
		{
			title: "Task Title",
			dataIndex: "title",
			key: "title",
		},
		{
			title: "Date Assigned",
			dataIndex: "dateAssigned",
			key: "dateAssigned",
			render: (date) => new Date(date).toLocaleDateString("en-SG"),
			sorter: (a, b) => new Date(a.dateAssigned) - new Date(b.dateAssigned),
			sortDirections: ["descend"],
			defaultSortOrder: "descend",
		},
		{
			title: "Assigned By",
			dataIndex: "therapist",
			key: "therapist",
		},
		{
			title: "Status",
			key: "status",
			dataIndex: "status",
			render: (tag) => (
				<>
					<Tag color={TAG[tag]} key={tag}>
						{tag.toUpperCase()}
					</Tag>
				</>
			),
		},
		{
			title: "Action",
			key: "action",
			render: (text, record) => (
				<Button onClick={() => handleNavigation(record)}>View Task</Button>
			),
		},
	];

	const handleNavigation = (record) => {
		setTask(record);
		setView("task");
	};

	return (
		<Spin spinning={loading}>
			<Input.Search
				placeholder="search task"
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
						? tasks
						: tasks.filter((item) =>
								item.title.toLowerCase().includes(search.toLowerCase())
						  )
				}
				rowKey={"_id"}
				scroll={{ x: true }}
			/>
		</Spin>
	);
};

export default Dashboard;

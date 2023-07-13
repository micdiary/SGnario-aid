import React, { useState, useEffect } from "react";
import { Button, Spin, Table, Tag } from "antd";
import { TAG } from "../../../constants";
import { getTasksByToken } from "../../../api/task";

const Dashboard = ({ setView, setTask }) => {
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		getTasksByToken().then((res) => {
			setTasks(res);
			setLoading(false);
		});
	}, []);

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
			<Table
				columns={columns}
				dataSource={tasks}
				rowKey={"_id"}
				scroll={{ x: true }}
			/>
		</Spin>
	);
};

export default Dashboard;

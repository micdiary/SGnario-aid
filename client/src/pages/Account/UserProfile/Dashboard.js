import React, { useState, useEffect } from "react";
import { Button, Table, Tag } from "antd";
import { INCOMPLETE_TAG, PENDING_TAG, COMPLETE_TAG } from "../../../constants";
import { getTasksByToken } from "../../../api/task";

const Dashboard = ({ setView, setTask }) => {
	const [tasks, setTasks] = useState([]);

	useEffect(() => {
		getTasksByToken().then((res) => {
			console.log(res);
			setTasks(res);
		});
	}, []);

	const columns = [
		{
			title: "Scenario",
			dataIndex: "scenario",
			key: "scenario",
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
					<Tag color={tag === INCOMPLETE_TAG ? "volcano" : "green"} key={tag}>
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

	return <Table columns={columns} dataSource={tasks}></Table>;
};

export default Dashboard;

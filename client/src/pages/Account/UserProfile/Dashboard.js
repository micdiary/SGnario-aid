import React, { useState, useEffect } from "react";
import { Button, Table, Tag } from "antd";
import { INCOMPLETE_TAG, PENDING_TAG, COMPLETE_TAG } from "../../../constants";
import { getTasksByToken } from "../../../api/task";

const Dashboard = ({ setView, setTaskID }) => {
	const [tasks, setTasks] = useState([]);

	useEffect(() => {
		if (tasks.length === 0) {
			getTasksByToken().then((res) => {
				console.log(res);
				setTasks(res);
			});
		}
	}, [tasks]);

	const columns = [
		{
			title: "Scenario",
			dataIndex: "scenario",
			key: "scenario",
		},
		{
			title: "Category",
			dataIndex: "category",
			key: "category",
		},
		{
			title: "Video Name",
			dataIndex: "videoName",
			key: "videoName",
			width: 150,
		},
		{
			title: "Date Assigned",
			dataIndex: "dateAssigned",
			key: "dateAssigned",
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
			title: "Patient Grade",
			dataIndex: "patientGrade",
			key: "patientGrade",
			render: (patientGrade) => (
				<>
					<Tag
						color={patientGrade > 0 ? "green" : "volcano"}
						key={patientGrade}
					>
						{patientGrade.length > 0
							? COMPLETE_TAG.toUpperCase()
							: INCOMPLETE_TAG.toUpperCase()}
					</Tag>
				</>
			),
		},
		{
			title: "Therapist Grade",
			dataIndex: "therapistGrade",
			key: "therapistGrade",
			render: (therapistGrade) => (
				<>
					<Tag
						color={therapistGrade.length > 0 ? "green" : "yellow"}
						key={therapistGrade}
					>
						{therapistGrade.length > 0
							? COMPLETE_TAG.toUpperCase()
							: PENDING_TAG.toUpperCase()}
					</Tag>
				</>
			),
		},
		{
			title: "Action",
			key: "action",
			render: (text, record) => (
				<Button onClick={() => handleNavigation(record._id)}>View Task</Button>
			),
		},
	];

	const handleNavigation = (id) => {
		setTaskID(id);
		setView("task");
	};

	return <Table columns={columns} dataSource={tasks}></Table>;
};

export default Dashboard;

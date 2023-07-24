import React, { useState, useEffect, useRef, forwardRef } from "react";
import { Button, Spin, Table, Tag, Input, Row, Typography, Tour } from "antd";
import { TAG } from "../../../constants";
import { getTasksByToken } from "../../../api/task";
import { QuestionCircleOutlined } from "@ant-design/icons";

const Dashboard = forwardRef(({ setView, setTask }, ref) => {
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
						{tag === "Pending"
							? `${tag.toUpperCase()} REVIEW`
							: `${tag.toUpperCase()}`}
					</Tag>
				</>
			),
		},
		{
			title: "Action",
			key: "action",
			render: (text, record) => (
				<Button type="primary" onClick={() => handleNavigation(record)}>View Task</Button>
			),
		},
	];

	const handleNavigation = (record) => {
		setTask(record);
		setView("task");
	};

	const dashboardRef = useRef(null);

	const [tourVisible, setTourVisible] = useState(false);
	const tourSteps = [
		{
			title: "Tools",
			description:
				"This is your dashboard. You can view your tasks here assigned by your therapist.",
			placement: "top",
			target: () => dashboardRef.current,
		},
		{
			title: "Settings",
			description:
				"You can edit your profile, password and accept therapist request here.",
			placement: "right",
			target: () => ref.current.menu.list,
		},
	];

	return (
		<Spin spinning={loading}>
			<Row justify={"space-between"}>
				<Input.Search
					placeholder="search task"
					onSearch={onSearch}
					onChange={(e) => onSearch(e.target.value)}
					style={{
						width: 200,
						marginBottom: 16,
					}}
				></Input.Search>
				<Typography.Text
					strong
					onClick={() => setTourVisible(true)}
					style={{ float: "right" }}
				>
					Need help? <QuestionCircleOutlined />
				</Typography.Text>
			</Row>
			<Table
				ref={dashboardRef}
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
			<Tour
				steps={tourSteps}
				open={tourVisible}
				onClose={() => setTourVisible(false)}
			/>
		</Spin>
	);
});

export default Dashboard;

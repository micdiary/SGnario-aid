import React, { useEffect, useState } from "react";
import { Button, Typography, Tag, Row, Col, Divider, Breadcrumb } from "antd";
import SuperTaskTaskModal from "./TaskModal";
import { populateTaskData } from "../../../utils/task";
import * as constants from "../../../constants";
import { updateStatus } from "../../../api/task";
import TaskCard from "../../../components/TaskCard";

const SuperUserTask = ({ task, setTask, setView }) => {
	const [populateData, setPopulateData] = useState([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [modalData, setModalData] = useState({});

	useEffect(() => {
		setPopulateData(populateTaskData(task));
	}, [task]);

	const edit = (record) => {
		setModalVisible(true);
		setModalData(record);
	};

	const updateBtnOnclick = (status) => {
		let req = {};
		if (status === "Pending") {
			req = {
				newStatus: "Completed",
				taskId: task._id,
			};
		} else {
			req = {
				newStatus: "Pending",
				taskId: task._id,
			};
		}

		updateStatus(req).then((res) => {
			alert(res.message || res.error);
			setTask(res.task);
		});
	};

	const renderStatusBtn = (status) => {
		switch (status) {
			case "Incomplete":
				return "Pending submission";
			case "Pending":
				return "Mark as completed";
			case "Completed":
				return "Mark as pending";
			default:
				return "Pending submission";
		}
	};

	return (
		<>
			<Breadcrumb
				items={[
					{
						href: "#",
						title: "Dashboard",
						onClick: () => {
							setView("dashboard");
						},
					},
					{
						title: task.title,
					},
				]}
			/>
			<Divider />
			<Row justify={"space-between"} gutter={[0, 12]}>
				<Col
					span={12}
					style={{
						display: "inline-flex",
						alignItems: "center",
					}}
				>
					<Typography.Title
						style={{
							minWidth: 120,
							margin: 0,
							marginRight: 4,
						}}
						level={2}
					>
						{task.title}
					</Typography.Title>
					<Tag color={constants.TAG[task.status]}>{task.status}</Tag>
				</Col>
				<Col
					style={{
						display: "inline-flex",
						alignItems: "center",
					}}
				>
					<Button
						onClick={() => {
							updateBtnOnclick(task.status);
						}}
						disabled={task.status === "Incomplete"}
						type="primary"
					>
						{renderStatusBtn(task.status)}
					</Button>
				</Col>
			</Row>
			<Divider />
			<Row gutter={[16, 16]}>
				{populateData &&
					populateData.map((record) => {
						return (
							<Col span={24} lg={8}>
								<TaskCard record={record} editCard={edit} />
							</Col>
						);
					})}
			</Row>
			<SuperTaskTaskModal
				modalVisible={modalVisible}
				setModalVisible={setModalVisible}
				modalData={modalData}
				setPopulateData={setPopulateData}
			/>
		</>
	);
};

export default SuperUserTask;

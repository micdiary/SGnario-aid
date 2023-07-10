import React, { useEffect, useState } from "react";
import {
	Button,
	Typography,
	Tag,
	Row,
	Col,
	Divider,
	Breadcrumb,
	Spin,
} from "antd";
import UserTaskModal from "./TaskModal";
import { updateStatus } from "../../../api/task";
import { populateTaskData } from "../../../utils/task";
import * as constants from "../../../constants";
import TaskCard from "../../../components/TaskCard";
import NewTaskSubmissionModal from "../../../components/NewTaskSubmissionModal";
import { showNotification } from "../../../components/Notification";

const Task = ({ task, setTask, setView }) => {
	const [populateData, setPopulateData] = useState([]);
	const [formLoading, setFormLoading] = useState(false);
	const [recordingModalVisible, setRecordingModalVisible] = useState(false);
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
				newStatus: "Incomplete",
				taskId: task._id,
			};
		} else {
			req = {
				newStatus: "Pending",
				taskId: task._id,
			};
		}

		updateStatus(req)
			.then((res) => {
				showNotification(res.message);
				setTask(res.task);
			})
			.catch((err) => {
				showNotification(err.message, "error");
			});
	};

	const renderStatusBtn = (status) => {
		switch (status) {
			case "Incomplete":
				return "Mark as pending";
			case "Pending":
				return "Mark as incomplete";
			case "Completed":
				return "Task completed";
			default:
				return "Mark as incomplete";
		}
	};

	return (
		<Spin spinning={formLoading}>
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
				<Col span={16}>
					<Row
						gutter={[0, 12]}
						style={{
							display: "inline-flex",
							alignItems: "center",
						}}
					>
						<Col>
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
						</Col>
						<Col>
							<Tag color={constants.TAG[task.status]}>{task.status}</Tag>
						</Col>
					</Row>
				</Col>
				<Col
					style={{
						display: "inline-block",
						alignItems: "center",
					}}
				>
					<Button
						onClick={() => {
							updateBtnOnclick(task.status);
						}}
						disabled={task.status === "Completed"}
						type="primary"
						style={{
							marginRight: 8,
						}}
					>
						{renderStatusBtn(task.status)}
					</Button>
					<Button
						task
						onClick={() => {
							setRecordingModalVisible(true);
						}}
						type="primary"
						disabled={task.status === "Completed"}
					>
						Add a new recording
					</Button>
				</Col>
			</Row>
			<Divider />
			<Row gutter={[16, 16]}>
				{populateData &&
					populateData.map((record) => {
						return (
							<Col span={24} md={12} xxl={8}>
								<TaskCard record={record} editCard={edit} />
							</Col>
						);
					})}
			</Row>
			<NewTaskSubmissionModal
				recordingModalVisible={recordingModalVisible}
				setRecordingModalVisible={setRecordingModalVisible}
				task={task}
				setPopulateData={setPopulateData}
				setLoading={setFormLoading}
			/>
			<UserTaskModal
				modalVisible={modalVisible}
				setModalVisible={setModalVisible}
				modalData={modalData}
				setPopulateData={setPopulateData}
			/>
		</Spin>
	);
};

export default Task;

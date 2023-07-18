import React, { useEffect, useState, useRef } from "react";
import {
	Button,
	Typography,
	Tag,
	Row,
	Col,
	Divider,
	Breadcrumb,
	Spin,
	Tour,
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
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

	// tour
	const statusBtn = useRef(null);
	const newSubmissionBtn = useRef(null);
	const cards = useRef(null);
	const [tourVisible, setTourVisible] = useState(false);
	const tourSteps = [
		{
			title: "Task Status",
			description:
				"Click here to change the status of the task once you have submitted your recording.",
			target: () => statusBtn.current,
		},
		{
			title: "New Submission",
			description:
				"Click here to submit a new recording for the task. You can submit multiple recordings for the same task.",
			target: () => newSubmissionBtn.current,
		},
		{
			title: "Task Submissions",
			description:
				"Click on the card tabs to view the details of the submission. You can also edit the submission by clicking on the icon.",
			target: () => cards.current,
		},
	];

	return (
		<Spin spinning={formLoading}>
			<Row justify={"space-between"}>
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
				<Typography.Text strong onClick={() => setTourVisible(true)}>
					Need help? <QuestionCircleOutlined />
				</Typography.Text>
			</Row>
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
									margin: 0,
									marginRight: 4,
								}}
								level={2}
							>
								{task.title}
							</Typography.Title>
						</Col>
						<Col lg={8} xs={24}>
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
						ref={statusBtn}
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
						ref={newSubmissionBtn}
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
			<Row gutter={[16, 16]} ref={cards}>
				{populateData &&
					populateData.map((record) => {
						return (
							<Col span={24} md={12} xxl={8}>
								<TaskCard
									record={record}
									editCard={edit}
									setIsLoading={setFormLoading}
								/>
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
			<Tour
				open={tourVisible}
				onClose={() => setTourVisible(false)}
				steps={tourSteps}
			></Tour>
		</Spin>
	);
};

export default Task;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	Button,
	Table,
	Typography,
	Popconfirm,
	Form,
	Tag,
	Upload,
	Descriptions,
	Row,
	Col,
} from "antd";
import SuperTaskTaskModal from "./TaskModal";
import { populateTaskData } from "../../../utils/task";
import * as constants from "../../../constants";
import { updateStatus } from "../../../api/task";

const { Column, ColumnGroup } = Table;
const SuperUserTask = ({ task, setTask, setView }) => {
	const [populateData, setPopulateData] = useState([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [modalData, setModalData] = useState({});

	useEffect(() => {
		setPopulateData(populateTaskData(task));
	}, [task]);

	const [form] = Form.useForm();

	const edit = (record) => {
		setModalVisible(true);
		setModalData(record);
	};

	const updateBtnOnclick = () => {
		const req = {
			newStatus: "Complete",
			taskId: task._id,
		};

		updateStatus(req).then((res) => {
			alert(res.message || res.error);
			setTask(res.task);
		});
	};

	return (
		<>
			<Button
				onClick={() => {
					setView("dashboard");
				}}
				type="primary"
				style={{
					marginRight: 16,
				}}
			>
				Back
			</Button>
			<Button
				onClick={() => {
					updateBtnOnclick();
				}}
				disabled={task.status !== "Pending"}
				type="primary"
				style={{
					marginBottom: 16,
				}}
			>
				Mark as completed
			</Button>
			<Row align={"middle"} gutter={12}>
				<Col>
					<Link
						to={`${constants.SCENARIOS_URL}?category=${encodeURIComponent(
							task.category
						)}&scenario=${encodeURIComponent(task.scenario)}`}
						target="_blank"
					>
						<Typography.Title
							style={{
								display: "inline-block",
							}}
						>
							{task.scenario}
						</Typography.Title>
					</Link>
				</Col>
				<Col>
					<Tag color={constants.TAG[task.status]}>{task.status}</Tag>
				</Col>
			</Row>
			<Form form={form} component={false}>
				<Table
					expandable={{
						expandedRowRender: (record) => {
							const data = [
								{
									key: record.key,
									patientRemark: record.patientRemark,
									therapistRemark: record.therapistRemark,
								},
							];
							return (
								<Table dataSource={data} pagination={false}>
									<Column
										title="Patient Remark"
										dataIndex="patientRemark"
										key="patientRemark"
									></Column>
									<Column
										title="Therapist Remark"
										dataIndex="therapistRemark"
										key="therapistRemark"
									></Column>
								</Table>
							);
						},
					}}
					dataSource={populateData}
					pagination={false}
				>
					<Column
						title="Video Name"
						dataIndex="videoName"
						key="videoName"
					></Column>
					<ColumnGroup title="Self Evaluation">
						<Column
							title="Stutter"
							dataIndex="patientStutter"
							key="patientStutter"
						/>
						<Column
							title="Fluency"
							dataIndex="patientFluency"
							key="patientFluency"
						/>
					</ColumnGroup>
					<ColumnGroup title="Therapist Evaluation">
						<Column
							title="Stutter"
							dataIndex="therapistStutter"
							key="therapistStutter"
							render={(text, record) => {
								if (record.therapistStutter === "") {
									return <Tag color="yellow">Pending</Tag>;
								} else {
									return <Tag color="green">{text}</Tag>;
								}
							}}
						/>
						<Column
							title="Fluency"
							dataIndex="therapistFluency"
							key="therapistFluency"
							render={(text, record) => {
								if (record.therapistStutter === "") {
									return <Tag color="yellow">Pending</Tag>;
								} else {
									return <Tag color="green">{text}</Tag>;
								}
							}}
						/>
					</ColumnGroup>
					<Column
						title="Recording Duration (s)"
						dataIndex="videoDuration"
						key="videoDuration"
						render={(text, record) => {
							if (record.recordingLink.startsWith("https")) {
								return (
									<Typography.Link href={record.recordingLink} target="_blank">
										{text}
									</Typography.Link>
								);
							} else {
								return <Typography>NULL</Typography>;
							}
						}}
					></Column>
					<Column
						title="Date Submitted"
						dataIndex="dateSubmitted"
						key="dateSubmitted"
					></Column>
					<Column
						title="Action"
						key="action"
						render={(_, record) => (
							<Typography.Link onClick={() => edit(record)}>
								Edit
							</Typography.Link>
						)}
					></Column>
				</Table>
			</Form>
			<Descriptions
				title={"Recommended Duration for Recordings"}
				bordered
				style={{
					marginTop: 16,
				}}
			>
				{task.recommendedLength &&
					task.recommendedLength.map((item, index) => {
						return (
							<Descriptions.Item label={task.videos[index].videoName} span={3}>
								{item} seconds
							</Descriptions.Item>
						);
					})}
			</Descriptions>
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

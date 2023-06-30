import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Table, Typography, Popconfirm, Form, Tag, Upload } from "antd";
import SuperTaskTaskModal from "./TaskModal";
import { populateTaskData } from "../../../utils/task";
import * as constants from "../../../constants";

const { Column, ColumnGroup } = Table;
const SuperUserTask = ({ task, setView }) => {
	const [populateData, setPopulateData] = useState([]);
	const [editingKey, setEditingKey] = useState("");
	const [modalVisible, setModalVisible] = useState(false);
	const [modalData, setModalData] = useState({});

	useEffect(() => {
		setPopulateData(populateTaskData(task));
	}, [task]);

	const [form] = Form.useForm();

	const edit = (record) => {
		setEditingKey(record.key);
		setModalVisible(true);
		setModalData(record);
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
			<Link
				to={`${constants.SCENARIOS_URL}?category=${encodeURIComponent(
					task.category
				)}&scenario=${encodeURIComponent(task.scenario)}`}
				target="_blank"
			>
				<Typography.Title>{task.scenario}</Typography.Title>
			</Link>
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
						title="Date Added"
						dataIndex="dateAdded"
						key="dateAdded"
					></Column>
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

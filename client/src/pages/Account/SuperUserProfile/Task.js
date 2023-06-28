import React, { useEffect, useState } from "react";
import { Button, Table, Typography, Popconfirm, Form, Tag, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import SuperTaskTaskModal from "./TaskModal";

const { Column, ColumnGroup } = Table;
const SuperUserTask = ({ task, setView }) => {
	const [populateData, setPopulateData] = useState([]);
	const [editingKey, setEditingKey] = useState("");
	const [modalVisible, setModalVisible] = useState(false);
	const [modalData, setModalData] = useState({});

	useEffect(() => {
		let tempData = [];
		for (let i = 0; i < task.videos.length; i++) {
			const video = task.videos[i];
			let temp = {
				key: i,
				taskId: task._id,
				submissionId: task.submissions[i]._id,
				videoName: video.videoName,
				videoId: video.videoId,
				patientStutter: video.patientStutter || "",
				patientFluency: video.patientFluency || "",
				patientRemark: video.patientRemark || "No Patient Remark",
				therapistStutter: task.submissions[i].therapistStutter || "",
				therapistFluency: task.submissions[i].therapistFluency || "",
				therapistRemark: task.submissions[i].therapistRemark || "No Therapist Remark",
				recording: video.recording || "",
			};
			tempData.push(temp);
		}
		setPopulateData(tempData);
	}, [task]);

	const [form] = Form.useForm();

	const edit = (record) => {
		setEditingKey(record.key);
		setModalVisible(true);
		setModalData(record);
	};

	const onFileUpload = ({ file, fileList }) => {
		console.log(file);
		console.log(fileList);
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
			<Typography.Title>{task.scenario}</Typography.Title>
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
					<Column title="Video Link" dataIndex="videoId" key="videoId"></Column>
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
						title="Recording"
						dataIndex="recording"
						key="recording"
						render={(text, record) => {
							return (
								<Upload
									onChange={onFileUpload}
									disabled={editingKey !== record.key}
								>
									<Button icon={<UploadOutlined />}>Upload</Button>
								</Upload>
							);
						}}
					></Column>
					<Column
						title="Date Added"
						dataIndex="dateAdded"
						key="dateAdded"
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

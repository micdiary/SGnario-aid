import React, { useEffect, useState } from "react";
import {
	Button,
	Table,
	Typography,
	Form,
	Tag,
	Upload,
	Modal,
	Input,
	InputNumber,
	Select,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import UserTaskModal from "./TaskModal";
import { updateTask } from "../../../api/task";
import { populateTaskData } from "../../../utils/task";

const { Column, ColumnGroup } = Table;
const Task = ({ task, setView }) => {
	const [populateData, setPopulateData] = useState([]);
	const [form] = Form.useForm();
	const [addRecordingForm] = Form.useForm();
	const [recordingModalVisible, setRecordingModalVisible] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [modalData, setModalData] = useState({});
	const [editingKey, setEditingKey] = useState("");

	useEffect(() => {
		console.log(task);
		setPopulateData(populateTaskData(task));
	}, [task]);

	const edit = (record) => {
		setEditingKey(record.key);
		setModalVisible(true);
		setModalData(record);
	};

	const onFileUpload = ({ file, fileList }) => {
		console.log(file);
		console.log(fileList);
	};

	const onFinish = (values) => {
		const req = {
			taskId: task._id,
			videoName: values.videoName,
			stutter: values.patientStutter,
			fluency: values.patientFluency,
			remark: values.patientRemark,
		};

		updateTask(req).then((res) => {
			alert(res.message || res.errror);
			setPopulateData(populateTaskData(res.task));
		});
	};

	const onModalOk = () => {
		addRecordingForm.submit();
		setRecordingModalVisible(false);
	};

	const generateModal = () => {
		const formItem = [
			{
				label: "Video Name",
				name: "videoName",
				rules: [
					{
						required: true,
						message: "Please input your video name!",
					},
				],
				input: (
					<Select
						options={task.videos.map((video, index) => {
							return { label: video.videoName, value: video.videoName };
						})}
					/>
				),
			},
			{
				label: "Stutter",
				name: "patientStutter",
				rules: [
					{
						required: true,
						message: "Please input your score!",
					},
				],
				input: <InputNumber />,
			},
			{
				label: "Fluency",
				name: "patientFluency",
				rules: [
					{
						required: true,
						message: "Please input your score!",
					},
				],
				input: <InputNumber />,
			},
			{
				label: "Remark",
				name: "patientRemark",
				rules: [
					{
						required: true,
						message: "Please input your remark!",
					},
				],
				input: <Input />,
			},
			{
				label: "Recording",
				name: "recordingLink",
				// rules: [
				// 	{
				// 		required: true,
				// 		message: "Please input your recording link!",
				// 	},
				// ],
				input: (
					<Upload onChange={onFileUpload}>
						<Button icon={<UploadOutlined />}>Upload</Button>
					</Upload>
				),
			},
		];
		const modalForm = (formItem) => {
			return formItem.map((item, index) => {
				return (
					<Form.Item
						name={item.name}
						label={item.label}
						rules={item.rules}
						key={index}
					>
						{item.input}
					</Form.Item>
				);
			});
		};
		return modalForm(formItem);
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
					setRecordingModalVisible(true);
				}}
				type="primary"
				style={{
					marginBottom: 16,
				}}
			>
				Add a new recording
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
								<Table dataSource={data} pagination={false} rowKey="_id">
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
					rowKey="key"
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
						dataIndex="recordingLink"
						key="recordingLink"
						render={(text, record) => {
							return <Typography.Link>{text}</Typography.Link>;
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
			<Modal
				title="Add a new recording"
				open={recordingModalVisible}
				onOk={onModalOk}
				onCancel={() => setRecordingModalVisible(false)}
			>
				<Form form={addRecordingForm} onFinish={onFinish}>
					{generateModal()}
				</Form>
			</Modal>
			<UserTaskModal
				modalVisible={modalVisible}
				setModalVisible={setModalVisible}
				modalData={modalData}
				setPopulateData={setPopulateData}
			/>
		</>
	);
};

export default Task;

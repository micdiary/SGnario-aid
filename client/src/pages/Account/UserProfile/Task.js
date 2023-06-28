import React, { useEffect, useState } from "react";
import {
	Input,
	Button,
	Table,
	Typography,
	Popconfirm,
	Form,
	Tag,
	Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Column, ColumnGroup } = Table;
const Task = ({ task, setView }) => {
	const [count, setCount] = useState(0);
	const [populateData, setPopulateData] = useState([]);
	const [expandableData, setExpandableData] = useState([]);
	const [editingKey, setEditingKey] = useState("");
	const isEditing = (record) => record.key === editingKey;

	useEffect(() => {
		let tempData = [];
		for (let i = 0; i < task.videos.length; i++) {
			const video = task.videos[i];
			let temp = {
				key: i,
				videoName: video.videoName,
				videoId: video.videoId,
				patientStutter: video.patientStuttering || "test",
				patientFluency: video.patientFluency || "test",
				patientRemark: video.patientRemark || "No Patient Remark",
				therapistStutter: video.therapistStuttering || "",
				therapistFluency: video.therapistFluency || "",
				therapistRemark: video.therapistRemark || "No Therapist Remark",
				recording: video.recording || "",
			};
			tempData.push(temp);
		}
		setPopulateData(tempData);
	}, [task.videos]);

	const EditableCell = ({
		editing,
		dataIndex,
		title,
		inputType,
		record,
		index,
		children,
		...restProps
	}) => {
		return (
			<td {...restProps}>
				{editing ? (
					<Form.Item
						name={dataIndex}
						style={{
							margin: 0,
						}}
						rules={[
							{
								required: true,
								message: `Please Input ${title}!`,
							},
						]}
					>
						<Input />
					</Form.Item>
				) : (
					children
				)}
			</td>
		);
	};

	const [form] = Form.useForm();

	const edit = (record) => {
		form.setFieldsValue({
			patientFluency: "",
			patientStutter: "",
			patientRemark: "",
			...record,
		});
		setEditingKey(record.key);
	};

	const cancel = () => {
		setEditingKey("");
	};

	const save = async (key) => {
		try {
			const row = await form.validateFields();
			const newData = [...populateData];
			const index = newData.findIndex((item) => key === item.key);
			if (index > -1) {
				const item = newData[index];
				newData.splice(index, 1, {
					...item,
					...row,
				});
				setPopulateData(newData);
				setEditingKey("");
			} else {
				newData.push(row);
				setPopulateData(newData);
				setEditingKey("");
			}
		} catch (errInfo) {
			console.log("Validate Failed:", errInfo);
		}
	};

	const onFileUpload = ({ file, fileList }) => {
		console.log(file);
		console.log(fileList);
	};

	const handleAdd = () => {
		const newData = {
			key: count,
			video: count,
			selfEvaluation: `Self Evaluation ${count}`,
			selfScore: `Self Score ${count}`,
			therapistFeedback: `Therapist Feedback ${count}`,
			therapistScore: `Therapist Score ${count}`,
		};
		setExpandableData([...expandableData, newData]);
		setCount(count + 1);
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
				onClick={handleAdd}
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
							console.log(record);
							const data = [
								{
									key: record.key,
									patientRemark: record.patientRemark,
									therapistRemark: record.therapistRemark,
								},
							];
							return (
								<Table
									dataSource={data}
									pagination={false}
									components={{
										body: {
											cell: EditableCell,
										},
									}}
								>
									<Column
										title="Patient Remark"
										dataIndex="patientRemark"
										key="patientRemark"
										onCell={(record) => ({
											record,
											inputType: "text",
											dataIndex: "patientRemark",
											title: "Patient Remark",
											editing: isEditing(record),
										})}
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
					components={{
						body: {
							cell: EditableCell,
						},
					}}
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
							onCell={(record) => ({
								record,
								inputType: "text",
								dataIndex: "patientStutter",
								title: "Stutter",
								editing: isEditing(record),
							})}
						/>
						<Column
							title="Fluency"
							dataIndex="patientFluency"
							key="patientFluency"
							editable={true}
							onCell={(record) => ({
								record,
								inputType: "text",
								dataIndex: "patientFluency",
								title: "Fluency",
								editing: isEditing(record),
							})}
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
						render={(_, record) => {
							const editable = isEditing(record);
							return editable ? (
								<span>
									<Typography.Link
										onClick={() => save(record.key)}
										style={{
											marginRight: 8,
										}}
									>
										Save
									</Typography.Link>
									<Popconfirm title="Sure to cancel?" onConfirm={cancel}>
										<Typography.Link>Cancel</Typography.Link>
									</Popconfirm>
								</span>
							) : (
								<Typography.Link
									disabled={editingKey !== ""}
									onClick={() => edit(record)}
								>
									Edit
								</Typography.Link>
							);
						}}
					></Column>
				</Table>
			</Form>
		</>
	);
};

export default Task;

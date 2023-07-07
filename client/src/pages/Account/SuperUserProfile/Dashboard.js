import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, Select, Table, Tag, Cascader } from "antd";
import Loader from "../../../components/Loader";
import {
	getPatientsByTherapist,
	getPatientsTasks,
} from "../../../api/therapist";
import { createTasks, getTaskStatusCount } from "../../../api/task";
import { getScenarios } from "../../../api/scenarios";

const { Option } = Select;

const SuperUserDashboard = ({ profile, setView, setTask }) => {
	const [form] = Form.useForm();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [patientOptions, setPatientOptions] = useState([]);
	const [videoOptions, setVideoOptions] = useState([]);
	const [selectedScenario, setSelectedScenario] = useState([]);

	const fetchPatientTasks = async () => {
		try {
			const patients = await getPatientsByTherapist();

			for (let i = 0; i < patients.users.length; i++) {
				const patientTasks = await getPatientsTasks(patients.users[i]._id);
				patients.users[i].tasks = patientTasks;
				const taskStatusCount = await getTaskStatusCount(patients.users[i]._id);
				patients.users[i].taskStatusCount = taskStatusCount;
			}
			setPatientOptions(patients.users || []);
		} catch (error) {
			// Handle error
			console.error(error);
		}
	};

	useEffect(() => {
		if (profile.email) {
			form.setFieldsValue({
				name: profile.email,
			});

			fetchPatientTasks();

			getScenarios().then((res) => {
				const options = res.reduce((acc, cur) => {
					const category = cur.category;
					const scenario = cur.scenario;
					const found = acc.findIndex((item) => item.value === category);

					const videoOptions = {
						value: scenario,
						label: scenario,
						children: cur.videos.map((video) => {
							return {
								value: video.videoName,
								label: video.videoName,
							};
						}),
					};

					if (found < 0) {
						let temp = {
							value: category,
							label: category,
							children: [videoOptions],
						};
						return [...acc, temp];
					}

					let copy = [...acc];
					copy[found].children.push(videoOptions);
					return copy;
				}, []);

				setVideoOptions(options || []);
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [profile]);

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = () => {
		setIsModalVisible(false);
		form.submit();
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const onFormFinish = (values) => {
		setConfirmLoading(true);

		let videos = [];
		for (let i = 0; i < values.videos.length; i++) {
			videos.push({
				category: values.videos[i][0],
				scenario: values.videos[i][1],
				videoName: values.videos[i][2],
			});
		}

		let recommendedLength = [];
		Object.entries(values.recommendedLength).forEach((entry) => {
			let key = entry[0];
			let value = entry[1];
			recommendedLength.push({
				videoName: key,
				length: value,
			});
		});

		const req = {
			title: values.title,
			name: patientOptions.find((patient) => patient.email === values.patient)
				.name,
			email: values.patient,
			videos: videos,
			recommendedLength: recommendedLength,
		};

		createTasks(req).then((res) => {
			alert(res.message || res.error);
			fetchPatientTasks();
			form.resetFields();
			setIsModalVisible(false);
			setConfirmLoading(false);
		});
	};

	const videosOnChange = (value) => {
		console.log(value);
		let temp = [];
		for (let i = 0; i < value.length; i++) {
			temp.push(value[i][2]);
		}
		setSelectedScenario(temp);
	};

	const formItem = [
		{
			label: "Name",
			name: "name",
			input: <Input disabled />,
		},
		{
			label: "Patient",
			name: "patient",
			rules: [
				{
					required: true,
					message: "Please input your patient!",
				},
			],
			input: (
				<Select placeholder="Select a patient">
					{patientOptions.length > 0 &&
						patientOptions.map((patient) => {
							return (
								<Option value={patient.email} key={patient.email}>
									{patient.name} [{patient.email}]
								</Option>
							);
						})}
				</Select>
			),
		},
		{
			label: "Task Title",
			name: "title",
			rules: [
				{
					required: true,
					message: "Please input your task title!",
				},
			],
			input: <Input />,
		},
		{
			label: "Videos",
			name: "videos",
			rules: [
				{
					required: true,
					message: "Please input your scenario!",
				},
			],
			input: (
				<Cascader
					onChange={videosOnChange}
					options={videoOptions}
					showCheckedStrategy={Cascader.SHOW_CHILD}
					multiple
				/>
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
					valuePropName={item.valuePropName}
				>
					{item.input}
				</Form.Item>
			);
		});
	};

	const columns = [
		{
			title: "Patient Name",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Gender",
			dataIndex: "gender",
			key: "gender",
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
		},
		{
			title: "Pending Tasks",
			dataIndex: "taskStatusCount",
			key: "taskStatusCount",
			render: (tasks) => (tasks.status.Pending ? tasks.status.Pending : 0),
		},
		{
			title: "Issue",
			dataIndex: "issue",
			key: "issue",
			render: (issue) => renderIssues(issue),
		},
	];

	const renderIssues = (issues) => {
		return issues.map((issue, index) => {
			return <Tag key={index}> {issue}</Tag>;
		});
	};

	return profile.name ? (
		<>
			<Button type="primary" onClick={showModal}>
				Assign Task
			</Button>
			<Table
				columns={columns}
				dataSource={patientOptions}
				rowKey="_id"
				expandable={{
					expandedRowRender: (record) => {
						const columns = [
							{
								title: "Date Assigned",
								dataIndex: "dateAssigned",
								key: "dateAssigned",
							},
							{
								title: "Title",
								dataIndex: "title",
								key: "title",
							},
							{
								title: "Status",
								dataIndex: "status",
								key: "status",
							},
							{
								title: "Action",
								dataIndex: "action",
								key: "action",
								render: (text, record) => (
									<Button
										type="primary"
										onClick={() => {
											setView("task");
											console.log(record);
											setTask(record);
										}}
									>
										Grade Task
									</Button>
								),
							},
						];
						return (
							<Table
								columns={columns}
								dataSource={record.tasks}
								rowKey="_id"
								pagination={false}
							/>
						);
					},
				}}
			/>
			<Modal
				destroyOnClose
				title="Assign Task"
				open={isModalVisible}
				onOk={handleOk}
				confirmLoading={confirmLoading}
				onCancel={handleCancel}
			>
				<Form form={form} onFinish={onFormFinish}>
					{modalForm(formItem)}
					<Form.List name="recommendedLength">
						{() =>
							selectedScenario &&
							selectedScenario.map((video, i) => {
								return (
									<Form.Item name={video}>
										<Input
											placeholder={`Recommended length for ${video} in seconds`}
										/>
									</Form.Item>
								);
							})
						}
					</Form.List>
				</Form>
			</Modal>
		</>
	) : (
		<Loader />
	);
};

export default SuperUserDashboard;

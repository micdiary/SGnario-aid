import React, { useEffect, useState } from "react";
import {
	Button,
	Modal,
	Form,
	Input,
	Select,
	Table,
	Tag,
	Cascader,
	Spin,
	Space,
	Typography,
	Popconfirm,
	InputNumber,
} from "antd";
import {
	getPatientsByTherapist,
	getPatientsTasks,
	getPatientsWithoutTherapist,
	removePatient,
	setTherapist,
} from "../../../api/therapist";
import { createTasks, getTaskStatusCount } from "../../../api/task";
import { getScenarios } from "../../../api/scenarios";
import { showNotification } from "../../../components/Notification";
import { TAG } from "../../../constants";

const { Option } = Select;

const SuperUserDashboard = ({ profile, setView, setTask }) => {
	const [form] = Form.useForm();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [patientOptions, setPatientOptions] = useState([]);
	const [videoOptions, setVideoOptions] = useState([]);
	const [selectedScenario, setSelectedScenario] = useState([]);
	const [isFormValid, setIsFormValid] = useState(false);

	const values = Form.useWatch([], form);
	useEffect(() => {
		if (values !== undefined) {
			if (
				values.patient !== "" &&
				values.title !== "" &&
				values.recommendedLength !== "" &&
				values.patient !== undefined &&
				values.title !== undefined &&
				values.recommendedLength !== undefined
			) {
				if (
					Object.keys(values.recommendedLength).length ===
						values.videos.length &&
					Object.values(values.recommendedLength).every((val) => val !== null)
				) {
					setIsFormValid(true);
				} else {
					setIsFormValid(false);
				}
			} else {
				setIsFormValid(false);
			}
		} else {
			setIsFormValid(false);
		}
	}, [values]);

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
			showNotification(error.message, "error");
		}
	};

	useEffect(() => {
		if (profile.email) {
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
			for (let i = 0; i < videos.length; i++) {
				if (videos[i].videoName === key) {
					recommendedLength.push({
						videoName: key,
						length: value,
					});
				}
			}
		});

		const req = {
			title: values.title,
			name: patientOptions.find((patient) => patient.email === values.patient)
				.name,
			email: values.patient,
			videos: videos,
			recommendedLength: recommendedLength,
		};

		createTasks(req)
			.then((res) => {
				showNotification(res.message);
				fetchPatientTasks();
				form.resetFields();
				setSelectedScenario([]);
				setIsModalVisible(false);
			})
			.catch((err) => {
				showNotification(err.message, "error");
			})
			.finally(() => {
				setConfirmLoading(false);
			});
	};

	const videosOnChange = (value) => {
		console.log("onchange");

		let temp = [];
		for (let i = 0; i < value.length; i++) {
			temp.push(value[i][2]);
		}
		setSelectedScenario(temp);

		// Update recommendedLength to match the selected videos
		const updatedRecommendedLength = form.getFieldValue("recommendedLength");
		if (!updatedRecommendedLength) return;
		Object.keys(updatedRecommendedLength).forEach((key) => {
			if (!temp.includes(key)) {
				delete updatedRecommendedLength[key];
			}
		});
		form.setFieldsValue({
			recommendedLength: updatedRecommendedLength,
		});
	};

	const formItem = [
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
		{
			title: "Action",
			key: "action",
			render: (text, record) => (
				<Space size="middle">
					<Popconfirm
						title={`Sure to ${record.name}?`}
						onConfirm={() => {
							removePatient(record._id)
								.then((res) => {
									showNotification(res.message);
									fetchPatientTasks();
									populateAddPatientOption();
								})
								.catch((err) => {
									showNotification(err.message, "error");
								});
						}}
					>
						<Typography.Link onClick={() => {}}>Remove</Typography.Link>
					</Popconfirm>
				</Space>
			),
		},
	];

	const renderIssues = (issues) => {
		return issues.map((issue, index) => {
			return <Tag key={index}> {issue}</Tag>;
		});
	};

	// Add Patient Modal
	const [patientForm] = Form.useForm();
	const [isPatientModalVisible, setIsPatientModalVisible] = useState(false);
	const [isPatientFormValid, setIsPatientFormValid] = useState(false);
	const [addPatientOptions, setAddPatientOptions] = useState([]);
	const patientFormValues = Form.useWatch([], patientForm);

	useEffect(() => {
		populateAddPatientOption();
	}, []);

	useEffect(() => {
		if (patientFormValues !== undefined) {
			if (patientFormValues.userIds !== undefined) {
				if (patientFormValues.userIds.length > 0) {
					setIsPatientFormValid(true);
				} else {
					setIsPatientFormValid(false);
				}
			} else {
				setIsPatientFormValid(false);
			}
		} else {
			setIsPatientFormValid(false);
		}
	}, [patientFormValues]);

	const addPatientForm = [
		{
			label: "Patient Name",
			name: "userIds",
			rules: [
				{
					required: true,
					message: "Please select a patient to add!",
				},
			],
			input: (
				<Select
					mode="multiple"
					options={addPatientOptions.map((patient) => {
						return {
							value: patient.id,
							label: `${patient.name} [${patient.email}]`,
						};
					})}
				/>
			),
		},
	];

	const populateAddPatientOption = () => {
		getPatientsWithoutTherapist().then((res) => {
			setAddPatientOptions(res.patientArray);
		});
	};

	const onPatientFormOk = () => {
		setIsPatientModalVisible(false);
		patientForm.submit();
	};

	const onPatientFormFinish = (values) => {
		setConfirmLoading(true);
		setTherapist(values)
			.then((res) => {
				showNotification(res.message);
				fetchPatientTasks();
			})
			.catch((err) => {
				showNotification(err.message, "error");
			})
			.finally(() => {
				setConfirmLoading(false);
				patientForm.resetFields();
				populateAddPatientOption();
			});
	};

	return (
		<Spin spinning={videoOptions.length === 0 || confirmLoading}>
			<Button
				type="primary"
				onClick={showModal}
				style={{
					marginBottom: 16,
					marginRight: 8,
				}}
			>
				Assign Task
			</Button>
			<Button
				type="primary"
				onClick={() => {
					setIsPatientModalVisible(true);
				}}
			>
				Add Patient to Watch
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
								render: (date) => new Date(date).toLocaleDateString("en-SG"),
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
								render: (tag) => (
									<>
										<Tag color={TAG[tag]} key={tag}>
											{tag.toUpperCase()}
										</Tag>
									</>
								),
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
				okButtonProps={{ disabled: !isFormValid }}
				confirmLoading={confirmLoading}
				onCancel={handleCancel}
				videosOnChange
			>
				<Form form={form} onFinish={onFormFinish} layout="vertical">
					{modalForm(formItem)}
					<Form.Item
						rules={[
							{
								required: true,
								message: "Please input for all duration!",
							},
						]}
						label="Recommended Duration (in seconds)"
						hidden={selectedScenario.length <= 0}
					>
						<Form.List name="recommendedLength">
							{() =>
								selectedScenario &&
								selectedScenario.map((video, i) => {
									return (
										<Form.Item
											key={i}
											name={video}
											rules={[
												{
													required: true,
													message: `Please input duration for ${video}!`,
												},
											]}
										>
											<InputNumber
												style={{ width: "100%" }}
												placeholder={`${video}`}
											/>
										</Form.Item>
									);
								})
							}
						</Form.List>
					</Form.Item>
				</Form>
			</Modal>
			<Modal
				destroyOnClose
				title={"Add Patient to Watch"}
				open={isPatientModalVisible}
				onOk={onPatientFormOk}
				confirmLoading={confirmLoading}
				okButtonProps={{ disabled: !isPatientFormValid }}
				onCancel={() => {
					setIsPatientModalVisible(false);
				}}
			>
				<Form form={patientForm} onFinish={onPatientFormFinish}>
					{modalForm(addPatientForm)}
				</Form>
			</Modal>
		</Spin>
	);
};

export default SuperUserDashboard;

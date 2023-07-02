import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, Select, Table } from "antd";
import {
	getPatientsByTherapist,
	getPatientsTasks,
} from "../../../api/therapist";
import { createTasks } from "../../../api/task";
import { getScenarios } from "../../../api/scenarios";

const { Option } = Select;

const SuperUserDashboard = ({ profile, setView, setTask }) => {
	const [form] = Form.useForm();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [patientOptions, setPatientOptions] = useState([]);
	const [scenarioOptions, setScenarioOptions] = useState([]);
	const [selectedScenario, setSelectedScenario] = useState({});
	const [tasks, setTasks] = useState([]);

	const fetchPatientTasks = async () => {
		try {
			const patients = await getPatientsByTherapist();
			setPatientOptions(patients.users || []);

			let tempTasks = [];

			for (let i = 0; i < patients.users.length; i++) {
				const patientTasks = await getPatientsTasks(patients.users[i]._id);
				for (let j = 0; j < patientTasks.length; j++) {
					tempTasks.push(patientTasks[j]);
				}
			}

			setTasks(tempTasks);
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
				setScenarioOptions(res || []);
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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

		let temp = [];
		Object.values(values.recommendedLength).forEach((key) => {
			temp.push(key);
		});

		const req = {
			email: values.patient,
			scenario: values.scenario,
			dateAssigned: new Date(),
			recommendedLength: temp,
		};

		createTasks(req).then((res) => {
			alert(res.message || res.error);
		});
		setConfirmLoading(false);
		setIsModalVisible(false);
	};

	const scenarioOnChange = (value) => {
		scenarioOptions.forEach((scenario) => {
			if (scenario.scenario === value) {
				setSelectedScenario(scenario);
			}
		});
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
			label: "Scenario",
			name: "scenario",
			rules: [
				{
					required: true,
					message: "Please input your scenario!",
				},
			],
			input: (
				<Select placeholder="Select a scenario" onChange={scenarioOnChange}>
					{scenarioOptions.length > 0 &&
						scenarioOptions.map((scenario) => {
							return (
								<Option key={scenario.scenario} value={scenario.scenario}>
									({scenario.category}) {scenario.scenario}
								</Option>
							);
						})}
				</Select>
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
			title: "Patient",
			dataIndex: "patient",
			key: "patient",
		},
		{
			title: "Scenario",
			dataIndex: "scenario",
			key: "scenario",
		},
		{
			title: "Date Assigned",
			dataIndex: "dateAssigned",
			key: "dateAssigned",
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
						setTask(record);
					}}
				>
					Grade Task
				</Button>
			),
		},
	];

	return (
		<>
			<Button type="primary" onClick={showModal}>
				Assign Task
			</Button>
			<Table columns={columns} dataSource={tasks} rowKey="_id" />
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
							selectedScenario.videos &&
							selectedScenario.videos.map((video, i) => {
								return (
									<Form.Item name={"recommendedLength" + i}>
										<Input
											placeholder={`Recommended length for ${video.videoName} in seconds`}
										/>
									</Form.Item>
								);
							})
						}
					</Form.List>
				</Form>
			</Modal>
		</>
	);
};

export default SuperUserDashboard;

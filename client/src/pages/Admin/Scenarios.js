import React, { useState, useEffect } from "react";
import {
	Table,
	Button,
	Modal,
	Form,
	Input,
	Select,
	Space,
	Popconfirm,
	Typography,
} from "antd";
import { MinusCircleOutlined } from "@ant-design/icons";
import {
	getScenarios,
	deleteScenario,
	updateScenario,
} from "../../api/scenarios";
import AddScenariosModal from "./AddScenariosModal";
import { showNotification } from "../../components/Notification";

const Scenarios = () => {
	const [addScenarioModalVisible, setAddScenarioModalVisible] = useState(false);
	const [data, setData] = useState([]);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [editScenario, setEditScenario] = useState({});
	const [editOpen, setEditOpen] = useState(false);

	const showEditModal = (scenario) => {
		setEditScenario(scenario);
		setEditOpen(true);
	};

	const handleEditOk = () => {
		setConfirmLoading(true);
		editForm.submit();
	};

	const handleEditCancel = () => {
		setEditOpen(false);
	};

	const [editForm] = Form.useForm();

	const getScenariosData = async () => {
		getScenarios().then((res) => {
			setData(res);
		});
	};

	useEffect(() => {
		getScenariosData();
	}, []);

	useEffect(() => {
		if (editScenario) {
			editForm.setFieldsValue({
				category: editScenario.category,
				scenario: editScenario.scenario,
				videos: editScenario.videos,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editScenario]);

	const showModal = () => {
		setAddScenarioModalVisible(true);
	};

	const onEditFormFinish = async (values) => {
		const { videos } = values;

		// Update the scenario
		editScenario.videos = videos;

		// Perform API call to update the scenario
		updateScenario(editScenario._id, editScenario)
			.then(() => {
				showNotification("Scenario updated successfully!");
			})
			.catch((err) => {
				showNotification(err, "error");
			})
			.finally(() => {
				editForm.resetFields();
				setConfirmLoading(false);
				setEditOpen(false);
			});
	};

	const expandedRowRender = (record) => {
		const columns = [
			{
				title: "Video Name",
				dataIndex: "videoName",
				key: "videoName",
			},
			{
				title: "Video ID",
				dataIndex: "videoId",
				key: "videoId",
			},
		];
		return (
			<Table
				columns={columns}
				dataSource={record.videos}
				pagination={false}
				rowKey={"_id"}
			/>
		);
	};

	const formItem = [
		{
			label: "Category",
			name: "category",
			rules: [
				{
					required: true,
					message: "Please input your category!",
				},
			],
			input: <Select disabled placeholder={editScenario.category} />,
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
			input: <Select disabled placeholder={editScenario.scenario} />,
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

	const handleDelete = (scenarioId) => {
		deleteScenario(scenarioId)
			.then(() => {
				showNotification("Scenario deleted successfully");
				getScenarios().then((res) => {
					setData(res);
				});
			})
			.catch((error) => {
				console.error(error);
				showNotification("Failed to delete scenario", "error");
			});
	};

	const columns = [
		{
			title: "Category",
			dataIndex: "category",
			key: "category",
			sorter: (a, b) => a.category.localeCompare(b.category),
			sortDirections: ["ascend"],
			defaultSortOrder: "ascend",
		},
		{
			title: "Scenario",
			dataIndex: "scenario",
			key: "scenario",
		},
		{
			title: "Date Added",
			dataIndex: "dateAdded",
			key: "dateAdded",
			render: (date) => new Date(date).toLocaleDateString("en-SG"),
		},
		{
			title: "Action",
			key: "action",
			render: (value, record) => (
				<Space size="middle">
					<Typography.Link onClick={() => showEditModal(record)}>
						Edit
					</Typography.Link>
					<Popconfirm
						title="Sure to delete?"
						onConfirm={() => handleDelete(record._id)}
					>
						<Typography.Link>Delete</Typography.Link>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<>
			<Button type="primary" style={{ marginBottom: 16 }} onClick={showModal}>
				Add Scenario
			</Button>
			<Table
				columns={columns}
				dataSource={data}
				rowKey="_id"
				expandable={{
					expandedRowRender,
				}}
			/>
			<AddScenariosModal
				data={data}
				getData={getScenariosData}
				addScenarioModalVisible={addScenarioModalVisible}
				setAddScenarioModalVisible={setAddScenarioModalVisible}
			/>
			<Modal
				forceRender
				destroyOnClose
				title="Edit Scenario"
				open={editOpen}
				onOk={handleEditOk}
				confirmLoading={confirmLoading}
				onCancel={handleEditCancel}
			>
				<Form
					form={editForm}
					onFinish={onEditFormFinish}
					initialValues={editScenario}
				>
					{modalForm(formItem)}
					<Form.List name="videos">
						{(fields, { add, remove }) => (
							<>
								{fields.map((field) => (
									<Space
										key={field.key}
										style={{ display: "flex", marginBottom: 8 }}
										align="baseline"
									>
										<Form.Item
											{...field}
											key={`videoName${field.key}`}
											name={[field.name, "videoName"]}
											rules={[
												{ required: true, message: "Missing video name" },
											]}
										>
											<Input placeholder="Video Name" />
										</Form.Item>
										<Form.Item
											{...field}
											key={`videoId${field.key}`}
											name={[field.name, "videoId"]}
											rules={[{ required: true, message: "Missing video ID" }]}
										>
											<Input placeholder="Video ID" />
										</Form.Item>
										<MinusCircleOutlined onClick={() => remove(field.name)} />
									</Space>
								))}
							</>
						)}
					</Form.List>
				</Form>
			</Modal>
		</>
	);
};

export default Scenarios;

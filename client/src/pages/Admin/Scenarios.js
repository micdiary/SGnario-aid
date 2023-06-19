import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select } from "antd";
import {
	checkDuplicateVideoId,
	createScenario,
	getScenarios,
} from "../../api/scenarios";

const { Option } = Select;

const Scenarios = () => {
	const [open, setOpen] = useState(false);
	const [data, setData] = useState([]);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [form] = Form.useForm();

	useEffect(() => {
		getScenarios().then((res) => {
			setData(res);
		});
	}, []);

	const showModal = () => {
		setOpen(true);
	};

	const handleOk = () => {
		setConfirmLoading(true);
		form.submit();
	};

	const handleCancel = () => {
		setOpen(false);
	};

	const onFormFinish = (values) => {
		checkDuplicateVideoId(values.videoId).then((isDuplicate) => {
			if (isDuplicate) {
				alert("Video ID already exists");
				return;
			} else {
				const req = {
					...values,
					dateAdded: new Date(),
				};
				createScenario(req).then((res) => {
					setData([...data, res]);
					alert("Scenario created successfully");
				});
			}
		});
		form.resetFields();
		setConfirmLoading(false);
		setOpen(false);
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
			input: (
				<Select placeholder="Select a category">
					<Option value="category1">Category 1</Option>
					<Option value="category2">Category 2</Option>
					<Option value="category3">Category 3</Option>
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
				<Select placeholder="Select a scenario">
					<Option value="scenario1">Scenario 1</Option>
					<Option value="scenario2">Scenario 2</Option>
					<Option value="scenario3">Scenario 3</Option>
				</Select>
			),
		},
		{
			label: "Video ID",
			name: "videoId",
			rules: [
				{
					required: true,
					message: "Please input your video ID!",
				},
			],
			input: <Input />,
		},
		{
			label: "Video Name",
			name: "videoName",
			rules: [
				{
					required: true,
					message: "Please input your video name!",
				},
			],
			input: <Input />,
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
			title: "Category",
			dataIndex: "category",
			key: "category",
		},
		{
			title: "Scenario",
			dataIndex: "scenario",
			key: "scenario",
		},
		{
			title: "Video ID",
			dataIndex: "videoId",
			key: "videoId",
		},
		{
			title: "Video Name",
			dataIndex: "videoName",
			key: "videoName",
		},
		{
			title: "Date Added",
			dataIndex: "dateAdded",
			key: "dateAdded",
		},
	];

	return (
		<>
			<Button type="primary" style={{ marginBottom: 16 }} onClick={showModal}>
				Add Scenario
			</Button>
			<Table columns={columns} dataSource={data} />
			<Modal
				title="Add Scenario"
				open={open}
				onOk={handleOk}
				confirmLoading={confirmLoading}
				onCancel={handleCancel}
			>
				<Form form={form} onFinish={onFormFinish}>
					{modalForm(formItem)}
				</Form>
			</Modal>
		</>
	);
};

export default Scenarios;

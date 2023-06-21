import React, { useState, useEffect, useRef } from "react";
import {
	Table,
	Button,
	Modal,
	Form,
	Input,
	Select,
	Divider,
	Space,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
	checkDuplicateVideo,
	createScenario,
	getScenarios,
} from "../../api/scenarios";

const { Option } = Select;

const Scenarios = () => {
	const [open, setOpen] = useState(false);
	const [data, setData] = useState([]);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [categoryOptions, setCategoryOptions] = useState([]);
	const [scenarioOptions, setScenarioOptions] = useState([]);
	const [form] = Form.useForm();

	useEffect(() => {
		getScenarios().then((res) => {
			setData(res);
			for (const scenario of res) {
				if (!categoryOptions.includes(scenario.category)) {
					setCategoryOptions([...categoryOptions, scenario.category]);
				}
				if (!scenarioOptions.includes(scenario.scenario)) {
					setScenarioOptions([...scenarioOptions, scenario.scenario]);
				}
			}
		});
	}, [categoryOptions, scenarioOptions]);

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

	// Adding New Scenario
	const onFormFinish = (values) => {
	  checkDuplicateVideo(values.videoId, values.videoName)
	    .then((isDuplicate) => {
	      if (isDuplicate) {
	        alert("Video already exists");
	        return;
	      } else {
	        const req = {
	          ...values,
	          dateAdded: new Date(),
	        };
	        createScenario(req)
	          .then((res) => {
	            setData([...data, res]);
	            alert("Scenario created successfully");
	          })
	          .catch((error) => {
	            console.error(error);
	            alert("Failed to create scenario");
	          });
	      }
	    })
	    .catch((error) => {
	      console.error(error);
	      alert("Failed to check duplicate video");
	    });

	  form.resetFields();
	  setConfirmLoading(false);
	  setOpen(false);
	};

	const [name, setName] = useState("");
	const inputRef = useRef(null);
	const onNameChange = (event) => {
		setName(event.target.value);
	};

	const addCategoryOption = (e) => {
		e.preventDefault();
		setCategoryOptions([...categoryOptions, name || `New item`]);
		setName("");
		setTimeout(() => {
			inputRef.current?.focus();
		}, 0);
	};

	const addScenarioOption = (e) => {
		e.preventDefault();
		setScenarioOptions([...scenarioOptions, name || `New item`]);
		setName("");
		setTimeout(() => {
			inputRef.current?.focus();
		}, 0);
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
				<Select
					placeholder="Select a category"
					dropdownRender={(menu) => (
						<>
							{menu}
							<Divider
								style={{
									margin: "8px 0",
								}}
							/>
							<Space
								style={{
									padding: "0 8px 4px",
								}}
							>
								<Input
									placeholder="Please enter item"
									ref={inputRef}
									value={name}
									onChange={onNameChange}
								/>
								<Button
									type="text"
									icon={<PlusOutlined />}
									onClick={addCategoryOption}
								>
									Add Category
								</Button>
							</Space>
						</>
					)}
				>
					{categoryOptions.map((item, index) => {
						return (
							<Option value={item} key={index}>
								{item}
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
				<Select
					placeholder="Select a scenario"
					dropdownRender={(menu) => (
						<>
							{menu}
							<Divider
								style={{
									margin: "8px 0",
								}}
							/>
							<Space
								style={{
									padding: "0 8px 4px",
								}}
							>
								<Input
									placeholder="Please enter item"
									ref={inputRef}
									value={name}
									onChange={onNameChange}
								/>
								<Button
									type="text"
									icon={<PlusOutlined />}
									onClick={addScenarioOption}
								>
									Add Scenario
								</Button>
							</Space>
						</>
					)}
				>
					{scenarioOptions.map((item, index) => {
						return (
							<Option value={item} key={index}>
								{item}
							</Option>
						);
					})}
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

import React, { useState, useRef, useEffect } from "react";

import {
	Button,
	Modal,
	Form,
	Input,
	Select,
	Divider,
	Space,
	Tour,
	Typography,
	Row,
} from "antd";
import {
	PlusOutlined,
	MinusCircleOutlined,
	QuestionCircleOutlined,
} from "@ant-design/icons";
import {
	checkDuplicateVideo,
	getScenarios,
	createScenario,
} from "../../api/scenarios";
import { showNotification } from "../../components/Notification";
import adminTour from "../../assets/adminTour.jpg";

const { Option } = Select;

const AddScenariosModal = ({
	data,
	getData,
	addScenarioModalVisible,
	setAddScenarioModalVisible,
}) => {
	const [categoryOptions, setCategoryOptions] = useState([]);
	const [categorySelected, setCategorySelected] = useState(null);
	const [scenarioOptions, setScenarioOptions] = useState([]);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [form] = Form.useForm();

	const [name, setName] = useState("");
	const inputRef = useRef(null);
	const onNameChange = (event) => {
		setName(event.target.value);
	};

	useEffect(() => {
		getScenarios().then((res) => {
			for (const scenario of res) {
				if (!categoryOptions.includes(scenario.category)) {
					setCategoryOptions([...categoryOptions, scenario.category]);
				}
			}
		});
	}, [categoryOptions]);

	useEffect(() => {
		let temp = [];
		for (const scenario of data) {
			if (scenario.category === categorySelected) {
				temp.push(scenario.scenario);
			}
		}
		setScenarioOptions(temp);
		form.setFieldValue("scenario", "");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, categorySelected]);

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

	const handleOk = () => {
		setConfirmLoading(true);
		form.submit();
	};

	const handleCancel = () => {
		setAddScenarioModalVisible(false);
	};

	// Adding New Scenario
	const onFormFinish = (values) => {
		for (let i = 0; i < values.videos.length; i++) {
			checkDuplicateVideo(values.videos[i].videoId, values.videos[i].videoName)
				.then((isDuplicate) => {
					if (isDuplicate) {
						showNotification("Video already exists", "error");
						return;
					} else if (i === values.videos.length - 1) {
						const req = {
							...values,
							dateAdded: new Date(),
						};
						createScenario(req)
							.then((res) => {
								setCategoryOptions([]);
								getData();
								showNotification("Scenario created successfully");
							})
							.catch((error) => {
								console.error(error);
								showNotification("Failed to create scenario", "error");
							});
					}
				})
				.catch((error) => {
					console.error(error);
					showNotification("Failed to check duplicate video", "error");
				});
		}
		form.resetFields();
		setConfirmLoading(false);
		setAddScenarioModalVisible(false);
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
					onChange={(value) => {
						setCategorySelected(value);
					}}
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
					className="select-scenario-input"
					disabled={!categorySelected}
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

	//tour
	const [tourVisible, setTourVisible] = useState(false);

	const tourSteps = [
		{
			title: "Step 1",
			description:
				"Select a category from the dropdown menu or create a new category.",
			placement: "top",
		},
		{
			title: "Step 2",
			description:
				"Select a scenario from the dropdown menu or create a new scenario.",

			placement: "top",
		},
		{
			title: "Step 3",
			description:
				"Add videos to the scenario by clicking the 'Add Video' button.",
			placement: "top",
		},
		{
			title: "Step 4",
			description:
				"To get the video ID, go to the video on YouTube and copy the ID from the URL. From the screenshot, the video ID will be n_DZo_DFN2Q",
			cover: <img alt="tour.png" src={adminTour} />,
			placement: "top",
		},
	];

	return (
		<>
			<Modal
				forceRender
				destroyOnClose
				title={
					<Row justify={"space-between"}>
						<Typography>Add Scenario</Typography>
						<Typography.Text
							strong
							onClick={() => setTourVisible(true)}
							style={{
								marginRight: 24,
								cursor: "pointer",
							}}
						>
							Need help? <QuestionCircleOutlined />
						</Typography.Text>
					</Row>
				}
				open={addScenarioModalVisible}
				onOk={handleOk}
				confirmLoading={confirmLoading}
				onCancel={handleCancel}
			>
				<Tour
					open={tourVisible}
					onClose={() => setTourVisible(false)}
					steps={tourSteps}
				/>
				<Form form={form} onFinish={onFormFinish}>
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
								<Form.Item>
									<Button
										type="dashed"
										onClick={() => add()}
										style={{
											width: "100%",
										}}
										icon={<PlusOutlined />}
									>
										Add Video
									</Button>
								</Form.Item>
							</>
						)}
					</Form.List>
				</Form>
			</Modal>
		</>
	);
};

export default AddScenariosModal;

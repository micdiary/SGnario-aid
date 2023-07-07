import React, { useEffect, useState } from "react";
import {
	Button,
	Typography,
	Form,
	Upload,
	Modal,
	Input,
	Slider,
	Select,
	Divider,
	Steps,
	Space,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { updateTask } from "../api/task";
import { populateTaskData } from "../utils/task";
import { stutterMarks, fluencyMarks } from "../constants";

const NewTaskSubmissionModal = ({
	recordingModalVisible,
	setRecordingModalVisible,
	task,
	setPopulateData,
	setLoading,
}) => {
	const [addRecordingForm] = Form.useForm();

	// form validation
	const values = Form.useWatch([], addRecordingForm);
	const [isFormValid, setIsFormValid] = useState(false);
	useEffect(() => {
		if (values !== undefined) {
			if (
				values.patientStutter !== undefined &&
				values.patientFluency !== undefined &&
				values.patientRemark !== undefined &&
				values.recordingLink !== undefined
			) {
				setIsFormValid(true);
			} else {
				setIsFormValid(false);
			}
		} else {
			setIsFormValid(false);
		}
	}, [values]);

	const onFinish = (values) => {
		const req = {
			taskId: task._id,
			videoName: values.videoName,
			stutter: values.patientStutter,
			fluency: values.patientFluency,
			remark: values.patientRemark,
			file: values.recordingLink.file,
		};

		updateTask(req).then((res) => {
			alert(res.message || res.errror);
			setPopulateData(populateTaskData(res.task));
			setLoading(false);
		});
	};

	const onModalOk = () => {
		addRecordingForm.submit();
		setLoading(true);
		setRecordingModalVisible(false);
	};

	const generateModal = () => {
		const customRequest = ({ file, onSuccess }) => {
			setTimeout(() => {
				onSuccess("ok");
			}, 0);
		};

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
							return {
								label: video.videoName,
								value: video.videoName,
							};
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
				input: (
					<Slider
						style={{ width: "70%" }}
						tooltip={{
							visible: true,
							formatter: (value) => stutterMarks[value],
						}}
						defaultValue={0}
						min={0}
						max={8}
					/>
				),
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
				input: (
					<Slider
						style={{ width: "70%" }}
						tooltip={{
							visible: true,
							formatter: (value) => fluencyMarks[value],
						}}
						defaultValue={0}
						min={0}
						max={8}
					/>
				),
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
				input: <Input.TextArea rows={3} />,
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
					<Upload customRequest={customRequest}>
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
		<Modal
			destroyOnClose
			title="Add a new recording"
			open={recordingModalVisible}
			onOk={onModalOk}
			okButtonProps={{ disabled: !isFormValid }}
			onCancel={() => {
				setRecordingModalVisible(false);
				addRecordingForm.resetFields();
			}}
		>
			<Form form={addRecordingForm} onFinish={onFinish}>
				{generateModal()}
				<Divider />
				<Typography.Title level={5}>Scale</Typography.Title>
				<Steps
					className="task-modal-steps"
					style={{
						marginTop: 8,
					}}
					type="inline"
					current={-1}
					items={Object.values(fluencyMarks).map((item, index) => {
						return {
							title: `LV${index}`,
							description: (
								<Space direction={"vertical"}>
									<span>Stutter: {stutterMarks[index]}</span>
									<span>Fluency: {item}</span>
								</Space>
							),
						};
					})}
				/>
			</Form>
		</Modal>
	);
};

export default NewTaskSubmissionModal;

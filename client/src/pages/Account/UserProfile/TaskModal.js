import React, { useEffect, useState } from "react";
import {
	Form,
	Modal,
	Input,
	Upload,
	Button,
	Slider,
	Steps,
	Typography,
	Divider,
	Space,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { updateTask } from "../../../api/task";
import { populateTaskData } from "../../../utils/task";
import { stutterMarks, fluencyMarks } from "../../../constants";
import { showNotification } from "../../../components/Notification";

const UserTaskModal = ({
	modalVisible,
	setModalVisible,
	modalData,
	setPopulateData,
}) => {
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [form] = Form.useForm();
	const [isFormValid, setIsFormValid] = useState(false);
	const values = Form.useWatch([], form);

	useEffect(() => {
		if (values !== undefined) {
			if (
				values.patientStutter !== "" &&
				values.patientFluency !== "" &&
				values.patientRemark !== "" &&
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

	useEffect(() => {
		form.setFieldsValue({
			patientStutter: modalData.patientStutter,
			patientFluency: modalData.patientFluency,
			patientRemark: modalData.patientRemark,
			recordingLink: modalData.recordingLink,
		});
	}, [modalData, form]);

	const onFormFinish = (values) => {
		const req = {
			taskId: modalData.taskId,
			submissionId: modalData.submissionId,
			videoName: modalData.videoName,
			stutter: values.patientStutter,
			fluency: values.patientFluency,
			remark: values.patientRemark,
			file: values.recordingLink.file,
		};

		setConfirmLoading(true);
		updateTask(req)
			.then((res) => {
				showNotification(res.message);
				setPopulateData(populateTaskData(res.task));
			})
			.catch((err) => {
				showNotification(err.message, "error");
			})
			.finally(() => {
				setConfirmLoading(false);
				setModalVisible(false);
			});
	};

	const customRequest = ({ file, onSuccess }) => {
		setTimeout(() => {
			onSuccess("ok");
		}, 0);
	};

	const handleOk = () => {
		form.submit();
	};

	const handleCancel = () => {
		setModalVisible(false);
	};

	const formItem = [
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
					message: "Please input your fscore!",
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
			input: (
				<Upload
					maxCount={1}
					customRequest={customRequest}
					disabled={modalData.recordingLink}
				>
					<Button icon={<UploadOutlined />} disabled={modalData.recordingLink}>
						Upload
					</Button>
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

	return (
		<Modal
			destroyOnClose
			open={modalVisible}
			onOk={handleOk}
			okButtonProps={{ disabled: !isFormValid }}
			confirmLoading={confirmLoading}
			onCancel={handleCancel}
			title={modalData.videoName}
		>
			<Form
				form={form}
				name="validateOnly"
				onFinish={onFormFinish}
				layout="vertical"
			>
				{modalForm(formItem)}
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

export default UserTaskModal;

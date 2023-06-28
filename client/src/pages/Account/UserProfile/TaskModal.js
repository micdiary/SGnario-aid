import React, { useEffect, useState } from "react";
import { Form, Modal, InputNumber, Input, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { updateTask } from "../../../api/task";
import { populateTaskData } from "../../../utils/task";

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
				values.patientRemark !== ""
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
		};

		setConfirmLoading(true);
		updateTask(req).then((res) => {
			alert(res.message || res.errror);
			setPopulateData(populateTaskData(res.task));
			setConfirmLoading(false);
		});
	};

	const handleOk = () => {
		form.submit();
		setModalVisible(false);
	};

	const handleCancel = () => {
		setModalVisible(false);
	};

	const onFileUpload = ({ file, fileList }) => {
		console.log(file);
		console.log(fileList);
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
			input: <InputNumber />,
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
			input: <InputNumber />,
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
			input: <Input />,
		},
		{
			label: "Recording Link",
			name: "recordingLink",
			// rules: [
			// 	{
			// 		required: true,
			// 		message: "Please input your recording link!",
			// 	},
			// ],
			input: (
				<Upload onChange={onFileUpload}>
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

	return (
		<Form form={form} name="validateOnly" onFinish={onFormFinish}>
			<Modal
				open={modalVisible}
				onOk={handleOk}
				okButtonProps={{ disabled: !isFormValid }}
				confirmLoading={confirmLoading}
				onCancel={handleCancel}
				title={modalData.videoName}
			>
				{modalForm(formItem)}
			</Modal>
		</Form>
	);
};

export default UserTaskModal;

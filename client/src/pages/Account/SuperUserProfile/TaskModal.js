import React, { useEffect, useState } from "react";
import { Form, Modal, InputNumber, Input, Slider } from "antd";
import { updatePatientTasks } from "../../../api/therapist";
import { populateTaskData } from "../../../utils/task";
import { stutterMarks, fluencyMarks } from "../../../constants";

const SuperUserTaskModal = ({
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
				values.therapistStutter !== "" &&
				values.therapistFluency !== "" &&
				values.therapistRemark !== ""
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
			therapistStutter: modalData.therapistStutter,
			therapistFluency: modalData.therapistFluency,
			therapistRemark: modalData.therapistRemark,
		});
	}, [modalData, form]);

	const onFormFinish = (values) => {
		const req = {
			taskId: modalData.taskId,
			submissionId: modalData.submissionId,
			videoName: modalData.videoName,
			stutter: values.therapistStutter,
			fluency: values.therapistFluency,
			remark: values.therapistRemark,
		};
		console.log(req);
		setConfirmLoading(true);
		updatePatientTasks(req).then((res) => {
			alert(res.message || res.errror);
			setPopulateData(populateTaskData(res.task));
			setConfirmLoading(false);
			setModalVisible(false);
		});
	};

	const handleOk = () => {
		form.submit();
		setModalVisible(false);
	};

	const handleCancel = () => {
		setModalVisible(false);
	};

	const formItem = [
		{
			label: "Stutter",
			name: "therapistStutter",
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
			name: "therapistFluency",
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
			name: "therapistRemark",
			rules: [
				{
					required: true,
					message: "Please input your remark!",
				},
			],
			input: <Input.TextArea rows={3} />,
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

export default SuperUserTaskModal;

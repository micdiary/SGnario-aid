import React, { useEffect, useState } from "react";
import { Form, Modal, InputNumber, Input } from "antd";
import { updatePatientTasks } from "../../../api/therapist";

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
			let tempData = [];
			const task = res.task;
			for (let i = 0; i < task.videos.length; i++) {
				const video = task.videos[i];
				let temp = {
					key: i,
					taskId: task._id,
					submissionId: task.submissions[i]._id,
					videoName: video.videoName,
					videoId: video.videoId,
					patientStutter: video.patientStutter || "",
					patientFluency: video.patientFluency || "",
					patientRemark: video.patientRemark || "No Patient Remark",
					therapistStutter: task.submissions[i].therapistStutter || "",
					therapistFluency: task.submissions[i].therapistFluency || "",
					therapistRemark:
						task.submissions[i].therapistRemark || "No Therapist Remark",
					recording: video.recording || "",
				};
				tempData.push(temp);
			}
			setPopulateData(tempData);

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
			input: <InputNumber />,
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
			input: <InputNumber />,
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

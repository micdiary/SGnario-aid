import React, { useEffect } from "react";
import { Input, Button, Form, Typography, Divider } from "antd";
import { setStorageConfigurations } from "../../../api/profile";
import { generateForm } from "../../../utils/form";
import Loader from "../../../components/Loader";

const Storage = ({ profile, setProfile }) => {
	const [storageForm] = Form.useForm();

	useEffect(() => {
		storageForm.setFieldsValue({
			clientEmail: profile.clientEmail,
			privateKey: profile.privateKey,
			rootFolderId: profile.rootFolderId,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [profile]);

	const storageFormItem = [
		{
			label: "Client Email",
			name: "clientEmail",
			rules: [
				{
					required: true,
					message: "Please input your email!",
				},
			],
			input: <Input />,
		},
		{
			label: "Private Key",
			name: "privateKey",
			rules: [
				{
					required: true,
					message: "Please input your private key!",
				},
			],
			input: <Input />,
		},
		{
			label: "Root Folder Id",
			name: "rootFolderId",
			rules: [
				{
					required: true,
					message: "Please input your root folder id!",
				},
			],
			input: <Input />,
		},
	];

	const onStorageFinish = (values) => {
		const req = {
			clientEmail: values.clientEmail,
			privateKey: values.privateKey,
			rootFolderId: values.rootFolderId,
		};
		// Handle the form submission
		setStorageConfigurations(req).then((res) => {
			alert(res.message);
			setProfile(res.user);
		});
	};

	return profile.name ? (
		<Form
			form={storageForm}
			wrapperCol={{
				span: 12,
			}}
			layout="vertical"
			onFinish={onStorageFinish}
			scrollToFirstError
		>
			<Typography.Title level={4}>Storage configurations</Typography.Title>
			<Divider />
			{generateForm(storageFormItem)}
			<Button type={"primary"} onClick={() => storageForm.submit()}>
				Update configurations
			</Button>
		</Form>
	) : (
		<Loader />
	);
};

export default Storage;

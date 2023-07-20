import React, { useEffect } from "react";
import { Input, Button, Select, Form, Typography, Divider, Spin } from "antd";
import { editProfile } from "../../../api/profile";
import { generateForm } from "../../../utils/form";
import { showNotification } from "../../../components/Notification";

const { Option } = Select;

const SuperUserProfile = ({ profile, setProfile }) => {
	const [profileForm] = Form.useForm();

	useEffect(() => {
		profileForm.setFieldsValue({
			name: profile.name,
			email: profile.email,
			role: profile.role,
			purpose: profile.purpose,
			organisation: profile.organisation,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [profile.name]);

	const profileFormItem = [
		{
			label: "Name",
			name: "name",
			rules: [
				{
					required: true,
					message: "Please input your name!",
				},
			],
			input: <Input />,
		},
		{
			label: "Email",
			name: "email",
			input: <Input disabled />,
		},
		{
			label: "Role",
			name: "role",
			rules: [
				{
					required: true,
					message: "Please select a role!",
				},
			],
			input: (
				<Select placeholder="Select a role">
					<Option value="therapist">Therapist</Option>
					<Option value="educator">Educator</Option>
				</Select>
			),
		},
		{
			label: "Purpose",
			name: "purpose",
			rules: [
				{
					required: true,
					message: "Please select a purpose!",
				},
			],
			input: (
				<Select placeholder="Select a purpose" mode="multiple">
					<Option value="treatment">Treatment</Option>
					<Option value="education">Education</Option>
				</Select>
			),
		},
		{
			label: "Organisation",
			name: "organisation",
			rules: [
				{
					required: true,
					message: "Please input your organisation!",
				},
			],
			input: <Input />,
		},
	];

	const onProfileFinish = (values) => {
		const req = {
			name: values.name,
			dob: values.dob,
			gender: values.gender,
			issue: values.issue,
		};
		// Handle the form submission
		editProfile(req)
			.then((res) => {
				showNotification(res.message);
				setProfile(res.user);
			})
			.catch((err) => {
				showNotification(err.message, "error");
			});
	};

	return (
		<Spin spinning={!profile.name}>
			<Form
				form={profileForm}
				wrapperCol={{
					span: 6,
				}}
				layout="vertical"
				onFinish={onProfileFinish}
				scrollToFirstError
			>
				<Typography.Title level={4} style={{textTransform:"capitalize"}}>Welcome {profile.name}</Typography.Title>
				<Divider />
				{generateForm(profileFormItem)}
				<Button type={"primary"} onClick={() => profileForm.submit()}>
					Update profile
				</Button>
			</Form>
		</Spin>
	);
};

export default SuperUserProfile;

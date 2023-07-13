import React, { useEffect } from "react";
import dayjs from "dayjs";
import {
	Input,
	Button,
	DatePicker,
	Select,
	Form,
	Radio,
	Typography,
	Divider,
	Spin,
} from "antd";
import { editProfile } from "../../../api/profile";
import { generateForm } from "../../../utils/form";
import { showNotification } from "../../../components/Notification";

const Profile = ({ profile, setProfile }) => {
	const [profileForm] = Form.useForm();

	useEffect(() => {
		profileForm.setFieldsValue({
			name: profile.name,
			email: profile.email,
			dob: dayjs(profile.dob),
			gender: profile.gender,
			therapist: profile.therapistName
				? `${profile.therapistName} [${profile.therapistEmail}]`
				: "No therapist assigned",
			issue: profile.issue,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [profile.dob]);

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
			label: "Date Of Birth",
			name: "dob",
			rules: [
				{
					required: true,
					message: "Please input your date of birth!",
				},
			],
			input: <DatePicker />,
		},
		{
			label: "Gender",
			name: "gender",
			rules: [
				{
					required: true,
					message: "Please select your gender!",
				},
			],
			input: (
				<Radio.Group>
					<Radio value="male">Male</Radio>
					<Radio value="female">Female</Radio>
				</Radio.Group>
			),
		},
		{
			label: "Therapist",
			name: "therapist",
			input: <Input disabled />,
		},
		{
			label: "Issue",
			name: "issue",
			rules: [
				{
					required: true,
					message: "Please input your reason of use!",
				},
			],
			input: (
				<Select
					mode="tags"
					options={[
						{ value: "Stuttering", label: "Stuttering" },
						{ value: "Voice Disorder", label: "Voice Disorder" },
						{ value: "Stroke Recovery", label: "Stroke Recovery" },
					]}
				/>
			),
		},
	];

	const onProfileFinish = (values) => {
		const req = {
			name: values.name,
			dob: values.dob,
			gender: values.gender,
			issue: values.issue,
			therapistName: profile.therapistName,
			therapistEmail: profile.therapistEmail,
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
					span: 12,
				}}
				layout="vertical"
				onFinish={onProfileFinish}
				scrollToFirstError
			>
				<Typography.Title level={4}>{profile.name}'s Profile</Typography.Title>
				<Divider />
				{generateForm(profileFormItem)}
				<Button type={"primary"} onClick={() => profileForm.submit()}>
					Update profile
				</Button>
			</Form>
		</Spin>
	);
};

export default Profile;

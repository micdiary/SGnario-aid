import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
	Card,
	Input,
	Button,
	DatePicker,
	Select,
	Form,
	Radio,
	Row,
	Col,
	Typography,
} from "antd";
import { editProfile } from "../../../api/profile";
import Loader from "../../../components/Loader";
import { resetPassword } from "../../../api/account";

const { Title } = Typography;

const Profile = ({ profile }) => {
	const [profileForm] = Form.useForm();
	const [passwordForm] = Form.useForm();
	const [isProfileDisabled, setIsProfileDisabled] = useState(true);
	const [isPasswordDisabled, setIsPasswordDisabled] = useState(true);

	// parameters check for profileForm
	const [isProfileFormValid, setIsProfileFormValid] = useState(false);
	const profileValues = Form.useWatch([], profileForm);
	useEffect(() => {
		if (profileValues !== undefined && profileValues.issue !== undefined) {
			if (
				profileValues.name !== "" &&
				profileValues.dob !== null &&
				profileValues.gender !== "" &&
				profileValues.issue.length > 0
			) {
				setIsProfileFormValid(true);
			} else {
				setIsProfileFormValid(false);
			}
		} else {
			setIsProfileFormValid(false);
		}
	}, [profileValues]);

	// parameters check for passwordForm
	const [isPasswordFormValid, setIsPasswordFormValid] = useState(false);
	const passwordValues = Form.useWatch([], passwordForm);
	useEffect(() => {
		if (
			passwordValues !== undefined &&
			passwordValues.oldPassword !== undefined &&
			passwordValues.newPassword !== undefined &&
			passwordValues.confirmPassword !== undefined
		) {
			if (
				passwordValues.oldPassword !== "" &&
				passwordValues.newPassword !== "" &&
				passwordValues.confirmPassword !== ""
			) {
				setIsPasswordFormValid(true);
			} else {
				setIsPasswordFormValid(false);
			}
		}
	}, [passwordValues]);

	useEffect(() => {
		profileForm.setFieldsValue({
			name: profile.name,
			email: profile.email,
			dob: dayjs(profile.dob),
			gender: profile.gender,
			therapist: `${profile.therapistName} [${profile.therapistEmail}]`,
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
			input: <Input disabled={isProfileDisabled} />,
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
			input: <DatePicker disabled={isProfileDisabled} />,
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
				<Radio.Group disabled={isProfileDisabled}>
					<Radio value="male">Male</Radio>
					<Radio value="female">Female</Radio>
				</Radio.Group>
			),
		},
		{
			label: "Therapist",
			name: "therapist",
			input: <Select disabled />,
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
					disabled={isProfileDisabled}
				/>
			),
		},
	];

	const passwordFormItem = [
		{
			label: "Old Password",
			name: "oldPassword",
			rules: [
				{
					required: true,
					message: "Please input your old password!",
				},
			],
			input: <Input.Password disabled={isPasswordDisabled} />,
		},
		{
			label: "New Password",
			name: "password",
			rules: [
				{
					required: true,
					message: "Please input your new password!",
				},
			],
			input: <Input.Password disabled={isPasswordDisabled} />,
		},
		{
			label: "Confirm Password",
			name: "confirmPassword",
			rules: [
				{
					required: true,
					message: "Please input your new password!",
				},
				({ getFieldValue }) => ({
					validator(_, value) {
						if (!value || getFieldValue("password") === value) {
							return Promise.resolve();
						}
						return Promise.reject(
							new Error("The new password that you entered do not match!")
						);
					},
				}),
			],
			dependencies: ["password"],
			input: <Input.Password disabled={isPasswordDisabled} />,
			hasFeedback: true,
		},
	];

	const generateForm = (formItem) => {
		return formItem.map((item, index) => {
			return (
				<Form.Item
					name={item.name}
					label={item.label}
					rules={item.rules}
					key={index}
					valuePropName={item.valuePropName}
					initialValue={item.initialValue}
					dependencies={item.dependencies}
					hasFeedback={item.hasFeedback}
				>
					{item.input}
				</Form.Item>
			);
		});
	};

	const generateProfileCard = () => {
		return (
			<Form
				form={profileForm}
				labelCol={{
					span: 6,
				}}
				wrapperCol={{
					span: 14,
				}}
				layout="horizontal"
				style={{
					textAlign: "left",
				}}
				onFinish={onProfileFinish}
				scrollToFirstError
			>
				<Card
					extra={
						<>
							<Button
								hidden={!isProfileDisabled}
								onClick={() => {
									setIsProfileDisabled(!isProfileDisabled);
									setIsPasswordDisabled(true);
								}}
							>
								Edit Profile
							</Button>
							<Button
								disabled={!isProfileFormValid}
								hidden={isProfileDisabled}
								onClick={() => {
									setIsProfileDisabled(!isProfileDisabled);
									profileForm.submit();
								}}
							>
								Save
							</Button>
						</>
					}
					style={{
						width: 720,
					}}
				>
					{generateForm(profileFormItem)}
				</Card>
			</Form>
		);
	};

	const generatePasswordCard = () => {
		return (
			<Form
				form={passwordForm}
				labelCol={{
					span: 6,
				}}
				wrapperCol={{
					span: 14,
				}}
				layout="horizontal"
				style={{
					textAlign: "left",
				}}
				onFinish={onPasswordFinish}
				scrollToFirstError
			>
				<Card
					extra={
						<>
							<Button
								hidden={!isPasswordDisabled}
								onClick={() => {
									setIsPasswordDisabled(!isPasswordDisabled);
									setIsProfileDisabled(true);
								}}
							>
								Edit Password
							</Button>
							<Button
								disabled={!isPasswordFormValid}
								hidden={isPasswordDisabled}
								onClick={() => {
									setIsPasswordDisabled(!isPasswordDisabled);
									passwordForm.submit();
								}}
							>
								Save
							</Button>
						</>
					}
					style={{
						width: 720,
					}}
				>
					{generateForm(passwordFormItem)}
				</Card>
			</Form>
		);
	};

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
		editProfile(req).then((res) => {
			alert(res.message);
		});
	};

	const onPasswordFinish = (values) => {
		const req = {
			password: values.oldPassword,
			newPassword: values.password,
		};
		// Handle the form submission
		resetPassword(req).then((res) => {
			alert(res.message || res.error);
		});
	};

	return profile.name ? (
		<Row gutter={12}>
			<Col span={12}>
				<Title level={4}>Profile</Title>
				{generateProfileCard()}
			</Col>
			<Col span={12}>
				<Title level={4}>Password</Title>
				{generatePasswordCard()}
			</Col>
		</Row>
	) : (
		<Loader />
	);
};

export default Profile;

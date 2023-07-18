import {
	Button,
	Form,
	Input,
	Radio,
	DatePicker,
	Select,
	Row,
	Divider,
	Typography,
	Space,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";

import * as constants from "../constants";
import { register } from "../api/account";
import { showNotification } from "../components/Notification";

const Register = () => {
	let navigate = useNavigate();
	const [date, setDate] = useState(null);

	const formItem = [
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
			rules: [
				{
					type: "email",
					message: "The input is not valid E-mail!",
				},
				{
					required: true,
					message: "Please input your email!",
				},
			],
			input: <Input />,
		},
		{
			label: "Password",
			name: "password",
			rules: [
				{
					required: true,
					message: "Please input your password!",
				},
				{
					min: 8,
					message: "Password must be at least 8 characters!",
				},
				{
					pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
					message:
						"Password must contain at least one uppercase letter, one lowercase letter and one number!",
				},
			],
			input: <Input.Password />,
		},
		{
			label: "Confirm Password",
			name: "confirmPassword",
			rules: [
				{
					required: true,
					message: "Please confirm your password!",
				},
				({ getFieldValue }) => ({
					validator(_, value) {
						if (!value || getFieldValue("password") === value) {
							return Promise.resolve();
						}
						return Promise.reject(
							new Error("The two passwords that you entered do not match!")
						);
					},
				}),
			],
			input: <Input.Password />,
			hasFeedback: true,
			dependencies: ["password"],
		},
		{
			label: "Date of Birth",
			name: "dob",
			rules: [
				{
					required: true,
					message: "Please input your date of birth!",
				},
			],
			input: (
				<DatePicker
					onChange={(date, dateString) => {
						setDate(dateString);
					}}
				/>
			),
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
					mode="multiple"
					showSearch={false}
					options={[
						{ value: "Stuttering", label: "Stuttering" },
						{ value: "Voice Disorder", label: "Voice Disorder" },
						{ value: "Stroke Recovery", label: "Stroke Recovery" },
					]}
				/>
			),
		},
	];

	const generateForm = (formItem) => {
		return formItem.map((item, index) => {
			return (
				<Form.Item
					style={{
						marginBottom: "12px",
					}}
					name={item.name}
					label={item.label}
					rules={item.rules}
					key={index}
					valuePropName={item.valuePropName}
					dependencies={item.dependencies}
					hasFeedback={item.hasFeedback}
				>
					{item.input}
				</Form.Item>
			);
		});
	};

	const onFinish = (values) => {
		const req = {
			name: values.name,
			email: values.email,
			password: values.password,
			dob: date,
			gender: values.gender,
			issue: values.issue,
		};

		register(req)
			.then((res) => {
				showNotification(res.message);
				navigate(constants.LOGIN_URL);
			})
			.catch((err) => {
				showNotification(err.message);
			});
	};

	return (
		<Row justify={"center"}>
			<Space direction="vertical" style={{ textAlign: "center" }}>
				<Typography.Title level={2} style={{ marginBottom: "-2px" }}>
					Create an account
				</Typography.Title>
				<Typography.Text>
					Create an account today to fully the services of our website
				</Typography.Text>
				<Form
					layout="vertical"
					onFinish={onFinish}
					scrollToFirstError
					style={{ textAlign: "left", width: "400px", maxWidth: "400px" }}
				>
					{generateForm(formItem)}

					<Form.Item
						wrapperCol={{
							span: 12,
							offset: 6,
						}}
					>
						<Button type="primary" htmlType="submit" style={{ width: "100%" }}>
							Sign up
						</Button>
					</Form.Item>
					<Divider></Divider>
					<Form.Item>
						By creating an account, you agree to our{" "}
						<Link
							to={constants.TERMS_CONDITIONS_URL}
							target="_blank"
							rel="noopener noreferrer"
						>
							Terms & Conditions
						</Link>
					</Form.Item>
				</Form>
			</Space>
		</Row>
	);
};

export default Register;

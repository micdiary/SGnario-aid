import { Button, Checkbox, Form, Input, Radio, DatePicker, Select } from "antd";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

import * as constants from "../constants";
import { register } from "../api/account";
import { getTherapists } from "../api/account";
import { showNotification } from "../components/Notification";

const Register = () => {
	let navigate = useNavigate();
	const [date, setDate] = useState(null);
	const [therapists, setTherapists] = useState([]);

	useEffect(() => {
		getTherapists().then((res) => {
			let temp = [];
			for (const therapist in res.therapists) {
				temp.push({
					value: therapist,
					label: `${res.therapists[therapist]} (${therapist})`,
				});
			}
			setTherapists(temp);
		});
	}, []);

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
			label: "Date Of Birth",
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
			label: "Therapist",
			name: "therapist",
			rules: [
				{
					required: true,
					message: "Please select your therapist!",
				},
			],
			input: <Select options={therapists} />,
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
		{
			label: (
				<>
					I have read and agreed to the&nbsp;
					<Link
						to={constants.TERMS_CONDITIONS_URL}
						target="_blank"
						rel="noopener noreferrer"
					>
						Terms and Conditions
					</Link>
				</>
			),
			name: "termsAndConditions",
			valuePropName: "checked",
			rules: [
				{
					required: true,
					message: "Please accept terms & conditions!",
				},
			],
			input: <Checkbox />,
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
			therapistEmail: values.therapist,
			therapistName: therapists
				.find((therapist) => therapist.value === values.therapist)
				.label.split(" ")[0],
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
		<>
			<Form
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
				onFinish={onFinish}
				scrollToFirstError
			>
				{generateForm(formItem)}
				<Form.Item
					wrapperCol={{
						span: 12,
						offset: 6,
					}}
				>
					<Button type="primary" htmlType="submit">
						Sign up
					</Button>
				</Form.Item>
			</Form>
		</>
	);
};

export default Register;

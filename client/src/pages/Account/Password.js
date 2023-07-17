import React from "react";
import { Input, Button, Form, Typography, Divider } from "antd";
import { resetPassword } from "../../api/account";
import { generateForm } from "../../utils/form";
import { showNotification } from "../../components/Notification";

const Password = () => {
	const [passwordForm] = Form.useForm();
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
			input: <Input.Password />,
		},
		{
			label: "New Password",
			name: "password",
			rules: [
				{
					required: true,
					message: "Please input your new password!",
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
			input: <Input.Password />,
			hasFeedback: true,
		},
	];

	const onPasswordFinish = (values) => {
		const req = {
			password: values.oldPassword,
			newPassword: values.password,
		};
		// Handle the form submission
		resetPassword(req)
			.then((res) => {
				showNotification(res.message);
				passwordForm.resetFields();
			})
			.catch((err) => {
				showNotification(err.message, "error");
			});
	};
	return (
		<Form
			form={passwordForm}
			wrapperCol={{
				span: 12,
			}}
			layout="vertical"
			onFinish={onPasswordFinish}
			scrollToFirstError
		>
			<Typography.Title level={4}>Change password</Typography.Title>
			<Divider />
			{generateForm(passwordFormItem)}
			<Button type={"primary"} onClick={() => passwordForm.submit()}>
				Update password
			</Button>
		</Form>
	);
};

export default Password;

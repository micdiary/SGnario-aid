import { Button, Form, Input, Row, Space, Typography } from "antd";
import { UserOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { forgetPassword } from "../api/account";
import * as constants from "../constants";
import { useState } from "react";
import { Link } from "react-router-dom";

const ForgetPassword = () => {
	const [form] = Form.useForm();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const onFinish = (values) => {
		setIsSubmitting(true);
		forgetPassword({ email: values.email })
			.then((res) => {
				console.log(res);
				setIsSuccess(true);
			})
			.catch((error) => {
				console.error("Password reset failed:", error);
				setIsSubmitting(false);
				form.resetFields();
			});
	};

	if (isSuccess) {
		return (
			<Row justify={"center"}>
				<Space direction="vertical">
					<Typography.Title
						level={4}
						style={{
							margin: "0 auto",
							textAlign: "center",
						}}
					>
						An email has been sent to your email address with instructions to
						reset your password.
					</Typography.Title>
					<Button
						type="text"
						style={{
							margin: "0 auto",
							textAlign: "center",
							justifyContent: "center",
							display: "flex",
						}}
					>
						<Link to={constants.LOGIN_URL}>
							<Typography>
								<ArrowLeftOutlined /> Back to Login
							</Typography>
						</Link>
					</Button>
				</Space>
			</Row>
		);
	}

	return (
		<Row justify={"center"}>
			<Space direction="vertical" style={{ textAlign: "center" }}>
				<Typography.Title level={2} style={{ margin: "10px" }}>
					Forgot password?
				</Typography.Title>
				<Typography.Text>
					No worries, we'll send you reset instructions.
				</Typography.Text>
				<Form form={form} onFinish={onFinish} layout="vertical">
					<Form.Item
						label="Email"
						name="email"
						rules={[
							{
								required: true,
								message: "Please input your email!",
							},
							{
								type: "email",
								message: "Please enter a valid email address!",
							},
						]}
					>
						<Input prefix={<UserOutlined />} />
					</Form.Item>
					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							disabled={isSubmitting}
							loading={isSubmitting}
							style={{ width: "100%" }}
						>
							Reset Password
						</Button>
						<Button
							type="text"
							style={{
								marginTop: "12px",
							}}
						>
							<Link to={constants.LOGIN_URL}>
								<Typography>
									<ArrowLeftOutlined /> Back to Login
								</Typography>
							</Link>
						</Button>
					</Form.Item>
				</Form>
			</Space>
		</Row>
	);
};

export default ForgetPassword;

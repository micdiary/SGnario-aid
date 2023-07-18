import { Button, Checkbox, Form, Input, Row, Space, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import React from "react";
import { login, getUserType } from "../api/account";
import * as constants from "../constants";
import { setToken, setUserID, setUserType } from "../utils/account";
import { userStore } from "../utils/store";
import { showNotification } from "../components/Notification";

const Login = () => {
	let navigate = useNavigate();
	const updateUserID = userStore((state) => state.setID);
	const updateUserType = userStore((state) => state.setType);

	const onFinish = (values) => {
		const req = {
			email: values.email,
			password: values.password,
		};

		login(req)
			.then((res) => {
				setToken(res.token);
				setUserID(res.userID);
				updateUserID(res.userID);

				getUserType(res.userID)
					.then((res) => {
						setUserType(res.role);
						updateUserType(res.role);
						if (res.role === "admin") {
							navigate(constants.ADMIN_URL);
						} else {
							navigate(constants.HOME_URL);
						}
					})
					.catch((err) => {
						showNotification(err.message, "error");
					});
			})
			.catch((err) => {
				showNotification(err.message, "error");
			});
	};

	return (
		<Row justify={"center"}>
			<Space direction="vertical" style={{ width: "20%" }}>
				<Typography.Title
					level={2}
					style={{ textAlign: "center", marginBottom: "-2px" }}
				>
					Log in
				</Typography.Title>
				<Form
					layout="vertical"
					name="normal_login"
					className="login-form"
					initialValues={{
						remember: true,
					}}
					onFinish={onFinish}
				>
					<Form.Item
						label="Email"
						name="email"
						rules={[
							{
								required: true,
								message: "Please input your Email!",
							},
							{
								type: "email",
								message: "Please enter a valid email address!",
							},
						]}
					>
						<Input prefix={<UserOutlined className="site-form-item-icon" />} />
					</Form.Item>
					<Form.Item
						label="Password"
						name="password"
						rules={[
							{
								required: true,
								message: "Please input your Password!",
							},
						]}
					>
						<Input
							prefix={<LockOutlined className="site-form-item-icon" />}
							type="password"
						/>
					</Form.Item>
					<Form.Item>
						<Row justify={"space-between"} align={"middle"}>
							<Form.Item
								name="remember"
								valuePropName="checked"
								style={{
									marginBottom: "0px",
								}}
							>
								<Checkbox>Remember me</Checkbox>
							</Form.Item>
							<Typography.Link
								className="login-form-forgot"
								href={constants.FORGET_PASSWORD_URL}
							>
								Forgot password
							</Typography.Link>
						</Row>
					</Form.Item>
					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							className="login-form-button"
							style={{ width: "100%", marginTop: "-10px" }}
						>
							Log in
						</Button>
						<div
							style={{
								float: "left",
							}}
						>
							Or{" "}
							<Typography.Link href={constants.REGISTER_URL}>
								register now!
							</Typography.Link>
						</div>
					</Form.Item>
				</Form>
			</Space>
		</Row>
	);
};

export default Login;

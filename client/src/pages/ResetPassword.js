import { Button, Form, Input, Typography } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "../api/account";
import * as constants from "../constants";
import { getValueFromQueryString } from "../utils/string";
import { showNotification } from "../components/Notification";

const ResetPassword = () => {
	const location = useLocation();
	const navigate = useNavigate();

	const onFinish = (values) => {
		const token = getValueFromQueryString("token", location.search);
		const req = {
			token: token,
			newPassword: values.password,
		};
		resetPassword(req)
			.then((res) => {
				showNotification(res.message);
				navigate(constants.LOGIN_URL);
			})
			.catch((error) => {
				showNotification(error.message, "error");
			});
	};

	return (
		<div style={{ width: "50%", margin: "0 auto" }}>
			<Typography.Title level={4}>Reset Password</Typography.Title>
			<Form onFinish={onFinish}>
				<Form.Item
					name="password"
					rules={[
						{
							required: true,
							message: "Please enter your new password!",
						},
					]}
				>
					<Input.Password
						prefix={<LockOutlined />}
						placeholder="New Password"
					/>
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit">
						Reset
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default ResetPassword;

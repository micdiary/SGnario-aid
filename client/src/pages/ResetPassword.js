import { Button, Form, Input, Row, Space, Typography } from "antd";
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
		<Row justify={"center"}>
			<Space direction="vertical">
				<Typography.Title
					level={2}
					style={{ textAlign: "center", margin: "10px" }}
				>
					Reset Password
				</Typography.Title>
				<Form
					onFinish={onFinish}
					layout="vertical"
					style={{
						width: "400px",
						maxWidth: "400px",
					}}
				>
					<Form.Item
						label="New Password"
						name="password"
						wrapperCol={{ span: 24 }}
						rules={[
							{
								required: true,
								message: "Please enter your new password!",
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
						]}
					>
						<Input.Password />
					</Form.Item>
					<Form.Item
						label="Confirm Password"
						name="confirmPassword"
						rules={[
							{
								required: true,
								message: "Please confirm your new password!",
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
						]}
						dependencies={["password"]}
					>
						<Input.Password />
					</Form.Item>
					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							style={{
								width: "100%",
							}}
						>
							Reset
						</Button>
					</Form.Item>
				</Form>
			</Space>
		</Row>
	);
};

export default ResetPassword;

import { Form } from "antd";

export const generateForm = (formItem) => {
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

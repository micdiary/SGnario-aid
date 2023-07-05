import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const Loader = () => {
	const antIcon = <LoadingOutlined style={{ fontSize: 64 }} spin />;

	return (
		<div
			style={{
				height: "100%",
				margin: "20px 0",
				padding: "30px 50px",
				textAlign: "center",
				backgroundColor: "rgba(0, 0, 0, 0.05)",
				borderRadius: "4px",
			}}
			className="loader-div"
		>
			<Spin
				style={{
					margin: "0 auto",
				}}
				indicator={antIcon}
			/>
		</div>
	);
};

export default Loader;

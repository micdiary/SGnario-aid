import Layout from "./layout/Layout";
import "antd/dist/reset.css";
import { ConfigProvider } from "antd";

function App() {
	return (
		<ConfigProvider
			theme={{
				token: {
					colorPrimary: "#9C6C58",
					colorText: "#436A71",
				},
			}}
		>
			<div className="App">
				<Layout />
			</div>
		</ConfigProvider>
	);
}

export default App;

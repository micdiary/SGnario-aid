import Layout from "./layout/Layout";
import "antd/dist/reset.css";
import { ConfigProvider } from "antd";

function App() {
  return (
    <ConfigProvider>
      <div className="App">
        <Layout />
      </div>
    </ConfigProvider>
  );
}

export default App;

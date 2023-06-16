import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, Select, Table } from "antd";
import {
  assignTasks,
  getAllPatients,
  getPatientsByTherapist,
} from "../../../api/therapist";
import { getScenarios } from "../../../api/scenarios";

const { Option } = Select;

const SuperUserDashboard = ({ profile }) => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [patientOptions, setPatientOptions] = useState([]);
  const [scenarioOptions, setScenarioOptions] = useState([]);

  useEffect(() => {
    form.setFieldsValue({
      name: profile.email,
    });

    getPatientsByTherapist().then((res) => {
      setPatientOptions(res.users);
    });

    getScenarios().then((res) => {
      setScenarioOptions(res.data);
    });
  }, []);

  useEffect(() => {
    getPatientsByTherapist().then((res) => {
      console.log(res);
    });
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    form.submit();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFormFinish = (values) => {
    setConfirmLoading(true);
    const req = {
      email: values.patient,
      scenarioId: values.scenario,
      dateAssigned: new Date(),
    };
    assignTasks(req).then((res) => {
      console.log(res);
    });
    setConfirmLoading(false);
    setIsModalVisible(false);
  };

  const formItem = [
    {
      label: "Name",
      name: "name",
      input: <Input disabled />,
    },
    {
      label: "Patient",
      name: "patient",
      rules: [
        {
          required: true,
          message: "Please input your patient!",
        },
      ],
      input: (
        <Select placeholder="Select a patient">
          {patientOptions.map((patient) => {
            return (
              <Option value={patient.email}>
                {patient.name} [{patient.email}]
              </Option>
            );
          })}
        </Select>
      ),
    },
    {
      label: "Scenario",
      name: "scenario",
      rules: [
        {
          required: true,
          message: "Please input your scenario!",
        },
      ],
      input: (
        <Select placeholder="Select a scenario">
          {scenarioOptions.map((scenario) => {
            return (
              <Option value={scenario.videoId}>{scenario.videoName}</Option>
            );
          })}
        </Select>
      ),
    },
  ];

  const modalForm = (formItem) => {
    return formItem.map((item, index) => {
      return (
        <Form.Item
          name={item.name}
          label={item.label}
          rules={item.rules}
          key={index}
          valuePropName={item.valuePropName}
        >
          {item.input}
        </Form.Item>
      );
    });
  };

  const columns = [
    {
      title: "Patient Name",
      dataIndex: "patient",
      key: "patient",
    },
    {
      title: "Scenario Name",
      dataIndex: "scenario",
      key: "scenario",
    },
    {
      title: "Date Assigned",
      dataIndex: "dateAssigned",
      key: "dateAssigned",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Patient Grade",
      dataIndex: "patientGrade",
      key: "patientGrade",
    },
    {
      title: "Therapist Grade",
      dataIndex: "therapistGrade",
      key: "therapistGrade",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
  ];

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Assign Task
      </Button>
      <Table columns={columns} />
      <Modal
        title="Assign Task"
        open={isModalVisible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form form={form} onFinish={onFormFinish}>
          {modalForm(formItem)}
        </Form>
      </Modal>
    </>
  );
};

export default SuperUserDashboard;

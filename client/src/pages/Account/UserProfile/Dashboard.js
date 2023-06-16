import React from "react";
import { Button, Table, Tag } from "antd";
import {
  SUBMITTED_TAG,
  GRADED_TAG,
  NOT_SUBMITTED_TAG,
  UNGRADED_TAG,
} from "../../../constants";

const Dashboard = ({ setView, setEvaluationID }) => {

  const columns = [
    {
      title: "Scenario",
      dataIndex: "scenario",
      key: "scenario",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Date Assigned",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (tags) => (
        <>
          {tags.map((tag) => {
            let color = tag === SUBMITTED_TAG ? "green" : "volcano";
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Self Grade",
      dataIndex: "selfGrade",
      key: "selfGrade",
      render: (tags) => (
        <>
          {tags.map((tag) => {
            let color = tag === GRADED_TAG ? "green" : "yellow";
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Therapist Grade",
      dataIndex: "therapistGrade",
      key: "therapistGrade",
      render: (tags) => (
        <>
          {tags.map((tag) => {
            let color = tag === GRADED_TAG ? "green" : "yellow";
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button onClick={handleNavigation}>View More {record.lastName}</Button>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      scenario: "Scenario 1",
      type: "One to One",
      date: "2021-03-01",
      status: [SUBMITTED_TAG],
      selfGrade: [GRADED_TAG],
      therapistGrade: [GRADED_TAG],
    },
    {
      key: "2",
      scenario: "Scenario 2",
      type: "Panel",
      date: "2021-03-01",
      status: [NOT_SUBMITTED_TAG],
      selfGrade: [UNGRADED_TAG],
      therapistGrade: [UNGRADED_TAG],
    },
  ];

  const handleNavigation = () => {
    setEvaluationID(1);
    setView("evaluation");
  };

  return <Table columns={columns} dataSource={data}></Table>;
};

export default Dashboard;

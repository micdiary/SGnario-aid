import React from "react";
import { Form, Input, Button, Select } from "antd";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { createScenario } from "../api/scenarios";

const { Option } = Select;

const validationSchema = Yup.object().shape({
  category: Yup.string().required("Category is required"),
  scenario: Yup.string().required("Scenario is required"),
  videoId: Yup.string().required("Video ID is required"),
  videoName: Yup.string().required("Video Name is required"),
});

const initialValues = {
  category: "",
  scenario: "",
  videoId: "",
  videoName: "",
};

const categories = ["Category 1", "Category 2", "Category 3"];
const scenarios = ["Scenario 1", "Scenario 2", "Scenario 3"];

const ScenarioForm = () => {
  const handleSubmit = async (values) => {
    try {
      const currentDate = new Date();

      const data = {
        ...values,
        dateAdded: currentDate,
      };

      const response = await createScenario(data);

      if (response.ok) {
        // Handle success
        console.log("Scenario created successfully");
      } else {
        // Handle error
        console.error("Failed to create scenario");
      }
    } catch (error) {
      console.error("Error creating scenario", error);
    }
  };

  const handleChange = (field, value, formik) => {
    formik.setFieldValue(field, value);
    formik.setFieldTouched(field, true);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {(formik) => (
        <Form layout="vertical" onFinish={formik.handleSubmit}>
          <Form.Item
            label="Category"
            name="category"
            validateStatus={formik.touched.category && formik.errors.category ? "error" : ""}
            help={formik.touched.category && formik.errors.category}
          >
            <Field
              as={Select}
              onChange={(value) => handleChange("category", value, formik)}
            >
              {categories.map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Field>
          </Form.Item>

          <Form.Item
            label="Scenario"
            name="scenario"
            validateStatus={formik.touched.scenario && formik.errors.scenario ? "error" : ""}
            help={formik.touched.scenario && formik.errors.scenario}
          >
            <Field
              as={Select}
              onChange={(value) => handleChange("scenario", value, formik)}
            >
              {scenarios.map((scenario) => (
                <Option key={scenario} value={scenario}>
                  {scenario}
                </Option>
              ))}
            </Field>
          </Form.Item>

          <Form.Item
            label="Video ID"
            name="videoId"
            validateStatus={formik.touched.videoId && formik.errors.videoId ? "error" : ""}
            help={formik.touched.videoId && formik.errors.videoId}
          >
            <Field
              as={Input}
              onChange={(e) => handleChange("videoId", e.target.value, formik)}
            />
          </Form.Item>

          <Form.Item
            label="Video Name"
            name="videoName"
            validateStatus={formik.touched.videoName && formik.errors.videoName ? "error" : ""}
            help={formik.touched.videoName && formik.errors.videoName}
          >
            <Field
              as={Input}
              onChange={(e) => handleChange("videoName", e.target.value, formik)}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      )}
    </Formik>
  );
};

export default ScenarioForm;

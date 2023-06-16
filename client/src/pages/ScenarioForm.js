import React, { useState } from 'react';
import { Form, Input, Button, message, Select } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createScenario, checkDuplicateVideoId } from '../api/scenarios';

const { Option } = Select;

const ScenarioForm = () => {
    const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);

  const validationSchema = Yup.object().shape({
    category: Yup.string().required('Category is required'),
    scenario: Yup.string().required('Scenario is required'),
    videoId: Yup.string().required('Video ID is required'),
    videoName: Yup.string().required('Video Name is required'),
  });

  const formik = useFormik({
    initialValues: {
      category: '',
      scenario: '',
      videoId: '',
      videoName: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setIsCheckingDuplicate(true);
        const isDuplicate = await checkDuplicateVideoId(values.videoId);
        setIsCheckingDuplicate(false);

        if (isDuplicate) {
          formik.setFieldError('videoId', 'Duplicate video ID');
          return;
        }
        // Add the dateAdded field with the current date (without the time component)
        const dateAdded = new Date();
        const scenarioData = {
          ...values,
          dateAdded,
        };
        // Send scenario data to the backend API
        await createScenario(scenarioData);
        message.success('Scenario created successfully');
        resetForm();

        // Display the success message for 2 seconds before redirecting
        setTimeout(() => {
          window.location.href = '/Scenarios'; // Replace '/scenario' with the actual URL of the scenario page
        }, 2000);
      } catch (error) {
        console.error('Error creating scenario:', error);
        message.error('Failed to create scenario');
      }
    },
  });

  const { values, touched, errors, handleChange, handleBlur, handleSubmit } = formik;

  const handleCategoryChange = (value) => {
    formik.setFieldValue('category', value);
  };

  const handleScenarioChange = (value) => {
    formik.setFieldValue('scenario', value);
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        label="Category"
        required
        hasFeedback
        validateStatus={touched.category && errors.category ? 'error' : touched.category && !values.category ? 'error' : ''}
        help={touched.category && errors.category ? errors.category : touched.category && !values.category ? 'Category is required' : ''}
      >
        <Select
          name="category"
          value={values.category}
          onChange={handleCategoryChange}
          onBlur={handleBlur}
          placeholder="Select category"
          size="large" // Add size prop with value "large"
        >
          <Option value="category1">Category 1</Option>
          <Option value="category2">Category 2</Option>
          <Option value="category3">Category 3</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Scenario"
        required
        hasFeedback
        validateStatus={touched.scenario && errors.scenario ? 'error' : touched.scenario && !values.scenario ? 'error' : ''}
        help={touched.scenario && errors.scenario ? errors.scenario : touched.scenario && !values.scenario ? 'Scenario is required' : ''}
      >
        <Select
          name="scenario"
          value={values.scenario}
          onChange={handleScenarioChange}
          onBlur={handleBlur}
          placeholder="Select scenario"
          size="large" // Add size prop with value "large"
        >
          <Option value="scenario1">Scenario 1</Option>
          <Option value="scenario2">Scenario 2</Option>
          <Option value="scenario3">Scenario 3</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Video ID"
        required
        hasFeedback
        validateStatus={touched.videoId && errors.videoId ? 'error' : ''}
        help={touched.videoId && errors.videoId}
      >
        <Input name="videoId" value={values.videoId} onChange={handleChange} onBlur={handleBlur} size="large" /> {/* Add size prop with value "large" */}
      </Form.Item>

      <Form.Item
        label="Video Name"
        required
        hasFeedback
        validateStatus={touched.videoName && errors.videoName ? 'error' : ''}
        help={touched.videoName && errors.videoName}
      >
        <Input name="videoName" value={values.videoName} onChange={handleChange} onBlur={handleBlur} size="large" /> {/* Add size prop with value "large" */}
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" size="large"> {/* Add size prop with value "large" */}
          Create Scenario
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ScenarioForm;

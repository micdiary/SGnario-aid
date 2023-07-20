import { Button, Col, Form, Input, Row, Select, Spin, Typography } from 'antd'
import { useState } from 'react'
import { contactUsEmail } from '../api/contact'
import { showNotification } from '../components/Notification'

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false)

  const formItem = [
    {
      label: 'Name',
      name: 'name',
      input: <Input />,
    },
    {
      label: 'Email',
      name: 'email',
      input: <Input />,
    },
    {
      label: 'Category',
      name: 'category',
      rules: [
        {
          required: true,
          message: 'Please select a category!',
        },
      ],
      input: (
        <Select
          options={[
            { value: 'Account Deletion', label: 'Account Deletion' },
            { value: 'Bugs', label: 'Bugs' },
            {
              value: 'Suggestions and Feedback',
              label: 'Suggestions and Feedback',
            },
            { value: 'Queries', label: 'Queries' },
          ]}
        />
      ),
    },
    {
      label: 'Message',
      name: 'message',
      rules: [
        {
          required: true,
          message: 'Please input your message!',
        },
      ],
      input: <Input.TextArea rows={5} />,
    },
  ]

  const generateForm = (formItem) => {
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
      )
    })
  }

  const onFinish = (values) => {
    setIsLoading(true)
    const req = {
      name: values.name,
      email: values.email,
      category: values.category,
      message: values.message,
    }

    contactUsEmail(req)
      .then((res) => {
        showNotification(res.message)
      })
      .catch((err) => {
        showNotification(err.message, 'error')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <Spin spinning={isLoading}>
      <Row gutter={[24, 12]}>
        <Col span={8} xs={24} md={8}>
          <Typography.Title level={2}>Contact Us</Typography.Title>
          <Typography.Text>
            Fill up the form below with your inquiry and we will get back to you
            soon.
          </Typography.Text>
        </Col>
        <Col span={16} xs={24} md={16}>
          <Form
            requiredMark={'optional'}
            layout="vertical"
            style={{
              textAlign: 'left',
            }}
            onFinish={onFinish}
            scrollToFirstError
          >
            {generateForm(formItem)}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  width: '100%',
                }}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Spin>
  )
}

export default Contact

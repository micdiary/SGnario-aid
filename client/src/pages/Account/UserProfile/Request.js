import { Spin, Table, Space, Popconfirm, Button } from 'antd'
import React, { useEffect, useState } from 'react'
import { sendRequestAction } from '../../../api/profile'
import { showNotification } from '../../../components/Notification'

const Request = ({ profile, setProfile }) => {
  const [data, setData] = useState([])

  useEffect(() => {
    if (profile.therapistRequests === undefined) return
    const therapistRequest = profile.therapistRequests
    let temp = []
    therapistRequest.map((request, index) => {
      return temp.push({
        key: index,
        therapist: request,
      })
    })
    setData(temp)
  }, [profile])

  const requestAction = (therapistEmail, action) => {
    const tempProfile = { ...profile }
    const req = {
      therapistEmail: therapistEmail,
      action: action,
    }
    sendRequestAction(req)
      .then((res) => {
        showNotification(res.message)
      })
      .catch((err) => {
        showNotification(err.message, 'error')
      }).finally(() => {
        tempProfile.therapistRequests = tempProfile.therapistRequests.filter(
          (request) => request !== therapistEmail
        )
        setProfile(tempProfile)
    })
  }

  const columns = [
    {
      title: 'Therapist',
      dataIndex: 'therapist',
      key: 'therapist',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (value, record) => (
        <Space size="large">
          <Popconfirm
            title="Sure to accept?"
            onConfirm={() => {
              requestAction(record.therapist, 'yes')
            }}
          >
            <Button type="primary">Accept</Button>
          </Popconfirm>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => {
              requestAction(record.therapist, 'no')
            }}
          >
            <Button>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Spin spinning={!profile.name}>
      <Table columns={columns} dataSource={data} />
    </Spin>
  )
}

export default Request

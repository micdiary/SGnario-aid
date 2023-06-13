import React from 'react'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const Loader = () => {
	const antIcon = <LoadingOutlined style={{ fontSize: 64 }} spin />

	return (
		<div className='loader-div'>
			<Spin indicator={antIcon} />
		</div>
	)
}

export default Loader
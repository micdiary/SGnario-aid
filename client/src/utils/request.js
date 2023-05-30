async function requestHandler(api, body = {}, method = 'GET') {
	let requestOptions = {}

	if (method === 'POST') {
		requestOptions = {
			method: 'POST',
			credentials: 'include',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body.req),
		}
	}

	const response = await fetch(api, requestOptions)
	return response.json()
}

export async function requestGet(api) {
	return requestHandler(api)
}

export async function requestPost(api, body) {
	return requestHandler(api, body, 'POST')
}

import { requestGet, requestPost } from '../utils/request'
import {
  GET_PATIENTS_BY_THERAPIST_API,
  GET_PATIENTS_TASKS_API,
  GET_PATIENTS_WITHOUT_THERAPIST_API,
  REMOVE_USER_API,
  SEND_REQUEST_API,
  SET_THERAPIST_API,
  SUPERUSER_TASK_SUBMISSION_API,
  UPLOAD_API,
  DRIVE_CREDENTIALS_API
} from '../constants.js'
import { getToken } from '../utils/account'

export async function getPatientsByTherapist() {
  return requestGet(`${GET_PATIENTS_BY_THERAPIST_API}/${getToken()}`)
}

export async function getPatientsTasks(id) {
  return requestGet(`${GET_PATIENTS_TASKS_API}/${id}`)
}

export async function updatePatientTasks(req) {
  return requestPost(`${SUPERUSER_TASK_SUBMISSION_API}`, {
    req: {
      token: getToken(),
      fields: req,
    },
  })
}

export async function getPatientsWithoutTherapist() {
  return requestGet(`${GET_PATIENTS_WITHOUT_THERAPIST_API}/${getToken()}`)
}

export async function sendPatientRequest(req) {
  return requestPost(SEND_REQUEST_API, {
    req: {
      token: getToken(),
      userIds: req.userIds,
    },
  })
}

export async function setTherapist(req) {
  return requestPost(`${SET_THERAPIST_API}`, {
    req: {
      token: getToken(),
      userIds: req.userIds,
    },
  })
}

export async function removePatient(req) {
  return requestPost(`${REMOVE_USER_API}`, {
    req: {
      token: getToken(),
      userId: req,
    },
  })
}

export async function setStorageConfigurations(req) {
	const token = getToken();
	return requestPost(DRIVE_CREDENTIALS_API, { req: { token: token, fields: req } });
  }

export async function testGoogleDrive(req) {
  const formData = new FormData()
  formData.append('token', getToken())
  formData.append('file', req)
  return requestPost(
    `${UPLOAD_API}/test`,
    { req: formData },
    'multipart/form-data',
  )
}

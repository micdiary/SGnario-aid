import { requestGet, requestPost } from "../utils/request";
import {
	GET_PATIENTS_BY_THERAPIST_API,
	GET_PATIENTS_TASKS_API,
	SUPERUSER_TASK_SUBMISSION_API,
	UPLOAD_API,
} from "../constants.js";
import { getToken } from "../utils/account";

export async function getPatientsByTherapist() {
	return requestGet(`${GET_PATIENTS_BY_THERAPIST_API}/${getToken()}`);
}

export async function getPatientsTasks(id) {
	return requestGet(`${GET_PATIENTS_TASKS_API}/${id}`);
}

export async function updatePatientTasks(req) {
	return requestPost(`${SUPERUSER_TASK_SUBMISSION_API}`, {
		req: {
			token: getToken(),
			fields: req,
		},
	});
}

export async function testGoogleDrive(req) {
	const formData = new FormData();
	formData.append("token", getToken());
	formData.append("file", req);
	return requestPost(
		`${UPLOAD_API}/test`,
		{ req: formData },
		"multipart/form-data"
	);
}

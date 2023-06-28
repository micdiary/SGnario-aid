import { requestGet, requestPost } from "../utils/request";
import {
	GET_PATIENTS_BY_THERAPIST_API,
	GET_PATIENTS_TASKS_API,
	SUPERUSER_TASK_SUBMISSION_API,
} from "../constants.js";
import { getToken } from "../utils/account";

export async function getPatientsByTherapist() {
	const token = getToken();
	return requestGet(`${GET_PATIENTS_BY_THERAPIST_API}/${token}`);
}

export async function getPatientsTasks(id) {
	return requestGet(`${GET_PATIENTS_TASKS_API}/${id}`);
}

export async function updatePatientTasks(req) {
	const token = getToken();
	return requestPost(`${SUPERUSER_TASK_SUBMISSION_API}`, {
		req: {
			token: token,
			fields: req,
		},
	});
}

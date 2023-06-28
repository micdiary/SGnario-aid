import { requestDelete, requestGet, requestPost } from "../utils/request";
import {
	THERAPISTS_API,
	REGISTER_SUPERUSER_API,
	GET_PATIENTS_API,
	ALL_USERS_API,
} from "../constants.js";
import { getToken } from "../utils/account";

export async function getPatients() {
	const token = getToken();
	return requestGet(`${GET_PATIENTS_API}/${token}`);
}

export async function getTherapists() {
	const token = getToken();
	return requestPost(THERAPISTS_API, { req: { token: token } });
}

export async function registerSuperuser(req) {
	return requestPost(REGISTER_SUPERUSER_API, { req });
}

export async function deleteUser(req) {
	const token = getToken();
	return requestDelete(ALL_USERS_API, { req: { token: token, userId: req } });
}

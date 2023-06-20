import { requestGet } from "../utils/request";
import { GET_PATIENTS_BY_THERAPIST_API } from "../constants.js";
import { getToken } from "../utils/account";

export async function getPatientsByTherapist() {
	const token = getToken();
	return requestGet(`${GET_PATIENTS_BY_THERAPIST_API}/${token}`);
}

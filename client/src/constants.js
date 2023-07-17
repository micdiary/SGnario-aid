export const GOOGLE_DRIVE_VIDEO_URL =
	"https://drive.google.com/file/d/1O4ecM79AYcfGJFTixXMaOQKxXReetbPn/view?usp=sharing";

export const HOME_URL = "/";
export const ABOUT_US_URL = "/about-us";
export const CONTACT_US_URL = "/contact-us";
export const TERMS_CONDITIONS_URL = "/terms-conditions";
export const ACCOUNT_URL = "/account";
export const PROFILE_URL = `${ACCOUNT_URL}/profile`;
export const LOGIN_URL = "/login";
export const REGISTER_URL = "/register";
export const FORGET_PASSWORD_URL = "/forget-password";
export const RESET_PASSWORD_URL = "/reset-password";
export const SCENARIOS_URL = "/scenarios";
export const SCENARIOS_FORM = "/scenarios-form";

export const ADMIN_URL = "/admin";

export const URL = "http://localhost:3001";
export const REGISTER_API = `${URL}/auth/register`;
export const LOGIN_API = `${URL}/auth/login`;
export const USER_TYPE_API = `${URL}/auth/role`;
export const FORGOT_PASSWORD_API = `${URL}/auth/forgot-password`;
export const RESET_PASSWORD_API = `${URL}/auth/reset-password`;
export const REGISTER_SUPERUSER_API = `${URL}/auth/register-superuser`;

export const ALL_USERS_API = `${URL}/users`;
export const PROFILE_API = `${URL}/users/profile`;
export const EDIT_PROFILE_API = `${URL}/users/edit-profile`;
export const THERAPISTS_API = `${URL}/users/therapists`;
export const GET_PATIENTS_API = `${URL}/users/patients`;
export const DRIVE_CREDENTIALS_API = `${URL}/users/set-drive-credentials`;
export const GET_PATIENTS_BY_THERAPIST_API = `${URL}/users/patients`;
export const GET_PATIENTS_WITHOUT_THERAPIST_API = `${URL}/users/newPatients`;
export const SET_THERAPIST_API = `${URL}/users/set-therapist`;
export const REMOVE_USER_API = `${URL}/users/remove-user`;

export const UPLOAD_API = `${URL}/upload`;

export const CREATE_SCENARIOS_API = `${URL}/scenarios/create-scenario`;
export const SCENARIOS_URL_API = `${URL}/scenarios/all`;
export const UPDATE_SCENARIO_VIDEO_API = `${URL}/scenarios/:id/video/:videoId`;
export const UPDATE_SCENARIO_API = `${URL}/scenarios/:id`;
export const DELETE_SCENARIO_API = `${URL}/scenarios/:id`;
export const DELETE_SCENARIO_VIDEO_API = `${URL}/scenarios/:id/video/:videoId`;

export const CREATE_TASK_API = `${URL}/tasks/create`;
export const GET_TASKS_BY_PATIENT_API = `${URL}/tasks/user/token`;
export const GET_PATIENTS_TASKS_API = `${URL}/tasks/user/id`;
export const GET_TASK_BY_ID_API = `${URL}/tasks`;
export const USER_TASK_SUBMISSION_API = `${URL}/tasks/user/submission`;
export const TASK_STATUS_API = `${URL}/tasks/status`;
export const SUPERUSER_TASK_SUBMISSION_API = `${URL}/tasks/therapist/evaluation`;

export const TAG = {
	Incomplete: "volcano",
	Pending: "yellow",
	Completed: "green",
};

export const stutterMarks = {
	0: "No Stutter (0)",
	1: "Extremely Mild Stutter (1)",
	2: "Mild Stutter (2)",
	3: "Mild Stutter (3)",
	4: "Moderate Stutter (4)",
	5: "Moderate Stutter (5)",
	6: "Severe Stutter (6)",
	7: "Severe Stutter (7)",
	8: "Extremely Severe Stutter (8)",
};

export const fluencyMarks = {
	0: "No Technique (0)",
	1: "Less Technique (1)",
	2: "Less Technique (2)",
	3: "Moderate Technique (3)",
	4: "Moderate Technique (4)",
	5: "Moderate Technique (5)",
	6: "More Technique (6)",
	7: "More Technique (7)",
	8: "Maximum Technique (8)",
};

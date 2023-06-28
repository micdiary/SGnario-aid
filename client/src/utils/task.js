export function populateTaskData(task) {
	let tempData = [];
	for (let i = 0; i < task.submissions.length; i++) {
		const video = task.videos.find(
			(video) => video.videoName === task.submissions[i].title
		);
		let temp = {
			key: i,
			taskId: task._id,
			submissionId: task.submissions[i]._id,
			videoName: task.submissions[i].title,
			videoId: video.videoId,
			patientStutter: task.submissions[i].patientStutter || "",
			patientFluency: task.submissions[i].patientFluency || "",
			patientRemark: task.submissions[i].patientRemark || "No Patient Remark",
			therapistStutter: task.submissions[i].therapistStutter || "",
			therapistFluency: task.submissions[i].therapistFluency || "",
			therapistRemark:
				task.submissions[i].therapistRemark || "No Therapist Remark",
			recordingLink: task.submissions[i].recordingLink || "",
		};
		tempData.push(temp);
	}
	return tempData;
}

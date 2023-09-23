import request from "@/utils/request.js";
/**
 * 预约详情
 * 
 */
export function appointmentDetails(data) {
	return request.get('App.Booked.Details', data, {
		noAuth: true
	});
}
/**
 * 医生详情
 * 
 */
export function getDoctorDetails(data) {
	return request.get('App.Booked.Details', data, {
		noAuth: true
	});
}

/**
 * 获取医生列表
 * @returns {*}
 */
export function doctorsListapi() {
  return request.get("App.Booked.AppointmentList", {
		noAuth: true
	});
}

/**
 * 预约列表
 * @returns {*}
 */
export function subscribeList(data) {
	return request.get("App.Booked.Reservedlist", data, {

	});
}
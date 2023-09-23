import request from "@/utils/request.js";
/**
 * 图文问诊记录顶部详情
 */
export function inquiryDetail(data) {
  return request.get("App.Booked.Userinfo",data,{ noAuth : true});
}
/**
 * 【图文问诊沟通记录：】获取所有问诊记录
 * 
 */
export function getPicTextAllLst(data) {
  return request.get("App.Booked.Inquirylist",data,{ noAuth : true});
}
/**
 * 医生列表
 */
export function getDoctorList() {
  return request.get("App.Booked.Inquiry",{ noAuth : true});
}
/**
 * 医生详情[传参医生id]
 */
export function getDoctorDetail(data) {
  return request.get("App.Booked.InquiryDetails",data,{ noAuth : true});
}
/**
 * 医生-关注
 */
export function doctorFollow(data) {
  return request.post("App.Booked.Collect",data,{ noAuth : true});
}
/**
 * 医生-取消关注
 */
export function doctorDelFollow(data) {
  return request.post("App.Booked.DeleteCollect",data,{ noAuth : true});
}
/**
 * 医生-关注列表
 */
export function getFollowList(data) {
  return request.get("App.Booked.Collectlist",data,{ noAuth : true});
}
/**
 * 图文问诊-创建订单
 */
export function createPicTextOrder(data) {
  return request.post("App.Order.Create",data,{ noAuth : true});
}
/**
 * 在线问诊-创建订单
 */
export function createOnlineOrder(data) {
  return request.post("App.Order.Create",data,{ noAuth : true});
}
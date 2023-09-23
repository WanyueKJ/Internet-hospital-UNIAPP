import request from "@/utils/request.js";

/**
 * 获取首页数据
 */
export function getHomeData(){
	return request.get("App.Index.Index")
}

/**
 * 获取文章列表
 */
export function articleList(data) {
  return request.get("App.Health.HealthMore",data,{ noAuth : true});
}

/**
 * 获取文章详情
 */
export function articleDetail(data) {
  return request.get(`App.Health.Details`,data,{ noAuth : true});
}
/**
 * 文章收藏
 */
export function articleCollect(data) {
  return request.post("App.Health.Collect",data,{ noAuth : true});
}
/**
 * 文章取消收藏
 */
export function articleDelCollect(data) {
  return request.post("App.Health.DeleteCollect",data,{ noAuth : true});
}
/**
 * 文章收藏-列表
 */
export function articleCollectList(data) {
  return request.get("App.Health.UserCollectH",data,{ noAuth : true});
}
/**
 * 获取视频列表
 */
export function videoList(data) {
  return request.get("App.Health.VideoMore",data,{ noAuth : true});
}
/**
 * 获取视频详情
 */
export function videoDetail(data) {
  return request.get("App.Health.Details",data,{ noAuth : true});
}

/**
 * 视频收藏-列表
 */
export function videoCollectList(data) {
  return request.get("App.Health.UserCollectV",data,{ noAuth : true});
}

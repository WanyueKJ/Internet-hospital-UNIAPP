// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2021 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import {
	HTTP_REQUEST_URL,
	HEADER,
	TOKENNAME
} from '@/config/app';



function toLogin() {
	
	uni.showToast({
		title: '请登录',
		icon: 'none',
		duration: 1000
	});
}

/**
 * 发送请求
 */
function baseRequest(url, method, data, {
	noAuth = false,
	noVerify = false
}) {
	let Url = HTTP_REQUEST_URL,
		header = HEADER;

	
	if(!data){
		data = {}
	}
	if(uni.getSystemInfoSync().platform == 'ios'){
		data.source = 2
	}else{
		data.source = 1
	}
	let user = uni.getStorageSync('userinfo')
	if (user && user.id>0) {
		data.uid = user.id
		data.token = user.token
	}
	if (user &&user.token) header[TOKENNAME] = 'Bearer ' + user.token;
	return new Promise((reslove, reject) => {
		uni.request({
			url: Url + '/api/?s=' + url,
			method: method || 'GET',
			header: header,
			data: data || {},
			success: (res) => {
				
				console.log(Url + '/api/?s=' + url, data,res.data);
				if (noVerify){
					reslove(res.data, res);
				}
				else if (res.data.ret == 200){
					if(res.data.data.code == 0 || res.data.data.code == 1002){
						reslove(res.data, res);
					}else if (!res.data.data.code) {
						reslove(res.data, res);
					} else if (res.data.data.code == 700) {
						uni.clearStorageSync('userinfo')
						reslove(res.data, res);
						//toLogin();
						
					} else {
						reject(res.data.data.msg)
					}
				}
				else if ([410000, 410001, 410002, 40000].indexOf(res.data.ret) !== -1) {
					toLogin();
					reject(res.data);
				} else if (res.data.ret == 501) {
					uni.reLaunch({
						url: '/pages/error/index'
					})
					reject(res.data);
				} else
					reject(res.data.message || '系统错误');
			},
			fail: (message) => {
				// console.log("rk===>[url22]" + Url + '/api/' + url);
				console.log("rk===>[zheli222]" + JSON.stringify(message));
				reject('请求失败');
			}
		})
	});
}

const request = {};

['options', 'get', 'post', 'put', 'head', 'delete', 'trace', 'connect'].forEach((method) => {
	request[method] = (api, data, opt) => baseRequest(api, method, data, opt || {})
});



export default request;

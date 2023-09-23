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
	TOKENNAME,
	HTTP_REQUEST_URL
} from '../config/app.js';
import md5_js from './md53.js'

import {
	pathToBase64
} from '@/plugin/image-tools/index.js';


export default {
	sort2url(arr1) {
		var newkey = Object.keys(arr1).sort();
		var newObj = {};
		for (var i = 0; i < newkey.length; i++) {
			newObj[newkey[i]] = arr1[newkey[i]];
		}
		var text = "";
		for (var index in newObj) {
			text = text + index + "=" + newObj[index] + "&";
		}
		text = text.substr(0, text.length - 1);
		text += '&' + '400d069a791d51ada8af3e6c2979bcd7';
		return md5_js(text);
	},
	/**
	 * 字符串截取
	 * @obj 传入的数据
	 * @state 0 某个参数之前 1某个参数之后
	 * 
	 *
	 * **/
	stringIntercept: function(obj, state, type) {
		var index = obj.lastIndexOf(type);
		if (state == 0) {
			obj = obj.substring(0, index);
		} else {
			obj = obj.substring(index + 1, obj.length);
		}
		return obj;
	},
	/**
	 * opt  object | string
	 * to_url object | string
	 * 例:
	 * this.Tips('/pages/test/test'); 跳转不提示
	 * this.Tips({title:'提示'},'/pages/test/test'); 提示并跳转
	 * this.Tips({title:'提示'},{tab:1,url:'/pages/index/index'}); 提示并跳转值table上
	 * tab=1 一定时间后跳转至 table上
	 * tab=2 一定时间后跳转至非 table上
	 * tab=3 一定时间后返回上页面
	 * tab=4 关闭所有页面跳转至非table上
	 * tab=5 关闭当前页面跳转至table上
	 */
	Tips: function(opt, to_url) {
		if (typeof opt == 'string') {
			to_url = opt;
			opt = {};
		}
		let title = opt.title || '',
			icon = opt.icon || 'none',
			endtime = opt.endtime || 2000,
			success = opt.success;
		if (title) uni.showToast({
			title: title,
			icon: icon,
			duration: endtime,
			success
		})
		if (to_url != undefined) {
			if (typeof to_url == 'object') {
				let tab = to_url.tab || 1,
					url = to_url.url || '';
				switch (tab) {
					case 1:
						//一定时间后跳转至 table
						setTimeout(function() {
							uni.switchTab({
								url: url
							})
						}, endtime);
						break;
					case 2:
						//跳转至非table页面
						setTimeout(function() {
							uni.navigateTo({
								url: url,
							})
						}, endtime);
						break;
					case 3:
						//返回上页面
						setTimeout(function() {
							// #ifndef H5
							uni.navigateBack({
								delta: parseInt(url),
							})
							// #endif
							// #ifdef H5
							history.back();
							// #endif
						}, endtime);
						break;
					case 4:
						//关闭当前所有页面跳转至非table页面
						setTimeout(function() {
							uni.reLaunch({
								url: url,
							})
						}, endtime);
						break;
					case 5:
						//关闭当前页面跳转至非table页面
						setTimeout(function() {
							uni.redirectTo({
								url: url,
							})
						}, endtime);
						break;
				}

			} else if (typeof to_url == 'function') {
				setTimeout(function() {
					to_url && to_url();
				}, endtime);
			} else {
				//没有提示时跳转不延迟
				setTimeout(function() {
					uni.navigateTo({
						url: to_url,
					})
				}, title ? endtime : 0);
			}
		}
	},
	
	// 获取尺寸
	getRect: function(selector, all = false, context) {
		return new Promise((resolve, reject) => {
			let qurey = uni.createSelectorQuery()
			if (context) {
				qurey = uni.createSelectorQuery().in(context)
			}
			qurey[all ? 'selectAll' : 'select'](selector)
				.boundingClientRect(function(rect) {
					if (all && Array.isArray(rect) && rect.length) {
						return resolve(rect)
					}
					if (!all && rect) {
						return resolve(rect)
					}
					reject('找不到元素')
				})
				.exec()
		})
	},
	formatRichText(html) {
		let newContent = html.replace(/<img[^>]*>/gi, function(match, capture) {
			match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
			match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
			match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
			return match;
		});
		newContent = newContent.replace(/style="[^"]+"/gi, function(match, capture) {
			match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi,
				'max-width:100%;');
			return match;
		});
		newContent = newContent.replace(/<br[^>]*\/>/gi, '');
		newContent = newContent.replace(/\<img/gi,
			'<img style="max-width:100%;height:auto;display:inline-block;margin:10rpx auto;"');
		return newContent;
	},
	
	/*
	 * 合并数组
	 */
	SplitArray(list, sp) {
		if (typeof list != 'object') return [];
		if (sp === undefined) sp = [];
		for (var i = 0; i < list.length; i++) {
			sp.push(list[i]);
		}
		return sp;
	},
	getTime() {
		return new Date().getTime(); //1603009495724,精确到毫秒
	},
	
	decypt(code) {
		var newcode = '';
		var str = '1ecxXyLRB.COdrAi:q09Z62ash-QGn8VFNIlb=fM/D74WjS_EUzYuw?HmTPvkJ3otK5gp&*'
		for (var i = 0; i < code.length; i++) {
			var codeIteam = code[i];
			for (var j = 0; j < str.length; j++) {
				var stringIteam = str[j];
				if (codeIteam == stringIteam) {
					if (j == 0) {
						newcode += str[str.length - 1];
					} else {
						newcode += str[j - 1];
					}
				}
			}
		}
		return newcode;
	}
	
	

}
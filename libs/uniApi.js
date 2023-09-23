// import uniCopy from '@/js_sdk/xb-copy/uni-copy.js'; // 拷贝功能插件
// import compressImage from './compressImage.js'; // 解决图片旋转90°问题
// const device = uni.getSystemInfoSync();
// console.log("device:======================== " + JSON.stringify(device));
/*
 参数说明
 @url
 要跳转的目标地址
 @opt
 要传给目标地址的参数
 可在目标页面的onLoad生命周期函数的第一个参数中获取
*/

// 压栈跳转页面
export function navigateTo(type, url, opt) {
	// H5端页面跳转目前不支持动画 (浏览器性能限制)
	let toUrl = url;
	let api = 'navigateTo';
	toUrl = opt ? toUrl + '?' + convertObj(opt) : toUrl;

	switch (type) {
		case 1:
			api = 'navigateTo';
			break;
		case 2:
			api = 'redirectTo'; // 关闭当前页,跳转应用内某个页面
			break;
		case 3:
			api = 'reLaunch'; // 关闭所有页面,打开到应用内某个页面
			break;
		case 4:
			api = 'switchTab'; //跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面。
			break;
		default:
			api = 'navigateTo'
			break;
	}
	uni[api]({
		url: toUrl,
		animationType: 'slide-in-right',
		animationDuration: 200
	});
}

// 关闭当前页面并返回上一页面  delta 标识返回几层
export function navigateBack(delta) {
	uni.navigateBack({
		delta: delta
	});
}

// setStorage 将数据存入缓存
export function setStorage(key, val) {
	if (typeof val == 'string') {
		uni.setStorageSync(key, val);
		return val
	}
	uni.setStorageSync(key, JSON.stringify(val));
}

// getStorage 从缓存中读取数据
export function getStorage(key) {
	let uu = uni.getStorageSync(key);
	try {
		if (typeof JSON.parse(uu) != 'number') {
			uu = JSON.parse(uu);
		}
	} catch (e) {}
	return uu;
}
// 删除缓存中的数据
export function removeStorage(key) {
	if (key) {
		uni.removeStorageSync(key);
	}
}
// 将缓存中的数据清空
export function clearStorage() {
	try {
		uni.clearStorageSync();
	} catch (e) {
		throw new Error('处理失败');
	}
}
// 显示Toast
/*
@title 最多汉字数量7个
@icon success loading none 
*/
export function Toast(title, icon = 'none', obj = {}, duration = 800) {
	let toastData = {
		title: title,
		duration: duration,
		position: 'center',
		mask: true,
		icon: icon ? icon : 'none',
		...obj
	};
	uni.showToast(toastData);
}
/*
显示loading提示框,需要手动隐藏
*/
export function Loading(title = '正在加载...', obj = {}) {
	uni.showLoading({
		title: title,
		mask: true,
		...obj
	});
}
// 隐藏loading
export function hideLoading() {
	try {
		uni.hideLoading();
	} catch (e) {
		//TODO handle the exception
		throw new Error('处理失败');
	}
}
// 模态框 
/*
确定取消按钮的文字颜色可修改
obj 对象中传入 cancelColor : rgb 即可修改取消按钮颜色
obj 对象中传入 confirmColor : rgb 即可修改确认按钮颜色
*/
export function Modal(title = '提示', content = '这是一个模态弹窗!', obj = {
	showCancel: true,
	cancelText: '取消',
	confirmText: '确定'
}) {
	// #ifdef APP-PLUS
	obj.cancelText = '确定';
	obj.confirmText = '取消';
	// #endif
	return new Promise((reslove, reject) => {
		uni.showModal({
			title: title,
			content: content,
			...obj,
			success: (res) => {
				if (res.confirm) {
					reslove()
				}
				if (res.cancel) {
					reject()
				}
			}
		});
	})
}
/*
显示操作菜单
@itemList 操作菜单数组
@itemColor 文字颜色
*/
export function ActionSheet(itemList, itemColor = "#000000") {
	return new Promise((reslove, reject) => {
		uni.showActionSheet({
			itemList: itemList,
			itemColor: itemColor,
			success: (res) => {
				reslove(res.tapIndex);
			},
			fail: function(res) {
				reject(res.errMsg);
			}
		});
	})
}
//将页面滚动到目标位置。
export function ScrollTo(ScrollTop) {
	uni.pageScrollTo({
		scrollTop: ScrollTop,
		duration: 300
	})
}

// 获取用户信息
export function GetUserInfo() {
	return new Promise((reslove, reject) => {
		uni.getUserInfo({
			success(res) {
				console.log(res);
				reslove(res);
			},
			fail(rej) {
				reject(rej);
			}
		})
	})
}

// 获取用户授权信息
export function Authorize(scoped = 'scope.userInfo') {
	return new Promise((reslove, reject) => {
		uni.authorize({
			scope: scoped,
			success(res) {
				reslove(res);
			},
			fail(rej) {
				reject(rej);
			}
		})
	})
}

// 将对象转换成使用 & 连接的字符串
export function convertObj(opt) {
	let str = '';
	let arr = [];
	Object.keys(opt).forEach(item => {
		arr.push(`${item}=${opt[item]}`);
	})
	str = arr.join('&');
	return str;
}
// 节流函数
// 节流函数
export function throttle(fn, delay) {
	var lastArgs;
	var timer;
	var delay = delay || 200;
	return function(...args) {
		lastArgs = args;
		if(!timer){
			timer = setTimeout(()=>{
				timer = null;
				fn.apply(this, lastArgs);
			}, delay);
		}
	}
}

// 调起相机
export function chooseImage(count) {
	return new Promise((reslove, reject) => {
		uni.chooseImage({
			count: count, //默认9
			sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], //从相册选择
			success: (res) => {
				reslove(res);
				// const tempFilePaths = res.tempFilePaths;
				// let tempPathList = [];
				// for (let i = 0; i < tempFilePaths.length; i++) {
				// 	const path = tempFilePaths[i];
				// 	const src = await compressImageHandler(path)
				// 	tempPathList.push(src);
				// }
				// reslove(tempPathList);
			},
			fail: (rej) => {
				reject(rej);
			}
		});
	})
}

// function compressImageHandler(src) {
// 	// console.log('platform===' + device.platform)
// 	const tempPath = compressImage(src, device.platform);
// 	// console.log('tempPath-----' + tempPath);
// 	return tempPath
// }
//序列化对象和数组
export function serialize(data) {
	if (data != null && data != '') {
		try {
			return JSON.parse(JSON.stringify(data));
		} catch (e) {
			if (data instanceof Array) {
				return [];
			}
			return {};
		}
	}
	return data;
}
Date.prototype.format = function(fmt) {
	let o = {
		'M+': this.getMonth() + 1, //月份
		'd+': this.getDate(), //日
		'h+': this.getHours(), //小时
		'm+': this.getMinutes(), //分
		's+': this.getSeconds(), //秒
		'q+': Math.floor((this.getMonth() + 3) / 3), //季度
		S: this.getMilliseconds() //毫秒
	};

	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, String(this.getFullYear()).substr(4 - RegExp.$1.length));
	}
	for (let k in o) {
		if (new RegExp('(' + k + ')').test(fmt)) {
			fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(String(o[k]).length));
		}
	}
	return fmt;
};

//格式化日期
export function formatDate(nS, format) {
	//日期格式化
	if (!nS) {
		return '';
	}
	format = format || 'yyyy-MM-dd hh:mm:ss';
	return new Date(nS).format(format);
}

// 图片转base64
export function pathToBase64(path) {
	return new Promise(function(resolve, reject) {
		if (typeof window === 'object' && 'document' in window) {
			if (typeof FileReader === 'function') {
				var xhr = new XMLHttpRequest()
				xhr.open('GET', path, true)
				xhr.responseType = 'blob'
				xhr.onload = function() {
					if (this.status === 200) {
						let fileReader = new FileReader()
						fileReader.onload = function(e) {
							resolve(e.target.result)
						}
						fileReader.onerror = reject
						fileReader.readAsDataURL(this.response)
					}
				}
				xhr.onerror = reject
				xhr.send()
				return
			}
			var canvas = document.createElement('canvas')
			var c2x = canvas.getContext('2d')
			var img = new Image
			img.onload = function() {
				canvas.width = img.width
				canvas.height = img.height
				c2x.drawImage(img, 0, 0)
				resolve(canvas.toDataURL())
				canvas.height = canvas.width = 0
			}
			img.onerror = reject
			img.src = path
			return
		}
		if (typeof plus === 'object') {
			plus.io.resolveLocalFileSystemURL(getLocalFilePath(path), function(entry) {
				entry.file(function(file) {
					var fileReader = new plus.io.FileReader()
					fileReader.onload = function(data) {
						resolve(data.target.result)
					}
					fileReader.onerror = function(error) {
						reject(error)
					}
					fileReader.readAsDataURL(file)
				}, function(error) {
					reject(error)
				})
			}, function(error) {
				reject(error)
			})
			return
		}
		if (typeof wx === 'object' && wx.canIUse('getFileSystemManager')) {
			wx.getFileSystemManager().readFile({
				filePath: path,
				encoding: 'base64',
				success: function(res) {
					resolve('data:image/png;base64,' + res.data)
				},
				fail: function(error) {
					reject(error)
				}
			})
			return
		}
		reject(new Error('not support'))
	})
}




/*
@value 要拷贝的内容
*/
// export function copyText(value) {
// 	// 条件编译，以下代码仅在H5出现
// 	//#ifdef H5
// 	return new Promise((reslove, reject) => {
// 		uniCopy({
// 			content: value,
// 			success: (res) => {
// 				reslove(res);
// 			},
// 			error: (e) => {
// 				reject(res)
// 			}
// 		})
// 	})

// 	//#endif

// 	// 以下代码在除H5以外的平台出现
// 	//#ifndef H5

// 	//#endif
// }

// 获取本周的第一天
export function showWeekFirstDay() {
	var date = new Date();
	var weekday = date.getDay() || 7; //获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7
	date.setDate(date.getDate() - weekday + 1); //往前算（weekday-1）天，年份、月份会自动变化
	return formatDate(date, 'yyyy-MM-dd');
}



// 获取本月第一天
export function showMonthFirstDay() {
	var MonthFirstDay = new Date().setDate(1);
	return formatDate(new Date(MonthFirstDay).getTime(), 'yyyy-MM-dd');
}

var now = new Date(); //当前日期 
// var nowDayOfWeek = now.getDay(); //今天本周的第几天 
// var nowDay = now.getDate(); //当前日 
var nowMonth = now.getMonth(); //当前月 
var nowYear = now.getYear(); //当前年 
nowYear += (nowYear < 2000) ? 1900 : 0; //
//获得本季度的开始月份 
function getQuarterStartMonth() {
  var quarterStartMonth = 0;
  if(nowMonth < 3) {
    quarterStartMonth = 0;
  }
  if(2 < nowMonth && nowMonth < 6) {
    quarterStartMonth = 3;
  }
  if(5 < nowMonth && nowMonth < 9) {
    quarterStartMonth = 6;
  }
  if(nowMonth > 8) {
    quarterStartMonth = 9;
  }
  return quarterStartMonth;
}

//或的本季度的结束日期 
//获得本季度的开始日期 
export function getQuarterStartDate() {
	var quarterStartDate = new Date(nowYear, getQuarterStartMonth(), 1);
	return formatDate(quarterStartDate, 'yyyy-MM-dd');
}
// 删除数组中重复数据
export function unique(data) {
  data = data || [];
  var n = {};//存放新的数据
  for(var i = 0; i < data.length; i++) {
    var v = JSON.stringify(data[i]);
    if(typeof (v) == "undefined") {
      n[v] = 1;
    }
  }
  data.length = 0;
  for(var i in n) {
    data[data.length] = i;
  }
  return data;
}
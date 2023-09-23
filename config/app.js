
let openPlantGrass = '-openPlantGrass-'

// 网络接口修改此字符 
// 聊天接口修改此字符 小程序聊天要求wss 例如：wss://mer.crmeb.net


let httpApi = 'https://kyhospital.sdwanyue.com'
let wsApi = 'wss://kyhospital.sdwanyue.com:9500/'


module.exports = {
	// 请求域名 格式： https://您的域名
	HTTP_REQUEST_URL: httpApi,
	VUE_APP_WS_URL: `${wsApi}?`,
	openPlantGrass: openPlantGrass,
	HEADER: {
		'content-type': 'application/json',
		'Form-type': 'app',
	},
	// 回话密钥名称 请勿修改此配置
	TOKENNAME: 'X-Token',
	// 缓存时间 0 永久
	EXPIRE: 0,
};

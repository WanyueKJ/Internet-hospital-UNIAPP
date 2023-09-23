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
	VUE_APP_WS_URL
} from "@/config/app.js";
const Socket = function(fromid,toid,orderid) {
	let wsUrl = `${VUE_APP_WS_URL}oid=${orderid}&tid=${toid}&fid=${fromid}`
	console.log(wsUrl)
	this.ws = uni.connectSocket({
		url:wsUrl,
		header: {
			'content-type': 'application/json'
		},
		method: 'GET',
		success: (res) => {
			console.log(res, 'success');
		}
	});
	this.ws.onOpen(this.onSocketOpen.bind(this))
	this.ws.onError(this.onError.bind(this));
	this.ws.onMessage(this.onMessage.bind(this))
	this.ws.onClose(this.onClose.bind(this));
	// this.ws.close(this.close.bind(this));
};



Socket.prototype = {
	// close() {
	//   clearInterval(this.timer);
	//   this.ws.close();
	// },
	onSocketOpen: function(my) {
		console.log('rk=====>socket_open');
		this.init();
		uni.$emit("socket_open");
	},
	init: function() {
		var that = this;
		this.timer = setInterval(function() {
			that.send({
				type: "ping"
			});
		}, 10000);
	},
	send: function(data) {
		// console.log(data)
		let datas = JSON.stringify(data)
		return uni.sendSocketMessage({
			data: datas
		});
	},
	onMessage: function(res) {
		//console.log(JSON.parse(res.data), 'onMessage')
		let data = JSON.parse(res.data)
		if(data.status == 1){
			uni.$emit('chat',data.data)
		}
	},

	onClose: function() {
		uni.closeSocket();
		clearInterval(this.timer);
		uni.$emit("socket_close");
	},
	onError: function(e) {
		console.log(e);
		uni.$emit("socket_error", e);
	},
	close: function() {
		uni.closeSocket();
	}
};

Socket.prototype.constructor = Socket;

export default Socket;

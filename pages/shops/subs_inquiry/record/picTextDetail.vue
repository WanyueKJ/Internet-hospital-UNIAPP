<template>
	<view class="box">
		<view class="content">
			<view class="current-title">
				<view class="title-img">
					<image src="@/static/images/f.png" mode=""></image>
				</view>
				<view class="name">{{name}}</view>
			</view>

			<view class="current-content">
				<text>{{patient_info.remark}}</text>
			</view>
			<view class="current-footer">
				<view class="footer-left">
					发布于{{patient_info.addtime}}
				</view>
				<view class="footer-right">
					诊金￥{{patient_info.money}}
				</view>
			</view>
		</view>

		<view class="xq">
			<view class="xq-title">问诊详情</view>
			<!-- <scroll-view scroll-y="true" style="height: 100%; overflow: hidden;" :scroll-top="scrollTop"
				scroll-with-animation="true" v-if="itemList.length>0"> -->
				<view class="chat" ref="chat" v-if="itemList.length>0">
					<view class="list-item" v-for="(item,index) in itemList">
						<view class="xq-content1" :class="item.fid == 0 ? 'doctor-bg':'user-bg' ">
							<view class="content1-row">
								<view class="content1-row1">
									<image src="@/static/images/f.png" mode=""></image>
									<block v-if="item.fid==0">
										<view class="row1">{{doctorInfo.name}}</view>
										<view class="row2">{{doctorInfo.professional}}</view>
									</block>
									<block v-else>
										<view class="row1">{{name}}</view>
									</block>
								</view>
								<view class="content1-row2">{{item.addtime}}</view>
							</view>
							<view class="content1-reply">{{item.content}}</view>
							
						</view>
					</view>
				
				</view>
				
			<!-- </scroll-view> -->
			<view class="nodata" v-else>
				<emptyPage title="暂无数据～"></emptyPage>
			</view>
		</view>
		<view class="footer" :class="conversation_status == 1?'tool-hidden':'' ">
			<view  class="close" @click="clickEnd">
				<text class="yyfont yy-jieshu"></text>结束问诊回复
			</view>
			
			<view class="fabiao">
				<view class="input">
					<input v-model="contentDes" placeholder="你想说的话..." placeholder-class="placeholder" @input="inputChange"  @focus="focus" @blur="blur" @keyboardheightchange="keyboardheightchange"/>
				</view>
				<button @click="sendQuestion">发表</button>
			</view>
			<view class="yy-safe-bh safe-bg" :class="keyActive?'safe-hidden':''"> </view>
		</view>
		
	
	</view>
</template>

<script>
	import Socket from "@/libs/chat";
	import emptyPage from '@/components/emptyPage.vue';
	import {
		inquiryDetail,
		getDoctorDetail
	} from '@/api/inquiry.js';
	import {
		mapGetters
	} from "vuex";
	import { getNowFormateTime } from "@/utils/format.js";
	export default {
		components:{
			
			emptyPage
		},
		computed: {
			
		},
		data() {
			return {
				conversation_id: '',//订单id
				conversation_status:0,//0-进行中 1-已完成
				patient_info:{},	// 患者详情
				name:'',
				socket:null,
				doctor_id:0,//医生id
				doctorInfo:{},
				isBack: false,
				itemList: [],
				contentDes:'',
				keyActive:false,
				scrollTop: 0, //滚动距离
				uid:0,
				windowH:0
			}
		},
		beforeDestroy() {
			uni.$off(["chat", "socket_error", "socket_close","err_tip"])
		},
		onUnload() {
			this.wsEnd();
		},
		onLoad(ops) {
			let user = uni.getStorageSync('userinfo')
			if(user && user.id>0){
				this.uid = user.id
			}
			
			let param = JSON.parse(ops.item)
			this.patient_info = param
			this.conversation_id = param.id;//订单id
			this.doctor_id = param.doctor_id
			this.conversation_status = param.status || 0;
			this.getInquiryDetail()
			this.doctorDetial()
			
			
		},
		mounted() {
			let that = this
			
			uni.$on(["chat"], data => {
				
				 console.log("rk===>[收到消息]" + JSON.stringify(data));
				// 
				// || typeof data =='object'
				if(data instanceof Array && data.length > 0){
					that.itemList = that.itemList.concat(data)
				}else if(data instanceof Array && data.length == 0){
					
				}else{
					that.itemList.push(data)
				}

				
			});
			uni.$on("socket_error", () => {
				if (!that.isBack) {
					that.wsStart()
				}
			});
			uni.$on("err_tip", data => {
				if (!this.isBack) {
					uni.showModal({
						title: '提示',
						content: data,
						success: function(res) {
							if (res.confirm) {
								console.log('用户点击确定');
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
				}
			});
			uni.$on("socket_close", () => {
				if (!this.isBack && this.conversation_status == 0) {
					uni.showModal({
						title: '提示',
						content: '连接断开，是否重新连接',
						success: function(res) {
							if (res.confirm) {
								that.wsStart()
							} else if (res.cancel) {
								uni.navigateBack();
							}
						}
					});
				}
			})
			this.wsStart();
		},
		methods: {
			// ws连接
			wsStart() {
				this.socket = new Socket(this.uid,0,this.conversation_id);
				// this.height();
			},
			// ws关闭
			wsEnd() {
				let that = this;
				that.isBack = true
				that.socket && that.socket.onClose();
				that.socket = null
			},
			/**
			 * 获取医生资料
			 */
			doctorDetial() {
				let where = {
					'id': this.doctor_id,
				}
				getDoctorDetail(where).then(res => {
					this.doctorInfo = res.data.info;

				});
			},
			/**
			 * 详情
			 */
			getInquiryDetail(){
				let where = {
					'oid':this.conversation_id
				}
				let that = this
				inquiryDetail(where).then(res => {
					that.name = res.data.info.name;
				});
			},
			
			
			/**
			 * 发布问题
			 */
			sendQuestion(){
				if(this.contentDes.length<=0){
					return this.$util.Tips({
						title:'请输入你想要提问的问题'
					});
				}
				
				// this.height();
				let where = {"fid":this.uid,
						"tid":0,
						"oid":this.conversation_id,
						'content':this.contentDes
						}
				// console.log(where)
				this.socket.send(where)
				where.addtime = getNowFormateTime()
				this.itemList.push(where)
				this.contentDes = ''
				
			},
			
			
			/**
			 * 结束问诊【用户】
			 */
			clickEnd() {
				
				let that = this;
				uni.showModal({
					title: '提示',
					content: '是否结束问诊?',
					success: function(res) {
						if (res.confirm) {
							that.stopChat();
						} else if (res.cancel) {
							console.log('fouding')
						}
					}
				});
			},
			stopChat(){
				let that = this;
				let where = {"fid":this.uid,
							"tid":0,
							"oid":this.conversation_id,
							'content':'close'
							}
							
				this.socket.send(where)
				this.conversation_status = 1
				
			},
			
			/**
			 * 键盘
			 */
			inputChange(){
				this.keyActive = true;
				//console.log('rk==>[inputChange]'+this.keyActive)
			
			},
			focus() {
				setTimeout(()=>{
					this.keyActive = true;
					//console.log('rk==>[focus]'+this.keyActive)
				},250);
			},
			blur(){
				this.keyActive = false;
				//console.log('rk==>[blur]'+this.keyActive)
			},
			keyboardheightchange(e){
				//console.log('rk==>[change]'+JSON.stringify(e.detail))
			}
			
		},

	}
</script>

<style lang="scss">
	page {
		background-color: #f4f4f4
	}

	.content {
		background-color: #fff;
		padding: 20rpx 30rpx;
		margin: 40rpx 20rpx;

		.current-title {
			display: flex;
			flex-direction: row;
			justify-content: start;
			align-items: center;

			.title-img {
				width: 80rpx;
				height: 80rpx;
				background-color: blue;
				border-radius: 50%;
				margin-right: 10rpx;
				overflow: hidden;
			}
			.name {
				font-size: $yy-title-big-font;
				font-weight: bold;
				margin-left: 10rpx;
			}
			image {
				width: 100%;
				height: 100%;
			}

		}

		.current-content {
			padding-top: 10rpx;

			text {
				font-size: 26rpx;
				color: #000;
			}
		}
		.guid-content {
			margin: 20rpx 0 0 0;
			font-weight: bold;
		}
		
		
		
		.current-footer {
			padding-top: 30rpx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			color: #999;
		}
	}

	.content-img-box {
		display: flex;
		flex-wrap: wrap;
		.content-img {
			position: relative;
			display: flex;
			justify-content: center;
			flex-wrap: wrap;
			margin: 30rpx 0rpx 20rpx 0;
			width: 33%;
			height: 158rpx;
	
			image {
				width: 158rpx;
				height: 158rpx;
			}
			&:nth-child(3n) {
				margin-right: 0;
			}
		}
	}

	.xq {
		margin: -20rpx 30rpx;
		margin-bottom: 200rpx;

		.xq-title {
			color: #36cf89;
		}
		.user-bg {
			background-color: #fff;
		}
		.doctor-bg {
			background-color: #f2f6ff;
		}
		.xq-content1 {
			margin-top: 20rpx;
			padding: 10rpx 10rpx;

			.content1-row {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				padding: 15rpx 10rpx;

				.content1-row1 {
					display: flex;
					flex-direction: row;
					align-items: center;

					image {
						width: 80rpx;
						height: 80rpx;
						border-radius: 50%;
						background-color: #36cf89;
					}

					.row1 {
						font-weight: 600;
						padding-left: 20rpx;
					}

					.row2 {
						font-size: 20rpx;
						color: #999;
						padding-left: 10rpx;
					}
				}

				.content1-row2 {
					font-size: 20rpx;
				}
			}

			.content1-reply {
				color: #999;
				font-size: 26rpx;
				padding: 10rpx 10rpx;
			}
		}
	}
	.tool-hidden {
		display: none;
	}
	.footer {
		position: fixed;
		bottom: 0;
		width: 100%;

		.close {
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: #ff1717;
			height: 50rpx;
			width: 200rpx;
			color: #fff;
			font-size: 24rpx;
			border-radius: 10rpx;
			margin-bottom: 15rpx;
		}

		.img-area-box {
			background-color: #fff;
			height: 130rpx;
			width: 100%;
			.show-img-box {
				width: 750rpx;
				height: 100%;
				white-space: nowrap;
				display: flex;
				padding-left: 10rpx;
				.show-content-img {
					position: relative;
					.del {
						position: absolute;
						top: -10rpx;
						right: 0;
					}
					
					display: inline-block;
					margin: 15rpx 0rpx 0rpx 0;
					width: 115rpx;
					height: 115rpx;
					image {
						width: 90%;
						height: 90%;
					}
				}
			}
		}

		.fabiao {
			width: 100%;
			height: 100rpx;
			display: flex;
			flex-direction: row;
			background-color: #e2e2e2;
			align-items: center;
			justify-content: space-evenly;
			
			.iconfont {
				font-size: 66rpx;
			}
			.input {
				width: 70%;
				background-color: #fff;
				height: 70rpx;
				line-height: 70rpx;
				border-radius: 40rpx;
				font-size: 26rpx;
				display: flex;
				align-items: center;
				padding: 0 30rpx;

				input {
					width: 100%;
					height: 100%;
				}
			}

			button {
				width: 15%;
				height: 70rpx;
				line-height: 70rpx;
				border-radius: 50rpx;
				font-size: 26rpx;
				background-color: #36cf89;
				color: #fff;

			}
		}

	}
	.footer-safe {
		height: calc(170rpx + constant(safe-area-inset-bottom));
		height: calc(170rpx + env(safe-area-inset-bottom));
	}
	.footer-safe-img {
		height: calc(300rpx + constant(safe-area-inset-bottom));
		height: calc(300rpx + env(safe-area-inset-bottom));
	}
	.safe-bg {
		background-color: #e2e2e2;
	}
	.safe-hidden {
		display: none;
	}
</style>

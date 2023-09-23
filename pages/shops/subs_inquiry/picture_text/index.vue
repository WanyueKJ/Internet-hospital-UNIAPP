<template>
	<view class="content">
		<view class="item-box">
			<view class="item-left">
				<view class="item-line-v"></view>
				<view class="item-title">患者信息</view>
			</view>
		</view>
		<view class="yy-inquiry-user-info" v-if="patient_info.id" @click="selPatient">
			<view class="user-left">
				<view class="icon">
					<image src="@/static/images/f.png" mode="aspectFill"></image>
				</view>
			</view>
			<view class="user-right">
				<view class="info">
					{{ infoFormat(patient_info) }}
				</view>
			</view>
		</view>
		<view class="yy-inquiry-user-sel" v-else @click="selPatient">
			<text class="iconfont icon-jiahao1"></text>
			<view class="">添加患者</view>
		</view>

		<view class="item-box">
			<view class="item-left">
				<view class="item-line-v"></view>
				<view class="item-title">问题描述</view>
			</view>
		</view>
		<view class="des-box">
			<view class="input-box">
				<textarea :placeholder="desPlaceHolder" v-model="desContent" />
			</view>
		</view>
		<view class="item-box">
			<view class="item-left">
				<view class="item-line-v"></view>
				<view class="item-title">服务权益</view>
			</view>
		</view>
		<view class="server-box">
			<view class="server-des" v-for="(item,index) in server_info">
				{{index+1}}. {{item}}
			</view>
		</view>
		<!-- 隐私 -->
		<view class="d-guide" @click="changeAgree">
			<text v-if="agreeValue == 1" class="guide-icon iconfont icon-xuanzhong1"></text>
			<text v-else class="guide-icon iconfont icon-weixuanzhong"></text>
			<view class="guid-title">我已阅读并同意<text class="agreement"
					@click.stop="clickAgree1">《{{ inquiryPost1.name }}》</text><text class="agreement"
					@click.stop="clickAgree2">《{{ inquiryPost2.name }}》</text></view>
		</view>

		<!-- 提交 -->
		<view class="submit-box">
			<view class="price-box">
				<view class='txt'>￥</view>
				<view class='txt txt1'>{{doctor_price}}</view>
			</view>
			<view :class="submitEnable ? 'submit-btn':'submit-btn unenable' " @click="clickSubmit">立即支付</view>
		</view>
		<view class="yy-safe-bh"></view>
		<!-- 支付弹窗 -->
		<payment :payMode="payMode" :pay_close="pay_close" @onChangeFun="onChangeFun" :order_id="pay_order_id"
			:totalPrice="doctor_price" :order_type="order_type" :wxConfig='wxConfig'></payment>

	</view>
</template>

<script>
	let app = getApp();
	import {
		mapGetters
	} from "vuex";

	import {
		createOnlineOrder
	} from '@/api/inquiry.js';
	import { getNowFormateTime } from "@/utils/format.js";
	import payment from "@/components/payment";

	import {
		userinfoFormat,
		userBodyStataeFormat
	} from "@/utils/format.js";

	export default {
		components: {
			payment
		},
		computed: {
			
		},
		data() {
			return {
				doctor_id: '',
				doctor_price: '0',
				server_info:[],
				inquiryPost1:{},
				inquiryPost2:{},
				patient_info: {},
				desPlaceHolder: '请输入',
				desContent: '',
				wxConfig:{},
				agreeValue: 0,
				submitEnable: false,
				pay_close: false,
				pay_order_id: "",
				payMode: [{
						name: "微信支付",
						icon: "icon-weixinzhifu",
						value: "wechat",
						title: "微信快捷支付",
						payStatus: 1
					}
				],
				conversation_id: '',
				order_type:5,//参考payment插件说明
			}
		},
		watch: {
			
			desContent(nVal, oVal) {
				this.checkEnable();
			},
			
		},
		onLoad(ops) {
			let info = JSON.parse(ops.doctorInfo)			
			this.doctor_id = info.id;
			this.doctor_price = info.cost;
			this.server_info = info.notice
			this.inquiryPost1 = info.agreement[0];
			this.inquiryPost2 = info.agreement[1];
			// 监听选择患者
			this.$nextTick(() => {
				let that = this;
				uni.$on('yy_patient_add', data => {
					//console.log('rk===>sel suc:' + JSON.stringify(data))
					that.patient_info = data;
					that.checkEnable();
				});
			});
		},
		onShow() {

		},
		onUnload() {
			uni.$off('yy_patient_add');
		},
		methods: {
			/**
			 * 选择患者
			 */
			selPatient() {
				uni.navigateTo({
					url: '/pages/shops/subs_inquiry/addpatient/index'
				})
			},
			/**
			 * 信息格式化
			 */
			infoFormat(info) {
				return userinfoFormat(info);
			},
			
			changeAgree() {
				if (this.agreeValue == 1) {
					this.agreeValue = 0;
				} else {
					this.agreeValue = 1;
				}
				this.checkEnable();
			},
			clickAgree1() {
				uni.navigateTo({
					url:'/pages/webview/webview?url=' + this.inquiryPost1.host
				})
			},
			clickAgree2() {
				uni.navigateTo({
					url:'/pages/webview/webview?url=' + this.inquiryPost2.host
				})
			},

			/**
			 * 检测提交
			 */
			checkEnable() {
				this.submitEnable = false;

				if (this.desContent.length <= 0) {
					return
				}
				if (this.agreeValue != 1) {
					return
				}
				if (!this.patient_info || !this.patient_info.id) {
					return
				}
				this.submitEnable = true;
			},
			/**
			 * 准备支付
			 */
			clickSubmit() {
				if(!this.submitEnable){
					return
				}
				
				let param = {
					'doctor_id': this.doctor_id,
					'remark': this.desContent,
					'type': 2,//1预约 2问诊
					'userInfo':JSON.stringify(this.patient_info)
				}
				//console.log('rk==>[res]'+JSON.stringify(param));
				let that = this;
				/**
				 * rk_tips
				 * 1.请求创建订单、
				 * 2.弹出支付弹窗
				 * 3.支付完成跳转问诊
				 */
				uni.showLoading({
					title: '请稍后...'
				});
				createOnlineOrder(param).then(res => {
					//console.log(res);
					uni.hideLoading();
					// if (res.ret != 200) {
					// 	return that.$util.Tips({
					// 		title: res.message
					// 	});
					// }
					that.wxConfig = res.data.info[0].wx
					that.pay_order_id = res.data.info[0].orderid;
					//console.log(that.wxConfig)
					that.$set(that, "pay_close", true);
				
				}).catch(err => {
					uni.hideLoading();
					return that.$util.Tips({
						title: err
					});
				});
				
				
			},
			/**
			 * 事件回调
			 *
			 */
			onChangeFun: function(e) {
				console.log('rk==>' + JSON.stringify(e));
				let opt = e;
				let action = opt.action || null;
				let value = opt.value != undefined ? opt.value : null;
				action && this[action] && this[action](value);
			},
			/**
			 * 关闭支付组件
			 *
			 */
			payClose: function() {
				this.pay_close = false;
				this.$emit("payClose");
			},
			/**
			 * 支付失败回调
			 *
			 */
			pay_fail: function() {
				this.pay_close = false;
				this.pay_order_id = "";
			},
			/**
			 * 支付成功回调
			 *
			 */
			pay_complete: function() {
				this.pay_close = false;
				//console.log('rk==>[支付成功哦]');
				// conversation_id
				let param = {'remark':this.desContent,
							'name':this.patient_info.name,
							'money':this.doctor_price,
							'addtime':getNowFormateTime(),
							'id':this.pay_order_id,
							'doctor_id': this.doctor_id}
							
				let that = this;
				setTimeout(() => {
					uni.redirectTo({
						url: '/pages/shops/subs_inquiry/record/picTextDetail?item=' + JSON.stringify(param)
					})
				}, 2000);
			},

		}
	}
</script>

<style lang="scss">
	page {
		flex: 1;
		background-color: #fff;
	}

	.content {
		background-color: #fff;
		padding: 10rpx 30rpx;
	}
	.no-bot {
		padding-bottom: 0 !important;
	}
	.item-box {
		width: 100%;
		padding: 30rpx 0rpx;
		font-size: $yy-title-font;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.item-left {
			display: flex;
			align-items: center;

			.item-line-v {
				width: 10rpx;
				border-radius: 10rpx;
				height: 30rpx;
				background-color: $yy-main-col;
				margin-right: 10rpx;
			}
		}

		.item-right {
			display: flex;
			align-items: center;
			color: $yy-main-col;

			.right-title {
				font-size: 20rpx;
			}

			.iconfont {
				padding-left: 5rpx;
			}
		}
	}

	.des-box {
		background-color: #fafafa;
		// width: 100%;
		border-radius: 10rpx;
		padding: 2rpx 10rpx 10rpx 10rpx;
		// display: flex;

		textarea {
			width: 100%;
			height: 260rpx;
			margin-top: 30rpx;
			padding: 0rpx 20rpx 0;
			font-size: 28rpx;
			line-height: 1.5;
		}

		.quick-box {
			display: flex;
			justify-content: space-around;
			margin: 20rpx 0 10rpx;

			.quick-item {
				background-color: #f5f5f5;
			}
		}
	}

	.d-guide {
		display: flex;
		align-items: center;
		margin: 20rpx 0;
		font-size: $yy-title-font;
	}

	.guide-icon {
		color: $yy-main-col;
	}

	.guid-title {
		margin-left: 5rpx;
	}

	.upload-img {
		display: flex;
		flex-wrap: wrap;

		.img-wrapper {
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

			.iconfont {
				position: absolute;
				right: -15rpx;
				top: -20rpx;
				font-size: 40rpx;
				color: var(--view-theme);
			}

			&:nth-child(3n) {
				margin-right: 0;
			}
		}

		.add-img {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 33%;
			height: 158rpx;
			margin-top: 30rpx;
			margin-bottom: 20rpx;

			.add-item {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 158rpx;
				height: 158rpx;
				background: #F5F5F5;
				border-radius: 10rpx;
				border: 1rpx solid $yy-main-col;
			}

			.iconfont {
				color: $yy-main-col;
				font-size: 55rpx;
			}
		}

		.uplod-des-box {
			width: 66%;
			height: 158rpx;
			margin-top: 30rpx;
			margin-bottom: 20rpx;
			display: flex;
			align-items: flex-start;
			flex-direction: column;
			justify-content: center;
		}
	}

	.server-box {
		padding: 0 15rpx;

		.server-des {
			font-size: 28rpx;
			color: #969696;
		}
	}

	.agreement {
		color: $yy-main-col;
	}

	.submit-box {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		margin: 50rpx 0;

		.price-box {
			display: flex;
			align-items: baseline;

			.txt {
				color: #ff4f00;
			}

			.txt1 {
				font-size: 30px;
				font-weight: bold;
			}
		}

		.submit-btn {
			background-color: $yy-main-col;
			width: 120px;
			height: 80rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #fff;
			border-radius: 100rpx;
		}

		.unenable {
			background-color: $yy-main-light-col;
		}
	}

	// 弹窗
	.pop-box {
		background-color: #fff;
		border-radius: 10rpx;
		width: 600rpx;
		height: 500rpx;

		.pop-title {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 20rpx 0;
		}

		.pop-ex-box {
			margin: 20rpx;
		}

		.ex-desc {
			font-size: 30rpx;
		}
	}
</style>

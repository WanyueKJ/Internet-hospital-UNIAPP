<template>
	<view>
		<view class="tui-actionsheet-class tui-actionsheet" :class="(show ? 'tui-actionsheet-show' : '')">
			<view class="top-box">
				<view class="information">
					<view class="left">
						<image class="images" :src="itemList.img" mode="aspectFill"></image>
					</view>
					<view class="right">
						<view class="item-row">
							<text>医师：</text>
							<text class="small-size">{{ itemList.name }}</text>
						</view>
						<view class="item-row">
							<text>费用：</text>
							<text class="money small-size">{{ itemList.cost }}</text>
						</view>
						<view class="item-row">
							<text>时段：</text>
							<view class="telts small-size">
								<text>{{ itemList.create_time }}</text>
							</view>
						</view>
					</view>
				</view>
				<text class="Tips">请点击下方加号添加身份</text>
				<view class="the_patient">
					<view class="circle" v-if="testdatalist.name != ''" @click="addthepatient">{{ testdatalist.name.substring(0,1) }}
					</view>
					<view v-if="testdatalist.name == ''" class="addtocircle" @click="addthepatient">+</view>
				</view>
				<view class="notice">预约服务须知:</view>
				<view v-for="(item,index) in itemList.notice" :key="index">
					<view class="notice_article">
						{{index+1}}、{{item}}
					</view>
				</view>
			</view>
			
			<view style="color: #ffffff;" class="tui-actionsheet-btn tui-actionsheet-cancel" :hover-stay-time="150"
				@tap="handleClickCancel()">确认预约</view>
		</view>
		<view class="tui-actionsheet-mask" :class="(show ? 'tui-mask-show' : '')" @tap="handleClickMask"></view>

		<payment :payMode="payMode" :pay_close="pay_close" @onChangeFun="onChangeFun" :order_id="pay_order_id"
			:totalPrice="itemList.cost" :order_type="3" :wxConfig='wxConfig'></payment>
	</view>
</template>

<script>
	let app = getApp();
	import payment from "@/components/payment";
	
	import {
		createOnlineOrder
	} from '@/api/inquiry.js';
	export default {
		name: "makeAppointment",
		props: {
			//点击遮罩 是否可关闭
			maskClosable: {
				type: Boolean,
				default: true
			},
			//显示操作菜单
			show: {
				type: Boolean,
				default: false
			},
			itemList: {},
			testdatalist: {},
			//提示文字
			tips: {
				type: String,
				default: ""
			},
			//提示文字颜色
			color: {
				type: String,
				default: "#9a9a9a"
			},
			//提示文字大小 rpx
			size: {
				type: Number,
				default: 26
			},
			//是否需要取消按钮
			isCancel: {
				type: Boolean,
				default: true
			},
			appData: {
				type: Object,
				default: function() {
					return {};
				}
			}
		},
		components: {
			payment
		},
		data() {
			return {
				wxConfig:{},
				key: "",
				pay_close: false,
				pay_order_id: "",
				payMode: [{
						name: "微信支付",
						icon: "icon-weixinzhifu",
						value: "wechat",
						title: "微信快捷支付",
						payStatus: 1
					}],
			};
		},
		created() {
			
		},
		methods: {
			
			handleClickMask() {
				if (!this.maskClosable) return;
				this.$emit("chooseCancel");
			},
			
			handleClickCancel() {
				if (this.testdatalist.name == "") {
					return this.$util.Tips({
						title: "请添加身份信息"
					});
				}
				let param = {
					'doctor_id': this.itemList.id,
					'servicetime':this.itemList.create_time,
					'type': 1,//1预约 2问诊
					'userInfo':JSON.stringify(this.testdatalist)
				}
				//console.log('rk==>[res]'+JSON.stringify(param));
				let that = this;
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
					that.$emit("chooseCancel");
					that.wxConfig = res.data.info[0].wx
					that.pay_order_id = res.data.info[0].orderid;
					that.$set(that, "pay_close", true);		
					
				}).catch(err => {
					uni.hideLoading();
					return that.$util.Tips({
						title: err
					});
				});
			},
			addthepatient() {
				uni.navigateTo({
					url: '/pages/shops/subs_inquiry/addpatient/index'
				})
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
			 * 支付成功回调
			 *
			 */
			pay_complete: function() {
				this.pay_close = false;
				this.pay_order_id = "";
				
				// this.getOrderData();
				// this.getOrderList();
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
			 * 事件回调
			 *
			 */
			onChangeFun: function(e) {

				console.log('rk==>' + JSON.stringify(e));

				let opt = e;
				let action = opt.action || null;
				let value = opt.value != undefined ? opt.value : null;
				action && this[action] && this[action](value);
			}
		}
	};
</script>

<style lang="scss">
	.tishi {
		border: 2upx solid #9c9c9c;
		position: fixed;
		top: 30%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 999;
		width: 360upx;
		height: 100upx;
		background-color: #ffffff;
	}

	.top-box {
		background-color: #ff0000;
		height: 680upx;
		padding: 20upx;
		background-color: #ffffff;

		.information {
			padding-bottom: 10upx;
			border-bottom: 2upx solid #cecece;
			display: flex;

			.left {
				width: 180upx;
				height: 180upx;
				margin-right: 30upx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.right {
				display: flex;
				flex-direction: column;
				justify-content: space-around;

				.item-row {
					display: flex;
					align-items: center;
				}
				.small-size {
					font-size: 24rpx;
				}
				.telts {
					// margin-top: 6upx;
					// font-size: 24upx;
					display: flex;
					align-items: center;
				}

				view {
					font-size: 28upx;
					font-family: Source Han Sans CN;
					font-weight: 600;
					color: #3e3e3e;
					display: flex;
					// margin-bottom: 26upx;

					.money {
						color: #e93429;
					}
				}
			}
		}

		.the_patient {
			display: flex;
			margin-top: 40upx;
			margin-bottom: 40upx;

			.circle {
				width: 120upx;
				height: 120upx;
				margin-right: 20upx;
				background-color: #fee3d9;
				color: #e35812;
				font-size: 70upx;
				text-align: center;
				line-height: 110upx;
				border-radius: 50%;
			}

			.addtocircle {
				width: 120upx;
				height: 120upx;
				margin-right: 10upx;
				border: 3upx solid #e93429;
				color: #e35812;
				font-size: 120upx;
				text-align: center;
				line-height: 100upx;
				border-radius: 50%;
			}
		}

		.notice {
			font-size: 26upx;
			font-family: Source Han Sans CN;
			font-weight: 600;
			color: #e93429;
		}

		.notice_article {
			font-size: 22upx;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: #3e3e3e;

			view {
				margin-bottom: 10upx;
			}
		}

		.Tips {
			font-size: 28upx;
			font-family: Source Han Sans CN;
			font-weight: 600;
			color: #3e3e3e;
		}
	}

	.tui-actionsheet {
		width: 100%;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 222;
		visibility: hidden;
		transform: translate3d(0, 100%, 0);
		transform-origin: center;
		transition: all 0.3s ease-in-out;
		background: #eaeaec;
		min-height: 100rpx;
	}

	.tui-actionsheet-show {
		transform: translate3d(0, 0, 0);
		visibility: visible;
	}

	.tui-operate-box {
		padding-bottom: 12rpx;
	}

	.tui-actionsheet-btn {
		background-color: $yy-main-col;
		color: #ffffff;
		width: 100%;
		height: 100rpx;

		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		font-size: 36rpx;
		position: relative;
	}

	.tui-btn-last {
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-actionsheet-divider::before {
		content: "";
		width: 100%;
		border-top: 1rpx solid #d9d9d9;
		position: absolute;
		top: 0;
		left: 0;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}

	.tui-actionsheet-cancel {
		color: #1a1a1a;
		// padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-actionsheet-hover {
		background: #f7f7f9;
	}

	.tui-actionsheet-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		z-index: 99;
		transition: all 0.3s ease-in-out;
		opacity: 0;
		visibility: hidden;
	}

	.tui-mask-show {
		opacity: 1;
		visibility: visible;
	}
</style>

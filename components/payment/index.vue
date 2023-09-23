<template>
	<view>
		<view class="payment" :class="pay_close ? 'on' : ''">
			<view class="title acea-row row-center-wrapper">
				选择付款方式
				<text class="iconfont icon-guanbi" @click="close"></text>
			</view>
			<view class="item acea-row row-between-wrapper" @click="goPay(item.number || 0, item.value)"
				v-for="(item, index) in payMode" :key="index" v-if="item.payStatus == 1">
				<view class="left acea-row row-between-wrapper">
					<view class="iconfont" :class="item.icon"></view>
					<view class="text">
						<view class="name">{{ item.name }}</view>
						<view class="info" v-if="item.number">
							{{ item.title }}
							<span class="money">￥{{ item.number }}</span>
						</view>
						<view class="info" v-else>{{ item.title }}</view>
					</view>
				</view>
				<view class="iconfont icon-xiangyou"></view>
			</view>
		</view>
		<view class="mask" ref="close" @click="close" v-if="pay_close"></view>
	</view>
</template>

<script>
	// +----------------------------------------------------------------------
	// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
	// +----------------------------------------------------------------------
	// | Copyright (c) 2016~2021 https://www.crmeb.com All rights reserved.
	// +----------------------------------------------------------------------
	// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
	// +----------------------------------------------------------------------
	// | Author: CRMEB Team <admin@crmeb.com>
	// +----------------------------------------------------------------------

	export default {
		props: {
			payMode: {
				type: Array,
				default: function() {
					return [];
				}
			},
			pay_close: {
				type: Boolean,
				default: false
			},
			order_id: {
				type: [String, Number],
				default: ''
			},
			totalPrice: {
				type: [String, Number],
				default: '0'
			},
			from:{
				type: Number,
				default: 0
			},
			wxConfig:{
				type:Object,
				default:function() {
					return {};
				}
			},
			/**
			 
			 * 3是预约
			 * 5是在线问诊
			 
			 */
			order_type: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {};
		},
		created() {},
		methods: {
			close: function() {
				this.$emit('onChangeFun', {
					action: 'payClose'
				});
			},
			goPay: function(number, paytype) {
				let that = this;
				let type = '';
				if (!that.order_id)
					return that.$util.Tips({
						title: '请选择要支付的订单'
					});
				
				// uni.showLoading({
				// 	title: '支付中'
				// });	
			
				uni.requestPayment({
					provider: 'wxpay',
					orderInfo: this.wxConfig,
					success: e => {
						that.$emit('onChangeFun', {
							action: 'payClose'
						});
						//rk_=>++
						that.$emit('onChangeFun', {
							action: 'pay_complete'
						});
						//rk_++<=
						return that.$util.Tips({
							title: '支付成功',
							icon: 'success'
						});
					},
					fail: e => {
						console.log(e)
						//rk_=>++
						that.$emit('onChangeFun', {
							action: 'pay_fail'
						});
						//rk_++<=
						return that.$util.Tips({
							title: '取消支付'
						});
					},
					complete: () => {
						uni.hideLoading();
					}
				});
				
				
			}
		}
	};
</script>

<style scoped lang="scss">
	.payment {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		border-radius: 16rpx 16rpx 0 0;
		background-color: #fff;
		padding-bottom: 60rpx;
		z-index: 99;
		transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
		transform: translate3d(0, 100%, 0);
	}

	.payment.on {
		transform: translate3d(0, 0, 0);
	}

	.payment .title {
		text-align: center;
		height: 123rpx;
		font-size: 32rpx;
		color: #282828;
		font-weight: bold;
		padding-right: 30rpx;
		margin-left: 30rpx;
		position: relative;
		border-bottom: 1rpx solid #eee;
	}

	.payment .title .iconfont {
		position: absolute;
		right: 30rpx;
		top: 50%;
		transform: translateY(-50%);
		font-size: 43rpx;
		color: #8a8a8a;
		font-weight: normal;
	}

	.payment .item {
		border-bottom: 1rpx solid #eee;
		height: 130rpx;
		margin-left: 30rpx;
		padding-right: 30rpx;
	}

	.payment .item .left {
		width: 610rpx;
	}

	.payment .item .left .text {
		width: 540rpx;
	}

	.payment .item .left .text .name {
		font-size: 32rpx;
		color: #282828;
	}

	.payment .item .left .text .info {
		font-size: 24rpx;
		color: #999;
	}

	.payment .item .left .text .info .money {
		color: #ff9900;
	}

	.payment .item .left .iconfont {
		font-size: 45rpx;
		color: #09bb07;
	}

	.payment .item .left .iconfont.icon-zhifubao {
		color: #00aaea;
	}

	.payment .item .left .iconfont.icon-yuezhifu {
		color: #ff9900;
	}

	.payment .item .left .iconfont.icon-yuezhifu1 {
		color: #eb6623;
	}

	.payment .item .iconfont {
		font-size: 0.3rpx;
		color: #999;
	}
</style>

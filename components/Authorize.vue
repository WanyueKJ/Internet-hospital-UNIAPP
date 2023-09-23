<template>
	<view>
		<view class='Popup' v-if='isShowAuth && code'>
			<view class="logo-auth">
				<image src='/static/images/login_logo.png' mode="aspectFit"></image>
			</view>
			<view class='title'>登录提醒</view>
			<view class='tip'>请登录以便为您提供更好的服务</view>
			<view class='bottom flex'>
				<button class="item grant" @tap="toWecahtAuth">去登录</button>
			</view>
		</view>
		<view class='mask' v-if='isShowAuth && code'></view>
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
	const app = getApp();
	import Cache from '../utils/cache';
	
	import {
		LOGO_URL,
		USER_INFO,
		EXPIRES_TIME
	} from '../config/cache';
	import {
		mapGetters
	} from 'vuex';
	
	
	export default {
		name: 'Authorize',
		props: {
			isAuto: {
				type: Boolean,
				default: true
			},
			isGoIndex: {
				type: Boolean,
				default: true
			},
			isShowAuth: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				canUseGetUserProfile: false,
				code: null,
			}
		},
		computed: {
			
			
		},
		watch: {
			
		},
		created() {
			this.getCode(this.isShowAuth)
		},
		methods: {
			getCode(n) {
				if (n) {
					this.code = 1;
				}
			},
			toWecahtAuth() {
				uni.navigateTo({
					url:'/pages/users/login/index'
				})
			},
			
		}
	}
</script>

<style scoped lang='scss'>
	.Popup {
		width: 500rpx;
		background-color: #fff;
		position: fixed;
		top: 50%;
		left: 50%;
		margin-left: -250rpx;
		transform: translateY(-50%);
		z-index: 1000;
	}

	.Popup {
		.logo-auth {
			z-index: -1;
			position: absolute;
			left: 50%;
			top: 0%;
			transform: translate(-50%, -50%);
			width: 150rpx;
			height: 150rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border: 8rpx solid #fff;
			border-radius: 50%;
			background: #fff;
		}

		image {
			height: 42rpx;
			margin-top: -54rpx;
		}
	}

	.Popup .title {
		font-size: 28rpx;
		color: #000;
		text-align: center;
		margin-top: 30rpx
	}

	.Popup .tip {
		display: flex;
		align-items: center;
		font-size: 22rpx;
		color: #555;
		justify-content: center;
		margin-top: 25rpx;
	}

	.Popup .bottom .item {
		width: 100%;
		height: 80rpx;
		background-color: #eeeeee;
		text-align: center;
		line-height: 80rpx;
		font-size: 24rpx;
		color: #666;
		margin-top: 54rpx;
	}

	.Popup .bottom .item.on {
		width: 100%
	}

	.flex {
		display: flex;
	}

	.Popup .bottom .item.grant {
		font-size: 28rpx;
		color: #fff;
		font-weight: bold;
		background-color: red;
		border-radius: 0;
		padding: 0;
	}

	.mask {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.65);
		z-index: 999;
	}
</style>

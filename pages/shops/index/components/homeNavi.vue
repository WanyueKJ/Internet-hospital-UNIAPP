<template>
	<view>
		<view class="mp-header">
			<view class="sys-head skeleton-rect" :style="{ height: statusBarHeight }"></view>
			<view class="serch-box skeleton-rect" style="height: 43px;">
				<view class="serch-wrapper flex">
					<view class="input skeleton-rect">
						{{appName}}
					</view>
					<view class="logo-img skeleton-rect" @click="chat()">
						<image src="/static/images/h_chat.png" mode=""></image>
					</view>
				</view>
			</view>
		</view>
		<view :style="'height:'+marTop+'px;'"></view>
	</view>
</template>

<script>
	let statusBarHeight = uni.getSystemInfoSync().statusBarHeight * 2 + 'rpx';
	import {
		mapGetters
	} from 'vuex';
import { HTTP_REQUEST_URL } from '../../../../config/app';
	export default {
		name: 'homeNavi',
		computed: {
			
		},
		
		data() {
			return {
				statusBarHeight: statusBarHeight,
				marTop: 0,
				searchH: 0,
				appName:getApp().globalData.appname,
				link: HTTP_REQUEST_URL + '/appapi/page/detail?id=10'
			};
		},
		mounted() {
			let that = this;
			setTimeout(() => {
				let info = uni.createSelectorQuery().in(this).select(".mp-header");
				info.boundingClientRect(function(data) {
					that.marTop = data.height
				}).exec()
			}, 100)
			
		},
		methods: {
			chat(){
				uni.navigateTo({
					url:'/pages/webview/webview?url=' + this.link
				})
				
			}
		}
	}
</script>

<style lang="scss">
	
	.mp-header {
		z-index: 999;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		background-color: $yy-main-col;

		.serch-wrapper {
			height: 100%;
			align-items: center;
			display: flex;
			flex-wrap: nowrap;
			justify-content: space-evenly;
			
			
			.logo-img {
				display: flex;
				align-items: center;
				justify-content: center;
				margin: 0 30rpx;
				width: 127rpx;
				height: 46rpx;
				
			}
			image {
				width: 42rpx;
				height: 42rpx;
			}
			
			.input {
				display: flex;
				align-items: center;
				justify-content: center;
				flex: 1;
				margin-left: 157rpx;
				height: 58rpx;
				padding: 0 0 0 20rpx;
				font-size: 15px;
				color:#fff;
				font-weight: 600;
				.iconfont {
					margin-right: 10rpx;
				}
			}
		}
	}

	
</style>

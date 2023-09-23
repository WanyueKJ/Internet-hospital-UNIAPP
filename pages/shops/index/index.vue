<template>
	<view class="content" :style="'min-height:'+windowHeight+'px;'">
		<!-- <skeleton :show="showSkeleton" :isNodes="isNodes" ref="skeleton" loading="chiaroscuro" selector="skeleton"
			bgcolor="red"></skeleton> -->
		<view v-if="!errorNetwork" :style="{visibility: showSkeleton ? 'hidden' : 'visible'}">
			<!-- 导航 -->
			<home-navi @goLogin="openAuto"></home-navi>
			<!-- 轮播 -->
			<home-swiper :dataList="dataBanner"></home-swiper>
			<!-- 菜单 -->
			<home-menus :dataList="dataMenus" @goLogin="openAuto"></home-menus>
			<!-- 健康科普 -->
			<home-article :dataList="dataArticle" @goLogin="openAuto"></home-article>
			<!-- 视频课堂 -->
			<home-video :dataList="dataVideo" @goLogin="openAuto"></home-video>
		</view>
		<view v-else>
			<view class="error-network skeleton-rect">
				<image src="/static/images/error-network.png"></image>
				<view class="title">网络连接断开</view>
				<view class="con">
					<view class="label">请检查情况：</view>
					<view class="item">· 在设置中是否已开启网络权限</view>
					<view class="item">· 当前是否处于弱网环境</view>
					<view class="item">· 版本是否过低，升级试试吧</view>
				</view>
				<view class="btn" @click="reconnect">重新连接</view>
			</view>
		</view>
		<view class="privacy-wrapper" v-if="privacyStatus">
			<view class="privacy-box">
				<view class="title">服务协议与隐私政策</view>
				<view class="content">
					请务必审慎阅读、充分理解“服务协议与 隐私政策”各条款，包括但不限于：为了 向你提供即时通讯、内容分享等服务，我 们需要收集你的设备信息、操作日志等个
					人信息。你可以在“设置”中查看、变更、 删除个人信息并管理你的授权。
					<br />
					你可以阅读
					<navigator url="/pages/users/privacy/index">《服务协议与隐私政策》</navigator>
					了解 详细信息。如你同意，请点击“我同意”开始接受我们的服务。
				</view>
				<view class="btn-box">
					<view class="btn-item" @click="confirmApp">我同意</view>
					<view class="btn" @click="closeModel">随便逛逛</view>
				</view>
			</view>
		</view>
		<authorize @onLoadFun="onLoadFun" :isAuto="isAuto" :isShowAuth="isShowAuth" @authColse="authColse"
			:isGoIndex="false"></authorize>


	</view>
</template>

<script>
	const app = getApp();


	import authorize from '@/components/Authorize';
	import {
		mapGetters
	} from 'vuex';
	import {
		getHomeData
	} from '@/api/home.js'
	import homeNavi from './components/homeNavi.vue';
	import homeSwiper from './components/homeSwiper.vue';
	import homeMenus from './components/homeMenus.vue';
	import homeArticle from './components/homeArticle.vue';
	import homeVideo from './components/homeVideo.vue';
	
	export default {
		components: {
			homeNavi,
			homeSwiper,
			homeMenus,
			homeArticle,
			homeVideo,
			authorize
		},
		data() {
			return {
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false, //是否隐藏授权
				showSkeleton: true, //骨架屏显示隐藏
				isNodes: 0, //控制什么时候开始抓取元素节点,只要数值改变就重新抓取
				privacyStatus: false,
				errorNetwork: false,
				windowHeight: 0,
				dataBanner: [],
				dataMenus: [],
				dataDoctor: [],
				dataArticle: [],
				dataVideo: [],
				is_show: 0,
			}
		},

		onLoad(options) {
			//console.log(this.uid)
			let that = this;

			this.$nextTick(function() {
				uni.getSystemInfo({
					success: function(res) {
						that.windowHeight = res.windowHeight;
					}
				});
			});

			//that.pageLoad(options);
			// setTimeout(() => {
			// 	that.isNodes++;
			// }, 100);

		},
		onShow() {
			this.snycNetWork();

			let user = uni.getStorageSync('userinfo')
			if (user && user.id > 0) {
				this.isShowAuth = false
				this.getIndexConfig()
			} else {
				this.openAuto()
			}

		},
		onPullDownRefresh() {
			this.getIndexConfig()
		},
		methods: {
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},
			// 打开授权
			openAuto() {
				this.isAuto = true;
				this.isShowAuth = true
			},
			// 授权回调
			onLoadFun() {
				this.isShowAuth = false
			},
			pageLoad() {
				let that = this;
				try {
					let val = uni.getStorageSync('privacyStatus') || false;
					if (!val) {
						this.privacyStatus = true;
					}
				} catch (e) {}
				this.snycNetWork();
				this.getIndexConfig()

			},
			// 对象转数组
			objToArr(data) {
				let obj = Object.keys(data).sort();
				let m = obj.map(key => data[key]);
				return m;
			},

			/**
			 * 首页数据
			 */
			getIndexConfig() {
				getHomeData().then(res => {
					console.log(res)
					let hData = res.data.info;
					this.dataBanner = hData.harousel;
					this.dataArticle = hData.health;
					this.dataVideo = hData.video;
					
					this.hiddenSkeleton();

				})
			},
			hiddenSkeleton() {
				uni.stopPullDownRefresh();
				setTimeout(() => {
					this.showSkeleton = false
				}, 500)
			},
			// 重新链接
			reconnect() {
				uni.getNetworkType({
					success: res => {
						this.errorNetwork = res.networkType === 'none';
						if (!this.errorNetwork) {
							this.pageLoad();
						}
					}
				});
			},
			snycNetWork() {
				uni.getNetworkType({
					success: res => {
						this.errorNetwork = res.networkType === 'none';
					}
				});
			},
			// 同意隐私协议
			confirmApp() {
				uni.setStorageSync('privacyStatus', true);
				this.privacyStatus = false;
			},
			// 关闭Model
			closeModel() {
				this.privacyStatus = false;
			},
		}
	}
</script>

<style lang="scss">
	page {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.content {}

	.error-network {
		position: fixed;
		left: 0;
		top: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 100%;
		padding-top: 40rpx;
		background: #fff;
		padding-top: 30%;

		image {
			width: 414rpx;
			height: 336rpx;
		}

		.title {
			position: relative;
			top: -40rpx;
			font-size: 32rpx;
			color: #666;
		}

		.con {
			font-size: 24rpx;
			color: #999;

			.label {
				margin-bottom: 20rpx;
			}

			.item {
				margin-bottom: 20rpx;
			}
		}

		.btn {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 508rpx;
			height: 86rpx;
			margin-top: 100rpx;
			border: 1px solid #d74432;
			color: #e93323;
			font-size: 30rpx;
			border-radius: 120rpx;
		}
	}

	.privacy-wrapper {
		z-index: 999;
		position: fixed;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		width: 100%;
		height: 100%;
		background: #7f7f7f;

		.privacy-box {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			width: 560rpx;
			padding: 50rpx 45rpx 0;
			background: #fff;
			border-radius: 20rpx;

			.title {
				text-align: center;
				font-size: 32rpx;
				text-align: center;
				color: #333;
				font-weight: 700;
			}

			.content {
				margin-top: 20rpx;
				line-height: 1.5;
				font-size: 26rpx;
				color: #666;

				navigator {
					display: inline-block;
					color: #e93323;
				}
			}

			.btn-box {
				margin-top: 40rpx;
				text-align: center;
				font-size: 30rpx;

				.btn-item {
					height: 82rpx;
					line-height: 82rpx;
					background: linear-gradient(90deg, #f67a38 0%, #f11b09 100%);
					color: #fff;
					border-radius: 41rpx;
				}

				.btn {
					padding: 30rpx 0;
				}
			}
		}
	}
</style>
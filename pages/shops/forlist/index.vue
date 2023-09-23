<template>
	<view class="content">
		<!-- 列表 -->
		<view class="list-box skeleton-rect" v-if="itemList.length>0">
			<view class="list-item skeleton-rect" v-for="(item,index) in itemList" @click="goDoctorHome(item)">
				<view class="item-left">
					<view class="avatar skeleton-radius">
						<image v-if="item.img" :src="item.img" mode="aspectFill"></image>
						<image v-else src="@/static/images/f.png" mode="aspectFill"></image>
					</view>
				</view>
				<view class="item-right">
					<view class="r-top-box">
						<view class="name skeleton-rect">{{item.name}}</view>
						<view class="pe-box skeleton-rect">
							<!-- 职位 -->
							<view class="position">{{item.professional}}</view>
							<!-- 专家 -->
							<view v-if="item.signboard" class="expert">{{item.signboard}}</view>
						</view>
						
					</view>
					<view class="box1">
						<view class="skilled yy-text-line yy-text-line2">擅长：{{item.message}}</view>
						<view class="home">进入主页</view>
					</view>
				</view>
			</view>
		</view>
		<view class="nodata" v-else>
			<emptyPage title="暂无数据～"></emptyPage>
		</view>

		<authorize @onLoadFun="onLoadFun" :isAuto="isAuto" :isShowAuth="isShowAuth" @authColse="authColse"
			:isGoIndex="false"></authorize>
		
		
	</view>

</template>

<script>
	
	
	import authorize from '@/components/Authorize';
	import {
		mapGetters
	} from 'vuex';
	import emptyPage from '@/components/emptyPage.vue';
	import {
		getDoctorList
	} from '@/api/inquiry.js'
	export default {
		computed: {
		
		},
		components: {
			
			emptyPage,
			authorize
		},
		data() {
			return {
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false, //是否隐藏授权
				itemList: [],
			}
		},
		onLoad() {
			
		},
		
		onShow() {
			let user = uni.getStorageSync('userinfo')
			if (user && user.id>0) {
				this.isShowAuth = false
				this.getList();
			}else{
				this.openAuto()
			}
			
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
			/**
			 * 列表
			 */
			getList() {
				let that = this;
				getDoctorList().then(res => {
					console.log(res)
					that.itemList = res.data.info;
				});
			},
			/**
			 * 医生主页
			 */
			goDoctorHome(item) {
				
				uni.navigateTo({
					url: '/pages/shops/subs_inquiry/doctor/index?doctor_id='+item.id,
				});
			}
		}
	}
</script>

<style lang="scss">
	.content {
		
	}
	
	.box1{
		display:flex;
		flex-direction:row;
		align-items:center;
		margin-top:10rpx;
		.home {
			display: flex;
			align-items: center;
			border-radius: 10rpx;
			border: 1rpx solid #EA7F5D;
			color: #EA7F5D;
			padding: 2rpx 10rpx;
			font-size: 22rpx;
		}
	}
	.list-box {
		background-color: #fff;
		padding: 5rpx 30rpx 0rpx;

		.list-item {
			display: flex;
			padding: 40rpx 0 30rpx;
			border-bottom: 2rpx solid #e2e2e2;

			.item-left {
				.avatar {
					width: 110rpx;
					height: 110rpx;
					border-radius: 130rpx;
					overflow: hidden;
				}

				image {
					width: 100%;
					height: 100%;
				}
			}
		}

		.item-right {
			margin-left: 20rpx;
			width: 100%;
			.r-top-box {
				display: flex;
				align-items: baseline;
				
				.name {
					font-size: $yy-title-big-font;
					font-weight: bold;
				}

				.pe-box {
					display: flex;
					align-items: center;

					.position {
						font-size: 28rpx;
						padding: 0 0 0 10rpx;
					}

					.expert {
						margin-left: 10rpx;
						padding: 2rpx 8rpx;
						border-radius: 5rpx;
						background-color: #F6F4Ff;
						font-size: 20rpx;
						color: #735BF5;
					}
				}
				position: relative;
				
			}
			.skilled {
				font-size: 28rpx;
				color: #636363;
				display:flex;
				flex:1;
				margin-right:10rpx;
			}
			
		}
	}
</style>

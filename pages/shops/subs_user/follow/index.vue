<template>
	<view>
		<view class="gz-box" v-if="itemList.length>0">
			<view class="gz-row" v-for="(item,index) in itemList" @click="goDoctorHome(item)">
				<view class="img">
					<image v-if="item.img" :src="item.img" mode="aspectFill"></image>
					<image v-else src="@/static/images/f.png" mode="aspectFill"></image>
				</view>
				<view class="colomn">
					<view class="row1">
						<view class="text-left-box">
							<view class="text1 yy-text-line yy-text-line1">{{item.name}}</view>
							<!-- 职位 -->
							<view class="text2 yy-text-line yy-text-line1">{{item.professional}}</view>
							
						</view>
						<view  class="text4" @click.stop="clickDelFollow(item)">取消关注</view>
					</view>
					<view class="row3 yy-text-line yy-text-line2">擅长：{{item.message}}</view>
				</view>
			</view>
			<view class='loadingicon acea-row row-center-wrapper' @click="clickMore">
				<text class='loading iconfont icon-jiazai' :hidden='loading==false'></text>{{loadTitle}}
			</view>
		</view>
		<view class="nodata" v-else>
			<emptyPage title="暂无数据～"></emptyPage>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from "vuex";
	import emptyPage from '@/components/emptyPage.vue';
	import {
		getFollowList,
		doctorDelFollow
	} from '@/api/inquiry.js';
	export default {
		computed: {
			
		},
		components:{
			emptyPage
		},
		data() {
			return {
				loadTitle: '加载更多',
				loading: false,
				loadend: false,
				where:{'page':1,'num':20},
				itemList:[],
			}
		},
		onShow() {
			this.getList();
		},
		onLoad() {
		
		},
		onUnload() {
			
		},
		onPullDownRefresh(){
			console.log('rk==>refresh')
			this.loadend = false;
			this.where.page = 1;
			this.clickMore();
		},
		onReachBottom() {
			this.clickMore();
		},
		methods: {
			/**
			 * 取关
			 */
			clickDelFollow(item){
				let where = {
					'id':item.id,
				}
				let that = this;
				doctorDelFollow(where).then(res => {
					if(res.data.code == 0){
						that.where.page = 1
						that.getList()
					}
					that.$util.Tips({
						title:res.message
					});
				});
			},
			/**
			 * 列表
			 */
			getList(){
				let that = this;
				getFollowList(that.where).then(res => {
					uni.stopPullDownRefresh();
							
					if(that.where.page == 1){
						that.itemList = [];
					}
					let resList = res.data.info;
					that.itemList = that.$util.SplitArray(resList, that.itemList);
					that.$set(that, 'itemList', that.itemList);
					let loadend = resList.length == 0;
										
					that.loadend = loadend;
					that.loadTitle = loadend ? '我也是有底线的' : '加载更多';
					that.where.page += 1;
					that.loading = false;
				});
				
			},
			/**
			 * 更多
			 */
			clickMore(){
				if(this.loadend){
					uni.stopPullDownRefresh();
					return
				}
				this.getList();
			},
			/**
			 * 医生主页
			 */
			goDoctorHome(item){
				uni.navigateTo({
					url:'/pages/shops/subs_inquiry/doctor/index?doctor_id='+item.id,
				});
			}
			
		}
	}	
	
</script>

<style lang="scss">
	page {
		background-color: #f5f5f5;
	}

	.gz-box {
		//background-color: #fff;
		//height: 280rpx;
		//border-radius: 20rpx;
		
		margin: 30rpx 30rpx;
		
		.gz-row {
			border-radius: 20rpx;
			background-color: #fff;
			display: flex;
			flex-direction: row;
			padding: 20rpx 15rpx;
			margin: 20rpx 0;
			.img {
				width: 120rpx;
				height: 120rpx;
				border-radius: 50%;
				overflow: hidden;
				image {
					width: 100%;
					height: 100%;
				}
			}

			.colomn {
				display: flex;
				margin: 0 20rpx;
				width: 520rpx;
				flex-direction: column;
				
				.row1 {
					display: flex;
					align-items: center;
					justify-content: space-between;
					.text-left-box {
						display: flex;
						align-items: center;
						max-width: 370rpx;
						.text1 {
							font-size: 38rpx;
							font-weight: 700;
							color: #000;
						}
						
						.text2 {
							margin: 0 10rpx;
							font-size: 28rpx;
							color: #3e3e3e;
						}
						.text3 {
							width: 110rpx;
							font-size: 22rpx;
							color: #3291fb;
							background-color: #e2eefe;
							border-radius: 10rpx;
							text-align: center;
						}
					}
					.text4 {
						padding: 0 15rpx;
						font-size: 24rpx;
						color: #00cc99;
						border: #00cc99 solid 2rpx;
						border-radius: 20rpx;

					}

				}
				.row2 {
					font-size: 28rpx;
					height: 60rpx;
					line-height: 60rpx;
				}
				.row3 {
					margin-top: 20rpx;
					font-size: 26rpx;
					line-height: 40rpx;
					color: #636363;
				}
			}
		}
	}
</style>

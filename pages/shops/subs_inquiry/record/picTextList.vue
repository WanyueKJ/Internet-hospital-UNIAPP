<template>
	<view>
		<view class="nav">
			<uni-segmented-control :current="current" :values="items" :style-type="styleType"
				:active-color="activeColor" @clickItem="onClickItem" />
		</view>
		<view class="content">
			<view v-if="current === 0">
				<view class="asking-box" v-if="askingList.length>0">
					<view class="list-item" v-for="(item,index) in askingList" @click="goDetail(item)">
						<view class="current-content">
							<text>{{item.remark}}</text>
						</view>
						<view class="current-footer">
							<view class="footer-left">
								发布于{{item.addtime}}
							</view>
							<view class="footer-right">
								诊金￥{{item.money}}
							</view>
						</view>
					</view>
					<view class='loadingicon acea-row row-center-wrapper' @click="clickMore(false)">
						<text class='loading iconfont icon-jiazai'
							:hidden='askingLoading==false'></text>{{askingLoadTitle}}
					</view>
				</view>
				<view class="nodata" v-else>
					<emptyPage title="暂无数据～"></emptyPage>
				</view>
			</view>
			<view v-if="current === 1">
				<view class="finish-box" v-if="finishList.length>0">
					<view class="list-item" v-for="(item,index) in finishList" @click="goDetail(item)">
						<view class="current-content">
							<text>{{item.remark}}</text>
						</view>
						<view class="current-footer">
							<view class="footer-left">
								发布于{{item.addtime}}
							</view>
							<view class="footer-right">
								诊金￥{{item.money}}
							</view>
						</view>
					</view>
					<view class='loadingicon acea-row row-center-wrapper' @click="clickMore(false)">
						<text class='loading iconfont icon-jiazai'
							:hidden='finishLoading==false'></text>{{finishLoadTitle}}
					</view>
				</view>
				<view class="nodata" v-else>
					<emptyPage title="暂无数据～"></emptyPage>
				</view>
			</view>
		</view>

		<view></view>
	</view>
</template>

<script>
	import emptyPage from '@/components/emptyPage.vue';
	import {
		getPicTextAllLst,
		getConversationStatus
	} from '@/api/inquiry.js';
	import {
		mapGetters
	} from "vuex";
	export default {
		components:{
			emptyPage
		},
		computed: {
			
		},
		data() {
			return {
				items: ['进行中', '已完成'],
				current: 0,
				activeColor: '#38ce8c',
				styleType: 'text',

				askingLoadTitle: '加载更多',
				askingLoading: false,
				askingLoadend: false,
				askingWhere: {
					'page': 1,
					'num': 20,
					'status':0
				},
				askingList: [],
				finishLoadTitle: '加载更多',
				finishLoading: false,
				finishLoadend: false,
				finishWhere: {
					'page': 1,
					'num': 20,
					'status':1
				},
				finishList: []
			}
		},
		onLoad() {
		
		},
		onShow() {
			if(this.current == 0){
				this.askingLoadend = false;
				this.askingWhere.page = 1;
				this.getAskingList();
			}else {
				this.finishLoadend = false;
				this.finishWhere.page = 1;
				this.getFinishList();
			}
		},
		onPullDownRefresh() {
			console.log('rk==>refresh')
			this.clickMore(true);
		},
		onReachBottom() {
			this.clickMore(false);
		},

		methods: {
			onClickItem(e) {
				if (this.current !== e.currentIndex) {
					this.current = e.currentIndex
					uni.stopPullDownRefresh();
					//  && this.finishList.length<=0
					if (this.current == 1) {
						this.finishLoadend = false;
						this.finishWhere.page = 1;
						this.getFinishList();
					}
					// && this.askingList.length<=0
					if (this.current == 0 ) {
						this.askingLoadend = false;
						this.askingWhere.page = 1;
						this.getAskingList();
					}
					
				}
			},
			/**
			 * 更多
			 */
			clickMore(isRefresh) {

				if (this.current == 1) {

					if (this.finishLoadend && !isRefresh) {
						uni.stopPullDownRefresh();
						return
					}
					this.finishLoadend = false;
					if(isRefresh){
						this.finishWhere.page = 1;
					}
					this.getFinishList();

				} else {
					if (this.askingLoadend  && !isRefresh) {
						uni.stopPullDownRefresh();
						return
					}
					this.askingLoadend = false;
					if(isRefresh){
						this.askingWhere.page = 1;
					}
					this.getAskingList();
				}
			},
			/**
			 * 进行中
			 */
			getAskingList() {
				let that = this;
				//进行中
				getPicTextAllLst(that.askingWhere).then(res => {
					uni.stopPullDownRefresh();

					if (that.askingWhere.page == 1) {
						that.askingList = [];
					}
					console.log(res)
					let resList = res.data.info;
					that.askingList = that.$util.SplitArray(resList, that.askingList);
					that.$set(that, 'askingList', that.askingList);
					let loadend = resList.length == 0;

					that.askingLoadend = loadend;
					that.askingLoadTitle = loadend ? '我也是有底线的' : '加载更多';
					that.askingWhere.page += 1;
					that.askingLoading = false;
				});

			},
			/**
			 * 已完成
			 */
			getFinishList() {
				let that = this;
				// 已完成
				getPicTextAllLst(that.finishWhere).then(res => {
					uni.stopPullDownRefresh();

					if (that.finishWhere.page == 1) {
						that.finishList = [];
					}
					let resList = res.data.info;
					that.finishList = that.$util.SplitArray(resList, that.finishList);
					that.$set(that, 'finishList', that.finishList);
					let loadend = that.resList.length >= allCount;

					that.finishLoadend = loadend;
					that.finishLoadTitle = loadend ? '我也是有底线的' : '加载更多';
					that.finishWhere.page += 1;
					that.finishLoading = false;
				});

			},
			/**
			 * 详情
			 */
			goDetail(item) {
				console.log(item)
				let param = JSON.stringify(item)
				uni.navigateTo({
					url: '/pages/shops/subs_inquiry/record/picTextDetail?item='+param
				})
				
			},
			

		}
	}
</script>

<style lang="scss">
	page {}

	.nav {
		background-color: #fff;
	}

	.content {

		margin: 20rpx 30rpx;

		.list-item {
			background-color: #fff;
			margin: 20rpx 0;
			border-radius: 20rpx;
			padding: 20rpx 20rpx;
		}

		.current-title {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			padding-bottom: 20rpx;
			border-bottom: #999 solid 3rpx;

			.title-left {
				padding: 15rpx 20rpx;
				background-color: #d8eefc;
				color: #000;
				border-radius: 15rpx;
				font-size: 26rpx;

				.yyfont {
					margin-right: 10rpx;
				}
			}

			.title-right {
				display: flex;
				align-items: center;
			}
		}

		.current-title1 {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			padding-bottom: 20rpx;
			border-bottom: #999 solid 3rpx;

			.title-left1 {
				padding: 15rpx 20rpx;
				background-color: #2acb7e;
				text-align: center;
				color: #fff;
				border-radius: 15rpx;
				font-size: 26rpx;

				.yyfont {
					margin-right: 10rpx;
				}
			}

			.title-right1 {
				display: flex;
				align-items: center;
			}
		}

		.current-content {
			padding-top: 30rpx;

			text {
				font-size: 26rpx;
				color: #000;
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
		}

		.current-footer {
			padding-top: 40rpx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			color: #999;
		}
	}
</style>

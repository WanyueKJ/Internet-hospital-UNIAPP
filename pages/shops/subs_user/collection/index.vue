<template>
	<view class="content">
		<view class="navi">
			<uni-segmented-control :current="current" :values="items" :style-type="styleType"
				:active-color="activeColor" @clickItem="onClickItem" />
		</view>
		<view v-if="current == 0" class="article-box">
			<view v-if="articleList.length>0">
				<view class="article" v-for="(item,index) in articleList" @click="clickArticleDetail(item)">
					<view class="yy-article-box">
						<view class="yy-article-item item-add-diff">
							<view class="pic-box">
								<image :src="item.image" mode="aspectFill"></image>
							</view>
							<view class="txt-box txt-box-diff">
								<view class="article-name">{{ item.name }}</view>
								<view class="article-des yy-text-line yy-text-line2"> {{ item.synopsis }}</view>
							</view>
							
						</view>
					</view>
					
				</view>
				<view class='loadingicon acea-row row-center-wrapper' @click="clickMore(false)">
					<text class='loading iconfont icon-jiazai' :hidden='articleLoading==false'></text>{{articleLoadTitle}}
				</view>
			</view>
			<view class="nodata" v-else>
				<emptyPage title="暂无数据～"></emptyPage>
			</view>
		</view>
		<view v-else class="article-box">
			<view v-if="videoList.length>0">
				<view class="article" v-for="(item,index) in videoList" @click="clickVideoDetail(item)">
					<view class="yy-article-box">
						<view class="yy-article-item item-add-diff">
							<view class="pic-box">
								<image :src="item.image" mode="aspectFill"></image>
							</view>
							<view class="txt-box pr txt-box-diff">
								<view class="article-name">{{ item.name }}</view>
								<view class="article-des yy-text-line yy-text-line2"> {{ item.synopsis }}</view>
							</view>
						</view>
					</view>
					
				</view>
				<view class='loadingicon acea-row row-center-wrapper' @click="clickMore(false)">
					<text class='loading iconfont icon-jiazai' :hidden='videoLoading==false'></text>{{videoLoadTitle}}
				</view>
			</view>
			<view class="nodata" v-else>
				<emptyPage title="暂无数据～"></emptyPage>
			</view>
		</view>

	</view>
</template>

<script>
	import emptyPage from '@/components/emptyPage.vue';
	import {
		mapGetters
	} from "vuex";
	import {
		articleCollectList,
		videoCollectList
	} from '@/api/home.js'
	export default {
		components:{
			emptyPage
		},
		computed: {
			
		},
		data() {
			return {
				items: ['收藏的文章', '收藏的视频'],
				current: 0,
				activeColor: '#38ce8c',
				styleType: 'text',

				articleLoadTitle: '加载更多',
				articleLoading: false,
				articleLoadend: false,
				articleWhere: {
					'page': 1,
					'num': 20
				},
				articleList: [],

				videoLoadTitle: '加载更多',
				videoLoading: false,
				videoLoadend: false,
				videoWhere: {
					'page': 1,
					'num': 20
				},
				videoList: [],
			}
		},
		onLoad() {
			
			this.getArticleList();
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
					
					if (this.current == 1 && this.videoList.length<=0) {
						this.videoLoadend = false;
						this.videoWhere.page = 1;
						this.getVideoList();
					}
					
					if (this.current == 0 && this.articleList.length<=0) {
						this.articleLoadend = false;
						this.articleWhere.page = 1;
						this.getArticleList();
					}
					
				}
			},
			/**
			 * 更多
			 */
			clickMore(isRefresh) {

				if (this.current == 1) {

					if (this.videoLoadend && !isRefresh) {
						uni.stopPullDownRefresh();
						return
					}
					this.videoLoadend = false;
					if(isRefresh){
						this.videoWhere.page = 1;
					}
					this.getVideoList();

				} else {
					if (this.articleLoadend && !isRefresh) {
						uni.stopPullDownRefresh();
						return
					}
					this.articleLoadend = false;
					if(isRefresh){
						this.articleWhere.page = 1;
					}
					this.getArticleList();
				}
			},
			/**
			 * 文章列表
			 */
			getArticleList() {
				let that = this;
				articleCollectList(that.articleWhere).then(res => {
					uni.stopPullDownRefresh();

					if(that.articleWhere.page == 1){
						that.articleList = [];
					}
					let resList = res.data.info;
					//console.log(resList.length,that.articleWhere.page)
					that.articleList = that.$util.SplitArray(resList, that.articleList);
					that.$set(that, 'articleList', that.articleList);
					let loadend = resList.length == 0;
					that.articleLoadend = loadend;
					that.articleLoadTitle = loadend ? '我也是有底线的' : '加载更多';
					that.articleWhere.page += 1;
					//console.log(that.articleWhere.page)
					that.articleLoading = false;
				});

			},
			/**
			 * 视频列表
			 */
			getVideoList() {
				let that = this;
				
				videoCollectList(that.videoWhere).then(res => {
					uni.stopPullDownRefresh();

					if(that.videoWhere.page == 1){
						that.videoList= [];
					}
					let resList = res.data.info;
					that.videoList = that.$util.SplitArray(resList, that.videoList);
					that.$set(that, 'videoList', that.videoList);
					let loadend = resList.length == 0;
					that.videoLoadend = loadend;
					that.videoLoadTitle = loadend ? '我也是有底线的' : '加载更多';
					that.videoWhere.page += 1;
					that.videoLoading = false;
				});

			},
			/**
			 * 视频详情
			 */
			clickVideoDetail(item){
				uni.navigateTo({
					url:'/pages/shops/subs_index/video/detail?video_id='+item.id
				})
			},
			/**
			 * 进入详情
			 */
			clickArticleDetail(item){
				uni.navigateTo({
					url:'/pages/shops/subs_index/article/detail?article_id='+item.id,
				})
			}

		}
	}
</script>

<style lang="scss">
	.content {}

	.navi {
		background-color: #fff;
		height: 44px;;
	}
	.article-box{
		padding: 20rpx 0;
	}
	.article {
		background-color: #fff;
		padding: 0rpx 30rpx;
		margin-bottom: 10rpx;

		.item-add-diff {
			border-bottom: 0rpx solid #fff;
			display: flex;
		}

		.txt-box-diff {
			display: flex;
			margin-left: 20rpx;
			margin-right: 20rpx;

		}

	}

	
	/deep/.loadingicon {
		font-size: 28rpx;
		color: #969696;
		display: flex;
		align-items: center !important;
	}
</style>

<template>
	<view class="content">
		<view class="data" v-if="itemList.length>0">
			<view class="article" v-for="(item,index) in itemList" @click="clickDetail(item)">
				<view class="yy-article-box">
					<view class="yy-article-item item-add-diff">
						<view class="pic-box">
							<image :src="item.image" mode="aspectFill"></image>
						</view>
						<view class="txt-box pr txt-box-diff">
							<view class="article-name">{{ item.name }}</view>
						</view>
					</view>
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
	import emptyPage from '@/components/emptyPage.vue';
	import { articleList } from '@/api/home.js';;
	
	export default {
		

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
		onLoad() {
			
			this.getList();
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
		methods:{
			
			/**
			 * 列表
			 */
			getList(){
				let that = this;
				
				articleList(that.where).then(res => {
					uni.stopPullDownRefresh();
			
					if(that.where.page == 1){
						that.itemList = [];
					}
					let resList = res.data.info;
					
					that.itemList = that.$util.SplitArray(resList, that.itemList);
					that.$set(that, 'itemList', that.itemList);
					that.loadend = resList.length == 0;
					that.loadTitle = that.loadend ? '我也是有底线的' : '加载更多';
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
			 * 进入详情
			 */
			clickDetail(item){
				//console.log('rk===>'+JSON.stringify(item.article_id));
				uni.navigateTo({
					url:'/pages/shops/subs_index/article/detail?article_id='+item.id,
				})
			}
		}
	}
</script>

<style lang="scss">
	.content {
		
		padding: 20rpx 0rpx;
	}
	.article {
		background-color: #fff;
		padding: 0rpx 30rpx;
		margin-bottom: 10rpx;
		
		.item-add-diff{
			border-bottom: 0rpx solid #fff;
			display: flex;
			
		}
		.txt-box-diff {
			display: flex;
			margin-left:20rpx;
			margin-right: 20rpx;
			// justify-content: space-around;
		}
		
		.tool {
			display: flex;
			justify-content: space-between;
			padding: 0 0 20rpx;
			font-size: 24rpx;
		}
		.tool-left {
			display: flex;
			align-items: center;
			.make-top {
				color: #ff0000;
				border: 1px solid #ff0000;
				border-radius: 10rpx;
				padding: 2rpx 10rpx;
				font-size: 22rpx;
			}
			.author {
				margin-left: 10rpx;
				max-width: 230rpx;
			}
			.read {
				margin-left: 0rpx;
				color: #808080;
			}
		}
		.tool-right {
			color: #808080;
		}
	}
	/deep/.loadingicon {
		font-size: 28rpx;
		color: #969696;
		display: flex;
		align-items: center !important;
	}
</style>
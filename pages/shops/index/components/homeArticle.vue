<template>
	<view class="content">
		<view class="yy-secion-header">
			<view class="left">
				<view class="line"></view>
				<view class="title">健康科普</view>
			</view>
			<view class="right" @click="clickMore">
				<view class="subs">更多</view>
				<text class="iconfont icon-xiangyou"></text>
			</view>
		</view>
		<view class="yy-article-box">
			<view class="yy-article-item" v-for="(item,index) in itemList" @click="clickDetail(item)">
				<view class="pic-box">
					<image :src="item.image" mode="aspectFill"></image>
				</view>
				<view class="txt-box pl">
					<view class="article-name">{{ item.name }}</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	export default {
		name:'homeArticle',
		props:{
			dataList: {
				type: Array,
				default: () => []
			},
		},
		watch:{
			dataList(){
				this.itemList = this.dataList;
			}
		},
		computed: {
			
		},
		data() {
			return {
				itemList:[],
			}
		},
		created() {
			//console.log('rk==>[abc]'+JSON.stringify(this.itemList));
		},
		mounted() {
			
		},
		methods: {
			clickMore(){
				uni.navigateTo({
					url:'/pages/shops/subs_index/article/list',
				})
			},
			/**
			 * 进入详情
			 */
			clickDetail(item){
			
				uni.navigateTo({
					url:'/pages/shops/subs_index/article/detail?article_id='+item.id,
				})
			}
		}
	}
	
</script>

<style lang="scss">
	.content {
		margin-top: 0rpx;
		padding: 0 30rpx 30rpx;
		background-color: #fff;
	}
	
</style>
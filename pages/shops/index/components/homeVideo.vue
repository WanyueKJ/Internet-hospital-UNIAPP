<template>
	<view class="content">
		<view class="yy-secion-header">
			<view class="left">
				<view class="line"></view>
				<view class="title">视频课堂</view>
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
		name: 'homeVideo',
		props: {
			dataList: {
				type: Array,
				default: () => []
			},
		},
		computed: {
			
		},
		watch: {
			dataList() {
				this.itemList = this.dataList;
			}
		},
		data() {
			return {
				itemList: [],
			}
		},
		created() {

		},
		mounted() {

		},
		methods: {
			clickMore() {
				uni.navigateTo({
					url: '/pages/shops/subs_index/video/list',
				})
			},
			/**
			 * 视频详情
			 */
			clickDetail(item) {
				uni.navigateTo({
					url: '/pages/shops/subs_index/video/detail?video_id=' + item.id
				})
			},
		}
	}
</script>

<style lang="scss">
	.content {
		margin: 20rpx 0;
		padding: 0 30rpx 10rpx;
		background-color: #fff;
	}
	
</style>

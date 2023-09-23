<template>
	<view class="content">
		<!-- 视频 -->
		<view class="video-box">
			<video id="myVideo" :src="videoInfo.content" @error="videoErrorCallback" direction='90'>
			</video>
		</view>
		<view class="gesture-bg">
			<!-- 标题 -->
			<view class="video-brief">
				<view class="title">
					{{videoInfo.name}}
				</view>
				<view class="tool">
					<view class="col" @click="clickCollection">
						<text :class="isCollection?'sel':''" class="iconfont icon-yishoucang"></text>收藏
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		articleDetail,
		articleCollect,
		articleDelCollect
	} from '@/api/home.js';

	import {
		mapGetters
	} from 'vuex';
	export default {
		computed: {
			
		},
		data() {
			return {
				video_id: '',
				where: {
					'page': 1,
					'limit': 5,
				},
				isCollection: false,
				videoInfo: {},
			}
		},
		onLoad(ops) {
			if (!ops || !ops.video_id) {
				return this.$util.Tips({
					title: '缺少视频参数'
				});
			}
			this.video_id = ops.video_id;
			this.getVideoDetail();
		},
	
		methods: {
			videoErrorCallback(err) {
				console.log(JSON.stringify(err), 'video-')
			},
			/**
			 * 视频详情
			 */
			getVideoDetail() {
				let where = {
					'id': this.video_id
				}
				let that = this;
				articleDetail(where).then(res => {
					console.log(res)
					that.videoInfo = res.data;
					that.isCollection = that.videoInfo.is_collect;
				});
			},
			
			/**
			 * 收藏
			 */
			clickCollection() {
				let where = {
					'id': this.video_id
				};
				
				if(this.isCollection){
					articleDelCollect(where).then(res => {
						if(res.ret == 200){
							this.isCollection = !this.isCollection;
						}
						this.$util.Tips({
							title:res.message,
						});
					}).catch(err => {
						this.$util.Tips({
							title: err
						});
					});
				}else{
					articleCollect(where).then(res => {
						if(res.ret == 200){
							this.isCollection = !this.isCollection;
						}
						this.$util.Tips({
							title:res.message,
						});
					}).catch(err => {
						this.$util.Tips({
							title: err
						});
					});
				}
				
			}
			
		}

	}
</script>

<style lang="scss">
	.content {
		.video-box {
			width: 100%;
			display: flex;
			justify-content: center;

			video {
				width: 100%;
			}
		}

		.video-brief {
			background-color: #fff;
			padding: 30rpx;
			display:flex;
			flex-direction: row;
			align-items: center;
			.title {
				font-size: $yy-title-font;
				font-weight: bold;
				color: $yy-title-col;
				display:flex;
				flex-direction: row;
				flex:1;
				margin-right: 20rpx;
			}

			.tool {
				display: flex;

				.iconfont {
					margin-right: 5rpx;
					color: #969696;
				}

				.sel {
					color: #ff0000;
				}
			}
		}

	}
</style>

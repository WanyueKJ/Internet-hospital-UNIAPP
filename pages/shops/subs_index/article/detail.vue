<template>
	<view class="content">
		<view class="header">
			<view class="title">
				{{article_title}}
			</view>
			<view class="time-col">
				<view class="time">
					发布时间:{{article_time}}
				</view>
				<view class="collecion" @click="clickCollecton">
					<text :class="isCollection?'sel':''" class="iconfont icon-yishoucang"></text>收藏
				</view>
			</view>
		</view>
		<view class="text">
			<!-- <rich-text :nodes="data"></rich-text> -->
			<jyf-parser :html="data.replace(/<br\/>/ig, '')" ref="article" :tag-style="tagStyle"></jyf-parser>
		</view>
	</view>
</template>

<script>
	import {
		articleDetail,
		articleCollect,
		articleDelCollect
	} from '@/api/home.js'
	import {
		mapGetters
	} from "vuex";
	export default {
		computed: {
			
		},
		data() {
			return {
				tagStyle: {
					img: 'width:100%;display:block;'
				},
				data: '',
				article_id: '',
				article_title: '',
				article_time: '',
				isCollection: false,
			}
		},
		onLoad(ops) {
			
			if (ops && ops.article_id) {
				this.article_id = ops.article_id;
				this.getDetail();
			}
		},
		methods: {
			getDetail() {
				let that = this
				let where = {
					'id':this.article_id,
				};
				articleDetail(where).then(res => {
					console.log(res)
					let getData = res.data;
					this.data = that.$util.formatRichText(getData.content);
					this.isCollection = getData.is_collect;
					this.article_title = getData.name;
					this.article_time = getData.addtime;
				});
			},
			/**
			 * 收藏
			 */
			clickCollecton() {
				let where = {
					'id':this.article_id
				};
				if(this.isCollection){
					articleDelCollect(where).then(res => {
						let status = res.ret;
						if(status == 200){
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
						let status = res.ret;
						if(status == 200){
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
				
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff;
	}

	.header {
		padding: 40rpx 30rpx 10rpx;

		.title {
			font-size: $yy-title-big-font;
			font-weight: bold;
		}

		.time-col {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 0 0;
		}

		.time {}

		.collecion {
			background-color: #ffc832;
			color: #fff;
			padding: 6rpx 15rpx;
			border-radius: 50rpx;

			.sel {
				color: #ff0000;
			}
		}
	}

	.text {
		font-size: 30rpx;
		font-weight: 400;
		padding: 30rpx;
		color: #282828;
		overflow: hidden;
		overflow-y: auto;

		image {
			max-width: 100%;
		}
	}
</style>

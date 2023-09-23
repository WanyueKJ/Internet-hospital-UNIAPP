<template>
	<view class="user-setting">
		<view class="list other">
			<view v-for="(item,index) in list" :key="index">
				<view class='item acea-row row-between-wrapper' @click="gorules(item.host)">
					<view>{{item.post_title}}</view>
					<text class='iconfont icon-you'></text>
				</view>
			</view>	
		</view>
	</view>
</template>

<script>
	import {getIntegralInfo} from '@/api/user.js'
	export default{
		name:'user-setting',
		data(){
			return{
				list:[]
			}
		},
		onLoad() {
			this.getlist()
		},
		methods:{
			getlist(){
				let that = this
				getIntegralInfo().then(res=>{
					console.log(res)
					that.list = res.data.info
				})
			},
			gorules(url){
				uni.navigateTo({
					url: '/pages/webview/webview?url=' + url
				})
			}
		}
	} 
</script>

<style scoped lang="scss">
	.user-setting {
		margin-top: 2rpx;
		.other {
			margin-top: 15rpx;
		}

		.list {
			background-color: #fff;

			.item {
				padding: 30rpx 30rpx 30rpx 0;
				border-bottom: 1rpx solid #f2f2f2;
				margin-left: 30rpx;
				font-size: 32rpx;
				color: #242424;

				.iconfont {
					font-size: 30rpx;
					color: #8A8A8A;
				}
			}
		}
	}
</style>

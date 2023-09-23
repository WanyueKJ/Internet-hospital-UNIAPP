<template>
	<view class="box">
		非法访问,此页面不存在,请<text class="home" @click="clickHome">返回首页</text>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				
			}
		},
		methods:{
			clickHome(){
				uni.reLaunch({
					url:'/pages/shops/user/index'
				})
			}
		}
	}
</script>

<style lang="scss">
	.box{
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-50%);
		font-size: 40rpx;
		font-weight: bold;
		color: #666;
		text-align: center;
	}
	.home {
		color: #36cf89;
	}
</style>

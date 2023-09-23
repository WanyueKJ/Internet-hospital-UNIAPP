<template>
	<view class="content">
		<uni-data-checkbox v-model="inquiryValue" multiple :localdata="inquiryData" @change="changeType">
		</uni-data-checkbox>
		<view class="item-box">
			<view class="item">
				<view class="point"></view>
				<view class="text">适合可以耐心等待医生回复的病情咨询</view>
			</view>
		</view>
		
	</view>

</template>

<script>
	export default {
		name: 'inquiryType',
		props: {
			itemData:{
				type:Object
			}
		},
		watch:{
			itemData(nv){
				if(nv){
					// console.log("rk===>[change1]" + JSON.stringify(nv.title));
					this.inquiryData[0].text = '在线问诊' + nv.cost + '元'
				}
			}
		},
		mounted() {
			
		},
		data() {
			return {
				inquiryValue: [],
				inquiryData: [{
					text: '在线问诊',
					value: 1
				}],
				
			}
		},
		methods: {
			clearVal(){
				this.inquiryValue = [];
			},
			changeType() {
				let sel = this.inquiryValue.length>0?1:0;
				this.$emit('changeType',sel);
			}
			
		},
	}
</script>

<style lang="scss">
	.content {
		padding: 20rpx 0;
		
		.item-box {
			padding: 10rpx 0 30rpx 36rpx;
			border-bottom: 1px solid #eee;
		}
		.item {
			display: flex;

			.point {
				margin: 11rpx 8rpx 0 3rpx;
				width: 20rpx;
				height: 20rpx;
				border-radius: 20rpx;
				background-color: #969696;
			}

			.text {
				flex: 1;
				font-size: 28rpx;
				color: #969696;
			}
		}

		.item-footer {
			padding: 20rpx 0;
			display: flex;
			justify-content: flex-end;
			border-bottom: 2rpx solid #eee;
			color: $yy-main-col;

			.iconfont {
				font-size: 20rpx;
			}
		}
	}

	
</style>

<template>
	<view class="content">
		<view class="ysxx">
			<view class="header">
				<image v-if="doctorInfo.img" :src="doctorInfo.img" mode="aspectFill"></image>
				<image v-else src="@/static/images/f.png" mode="aspectFill"></image>
				<view class="ysmz">{{doctorInfo.name}}</view>
				<view class="header-text1">
					<!-- 职称 -->
					<view class="">{{doctorInfo.professional}}</view>
					<text class="expert" v-if="doctorInfo.signboard">{{doctorInfo.signboard}}</text>

					<view class="ysxx-gzys" @click="clickFollow">
						<text class="iconfont icon-jiahao"></text>
						<view v-if="is_follow == 0">关注医生</view>
						<view v-else>已关注</view>
					</view>
				</view>
			</view>
			<view class="ysxx-content">
				<!-- 描述 -->
				<view class="c-des">{{doctorInfo.content}}</view>
				<!-- 特长 -->
				<view>擅长：{{doctorInfo.message}}</view>
			</view>

		</view>
		<view class="service-box">
			<view class="title">服务内容</view>
			<view class="content-box">
				<inquiry-type ref="chatRef" :itemData="doctorInfo" @changeType="chatChange"></inquiry-type>
			</view>
		</view>
		<view class="safe-height"></view>
		<view class="footer safe-height">
			<view class="btn-box">
				<view class="btn" @click="startInquiry">立即问诊</view>
			</view>
			<view class="yy-safe-bh"></view>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from "vuex";
	import {
		HTTP_REQUEST_URL
	} from '@/config/app';
	import {
		getDoctorDetail,
		doctorFollow,
		doctorDelFollow
	} from '@/api/inquiry.js';
	import inquiryType from './components/inquiryType.vue';
	
	export default {
		computed: {
			
		},
		components: {
			inquiryType
		},
		data() {
			return {
				doctor_id: '',
				doctorInfo: {
					'avatar': ''
				},
				is_follow: 0,
				selType: -1, // 1:在线
				uid:0
			}
		},
		onLoad(ops) {
			if (!ops || !ops.doctor_id) {
				return this.$util.Tips({
					title: '缺少参数',
				})
			}
			let user = uni.getStorageSync('userinfo')
			if(user && user.id>0){
				this.uid = user.id
			}
			this.doctor_id = ops.doctor_id;
		},
		onShow() {
			this.getDoctorDetial();
		},
		methods: {
			/**
			 * 获取医生资料
			 */
			getDoctorDetial() {
				let where = {
					'id': this.doctor_id,
				}
				getDoctorDetail(where).then(res => {
					this.doctorInfo = res.data.info;
					this.is_follow = this.doctorInfo.is_collect;
				});
			},
			/**
			 * 关注-取消关注
			 */
			clickFollow() {
				let that = this;
				let where = {
					'id': this.doctor_id,
					'uid': this.uid
				}
				if(this.is_follow){
					doctorDelFollow(where).then(res => {
						//console.log('rk==>[res]'+JSON.stringify(res));
						if (res.ret == 200) {
							this.is_follow = !this.is_follow;
							// this.doctorFollow.is_follow = this.is_follow;
							let dPost = {
								'id': this.doctor_id,
								'is_follow': this.is_follow,
							}
							uni.$emit('yy_ctr_follow', dPost);
						}
						that.$util.Tips({
							title: res.message
						});
					});
				}else{
					doctorFollow(where).then(res => {
						//console.log('rk==>[res]'+JSON.stringify(res));
						if (res.ret == 200) {
							this.is_follow = !this.is_follow;
							// this.doctorFollow.is_follow = this.is_follow;
							let dPost = {
								'id': this.doctor_id,
								'is_follow': this.is_follow,
							}
							uni.$emit('yy_ctr_follow', dPost);
						}
						that.$util.Tips({
							title: res.message
						});
					});
				}
				
			},

			/**
			 * 选择方式
			 */
			chatChange(val) {
				if (val > 0) {
					this.selType = 1;
				} else {
					this.selType = -1;
				}
				
			},
			
			startInquiry() {
				// 医生、医助无法发起问诊
				if(this.doctorInfo.is_inquiry == 1){
					return this.$util.Tips({
						title: this.doctorInfo.is_inquiry_msg
					});
				}
				
				if (this.selType == -1) {
					return this.$util.Tips({
						title: '请选择问诊方式'
					});
				}else if(this.selType == 1){
					this.clickPicTxt();
				}
			},
			
			/**
			 * 图文
			 */
			clickPicTxt() {
				let param = JSON.stringify(this.doctorInfo)
				uni.navigateTo({
					url: '/pages/shops/subs_inquiry/picture_text/index?doctorInfo=' 
					+ param
				})
			},
			
			alertGoNext(){
				this.videoPopShow = false;
				uni.navigateTo({
					url:'/pages/shops/subs_inquiry/time_select/timeSelect?id='
					+this.doctor_id
					+ '&price=' + this.doctorInfo.money_audio
					+ '&mer_id=' + this.doctorInfo.mer_id,
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff;
	}

	.ysxx {
		border-bottom: solid 1rpx #f5f5f5;

		.header {
			margin-top: 30rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			color: #3e3e3e;

			image {
				width: 180rpx;
				height: 180rpx;
				background-color: aqua;
				border-radius: 50%;
				margin-bottom: 10rpx;
			}

			.ysmz {
				font-size: 48rpx;
				height: 60rpx;
				line-height: 60rpx;
				font-weight: 600;
			}

			.ysxx-gzys {
				background-color: #36cf89;
				color: #fff;
				border-radius: 20rpx;
				text-align: center;
				padding: 2rpx 10rpx;
				display: flex;
				font-size: 20rpx;
				display: flex;
				align-items: center;

				.iconfont {
					font-size: 20rpx;
					color: #fff661;
					padding-right: 8rpx;
				}
			}

			.header-text1 {
				display: flex;
				justify-content: center;
				align-items: center;

				.expert {
					margin: 0 10rpx;
					padding: 2rpx 10rpx;
					border-radius: 5rpx;
					background-color: #f6f4ff;
					color: #735bf5;
					font-size: 20rpx;
				}
			}

			.header-text2 {
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				height: 80rpx;
				line-height: 80rpx;

				.hpl {
					margin-right: 20rpx;

					text {
						padding-left: 5rpx;
						color: #36cf89;
						font-size: 40rpx;
						font-weight: 600;
					}
				}

				.wzl {
					text {
						padding-left: 5rpx;
						color: #36cf89;
						font-size: 40rpx;
						font-weight: 600;
					}
				}
			}
		}

		.ysxx-content {
			color: #999;
			font-size: 26rpx;
			padding: 20rpx 40rpx;
			line-height: 40rpx;

			.c-des {
				margin-bottom: 10rpx;
			}
		}
	}

	.zhpf {
		margin-bottom: 30rpx;

		.title {
			height: 60rpx;
			line-height: 60rpx;
			font-size: 28rpx;
			font-weight: 500;
			padding-left: 30rpx;
			margin-top: 30rpx;
			border-bottom: #f5f5f5 solid 1rpx;
		}

		.xingji {
			padding-top: 10rpx;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			color: #ff6a00;

			.txt {
				margin-left: 10rpx;
				font-size: $yy-title-font;
			}
		}
	}

	.service-content {
		.title {
			height: 60rpx;
			line-height: 60rpx;
			font-size: 28rpx;
			font-weight: 500;
			padding-left: 30rpx;
		}

		.service-zt {
			height: 200rpx;
			display: flex;
			justify-content: center;
			border-top: #f5f5f5 solid 1rpx;
			border-bottom: #f5f5f5 solid 1rpx;
			align-items: center;

			.zxzx {
				border-right: #f5f5f5 solid 1rpx;
				width: 45%;
				height: 200rpx;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				text-align: center;

				.zxzx-img {
					width: 130rpx;
					height: 130rpx;
					margin-right: 20rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.zxzx-font {
					display: flex;
					flex-direction: column;
					align-items: flex-start;

					text {
						color: red;
						font-size: 20rpx;
					}
				}

			}

			.twwz {
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				width: 45%;
				height: 200rpx;

				.twwz-img {
					width: 130rpx;
					height: 130rpx;
					margin-right: 20rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.twwz-font {
					display: flex;
					flex-direction: column;

					text {
						color: red;
						font-size: 20rpx;
					}
				}

			}
		}
	}

	.service-box {
		.title {
			font-size: 28rpx;
			font-weight: 500;
			padding: 20rpx 30rpx;
			border-top: 2rpx solid #eee;
			border-bottom: 2rpx solid #eee;
		}

		.content-box {
			padding: 20rpx 40rpx;

		}
	}
	.safe-height {
		height: 120rpx;
		height: calc(120rpx + constant(safe-area-inset-bottom));
		height: calc(120rpx + env(safe-area-inset-bottom));
	}
	.footer {
		position: fixed;
		bottom: 0;
		width: 100%;
		background-color: #fff;
		
		.btn-box {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 120rpx;
			.btn {
				background-color: $yy-main-col;
				color: #fff;
				padding: 15rpx 80rpx;
				border-radius: 100rpx;
			}
		}
	}
	
	/deep/.uni-data-checklist .checklist-group .checklist-box .checkbox__inner {
		border-radius: 16px !important;
	}
	
	/deep/.uni-data-checklist .checklist-group .checklist-box .checklist-content .checklist-text {
		color: #323232 !important;
		font-size: 32rpx !important;
	}
	
	/deep/.uni-data-checklist .checklist-group .checklist-box.is--default.is-checked .checkbox__inner {
		border-color: $yy-main-col !important;
		background-color: $yy-main-col !important;
	}
	
	/deep/.uni-data-checklist .checklist-group .checklist-box.is--default.is-checked .checklist-text {
		color: #323232 !important;
		font-size: 32rpx !important;
	}
</style>

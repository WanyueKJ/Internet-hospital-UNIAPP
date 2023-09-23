<template>
	<view>
		<view style="padding-top: 6rpx;">
			<view class="box_doctor">
				<!-- 个人信息部分 -->
				<view class="doctor_information">
					<view class="doctor_information_box">
						<view class="headportrait">
							<image :src="doctorDetails.img"></image>
						</view>
						<view class="information">
							<view class="box">
								<view class="box_name">{{ doctorDetails.name }}</view>
								<!-- <view class="position">{{ doctorDetails.professional }}</view> -->
							</view>
							<!-- <view class="types">{{ doctorDetails.department_name }}</view> -->
						</view>
					</view>
				</view>
				<!-- 技能 -->
				<view class="doctor_skill">{{ doctorDetails.message }}</view>
			</view>
		</view>
		<view class="doctor_bottom">
			<view class="navnar">
				<view v-for="(item, index) in navbar" :key="index" class="tap">
					<view :class="['top_time1', currentTab === index ? 'actives' : '']" @click="addtap(index)">
						{{ item.name }}
					</view>
				</view>
			</view>
			<view class="headdate">
				<view v-if="currentTab == 0">
					<!-- 时间列表 -->
					<view class="data_list">
						<view v-for="(item1, index) in doctorDetails.info" :key="index">
							<view class="son_item" @click="clickappointment(item1)">
								<view class="left">{{ item1 }}</view>
								<view class="right acea-row row-middle">
									<text>￥{{ doctorDetails.cost }}</text>
									<view class="iconfont icon-xiangyou"></view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view v-else>
					<view class="introduce">
						<text class="title">擅长</text>
						<view class="content">{{ doctorDetails.message }}</view>
					</view>
					<view class="introduce">
						<text class="title">介绍</text>
						<view class="content item">
							<view>{{ doctorDetails.content }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
			<!-- <view @tap="chooseMenu">455</view> -->
		<make-appointment :tips="showActionSheet.tips" :testdatalist="testdata" :itemList="showActionSheet.itemList"
				:show="showActionSheet.show" :maskClosable="showActionSheet.maskClosable"
				:isCancel="showActionSheet.isCancel" @chooseCancel="chooseCancel" :appData="appData"
				@payClose="payClose"></make-appointment>
		

	</view>
</template>

<script>
	var _self;
	let globalData = getApp().globalData;
	import makeAppointment from '../components/makeAppointment/index.vue';
	import {
		getDoctorDetails,
		appointmentListapi
	} from '@/api/appointment.js';
	import navBar from '../components/navBar/index.vue';
	import {
		mapGetters
	} from 'vuex';
	
	
	export default {
		
		components: {
			navBar,
			makeAppointment,
			
		},
		data() {
			return {
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false, //是否隐藏授权
				appData: globalData,
				doctorId: '', //医生id
				active: 0,
				tableFrom: {
					page: 1,
					limit: 20
				},
				week: '', //周几
				times: '', //时间
				doctorDetails: {},
				// 默认激活样式是第一个
				navbar: [{
						name: '预约'
					},
					{
						name: '介绍'
					}
				],
				currentTab: 0,
				showActionSheet: {
					show: false,
					maskClosable: true,
					itemList: {
						dates: '',
						tiem: {}
					},
					color: '#9a9a9a',
					size: 26,
					isCancel: true
				},
				testdata: {
					id: '',
					name: ''
				},
			};
		},
		onLoad(options) {
			this.doctorId = options.id;
			this.get_doctor_details();
			let that = this
			uni.$on('yy_patient_add', data => {
				//console.log('rk===>sel suc:' + JSON.stringify(data))
				that.testdata = data;
				
			});
			
		},
		onUnload() {
			uni.$off('yy_patient_add')
		},
		onShow() {

		},
		methods: {
			// 授权关闭
			authColse: function(e) {
				console.log(e, 'authColse');
				this.isShowAuth = e;
			},
			onLoadFun() {
				this.isShowAuth = false;
			},
			payClose() {
				this.get_doctor_details();
			},
			addtap(i) {
				this.currentTab = i;
			},
			
			clickappointment(item) {
				this.showActionSheet.itemList = this.doctorDetails
				this.showActionSheet.itemList.create_time = item
				this.showActionSheet.show = true;
			},

			chooseCancel1() {
				uni.showToast({
					title: '请添加预约人',
					icon: 'none', //如果要纯文本，不要icon，将值设为'none'
					duration: 2000, //持续时间为 2秒
					mask: true
				});
			},
			// 弹窗关闭
			chooseCancel() {
				this.showActionSheet.show = false;
			},
			getAppointmentList: function() {

				appointmentListapi(this.tableFrom).then(res => {});
			},
			get_doctor_details: function() {
				let that = this;
				getDoctorDetails({
					'id': that.doctorId
				}).then(res => {
					this.doctorDetails = res.data.info;
				});
			},
		}
	};
</script>

<style lang="scss">
	
	// 医生列表样式
	.box_doctor {
		width: calc(100% - 36rpx);
		margin: 0 auto;
		padding: 20rpx 20rpx 36rpx 20rpx;
		background: #fff;

		.doctor_information {
			.doctor_information_box {
				display: flex;
			}

			.headportrait {
				width: 115rpx;
				height: 115rpx;
				margin-right: 27rpx;

				image {
					width: 100%;
					height: 100%;
					border-radius: 50%;
					overflow: hidden;
				}
			}

			.information {
				padding-top: 26rpx;
				line-height: 1;
				flex: 1;
				overflow: hidden;

				.box {
					.box_name {
						color: #000;
						margin-right: 5rpx;
						font-size: 34rpx;
						font-weight: 700;
						display: inline-block;
					}

					.position {
						display: inline-block;
						color: #3e3e3e;
						font-size: 26rpx;
					}
				}

				.types {
					color: #e93429;
					margin-top: 18upx;
					font-size: 24rpx;
				}
			}
		}

		.doctor_skill {
			color: #9c9c9c;
			margin-top: 22rpx;
			font-size: 24rpx;
			line-height: 1.5;
		}
	}

	//挂号的样式
	.navnar {
		display: flex;
		justify-content: space-around;
	}

	.top_time1 {
		color: #3e3e3e;
		text-align: center;
		padding-bottom: 10rpx;
	}

	.actives {
		color: red;
		width: 70rpx;
		border-bottom: 2rpx solid red;
	}
	
	.headdate {
		
		.data_list {
			.son_item {
				padding-top: 20rpx;
				display: flex;
				flex-direction: row;
				align-items: center;
			}
			.left {
				color: #3e3e3e;
				font-size: 28rpx;
				display: flex;
				flex:1;
				margin-right: 20rpx;
			}
			.right {
				display: flex;
			
				text {
					color: #e93429;
					font-size: 28rpx;
					margin-right: 36upx;
				}
			
				view {
					color: #9c9c9c;
					font-size: 26rpx;
				}
			}
		}

		.introduce {
			margin-top: 60upx;

			.title {
				color: #3e3e3e;
				font-size: 26upx;
				font-weight: 700;
			}

			.content {
				color: #9c9c9c;
				font-size: 26rpx;
				margin-top: 20rpx;
			}

			.item {
				view {
					margin: 10upx 0;
				}
			}
		}

		.top {
			display: flex;
			justify-content: space-around;
			margin-top: 20upx;

			.actives {
				background-color: #e93429;

				view {
					color: #ffffff;
				}
			}
		}
	}

	.doctor_bottom {
		background: #fff;
		margin: 19rpx 18rpx;
		width: calc(100% - 36rpx);
		padding: 34rpx 15rpx;
	}
</style>
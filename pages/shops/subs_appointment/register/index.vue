<template>
	<view>
		<navBar title="预约服务" background="#fff" :align="'center'">
		</navBar>
		<!-- 医生列表 -->
		<view style="padding: 10rpx 18rpx 18rpx 18rpx;">
			<navigator
				:url="`/pages/shops/subs_appointment/doctorhome/index?id=${item.id}`"
				class="box_doctor" v-for="(item, index) in listDoctors">
				<!-- 个人信息部分 -->
				<view class="doctor_information" v-if="listDoctors && listDoctors.length > 0">
					<view class="doctor_information_box">
						<view class="headportrait">
							<image :src="item.img"></image>
						</view>
						<view class="information">
							<view class="box">
								<view class="box_name">{{ item.name }}</view>
							</view>
							<view class="acea-row row-bottom row-between">
								<view class="position">{{ item.content }}</view>
								<view class="addbutton">预约</view>
							</view>
						</view>
					</view>
				</view>
				</navigator> 
			</navigator>
			<block v-if="listDoctors.length == 0">
				<emptyPage title="暂无预约～"></emptyPage>
			</block>
		</view>
	</view>
</template>

<script>
	let app = getApp();
	var _self;
	import {
		doctorsListapi
	} from '@/api/appointment.js';
	import navBar from '../components/navBar/index.vue';
	import emptyPage from '@/components/emptyPage.vue';
	let systemInfo = uni.getSystemInfoSync();
	var marT = 4,
		titleH = systemInfo.statusBarHeight + 40,
		paddingTop = systemInfo.statusBarHeight;
	
	export default {
		computed: {
			
		},
		components: {
			navBar,
			emptyPage
		},
		data() {
			return {
				titleH,
				active: 0,
				departmentid: '1',
				todayTime: null,
				loadend: false,
				loading: false,
				loadTitle: '加载更多',
				listDoctors: [], //医生列表
				appointmentDate: [],
				formDoctors: {
					page: 1,
					limit: 10,
					mer_id: '',
					service_time: '',
					department_id: '',
					keyword: ''
				},
				mer_name: ''
			};
		},
		onLoad() {
			this.doctorsList()
		},
		onShow() {
			
		},
		mounted() {},
		methods: {
			/**
			 * 获取医生列表
			 */
			doctorsList(){
				let that = this
				doctorsListapi()
					.then(res => {
						that.listDoctors = res.data.info
					})
					.catch(err => {
						
					});
			},
			
		}
	};
</script>

<style lang="scss">
	.location {
		font-size: 24rpx;
		margin-left: 40rpx;
		line-height: 1;
		flex: 1;
		overflow: hidden;

		.iconfont {
			font-size: 22rpx;
		}

		.line1 {
			margin: 0 10rpx;
			max-width: calc(100% - 80rpx);
		}
	}

	.top {
		background: #fff;

		.actives {
			background-color: $yy-main-col;

			view {
				color: #ffffff;
			}
		}

		.opten {
			display: flex;
			white-space: nowrap;
			border-top: solid 1rpx #f5f5f5;
			border-bottom: solid 1rpx #f5f5f5;
			box-sizing: border-box;
			height: 110rpx;
		}
	}

	.top_time {
		width: 125rpx;
		height: 110rpx;
		display: inline-flex;
		flex-wrap: wrap;
		background-color: #fff;
		justify-content: center;
		align-items: center;
		padding: 15rpx 0;
		border-right: solid 1rpx #f5f5f5;

		&:last-child {
			border-right: none;
		}

		view {
			font-size: 28upx;
			color: #a3a0a1;
			z-index: 99;
		}
	}

	// 医生列表样式
	.box_doctor {
		background-color: #ffffff;
		border-radius: 20upx;
		width: 100%;
		padding: 25rpx 22rpx 30rpx 35rpx;
		margin-bottom: 30rpx;
		box-sizing: border-box;

		.doctor_information {
			.doctor_information_box {
				width: 100%;
				display: flex;
			}

			.headportrait {
				width: 113rpx;
				height: 113rpx;
				margin-right: 30rpx;

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
					color: $yy-main-col;
					margin-top: 18upx;
					font-size: 24rpx;
				}

				.addbutton {
					background-color: $yy-main-col;
					color: #fff;
					font-size: 24rpx;
					text-align: center;
					line-height: 40rpx;
					height: 40rpx;
					border-radius: 20rpx;
					padding: 0 30rpx;
				}
			}
		}

		.doctor_skill {
			color: #9c9c9c;
			margin-top: 22rpx;
			font-size: 24rpx;
			line-height: 1;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}

	.search {
		padding: 10rpx 0 10rpx 30rpx;
		background: #fff;

		.input {
			width: 598rpx;
			background-color: #f7f7f7;
			border-radius: 32rpx;
			padding: 0 36rpx;
			box-sizing: border-box;
			height: 66rpx;

			.iconfont {
				color: #000;
				font-size: 36rpx;
			}

			input {
				width: 472rpx;
				font-size: 28rpx;
			}
		}

		.bnt {
			width: 120rpx;
			text-align: center;
			height: 66rpx;
			line-height: 66rpx;
			font-size: 30rpx;
			color: #282828;
		}
	}

	.beFixed {
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 9;
		left: 0;
		box-sizing: border-box;
	}
</style>

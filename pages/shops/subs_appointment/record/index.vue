<template>
	<view class="box_record">
		<view class="content" v-for="(item, index) in listDoctors">
			<view>
				<view class="top">
					<text class="names">{{ item.user_name }}</text>
					<text class="phone">{{ item.phone }}</text>
				</view>
				<view class="bottom">
					<view class="left">
						<view>
							<text>医师 :</text>
							<text>{{ item.name }}</text>
						</view>
						<view>
							<text>费用 :</text>
							<text class="cost">{{ item.money }}</text>
						</view>
						<view>
							<text style="font-size: 24rpx;">时段 :</text>
							<text style="font-size: 24rpx;">{{ item.servicetime }}</text>
						</view>
					</view>
					<!-- 0未完成 1完成 -->
					<view v-if="item.status == 1" class="cancel2">
						<view class="right">已完成</view>
					</view>
					<view v-else class="cancel2">
						<view class="right">未完成</view>
					</view>
				</view>
			</view>
		</view>
		<view class="loadingicon acea-row row-center-wrapper" v-if="listDoctors.length > 0">
			<text class="loading iconfont icon-jiazai" :hidden="loading == false"></text>
			{{ loadTitle }}
		</view>
		<block v-if="listDoctors.length == 0">
			<emptyPage title="暂无预约记录～"></emptyPage>
		</block>
	</view>
</template>

<script>
	var _self;
	import {
		subscribeList
	} from '@/api/appointment.js';
	import emptyPage from '@/components/emptyPage.vue';
	
	export default {
		computed: {
			
		},
		components: {
			emptyPage
		},
		data() {
			return {
				show: false,
				loadend: false,
				loading: false,
				loadTitle: '加载更多',
				tableFrom: {
					page: 1,
					num: 10
				},
				listDoctors: []
			};
		},
		onPullDownRefresh(){
			console.log('rk==>refresh')
			this.getSubscribeList(true);
		},
		onLoad() {
			_self = this;
			this.getSubscribeList(true);
		},
		methods: {
			getSubscribeList: function(isPage) {
				if (isPage === true) {
					_self.tableFrom.page = 1;
					_self.loadend = false;
					_self.loading = false;
					_self.loadTitle = '加载更多';
					_self.$set(_self, 'listDoctors', []);
				}
				if (_self.loadend) return;
				if (_self.loading) return;
				_self.loading = true;
				_self.loadTitle = '';
				subscribeList(this.tableFrom)
					.then(res => {
						const list = res.data.info;

						let listDoctors = _self.$util.SplitArray(list.data, _self.listDoctors);
						let loadend = list.length < _self.tableFrom.limit;
						_self.loadend = loadend;
						_self.loading = false;
						_self.loadTitle = loadend ? '已全部加载' : '加载更多';
						_self.$set(_self, 'listDoctors', listDoctors);
						_self.$set(_self.tableFrom, 'page', _self.tableFrom.page + 1);
					})
					.catch(err => {
						_self.loading = false;
						_self.loadTitle = '加载更多';
					});
			},

			// 触底的事件
			onReachBottom() {
				this.getSubscribeList();
			},
			
		}
	};
</script>

<style lang="scss">
	.box_record {
		.popup-info {
			background: rgba(0, 0, 0, 0.6);
			position: fixed;
			width: 100%;
			height: 100%;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			font-size: 30upx;
			padding: 40upx;
			// border-radius: 20upx;
			z-index: 9999;
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 999;

			.tankuang1 {
				border-radius: 10upx;
				width: 600upx;
				// height: 400upx;
				padding: 20upx 10upx 0 10upx;

				background: #ffffff;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				position: relative;
				z-index: 9999;

				.title {
					text-align: center;
				}

				.uni-column {
					width: 100%;
				}

				.bottom_button {
					height: 80upx;
					border-top: 1upx solid #cecece;
					// padding-top: 20upx;
					width: 100%;
					display: flex;
					justify-content: space-around;

					.left {
						border-right: 1upx solid #cecece;
					}

					.right {
						color: rgb(0, 122, 255);
					}

					button {
						height: 100%;
						font-size: 34upx;
						width: 50%;
						line-height: 80upx;
					}
				}
			}
		}

		padding: 0 20upx;

		.content {
			width: 100%;
			// height: 240upx;
			padding: 20upx;
			border-radius: 20upx;
			margin-top: 20upx;
			background-color: #ffffff;

			.top {
				.names {
					font-size: 28upx;
					font-weight: 700;
				}

				.phone {
					font-size: 22upx;
				}
			}

			.bottom {
				display: flex;
				justify-content: space-between;

				.left {
					text {
						margin-right: 10upx;
						color: #3e3e3e;
						font-size: 28rpx;

						&:last-child {
							margin-right: 0;
						}
					}

					.cost {
						color: #e93429;
					}
				}

				.cancel {
					display: flex;
					flex-direction: column-reverse;

					.right {
						width: 200upx;
						height: 60upx;
						text-align: center;
						line-height: 60upx;
						border: 2upx solid #e93429;
						font-size: 22upx;
						font-family: Source Han Sans CN;
						font-weight: 400;
						color: #e93429;
					}
				}

				.cancel2 {
					display: flex;
					flex-direction: column-reverse;

					.right {
						width: 200upx;
						height: 60upx;
						text-align: center;
						line-height: 60upx;
						border: 2upx solid #999999;
						font-size: 22upx;
						font-family: Source Han Sans CN;
						font-weight: 400;
						color: #999;
					}
				}
			}
		}

		.aa {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: rgba(0, 0, 0, 0.6);
			z-index: 999;
		}

		.inquiry {
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			padding: 10upx;
			width: 500upx;
			height: 200upx;
			border-radius: 10upx;
			background-color: #ffffff;
			z-index: 9999;
		}
	}
</style>

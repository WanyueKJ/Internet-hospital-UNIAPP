<template>
	<view>
		<form report-submit='true'>
			<h2>修改昵称</h2>
			<view class="ChangePassword">
				<view class="list">
					<view class="item">
						<input type='text' name='nickname' :value='userInfo.nickname' disabled></input>
					</view>
					<view class="item acea-row row-between-wrapper">
						<input type='text' placeholder='新昵称' placeholder-class='placeholder' class="codeIput"
							v-model="inputcontent"></input>
					</view>
				</view>
				<button form-type="submit" @click="inputEdita" class="confirmBnt">确认修改</button>
			</view>
		</form>
		<authorize @onLoadFun="onLoadFun" :isAuto="isAuto" :isShowAuth="isShowAuth" @authColse="authColse"></authorize>
	</view>
</template>

<script>
	// +----------------------------------------------------------------------
	// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
	// +----------------------------------------------------------------------
	// | Copyright (c) 2016~2021 https://www.crmeb.com All rights reserved.
	// +----------------------------------------------------------------------
	// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
	// +----------------------------------------------------------------------
	// | Author: CRMEB Team <admin@crmeb.com>
	// +----------------------------------------------------------------------
	import {
		getUserInfo,
		updateInfo
	} from '@/api/user.js'
	import {
		mapGetters
	} from "vuex";
	import authorize from '@/components/Authorize';
	export default {
		components: {
			authorize
		},
		data() {
			return {
				userInfo: {},
				inputcontent: "",
				isAuto: false,
				isShowAuth: false, //是否隐藏授权
			};
		},
		
		onLoad() {
			let user = uni.getStorageSync('userinfo')
			if (user && user.id > 0) {
				this.getUserInfo();
				this.isShowAuth = false
			} else {
				this.isAuto = true;
				this.isShowAuth = true
			};

		},
		methods: {

			/**
			 * 获取用户详情
			 */
			getUserInfo: function() {
				let that = this;
				getUserInfo().then(res => {
					that.$set(that, 'userInfo', res.data.info[0]);
				});
			},

			inputEdita() {
				// console.log(this.inputcontent);
				// this.userInfo.nickname = this.inputcontent
				if (this.userInfo.nickname == this.inputcontent) {
					uni.showToast({
						title: '昵称重复，请重新修改！',
						icon:'none',
						// itemColor:'red'
					});
				} else if (this.inputcontent == '') {
					uni.showToast({
						title: '昵称不能为空！',
						icon: 'none',
					});
				} else {
					let dic = {'user_nickname':this.inputcontent}
					updateInfo({
						'fields': JSON.stringify(dic)
					}).then(res => {
						return this.$util.Tips({
							title: '修改成功！',
							icon: 'success'
						}, {
							tab: 5,
							url: '/pages/users/user_info/index'
						});
					})
				}
			},



			/**
			 * 授权回调 
			 */
			onLoadFun: function() {
				this.isShowAuth = false;
				this.getUserInfo();
			},
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},


		}
	}
</script>

<style lang="scss">
	h2 {
		text-align: center;
		margin-top: 30rpx;
		font-weight: 600;
	}

	page {
		background-color: #fff !important;
	}

	.ChangePassword .phone {
		font-size: 32rpx;
		font-weight: bold;
		text-align: center;
		margin-top: 55rpx;
	}

	.ChangePassword .list {
		width: 580rpx;
		margin: 53rpx auto 0 auto;
	}

	.ChangePassword .list .item {
		width: 100%;
		height: 110rpx;
		border-bottom: 2rpx solid #f0f0f0;
	}

	.ChangePassword .list .item input {
		width: 100%;
		height: 100%;
		font-size: 32rpx;
	}

	.ChangePassword .list .item .placeholder {
		color: #b9b9bc;
	}

	.ChangePassword .list .item input.codeIput {
		width: 340rpx;
	}

	.ChangePassword .list .item .code {
		font-size: 32rpx;
		background-color: #fff;
		color: var(--view-theme);
	}

	.ChangePassword .list .item .code.on {
		color: #b9b9bc;
	}

	.ChangePassword .confirmBnt {
		font-size: 32rpx;
		width: 580rpx;
		height: 90rpx;
		border-radius: 45rpx;
		color: #fff;
		margin: 92rpx auto 0 auto;
		text-align: center;
		line-height: 90rpx;
		background-color: var(--view-theme);
	}

	.getPhoneBtn {
		font-size: 32rpx;
		width: 580rpx;
		height: 90rpx;
		border-radius: 45rpx;
		border: 1rpx solid #3CB625;
		color: #3CB625;
		margin: 40rpx auto 0 auto;
		text-align: center;
		line-height: 90rpx;

		.iconfont {
			font-size: 32rpx;
			margin-right: 12rpx;
		}
	}
</style>

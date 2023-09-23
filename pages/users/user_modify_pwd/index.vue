<template>
	<view>
		<form report-submit='true'>
			<view>
				<view class="ChangePassword">
					<view class="list">
						<view class="item">
							<text class="phone">{{userInfo.mobile}}</text>
						</view>
						<view class="border"></view>

						<view class="item">
							<input type='password' placeholder='请输入旧密码' placeholder-class='placeholder' v-model="password" autocomplete="off"></input>
						</view>
						<view class="item">
							<input type='password' placeholder='请输入新密码' placeholder-class='placeholder' v-model="repassword" autocomplete="off"></input>
						</view>
					</view>
				</view>
				<button form-type="submit" @click="confirmSubmit" class="confirmBnt">确认</button>
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
	import sendVerifyCode from "@/mixins/SendVerifyCode";
	import { registerVerify,modifyPassword,getUserInfo } from '@/api/user.js';
	import {
		mapGetters
	} from "vuex";
	import authorize from '@/components/Authorize';
	export default {
		mixins: [sendVerifyCode],
		components: {
			authorize
		},
		data() {
			return {
				userInfo: {},
				phone:'',
				repassword: '',
				password: '',
				captcha:'',
				isAuto: false, //没有授权的不会自动授权
				isShowAuth: false, //是否隐藏授权
				key: '',
				codeVal: '',
				disabled: false,
			};
		},
		onLoad() {
			let that = this
			let user = uni.getStorageSync('userinfo')
			if (user && user.id>0) {
				this.getUserInfo()
				this.isShowAuth = false
			} else {
				this.isAuto = true;
                this.isShowAuth = true
			}
			
		},
		methods: {
			onLoadFun:function(){
				this.isShowAuth = false;
			},
			// 授权关闭
			authColse: function(e) {
				this.isShowAuth = e
			},
			/**
			 * 获取个人用户信息
			 */
			getUserInfo: function() {
				let that = this;
				getUserInfo().then(res => {
					that.userInfo = res.data.info[0]
				});
			},
			confirmSubmit: function() {
				let that = this;
				if (!that.password) return that.$util.Tips({
					title: '请填写旧密码！'
				});
				if (!that.repassword) return that.$util.Tips({
					title: '请输入新密码！'
				});
				
				modifyPassword({
					oldpass: that.password,
					newpass: that.repassword,
					
				}).then(res => {
					return that.$util.Tips({
						title: '修改成功！',
						icon: 'success'
					}, {
						tab: 5,
						url: '/pages/users/user_info/index'
					});
				}).catch(err => {
					return that.$util.Tips({
						title: err
					});
				})
			},
			/**
			 * 发送验证码
			 *
			 */
			async code() {
				let that = this;
				// if (!(/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.userInfo.phone))) return that.$util.Tips({
				// 	title: '请输入正确的手机号码！'
				// });
				this.disabled = true
				await registerVerify({
					phone:that.userInfo.phone,
					code:that.captcha,
					type: 'change_pwd'
				}).then(res => {
					this.disabled = false
					that.$util.Tips({
						title: res.msg
					});
					that.sendCode();
				}).catch(err => {
					this.disabled = false
					return that.$util.Tips({
						title: err
					});
				});
			}
		}
	}
</script>

<style lang="scss">
	.ChangePassword{
		background: #fff;
		padding-top: 53rpx;
	}
	.ChangePassword .phone {
		font-size: 32rpx;
	}

	.ChangePassword .list .item {
		width: 580rpx;
		margin: 0 auto;
		height: 110rpx;
		border-bottom: 2rpx solid #f0f0f0;
		display: flex;
		align-items: center;
	}

	.ChangePassword .list .item input {
		width: 100%;
		font-size: 32rpx;

	}
	/deep/.uni-input-input{
		// box-shadow: inset 0 0 0 0 #fff;
	}

	.ChangePassword .list .item .placeholder {
		color: #b9b9bc;
	}

	.ChangePassword .list .item input.codeIput {
		width: 340rpx;
	}

	.ChangePassword .list .item .code {
		font-size: 32rpx;
		position: relative;
		padding-left: 26rpx;
		color: var(--view-theme);
		&::before{
			content: "";
			width: 1rpx;
			height: 30rpx;
			position: absolute;
			top: 10rpx;
			left: 0;
			background: #DDDDDD;
			display: inline-block;
		}
	}
	.ChangePassword .list .item .code.on {
		color: #b9b9bc !important;
	}
	.ChangePassword .list .border{
		width: 100%;
		height: 21rpx;
		background: #F5F5F5;
	}
	.confirmBnt {
		font-size: 32rpx;
		width: 580rpx;
		height: 90rpx;
		border-radius: 45rpx;
		color: #fff;
		margin: 70rpx auto 0 auto;
		text-align: center;
		line-height: 90rpx;
		background-color: red;
	}
	.getPhoneBtn{
		font-size: 32rpx;
		width: 580rpx;
		height: 90rpx;
		border-radius: 45rpx;
		border: 1rpx solid var(--view-theme);
		color: var(--view-theme);
		margin: 40rpx auto 0 auto;
		text-align: center;
		line-height: 90rpx;
		.iconfont{
			font-size: 32rpx;
			margin-right: 12rpx;
		}
	}
</style>

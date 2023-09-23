<template>
	<div class="register absolute">
		<div class="shading">
			<div class="pictrue acea-row row-center-wrapper">
				<image src="/static/images/login_logo.png" />
			</div>
		</div>
		<div class="whiteBg">
			<div class="title">忘记密码</div>
			<div class="list">
				<div class="item">
					<div class="acea-row row-middle">
						<image src="/static/images/phone_1.png"></image>
						<input type="text" placeholder="输入手机号码" v-model="account" autocomplete="off" />
						<input type="text" style="height: 0;opacity: 0">
					</div>
				</div>
				<div class="item">
					<div class="acea-row row-middle">
						<image src="/static/images/code_2.png"></image>
						<input type="password" placeholder="填写您的新密码" v-model="password" autocomplete="off" />
					</div>
				</div>
				<div class="item">
					<div class="acea-row row-middle">
						<image src="/static/images/code_2.png"></image>
						<input type="password" placeholder="再次输入新密码" v-model="confirm_pwd" autocomplete="off" />
					</div>
				</div>
				<div class="item">
					<div class="acea-row row-middle">
						<image src="/static/images/code_2.png"></image>
						<input type="text" placeholder="填写验证码" class="codeIput" v-model="captcha" autocomplete="off" />
						<button class="code" :disabled="disabled" :class="disabled === true ? 'on' : ''" @click="code">
							{{ text }}
						</button>
					</div>
				</div>
				
			</div>
			<div class="logon" @click="registerReset">确认</div>
			<div class="tip">
				<span class="font-color-red" @click="back">立即登录</span>
			</div>
		</div>
		<div class="bottom"></div>
	</div>
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
	const app = getApp();
	import sendVerifyCode from "@/mixins/SendVerifyCode";
	import {
		registerVerify,
		registerForget,
		loginH5
	} from "@/api/user";
	
	import attrs, {
		required,
		alpha_num,
		chs_phone
	} from "@/utils/validate";
	

	export default {
		name: "RetrievePassword",
		mixins: [sendVerifyCode],
		data: function() {
			return {
				account: "",
				password: "",
				confirm_pwd: "",
				captcha: "",
				codeVal: "",
				
			};
		},
		
		onReady() {
		},
		mounted: function() {
		},
		methods: {
			back() {
				uni.navigateBack();
			},
			
			async code() {
				let that = this;

				if (!that.account) return that.$util.Tips({
					title: '请填写手机号码'
				});
				if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.account)) return that.$util.Tips({
					title: '请输入正确的手机号码'
				});

				let sign = this.$util.sort2url({
					'account': this.account
				});
				await registerVerify({
						mobile: that.account,
						type: 3,//1登录 2注册 3忘记密码 5修改手机号
						code: that.codeVal,
						sign:sign
					})
					.then(res => {

						that.$util.Tips({
							title: res.data.msg
						});
						
						
					}).catch(res => {
						console.log(res, 'res')
						
						that.$util.Tips({
							title: res
						});
					});

			},
			

			async registerReset() {
				var that = this;
				if (!that.account) return that.$util.Tips({
					title: '请填写手机号码'
				});
				if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.account)) return that.$util.Tips({
					title: '请输入正确的手机号码'
				});
				if (that.password == '123456') return that.$util.Tips({
					title: '您输入的密码过于简单'
				});
				if (that.password != that.confirm_pwd) return that.$util.Tips({
					title: '两次密码不一致'
				});
				if (!that.captcha) return that.$util.Tips({
					title: '请填写验证码'
				});
				registerForget({
						mobile: that.account,
						code: that.captcha,
						pass: that.password,
						passs: that.confirm_pwd
					})
					.then(res => {
						that.gotoLogin()
					})
					.catch(res => {
						that.$util.Tips({
							title: res
						})
					});
			},
			gotoLogin(){
				let that = this
				loginH5({
						mobile: that.account,
						pass: that.password
					}).then(({data}) => {
						uni.setStorage({
							key: 'userinfo',
							data: data.info[0],
							success() {
								setTimeout(function() {
									uni.reLaunch({
										url: '/pages/shops/index/index'
									})
								}, 0);
							}
						});
						
					}).catch(e => {
						that.$util.Tips({
							title: e
						});
					});
			}
		}
	};
</script>
<style scoped>
	.code img {
		width: 100%;
		height: 100%;
	}
</style>

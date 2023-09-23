<template>
	<div>
		<div class="register absolute">
			<div class="shading">
				<div class="pictrue acea-row row-center-wrapper">
					<image src="/static/images/login_logo.png" />
				</div>
			</div>
			<div class="whiteBg" v-if="formItem === 1">
				<div class="title acea-row row-center-wrapper">
					<div class="item" :class="current === index ? 'on' : ''" v-for="(item, index) in navList"
						@click="navTap(index)" :key="index">
						{{ item }}
					</div>
				</div>
				<div class="list" :hidden="current !== 0">
					<form @submit.prevent="submit">
						<div class="item">
							<div class="acea-row row-middle">
								<image src="/static/images/phone_1.png"></image>
								<input type="text" placeholder="输入手机号码" placeholder-class="placeholder"
									v-model="account" required />
							</div>
						</div>
						<div class="item">
							<div class="acea-row row-middle">
								<image src="/static/images/code_2.png"></image>
								<input type="password" placeholder="填写登录密码" placeholder-class="placeholder"
									v-model="password" required />
							</div>
						</div>
					</form>
					<navigator class="forgetPwd" hover-class="none" url="/pages/users/retrievePassword/index">
						忘记密码
					</navigator>
				</div>
				<div class="list" :hidden="current !== 1">
					<div class="item">
						<div class="acea-row row-middle">
							<image src="/static/images/phone_1.png"></image>
							<input type="text" placeholder="输入手机号码" placeholder-class="placeholder" v-model="account" />
						</div>
					</div>
					<div class="item">
						<div class="acea-row row-middle">
							<image src="/static/images/code_2.png"></image>
							<input type="text" placeholder="填写验证码" placeholder-class="placeholder" class="codeIput"
								v-model="captcha" />
							<button v-debounce class="code" :disabled="disabled" :class="disabled === true ? 'on' : ''"
								@click="code">
								{{ text }}
							</button>
						</div>
					</div>
					
				</div>
				<div class="protocol acea-row row-between-wrapper">
					<checkbox-group class="checkgroup" @change='isAgree=!isAgree'>
						<checkbox class="checkbox" :checked="isAgree ? true : false" />
						<text class="protocol_text">我已同意<text @click="userAgree" class="font_pro">《用户协议》</text>与<text
								@click="userPrivacyAgree" class="font_pro">《隐私政策》</text></text>
					</checkbox-group>
				</div>
				<div class="logon" v-debounce @click="loginMobile" :hidden="current !== 1">登录</div>
				<div class="logon" v-debounce @click="submit" :hidden="current === 1">登录</div>
				<div class="tip">
					没有账号?
					<span @click="formItem = 2" class="font-color-red">立即注册</span>
				</div>

			</div>
			<div class="whiteBg" v-else>
				<div class="title">注册账号</div>
				<div class="list">
					<div class="item">
						<div class="acea-row row-middle">
							<image src="/static/images/phone_1.png"></image>
							<input type="text" placeholder="输入手机号码" placeholder-class="placeholder" v-model="account" />
						</div>
					</div>
					<div class="item">
						<div class="acea-row row-middle">
							<image src="/static/images/code_2.png"></image>
							<input type="text" placeholder="填写验证码" placeholder-class="placeholder" class="codeIput"
								v-model="captcha" />
							<button class="code" :disabled="disabled" :class="disabled === true ? 'on' : ''"
								@click="code">
								{{ text }}
							</button>
						</div>
					</div>
					<div class="item">
						<div class="acea-row row-middle">
							<image src="/static/images/code_1.png"></image>
							<input type="password" placeholder="填写您的登录密码" placeholder-class="placeholder"
								v-model="password" />
						</div>
					</div>
					
				</div>
				<div class="protocol acea-row row-between-wrapper">
					<checkbox-group class="checkgroup" @change='isAgree=!isAgree'>
						<checkbox class="checkbox" :checked="isAgree ? true : false" />
						<text class="protocol_text">我已同意<text @click="userAgree" class="font_pro">《用户协议》</text>与<text
								@click="userPrivacyAgree" class="font_pro">《隐私政策》</text></text>
					</checkbox-group>
				</div>
				<div class="logon" @click="register">注册</div>
				<div class="tip">
					已有账号?
					<span @click="formItem = 1" class="font-color-red">立即登录</span>
				</div>
			</div>
			<div class="bottom"></div>
			
		</div>
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
	
	import sendVerifyCode from "@/mixins/SendVerifyCode";
	import {
		loginH5,
		loginMobile,
		registerVerify,
		register,
		getUserInfo	
	} from "@/api/user";
	
	import attrs, {
		required,
		alpha_num,
		chs_phone
	} from "@/utils/validate";
	
	import parser from "@/components/jyf-parser/jyf-parser";
	
	import {
		mapGetters
	} from "vuex";
	
import { HTTP_REQUEST_URL } from "../../../config/app";

	export default {
		name: "Login",
		mixins: [sendVerifyCode],
		components: {
			"jyf-parser": parser
		},
		data: function() {
			return {
				navList: ["账号登录", "快速登录"],
				current: 1,
				account: "",
				password: "",
				formItem: 1,//1注册，2是登录
				type: "login",
				captcha:'',
				codeVal: "",//国家区号，默认为空=86
				tagStyle: {
					img: 'width:100%;display:block;'
				},
				isAgree: false,
				agreement: '',
				clickCode:false,
				userXieyi:HTTP_REQUEST_URL + '/appapi/page/detail?id=3',
				userYinsi:HTTP_REQUEST_URL + '/appapi/page/detail?id=5',
			};
		},
		watch: {
			formItem: function(nval, oVal) {
				if (nval == 1) {
					this.type = 'login'
				} else {
					this.type = 'register'
				}
			}
		},
		onLoad() {
			
		},
		mounted: function() {

		},
		
		methods: {
			saveLocalData(info){
				console.log(info)
				uni.setStorage({
					key: 'userinfo',
					data: info,
					success() {
						setTimeout(function() {
							let pages = getCurrentPages();
							if (pages.length == 1) {
								uni.reLaunch({
									url: '/pages/shops/index/index'
								})
							} else {
								let beforePage = pages[pages
									.length - 2];
								uni.navigateBack({
									delta: 1
								})
							}
						}, 0);
					}
				});
				
			},
			userAgree() {
				uni.navigateTo({
					url: '/pages/webview/webview?url=' + this.userXieyi
				})
			},
			userPrivacyAgree() {
				uni.navigateTo({
					url: '/pages/webview/webview?url=' + this.userYinsi
				})
			},
			getSystem(system) {
				if (system.indexOf('iOS') === -1) {
					return system
				} else {
					let str = system.split(' ')[1]
					if (str.indexOf('.')) {
						return Number(str.split('.')[0])
					} else {
						return Number(str)
					}
				}
			},
			
			getPath(url) {
				if (url.indexOf("?") != -1) {
					url = url.split("?")[0];
					console.log(url);
				}
				return url
			},
			
			async loginMobile() {
				let that = this;
				if (!that.account) return that.$util.Tips({
					title: '请输入手机号码'
				});
				if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.account)) return that.$util.Tips({
					title: '请输入正确的手机号码'
				});
				if(!that.clickCode){
					that.$util.Tips({
						title: '请获取验证码'
					});
					return
				}
				if (!that.captcha) return that.$util.Tips({
					title: '请输入验证码'
				});
				if (!/^[\w\d]+$/i.test(that.captcha)) return that.$util.Tips({
					title: '请输入正确的验证码'
				});
				if (!that.isAgree) return that.$util.Tips({
					title: '请勾选用户协议与隐私政策'
				});
				
				loginMobile({
						mobile: that.account,
						code: that.captcha
					})
					.then(({
						data
					}) => {
						console.log(data)
						let user = data.info[0]
						that.saveLocalData(user)
					})
					.catch(res => {
						that.$util.Tips({
							title: res
						});
					});
			},
			async register() {
				let that = this;
				if (!that.account) return that.$util.Tips({
					title: '请输入手机号码'
				});
				if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.account)) return that.$util.Tips({
					title: '请输入正确的手机号码'
				});
				if(!that.clickCode){
					that.$util.Tips({
						title: '请获取验证码'
					});
					return
				}
				if (!that.captcha) return that.$util.Tips({
					title: '请输入验证码'
				});
				if (!/^[\w\d]+$/i.test(that.captcha)) return that.$util.Tips({
					title: '请输入正确的验证码'
				});
				if (!that.password) return that.$util.Tips({
					title: '请输入密码'
				});
				if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/i.test(that.password)) return that.$util.Tips({
					title: '请输入6-16位字母加数字组合'
				});
				if (!that.isAgree) return that.$util.Tips({
					title: '请勾选用户协议与隐私政策'
				});
				register({
						mobile: that.account,
						code: that.captcha,
						pass: that.password
					})
					.then(res => {
						console.log(res)
						that.saveLocalData(res.data.info[0])
						
					})
					.catch(res => {
						that.$util.Tips({
							title: res
						});
					});
			},
			async code() {
				let that = this;
				if (!that.account) return that.$util.Tips({
					title: '请输入手机号码'
				});
				if (!/^1(3|4|5|7|8|9|6)\d{9}$/i.test(that.account)) return that.$util.Tips({
					title: '请输入正确的手机号码'
				});
				
				let sign = this.$util.sort2url({
					'account': this.account
				});
				await registerVerify({
						mobile: that.account,
						type: that.formItem,//1登录 2注册 3忘记密码 5修改手机号
						code: that.codeVal,
						sign:sign
					})
					.then(res => {
						that.$util.Tips({
							title: res.data.msg
						});
						that.clickCode = true
						
					})
					.catch(res => {
						console.log(res, 'res222')
						that.clickCode = true
						that.$util.Tips({
							title: res
						});
					});
			},
			
			
			navTap: function(index) {
				this.current = index;
			},
			getPath(url) {
				if (url.indexOf("?") != -1) {
					url = url.split("?")[0];
					console.log(url);
				}
				return url
			},
			async submit() {
				let that = this;
				if (!that.account) return that.$util.Tips({
					title: '请输入账号'
				});
				if (!/^[\w\d]{5,16}$/i.test(that.account)) return that.$util.Tips({
					title: '请输入正确的账号'
				});
				if (!that.password) return that.$util.Tips({
					title: '请输入密码'
				});
				if (!that.isAgree) return that.$util.Tips({
					title: '请勾选用户协议与隐私政策'
				});
				
				loginH5({
						mobile: that.account,
						pass: that.password
					})
					.then(({
						data
					}) => {
						console.log(data)
						// const backUrl = that.$Cache.get(BACK_URL) || "/pages/shops/index/index";
						// that.$Cache.clear(BACK_URL);
						that.saveLocalData(data.info[0])
					})
					.catch(e => {
						that.$util.Tips({
							title: e
						});
					});
			}
		}
	};
</script>
<style lang="scss">
	page {
		background-color: #fff !important;
	}

	/deep/uni-checkbox .uni-checkbox-input {
		border-radius: 100%;
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
		width: 240rpx;

	}

	/deep/.uni-input-wrapper,
	/deep/.uni-input-input {
		// width: 240rpx;
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

	.ChangePassword .confirmBnt.back {
		background-color: #FFFFFF;
		border: 1px solid var(--view-theme);
		color: var(--view-theme);
		margin-top: 30rpx;
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

	.code image {
		width: 100%;
		height: 100%;
	}

	.acea-row.row-middle {
		input {
			margin-left: 20rpx;
		}
	}

	.settlementAgreement {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, .5);
		z-index: 10;
	}

	.protocol_text {
		color: #999;
		font-size: 24rpx;
	}

	.settlementAgreement .setAgCount {
		background: #fff;
		width: 656rpx;
		height: 458px;
		position: absolute;
		top: 50%;
		left: 50%;
		border-radius: 12rpx;
		-webkit-border-radius: 12rpx;
		padding: 52rpx;
		-webkit-transform: translate(-50%, -50%);
		-moz-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		overflow: hidden;

		.content {
			height: 900rpx;
			overflow-y: scroll;

			/deep/ p {
				font-size: 13px;
				line-height: 22px;
			}

			/deep/ img {
				max-width: 100%;
			}
		}
	}

	.settlementAgreement .setAgCount .icon {
		font-size: 42rpx;
		color: #b4b1b4;
		position: absolute;
		top: 15rpx;
		right: 15rpx;

	}

	.settlementAgreement .setAgCount .title {
		color: #333;
		font-size: 32rpx;
		text-align: center;
		font-weight: bold;
	}

	.settlementAgreement .setAgCount .content {
		margin-top: 32rpx;
		color: #333;
		font-size: 26rpx;
		line-height: 22px;
		text-align: justify;
		text-justify: distribute-all-lines;
		height: 756rpx;
		overflow-y: scroll;
	}

	.protocol {
		margin-top: 30rpx;
	}

	.protocol_text {
		.font_pro {
			color: #F35446;
		}
	}

	.appLogin {
		.hds {
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 24rpx;
			color: #B4B4B4;

			.line {
				width: 68rpx;
				height: 1rpx;
				background: #CCCCCC;
			}

			p {
				margin: 0 20rpx;
			}
		}

		.btn-wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 30rpx;

			.btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 68rpx;
				height: 68rpx;
				border-radius: 50%;
			}

			.apple-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 246rpx;
				height: 66rpx;
				margin-left: 10rpx;
				background: #EAEAEA;
				border-radius: 34rpx;
				font-size: 24rpx;

				.icon-s-pingguo {
					color: #333;
					margin-right: 10rpx;
					font-size: 34rpx;
				}
			}

			.iconfont {
				font-size: 40rpx;
				color: #fff;
			}

			.wx {
				margin-right: 30rpx;
				background-color: #61C64F;

				&.btn-apple {
					margin-right: 0;
					background-color: #333;
				}
			}

			.mima {
				background-color: #28B3E9;
			}

			.yanzheng {
				background-color: #F89C23;
			}

		}
	}

	.code img {
		width: 100%;
		height: 100%;
	}

	.acea-row.row-middle {
		input {
			margin-left: 20rpx;
			display: block;
		}
	}

	.login-wrapper {
		padding: 30rpx;

		.shading {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			/* #ifdef APP-VUE */
			margin-top: 50rpx;
			/* #endif */
			/* #ifndef APP-VUE */

			margin-top: 200rpx;
			/* #endif */


			image {
				width: 180rpx;
				height: 180rpx;
			}
		}

		.whiteBg {
			margin-top: 100rpx;

			.list {
				border-radius: 16rpx;
				overflow: hidden;

				.item {
					border-bottom: 1px solid #F0F0F0;
					background: #fff;

					.row-middle {
						position: relative;
						padding: 16rpx 45rpx;

						input {
							flex: 1;
							font-size: 28rpx;
							height: 80rpx;
						}

						.code {
							color: #E93323;
							font-size: 26rpx;
							transform: translateY(-50%);
						}
					}
				}
			}

			.logon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				height: 86rpx;
				margin-top: 80rpx;
				background-color: $theme-color;
				border-radius: 120rpx;
				color: #FFFFFF;
				font-size: 30rpx;
			}

			.tips {
				margin: 30rpx;
				text-align: center;
				color: #999;
			}
		}
	}
</style>

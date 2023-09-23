<template>
	<view>
		<view class="header">
			<view class="tips">7岁以下儿童开具线上处方需由监护人陪同与确认.</view>
			<view class="section">
				<view class="img">
					<text class="yyfont yy-jibenxinxi"></text>
				</view>
				<view class="title">
					个人信息
				</view>
			</view>
		</view>
		<view class="form">
			<view class="form_item">
				<view class="label">姓名</view>
				<view class="input">
					<input type="text" placeholder="请输入真实姓名" maxlength="11" v-model="formData.name" />
				</view>
			</view>
			<view class="form_item">
				<view class="label">身份证</view>
				<view class="input">
					<input type="idcard" maxlength="18" placeholder="请输入身份证号码" v-model="formData.card" />
				</view>
			</view>

			<view class="form_item">
				<view class="label">手机号</view>
				<view class="input">
					<input type="number" maxlength="11" placeholder="请输入手机号码" v-model="formData.phone" />
				</view>
			</view>

			<view class="form_item">
				<view class="label">性别</view>
				<view class="input-picker">
					<picker mode="selector" :range="genderList" range-key="label" @change="genderChange">
						<view class="picker-box">
							<input type="text" placeholder="请选择" disabled v-model="gender" />
							<text class="iconfont icon-xiangyou"></text>
						</view>
					</picker>
				</view>
			</view>

			<view class="form_item">
				<view class="label">体重</view>
				<view class="input">
					<input type="number" placeholder="请输入体重" v-model="formData.weight" />
					<view class="kg-flag">kg</view>
				</view>
			</view>

			<view class="form_item">
				<view class="label">年龄</view>
				<view class="input-picker">
					<picker mode="date" @change="dateChange" :end="today">
						<view class="picker-box">
							<input type="text" placeholder="请选择" disabled v-model="formData.age" />
							<text class="iconfont icon-xiangyou"></text>
						</view>
					</picker>
				</view>
			</view>

			<view class="form_item">
				<view class="label">出生日期</view>
				<view class="input-picker">
					<picker mode="date" @change="birthChange" :end="today">
						<view class="picker-box">
							<input type="text" placeholder="请选择" disabled v-model="formData.birth" />
							<text class="iconfont icon-xiangyou"></text>
						</view>
					</picker>
				</view>
			</view>
		</view>
		
		<view class="bot-sapce"></view>
		
		<view class="footer-box">
			<button @click="submitForm" :disabled="isSubmit" class="form_btn">确认提交</button>
			<view class="yy-safe-bh"></view>
		</view>
		
	</view>
</template>

<script>
	import {
		addPatient,
		editPatient
	} from '@/api/inquiry.js';

	import { mapGetters } from "vuex";

	import { getTodayFormat,userAgeFormat } from "@/utils/format.js";

	var _self;
	export default {
		name: 'addInfo',
		
		data() {
			return {
				selCor: '#EBFFF6',
				selTextCor: '#36cf89',
				gender: '',
				genderList: [{
					value: 0,
					label: '男'
				}, {
					value: 1,
					label: '女'
				}],
				formData: {
					id:'1',
					name: '',
					card: '',
					phone: '',
					sex: '',
					weight: '',
					age: '',
					birth: '',
				},
				today: '',
				isSubmit: false,
				patient_info:{},
				patient_id:0,
				uid:0,
			};
		},
		created() {
			_self = this;
			_self.today = getTodayFormat();
			let user = uni.getStorageSync('userinfo')
			if(user && user.id>0){
				this.uid = user.id
			}
		},
		onLoad() {
		
		},
		methods: {
			genderChange(e) {
				var ind = e.detail.value;
				_self.formData.sex = _self.genderList[ind].label;
				_self.gender = _self.genderList[ind].label;
			},
			// 生日
			birthChange(e) {
				_self.dateChange(e);

			},
			// 年龄
			dateChange(e) {

				_self.formData.birth = e.detail.value;
				_self.formData.age = userAgeFormat(e.detail.value.split('-'));
			},

			submitForm() {
				
				let phoneReg =
					/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/;
				let idReg = /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/;
				let nameReg = /^(?:[\u4e00-\u9fa5·]{2,16})$/


				if (!nameReg.test(_self.formData.name)) {
					return _self.$util.Tips({
						title: '请输入真实姓名'
					});
				}
				if (!_self.formData.card) {
					return _self.$util.Tips({
						title: '请输入正确的身份证号码'
					});
				}
				if (_self.formData.card.length != 18) {
					return _self.$util.Tips({
						title: '请输入正确的身份证号码'
					});
				}
				if (!idReg.test(_self.formData.card)) {
					return _self.$util.Tips({
						title: '请输入正确的身份证号码'
					});
				}
				
				
				if (!_self.formData.phone) {
					return _self.$util.Tips({
						title: '请输入正确的手机号码'
					});
				}
				if (!phoneReg.test(_self.formData.phone)) {
					return _self.$util.Tips({
						title: '请输入正确的手机号码'
					});
				}
				if (_self.formData.phone.length != 11) {
					return _self.$util.Tips({
						title: '请输入正确的手机号码'
					});
				}
				
				
				if (_self.formData.sex === '') {
					return _self.$util.Tips({
						title: '请选择性别'
					});
				}

				if (!_self.formData.weight) {
					return _self.$util.Tips({
						title: '请输入体重'
					});
				}
				if (!_self.formData.age) {
					return _self.$util.Tips({
						title: '请选择年龄'
					});
				}

				_self.formData.uid = _self.uid;
				
				//console.log('rk==>[submit]' + JSON.stringify(_self.formData));

				console.log('rk==>[xxx]'+_self.patient_id)

				if(_self.patient_id == 0){
					_self.addPatient();
				}else {
					_self.editPatient();
				}

			},
			addPatient(){
				setTimeout(() => {
					uni.$emit('yy_patient_add',_self.formData)
					uni.navigateBack();
				}, 150);
			},
			
		}
	};
</script>

<style lang="scss">
	.header {
		.tips {
			padding: 30rpx 30rpx 20rpx;
			color: #fca325;
			background-color: #fff9ef;
		}
		.section{
			background-color: #F7F9FA;
			display: flex;
			flex-direction: row;
			padding: 20rpx 0 20rpx 30rpx;
			
			.img {
				width: 30rpx;
				height: 30rpx;
			
				image {
					width: 100%;
					height: 100%;
				}
				.yyfont{
					color: #fca325;
				}
			}
			.title {
				margin-left: 10rpx;
				font-size: 28rpx;
				color: #999;
			}
		}
	}

	.form {
		background: #fff;
		padding: 0 30rpx;

		.form_item {
			display: flex;
			//justify-content: space-between;
			align-items: center;
			border-bottom: solid 1rpx #dcdcdc;
			font-size: 28rpx;
			padding: 30rpx 0;

			&:last-child {
				border-bottom: none;
			}

			.label {
				width: 20%;
				border-right-color: #999;
				border-right-width: 2rpx;
				border-right-style: solid;

				text {
					color: $theme-color;
					display: inline-block;
					// margin-right: 5rpx;
				}
			}

			.input-picker {
				width: 70%;
				margin-left: 30rpx;
				font-size: 28rpx;

				.picker-box {
					width: 100%;
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;
				}
				/deep/ uni-picker {
					width: 100%;
				}
			}

			.input {
				display: flex;
				flex-direction: row;
				align-items: center;
				width: 70%;
				margin-left: 30rpx;

				input {
					width: 100%;
					text-align: left;
					font-size: 28rpx;
				}
			}

			.iconfont {
				font-size: 20rpx;
				color: #999;
				// position: fixed;
				right: 20rpx;
			}

			.ignor-input {
				margin-left: 50rpx;

				input {
					width: 0.01%;
					text-align: left;
					font-size: 28rpx;
					color: #fff;
				}
			}


		}
	}

	.footer-box{
		position: fixed;
		bottom: 10rpx;
		width: 100%;
	}

	.form_btn {
		background: $yy-main-col;
		color: #fff;
		width: 690rpx;
		height: 90rpx;
		line-height: 90rpx;
		display: block;
		margin: auto;
		font-size: 28rpx;
		border-radius: 10rpx;
		// margin-top: 170rpx;
		// margin-bottom: 10rpx;
	}
	.bot-sapce {
		height: calc(100rpx + constant(safe-area-inset-bottom));
		height: calc(100rpx + env(safe-area-inset-bottom));
	}
	
</style>

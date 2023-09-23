<template>
	<view class='nav acea-row acea-row'
		:style="'background:'+bgColor+';margin:' +mbConfig+'rpx '+prConfig+'rpx 0;border-radius:'+bgStyle+'rpx;'"
		v-if="menus.length">
		<block v-if="rowStyle == 0">
			<scroll-view scroll-x="true" style="white-space: nowrap; display: flex" show-scrollbar="false">
				<view v-for="(item,index) in menus" :key="index" class='item' :style="'color:'+titleColor"
					@click="menusTap(item)">
					<view class='pictrue skeleton-rect'>
						<image :src='item.img' :style="'border-radius:'+menuStyle"></image>
					</view>
					<view class="menu-txt" :style="'color:'+titleColor">{{item.title}}</view>
				</view>
			</scroll-view>
		</block>
		<block v-else v-for="(item,index) in menus" :key="index">
			<view class='item' :style="'color:'+titleColor+';width:'+number" @click="menusTap(item)">
				<view class='pictrue skeleton-rect'>
					<image :src='item.img' :style="'border-radius:'+menuStyle"></image>
				</view>
				<view class="menu-txt" :style="'color:'+titleColor">{{item.title}}</view>
			</view>
		</block>
	</view>
</template>

<script>
	
	import { HTTP_REQUEST_URL } from '@/config/app';
	import {
		mapGetters
	} from 'vuex';
	export default {
		name: 'homeMenus',
		props: {
			dataConfig: {
				type: Object,
				default: () => {}
			},
			isShow:{
				type: Number || String,
				default: 0,
			},
			
		},
		computed: {
			
		},
		data() {
			return {
				menus: [{
					'id': 1,
					'img': HTTP_REQUEST_URL + '/uni_static/h/h_register.png',
					'title': '预约挂号',
					'url': '/pages/shops/subs_appointment/register/index',
				},{
					'id': 3,
					'img': HTTP_REQUEST_URL + '/uni_static/h/h_inquiry.png',
					'title': '医生问诊',
					'url': '/pages/shops/forlist/index',
				}, {
					'id': 2,
					'img': HTTP_REQUEST_URL + '/uni_static/h/h_server.png',
					'title': '在线客服',
					'url': HTTP_REQUEST_URL + '/appapi/page/detail?id=9'
				}, {
					'id': 4,
					'img': HTTP_REQUEST_URL + '/uni_static/h/h_pro.png',
					'title': '专业版',
					'url': HTTP_REQUEST_URL + '/appapi/page/detail?id=11'
				}, {
					'id': 5,
					'img': HTTP_REQUEST_URL + '/uni_static/h/h_doctor.png',
					'title': '家庭医生',
					'url': HTTP_REQUEST_URL + '/appapi/page/detail?id=13',
				}, {
					'id': 6,
					'img': HTTP_REQUEST_URL + '/uni_static/h/h_video.png',
					'title': '视频课堂',
					'url': '/pages/shops/subs_index/video/list',
				}, {
					'id': 7,
					'img': HTTP_REQUEST_URL + '/uni_static/h/h_healthy.png',
					'title': '健康科普',
					'url': '/pages/shops/subs_index/article/list',
				}, {
					'id': 8,
					'img': HTTP_REQUEST_URL + '/uni_static/h/h_contact.png',
					'title': '联系我们',
					'url': HTTP_REQUEST_URL + '/appapi/page/detail?id=10'
				}],
				bgColor: '#fff',
				menuStyle: 0, //圆角
				rowStyle: 1, //0单行1多行
				bgStyle: '0',
				titleColor: '#333333',
				mbConfig: 0,
				prConfig: 2,
				rowNum: 0, //0两行，1三行，2四行
				number: '25%', //三个四个五个 
				
			};
		},
		created() {
			
		},
		mounted() {},
		methods: {
			menusTap(item) {			
				if(item.id == 2 || item.id == 8 || item.id == 4 || item.id == 5){
					uni.navigateTo({
						url:'/pages/webview/webview?url=' + item.url                     
					})
				}else if(item.id == 3){
					uni.switchTab({
						url:item.url
					})
				}else{
					uni.navigateTo({
						url: item.url,
						fail: (res) => {
							console.log('res'+JSON.stringify(res))
						}
					})
				}
				
			}
		}
	}
</script>

<style lang="scss">
	.nav {
		padding: 30rpx 0 0;

		.item {
			width: 20%;
			text-align: center;
			font-size: 24rpx;
			display: inline-block;

			.pictrue {
				width: 82rpx;
				height: 82rpx;
				margin: 0 auto;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.menu-txt {
				font-size: 24rpx;
				color: #454545;
				margin: 10rpx 0 20rpx;
				
			}

			&.four {
				width: 25%;

				.pictrue {
					width: 90rpx;
					height: 90rpx;
				}
			}
		}
	}
</style>

<template>
	<view class="content">
		<jyf-parser :html="content" ref="article" :tag-style="tagStyle"></jyf-parser>
	</view>
</template>
<script>
	import parser from "@/components/jyf-parser/jyf-parser";
	import {
		mapGetters
	} from "vuex";
	import {
		getInquiryInfo,
		getDoctorDetail
	} from '@/api/inquiry.js';
	export default {
		computed: {
			
		},
		
		components: {
			"jyf-parser": parser
		},
		data() {
			return {
				tagStyle: {
					img: 'width:100%;display:block;',
					table: 'width:100%',
					video: 'width:100%'
				},
				content: ``,
				source:1,
				doctor_id:0,
				uid:0
				
			};
		},
		/**
		 * @param {Object} optios
		 * title
		 * content
		 */
		onLoad(optios) {
			
			if (!optios.param) {
				return;
			}
			
			let param = JSON.parse(decodeURIComponent(optios.param));
			if (param.title) {
				uni.setNavigationBarTitle({
					title: param.title
				});
			}
			if (param.content) {
				this.content = param.content;
			}	
		},
		onShow(option) {

		},
		onHide() {


		},
		onUnload() {

		},
		methods: {
			getInquiryInfo() {
				let that = this
				getInquiryInfo().then(res => {
					if(that.source == 1){
						that.content = res.data.know_agree.content;
						uni.setNavigationBarTitle({
							title: res.data.know_agree.title
						});
					}else{
						that.content = res.data.privacy_agree.content;
						uni.setNavigationBarTitle({
							title: res.data.privacy_agree.title
						});
					}
				});
			},
			getDoctorDetial() {
				let where = {
					'id': this.doctor_id
				}
				let that = this
				getDoctorDetail(where).then(res => {
					if(that.source == 3){
						that.content = res.data.chat_info.content;
						uni.setNavigationBarTitle({
							title: res.data.chat_info.title
						});
					}else if(that.source == 4){
						that.content = res.data.audio_info.content;
						uni.setNavigationBarTitle({
							title: res.data.audio_info.title
						});
					}else if(that.source == 5){
						that.content = res.data.pic_info.content;
						uni.setNavigationBarTitle({
							title: res.data.pic_info.title
						});
					}
					
				});
			},
		},

	};
</script>
<style lang="scss">
	.content {
		padding: 40rpx 30rpx;
		line-height: 2;
	}
</style>

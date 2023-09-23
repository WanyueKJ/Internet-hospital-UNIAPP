<template>
	<view class="content">
		<jyf-parser :html="content" ref="article" :tag-style="tagStyle"></jyf-parser>
	</view>
</template>

<script>
	import parser from "@/components/jyf-parser/jyf-parser";
	import {
		getAgreementApi,
	} from '@/api/user.js';
	
	export default {
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
				content: ``
			}
		},
		onLoad(e) {
			let that = this
			if(e.article_id) {
				// getArticleDetails(e.article_id).then(res => {
				// 	that.content = res.data.content.content
				// }).catch(err => {
				// 	that.$util.Tips({
				// 		title: err.msg
				// 	});
				// })
			} else {
				this.getAgreement();
			}
		},
		mounted() {
		},
		methods: {
			getAgreement() {
				// getAgreementApi('sys_user_agree').then(res => {
				// 	this.content = res.data.sys_user_agree
				// })
			}
		}
	}
</script>

<style scoped>
	.content {
		padding: 40rpx 30rpx;
		line-height: 2;
	}
</style>
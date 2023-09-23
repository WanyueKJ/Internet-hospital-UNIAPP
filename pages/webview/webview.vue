<template>
	<web-view class="web-view" :webview-styles="webviewStyles" :src="url" :style="{width: windowW + 'px', height: windowH + 'px'}"></web-view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	export default {
		computed: {
			
		},
		data() {
			return {
				windowH: 0,
				windowW: 0,
				webviewStyles: {
					progress: {
						color: 'transparent'
					}
				},
				url: '',
				is_guid:false,
			}
		},
		onLoad(option) {
			this.url = option.url;
			if(option.is_guid && (option.is_guid == 1 ||option.is_guid == '1')){
				this.is_guid = true;
			}
			try {
				const res = uni.getSystemInfoSync();
				this.windowW = res.windowWidth;
				this.windowH = res.windowHeight;
			} catch (e) {
				// error
			}
		},
		onHide() {
			uni.switchTab({
				url:'/pages/shops/index/index'
			})
			
		},
		onUnload() {
			
		},
	}
</script>

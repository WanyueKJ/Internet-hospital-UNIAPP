<template>
	<view>
		<view class="nav_bar acea-row row-middle" :style="{ background, paddingTop: paddingTop + 'px', height: titleH + 'px' }">
			<text class="iconfont icon-xiangzuo" v-if="isBack" :style="{ color }" @click="goBack"></text>
			<view
				class="title acea-row row-middle"
				:class="align == 'center' ? 'row-center' : align == 'left' ? 'row-left' : 'row-right'"
				:style="{
					paddingTop: paddingTop + 'px',
					paddingRight: menuButtonWidth + 'px',
					paddingLeft: align == 'center' ? menuButtonWidth + 'px' : ''
				}"
			>
				{{ title }}
				<slot name="location"></slot>
			</view>
		</view>
		<view style="width: 100%;" :style="{ height: titleH + 'px' }" v-if="isBox"></view>
	</view>
</template>

<script>
let systemInfo = uni.getSystemInfoSync();
var marT = 4,
	titleH = systemInfo.statusBarHeight + 40,
	paddingTop = systemInfo.statusBarHeight;

export default {
	name: 'navBar',
	props: {
		title: {
			type: String,
			default: ''
		},
		align: {
			type: String,
			default: 'left'
		},
		background: {
			type: String,
			default: '#fff'
		},
		color: {
			type: String,
			default: '#000000'
		},
		isBack: {
			type: Boolean,
			default: true
		},
		isBox: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			paddingTop,
			titleH,
			menuButtonWidth: 0
			
		};
	},
	created() {
		var _self = this;
	},
	methods: {
		goBack() {
			uni.navigateBack({
				delta: 1
			});
		}
	}
};
</script>

<style lang="scss">
.nav_bar {
	position: relative;
	padding: 0 15px;
	position: fixed;
	top: 0;
	width: 100%;
	left: 0;
	z-index: 111;
	.title {
		position: absolute;
		bottom: 0;
		height: 100%;
		padding: 0 30px;
		width: calc(100% - 30px);
		font-size: 15px;
	}
	.iconfont {
		font-weight: bold;
		font-size: 17px;
		display: inline-block;
	}
	.icon-xiangzuo {
		position: relative;
		z-index: 9;
	}
}
</style>

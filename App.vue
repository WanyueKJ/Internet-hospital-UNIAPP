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

	export default {
		computed: {
			
		},
		globalData: {
			qiniuimageurl: "https://edu-qiniu.sdwanyue.com",
			appname:'万岳互联网医院',
			statusBarHeight:0,
			navHeight:0
		},
		onLaunch: function(option) {
			
			this.globalData.statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
			
			let that = this;
			// 获取导航高度；
			uni.getSystemInfo({
				success: function(res) {
					that.globalData.navHeight = res.statusBarHeight * (750 / res.windowWidth) + 91;
				}
			});
		},
		onShow() {
			
		},
		methods: {
			
			
		},
		onHide: function() {
			
		},
		onUnload() {
			
		}
		
	}
</script>
<style>
	@import "@/plugin/animate/animate.min.css";
	@import 'static/css/base.css';
	@import 'static/iconfont/iconfont.css';
	@import 'static/iconfont/yyiconfont.css';
	@import 'static/css/style.scss';
	@import 'static/css/main.scss';

	view {
		box-sizing: border-box;
	}

	.bg-color-red {
		background-color: #e93323 !important;
	}

	.syspadding {
		padding-top: var(--status-bar-height);
	}

	.flex {
		display: flex;
	}

	.uni-scroll-view::-webkit-scrollbar {
		/* 隐藏滚动条，但依旧具备可以滚动的功能 */
		display: none
	}

	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}

	::-moz-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}

	.empty-txt {
		line-height: 100rpx;
		font-size: 22rpx;
		color: #999;
		text-align: center;
	}

	.product-con .conter img {
		display: block;
	}

	.open-location {
		height: 100vh;
	}

	uni-tabbar {
		bottom: 0;
	}
	/deep/ uni-tabbar .uni-tabbar__reddot {
		background-color: #36cf89 !important;
	}
</style>

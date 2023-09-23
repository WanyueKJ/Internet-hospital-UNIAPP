// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2021 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import Vue from 'vue'
import App from './App'
import Cache from './utils/cache'
import util from 'utils/util'
import { HTTP_REQUEST_URL } from '@/config/app';
import skeleton from './components/skeleton/index.vue'
Vue.component('skeleton', skeleton)

Vue.prototype.$util = util;
Vue.prototype.$Cache = Cache;
Vue.prototype.$eventHub = new Vue();
Vue.config.productionTip = false


App.mpType = 'app'

const app = new Vue({
    ...App,
	Cache
})
app.$mount();
// +----------------------------------------------------------------------
// | CRMEB [ CRMEB赋能开发者，助力企业发展 ]
// +----------------------------------------------------------------------
// | Copyright (c) 2016~2021 https://www.crmeb.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed CRMEB并不是自由软件，未经许可不能去掉CRMEB相关版权
// +----------------------------------------------------------------------
// | Author: CRMEB Team <admin@crmeb.com>
// +----------------------------------------------------------------------
import { history } from '@/api/public.js'
export default {
  data() {
    return {
      
    };
  },
  methods: {
    getHistory() {
			console.log(this.$util.getNowUrl(),'page')
      history({
				page:this.$util.getNowUrl()
			}).then(res=>{})
    },
  }
};
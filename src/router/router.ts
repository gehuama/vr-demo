/*
 * @Author: 马雄伟 maxiongwei@vchangyi.com
 * @Date: 2022-08-19 14:32:08
 * @LastEditors: 马雄伟 maxiongwei@vchangyi.com
 * @LastEditTime: 2023-09-14 15:11:44
 * @FilePath: /vr-demo/src/router/router.ts
 * @description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import * as VueRouter from 'vue-router'
import house from '../view/house.vue'
import isle from '../view/isle.vue'
import surround from '../view/surround.vue'
import missile from '../view/missile.vue'
import fittingRoom from '../view/fitting-room.vue'
import tlp from '../view/tlp.vue'


// 2. 定义一些路由
// 每个路由都需要映射到一个组件。
// 我们后面再讨论嵌套路由。
const routes = [
  { path: '/house', component: house },
  { path: '/isle', component: isle },
  { path: '/surround', component: surround },
  { path: '/missile', component: missile },
  { path: '/fitting-room', component: fittingRoom },
  { path: '/tlp', component: tlp }
]

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = VueRouter.createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: VueRouter.createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})
export {router};
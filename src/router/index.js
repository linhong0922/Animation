import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('../components/index.vue'),
      meta: {
        deepth: 0.5
      }
    },
    {
      path: '/list',
      name: 'list',
      component: () => import('../components/list.vue'),
      meta: {
        deepth: 1,
        keepAlive: true
      }
    },
    {
      path: '/detail',
      name: 'detail',
      component: () => import('../components/detail.vue'),
      meta: {
        deepth: 2,
        transitionType: 'flip'
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  console.log(to.meta)
  next()
})
router.afterEach((to, from, next) => {
  console.log(to.meta)
})

export default router

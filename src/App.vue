<template>
  <div id="app">
    <transition
      :css="false"
      @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter"
      @before-leave="beforeLeave"
      @leave="leave"
      @after-leave="afterLeave">
      <keep-alive :include="include">
        <!-- 被缓存的组件  -->
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
    <!-- 不被缓存的组件 -->
    <transition
      :css="false"
      @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter"
      @before-leave="beforeLeave"
      @leave="leave"
      @after-leave="afterLeave">
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      SPEED: 300,
      firstReact: {},
      transitionType: '',
      include: []
    }
  },
  computed: {
    SLIDE () {
      return ['slide-left', 'slide-right'].includes(this.transitionType)
    },
    FLIP () {
      return ['flipEnter', 'flipLeave'].includes(this.transitionType) && this.transitionType
    }
  },
  methods: {
    beforeEnter (dom) {
      if (this.SLIDE) {
        let x = this.transitionType === 'slide-right' ? '-100%' : '100%'
        dom.style.cssText = `transition: transform ${this.SPEED}ms; transform: translate(${x}, 0);`
      }
    },
    enter (dom, done) {
      if (this.SLIDE) {
        requestAnimationFrame(
          function () {
            dom.style.cssText = `transition: transform ${this.SPEED}ms; transform: translate(0,0);`
          }.bind(this)
        )
        // 监听transitionend 事件
        var transitionend = window.ontransitionend ? 'transitionend' : 'webkitTansitionEnd'
        dom.addEventListener(transitionend, function onEnd () {
          dom.removeEventListener(transitionend, onEnd)
          done() // 告诉vue动画已经完成，以触发afterEnter
        })
      }
      if (this.FLIP === 'flipEnter') {
        var lastReact = dom.getBoundingClientRect()
        var Invert = {
          deltaX: this.firstReact.left - lastReact.left,
          deltaY: this.firstReact.top - lastReact.top,
          deltaW: this.firstReact.width / lastReact.width
        }
        console.log(Invert)
        dom.animate(
          [
            {
              transformOrigin: 'top left',
              transform: `translate3d(${Invert.deltaX}px, ${Invert.deltaY}px, 0) scale(${Invert.deltaW})`,
              borderRadius: '5px'
            },
            {
              transformOrigin: 'top left',
              transform: `translate3d(0,0,0) scale(1)`,
              borderRadius: '0'
            }
          ],
          {
            duration: this.SPEED
          }
        ).onfinish = function () {
          console.log('onfinish')
          done() // 告诉vue动画完成，以触发afterEnter钩子
        }
      }
    },
    afterEnter (dom) {
      dom.style.cssText = ''
    },
    beforeLeave (dom) {
      if (this.SLIDE) {
        dom.style.cssText = `transition: transform ${this.SPEED}ms;transform: translate(0,0);`
      }
    },
    leave (dom, done) {
      if (this.SLIDE) {
        requestAnimationFrame(() => {
          let slide = ['slide-left', 'slide-right'].includes(this.transitionType)
          if (slide) {
            let x = this.transitionType === 'slide-right' ? '100%' : '-100%'
            dom.style.cssText = `transition: transform ${this.SPEED}ms;transform: translate(${x}, 0);`
          }
        })
        // 监听transitionend 事件
        var transitionend = window.ontransitionend ? 'transtionend' : 'webkitTransitionEnd'
        dom.addEventListener(transitionend, function onEnd () {
          dom.removeEventListener(transitionend, onEnd)
          done()
        })
      }
      if (this.FLIP === 'flipEnter') {
        setTimeout(() => {
          done()
        }, this.SPEED)
      }
      if (this.FLIP === 'flipLeave') {
        var lastReact = dom.getBoundingClientRect()
        var Invert = {
          deltaX: this.firstReact.left - lastReact.left,
          deltaY: this.firstReact.top - lastReact.top,
          deltaW: this.firstReact.width - lastReact.width
        }
        console.log(Invert)
        dom.animate(
          [
            {
              transformOrigin: 'top left',
              transform: `translate3d(${Invert.deltaX}px, ${Invert.deltaY}px, 0) scale(${Invert.deltaW})`,
              borderRadius: '5px'
            },
            {
              transformOrigin: 'top left',
              transform: `translate3d(0,0,0) scale(1)`,
              borderRadius: '0'
            }
          ],
          {
            duration: this.SPEED,
            direction: 'reverse'
          }
        ).onfinish = () => {
          done()
        }
      }
    },
    afterLeave (dom) {
      dom.style.cssText = ''
    }
  },
  watch: {
    $route (to, from) {
      // 详情页动画
      if (to.params.flip) {
        var e = to.params.flip
        var dom = e.getElementsByClassName('data-flipTarget')[0]
        this.firstReact = dom.getBoundingClientRect()
        console.log(this.firstReact)
      }
      // 动画
      if (to.meta.transitionType || from.meta.transitionType) {
        this.transitionType = to.meta.transitionType ? 'flipEnter' : 'flipLeave'
      } else {
        if (to.meta.deepth && from.meta.deepth) {
          this.transitionType = to.meta.deepth > from.meta.deepth ? 'slide-left' : 'slide-right'
        }
      }
      console.log(this.transitionType)
      // 是否需要缓存
      if (to.meta.keepAlive) {
        !this.include.includes(to.name) && this.include.push(to.name)
      }
      if (from.meta.keepAlive && to.meta.deepth < from.meta.deepth) {
        var index = this.include.indexOf(from.name)
        index !== -1 && this.include.splice(index, 1)
      }
      console.log(this.include)
    }
  }
}
</script>

<style>
/* 路由切换动画 */
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: transform 350ms;
  position: absolute;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.slide-right-enter,
.slide-left-leave-active {
  transform: translate(-100%, 0);
}
.slide-right-leave-active,
.slide-left-enter {
  transform: translate(100%, 0);
}
</style>

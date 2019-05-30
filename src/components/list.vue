<template>
    <div class="body list">
      <div class="flex justify-sb">
        <div class="top top-short theme-bg" @click="$router.go(-1)"></div>
        <div class="top theme-bg"></div>
        <div class="top top-short theme-bg"></div>
      </div>
      <transition-group
        :css="false"
        @before-enter="beforeEnter"
        @enter="enter"
        @after-enter="afterEnter">
        <div
          v-for="(n, index) in lists"
          :key="n"
          :data-delay=index*50
          @click="$router.push({name: 'detail', params: {id:n, flip:$event.currentTarget}})"
          data-y="100%"
          class="list-item flex"
          hoverclass="hoverclass-bg">
          <div class="list-avatar theme-bg flex justify-ct data-flipTarget">{{n}}</div>
          <div class="list-info theme-bg"></div>
        </div>
      </transition-group>
    </div>
</template>
<script>
export default {
  name: 'list',
  data () {
    return {
      lists: []
    }
  },
  methods: {
    beforeEnter (dom) {
      let {
        x = 0,
        y = 0,
        s = 1,
        opacity = 0
      } = dom.dataset
      dom.style.cssText = `transition: .3s; opacity: ${opacity};transform: scale(${s}) translateX(${x}) translateY(${y});`
    },
    enter (dom, done) {
      let delay = dom.dataset.delay
      setTimeout(() => {
        dom.style.cssText = `transition: .3s; opacity:1;transform: scale(1) translateX(0) translateY(0);`
        var transitionend = window.ontransitionend ? 'transitionend' : 'webkitTransitionEnd'
        dom.addEventListener(transitionend, function onEnd () {
          dom.removeEventListener(transitionend, onEnd)
          done()
        })
      }, delay)
    },
    afterEnter (dom) {
      dom.style.cssText = ''
    }
  },
  mounted () {
    setTimeout(() => {
      this.lists = ['😨', '🤡', '👻', '👩', '💖']
    }, 300)
  }
}
</script>
<style scoped>
</style>

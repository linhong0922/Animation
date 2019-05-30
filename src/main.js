// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './style/index.css'

Vue.config.productionTip = false

// Vue.directive('highlight', function (el) {
//   let blocks = el.querySelectorAll('pre code')
//   blocks.forEach(block => {
//     // hljs.highlightBlock(block)
//   })
// })

// Vue.directive('drag', function (el) {
//   let odiv = el
//   odiv.onmousedown = e => {
//     // 计算鼠标相对元素的位置
//     let divX = e.clientX - odiv.offsetLeft
//     let divY = e.clientY - odiv.offsetTop

//     document.onmousemove = e => {
//       // 计算元素位置
//       let left = e.clientX - divX
//       let top = e.clientY - divY
//       // 移动当前元素
//       odiv.style.left = left + 'px'
//       odiv.style.top = top + 'px'
//     }
//     document.onmouseup = e => {
//       document.onmousemove = null
//       document.onmousedown = null
//     }
//   }
// })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

window.addEventListener(
  'touchstart',
  function (e) {
    let dom = e.target
    let deep = 3
    let hoverclass = null
    while (!hoverclass && deep--) {
      if (dom.nodeName === 'HTML') return
      hoverclass = dom.getAttribute('hoverclass')
      if (hoverclass) {
        dom.classList.add(hoverclass)
        dom.addEventListener('touchend', function toggleClass () {
          setTimeout(() => {
            dom.classList.remove(hoverclass)
            dom.addEventListener('touchend', toggleClass)
          }, false)
        })
      } else {
        dom = dom.parentNode
      }
    }
  },
  false
)

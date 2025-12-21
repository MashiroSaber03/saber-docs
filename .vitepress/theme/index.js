// https://vitepress.dev/guide/custom-theme
import { h, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './styles/style.css'
import './styles/custom-block.css'
import './styles/font.css'
import './styles/zoom.css'
import ArticleShare from "./components/ArticleShare.vue";
import NotFound from './components/NotFound.vue'

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      "aside-outline-after": () => h(ArticleShare),
      "not-found": () => h(NotFound),
    })
  },
  setup() {
    const route = useRoute()
    
    const initZoom = () => {
      // 创建遮罩层（如果不存在）
      let overlay = document.getElementById('img-zoom-overlay')
      if (!overlay) {
        overlay = document.createElement('div')
        overlay.id = 'img-zoom-overlay'
        overlay.innerHTML = '<img id="img-zoom-target" src="" alt="" />'
        document.body.appendChild(overlay)
        
        // 点击遮罩层关闭
        overlay.addEventListener('click', () => {
          overlay.classList.remove('active')
        })
        
        // ESC 键关闭
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            overlay.classList.remove('active')
          }
        })
      }
      
      // 为所有文档图片添加点击事件
      const images = document.querySelectorAll('.main img')
      images.forEach(img => {
        if (img.dataset.zoomBound) return
        img.dataset.zoomBound = 'true'
        img.style.cursor = 'zoom-in'
        img.addEventListener('click', () => {
          const target = document.getElementById('img-zoom-target')
          target.src = img.src
          overlay.classList.add('active')
        })
      })
    }
    
    onMounted(() => {
      initZoom()
    })
    
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    )
  }
}

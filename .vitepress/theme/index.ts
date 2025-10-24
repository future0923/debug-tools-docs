// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import mediumZoom from "medium-zoom";
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({app, router, siteData}) {
    app.directive('zoom', {
      mounted(el) {
        mediumZoom(el, {
          margin: 24,
          background: 'rgba(0, 0, 0, 0.8)',
          scrollOffset: 0,
        })
      }
    });
    router.onAfterRouteChange = (to) => {
      trackPageView(to);
    };
  }
} satisfies Theme

// 用于发送浏览量的函数
async function trackPageView(path: string) {
  try {
    // await fetch(`http://127.0.0.1:8080/api/collect?path=${encodeURIComponent(path)}`, {
    await fetch(`https://debug-tools.cc/api/collect?path=${encodeURIComponent(path)}`, {
      method: 'GET',
    });
  } catch (err) {
    console.warn('Failed to track page view:', err);
  }
}
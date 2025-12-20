import { defineConfig } from "vitepress";
import { head } from "./config/head";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Saber Translator",
  description: "AI 驱动的漫画翻译工具",
  head: head,

  rewrites: {
    'zh/:rest*': ':rest*'
  },

  sitemap: {
    hostname: "https://saber-translator.github.io",
  },

  lastUpdated: true,
  ignoreDeadLinks: true,
  
  locales: {
    root: {
      label: "简体中文",
      lang: "zh-Hans",
      themeConfig: {
        nav: [
          { text: "主页", link: "/" },
          { text: "开始", link: "/what-is-saber-translator" },
          { text: "GitHub", link: "https://github.com/MashiroSaber03/Saber-Translator" },
        ],
        sidebar: [
          {
            text: "简介",
            items: [
              { text: "什么是 Saber Translator", link: "/what-is-saber-translator" },
              { text: "前言与致谢", link: "/preface" },
              { text: "社区", link: "/community" },
              { text: "常见问题", link: "/faq" },
            ],
          },
          {
            text: "下载与部署",
            base: "/deploy",
            collapsed: false,
            items: [
              {
                text: "部署 Saber Translator",
                base: "/deploy/saber",
                collapsed: true,
                items: [
                  { text: "💻 Windows 部署", link: "/windows" },
                ],
              },
            ],
          },
          {
            text: "配置",
            base: "/config",
            collapsed: false,
            items: [
              { text: "模型服务配置", link: "/model-service" },
              { text: "模型类型说明", link: "/model-types" },
              { text: "模型参数说明", link: "/model-params" },
              { text: "如何获取 API Key", link: "/get-api-key" },
            ],
          },
          {
            text: "使用",
            base: "/use",
            collapsed: false,
            items: [
              { text: "页面介绍", link: "/pages" },
              { text: "书架系统", link: "/bookshelf" },
              { text: "普通翻译模式", link: "/normal-translation" },
              { text: "高质量翻译模式", link: "/hq-translation" },
              { text: "AI校对模式", link: "/ai-proofreading" },
              { text: "编辑模式", link: "/edit-mode" },
              { text: "漫画分析", link: "/manga-insight" },
            ],
          },
        ],
        outline: {
          level: 'deep',
          label: '目录',
        },
        darkModeSwitchLabel: '切换日光/暗黑模式',
        sidebarMenuLabel: '文章',
        returnToTopLabel: '返回顶部',
        docFooter: {
          prev: '上一篇',
          next: '下一篇'
        },
        logo: '/images/logo.png',
        socialLinks: [
          { icon: "github", link: "https://github.com/MashiroSaber03/Saber-Translator" },
        ],
        footer: {
          message: 'Saber Translator - AI 驱动的漫画翻译工具',
        }
      }
    },
  },

  themeConfig: {
    search: {
      provider: "local",
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: "搜索文档",
                buttonAriaLabel: "搜索文档",
              },
              modal: {
                noResultsText: "无法找到相关结果",
                resetButtonTitle: "清除查询条件",
                footer: {
                  selectText: "选择",
                  navigateText: "切换",
                  closeText: "关闭",
                },
              },
            },
          },
        },
      },
    },
  }
});

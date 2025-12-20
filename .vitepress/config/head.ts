import type { HeadConfig } from "vitepress";

export const head: HeadConfig[] = [
    // --- Google Fonts ---
    ["link", { rel: "preconnect", href: "https://fonts.googleapis.cn", crossorigin: "" }],
    ["link", { rel: "dns-prefetch", href: "https://fonts.googleapis.cn" }],
    ["link", { rel: "preconnect", href: "https://fonts.gstatic.cn", crossorigin: "" }],
    ["link", { rel: "dns-prefetch", href: "https://fonts.gstatic.cn" }],
    ["link", { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" }],

    // --- 基础和SEO元数据 ---
    ["link", { rel: "icon", href: "/logo.png" }],
    ["meta", { name: "description", content: "Saber Translator - AI 驱动的漫画翻译工具" }],
    [
        "meta",
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
    ],

  // --- Open Graph (OG) 协议元数据 (用于社交媒体分享) ---
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:locale", content: "zh_CN" }],
    ["meta", { property: "og:title", content: "Saber Translator" }],
    ["meta", { property: "og:description", content: "AI 驱动的漫画翻译工具" }],
    ["meta", { property: "og:url", content: "https://saber-translator.github.io" }],
    ["meta", { property: "og:site_name", content: "Saber Translator" }],

];
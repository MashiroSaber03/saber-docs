---
outline: deep
---

# Saber Translator

## 什么是 Saber Translator？

Saber Translator 致力于成为覆盖**漫画管理**，**漫画阅读**，**漫画翻译**，**漫画分析**的一站式平台。我们希望Saber Translator能够在您阅读漫画的每个阶段都给您提供最大的帮助。通过Saber Translator，您能够将原本看不懂的外语漫画轻松**汉化**为中文漫画，翻译后可继续校对和编辑，具体效果取决于漫画内容、OCR 与模型；您能够借助**书架系统**将本地混乱的漫画书籍整理为**可视化**的管理结构，并通过**阅读功能**随时在PC或手机上进行阅读。您能够将原本上百甚至上千页的漫画快速浓缩为**漫画概要**，生成全书的**时间线**，或者针对任何一个细节进行**智能提问**。



- 强大的**翻译**功能：将所选 OCR 与翻译服务支持的语言翻译为中文或其他语言，借助多模态模型，可以实现上下文连贯，质量上乘的翻译结果。并可对翻译后的结果进行多次 AI 校对，以实现足够理想的翻译质量。→ [普通翻译](/use/normal-translation) | [高质量翻译](/use/hq-translation) | [AI 校对](/use/ai-proofreading)
- 自由的**编辑**功能：对翻译后的结果进行精细修改，支持框选、旋转、笔刷修复、单气泡 OCR/修复等精细操作，拥有足够自由的后期空间。→ [编辑模式](/use/edit-mode)
- 清晰的**书架**系统：将本地所有的漫画进行可视化存储，并可通过阅读功能进行流式阅读。→ [书架系统](/use/bookshelf)
- 创新的**分析**功能：通过 RAG 知识库与 LLM 文本压缩，对漫画内容进行分批分析，可一键生成漫画概览、时间线，并可对漫画中的任何细节进行提问，漫画领域的 NotebookLM。→ [漫画分析](/use/manga-insight)

## 从哪里开始

本教程对应带桌面控制中心、使用后端持久化的重构版。旧版入口和数据格式不同，更新前请查看[部署说明](/deploy/saber/windows)和[数据备份](/use/data-management)。

- 本机使用：启动[桌面控制中心](/use/desktop)，打开 Web 页面进行翻译、阅读与分析。
- 网页漫画：[浏览器插件](/use/browser-extension)在原网页显示译图，退出后清理临时数据。
- 后台处理：[任务中心](/use/task-center)统一查看进度、暂停、恢复和失败原因。

## Saber Translator的工作原理

Web 负责交互和显示，后端负责执行任务并保存结果。以下为主要流程，实际步骤会随模式与配置变化。

### 漫画翻译

```text
导入后端章节 → 检测 → OCR / 颜色 → 翻译 → 背景修复 → 渲染与保存
```

高质量翻译将图片与原文一起送入模型；校对使用已有译文；仅消字模式跳过翻译。

### 漫画分析

```text
书籍图片 → 分批视觉分析 → 分层总结 → 概览 / 时间线 / 检索问答
```

分析结果还可用于漫画续写和角色工坊。

## 开源协议

Saber Translator 是一个开源项目，采用 **GPL-3.0** 许可证，托管于 [GitHub](https://github.com/MashiroSaber03/Saber-Translator)。

**重要说明：**
- ✅ 个人使用、学习、修改完全自由
- ✅ 商业使用需遵守 GPL-3.0 协议（保持开源）
- ⚠️ 如需闭源商业使用，请联系作者获取授权

欢迎提交 Issue 和 Pull Request！

---

## 赞助支持

如果 Saber Translator 对你有帮助，欢迎通过以下方式支持项目：

<div style="display: flex; gap: 40px; align-items: flex-start; flex-wrap: wrap; margin-top: 20px;">
  <div style="text-align: center;">
    <h3 style="margin-bottom: 10px;">微信赞赏</h3>
    <img src="/images/wechat_qrcode.png" alt="微信赞赏码" style="width: 250px; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
  </div>
  <div style="text-align: center;">
    <h3 style="margin-bottom: 10px;">支付宝</h3>
    <img src="/images/alipay_qrcode.png" alt="支付宝收款码" style="width: 250px; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
  </div>
</div>

<p style="margin-top: 20px; color: #666;">感谢每一位支持者！你们的支持是项目持续发展的动力。</p>

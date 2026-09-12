# Hook 与数据契约

Plugin v3 的 Hook 在 Worker 中执行，处理的是后端提供的领域对象。选对步骤之后，还需要使用该步骤约定的字段。

## 返回值规则

```python
def after_translate(self, context, data):
    result = dict(data)
    result["translations"] = [
        text.strip() for text in data["translations"]
    ]
    return result
```

- 输入和输出必须是符合契约的 JSON 对象。
- 不修改时也返回对象，例如 `return dict(data)`。
- 不返回 `None`、字符串或列表。
- 保留必填字段和对应数组长度，不能只返回被修改的字段。
- 不在对象中放 bytes、Base64 图片或 data URL。

每个插件返回后都会进行校验，校验通过的数据才会交给后续处理。

## 可用 Hook

| 步骤 | Hook |
|------|------|
| 章节任务 | `before_job`、`after_job` |
| 流水线 | `before_pipeline`、`after_pipeline` |
| 检测 | `before_detect`、`after_detect` |
| OCR | `before_ocr`、`after_ocr` |
| 颜色 | `before_color`、`after_color` |
| 普通翻译 | `before_translate`、`after_translate` |
| HQ / 校对 | `before_ai_translate`、`after_ai_translate` |
| 修复 | `before_inpaint`、`after_inpaint` |
| 渲染 | `before_render`、`after_render` |

Hook 为同步实例方法，签名是 `hook(self, context, data)`。入口类需要可以无参构造。

## 模式与调用范围

- `standard`：检测、OCR、颜色、普通翻译、修复、渲染。
- `hq`：检测、OCR、颜色、AI 翻译、修复、渲染。
- `proofread`：按轮次 AI 校对，再渲染。
- `remove_text`：检测、修复并发布无字图；开启相应选项才额外执行 OCR。

复用检测框等操作可能跳过部分步骤。消字发布无字图不等于经过文字渲染 Hook。

`job` 与 `pipeline` 是不同的生命周期粒度，不能把 `before_pipeline` 理解为所有情况下整本书只触发一次。详情应以所运行版本的契约与任务拆分为准。

## Context

| 字段 | 用途 |
|------|------|
| `job_id`、`batch_id` | 任务与批次标识 |
| `book_id`、`chapter_id`、`page_id` | 当前书籍、章节和页面；按调用范围可能为空 |
| `mode`、`step`、`scope` | 模式、步骤与范围 |
| `config` | 当前任务固定的插件配置 |
| `repository` | 只读领域查询，例如页面与气泡 |
| `assets` | 查询、读取资产或发布派生资产 |
| `logger` | 将日志写入持久任务或操作事件 |

旧版 `context.route` 和 HTTP 原子接口示例不属于当前契约，不应依赖。

## 常用输入输出字段

| step | before 数据 | after 数据 |
|------|-------------|------------|
| `detect` | `pageId, sourceAssetId, detectorConfig` | `pageId, bubbles, textMaskAssetId` |
| `ocr` | `pageId, sourceAssetId, bubbles, ocrConfig` | `pageId, originalTexts, ocrResults` |
| `color` | `pageId, sourceAssetId, bubbles` | `pageId, colors` |
| `translate` | `pageId, originalTexts, translationConfig` | `pageId, originalTexts, translations, textboxTexts` |
| `ai_translate` | `pageId, originalTexts, translations` | `pageId, originalTexts, translations` |
| `inpaint` | `pageId, sourceAssetId, inputAssetId, textMaskAssetId, bubbles, method, fillColor` | `pageId, cleanAssetId, documentRevision` |
| `render` | `pageId, inputAssetId, bubbles, renderConfig` | `pageId, translatedAssetId, documentRevision` |

`originalTexts`、`translations`、`textboxTexts` 为字符串数组；`colors` 每项含 `fgColor`、`bgColor`、`confidence`。`fillColor` 仅在纯色填充时为颜色，其他修复方法为 null。

完整约束以当前源码 `src/backend_v2/plugins/contract.py` 为准。不要把普通数组、资产 ID 或配置字段替换为另一种结构。

## 失败策略

- **continue**：记录警告，保留进入该插件前的数据并继续。
- **fail**：job Hook 失败整个任务；pipeline 或原子 Hook 失败当前任务项，其他页面按任务状态继续。

插件加载或完整性校验失败也会有明确错误，不会悄悄当作未启用。

## 开发建议

先只修改一个步骤，使用几张图片验证，再扩大范围。清洗 OCR 时保持原文与 OCR 结果一致；修改译文时保持数组与气泡对应；处理图片时通过 `context.assets` 读写资产。

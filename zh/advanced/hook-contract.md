# Hook 与数据契约

当您已经能创建一个插件之后，接下来最重要的不是“多写几个插件”，而是理解这套插件系统的数据契约。

这一页回答 4 个核心问题：

1. Hook 到底什么时候触发
2. `before_*` 和 `after_*` 应该返回什么
3. `context` 里有哪些稳定字段
4. 不同步骤里最常见会收到哪些输入和输出

---

## 先记住最重要的一条规则

对于所有 Hook，最稳的思路都是：

- `before_*`：修改输入 payload
- `after_*`：修改输出 result
- 返回 `None`：表示不改
- 返回 `dict`：表示用新的对象替换当前数据

::: warning 注意
不要返回 `list`、`str`、`tuple` 或自定义对象实例。当前插件系统要求 Hook 最终返回对象。
:::

推荐写法：

```python
import copy

def after_translate(self, context, result):
    updated = copy.deepcopy(result)
    updated["translated_texts"] = [
        f"{text}【插件】"
        for text in updated.get("translated_texts", [])
    ]
    return updated
```

---

## 当前所有可用 Hook

当前开放的 Hook 名称如下：

### 检测

- `before_detect`
- `after_detect`

### OCR

- `before_ocr`
- `after_ocr`

### 颜色提取

- `before_color`
- `after_color`

### 普通翻译

- `before_translate`
- `after_translate`

### 高质量翻译 / AI 校对

- `before_ai_translate`
- `after_ai_translate`

### 修复

- `before_inpaint`
- `after_inpaint`

### 渲染

- `before_render`
- `after_render`

### 整次任务生命周期

- `before_pipeline`
- `after_pipeline`

统一签名如下：

```python
def before_xxx(self, context, payload):
    ...

def after_xxx(self, context, result):
    ...
```

---

## 不同模式会触发哪些步骤

很多插件“看起来没生效”，其实不是没加载，而是当前翻译模式根本不会经过对应步骤。

### `standard`

执行顺序通常是：

1. `detect`
2. `ocr`
3. `color`
4. `translate`
5. `inpaint`
6. `render`

### `hq`

执行顺序通常是：

1. `detect`
2. `ocr`
3. `color`
4. `ai_translate`
5. `inpaint`
6. `render`

### `proofread`

执行顺序通常是：

1. `ai_translate`
2. `render`

### `remove_text`

默认通常是：

1. `detect`
2. `inpaint`
3. `render`

如果用户开启“消除文字时也做 OCR”，则会额外经过 `ocr`。

这意味着：

- `after_translate` 在 `hq` 和 `proofread` 下通常不会触发
- `after_ai_translate` 在 `standard` 下通常不会触发
- `before_ocr` 在 `proofread` 下通常不会触发

---

## `context` 里有什么

每个 Hook 都会收到一个 `context` 参数，常用字段如下：

### `context.step`

当前步骤名，例如：

- `ocr`
- `translate`
- `render`

### `context.mode`

当前翻译模式，例如：

- `standard`
- `hq`
- `proofread`
- `remove_text`

### `context.route`

当前命中的后端路由，例如：

- `/api/parallel/ocr`
- `/api/parallel/translate`
- `/api/hq_translate_batch`
- `/api/re_render_single_bubble`

### `context.scope`

当前请求范围，例如：

- `bubble`
- `image`
- `batch`
- `all`

### `context.metadata`

一个附加信息字典，常见键可能包括：

- `bubble_count`
- `text_count`
- `target_language`
- `source_language`
- `provider`
- `pipeline_id`

推荐写法：

```python
text_count = context.metadata.get("text_count", 0)
```

不要假设某个键一定存在。

---

## 最常见的输入输出字段

这里不追求列出所有内部字段，而是只列开发插件时最常用、最值得先记住的部分。

### `after_ocr`

常见输出字段：

- `success`
- `original_texts`
- `ocr_results`
- `textlines_per_bubble`

最常见用途：

- 去掉首尾空格
- 统一省略号、标点
- 替换 OCR 易错词

::: warning 同步规则
如果您修改了 `original_texts`，最好同步修改 `ocr_results[i]["text"]`，避免前后显示不一致。
:::

### `after_translate`

常见输出字段：

- `success`
- `translated_texts`
- `textbox_texts`
- `warnings`

最常见用途：

- 统一替换词
- 给译文追加标记
- 对文本框译文做后处理

### `after_ai_translate`

常见输出字段：

- `success`
- `results`
- `warnings`

`results` 里通常按图片组织，每张图片下再包含多个气泡结果。最常见的修改对象是气泡里的 `translated` 文本。

### `before_render`

常见输入字段：

- `clean_image`
- `bubble_states`
- `fontSize`
- `fontFamily`
- `textColor`
- `strokeColor`
- `strokeEnabled`

最常见用途：

- 统一文字颜色
- 强制开启描边
- 批量修改字号或排版前的样式输入

### `before_pipeline` / `after_pipeline`

这两个 Hook 不是按图片触发，而是**整次翻译任务只触发一次**。

最适合：

- 日志记录
- 审计
- 缓存
- 配额控制
- 任务级校验

如果要在 `before_pipeline` 里主动阻止任务，一般要配合：

```python
failure_policy = "fail"
```

---

## `failure_policy` 应该怎么选

常见可选值只有两个：

- `continue`
- `fail`

含义如下：

- `continue`：插件报错时记日志，但主流程继续
- `fail`：插件报错时直接让当前步骤失败

推荐经验：

- 大多数普通后处理插件，用 `continue`
- 做强约束、强校验、任务阻断的插件，再考虑 `fail`

例如任务开始前做最少页数限制、敏感内容校验、合规拦截，这类更适合 `before_pipeline + fail`。

---

## 一个对照思路：先定场景，再定 Hook

如果您不确定该写哪个 Hook，可以先按场景判断：

- 想清洗 OCR 文本，优先看 `after_ocr`
- 想改普通翻译结果，优先看 `after_translate`
- 想改高质量翻译或 AI 校对结果，优先看 `after_ai_translate`
- 想统一样式，优先看 `before_render`
- 想做任务级统计或拦截，优先看 `before_pipeline` / `after_pipeline`

这样做通常比先记所有路由名字更高效。

---

## 推荐的开发习惯

为了让插件更稳定，建议优先遵守这些习惯：

1. 优先读写当前系统已经约定好的字段名，不自己发明别名
2. 修改结果时先复制一份对象，再返回新对象
3. 只在自己声明的步骤和模式里工作
4. 先做一个影响可见的小改动，再逐步扩大功能

如果您已经理解这些契约，下一步最值得继续看的是：

- [自动生成插件开发](/advanced/plugin-agent-development)

因为这会直接影响您如何把需求描述给内置 Agent，让它更稳定地生成符合当前契约的插件。

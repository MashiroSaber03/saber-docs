# 插件开发总览

如果您已经会使用 Saber Translator 的插件系统，并准备自己编写插件，这一页就是开发入口。

当前插件系统已经围绕翻译主链完成重构。它不是“在软件外面额外跑一段脚本”，而是把插件作为翻译流程中的可插拔中间件，让您在检测、OCR、翻译、修复、渲染等阶段插入自己的逻辑。

::: tip 这部分适合谁
- 想自己写一个小型流程增强插件
- 想给团队做固定规则插件
- 想更稳定地使用“自动生成插件”功能
- 想理解插件到底会接到哪些步骤和数据
:::

---

## 先理解插件是什么

当前版本的插件，主要服务于**翻译主链**。

更准确地说，插件会在系统执行原子步骤时被调用：

- `before_*`：在某一步执行前，修改输入
- `after_*`：在某一步执行后，修改输出
- `before_pipeline` / `after_pipeline`：在整次翻译任务开始前和结束后执行一次

您可以把它理解为“步骤级中间件”，而不是完整替换软件逻辑的新程序。

这意味着插件很适合做：

- OCR 文本清洗
- 普通翻译结果替换
- 高质量翻译或 AI 校对结果后处理
- 渲染前统一修改文字样式
- 任务开始或结束时做日志、统计、校验

---

## 当前支持哪些步骤

当前插件系统开放的步骤只有这些：

| 步骤 | 常见用途 |
|------|----------|
| `detect` | 调整检测参数、修正检测框 |
| `ocr` | 清洗 OCR 结果、统一文本格式 |
| `color` | 调整颜色提取结果 |
| `translate` | 处理普通翻译的输入或输出 |
| `ai_translate` | 处理高质量翻译 / AI 校对的输入或输出 |
| `inpaint` | 修改修复前后的数据 |
| `render` | 在渲染前统一样式或修正渲染输入 |
| `pipeline` | 在整次任务开始前或结束后执行一次 |

::: warning 注意
虽然前端翻译主链内部还有 `save` 步骤，但当前插件系统**还没有开放** `before_save / after_save`。
:::

---

## 当前支持哪些模式

插件可以声明自己只在部分翻译模式下生效。

当前可用模式名如下：

- `standard`
- `hq`
- `proofread`
- `remove_text`

这几个名字建议原样使用，不要自己发明别名。

例如：

```python
supported_modes = ("standard", "hq")
```

这表示该插件只会在普通翻译和高质量翻译模式下运行。

---

## 插件目录应该放在哪里

插件目录位于 Saber Translator 应用根目录下的：

- `plugins/`

每个插件都是一个独立子目录，最小结构如下：

```text
plugins/
  my_first_plugin/
    __init__.py
    plugin.py
```

如果您的逻辑更多，也可以继续拆：

```text
plugins/
  my_first_plugin/
    __init__.py
    plugin.py
    helpers.py
    prompts.py
```

推荐使用相对导入：

```python
from .helpers import build_prompt
```

---

## 一个插件最少要声明什么

所有插件都必须继承 `PluginBase`，并建议明确写出以下元数据：

```python
from src.plugins.base import PluginBase


class ExamplePlugin(PluginBase):
    plugin_id = "example_plugin"
    display_name = "Example Plugin"
    plugin_version = "1.0.0"
    plugin_author = "Your Name"
    plugin_description = "Describe what the plugin does."
    default_enabled = False
    supported_steps = ("ocr",)
    supported_modes = ("standard", "hq", "proofread")
    priority = 100
    failure_policy = "continue"
```

其中最关键的是：

- `plugin_id`：插件唯一标识
- `supported_steps`：声明接入哪个步骤
- `supported_modes`：声明在哪些模式下生效
- `priority`：多个插件同时命中时的顺序，数字越小越早
- `failure_policy`：插件报错时是继续还是直接让步骤失败

---

## 开发时最该先确认什么

开发一个插件前，最有用的不是先写代码，而是先确认下面这 4 件事：

1. 您想改的是哪一类场景
2. 这个场景最终落在哪个步骤
3. 应该改输入还是输出
4. 它实际会在哪些翻译模式下触发

举例：

- 想清洗 OCR 结果，通常优先看 `after_ocr`
- 想修改普通翻译结果，通常优先看 `after_translate`
- 想修改高质量翻译或 AI 校对结果，通常优先看 `after_ai_translate`
- 想统一描边、字体颜色、样式，通常优先看 `before_render`
- 想在整次任务开始前做校验或统计，通常优先看 `before_pipeline`

---

## 当前插件系统的边界

当前这套插件系统主要面向**翻译流程扩展**。

它并不适合拿来：

- 彻底替换整套软件工作流
- 重写书架、阅读器或漫画分析系统
- 承担与主程序无关的大型独立功能

简单理解：

- 如果您的需求是“在现有流程上插一小段能力”，插件通常很合适
- 如果您的需求是“把整个系统改成另一种产品”，插件通常不是最佳入口

---

## 推荐阅读顺序

如果您准备真正开始开发，建议按这个顺序继续：

1. [从零创建第一个插件](/advanced/first-plugin)
2. [Hook 与数据契约](/advanced/hook-contract)
3. [自动生成插件开发](/advanced/plugin-agent-development)

第一篇先帮您把插件结构跑通，第二篇解释“每一步到底会收到什么”，第三篇再讲如何更高效地用 AI Agent 生成或修改插件。

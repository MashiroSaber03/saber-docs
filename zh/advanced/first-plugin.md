# 从零创建第一个插件

这一页的目标很简单：让您从零创建一个**能被系统识别、能在界面里启用、能在翻译结果里看到效果**的插件。

为了让第一次体验更直观，这里不做“只打日志”的示例，而是做一个最小的**普通翻译后处理插件**：它会在译文末尾追加一个测试标记。

---

## 先确认适合的模式和步骤

这个示例选择：

- 步骤：`after_translate`
- 模式：`standard`

原因很简单：

- `after_translate` 直接处理普通翻译结果
- 改完后您能立刻在译文里看到标记
- 逻辑最短，也最容易验证

::: warning 注意
`after_translate` 只适合普通翻译主链。高质量翻译和 AI 校对使用的是 `ai_translate`，不是 `translate`。
:::

---

## 第一步：创建插件目录

在 Saber Translator 应用根目录下找到：

```text
plugins/
```

然后新建一个子目录，例如：

```text
plugins/
  my_first_plugin/
```

---

## 第二步：创建 `__init__.py`

在 `my_first_plugin/` 下创建 `__init__.py`：

```python
from .plugin import MyFirstPlugin
```

这一步的作用很直接：把您的插件类暴露给插件加载器。

---

## 第三步：创建 `plugin.py`

在同一目录下创建 `plugin.py`，填入下面这份最小可运行代码：

```python
import copy

from src.plugins.base import PluginBase


class MyFirstPlugin(PluginBase):
    plugin_id = "my_first_plugin"
    display_name = "我的第一个插件"
    plugin_version = "1.0.0"
    plugin_author = "Your Name"
    plugin_description = "在普通翻译结果末尾追加测试标记。"
    default_enabled = False
    supported_steps = ("translate",)
    supported_modes = ("standard",)
    priority = 100
    failure_policy = "continue"

    def after_translate(self, context, result):
        updated = copy.deepcopy(result)
        updated["translated_texts"] = [
            f"{text}【插件测试】"
            for text in updated.get("translated_texts", [])
        ]
        return updated
```

这段代码做了 3 件事：

1. 把插件声明为一个 `translate` 步骤插件
2. 只让它在 `standard` 模式下生效
3. 在普通翻译结果后追加 `【插件测试】`

---

## 第四步：刷新插件列表

保存文件后：

1. 打开 Saber Translator
2. 进入翻译页
3. 点击**设置**
4. 打开**插件管理**
5. 点击**刷新插件**

如果结构和代码没有问题，列表中应该能看到：

- `我的第一个插件`

然后把它启用。

---

## 第五步：验证是否真的生效

验证方式推荐尽量简单：

1. 选择一张图片
2. 使用**普通翻译模式**
3. 翻译完成后查看译文

如果插件生效，您应该能看到类似：

```text
原本译文……【插件测试】
```

这说明您的插件已经完成了：

- 被系统发现
- 成功加载
- 可以启用
- 正确命中 `after_translate`
- 正确修改了翻译结果

---

## 如果没有效果，先检查什么

最常见的问题通常是下面这几类：

### 插件没有出现在列表里

优先检查：

- 目录名是否正确
- 是否同时存在 `__init__.py` 和 `plugin.py`
- `__init__.py` 里导出的类名是否和 `plugin.py` 一致

### 插件出现在列表里，但启用后没效果

优先检查：

- 是否真的点击了**启用**
- 是否使用的是**普通翻译模式**
- `supported_steps` 是否写成了 `("translate",)`
- `supported_modes` 是否写成了 `("standard",)`

### 插件报错

优先检查：

- `after_translate` 返回的是不是 `dict` 或 `None`
- 是否误改成了字符串、列表等其他类型
- 是否直接原地修改了不兼容的数据结构

---

## 为什么示例里要用 `copy.deepcopy`

推荐写法不是直接改原对象，而是先复制再改：

```python
updated = copy.deepcopy(result)
```

这样做的好处是：

- 更安全
- 更容易排查问题
- 不容易误伤同一批次里后续还要使用的数据

对于大多数插件，尤其是第一次写插件时，建议优先采用这种写法。

---

## 下一步怎么学

当您完成这个第一个插件后，建议马上继续看：

- [Hook 与数据契约](/advanced/hook-contract)

因为接下来真正会决定插件质量的，不是“会不会创建文件”，而是：

- 这个步骤到底会给您什么输入
- 您应该修改哪个字段
- 什么模式下才会触发这个 Hook
- 什么情况下应该用 `continue`，什么情况下应该用 `fail`

如果您不想手写，也可以继续看：

- [自动生成插件开发](/advanced/plugin-agent-development)

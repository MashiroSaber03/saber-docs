# 插件开发总览

当前流程插件使用 **Plugin v3** 契约，由 Worker 在翻译步骤中执行。浏览器只负责管理和查看状态，不加载 Python 插件代码。

::: tip 版本区别
重构前的 `src.plugins.base.PluginBase`、应用根目录热加载方式和旧字段名不再适用于当前版本。请按本节重新打包，不要直接复制旧教程示例。
:::

## 先理解插件是什么

插件可以在检测、OCR、颜色提取、普通翻译、高质量翻译、修复和渲染前后处理数据，也可在任务生命周期中记录或校验信息。

它适合文本清洗、固定规则后处理和样式修正，不需要为此修改主程序。

## 插件包结构

导入的是 ZIP 包，包根目录直接放置清单与入口：

```text
my_plugin.zip
├── plugin.json
├── plugin.py
└── helpers.py        # 可选
```

`plugin.json` 使用 `schema_version: 3`，声明插件 ID、入口、Hook、模式和配置。入口形式为 `plugin.py:Plugin`，类用无参构造，不要求继承项目内部基类。

入门示例见[从零创建第一个插件](/advanced/first-plugin)。

## 支持的步骤和模式

| 步骤 | 作用 |
|------|------|
| `job` | 章节任务生命周期 |
| `pipeline` | 完整流水线生命周期 |
| `detect`、`ocr`、`color` | 检测、文字识别和颜色提取 |
| `translate` | 普通翻译 |
| `ai_translate` | 高质量翻译和 AI 校对 |
| `inpaint`、`render` | 背景修复和渲染 |

每个步骤有 `before_*`、`after_*` Hook。支持的模式为 `standard`、`hq`、`proofread`、`remove_text`。声明的 Hook、步骤与模式必须与实际执行场景相符；没有开放 `before_save` / `after_save`。

## 配置与版本

- `priority` 越小越先执行；相同优先级按插件 ID 排序。
- `failure_policy` 为 `continue` 或 `fail`。
- `config_schema` 支持 `text`、`number`、`boolean`、`select`。
- **运行时启用**控制本次后端运行的状态；**默认启用**控制重启后的初始状态。

导入后，程序保存不可变版本：

```text
data-v2/plugins/{plugin_id}/versions/{plugin_version_id}/
```

不要直接修改这个目录。更新代码后重新导入 ZIP，即使版本文本不变，也会发布新的内部版本。

任务创建时固定插件版本与配置。之后修改开关、导入新版，不会改变已经排队或暂停的旧任务。

重试与恢复不同：恢复继续原任务；重试创建新任务，可按任务类型选择当前设置或原快照。验证新版插件时，应新建任务或使用支持的当前设置重试，不能选择原快照后期待加载新代码。

## 开发边界

Hook 输入输出必须符合当前字段契约，必须返回 JSON 兼容对象。图片通过资产 ID 传递，不在 Hook 对象中放入图片 bytes、Base64 或 data URL。

同步实例方法才是支持的 Hook 形式，不使用 `async`、`staticmethod` 或 `classmethod`。

阅读顺序：

1. [从零创建第一个插件](/advanced/first-plugin)
2. [Hook 与数据契约](/advanced/hook-contract)
3. [自动生成插件开发](/advanced/plugin-agent-development)

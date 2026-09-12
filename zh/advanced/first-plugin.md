# 从零创建第一个插件

本例制作一个普通翻译后处理插件，在译文末尾追加测试标记，方便确认插件已经生效。

## 第一步：准备两个文件

新建一个用于编辑的文件夹，放入 `plugin.json` 和 `plugin.py`。无需把源文件夹放进程序的数据目录。

### plugin.json

```json
{
  "schema_version": 3,
  "plugin_id": "my_first_plugin",
  "display_name": "我的第一个插件",
  "package_version": "1.0.0",
  "entrypoint": "plugin.py:Plugin",
  "hooks": ["after_translate"],
  "supported_steps": ["translate"],
  "supported_modes": ["standard"],
  "priority": 100,
  "failure_policy": "continue",
  "author": "Your Name",
  "description": "在普通翻译结果末尾追加测试标记",
  "default_enabled": false,
  "config_schema": {
    "suffix": {
      "type": "text",
      "default": "【插件测试】"
    }
  }
}
```

### plugin.py

```python
class Plugin:
    def after_translate(self, context, data):
        result = dict(data)
        suffix = context.config["suffix"]
        result["translations"] = [
            f"{text}{suffix}" for text in data["translations"]
        ]
        return result
```

这里使用 `dict(data)` 保留其他必填字段，再替换译文数组。返回值不能是 `None`；字段是 `translations`，不是旧版的 `translated_texts`。

## 第二步：打包并导入

将这两个文件压缩到 ZIP 根目录：

```text
my_first_plugin.zip
├── plugin.json
└── plugin.py
```

1. 打开翻译页的**设置 → 插件管理**。
2. 导入 ZIP 包。
3. 确认插件显示正常，再启用它。

不要额外包一层 `my_first_plugin/` 目录，否则清单不在 ZIP 根目录。

## 第三步：验证效果

1. 选择一张图片。
2. 在启用插件之后，新建一次**普通翻译**任务。
3. 翻译完成后检查译文是否带有 `【插件测试】`。

已入队任务保留创建时的插件配置，因此不要用启用前已经创建的任务判断新插件是否生效。

## 常见问题

| 现象 | 检查内容 |
|------|----------|
| 导入失败 | ZIP 根目录、清单版本、入口文件和类名 |
| 启用后没有标记 | 是否新建普通翻译任务；本例不用于 HQ 或 AI 校对 |
| Hook 报错 | 是否返回对象，是否保留必填字段与数组长度 |
| 改了源文件却没变化 | 修改后需要重新打包导入；刷新不是从任意源目录热加载 |

下一步见[Hook 与数据契约](/advanced/hook-contract)。

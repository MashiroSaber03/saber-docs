---
outline: deep
---

# 如何获取 API Key

API Key 由模型服务商提供。请先在对应平台创建密钥，再填写到 Saber 的相应服务配置中。控制台界面会变化，以下保留操作路径，并链接到官方说明。

## SiliconFlow（硅基流动）

1. 登录 SiliconFlow 控制台。
2. 在密钥管理中创建 API Key。
3. 从模型列表选择当前账号可调用的模型，复制实际模型 ID。
4. 在 Saber 选择 SiliconFlow，填写密钥和模型，测试连接。

入口与调用方式见[SiliconFlow 官方快速入门](https://docs.siliconflow.cn/docs/userguide/quickstart)。

## 火山引擎

在火山方舟控制台按当前官方指引创建 API Key，并取得可调用的模型或推理接入点标识，再填写到 Saber 对应服务配置。

请以[火山方舟官方文档](https://www.volcengine.com/docs/82379)为准，不要把商品名称直接当作模型 ID。

## DeepSeek

1. 在 DeepSeek 开放平台创建 API Key。
2. 查看当前可用模型与接口 ID。
3. 在 Saber 中选择 DeepSeek，填写密钥与实际模型 ID。

详见[DeepSeek 官方快速入门](https://api-docs.deepseek.com/)。不要把旧教程中的固定模型别名当作长期不变的默认值。

## Google Gemini

通过 Google AI Studio 创建或管理 Gemini API Key，再根据当前模型文档选择所需模型。

- [Gemini API Key 官方说明](https://ai.google.dev/gemini-api/docs/api-key)
- [Gemini 模型文档](https://ai.google.dev/gemini-api/docs/models)
- [可用地区说明](https://ai.google.dev/gemini-api/docs/available-regions)

密钥类型、项目权限和可用地区以官方要求为准。不要使用第三方网络服务推荐替代对官方可用条件的检查。

## 填写后如何检查

回到[模型服务配置](/config/model-service)，先测试连接，再用少量内容测试实际能力。能获取模型列表不代表某个模型支持图片输入。

不要把 API Key 或插件配对令牌贴到反馈截图、公开日志或群聊中。

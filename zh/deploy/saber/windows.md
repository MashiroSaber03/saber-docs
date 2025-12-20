---
outline: deep
---

# Windows 部署

Saber Translator 支持在 Windows 系统上运行。本文档将指导你如何在 Windows 上部署 Saber Translator。

## 方式一：源码部署（推荐）

源码部署便于日后快速更新，推荐使用这种方法。

### 前置条件

- **Python 3.10+**：[Python 官网下载](https://www.python.org/downloads/)
- **Git**：[Git 官网下载](https://git-scm.com/downloads)

### 部署步骤

#### 1. 克隆仓库

```bash
git clone https://github.com/MashiroSaber03/Saber-Translator.git
cd Saber-Translator
```

#### 2. 下载模型文件

访问 [GitHub Releases](https://github.com/MashiroSaber03/Saber-Translator/releases) 页面，下载最新版本的 **`models.zip`**，解压到项目根目录。

解压后的目录结构应该如下：

```
Saber-Translator/
├── models/          # 模型文件夹
├── src/
├── app.py
└── requirements.txt
```

#### 3. 创建虚拟环境

```bash
python -m venv venv
venv\Scripts\activate
```

#### 4. 安装依赖

根据你的硬件配置选择对应的依赖文件：

**CPU 版本：**
```bash
pip install -r requirements-cpu.txt
```

**GPU 版本（需要 NVIDIA 显卡）：**
```bash
pip install -r requirements-gpu.txt
```

#### 5. 启动应用

```bash
python app.py
```

#### 6. 访问应用

在浏览器中访问：**http://localhost:5000**

### 更新方法

源码部署的优势在于更新非常简单：

```bash
git pull origin main
pip install -r requirements-cpu.txt  # 或 requirements-gpu.txt
```

如果有模型更新，需要重新下载 `models.zip` 并替换。

---

## 方式二：压缩包部署

如果不想配置 Python 环境，可以直接下载打包好的压缩包。

### 下载渠道

#### 方法 1：GitHub Releases

访问 [GitHub Releases](https://github.com/MashiroSaber03/Saber-Translator/releases) 页面，下载对应版本的压缩包：

- `Saber-Translator-x.x.x-cpu.zip`（CPU 版本）
- `Saber-Translator-x.x.x-gpu.zip`（GPU 版本，需要 NVIDIA 显卡）

#### 方法 2：QQ 群文件

加入 QQ 群后，在群文件中也可以下载到压缩包。

### 使用步骤

1. **解压文件**

   将下载的压缩包解压到任意目录。

2. **运行程序**

   双击 `Saber-Translator.exe` 启动应用。

3. **访问应用**

   程序启动后，浏览器会自动打开 **http://localhost:5000**。

### 更新方法

下载最新版本的压缩包，解压后替换旧版本即可。

⚠️ **注意**：更新前请备份 `data` 文件夹（包含配置和书架数据）。

---

## 常见问题

### 端口被占用

如果 5000 端口已被占用，可以修改端口：

```bash
python app.py --port 8080
```

### 依赖安装失败

如果遇到依赖安装问题：

1. 升级 pip：`python -m pip install --upgrade pip`
2. 清除缓存：`pip cache purge`
3. 重新安装：`pip install -r requirements-cpu.txt`（或 `requirements-gpu.txt`）

### 模型加载失败

确保 `models` 文件夹在项目根目录，且包含所有必要的模型文件。

### GPU 版本无法运行

- 确认已安装 NVIDIA 显卡驱动
- 确认已安装 CUDA 和 cuDNN
- 如果仍然无法运行，请使用 CPU 版本

## 获取帮助

如果遇到问题，请通过以下方式获取帮助：

- [GitHub Issues](https://github.com/MashiroSaber03/Saber-Translator/issues)
- [QQ 群](/community#qq-群)
- [常见问题](/faq)

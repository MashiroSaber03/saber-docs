---
outline: deep
---

# Windows 部署

Saber Translator 提供 Windows 整合包，也支持源码运行。普通用户可以优先使用整合包；需要修改代码或跟进开发版时，再选择源码部署。

::: tip 文档适用版本
本教程对应使用 `saber_v2.py` 启动、带有桌面控制中心的后端重构版。源码示例使用当前 `dev` 分支。旧版 `main` 的入口和数据格式不同，请不要混用。
:::

## 方式一：整合包部署

### 下载与启动

1. 从 [GitHub Releases](https://github.com/MashiroSaber03/Saber-Translator/releases) 或[社区群文件](/community)下载对应版本的 Windows CPU / GPU 包。
2. 下载所选 CPU / GPU 版本的全部 `.7z.*` 分卷，放在同一目录，用 7-Zip 或 Bandizip 从 `.7z.001` 开始解压。保留程序、模型和随包文件的目录结构。
3. 双击 `Saber-Translator.exe`，打开桌面控制中心。
4. 点击**启动后端**。启动完成后，根据桌面设置自动打开 Web 页面，默认地址为 [http://127.0.0.1:5000/](http://127.0.0.1:5000/)。
5. 完成[模型服务配置](/config/model-service)，再导入图片开始翻译。

GPU 包需要兼容的 NVIDIA 显卡及驱动；没有对应设备时请选择 CPU 包。运行日志、模型常驻和局域网设置见[桌面控制中心](/use/desktop)。

### 更新整合包

1. 停止后端，退出程序。
2. 按[数据备份](/use/data-management)备份实际使用的数据目录。
3. 将新版解压到完整的新程序目录，再启动并确认数据。
4. 若提示数据结构不兼容，保留备份，按该版本说明处理。

::: warning 注意
Windows 整合包数据默认位于 `%LOCALAPPDATA%\SaberTranslator\data-v2`，不是解压目录下的旧 `data`。不要删除数据目录来尝试解决启动问题。
:::

## 方式二：源码部署

### 前置条件

- Python **3.12**：与当前项目使用的运行环境一致。
- Git。
- 修改并构建前端时，还需 Node.js 20.19+ 或 22.12+ 及 npm。

### 1. 获取代码

```powershell
git clone --branch dev https://github.com/MashiroSaber03/Saber-Translator.git
cd Saber-Translator
python -m venv venv
```

以下命令在项目根目录执行，不要求先激活虚拟环境。

### 2. 安装依赖

**CPU 版本：**

```powershell
.\venv\Scripts\python.exe -m pip install "torch==2.11.0+cpu" "torchvision==0.26.0+cpu" --index-url https://download.pytorch.org/whl/cpu
.\venv\Scripts\python.exe -m pip install -r requirements-cpu.txt
```

**GPU 版本：**

```powershell
.\venv\Scripts\python.exe -m pip install "torch==2.11.0+cu130" "torchvision==0.26.0+cu130" --index-url https://download.pytorch.org/whl/cu130
.\venv\Scripts\python.exe -m pip install -r requirements-gpu.txt
.\venv\Scripts\python.exe -m pip install --force-reinstall --no-deps "onnxruntime-gpu>=1.27,<2"
```

先安装对应的 PyTorch 版本，再安装项目依赖，可避免依赖自动选中另一种版本。GPU 环境最后重新安装 ONNX Runtime GPU，是因为部分依赖也会安装同名模块的 CPU 包。更新时，以所检出版本的依赖说明为准。

可检查 GPU 是否可用：

```powershell
.\venv\Scripts\python.exe -c "import torch, onnxruntime as ort; ort.preload_dlls(); print(torch.cuda.is_available(), ort.get_available_providers())"
```

### 3. 准备模型

下载与所运行版本配套的模型文件，按发布说明放入根目录的 `models/`。不要用旧模型包覆盖新版目录。

若下载的是 `models.zip`、`models.z01`、`models.z02` 等分卷，需下载全部并放在同一目录，从 `models.zip` 解压到项目根目录，得到 `models/` 文件夹。模型分卷与上面的程序 `.7z.*` 分卷不是同一种格式。

当前部分模型目录如下，并非完整清单：

| 模型 | 目录或文件 |
|------|------------|
| PP-OCRv6 Medium | `models/paddle_ocr_onnx_v6/`：包含 `det.onnx`、`rec.onnx`、`ppocrv6_dict.txt` |
| PaddleOCR-VL 1.6 | `models/paddleocr_vl_1_6/`：完整模型文件 |
| 可选 LaMa Manga | `models/lama-manga/lama-manga.safetensors` |

选择本地检测、OCR 或修复模型前，需要准备对应文件。

### 4. 启动

**桌面控制中心：**

```powershell
.\venv\Scripts\python.exe saber_v2.py
```

打开后点击**启动后端**。

**纯终端运行：**

```powershell
.\venv\Scripts\python.exe saber_v2.py --role launcher
```

Launcher 会管理 API 和 Worker，无需分别手动启动。

更换端口或不自动打开浏览器：

```powershell
.\venv\Scripts\python.exe saber_v2.py --role launcher --port 8080 --no-browser
```

### 5. 前端开发与构建

使用随源码提供的已构建 Web 页面时，可直接启动后端。修改前端代码后，需要重新构建：

```powershell
cd vue-frontend
npm ci
npm run build:check
```

构建结果写入 `src/backend_v2/static/vue`。开发时也可以在后端运行期间，用另一个终端执行 `npm run dev`。

### 更新源码

停止后端并备份实际数据目录，确认当前分支后再更新：

```powershell
git status
git pull --ff-only
.\venv\Scripts\python.exe -m pip install -r requirements-cpu.txt
```

GPU 环境使用 GPU 依赖说明；如更新包含前端修改，应重新构建。不要在 `dev` 工作区直接执行 `git pull origin main` 混入旧分支。

## 常见问题

### 打不开 Web 页面

先看桌面控制中心中的后端状态和运行日志。窗口打开不代表后端已经启动；模型加载失败、端口占用也会影响启动。

### 局域网无法访问

启用桌面设置中的局域网访问，重启后端后使用电脑的局域网 IP 和端口访问。手机上的 `localhost` 指向手机自身，不能用来访问电脑。还需确认设备可互通、系统防火墙允许对应端口。

### 模型或依赖加载失败

根据日志中的模型名称、缺失文件或依赖错误逐项检查。不要仅凭现象判断是路径问题，也不要直接删除已有书籍数据。

更多方法见[常见问题](/faq)。

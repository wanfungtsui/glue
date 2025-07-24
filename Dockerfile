# 使用Python 3.11作为基础镜像（包含Node.js）
FROM python:3.11-slim

# 安装Node.js和npm
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 设置工作目录
WORKDIR /app

# 安装系统依赖（包括Puppeteer需要的依赖）
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-freefont-ttf \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 设置Puppeteer环境变量
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# 复制Python依赖文件
COPY requirements.txt .

# 安装Python依赖
RUN pip install --no-cache-dir -r requirements.txt

# 复制package文件
COPY package*.json ./
COPY frontend/package*.json ./frontend/

# 安装Node.js依赖
RUN npm ci --only=production
RUN cd frontend && npm ci --only=production

# 复制源代码
COPY . .

# 构建前端
RUN cd frontend && npm run build

# 设置启动脚本权限
RUN chmod +x start.sh

# 暴露端口
EXPOSE 7860

# 启动命令
CMD ["./start.sh"] 
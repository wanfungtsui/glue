# Glue - AI Web Component Generator

AI-powered website design system analyzer and component generator with Figma integration.

## 🚀 Features

- **Website Analysis**: Analyze any website's design system automatically
- **Figma Integration**: Import and analyze Figma design files
- **AI Component Generation**: Generate React components with AI
- **Design Token Extraction**: Extract colors, typography, and spacing
- **Real-time Preview**: See generated components instantly

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **AI**: DeepSeek API for component generation
- **Design**: Figma API for design file analysis
- **Web Scraping**: Puppeteer for website analysis

## 🚀 Deployment

### Hugging Face Spaces Deployment

This project is configured for deployment on Hugging Face Spaces.

#### Prerequisites

1. **Hugging Face Account**: Sign up at [huggingface.co](https://huggingface.co)
2. **API Keys**: 
   - Figma Personal Access Token
   - DeepSeek API Key

#### Deployment Steps

1. **Create a new Space**:
   - Go to [Hugging Face Spaces](https://huggingface.co/spaces)
   - Click "Create new Space"
   - Choose "Docker" as the SDK
   - Set visibility (Public/Private)

2. **Configure Environment Variables**:
   - Go to your Space settings
   - Add the following secrets:
     - `FIGMA_TOKEN`: Your Figma Personal Access Token
     - `DEEPSEEK_API_KEY`: Your DeepSeek API Key

3. **Deploy**:
   - Push your code to the Space repository
   - Hugging Face will automatically build and deploy your app

#### Local Development

```bash
# Install dependencies
npm install
cd frontend && npm install

# Set environment variables
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev
```

#### Docker Deployment

```bash
# Build and run with Docker
docker-compose up --build

# Or build manually
docker build -t glue-app .
docker run -p 8080:8080 --env-file .env glue-app
```

## 📁 Project Structure

```
glue/
├── backend/           # Node.js backend
│   ├── src/
│   │   ├── server.ts  # Express server
│   │   ├── analyzer.ts # Design analysis logic
│   │   ├── figma.ts   # Figma API integration
│   │   └── scraper.ts # Web scraping logic
│   └── tsconfig.json
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
├── Dockerfile         # Docker configuration
├── docker-compose.yml # Docker Compose setup
└── package.json       # Root package.json
```

## 🔧 API Endpoints

- `POST /api/analyze` - Analyze website by URL
- `POST /api/analyze-files` - Analyze HTML and CSS files
- `POST /api/analyze-figma` - Analyze Figma design file
- `POST /api/generate` - Generate component with AI
- `GET /health` - Health check

## 🛠️ Environment Variables

- `FIGMA_TOKEN`: Figma Personal Access Token
- `DEEPSEEK_API_KEY`: DeepSeek API Key
- `PORT`: Server port (default: 8080)
- `NODE_ENV`: Environment (development/production)

## 📝 License

ISC License

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Note**: This project requires API keys for Figma and DeepSeek services. Make sure to configure them in your Hugging Face Space settings or local environment file. 
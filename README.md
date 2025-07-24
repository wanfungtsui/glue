---
title: Glue - AI Web Component Generator
emoji: 🎨
colorFrom: blue
colorTo: purple
sdk: docker
app_port: 7860
---

# Glue - AI Web Component Generator

<div align="center">
  <p><em>Intelligent website design system analysis and AI-powered component generation</em></p>
</div>

## 🚀 Overview

Glue is an innovative web-based application that leverages AI to analyze existing website styles and generate new, style-consistent web components. This tool empowers designers and developers to rapidly create components that seamlessly match their existing website's design language.

## ✨ Core Features

### 🔍 Multi-Source Analysis
- **Website URL Analysis**: Direct website analysis via URL input
- **HTML/CSS File Upload**: Direct file analysis with drag-and-drop support
- **Figma Design Integration**: Analyze Figma design files and extract design tokens
- **Intelligent Style Extraction**: Comprehensive CSS parsing and design pattern recognition

### 🎨 Advanced Design System Analysis
- **Smart Color Categorization**: Primary, secondary, background, text, accent, and error colors
- **Typography System**: Font families, sizes, weights, and hierarchy analysis
- **Layout & Spacing**: Margin, padding, and spacing pattern detection
- **Component Recognition**: Automatic identification of UI components and patterns

### 🤖 AI Component Generation
- **DeepSeek AI Integration**: Advanced AI-powered component generation
- **Style-Consistent Output**: Components that match analyzed design systems
- **Natural Language Prompts**: Describe components in plain English
- **Multi-Format Export**: HTML, CSS, and component descriptions

### 💻 Code Export & Preview
- **Real-time Preview**: See generated components instantly
- **Production-Ready Code**: Clean, accessible, and responsive output
- **Multiple Export Formats**: HTML, CSS, and React components
- **Design Token Export**: Extract and reuse design tokens

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Full type safety and enhanced developer experience
- **TailwindCSS** - Utility-first CSS framework for rapid styling
- **React Router** - Client-side routing and navigation
- **Redux Toolkit** - State management and data flow
- **React Dropzone** - File upload with drag-and-drop
- **Material Web Components** - Modern UI components

### Backend Stack
- **Node.js** - Server-side JavaScript runtime
- **Express.js** - Fast, unopinionated web framework
- **TypeScript** - Type-safe server development
- **Cheerio** - Server-side HTML parsing and manipulation
- **Puppeteer** - Web scraping and page analysis
- **CORS** - Cross-origin resource sharing support

### AI & Analysis
- **DeepSeek API** - Advanced AI for component generation and style analysis
- **Figma API** - Design file analysis and token extraction
- **Custom CSS Parser** - Intelligent style extraction and categorization
- **Design System Analyzer** - Automated design pattern recognition

### Development Tools
- **ts-node-dev** - TypeScript development with hot reload
- **Concurrently** - Run multiple npm scripts simultaneously
- **ESLint & Prettier** - Code linting and formatting

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- DeepSeek API key
- Figma Personal Access Token

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/wanfungtsui/glue.git
   cd glue
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Create .env file in the project root
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This command will start:
   - Frontend server at `http://localhost:3000`
   - Backend server at `http://localhost:8080`

### Individual Commands

```bash
# Start only the frontend
npm run start:frontend

# Start only the backend  
npm run start:backend

# Build for production
npm run build

# Build backend for production
npm run build:backend

# Run tests
npm test
```

## 📁 Project Structure

```
glue/
├── frontend/                  # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   │   ├── Home.tsx     # Landing page
│   │   │   ├── Analysis.tsx # Design analysis interface
│   │   │   ├── Generator.tsx # AI component generator
│   │   │   └── CodeExport.tsx # Code export and preview
│   │   ├── services/        # API service functions
│   │   ├── store/          # Redux store configuration
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── backend/                  # Node.js backend server
│   └── src/
│       ├── server.ts       # Main Express server
│       ├── analyzer.ts     # AI analyzer implementation
│       ├── figma.ts        # Figma API integration
│       └── scraper.ts      # Website scraping functionality
├── node_modules/            # Dependencies
├── package.json            # Project configuration & scripts
└── README.md              # Project documentation
```

## 🛠️ API Endpoints

### Core Analysis Endpoints

- **`POST /api/analyze`** - Analyze website by URL
  ```json
  {
    "url": "https://example.com"
  }
  ```

- **`POST /api/analyze-files`** - Analyze HTML/CSS files
  ```json
  {
    "html": "<html>...</html>",
    "css": "body { ... }"
  }
  ```

- **`POST /api/analyze-figma`** - Analyze Figma design file
  ```json
  {
    "figmaUrl": "https://www.figma.com/file/..."
  }
  ```

- **`POST /api/generate`** - Generate AI component
  ```json
  {
    "prompt": "Create a login form",
    "analysisData": { /* analysis results */ }
  }
  ```

- **`GET /health`** - Health check endpoint

## 🎯 Usage Examples

### 1. Website Analysis
```javascript
// Analyze a website by URL
const response = await fetch('/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://example.com'
  })
});
```

### 2. File Analysis
```javascript
// Analyze HTML/CSS files directly
const response = await fetch('/api/analyze-files', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    html: htmlContent,
    css: cssContent
  })
});
```

### 3. Figma Analysis
```javascript
// Analyze Figma design file
const response = await fetch('/api/analyze-figma', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    figmaUrl: 'https://www.figma.com/file/...'
  })
});
```

### 4. Component Generation
```javascript
// Generate a component with AI
const response = await fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'Create a contact form with email and message fields',
    analysisData: analysisResults
  })
});
```

## 🎨 Design System Analysis Output

The analyzer provides comprehensive design system insights:

```json
{
  "colors": {
    "primary": ["#3b82f6", "#2563eb"],
    "secondary": ["#64748b", "#475569"],
    "background": ["#ffffff", "#f8fafc"],
    "text": ["#1e293b", "#334155"],
    "accent": ["#06b6d4", "#0891b2"],
    "error": ["#dc2626", "#b91c1c"]
  },
  "typography": {
    "fonts": ["Inter", "system-ui", "sans-serif"],
    "sizes": ["2.25rem", "1.875rem", "1.5rem", "1.25rem", "1rem"],
    "weights": ["400", "500", "600", "700"]
  },
  "spacing": ["0.5rem", "1rem", "1.5rem", "2rem", "3rem"],
  "components": ["button", "input", "card", "navigation"],
  "gradients": ["linear-gradient(to right, #3b82f6, #1d4ed8)"]
}
```

## 🤖 AI Component Generation

The AI system uses DeepSeek's advanced language model with intelligent prompting:

- **Context-Aware**: Understands design system constraints
- **Style-Consistent**: Generates components matching existing patterns
- **Production-Ready**: Outputs clean, accessible code
- **Responsive**: Creates mobile-first, adaptive layouts

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```bash
# Required
DEEPSEEK_API_KEY=your_deepseek_api_key
FIGMA_TOKEN=your_figma_personal_access_token

# Optional
PORT=8080
NODE_ENV=development
```

### DeepSeek API Setup

1. Sign up at [DeepSeek](https://platform.deepseek.com/)
2. Generate an API key
3. Add the key to your `.env` file

### Figma API Setup

1. Go to [Figma Settings](https://www.figma.com/settings)
2. Navigate to "Personal access tokens"
3. Create a new token
4. Add the token to your `.env` file

## 🚦 Development Guidelines

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Consistent file naming conventions

### API Design
- RESTful endpoint structure
- Proper HTTP status codes
- Comprehensive error handling
- Request/response validation

### Performance
- Efficient CSS parsing algorithms
- Optimized AI API calls
- Response caching for repeated analyses
- Minimal bundle sizes

## 🧪 Testing

```bash
# Run frontend tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage
npm run test:coverage
```

## 📊 Performance Metrics

- **Analysis Speed**: < 5 seconds for typical websites
- **Component Generation**: < 3 seconds average response time
- **Memory Usage**: Optimized for efficient processing
- **Concurrent Users**: Supports 100+ simultaneous analyses

## 🔒 Security Features

- **Input Validation**: Comprehensive request sanitization
- **Rate Limiting**: Prevents API abuse
- **CORS Configuration**: Secure cross-origin requests
- **Environment Isolation**: Secure API key management

## 🌟 Future Roadmap

- [ ] **Multi-Framework Support**: React, Vue, Angular code generation
- [ ] **Component Library**: Sharable component marketplace
- [ ] **Collaboration Tools**: Team sharing and version control
- [ ] **Advanced AI Models**: Enhanced design system understanding
- [ ] **Plugin System**: Extensible analyzer architecture
- [ ] **Design Token Export**: Integration with design systems

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details on:

- Code style and standards
- Pull request process
- Issue reporting
- Development setup

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and feature requests via GitHub Issues
- **Discussions**: Join community discussions for help and ideas

---

<div align="center">
  <p>Built with ❤️ by the Glue team</p>
  <p><em>Transforming design systems with AI-powered analysis</em></p>
</div> 
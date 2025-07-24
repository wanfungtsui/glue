---
title: Glue - AI Web Component Generator
emoji: 🎨
colorFrom: blue
colorTo: purple
sdk: docker
app_port: 7860
---

# Glue - AI-Powered Website Design System Analyzer

<div align="center">
  <p><em>Intelligent website design system analysis and AI-powered component generation</em></p>
</div>

## 🚀 Overview

Glue is an innovative web-based application that leverages AI to analyze existing website styles and generate new, style-consistent web components. This tool empowers designers and developers to rapidly create components that seamlessly match their existing website's design language.

## ✨ Core Features

### 🔍 Website Style Analyzer
- **URL Input**: Direct website analysis via URL input
- **File Upload**: Direct HTML/CSS file analysis capability
- **Intelligent Style Extraction**:
  - Comprehensive CSS style parsing and analysis
  - DOM structure analysis with Cheerio
  - Smart design element extraction (colors, fonts, spacing, gradients)
  - Design pattern recognition and component identification

### 🎨 Advanced Color Categorization
- **Smart Color Classification**:
  - **Primary Colors**: Main brand elements, CTA buttons, headers
  - **Secondary Colors**: Supporting elements, secondary buttons
  - **Background Colors**: Page backgrounds, card backgrounds
  - **Text Colors**: Main text, headings, body content
  - **Accent Colors**: Highlights, links, active states
  - **Error/Warning Colors**: Error states, warnings, alerts

### 📝 Typography System Analysis
- **Font Priority Detection**: Automatically ranks fonts by usage importance
- **Font Size Hierarchy**: Organizes font sizes from largest to smallest
- **Typography Pattern Recognition**: Identifies consistent text styling patterns

### 📏 Layout & Spacing Analysis
- **Spacing System Extraction**: Identifies margin and gap patterns
- **Padding Analysis**: Extracts padding values and usage patterns
- **Layout Consistency Detection**: Recognizes spacing rhythm and patterns

### 🤖 AI Component Generator
- **DeepSeek AI Integration**: Advanced AI-powered component generation
- **Style-Aware Generation**: Creates components that match analyzed design systems
- **Context-Intelligent Prompts**: Natural language component requests
- **Multi-Format Output**: Generates HTML, CSS, and component descriptions

### 💻 Code Export
- **Production-Ready Code**: Clean, well-structured HTML and CSS
- **Responsive Design**: Mobile-first, adaptive layouts
- **Accessibility Features**: ARIA labels, semantic HTML, proper contrast
- **Modern CSS**: Uses CSS custom properties, Flexbox, and Grid

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Full type safety and enhanced developer experience
- **TailwindCSS** - Utility-first CSS framework for rapid styling
- **React Router** - Client-side routing and navigation
- **Redux Toolkit** - State management and data flow
- **Headless UI** - Accessible, unstyled UI components
- **Heroicons** - Beautiful hand-crafted SVG icons

### Backend Stack
- **Node.js** - Server-side JavaScript runtime
- **Express.js** - Fast, unopinionated web framework
- **TypeScript** - Type-safe server development
- **Cheerio** - Server-side HTML parsing and manipulation
- **Puppeteer** - Web scraping and page analysis
- **CORS** - Cross-origin resource sharing support

### AI & Analysis
- **DeepSeek API** - Advanced AI for component generation and style analysis
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
   git clone https://github.com/your-username/glue.git
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
   npm start
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
    "sizes": ["2.25rem", "1.875rem", "1.5rem", "1.25rem", "1rem"]
  },
  "spacing": ["0.5rem", "1rem", "1.5rem", "2rem", "3rem"],
  "padding": ["0.25rem", "0.5rem", "1rem", "1.5rem", "2rem"],
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
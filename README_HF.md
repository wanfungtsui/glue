# Glue - AI Web Component Generator

🚀 **Live Demo**: [Your HF Space URL]

AI-powered website design system analyzer and component generator with Figma integration, deployed on Hugging Face Spaces.

## 🎯 What is Glue?

Glue is an intelligent web application that:
- **Analyzes website design systems** automatically
- **Integrates with Figma** to analyze design files
- **Generates AI-powered components** that match your design language
- **Extracts design tokens** (colors, typography, spacing)
- **Provides real-time preview** of generated components

## 🚀 Features

### 🌐 Website Analysis
- Input any website URL
- Automatic design system extraction
- Color palette identification
- Typography analysis
- Layout and spacing detection

### 🎨 Figma Integration
- Analyze Figma design files
- Extract design tokens
- Import design systems
- Component generation based on Figma designs

### 🤖 AI Component Generation
- Natural language component requests
- Style-consistent output
- Production-ready code
- Responsive design

### 📁 File Analysis
- Direct HTML/CSS file analysis
- Design pattern recognition
- Component identification
- Style extraction

## 🛠️ How to Use

### 1. Website Analysis
1. Go to the "🌐 Website Analysis" tab
2. Enter a website URL (e.g., `https://example.com`)
3. Click "🔍 Analyze Website"
4. View the extracted design system

### 2. Figma Analysis
1. Go to the "🎨 Figma Analysis" tab
2. Paste a Figma file URL
3. Click "🎨 Analyze Figma"
4. Get design system insights

### 3. File Analysis
1. Go to the "📁 File Analysis" tab
2. Paste your HTML and CSS content
3. Click "📁 Analyze Files"
4. Extract design patterns

### 4. Component Generation
1. Go to the "🤖 Component Generation" tab
2. Describe the component you want
3. Optionally paste analysis results
4. Click "🤖 Generate Component"
5. Get AI-generated code

## 🔧 Configuration

This Space requires the following environment variables:

- `FIGMA_TOKEN`: Your Figma Personal Access Token
- `DEEPSEEK_API_KEY`: Your DeepSeek API Key

### Setting up API Keys

1. **Figma Token**:
   - Go to [Figma Settings](https://www.figma.com/settings)
   - Navigate to "Personal access tokens"
   - Create a new token
   - Copy the token value

2. **DeepSeek API Key**:
   - Sign up at [DeepSeek Platform](https://platform.deepseek.com/)
   - Generate an API key
   - Copy the key value

3. **Add to HF Space**:
   - Go to your Space settings
   - Add the tokens as secrets
   - The app will automatically use them

## 🏗️ Architecture

- **Frontend**: Gradio interface for easy interaction
- **Backend**: Node.js + Express API
- **AI**: DeepSeek API for component generation
- **Design**: Figma API for design analysis
- **Deployment**: Hugging Face Spaces with Docker

## 📊 Example Output

### Design System Analysis
```json
{
  "colors": {
    "primary": ["#3b82f6", "#2563eb"],
    "secondary": ["#64748b", "#475569"],
    "background": ["#ffffff", "#f8fafc"],
    "text": ["#1e293b", "#334155"]
  },
  "typography": {
    "fonts": ["Inter", "system-ui", "sans-serif"],
    "sizes": ["2.25rem", "1.875rem", "1.5rem", "1.25rem"]
  },
  "spacing": ["0.5rem", "1rem", "1.5rem", "2rem", "3rem"]
}
```

### Generated Component
```html
<div class="login-form">
  <h2>Login</h2>
  <form>
    <input type="email" placeholder="Email" />
    <input type="password" placeholder="Password" />
    <button type="submit">Sign In</button>
  </form>
</div>
```

## 🤝 Contributing

1. Fork this repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

ISC License

---

**Note**: This application requires valid API keys for Figma and DeepSeek services to function properly. Make sure to configure them in your Hugging Face Space settings. 
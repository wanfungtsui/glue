// API服务配置
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const api = {
  // 分析网站
  analyzeWebsite: async (url: string) => {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    return response.json();
  },

  // 分析文件
  analyzeFiles: async (html: string, css: string) => {
    const response = await fetch(`${API_BASE_URL}/api/analyze-files`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ html, css }),
    });
    return response.json();
  },

  // 分析Figma
  analyzeFigma: async (figmaUrl: string) => {
    const response = await fetch(`${API_BASE_URL}/api/analyze-figma`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ figmaUrl }),
    });
    return response.json();
  },

  // 生成组件
  generateComponent: async (prompt: string, analysisData?: any) => {
    const response = await fetch(`${API_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, analysisData }),
    });
    return response.json();
  },

  // 健康检查
  healthCheck: async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  },
}; 
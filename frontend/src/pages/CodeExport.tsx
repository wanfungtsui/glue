import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

interface ComponentTemplate {
  name: string;
  type: string;
  description: string;
  html: string;
  css: string;
}

const CodeExport: React.FC = () => {
  const navigate = useNavigate();
  const [component, setComponent] = useState<ComponentTemplate | null>(null);
  const [copySuccess, setCopySuccess] = useState<{ html: boolean; css: boolean; combined: boolean }>({
    html: false,
    css: false,
    combined: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 尝试从localStorage获取生成的组件
    const loadComponent = () => {
      try {
        const savedComponent = localStorage.getItem('generatedComponent');
        console.log('Loading component from localStorage:', savedComponent);
        
        if (savedComponent) {
          const parsedComponent = JSON.parse(savedComponent);
          
          // 验证组件数据的完整性
          if (parsedComponent && parsedComponent.html && parsedComponent.css) {
            setComponent({
              name: parsedComponent.name || 'Generated Component',
              type: parsedComponent.type || 'Component',
              description: parsedComponent.description || 'AI-generated component',
              html: parsedComponent.html,
              css: parsedComponent.css
            });
            console.log('Component loaded successfully');
          } else {
            console.log('Component data incomplete, using sample data');
            setComponent(getSampleComponent());
          }
        } else {
          console.log('No component data found, using sample data');
          setComponent(getSampleComponent());
        }
      } catch (error) {
        console.error('Error loading component:', error);
        setComponent(getSampleComponent());
      } finally {
        setLoading(false);
      }
    };

    loadComponent();
  }, []);

  // 获取示例组件（作为fallback）
  const getSampleComponent = (): ComponentTemplate => {
    return {
      name: 'Sample Card Component',
      type: 'UI Component',
      description: 'A modern card component with hover effects and responsive design',
      html: `<div class="card">
  <div class="card-image">
    <img src="/api/placeholder/300/200" alt="Sample Image" />
    <div class="card-badge">New</div>
  </div>
  <div class="card-content">
    <h3 class="card-title">Modern Card Design</h3>
    <p class="card-description">
      This is a beautifully designed card component with smooth animations 
      and modern styling. Perfect for showcasing content.
    </p>
    <div class="card-actions">
      <button class="btn-primary">Learn More</button>
      <button class="btn-secondary">Share</button>
    </div>
  </div>
</div>`,
      css: `/* Modern Card Component */
.card {
  max-width: 400px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.card-image {
  position: relative;
  overflow: hidden;
  height: 200px;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.card:hover .card-image img {
  transform: scale(1.05);
}

.card-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-content {
  padding: 24px;
}

.card-title {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.3;
}

.card-description {
  margin: 0 0 20px 0;
  color: #666;
  line-height: 1.6;
  font-size: 14px;
}

.card-actions {
  display: flex;
  gap: 12px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: transparent;
  color: #667eea;
  border: 1px solid #667eea;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.btn-secondary:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 480px) {
  .card {
    max-width: 100%;
    margin: 0 16px;
  }
  
  .card-actions {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}`
    };
  };

  const copyToClipboard = async (text: string, type: 'html' | 'css' | 'combined') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(prev => ({ ...prev, [type]: true }));
      
      // 2秒后重置状态
      setTimeout(() => {
        setCopySuccess(prev => ({ ...prev, [type]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      // 可以在这里添加用户友好的错误提示
    }
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getCombinedCode = () => {
    if (!component) return '';
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${component.name}</title>
    <style>
${component.css}
    </style>
</head>
<body>
${component.html}
</body>
</html>`;
  };

  const handleStartOver = () => {
    localStorage.removeItem('generatedComponent');
    localStorage.removeItem('analysisData');
    navigate('/');
  };

  const handleGenerateAnother = () => {
    navigate('/generator');
  };

  // Loading 状态
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--md-sys-color-background)',
        color: 'var(--md-sys-color-on-background)',
        padding: '20px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid var(--md-sys-color-outline)',
          borderTop: '4px solid var(--md-sys-color-primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}></div>
        <p style={{ fontSize: '16px', color: 'var(--md-sys-color-on-surface-variant)' }}>
          Loading your component...
        </p>
      </div>
    );
  }

  if (!component) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--md-sys-color-background)',
        color: 'var(--md-sys-color-on-background)'
      }}>
        <Header showBackButton={true} showNextButton={false} />
        <div style={{
          padding: '120px 20px 20px',
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <span className="material-icons" style={{ fontSize: '64px', color: 'var(--md-sys-color-error)', marginBottom: '20px' }}>
            error_outline
          </span>
          <h1 className="md-typescale-headline-medium" style={{ margin: '0 0 16px 0', color: 'var(--md-sys-color-on-background)' }}>
            No Component Found
          </h1>
          <p className="md-typescale-body-large" style={{ margin: '0 0 32px 0', color: 'var(--md-sys-color-on-surface-variant)' }}>
            It looks like there's no component to export. Please generate a component first.
          </p>
          <button
            onClick={handleGenerateAnother}
            style={{
              backgroundColor: 'var(--md-sys-color-primary)',
              color: 'var(--md-sys-color-on-primary)',
              border: 'none',
              borderRadius: '24px',
              padding: '12px 32px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Generated Component
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--md-sys-color-background)',
      color: 'var(--md-sys-color-on-background)'
    }}>
      <Header 
        nextButtonText="Start Over" 
        onNextClick={handleStartOver}
        showNextButton={true}
      />
      
      <main style={{ 
        padding: '24px 16px', 
        paddingTop: '96px', 
        maxWidth: '1400px', 
        margin: '0 auto' 
      }}>
        {/* 页面标题 */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 className="md-typescale-display-small" style={{ 
            color: 'var(--md-sys-color-on-surface)', 
            marginBottom: '12px',
            fontWeight: '400'
          }}>
            Done.Obviously. 
          </h1>
          <p className="md-typescale-body-large" style={{ 
            color: 'var(--md-sys-color-on-surface-variant)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
The component is ready. Export, deploy, repeat. I don’t do celebration.          </p>
        </div>

        {/* 组件信息卡片 */}
        <div className="md-elevation-1" style={{ 
          background: 'var(--md-sys-color-surface-container-high)', 
          borderRadius: '24px',
          marginBottom: '32px',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <h2 className="md-typescale-headline-medium" style={{ 
                  color: 'var(--md-sys-color-on-surface)', 
                  marginBottom: '8px',
                  fontWeight: '500'
                }}>
                  {component.name}
                </h2>
                <p className="md-typescale-body-large" style={{ 
                  color: 'var(--md-sys-color-on-surface-variant)', 
                  margin: '0 0 16px 0' 
                }}>
                  {component.description}
                </p>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  backgroundColor: 'var(--md-sys-color-primary-container)',
                  color: 'var(--md-sys-color-on-primary-container)',
                  padding: '8px 16px',
                  borderRadius: '16px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  <span className="material-icons" style={{ fontSize: '18px', marginRight: '8px' }}>category</span>
                  {component.type}
                </div>
              </div>
              
              <button
                onClick={handleGenerateAnother}
                style={{
                  backgroundColor: 'var(--md-sys-color-secondary)',
                  color: 'var(--md-sys-color-on-secondary)',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--md-sys-color-secondary-container)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--md-sys-color-secondary)'}
              >
                <span className="material-icons" style={{ fontSize: '18px' }}>add</span>
                Generate Another
              </button>
            </div>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', 
          gap: '32px',
          marginBottom: '32px'
        }}>
          {/* 实时预览 */}
          <div className="md-elevation-1" style={{ 
            background: 'var(--md-sys-color-surface-container)', 
            borderRadius: '24px'
          }}>
            <div style={{ padding: '32px' }}>
              <h3 className="md-typescale-title-large" style={{ 
                color: 'var(--md-sys-color-on-surface)', 
                marginBottom: '20px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span className="material-icons" style={{ marginRight: '12px', fontSize: '24px' }}>visibility</span>
                Live Preview
              </h3>
              
              <div style={{
                backgroundColor: 'var(--md-sys-color-surface)',
                borderRadius: '16px',
                padding: '32px',
                border: '2px solid var(--md-sys-color-outline-variant)',
                minHeight: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div 
                  dangerouslySetInnerHTML={{ __html: component.html }}
                />
                <style>{component.css}</style>
              </div>
            </div>
          </div>

          {/* 快速操作 */}
          <div className="md-elevation-1" style={{ 
            background: 'var(--md-sys-color-surface-container)', 
            borderRadius: '24px'
          }}>
            <div style={{ padding: '32px' }}>
              <h3 className="md-typescale-title-large" style={{ 
                color: 'var(--md-sys-color-on-surface)', 
                marginBottom: '20px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span className="material-icons" style={{ marginRight: '12px', fontSize: '24px' }}>flash_on</span>
                Quick Actions
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* 复制完整代码 */}
                <button 
                  onClick={() => copyToClipboard(getCombinedCode(), 'combined')}
                  style={{
                    backgroundColor: 'var(--md-sys-color-primary)',
                    color: 'var(--md-sys-color-on-primary)',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '16px 24px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    transition: 'all 0.2s ease',
                    width: '100%'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--md-sys-color-primary-container)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--md-sys-color-primary)'}
                >
                  <span className="material-icons" style={{ fontSize: '20px' }}>
                    {copySuccess.combined ? 'check_circle' : 'file_copy'}
                  </span>
                  {copySuccess.combined ? 'Copied Complete File!' : 'Copy Complete HTML File'}
                </button>

                {/* 下载选项 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <button 
                    onClick={() => downloadFile(component.html, `${component.name.replace(/\s+/g, '-').toLowerCase()}.html`, 'text/html')}
                    style={{
                      backgroundColor: 'var(--md-sys-color-secondary-container)',
                      color: 'var(--md-sys-color-on-secondary-container)',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '12px 8px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span className="material-icons" style={{ fontSize: '16px' }}>code</span>
                    HTML
                  </button>

                  <button 
                    onClick={() => downloadFile(component.css, `${component.name.replace(/\s+/g, '-').toLowerCase()}.css`, 'text/css')}
                    style={{
                      backgroundColor: 'var(--md-sys-color-secondary-container)',
                      color: 'var(--md-sys-color-on-secondary-container)',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '12px 8px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span className="material-icons" style={{ fontSize: '16px' }}>palette</span>
                    CSS
                  </button>

                  <button 
                    onClick={() => downloadFile(getCombinedCode(), `${component.name.replace(/\s+/g, '-').toLowerCase()}-complete.html`, 'text/html')}
                    style={{
                      backgroundColor: 'var(--md-sys-color-secondary-container)',
                      color: 'var(--md-sys-color-on-secondary-container)',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '12px 8px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span className="material-icons" style={{ fontSize: '16px' }}>download</span>
                    Full
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 代码展示区域 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', 
          gap: '32px',
          marginBottom: '32px'
        }}>
          {/* HTML 代码 */}
          <div style={{ 
            border: '1px solid var(--md-sys-color-outline)',
            borderRadius: '24px',
            backgroundColor: 'var(--md-sys-color-surface)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 className="md-typescale-title-large" style={{ 
                  color: 'var(--md-sys-color-on-surface)', 
                  margin: '0',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span className="material-icons" style={{ marginRight: '12px', fontSize: '24px' }}>code</span>
                  HTML Code
                </h3>
                <button 
                  onClick={() => copyToClipboard(component.html, 'html')}
                  style={{
                    backgroundColor: copySuccess.html ? 'var(--md-sys-color-secondary-container)' : 'var(--md-sys-color-primary-container)',
                    color: copySuccess.html ? 'var(--md-sys-color-on-secondary-container)' : 'var(--md-sys-color-on-primary-container)',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span className="material-icons" style={{ fontSize: '16px' }}>
                    {copySuccess.html ? 'check' : 'content_copy'}
                  </span>
                  {copySuccess.html ? 'Copied!' : 'Copy'}
                </button>
              </div>
              
              <div style={{
                backgroundColor: '#0d1117',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid var(--md-sys-color-outline-variant)',
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                <pre style={{ 
                  margin: '0',
                  fontSize: '14px',
                  color: '#e6edf3',
                  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, monospace',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {component.html}
                </pre>
              </div>
            </div>
          </div>

          {/* CSS 代码 */}
          <div style={{ 
            border: '1px solid var(--md-sys-color-outline)',
            borderRadius: '24px',
            backgroundColor: 'var(--md-sys-color-surface)',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 className="md-typescale-title-large" style={{ 
                  color: 'var(--md-sys-color-on-surface)', 
                  margin: '0',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span className="material-icons" style={{ marginRight: '12px', fontSize: '24px' }}>palette</span>
                  CSS Code
                </h3>
                <button 
                  onClick={() => copyToClipboard(component.css, 'css')}
                  style={{
                    backgroundColor: copySuccess.css ? 'var(--md-sys-color-secondary-container)' : 'var(--md-sys-color-primary-container)',
                    color: copySuccess.css ? 'var(--md-sys-color-on-secondary-container)' : 'var(--md-sys-color-on-primary-container)',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span className="material-icons" style={{ fontSize: '16px' }}>
                    {copySuccess.css ? 'check' : 'content_copy'}
                  </span>
                  {copySuccess.css ? 'Copied!' : 'Copy'}
                </button>
              </div>
              
              <div style={{
                backgroundColor: '#0d1117',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid var(--md-sys-color-outline-variant)',
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                <pre style={{ 
                  margin: '0',
                  fontSize: '14px',
                  color: '#79c0ff',
                  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, monospace',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {component.css}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* 使用说明 */}
        <div style={{ 
          border: '1px solid var(--md-sys-color-outline)',
          borderRadius: '24px',
          backgroundColor: 'var(--md-sys-color-surface)'
        }}>
          <div style={{ padding: '32px' }}>
            <h3 className="md-typescale-title-large" style={{ 
              color: 'var(--md-sys-color-on-surface)', 
              marginBottom: '24px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span className="material-icons" style={{ marginRight: '12px', fontSize: '24px' }}>integration_instructions</span>
              Integration Guide
            </h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '24px' 
            }}>
              <div style={{ 
                padding: '20px',
                backgroundColor: 'var(--md-sys-color-surface-variant)',
                borderRadius: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--md-sys-color-primary)',
                    color: 'var(--md-sys-color-on-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginRight: '16px'
                  }}>
                    1
                  </div>
                  <h4 className="md-typescale-title-medium" style={{ 
                    color: 'var(--md-sys-color-on-surface)', 
                    margin: '0',
                    fontWeight: '500'
                  }}>
                    Copy the Code
                  </h4>
                </div>
                <p className="md-typescale-body-medium" style={{ 
                  color: 'var(--md-sys-color-on-surface-variant)', 
                  margin: '0',
                  lineHeight: '1.5'
                }}>
                  Use the copy buttons above to get the HTML and CSS code, or download the complete file for immediate use.
                </p>
              </div>

              <div style={{ 
                padding: '20px',
                backgroundColor: 'var(--md-sys-color-surface-variant)',
                borderRadius: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--md-sys-color-primary)',
                    color: 'var(--md-sys-color-on-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginRight: '16px'
                  }}>
                    2
                  </div>
                  <h4 className="md-typescale-title-medium" style={{ 
                    color: 'var(--md-sys-color-on-surface)', 
                    margin: '0',
                    fontWeight: '500'
                  }}>
                    Integrate into Project
                  </h4>
                </div>
                <p className="md-typescale-body-medium" style={{ 
                  color: 'var(--md-sys-color-on-surface-variant)', 
                  margin: '0',
                  lineHeight: '1.5'
                }}>
                  Add the HTML to your template and CSS to your stylesheet. The component is responsive and ready to use.
                </p>
              </div>

              <div style={{ 
                padding: '20px',
                backgroundColor: 'var(--md-sys-color-surface-variant)',
                borderRadius: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--md-sys-color-primary)',
                    color: 'var(--md-sys-color-on-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginRight: '16px'
                  }}>
                    3
                  </div>
                  <h4 className="md-typescale-title-medium" style={{ 
                    color: 'var(--md-sys-color-on-surface)', 
                    margin: '0',
                    fontWeight: '500'
                  }}>
                    Customize as Needed
                  </h4>
                </div>
                <p className="md-typescale-body-medium" style={{ 
                  color: 'var(--md-sys-color-on-surface-variant)', 
                  margin: '0',
                  lineHeight: '1.5'
                }}>
                  Modify colors, sizes, or behavior to perfectly match your design requirements and brand guidelines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CodeExport; 
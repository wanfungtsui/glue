import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import axios from 'axios';

interface ComponentTemplate {
  name: string;
  type: string;
  description: string;
  html: string;
  css: string;
}

const Generator: React.FC = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedComponent, setGeneratedComponent] = useState<ComponentTemplate | null>(null);

  useEffect(() => {
    // 从localStorage获取分析数据
    const analysisData = localStorage.getItem('analysisData');
    if (!analysisData) {
      navigate('/');
      return;
    }
  }, [navigate]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // 从localStorage获取分析数据
      const analysisData = localStorage.getItem('analysisData');
      if (!analysisData) {
        throw new Error('No analysis data found');
      }

      // 调用AI生成API
      const response = await axios.post('http://localhost:8080/api/generate', {
        prompt: prompt.trim(),
        analysisData: JSON.parse(analysisData)
      });

      const { html, css, description } = response.data;
      
      // 创建组件对象
      const newComponent: ComponentTemplate = {
        name: 'Generated Component',
        type: 'Custom',
        description: description || prompt,
        html,
        css
      };
      
      setGeneratedComponent(newComponent);
      
      // 保存生成的组件到localStorage
      localStorage.setItem('generatedComponent', JSON.stringify(newComponent));
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate component. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = () => {
    if (generatedComponent) {
      navigate('/export');
    }
  };

  return (
    <>
      <Header 
        nextButtonText="Export Code" 
        onNextClick={handleExport}
        showNextButton={!!generatedComponent}
      />
      
      <main style={{ padding: '24px 16px', paddingTop: '96px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* 页面标题 */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="md-typescale-display-small" style={{ 
            color: 'var(--md-sys-color-on-surface)', 
            marginBottom: '8px',
            fontWeight: '400'
          }}>
            Your turn.
          </h1>
          <p className="md-typescale-body-large" style={{ 
            color: 'var(--md-sys-color-on-surface-variant)' 
          }}>
             Impress me — or at least try.
          </p>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="md-elevation-1" style={{ 
            backgroundColor: 'var(--md-sys-color-error-container)', 
            border: `1px solid var(--md-sys-color-error)`,
            borderRadius: '12px',
            marginBottom: '24px'
          }}>
            <div style={{ padding: '16px', display: 'flex', alignItems: 'center' }}>
              <span className="material-icons" style={{ 
                color: 'var(--md-sys-color-error)', 
                marginRight: '12px' 
              }}>
                error
              </span>
              <p className="md-typescale-body-medium" style={{ 
                color: 'var(--md-sys-color-on-error-container)', 
                margin: '0' 
              }}>
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Prompt 输入区域 */}
        <div className="md-elevation-1" style={{ 
          background: 'var(--md-sys-color-surface-container-high)', 
          borderRadius: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ padding: '24px' }}>
            <h2 className="md-typescale-headline-medium" style={{ 
              color: 'var(--md-sys-color-on-surface)', 
              marginBottom: '16px',
              fontWeight: '500'
            }}>
              Component Prompt
            </h2>
            
            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="prompt" className="md-typescale-body-medium" style={{ 
                display: 'block',
                color: 'var(--md-sys-color-on-surface)', 
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                Describe the component you want to generate
              </label>
              <textarea
                id="prompt"
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: A button component with hover effect and rounded corners..."
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: 'var(--md-sys-color-surface-variant)',
                  border: `1px solid var(--md-sys-color-outline)`,
                  borderRadius: '8px',
                  color: 'var(--md-sys-color-on-surface)',
                  fontSize: '16px',
                  fontFamily: 'Roboto, sans-serif',
                  resize: 'vertical',
                  minHeight: '120px',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--md-sys-color-primary)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--md-sys-color-outline)';
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="md-elevation-1"
                style={{
                  backgroundColor: (!prompt.trim() || isGenerating) ? 'var(--md-sys-color-surface)' : 'var(--md-sys-color-primary)',
                  color: (!prompt.trim() || isGenerating) ? 'var(--md-sys-color-on-surface-variant)' : 'var(--md-sys-color-on-primary)',
                  border: 'none',
                  borderRadius: '28px',
                  fontSize: '16px',
                  fontWeight: '500',
                  padding: '0 32px',
                  minWidth: '200px',
                  height: '56px',
                  cursor: (!prompt.trim() || isGenerating) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!((!prompt.trim() || isGenerating))) {
                    e.currentTarget.style.backgroundColor = 'var(--md-sys-color-primary-container)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!((!prompt.trim() || isGenerating))) {
                    e.currentTarget.style.backgroundColor = 'var(--md-sys-color-primary)';
                  }
                }}
              >
                {isGenerating ? (
                  <>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid transparent',
                      borderTop: '2px solid currentColor',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Generating Component...
                  </>
                ) : (
                  <>
                    <span className="material-icons">auto_awesome</span>
                    Generate Component
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 生成的组件预览 */}
        {generatedComponent && (
          <div className="md-elevation-1" style={{ 
            background: 'var(--md-sys-color-surface-container-high)', 
            borderRadius: '16px',
            marginBottom: '24px'
          }}>
            <div style={{ padding: '24px' }}>
              <h2 className="md-typescale-headline-medium" style={{ 
                color: 'var(--md-sys-color-on-surface)', 
                marginBottom: '24px',
                fontWeight: '500'
              }}>
                Generated Component
              </h2>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
                gap: '24px' 
              }}>
                {/* 预览区域 */}
                <div style={{ 
                  border: '1px solid var(--md-sys-color-outline)',
                  borderRadius: '16px',
                  backgroundColor: 'var(--md-sys-color-surface)'
                }}>
                  <div style={{ padding: '24px' }}>
                    <h3 className="md-typescale-title-medium" style={{ 
                      color: 'var(--md-sys-color-on-surface)', 
                      marginBottom: '16px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <span className="material-icons" style={{ marginRight: '8px' }}>visibility</span>
                      Preview
                    </h3>
                    <div style={{
                      backgroundColor: 'var(--md-sys-color-surface)',
                      borderRadius: '12px',
                      padding: '24px',
                      border: '1px solid var(--md-sys-color-outline-variant)',
                      minHeight: '120px'
                    }}>
                      <div 
                        dangerouslySetInnerHTML={{ __html: generatedComponent.html }}
                      />
                      <style>{generatedComponent.css}</style>
                    </div>
                  </div>
                </div>

                {/* 代码区域 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* HTML 代码 */}
                  <div style={{ 
                    border: '1px solid var(--md-sys-color-outline)',
                    borderRadius: '16px',
                    backgroundColor: 'var(--md-sys-color-surface)'
                  }}>
                    <div style={{ padding: '16px' }}>
                      <h4 className="md-typescale-title-small" style={{ 
                        color: 'var(--md-sys-color-on-surface)', 
                        marginBottom: '12px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <span className="material-icons" style={{ marginRight: '8px', fontSize: '20px' }}>code</span>
                        HTML
                      </h4>
                      <div style={{
                        backgroundColor: '#1e1e1e',
                        borderRadius: '8px',
                        padding: '16px',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        border: '1px solid var(--md-sys-color-outline-variant)'
                      }}>
                        <pre style={{ 
                          margin: '0',
                          fontSize: '12px',
                          color: '#9cdcfe',
                          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                          lineHeight: '1.4',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word'
                        }}>
                          {generatedComponent.html}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* CSS 代码 */}
                  <div style={{ 
                    border: '1px solid var(--md-sys-color-outline)',
                    borderRadius: '16px',
                    backgroundColor: 'var(--md-sys-color-surface)'
                  }}>
                    <div style={{ padding: '16px' }}>
                      <h4 className="md-typescale-title-small" style={{ 
                        color: 'var(--md-sys-color-on-surface)', 
                        marginBottom: '12px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <span className="material-icons" style={{ marginRight: '8px', fontSize: '20px' }}>palette</span>
                        CSS
                      </h4>
                      <div style={{
                        backgroundColor: '#1e1e1e',
                        borderRadius: '8px',
                        padding: '16px',
                        maxHeight: '200px',
                        overflowY: 'auto',
                        border: '1px solid var(--md-sys-color-outline-variant)'
                      }}>
                        <pre style={{ 
                          margin: '0',
                          fontSize: '12px',
                          color: '#ce9178',
                          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                          lineHeight: '1.4',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word'
                        }}>
                          {generatedComponent.css}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 组件描述 */}
              {generatedComponent.description && (
                <div style={{ 
                  border: '1px solid var(--md-sys-color-outline)',
                  borderRadius: '16px',
                  backgroundColor: 'var(--md-sys-color-surface)',
                  marginTop: '16px'
                }}>
                  <div style={{ padding: '16px' }}>
                    <h4 className="md-typescale-title-small" style={{ 
                      color: 'var(--md-sys-color-on-surface)', 
                      marginBottom: '8px',
                      fontWeight: '500'
                    }}>
                      Description
                    </h4>
                    <p className="md-typescale-body-medium" style={{ 
                      color: 'var(--md-sys-color-on-surface-variant)', 
                      margin: '0' 
                    }}>
                      {generatedComponent.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 提示信息 */}
        <div style={{ 
          border: '1px solid var(--md-sys-color-outline)',
          borderRadius: '16px',
          backgroundColor: 'var(--md-sys-color-surface)'
        }}>
          <div style={{ padding: '24px' }}>
            <h3 className="md-typescale-title-large" style={{ 
              color: 'var(--md-sys-color-on-surface)', 
              marginBottom: '16px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span className="material-icons" style={{ marginRight: '8px' }}>lightbulb</span>
              Tips for Better Results
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '16px' 
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <span className="material-icons" style={{ 
                  color: 'var(--md-sys-color-primary)', 
                  marginRight: '12px', 
                  marginTop: '2px',
                  fontSize: '20px'
                }}>
                  check_circle
                </span>
                <p className="md-typescale-body-medium" style={{ 
                  color: 'var(--md-sys-color-on-surface-variant)', 
                  margin: '0' 
                }}>
                  Be specific about the component's appearance and behavior
                </p>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <span className="material-icons" style={{ 
                  color: 'var(--md-sys-color-primary)', 
                  marginRight: '12px', 
                  marginTop: '2px',
                  fontSize: '20px'
                }}>
                  animation
                </span>
                <p className="md-typescale-body-medium" style={{ 
                  color: 'var(--md-sys-color-on-surface-variant)', 
                  margin: '0' 
                }}>
                  Mention any specific interactions or animations
                </p>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <span className="material-icons" style={{ 
                  color: 'var(--md-sys-color-primary)', 
                  marginRight: '12px', 
                  marginTop: '2px',
                  fontSize: '20px'
                }}>
                  devices
                </span>
                <p className="md-typescale-body-medium" style={{ 
                  color: 'var(--md-sys-color-on-surface-variant)', 
                  margin: '0' 
                }}>
                  Include details about responsive behavior if needed
                </p>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <span className="material-icons" style={{ 
                  color: 'var(--md-sys-color-primary)', 
                  marginRight: '12px', 
                  marginTop: '2px',
                  fontSize: '20px'
                }}>
                  architecture
                </span>
                <p className="md-typescale-body-medium" style={{ 
                  color: 'var(--md-sys-color-on-surface-variant)', 
                  margin: '0' 
                }}>
                  Reference existing components or design patterns
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Generator; 
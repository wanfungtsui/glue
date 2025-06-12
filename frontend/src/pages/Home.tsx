import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import Header from '../components/Header';

interface UploadedFile {
  file: File;
  type: 'html' | 'css';
  content: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [htmlFile, setHtmlFile] = useState<UploadedFile | null>(null);
  const [cssFile, setCssFile] = useState<UploadedFile | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    navigate('/analysis');
  };

  // 读取文件内容
  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  // HTML文件上传处理
  const onHtmlDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      const content = await readFileContent(file);
      setHtmlFile({
        file,
        type: 'html',
        content
      });
      setError(null);
    } catch (err) {
      setError('Failed to read HTML file');
    }
  }, []);

  // CSS文件上传处理
  const onCssDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      const content = await readFileContent(file);
      setCssFile({
        file,
        type: 'css',
        content
      });
      setError(null);
    } catch (err) {
      setError('Failed to read CSS file');
    }
  }, []);

  // HTML拖拽区域配置
  const {
    getRootProps: getHtmlRootProps,
    getInputProps: getHtmlInputProps,
    isDragActive: isHtmlDragActive
  } = useDropzone({
    onDrop: onHtmlDrop,
    accept: {
      'text/html': ['.html', '.htm']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  // CSS拖拽区域配置
  const {
    getRootProps: getCssRootProps,
    getInputProps: getCssInputProps,
    isDragActive: isCssDragActive
  } = useDropzone({
    onDrop: onCssDrop,
    accept: {
      'text/css': ['.css', '.scss', '.less']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  // 开始AI分析
  const handleAnalyze = async () => {
    if (!htmlFile || !cssFile) {
      setError('Please upload both HTML and CSS files');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/analyze-files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html: htmlFile.content,
          css: cssFile.content
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const analysisData = await response.json();
      
      // 保存分析结果到localStorage
      localStorage.setItem('analysisData', JSON.stringify(analysisData));
      
      // 导航到结果页面
      navigate('/analysis');
    } catch (err) {
      setError('Failed to analyze files. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 移除文件
  const removeFile = (type: 'html' | 'css') => {
    if (type === 'html') {
      setHtmlFile(null);
    } else {
      setCssFile(null);
    }
    setError(null);
  };

  return (
    <>
      <Header 
        showBackButton={false} 
        nextButtonText="Start Analysis" 
        onNextClick={handleAnalyze}
        isNextButtonEnabled={htmlFile !== null && cssFile !== null}
      />
      
      <main style={{ padding: '24px 16px', paddingTop: '96px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Hero Section */}
        <div className="md-elevation-2" style={{ 
          background: 'var(--md-sys-color-surface)', 
          borderRadius: '24px', 
          padding: '48px 32px',
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          <h1 className="md-typescale-display-medium" style={{ 
            color: 'var(--md-sys-color-on-surface)', 
            marginBottom: '16px',
            fontWeight: '400'
          }}>
            Welcome!
          </h1>
          <p className="md-typescale-body-large" style={{ 
            color: 'var(--md-sys-color-on-surface-variant)', 
            marginBottom: '0',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
I’m Glue.
Yes, I do AI. No, I won’t design for you. <br/>I’m not Figma, and I don’t pretend to be.<br/>
I take your design system and turn it into flawless components. <br/>
Precisely. Silently. Efficiently.          </p>
        </div>

        {/* File Upload Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '24px', 
          marginBottom: '32px' 
        }}>
          {/* HTML File Upload Card */}
          <div className="md-elevation-1" style={{ 
            background: 'var(--md-sys-color-surface-container-high)', 
            borderRadius: '16px',
            height: 'fit-content'
          }}>
            <div style={{ padding: '24px' }}>
              <h3 className="md-typescale-headline-small" style={{ 
                color: 'var(--md-sys-color-on-surface)', 
                marginBottom: '16px',
                fontWeight: '500'
              }}>
                HTML File
              </h3>
              
              {!htmlFile ? (
                <div
                  {...getHtmlRootProps()}
                  style={{
                    border: `2px dashed ${isHtmlDragActive ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline)'}`,
                    borderRadius: '16px',
                    padding: '32px 16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: isHtmlDragActive ? 'var(--md-sys-color-primary-container)' : 'transparent',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <input {...getHtmlInputProps()} />
                  <span className="material-icons" style={{ 
                    fontSize: '48px', 
                    color: 'var(--md-sys-color-on-surface-variant)', 
                    marginBottom: '16px',
                    display: 'block'
                  }}>
                    description
                  </span>
                  <p className="md-typescale-body-medium" style={{ 
                    color: 'var(--md-sys-color-on-surface)', 
                    marginBottom: '8px' 
                  }}>
                    {isHtmlDragActive ? 'Drop HTML file here' : 'Drag & drop HTML file here'}
                  </p>
                  <p className="md-typescale-body-small" style={{ 
                    color: 'var(--md-sys-color-on-surface-variant)', 
                    marginBottom: '8px' 
                  }}>
                    or click to select file
                  </p>
                  <p className="md-typescale-label-small" style={{ 
                    color: 'var(--md-sys-color-on-surface-variant)' 
                  }}>
                    Supports: .html, .htm (Max 5MB)
                  </p>
                </div>
              ) : (
                <div className="md-elevation-1" style={{ 
                  backgroundColor: 'var(--md-sys-color-surface-variant)',
                  borderRadius: '12px'
                }}>
                  <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span className="material-icons" style={{ 
                        fontSize: '32px', 
                        color: 'var(--md-sys-color-on-surface-variant)', 
                        marginRight: '12px' 
                      }}>
                        description
                      </span>
                      <div>
                        <p className="md-typescale-body-medium" style={{ 
                          color: 'var(--md-sys-color-on-surface)', 
                          margin: '0 0 4px 0',
                          fontWeight: '500' 
                        }}>
                          {htmlFile.file.name}
                        </p>
                        <p className="md-typescale-body-small" style={{ 
                          color: 'var(--md-sys-color-on-surface-variant)', 
                          margin: '0' 
                        }}>
                          {(htmlFile.file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFile('html')}
                      style={{
                        background: 'none',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'var(--md-sys-color-on-surface-variant)',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--md-sys-color-on-surface-variant)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <span className="material-icons">close</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CSS File Upload Card */}
          <div className="md-elevation-1" style={{ 
            background: 'var(--md-sys-color-surface-container-high)', 
            borderRadius: '16px',
            height: 'fit-content'
          }}>
            <div style={{ padding: '24px' }}>
              <h3 className="md-typescale-headline-small" style={{ 
                color: 'var(--md-sys-color-on-surface)', 
                marginBottom: '16px',
                fontWeight: '500'
              }}>
                CSS File
              </h3>
              
              {!cssFile ? (
                <div
                  {...getCssRootProps()}
                  style={{
                    border: `2px dashed ${isCssDragActive ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline)'}`,
                    borderRadius: '16px',
                    padding: '32px 16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: isCssDragActive ? 'var(--md-sys-color-primary-container)' : 'transparent',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <input {...getCssInputProps()} />
                  <span className="material-icons" style={{ 
                    fontSize: '48px', 
                    color: 'var(--md-sys-color-on-surface-variant)', 
                    marginBottom: '16px',
                    display: 'block'
                  }}>
                    css
                  </span>
                  <p className="md-typescale-body-medium" style={{ 
                    color: 'var(--md-sys-color-on-surface)', 
                    marginBottom: '8px' 
                  }}>
                    {isCssDragActive ? 'Drop CSS file here' : 'Drag & drop CSS file here'}
                  </p>
                  <p className="md-typescale-body-small" style={{ 
                    color: 'var(--md-sys-color-on-surface-variant)', 
                    marginBottom: '8px' 
                  }}>
                    or click to select file
                  </p>
                  <p className="md-typescale-label-small" style={{ 
                    color: 'var(--md-sys-color-on-surface-variant)' 
                  }}>
                    Supports: .css, .scss, .less (Max 5MB)
                  </p>
                </div>
              ) : (
                <div className="md-elevation-1" style={{ 
                  backgroundColor: 'var(--md-sys-color-surface-variant)',
                  borderRadius: '12px'
                }}>
                  <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span className="material-icons" style={{ 
                        fontSize: '32px', 
                        color: 'var(--md-sys-color-on-surface-variant)', 
                        marginRight: '12px' 
                      }}>
                        css
                      </span>
                      <div>
                        <p className="md-typescale-body-medium" style={{ 
                          color: 'var(--md-sys-color-on-surface)', 
                          margin: '0 0 4px 0',
                          fontWeight: '500' 
                        }}>
                          {cssFile.file.name}
                        </p>
                        <p className="md-typescale-body-small" style={{ 
                          color: 'var(--md-sys-color-on-surface-variant)', 
                          margin: '0' 
                        }}>
                          {(cssFile.file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFile('css')}
                      style={{
                        background: 'none',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'var(--md-sys-color-on-surface-variant)',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--md-sys-color-on-surface-variant)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <span className="material-icons">close</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
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

        {/* Action Button */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <button 
            onClick={handleAnalyze}
            disabled={!htmlFile || !cssFile || isAnalyzing}
            className="md-elevation-1"
            style={{
              backgroundColor: (!htmlFile || !cssFile || isAnalyzing) ? 'var(--md-sys-color-surface)' : 'var(--md-sys-color-primary)',
              color: (!htmlFile || !cssFile || isAnalyzing) ? 'var(--md-sys-color-on-surface-variant)' : 'var(--md-sys-color-on-primary)',
              border: 'none',
              borderRadius: '28px',
              fontSize: '16px',
              fontWeight: '500',
              padding: '0 32px',
              minWidth: '240px',
              height: '56px',
              cursor: (!htmlFile || !cssFile || isAnalyzing) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              margin: '0 auto'
            }}
            onMouseEnter={(e) => {
              if (!(!htmlFile || !cssFile || isAnalyzing)) {
                e.currentTarget.style.backgroundColor = 'var(--md-sys-color-primary-container)';
              }
            }}
            onMouseLeave={(e) => {
              if (!(!htmlFile || !cssFile || isAnalyzing)) {
                e.currentTarget.style.backgroundColor = 'var(--md-sys-color-primary)';
              }
            }}
          >
            {isAnalyzing ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid transparent',
                  borderTop: '2px solid currentColor',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Analyzing with AI...
              </>
            ) : (
              <>
                <span className="material-icons">psychology</span>
                Start AI Analysis
              </>
            )}
          </button>
          
          {htmlFile && cssFile && !isAnalyzing && (
            <p className="md-typescale-body-small" style={{ 
              color: 'var(--md-sys-color-on-surface-variant)', 
              marginTop: '12px',
              margin: '12px 0 0 0'
            }}>
              Ready to analyze {htmlFile.file.name} and {cssFile.file.name}
            </p>
          )}
        </div>

        {/* How it Works Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '16px' 
        }}>
          <div style={{ 
            border: '1px solid var(--md-sys-color-outline)',
            borderRadius: '16px',
            backgroundColor: 'var(--md-sys-color-surface)'
          }}>
            <div style={{ padding: '24px', textAlign: 'center' }}>
              <span className="material-icons" style={{ 
                fontSize: '48px', 
                color: 'var(--md-sys-color-primary)', 
                marginBottom: '16px',
                display: 'block'
              }}>
                analytics
              </span>
              <h3 className="md-typescale-headline-small" style={{ 
                color: 'var(--md-sys-color-on-surface)', 
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                1. Analyze Your Website
              </h3>
              <p className="md-typescale-body-medium" style={{ 
                color: 'var(--md-sys-color-on-surface-variant)', 
                margin: '0' 
              }}>
                Upload your HTML and CSS files to analyze your existing design system.
              </p>
            </div>
          </div>

          <div style={{ 
            border: '1px solid var(--md-sys-color-outline)',
            borderRadius: '16px',
            backgroundColor: 'var(--md-sys-color-surface)'
          }}>
            <div style={{ padding: '24px', textAlign: 'center' }}>
              <span className="material-icons" style={{ 
                fontSize: '48px', 
                color: 'var(--md-sys-color-primary)', 
                marginBottom: '16px',
                display: 'block'
              }}>
                auto_awesome
              </span>
              <h3 className="md-typescale-headline-small" style={{ 
                color: 'var(--md-sys-color-on-surface)', 
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                2. Generate Components
              </h3>
              <p className="md-typescale-body-medium" style={{ 
                color: 'var(--md-sys-color-on-surface-variant)', 
                margin: '0' 
              }}>
                Create new components that match your design system's style and patterns.
              </p>
            </div>
          </div>

          <div style={{ 
            border: '1px solid var(--md-sys-color-outline)',
            borderRadius: '16px',
            backgroundColor: 'var(--md-sys-color-surface)'
          }}>
            <div style={{ padding: '24px', textAlign: 'center' }}>
              <span className="material-icons" style={{ 
                fontSize: '48px', 
                color: 'var(--md-sys-color-primary)', 
                marginBottom: '16px',
                display: 'block'
              }}>
                code
              </span>
              <h3 className="md-typescale-headline-small" style={{ 
                color: 'var(--md-sys-color-on-surface)', 
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                3. Export Code
              </h3>
              <p className="md-typescale-body-medium" style={{ 
                color: 'var(--md-sys-color-on-surface-variant)', 
                margin: '0' 
              }}>
                Get clean, production-ready code for your new components.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home; 
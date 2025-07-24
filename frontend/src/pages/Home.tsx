import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [figmaUrl, setFigmaUrl] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 验证Figma URL格式
  const validateFigmaUrl = (url: string): boolean => {
    return url.includes('figma.com') && (url.includes('/design/') || url.includes('/file/'));
  };

  // 开始AI分析
  const handleAnalyze = async () => {
    if (!figmaUrl.trim()) {
      setError('Please enter a Figma URL');
      return;
    }

    if (!validateFigmaUrl(figmaUrl)) {
      setError('Please enter a valid Figma URL');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/analyze-figma', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          figmaUrl: figmaUrl.trim()
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
      setError('Failed to analyze Figma file. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <Header 
        showBackButton={false} 
        nextButtonText="Start Analysis" 
        onNextClick={handleAnalyze}
        isNextButtonEnabled={figmaUrl.trim() !== '' && validateFigmaUrl(figmaUrl)}
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
I'm Glue.
Yes, I do AI. No, I won't design for you. <br/>I'm not Figma, and I don't pretend to be.<br/>
I take your design system and turn it into flawless components. <br/>
Precisely. Silently. Efficiently.          </p>
        </div>

        {/* Figma URL Input Section */}
        <div style={{ marginBottom: '32px' }}>
          <div className="md-elevation-1" style={{ 
            background: 'var(--md-sys-color-surface-container-high)', 
            borderRadius: '16px',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <div style={{ padding: '24px' }}>
              <h3 className="md-typescale-headline-small" style={{ 
                color: 'var(--md-sys-color-on-surface)', 
                marginBottom: '16px',
                fontWeight: '500',
                textAlign: 'center'
              }}>
                Figma Design File
              </h3>
              
              <div style={{ 
                border: `2px solid var(--md-sys-color-outline)`,
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center'
              }}>
                <span className="material-icons" style={{ 
                  fontSize: '48px', 
                  color: 'var(--md-sys-color-on-surface-variant)', 
                  marginBottom: '16px',
                  display: 'block'
                }}>
                  link
                </span>
                
                <p className="md-typescale-body-medium" style={{ 
                  color: 'var(--md-sys-color-on-surface)', 
                  marginBottom: '16px' 
                }}>
                  Enter your Figma design file URL
                </p>
                
                <input
                  type="url"
                  value={figmaUrl}
                  onChange={(e) => setFigmaUrl(e.target.value)}
                  placeholder="https://www.figma.com/design/..."
                  style={{
                    width: '100%',
                    padding: '16px',
                    border: `1px solid var(--md-sys-color-outline)`,
                    borderRadius: '8px',
                    fontSize: '16px',
                    backgroundColor: 'var(--md-sys-color-surface)',
                    color: 'var(--md-sys-color-on-surface)',
                    marginBottom: '8px'
                  }}
                />
                
                <p className="md-typescale-body-small" style={{ 
                  color: 'var(--md-sys-color-on-surface-variant)', 
                  marginBottom: '8px' 
                }}>
                  Make sure the Figma file is publicly accessible or shared with view permissions
                </p>
                
                <p className="md-typescale-label-small" style={{ 
                  color: 'var(--md-sys-color-on-surface-variant)' 
                }}>
                  Example: https://www.figma.com/design/ujgHRfNvffCnfB4XlgInYe/Material-3-Design-Kit--Community-
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="md-elevation-1" style={{ 
            backgroundColor: 'var(--md-sys-color-error-container)', 
            border: `1px solid var(--md-sys-color-error)`,
            borderRadius: '12px',
            marginBottom: '24px',
            maxWidth: '800px',
            margin: '0 auto 24px auto'
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
            disabled={!figmaUrl.trim() || !validateFigmaUrl(figmaUrl) || isAnalyzing}
            className="md-elevation-1"
            style={{
              backgroundColor: (!figmaUrl.trim() || !validateFigmaUrl(figmaUrl) || isAnalyzing) ? 'var(--md-sys-color-surface)' : 'var(--md-sys-color-primary)',
              color: (!figmaUrl.trim() || !validateFigmaUrl(figmaUrl) || isAnalyzing) ? 'var(--md-sys-color-on-surface-variant)' : 'var(--md-sys-color-on-primary)',
              border: 'none',
              borderRadius: '28px',
              fontSize: '16px',
              fontWeight: '500',
              padding: '0 32px',
              minWidth: '240px',
              height: '56px',
              cursor: (!figmaUrl.trim() || !validateFigmaUrl(figmaUrl) || isAnalyzing) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              margin: '0 auto'
            }}
            onMouseEnter={(e) => {
              if (!((!figmaUrl.trim() || !validateFigmaUrl(figmaUrl) || isAnalyzing))) {
                e.currentTarget.style.backgroundColor = 'var(--md-sys-color-primary-container)';
              }
            }}
            onMouseLeave={(e) => {
              if (!((!figmaUrl.trim() || !validateFigmaUrl(figmaUrl) || isAnalyzing))) {
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
                Analyzing Figma File...
              </>
            ) : (
              <>
                <span className="material-icons">psychology</span>
                Start AI Analysis
              </>
            )}
          </button>
          
          {figmaUrl.trim() && validateFigmaUrl(figmaUrl) && !isAnalyzing && (
            <p className="md-typescale-body-small" style={{ 
              color: 'var(--md-sys-color-on-surface-variant)', 
              marginTop: '12px',
              margin: '12px 0 0 0'
            }}>
              Ready to analyze your Figma design system
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
                1. Analyze Your Figma Design
              </h3>
              <p className="md-typescale-body-medium" style={{ 
                color: 'var(--md-sys-color-on-surface-variant)', 
                margin: '0' 
              }}>
                Connect your Figma design file to analyze your design system components and tokens.
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
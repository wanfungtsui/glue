import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

// 颜色分类接口
interface ColorCategory {
  primary: string[];      // 主要颜色
  secondary: string[];    // 次要颜色  
  background: string[];   // 背景颜色
  text: string[];        // 文本颜色
  accent: string[];      // 强调颜色
  error: string[];       // 错误/警告颜色
}

// 更新后的分析数据接口
interface AnalysisData {
  colors: ColorCategory;           // 按类别分类的颜色
  gradients: string[];            // 去重后的渐变
  typography: {
    fonts: string[];              // 按优先级排序的字体
    sizes: string[];              // 从大到小排列的字号
    weights?: number[];           // 字重（Figma数据）
    letterSpacings?: string[];    // 字符间距（Figma数据）
    lineHeights?: string[];       // 行高（Figma数据）
  };
  spacing: string[];              // 间距值（去重并排序）
  padding: string[];              // 内边距值（去重并排序）
  borderRadius?: string[];        // 圆角值（Figma数据）
  shadows?: string[];             // 阴影效果（Figma数据）
  components?: number;            // 组件数量（Figma数据）
  styles?: number;                // 样式数量（Figma数据）
  fileName?: string;              // 文件名（Figma数据）
  lastModified?: string;          // 最后修改时间（Figma数据）
}

// 检查是否为渐变
const isGradient = (color: string): boolean => {
  return color.includes('gradient') || color.includes('linear') || color.includes('radial');
};

/**
 * 颜色预览组件
 * 用于展示单个颜色的预览效果
 */
const ColorPreview: React.FC<{ color: string; index: number; category: string }> = ({ 
  color, 
  index, 
  category 
}) => {
  const gradient = isGradient(color);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div style={{ position: 'relative' }}>
        {/* 圆形颜色展示 */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          border: '2px solid var(--md-sys-color-outline)',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          background: gradient ? color : 'white'
        }}>
          {!gradient && (
            <div 
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: color
              }}
            />
          )}
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <p className="md-typescale-label-small" style={{ 
          color: 'var(--md-sys-color-on-surface)', 
          margin: '0 0 4px 0',
          maxWidth: '80px',
          wordBreak: 'break-all',
          fontWeight: '500'
        }}>
          {color.length > 12 ? color.substring(0, 12) + '...' : color}
        </p>
        <p className="md-typescale-label-small" style={{ 
          color: 'var(--md-sys-color-on-surface-variant)', 
          margin: '0' 
        }}>
          {category} {index + 1}
        </p>
      </div>
    </div>
  );
};

/**
 * 渐变预览组件
 * 专门用于展示渐变效果
 */
const GradientPreview: React.FC<{ gradient: string; index: number }> = ({ gradient, index }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div style={{
        width: '80px',
        height: '64px',
        borderRadius: '16px',
        border: '2px solid var(--md-sys-color-outline)',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        background: gradient
      }} />
      <div style={{ textAlign: 'center' }}>
        <p className="md-typescale-label-small" style={{ 
          color: 'var(--md-sys-color-on-surface)', 
          margin: '0 0 4px 0',
          maxWidth: '96px',
          wordBreak: 'break-all',
          fontWeight: '500'
        }}>
          {gradient.length > 20 ? gradient.substring(0, 20) + '...' : gradient}
        </p>
        <p className="md-typescale-label-small" style={{ 
          color: 'var(--md-sys-color-on-surface-variant)', 
          margin: '0' 
        }}>
          Gradient {index + 1}
        </p>
      </div>
    </div>
  );
};

/**
 * 字体预览组件
 * 展示字体样式和示例文本
 */
const FontPreview: React.FC<{ font: string; index: number }> = ({ font, index }) => {
  return (
    <div className="md-elevation-1" style={{ 
      backgroundColor: 'var(--md-sys-color-surface-variant)',
      borderRadius: '12px'
    }}>
      <div style={{ padding: '16px' }}>
        <p className="md-typescale-body-small" style={{ 
          color: 'var(--md-sys-color-on-surface-variant)', 
          margin: '0 0 8px 0' 
        }}>
          {font}
        </p>
        <p style={{ 
          fontFamily: font, 
          fontSize: '20px',
          color: 'var(--md-sys-color-on-surface)', 
          margin: '0 0 8px 0'
        }}>
          Acting as the glue that holds things together
        </p>
        <p className="md-typescale-label-small" style={{ 
          color: 'var(--md-sys-color-on-surface-variant)', 
          margin: '0' 
        }}>
          Priority: {index + 1}
        </p>
      </div>
    </div>
  );
};

/**
 * 字号预览组件
 * 展示不同字号的效果对比
 */
const FontSizePreview: React.FC<{ size: string; index: number }> = ({ size, index }) => {
  return (
    <div className="md-elevation-1" style={{ 
      backgroundColor: 'var(--md-sys-color-surface-variant)',
      borderRadius: '12px'
    }}>
      <div style={{ padding: '16px' }}>
        <p className="md-typescale-body-small" style={{ 
          color: 'var(--md-sys-color-on-surface-variant)', 
          margin: '0 0 8px 0' 
        }}>
          {size}
        </p>
        <p style={{ 
          fontSize: size, 
          color: 'var(--md-sys-color-on-surface)', 
          margin: '0 0 8px 0' 
        }}>
          Sample Text
        </p>
        <p className="md-typescale-label-small" style={{ 
          color: 'var(--md-sys-color-on-surface-variant)', 
          margin: '0' 
        }}>
          Size: {index + 1} (Large to Small)
        </p>
      </div>
    </div>
  );
};

/**
 * 间距/内边距预览组件  
 * 使用可视化方式展示间距大小
 */
const SpacingPreview: React.FC<{ value: string; index: number; type: 'spacing' | 'padding' }> = ({ 
  value, 
  index, 
  type 
}) => {
  // 从值中提取数字用于可视化
  const numericValue = parseFloat(value.replace(/[^\d.]/g, ''));
  const maxWidth = Math.min(numericValue * 2, 120); // 限制最大宽度
  
  return (
    <div className="md-elevation-1" style={{ 
      backgroundColor: 'var(--md-sys-color-surface-variant)',
      borderRadius: '12px'
    }}>
      <div style={{ padding: '12px', textAlign: 'center' }}>
        <p className="md-typescale-title-medium" style={{ 
          color: 'var(--md-sys-color-on-surface)', 
          margin: '0 0 8px 0',
          fontFamily: 'monospace',
          fontWeight: '500'
        }}>
          {value}
        </p>
        {/* 可视化间距条 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
          <div style={{
            height: '8px',
            backgroundColor: 'var(--md-sys-color-primary)',
            borderRadius: '4px',
            width: `${maxWidth}px`
          }} />
        </div>
        <p className="md-typescale-label-small" style={{ 
          color: 'var(--md-sys-color-on-surface-variant)', 
          margin: '0' 
        }}>
          {type === 'spacing' ? 'Spacing' : 'Padding'} {index + 1}
        </p>
      </div>
    </div>
  );
};

/**
 * 主分析页面组件
 */
const Analysis: React.FC = () => {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 从 localStorage 加载分析数据
  useEffect(() => {
    const storedData = localStorage.getItem('analysisData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        console.log('加载分析数据:', parsedData);
        setData(parsedData);
      } catch (error) {
        console.error('解析分析数据失败:', error);
      }
    }
    setLoading(false);
  }, []);

  // 计算颜色总数
  const getTotalColors = (colors: ColorCategory): number => {
    return Object.values(colors).reduce((total, colorArray) => total + colorArray.length, 0);
  };

  // 获取所有颜色分类的条目
  const getColorEntries = (colors: ColorCategory) => {
    return Object.entries(colors).filter(([_, colorArray]) => colorArray.length > 0);
  };

  // 加载状态
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--md-sys-color-surface)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid var(--md-sys-color-outline)',
            borderTop: '4px solid var(--md-sys-color-primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '16px',
            margin: '0 auto 16px auto'
          }}></div>
          <p className="md-typescale-body-large" style={{ color: 'var(--md-sys-color-on-surface)' }}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // 无数据状态
  if (!data) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--md-sys-color-surface)'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px', padding: '24px' }}>
          <span className="material-icons" style={{ 
            fontSize: '64px', 
            color: 'var(--md-sys-color-error)', 
            marginBottom: '16px', 
            display: 'block' 
          }}>
            error_outline
          </span>
          <h2 className="md-typescale-headline-medium" style={{ 
            color: 'var(--md-sys-color-on-surface)', 
            marginBottom: '8px' 
          }}>
            未找到分析数据
          </h2>
          <p className="md-typescale-body-medium" style={{ 
            color: 'var(--md-sys-color-on-surface-variant)', 
            marginBottom: '24px' 
          }}>
            请先进行网站分析
          </p>
          <button 
            onClick={() => navigate('/')}
            style={{
              backgroundColor: 'var(--md-sys-color-primary)',
              color: 'var(--md-sys-color-on-primary)',
              border: 'none',
              borderRadius: '20px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              margin: '0 auto',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--md-sys-color-primary-container)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--md-sys-color-primary)'}
          >
            <span className="material-icons">refresh</span>
            开始新的分析
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header nextButtonText="Continue to Generator" onNextClick={() => navigate('/generator')} />
      <main style={{ padding: '24px 16px', paddingTop: '96px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* 页面标题 */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="md-typescale-display-small" style={{ 
            color: 'var(--md-sys-color-on-surface)', 
            marginBottom: '8px',
            fontWeight: '400'
          }}>
            Yeah, I’ve read every pixel.
          </h1>
          <p className="md-typescale-body-large" style={{ 
            color: 'var(--md-sys-color-on-surface-variant)' 
          }}>
            I know you’re not going to read all this. <br/>
            Skip to the next step — I expected no less.
          </p>
        </div>

        {/* 1. 颜色分类展示 */}
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
              Colors ({getTotalColors(data.colors)})
            </h2>
            
            {getColorEntries(data.colors).map(([category, colors]: [string, string[]]) => (
              <div key={category} style={{ marginBottom: '24px' }}>
                <h3 className="md-typescale-title-medium" style={{ 
                  color: 'var(--md-sys-color-on-surface)', 
                  marginBottom: '16px',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {category === 'primary' ? 'Primary Colors' :
                   category === 'secondary' ? 'Secondary Colors' :
                   category === 'background' ? 'Background Colors' :
                   category === 'text' ? 'Text Colors' :
                   category === 'accent' ? 'Accent Colors' :
                   category === 'error' ? 'Error/Warning Colors' : 
                   category} ({colors.length})
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
                  gap: '16px' 
                }}>
                  {colors.map((color: string, index: number) => (
                    <ColorPreview 
                      key={`${category}-${index}`} 
                      color={color} 
                      index={index} 
                      category={category}
                    />
                  ))}
                </div>
              </div>
            ))}
            
            {getTotalColors(data.colors) === 0 && (
              <div style={{ textAlign: 'center', padding: '32px' }}>
                <span className="material-icons" style={{ 
                  fontSize: '48px', 
                  color: 'var(--md-sys-color-on-surface-variant)', 
                  marginBottom: '8px', 
                  display: 'block' 
                }}>
                  palette
                </span>
                <p className="md-typescale-body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                  未检测到颜色信息
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 2. 渐变展示 */}
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
              Gradients ({data.gradients.length})
            </h2>
            
            {data.gradients.length > 0 ? (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
                gap: '16px' 
              }}>
                {data.gradients.map((gradient, index) => (
                  <GradientPreview key={index} gradient={gradient} index={index} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px' }}>
                <span className="material-icons" style={{ 
                  fontSize: '48px', 
                  color: 'var(--md-sys-color-on-surface-variant)', 
                  marginBottom: '8px', 
                  display: 'block' 
                }}>
                  gradient
                </span>
                <p className="md-typescale-body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                  未检测到渐变效果
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 3. 字体展示 */}
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
              Typography
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', 
              gap: '24px' 
            }}>
              {/* 字体列表 */}
              <div>
                <h3 className="md-typescale-title-medium" style={{ 
                  color: 'var(--md-sys-color-on-surface)', 
                  marginBottom: '16px',
                  fontWeight: '500'
                }}>
                  Fonts ({data.typography.fonts.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {data.typography.fonts.length > 0 ? (
                    data.typography.fonts.map((font, index) => (
                      <FontPreview key={index} font={font} index={index} />
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '32px' }}>
                      <p className="md-typescale-body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                        未检测到字体信息
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* 字号列表 */}
              <div>
                <h3 className="md-typescale-title-medium" style={{ 
                  color: 'var(--md-sys-color-on-surface)', 
                  marginBottom: '16px',
                  fontWeight: '500'
                }}>
                  Font Sizes ({data.typography.sizes.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {data.typography.sizes.length > 0 ? (
                    data.typography.sizes.map((size, index) => (
                      <FontSizePreview key={index} size={size} index={index} />
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '32px' }}>
                      <p className="md-typescale-body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                        未检测到字号信息
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 字重列表 (Figma数据) */}
              {data.typography.weights && data.typography.weights.length > 0 && (
                <div>
                  <h3 className="md-typescale-title-medium" style={{ 
                    color: 'var(--md-sys-color-on-surface)', 
                    marginBottom: '16px',
                    fontWeight: '500'
                  }}>
                    Font Weights ({data.typography.weights.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {data.typography.weights.map((weight, index) => (
                      <div key={index} style={{ 
                        padding: '12px',
                        background: 'var(--md-sys-color-surface-variant)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <span style={{ 
                          fontWeight: weight,
                          fontSize: '16px',
                          color: 'var(--md-sys-color-on-surface)'
                        }}>
                          Aa
                        </span>
                        <span className="md-typescale-body-medium" style={{ 
                          color: 'var(--md-sys-color-on-surface)',
                          fontWeight: '500'
                        }}>
                          {weight}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 字符间距列表 (Figma数据) */}
              {data.typography.letterSpacings && data.typography.letterSpacings.length > 0 && (
                <div>
                  <h3 className="md-typescale-title-medium" style={{ 
                    color: 'var(--md-sys-color-on-surface)', 
                    marginBottom: '16px',
                    fontWeight: '500'
                  }}>
                    Letter Spacing ({data.typography.letterSpacings.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {data.typography.letterSpacings.map((spacing, index) => (
                      <div key={index} style={{ 
                        padding: '12px',
                        background: 'var(--md-sys-color-surface-variant)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <span style={{ 
                          letterSpacing: spacing,
                          fontSize: '16px',
                          color: 'var(--md-sys-color-on-surface)'
                        }}>
                          SAMPLE
                        </span>
                        <span className="md-typescale-body-medium" style={{ 
                          color: 'var(--md-sys-color-on-surface)',
                          fontWeight: '500'
                        }}>
                          {spacing}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 行高列表 (Figma数据) */}
              {data.typography.lineHeights && data.typography.lineHeights.length > 0 && (
                <div>
                  <h3 className="md-typescale-title-medium" style={{ 
                    color: 'var(--md-sys-color-on-surface)', 
                    marginBottom: '16px',
                    fontWeight: '500'
                  }}>
                    Line Heights ({data.typography.lineHeights.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {data.typography.lineHeights.map((lineHeight, index) => (
                      <div key={index} style={{ 
                        padding: '12px',
                        background: 'var(--md-sys-color-surface-variant)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <span style={{ 
                          lineHeight: lineHeight,
                          fontSize: '14px',
                          color: 'var(--md-sys-color-on-surface)',
                          width: '60px'
                        }}>
                          Sample text with line height
                        </span>
                        <span className="md-typescale-body-medium" style={{ 
                          color: 'var(--md-sys-color-on-surface)',
                          fontWeight: '500'
                        }}>
                          {lineHeight}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4. 间距展示 */}
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
              Spacing & Padding
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
              gap: '24px' 
            }}>
              {/* 间距值 */}
              <div>
                <h3 className="md-typescale-title-medium" style={{ 
                  color: 'var(--md-sys-color-on-surface)', 
                  marginBottom: '16px',
                  fontWeight: '500'
                }}>
                  Spacing ({data.spacing.length})
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
                  gap: '12px' 
                }}>
                  {data.spacing.length > 0 ? (
                    data.spacing.map((space, index) => (
                      <SpacingPreview key={index} value={space} index={index} type="spacing" />
                    ))
                  ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '32px' }}>
                      <p className="md-typescale-body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                        No spacing info found.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 内边距值 */}
              <div>
                <h3 className="md-typescale-title-medium" style={{ 
                  color: 'var(--md-sys-color-on-surface)', 
                  marginBottom: '16px',
                  fontWeight: '500'
                }}>
                  Padding ({data.padding.length})
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
                  gap: '12px' 
                }}>
                  {data.padding.length > 0 ? (
                    data.padding.map((pad, index) => (
                      <SpacingPreview key={index} value={pad} index={index} type="padding" />
                    ))
                  ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '32px' }}>
                      <p className="md-typescale-body-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                        No padding info found.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. 边框圆角和阴影展示 (Figma数据) */}
        {((data.borderRadius && data.borderRadius.length > 0) || (data.shadows && data.shadows.length > 0)) && (
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
                Visual Effects
              </h2>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
                gap: '24px' 
              }}>
                {/* 边框圆角 */}
                {data.borderRadius && data.borderRadius.length > 0 && (
                  <div>
                    <h3 className="md-typescale-title-medium" style={{ 
                      color: 'var(--md-sys-color-on-surface)', 
                      marginBottom: '16px',
                      fontWeight: '500'
                    }}>
                      Border Radius ({data.borderRadius.length})
                    </h3>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
                      gap: '12px' 
                    }}>
                      {data.borderRadius.map((radius, index) => (
                        <div key={index} style={{ 
                          padding: '16px',
                          background: 'var(--md-sys-color-surface-variant)',
                          borderRadius: radius,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '8px',
                          border: '1px solid var(--md-sys-color-outline)'
                        }}>
                          <div style={{ 
                            width: '40px',
                            height: '40px',
                            background: 'var(--md-sys-color-primary)',
                            borderRadius: radius
                          }} />
                          <span className="md-typescale-body-small" style={{ 
                            color: 'var(--md-sys-color-on-surface)',
                            fontWeight: '500',
                            textAlign: 'center'
                          }}>
                            {radius}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 阴影效果 */}
                {data.shadows && data.shadows.length > 0 && (
                  <div>
                    <h3 className="md-typescale-title-medium" style={{ 
                      color: 'var(--md-sys-color-on-surface)', 
                      marginBottom: '16px',
                      fontWeight: '500'
                    }}>
                      Shadows ({data.shadows.length})
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {data.shadows.map((shadow, index) => (
                        <div key={index} style={{ 
                          padding: '16px',
                          background: 'var(--md-sys-color-surface-variant)',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px'
                        }}>
                          <div style={{ 
                            width: '60px',
                            height: '60px',
                            background: 'var(--md-sys-color-surface)',
                            borderRadius: '8px',
                            boxShadow: shadow,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <span style={{ 
                              color: 'var(--md-sys-color-on-surface)',
                              fontSize: '12px'
                            }}>
                              Box
                            </span>
                          </div>
                          <span className="md-typescale-body-small" style={{ 
                            color: 'var(--md-sys-color-on-surface)',
                            fontWeight: '500',
                            fontSize: '11px',
                            wordBreak: 'break-all'
                          }}>
                            {shadow}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 6. Figma信息展示 */}
        {(data.fileName || data.components !== undefined || data.styles !== undefined) && (
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
                Figma File Information
              </h2>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '16px' 
              }}>
                {data.fileName && (
                  <div style={{ 
                    padding: '16px',
                    background: 'var(--md-sys-color-surface-variant)',
                    borderRadius: '8px'
                  }}>
                    <p className="md-typescale-body-small" style={{ 
                      color: 'var(--md-sys-color-on-surface-variant)',
                      margin: '0 0 4px 0'
                    }}>
                      File Name
                    </p>
                    <p className="md-typescale-body-medium" style={{ 
                      color: 'var(--md-sys-color-on-surface)',
                      margin: '0',
                      fontWeight: '500'
                    }}>
                      {data.fileName}
                    </p>
                  </div>
                )}

                {data.components !== undefined && (
                  <div style={{ 
                    padding: '16px',
                    background: 'var(--md-sys-color-surface-variant)',
                    borderRadius: '8px'
                  }}>
                    <p className="md-typescale-body-small" style={{ 
                      color: 'var(--md-sys-color-on-surface-variant)',
                      margin: '0 0 4px 0'
                    }}>
                      Components
                    </p>
                    <p className="md-typescale-body-medium" style={{ 
                      color: 'var(--md-sys-color-on-surface)',
                      margin: '0',
                      fontWeight: '500'
                    }}>
                      {data.components}
                    </p>
                  </div>
                )}

                {data.styles !== undefined && (
                  <div style={{ 
                    padding: '16px',
                    background: 'var(--md-sys-color-surface-variant)',
                    borderRadius: '8px'
                  }}>
                    <p className="md-typescale-body-small" style={{ 
                      color: 'var(--md-sys-color-on-surface-variant)',
                      margin: '0 0 4px 0'
                    }}>
                      Styles
                    </p>
                    <p className="md-typescale-body-medium" style={{ 
                      color: 'var(--md-sys-color-on-surface)',
                      margin: '0',
                      fontWeight: '500'
                    }}>
                      {data.styles}
                    </p>
                  </div>
                )}

                {data.lastModified && (
                  <div style={{ 
                    padding: '16px',
                    background: 'var(--md-sys-color-surface-variant)',
                    borderRadius: '8px'
                  }}>
                    <p className="md-typescale-body-small" style={{ 
                      color: 'var(--md-sys-color-on-surface-variant)',
                      margin: '0 0 4px 0'
                    }}>
                      Last Modified
                    </p>
                    <p className="md-typescale-body-medium" style={{ 
                      color: 'var(--md-sys-color-on-surface)',
                      margin: '0',
                      fontWeight: '500'
                    }}>
                      {new Date(data.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 统计摘要 */}
        <div style={{ 
          border: '1px solid var(--md-sys-color-outline)',
          borderRadius: '16px',
          backgroundColor: 'var(--md-sys-color-surface)'
        }}>
          <div style={{ padding: '24px' }}>
            <h2 className="md-typescale-headline-medium" style={{ 
              color: 'var(--md-sys-color-on-surface)', 
              marginBottom: '16px',
              fontWeight: '500'
            }}>
              Analysis Summary
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
              gap: '16px' 
            }}>
              <div className="md-elevation-1" style={{ 
                backgroundColor: 'var(--md-sys-color-primary-container)',
                borderRadius: '12px'
              }}>
                <div style={{ padding: '16px', textAlign: 'center' }}>
                  <p className="md-typescale-display-small" style={{ 
                    color: 'var(--md-sys-color-on-primary-container)', 
                    margin: '0 0 4px 0',
                    fontWeight: '600'
                  }}>
                    {getTotalColors(data.colors)}
                  </p>
                  <p className="md-typescale-body-small" style={{ 
                    color: 'var(--md-sys-color-on-primary-container)', 
                    margin: '0' 
                  }}>
                    Colors
                  </p>
                </div>
              </div>

              <div className="md-elevation-1" style={{ 
                backgroundColor: 'var(--md-sys-color-secondary-container)',
                borderRadius: '12px'
              }}>
                <div style={{ padding: '16px', textAlign: 'center' }}>
                  <p className="md-typescale-display-small" style={{ 
                    color: 'var(--md-sys-color-on-secondary-container)', 
                    margin: '0 0 4px 0',
                    fontWeight: '600'
                  }}>
                    {data.gradients.length}
                  </p>
                  <p className="md-typescale-body-small" style={{ 
                    color: 'var(--md-sys-color-on-secondary-container)', 
                    margin: '0' 
                  }}>
                    Gradients
                  </p>
                </div>
              </div>

              <div className="md-elevation-1" style={{ 
                backgroundColor: 'var(--md-sys-color-primary-container)',
                borderRadius: '12px'
              }}>
                <div style={{ padding: '16px', textAlign: 'center' }}>
                  <p className="md-typescale-display-small" style={{ 
                    color: 'var(--md-sys-color-on-primary-container)', 
                    margin: '0 0 4px 0',
                    fontWeight: '600'
                  }}>
                    {data.typography.fonts.length}
                  </p>
                  <p className="md-typescale-body-small" style={{ 
                    color: 'var(--md-sys-color-on-primary-container)', 
                    margin: '0' 
                  }}>
                    Fonts
                  </p>
                </div>
              </div>

              <div className="md-elevation-1" style={{ 
                backgroundColor: 'var(--md-sys-color-secondary-container)',
                borderRadius: '12px'
              }}>
                <div style={{ padding: '16px', textAlign: 'center' }}>
                  <p className="md-typescale-display-small" style={{ 
                    color: 'var(--md-sys-color-on-secondary-container)', 
                    margin: '0 0 4px 0',
                    fontWeight: '600'
                  }}>
                    {data.typography.sizes.length}
                  </p>
                  <p className="md-typescale-body-small" style={{ 
                    color: 'var(--md-sys-color-on-secondary-container)', 
                    margin: '0' 
                  }}>
                    Font Sizes
                  </p>
                </div>
              </div>

              <div className="md-elevation-1" style={{ 
                backgroundColor: 'var(--md-sys-color-primary-container)',
                borderRadius: '12px'
              }}>
                <div style={{ padding: '16px', textAlign: 'center' }}>
                  <p className="md-typescale-display-small" style={{ 
                    color: 'var(--md-sys-color-on-primary-container)', 
                    margin: '0 0 4px 0',
                    fontWeight: '600'
                  }}>
                    {data.spacing.length}
                  </p>
                  <p className="md-typescale-body-small" style={{ 
                    color: 'var(--md-sys-color-on-primary-container)', 
                    margin: '0' 
                  }}>
                    Spacing
                  </p>
                </div>
              </div>

              <div className="md-elevation-1" style={{ 
                backgroundColor: 'var(--md-sys-color-secondary-container)',
                borderRadius: '12px'
              }}>
                <div style={{ padding: '16px', textAlign: 'center' }}>
                  <p className="md-typescale-display-small" style={{ 
                    color: 'var(--md-sys-color-on-secondary-container)', 
                    margin: '0 0 4px 0',
                    fontWeight: '600'
                  }}>
                    {data.padding.length}
                  </p>
                  <p className="md-typescale-body-small" style={{ 
                    color: 'var(--md-sys-color-on-secondary-container)', 
                    margin: '0' 
                  }}>
                    Padding
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Analysis; 
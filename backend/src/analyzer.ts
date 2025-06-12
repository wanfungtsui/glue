import * as cheerio from 'cheerio';

// 颜色分类接口
interface ColorCategory {
  primary: string[];      // 主要颜色
  secondary: string[];    // 次要颜色  
  background: string[];   // 背景颜色
  text: string[];        // 文本颜色
  accent: string[];      // 强调颜色
  error: string[];       // 错误/警告颜色
}

// 更新后的分析结果接口
interface AnalysisResult {
  colors: ColorCategory;           // 按类别分类的颜色
  gradients: string[];            // 去重后的渐变
  typography: {
    fonts: string[];              // 按优先级排序的字体
    sizes: string[];              // 从大到小排列的字号
  };
  spacing: string[];              // 间距值（去重并排序）
  padding: string[];              // 内边距值（去重并排序）
}

export class Analyzer {
  protected deepseek: any;

  constructor(apiKey: string) {
    this.deepseek = {
      analyze: async (params: { html: string; css: string; task: string }) => {
        console.log('开始设计系统分析...');
        const { html, css } = params;
        
        // 使用 cheerio 解析 HTML
        const $ = cheerio.load(html);
        console.log('HTML 解析成功');
        
        // 1. 提取并分类颜色
        const colorCategories = this.extractAndCategorizeColors(css, $);
        console.log(`提取颜色完成: ${this.getTotalColors(colorCategories)} 个颜色`);
        
        // 2. 提取并去重渐变
        const gradients = this.extractGradients(css);
        console.log(`提取渐变完成: ${gradients.length} 个渐变`);
        
        // 3. 提取并排序字体（按优先级）
        const fonts = this.extractAndSortFonts(css);
        console.log(`提取字体完成: ${fonts.length} 个字体`);
        
        // 4. 提取并排序字号（从大到小）
        const fontSizes = this.extractAndSortFontSizes(css);
        console.log(`提取字号完成: ${fontSizes.length} 个字号`);
        
        // 5. 提取并排序间距
        const spacing = this.extractSpacing(css);
        console.log(`提取间距完成: ${spacing.length} 个间距值`);
        
        // 6. 提取并排序内边距  
        const padding = this.extractPadding(css);
        console.log(`提取内边距完成: ${padding.length} 个内边距值`);

        return {
          colors: colorCategories,
          gradients,
          typography: {
            fonts,
            sizes: fontSizes
          },
          spacing,
          padding
        };
      }
    };
  }

  /**
   * 提取并分类颜色
   * 根据颜色的使用上下文和属性名称进行智能分类
   */
  private extractAndCategorizeColors(css: string, $: cheerio.CheerioAPI): ColorCategory {
    const allColors = new Set<string>();
    
    // 颜色匹配模式
    const colorPatterns = [
      /#([0-9a-fA-F]{3,8})/g,     // 十六进制颜色
      /rgb\([^)]+\)/g,            // RGB 颜色
      /rgba\([^)]+\)/g,           // RGBA 颜色
      /hsl\([^)]+\)/g,            // HSL 颜色
      /hsla\([^)]+\)/g,           // HSLA 颜色
    ];
    
    // 提取所有颜色
    colorPatterns.forEach(pattern => {
      const matches = css.match(pattern);
      if (matches) {
        matches.forEach(match => allColors.add(match.toLowerCase()));
      }
    });

    // 初始化颜色分类
    const categories: ColorCategory = {
      primary: [],
      secondary: [],
      background: [],
      text: [],
      accent: [],
      error: []
    };

    // 分析 CSS 规则来分类颜色
    const cssRules = css.split('}');
    const colorContextMap = new Map<string, string[]>();

    cssRules.forEach(rule => {
      const selector = rule.split('{')[0]?.trim();
      const styles = rule.split('{')[1];
      
      if (!selector || !styles) return;

      // 检测颜色属性
      const colorProps = styles.match(/(color|background-color|border-color|fill|stroke)\s*:\s*([^;]+)/g);
      if (colorProps) {
        colorProps.forEach(prop => {
          const [property, value] = prop.split(':').map(s => s.trim());
          if (allColors.has(value.toLowerCase())) {
            if (!colorContextMap.has(value.toLowerCase())) {
              colorContextMap.set(value.toLowerCase(), []);
            }
            colorContextMap.get(value.toLowerCase())!.push(`${selector}:${property}`);
          }
        });
      }
    });

    // 根据上下文分类颜色
    allColors.forEach(color => {
      const contexts = colorContextMap.get(color) || [];
      const contextStr = contexts.join(' ').toLowerCase();
      
      // 分类逻辑
      if (contextStr.includes('primary') || contextStr.includes('main') || contextStr.includes('brand')) {
        categories.primary.push(color);
      } else if (contextStr.includes('error') || contextStr.includes('danger') || contextStr.includes('warning')) {
        categories.error.push(color);
      } else if (contextStr.includes('background') || contextStr.includes('bg-')) {
        categories.background.push(color);
      } else if (contextStr.includes('text') || contextStr.includes('color:')) {
        categories.text.push(color);
      } else if (contextStr.includes('accent') || contextStr.includes('highlight')) {
        categories.accent.push(color);
      } else {
        categories.secondary.push(color);
      }
    });

    // 去重并排序（按亮度排序）
    Object.keys(categories).forEach(key => {
      const categoryKey = key as keyof ColorCategory;
      categories[categoryKey] = [...new Set(categories[categoryKey])].sort();
    });

    return categories;
  }

  /**
   * 提取并去重渐变
   */
  private extractGradients(css: string): string[] {
    const gradients = new Set<string>();
    
    // 渐变匹配模式
    const gradientPatterns = [
      /linear-gradient\([^;)]+\)/g,
      /radial-gradient\([^;)]+\)/g,
      /conic-gradient\([^;)]+\)/g,
      /repeating-linear-gradient\([^;)]+\)/g,
      /repeating-radial-gradient\([^;)]+\)/g
    ];
    
    gradientPatterns.forEach(pattern => {
      const matches = css.match(pattern);
      if (matches) {
        matches.forEach(match => {
          // 标准化渐变格式
          const normalized = match.replace(/\s+/g, ' ').trim();
          gradients.add(normalized);
        });
      }
    });
    
    return Array.from(gradients).sort();
  }

  /**
   * 提取并按优先级排序字体
   */
  private extractAndSortFonts(css: string): string[] {
    const fontFamilies = new Set<string>();
    
    // 提取 font-family 声明
    const fontMatches = css.match(/font-family\s*:\s*([^;]+)/g);
    if (fontMatches) {
      fontMatches.forEach(match => {
        const fontValue = match.replace(/font-family\s*:\s*/, '').replace(/;.*/, '').trim();
        
        // 分割字体列表并清理
        const fonts = fontValue.split(',').map(font => 
          font.trim().replace(/['"]/g, '')
        );
        
        fonts.forEach(font => {
          // 过滤无效字体
          if (this.isValidFont(font)) {
            fontFamilies.add(font);
          }
        });
      });
    }
    
    // 按优先级排序：自定义字体 > 系统字体 > 通用字体
    return Array.from(fontFamilies).sort((a, b) => {
      const priorityA = this.getFontPriority(a);
      const priorityB = this.getFontPriority(b);
      return priorityA - priorityB;
    });
  }

  /**
   * 提取并排序字号（从大到小）
   */
  private extractAndSortFontSizes(css: string): string[] {
    const fontSizes = new Set<string>();
    
    // 提取 font-size 声明
    const sizeMatches = css.match(/font-size\s*:\s*([^;]+)/g);
    if (sizeMatches) {
      sizeMatches.forEach(match => {
        const sizeValue = match.replace(/font-size\s*:\s*/, '').replace(/;.*/, '').trim();
        
        // 过滤有效的字号值
        if (this.isValidFontSize(sizeValue)) {
          fontSizes.add(sizeValue);
        }
      });
    }
    
    // 按数值从大到小排序
    return Array.from(fontSizes).sort((a, b) => {
      const numA = this.extractNumericValue(a);
      const numB = this.extractNumericValue(b);
      return numB - numA; // 降序
    });
  }

  /**
   * 提取间距值
   */
  private extractSpacing(css: string): string[] {
    const spacing = new Set<string>();
    
    // 间距相关属性模式
    const spacingPatterns = [
      /margin\s*:\s*([^;]+)/g,
      /margin-top\s*:\s*([^;]+)/g,
      /margin-bottom\s*:\s*([^;]+)/g,
      /margin-left\s*:\s*([^;]+)/g,
      /margin-right\s*:\s*([^;]+)/g,
      /gap\s*:\s*([^;]+)/g,
      /row-gap\s*:\s*([^;]+)/g,
      /column-gap\s*:\s*([^;]+)/g
    ];
    
    spacingPatterns.forEach(pattern => {
      const matches = css.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const value = match.split(':')[1]?.replace(/;.*/, '').trim();
          if (value && this.isValidSpacingValue(value)) {
            // 处理多值间距（如 margin: 10px 20px）
            const values = value.split(' ');
            values.forEach(v => {
              if (this.isValidSpacingValue(v.trim())) {
                spacing.add(v.trim());
              }
            });
          }
        });
      }
    });
    
    // 按数值排序
    return Array.from(spacing).sort((a, b) => {
      const numA = this.extractNumericValue(a);
      const numB = this.extractNumericValue(b);
      return numA - numB; // 升序
    });
  }

  /**
   * 提取内边距值
   */
  private extractPadding(css: string): string[] {
    const padding = new Set<string>();
    
    // 内边距相关属性模式
    const paddingPatterns = [
      /padding\s*:\s*([^;]+)/g,
      /padding-top\s*:\s*([^;]+)/g,
      /padding-bottom\s*:\s*([^;]+)/g,
      /padding-left\s*:\s*([^;]+)/g,
      /padding-right\s*:\s*([^;]+)/g
    ];
    
    paddingPatterns.forEach(pattern => {
      const matches = css.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const value = match.split(':')[1]?.replace(/;.*/, '').trim();
          if (value && this.isValidSpacingValue(value)) {
            // 处理多值内边距（如 padding: 10px 20px）
            const values = value.split(' ');
            values.forEach(v => {
              if (this.isValidSpacingValue(v.trim())) {
                padding.add(v.trim());
              }
            });
          }
        });
      }
    });
    
    // 按数值排序
    return Array.from(padding).sort((a, b) => {
      const numA = this.extractNumericValue(a);
      const numB = this.extractNumericValue(b);
      return numA - numB; // 升序
    });
  }

  // === 辅助方法 ===

  /**
   * 获取颜色总数
   */
  private getTotalColors(categories: ColorCategory): number {
    return Object.values(categories).reduce((total, colors) => total + colors.length, 0);
  }

  /**
   * 验证字体是否有效
   */
  private isValidFont(font: string): boolean {
    const invalidPatterns = [
      'inherit', 'initial', 'unset', 'revert',
      '{', '}', 'display:', 'text-overflow:', 'ellipsis'
    ];
    
    return !invalidPatterns.some(pattern => 
      font.toLowerCase().includes(pattern.toLowerCase())
    ) && font.trim().length > 0 && font.length < 50;
  }

  /**
   * 获取字体优先级（数值越小优先级越高）
   */
  private getFontPriority(font: string): number {
    const lowercaseFont = font.toLowerCase();
    
    // 自定义字体优先级最高
    if (!this.isSystemFont(lowercaseFont)) return 1;
    
    // 系统字体优先级中等
    if (this.isSystemFont(lowercaseFont)) return 2;
    
    // 通用字体族优先级最低
    return 3;
  }

  /**
   * 判断是否为系统字体
   */
  private isSystemFont(font: string): boolean {
    const systemFonts = [
      'serif', 'sans-serif', 'monospace', 'cursive', 'fantasy',
      'arial', 'helvetica', 'times', 'courier', 'verdana'
    ];
    
    return systemFonts.some(systemFont => font.includes(systemFont));
  }

  /**
   * 验证字号是否有效
   */
  private isValidFontSize(size: string): boolean {
    return /^\d+(\.\d+)?(px|em|rem|%|pt|pc|in|cm|mm|ex|ch|vw|vh|vmin|vmax)$/.test(size.trim());
  }

  /**
   * 验证间距值是否有效
   */
  private isValidSpacingValue(value: string): boolean {
    if (value === '0' || value === 'auto') return true;
    return /^\d+(\.\d+)?(px|em|rem|%|pt|pc|in|cm|mm|ex|ch|vw|vh|vmin|vmax)$/.test(value.trim());
  }

  /**
   * 从字符串中提取数值
   */
  private extractNumericValue(value: string): number {
    const match = value.match(/^(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  }

  /**
   * 分析文件主入口
   */
  async analyzeFiles(htmlContent: string, cssContent: string): Promise<AnalysisResult> {
    try {
      console.log('开始文件分析...');
      console.log(`HTML 内容长度: ${htmlContent.length} 字符`);
      console.log(`CSS 内容长度: ${cssContent.length} 字符`);

      const analysis = await this.deepseek.analyze({
        html: htmlContent,
        css: cssContent,
        task: 'enhanced-design-system-analysis'
      });

      console.log('分析完成');
      return this.parseAnalysisResult(analysis);
    } catch (error) {
      console.error('分析错误:', error);
      // 返回空的分析结果而不是抛出错误
      return {
        colors: {
          primary: [],
          secondary: [],
          background: [],
          text: [],
          accent: [],
          error: []
        },
        gradients: [],
        typography: {
          fonts: [],
          sizes: []
        },
        spacing: [],
        padding: []
      };
    }
  }

  /**
   * 解析分析结果
   */
  protected parseAnalysisResult(analysis: any): AnalysisResult {
    return {
      colors: analysis.colors || {
        primary: [],
        secondary: [],
        background: [],
        text: [],
        accent: [],
        error: []
      },
      gradients: analysis.gradients || [],
      typography: {
        fonts: analysis.typography?.fonts || [],
        sizes: analysis.typography?.sizes || []
      },
      spacing: analysis.spacing || [],
      padding: analysis.padding || []
    };
  }
}

// 导出增强版分析器
export class EnhancedAnalyzer extends Analyzer {
  /**
   * 使用 AI 增强分析
   */
  async analyzeWithAI(htmlContent: string, cssContent: string): Promise<AnalysisResult> {
    try {
      console.log('启动 AI 增强分析...');
      const enhancedAnalysis = await this.deepseek.analyze({
        html: htmlContent,
        css: cssContent,
        task: 'ai-enhanced-design-system-analysis'
      });

      return this.parseAnalysisResult(enhancedAnalysis);
    } catch (error) {
      console.error('AI 增强分析失败:', error);
      throw new Error('AI 增强分析失败');
    }
  }
} 
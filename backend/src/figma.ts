import axios from 'axios';

// Figma API响应接口
interface FigmaNode {
  id: string;
  name: string;
  type: string;
  fills?: any[];
  strokes?: any[];
  effects?: any[];
  style?: any;
  children?: FigmaNode[];
  absoluteBoundingBox?: any;
  constraints?: any;
  layoutMode?: string;
  primaryAxisSizingMode?: string;
  counterAxisSizingMode?: string;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  itemSpacing?: number;
  cornerRadius?: number;
  rectangleCornerRadii?: number[];
  backgroundColor?: any;
  layoutWrap?: string;
  layoutAlign?: string;
  layoutGrow?: number;
  opacity?: number;
  blendMode?: string;
  isMask?: boolean;
  exportSettings?: any[];
  layoutGrids?: any[];
  clipsContent?: boolean;
  guides?: any[];
  selection?: any[];
  prototypeStartNodeID?: string;
  flowStartingPoints?: any[];
  prototypeDevice?: any;
  characters?: string;
  characterStyleOverrides?: any[];
  styleOverrideTable?: any;
  lineTypes?: any[];
  lineIndentations?: any[];
  styles?: any;
}

interface FigmaFile {
  name: string;
  role: string;
  lastModified: string;
  editorType: string;
  thumbnailUrl: string;
  version: string;
  document: FigmaNode;
  components: { [key: string]: any };
  componentSets: { [key: string]: any };
  schemaVersion: number;
  styles: { [key: string]: any };
}

// 从Figma URL提取文件ID
export function extractFileIdFromUrl(url: string): string {
  // 支持多种Figma URL格式
  const patterns = [
    /figma\.com\/file\/([a-zA-Z0-9]+)/,  // figma.com/file/[fileId]
    /figma\.com\/design\/([a-zA-Z0-9]+)/, // figma.com/design/[fileId] (旧格式)
    /figma\.com\/proto\/([a-zA-Z0-9]+)/   // figma.com/proto/[fileId]
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  throw new Error('Invalid Figma URL format. Please use a valid Figma file URL (e.g., https://www.figma.com/file/[fileId]/[filename])');
}

// 初始化Figma客户端
export function initializeFigmaClient(token: string) {
  return axios.create({
    baseURL: 'https://api.figma.com/v1',
    headers: {
      'X-Figma-Token': token
    }
  });
}

// 全局Figma客户端
let figmaClient: any = null;

// 获取Figma文件数据
export async function getFigmaFileData(fileId: string, token: string): Promise<FigmaFile> {
  if (!figmaClient) {
    figmaClient = initializeFigmaClient(token);
  }

  try {
    const response = await figmaClient.get(`/files/${fileId}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error('Figma file not found. Please check the URL and make sure the file is publicly accessible.');
    } else if (error.response?.status === 403) {
      throw new Error('Access denied. Please make sure your Figma token has the necessary permissions.');
    } else {
      throw new Error(`Failed to fetch Figma file: ${error.message}`);
    }
  }
}

// 递归遍历节点并提取设计元素
function traverseNode(node: FigmaNode, elements: any) {
  // 提取颜色
  if (node.fills && Array.isArray(node.fills)) {
    node.fills.forEach(fill => {
      if (fill.type === 'SOLID' && fill.color) {
        const color = rgbToHex(fill.color);
        elements.colors.add(color);
      } else if (fill.type === 'GRADIENT_LINEAR' || fill.type === 'GRADIENT_RADIAL') {
        if (fill.gradientStops) {
          fill.gradientStops.forEach((stop: any) => {
            if (stop.color) {
              const color = rgbToHex(stop.color);
              elements.colors.add(color);
            }
          });
        }
      }
    });
  }

  // 提取描边颜色
  if (node.strokes && Array.isArray(node.strokes)) {
    node.strokes.forEach(stroke => {
      if (stroke.type === 'SOLID' && stroke.color) {
        const color = rgbToHex(stroke.color);
        elements.colors.add(color);
      }
    });
  }

  // 提取字体信息
  if (node.type === 'TEXT' && node.style) {
    if (node.style.fontFamily) {
      elements.fonts.add(node.style.fontFamily);
    }
    if (node.style.fontSize) {
      elements.fontSizes.add(`${node.style.fontSize}px`);
    }
    if (node.style.fontWeight) {
      elements.fontWeights.add(node.style.fontWeight);
    }
    if (node.style.letterSpacing) {
      elements.letterSpacings.add(`${node.style.letterSpacing}px`);
    }
    if (node.style.lineHeightPx) {
      elements.lineHeights.add(`${node.style.lineHeightPx}px`);
    }
  }

  // 提取间距信息
  if (node.paddingLeft !== undefined) elements.paddings.add(`${node.paddingLeft}px`);
  if (node.paddingRight !== undefined) elements.paddings.add(`${node.paddingRight}px`);
  if (node.paddingTop !== undefined) elements.paddings.add(`${node.paddingTop}px`);
  if (node.paddingBottom !== undefined) elements.paddings.add(`${node.paddingBottom}px`);
  if (node.itemSpacing !== undefined) elements.spacings.add(`${node.itemSpacing}px`);

  // 提取圆角信息
  if (node.cornerRadius !== undefined) {
    elements.borderRadii.add(`${node.cornerRadius}px`);
  }
  if (node.rectangleCornerRadii) {
    node.rectangleCornerRadii.forEach(radius => {
      elements.borderRadii.add(`${radius}px`);
    });
  }

  // 提取阴影和效果
  if (node.effects && Array.isArray(node.effects)) {
    node.effects.forEach(effect => {
      if (effect.type === 'DROP_SHADOW' || effect.type === 'INNER_SHADOW') {
        const shadow = `${effect.offset?.x || 0}px ${effect.offset?.y || 0}px ${effect.radius || 0}px ${effect.color ? rgbToHex(effect.color) : '#000000'}`;
        elements.shadows.add(shadow);
      }
    });
  }

  // 递归处理子节点
  if (node.children && Array.isArray(node.children)) {
    node.children.forEach(child => traverseNode(child, elements));
  }
}

// 将RGB颜色转换为十六进制
function rgbToHex(rgbColor: { r: number; g: number; b: number; a?: number }): string {
  const r = Math.round(rgbColor.r * 255);
  const g = Math.round(rgbColor.g * 255);
  const b = Math.round(rgbColor.b * 255);
  const a = rgbColor.a !== undefined ? Math.round(rgbColor.a * 255) : 255;
  
  if (a < 255) {
    return `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(2)})`;
  }
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// 分析Figma设计系统
export async function analyzeFigmaDesignSystem(fileId: string, token: string) {
  try {
    const fileData = await getFigmaFileData(fileId, token);
    
    // 初始化设计元素集合
    const elements = {
      colors: new Set<string>(),
      fonts: new Set<string>(),
      fontSizes: new Set<string>(),
      fontWeights: new Set<number>(),
      letterSpacings: new Set<string>(),
      lineHeights: new Set<string>(),
      paddings: new Set<string>(),
      spacings: new Set<string>(),
      borderRadii: new Set<string>(),
      shadows: new Set<string>()
    };

    // 遍历文档树提取设计元素
    if (fileData.document) {
      traverseNode(fileData.document, elements);
    }

    // 分析组件和样式
    const components = Object.keys(fileData.components || {});
    const styles = Object.keys(fileData.styles || {});

    // 转换为数组并排序
    const analysis = {
      colors: {
        primary: Array.from(elements.colors).slice(0, 5), // 前5个作为主色
        secondary: Array.from(elements.colors).slice(5, 10), // 次要色
        background: Array.from(elements.colors).filter(c => c.includes('ffffff') || c.includes('f0f0f0')),
        text: Array.from(elements.colors).filter(c => c.includes('000000') || c.includes('333333')),
        accent: Array.from(elements.colors).slice(10, 15),
        error: Array.from(elements.colors).filter(c => c.includes('ff0000') || c.includes('e74c3c'))
      },
      gradients: [], // Figma渐变需要更复杂的处理
      typography: {
        fonts: Array.from(elements.fonts).sort(),
        sizes: Array.from(elements.fontSizes).sort((a, b) => {
          const aNum = parseInt(a.replace('px', ''));
          const bNum = parseInt(b.replace('px', ''));
          return bNum - aNum; // 从大到小排序
        }),
        weights: Array.from(elements.fontWeights).sort((a, b) => b - a),
        letterSpacings: Array.from(elements.letterSpacings).sort(),
        lineHeights: Array.from(elements.lineHeights).sort()
      },
      spacing: Array.from(elements.spacings).sort((a, b) => {
        const aNum = parseInt(a.replace('px', ''));
        const bNum = parseInt(b.replace('px', ''));
        return aNum - bNum; // 从小到大排序
      }),
      padding: Array.from(elements.paddings).sort((a, b) => {
        const aNum = parseInt(a.replace('px', ''));
        const bNum = parseInt(b.replace('px', ''));
        return aNum - bNum; // 从小到大排序
      }),
      borderRadius: Array.from(elements.borderRadii).sort((a, b) => {
        const aNum = parseInt(a.replace('px', ''));
        const bNum = parseInt(b.replace('px', ''));
        return aNum - bNum; // 从小到大排序
      }),
      shadows: Array.from(elements.shadows).sort(),
      components: components.length,
      styles: styles.length,
      fileName: fileData.name,
      lastModified: fileData.lastModified
    };

    console.log('Figma design system analysis completed:');
    console.log(`- Colors: ${Array.from(elements.colors).length}`);
    console.log(`- Fonts: ${Array.from(elements.fonts).length}`);
    console.log(`- Font sizes: ${Array.from(elements.fontSizes).length}`);
    console.log(`- Components: ${components.length}`);
    console.log(`- Styles: ${styles.length}`);

    return analysis;
  } catch (error) {
    console.error('Error analyzing Figma design system:', error);
    throw error;
  }
} 
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeWebsite(url: string) {
  try {
    // 获取网页内容
    const response = await axios.get(url);
    const html = response.data;
    
    // 使用 cheerio 解析 HTML
    const $ = cheerio.load(html);
    
    // 提取所有样式表链接
    const styleLinks = $('link[rel="stylesheet"]')
      .map((_, el) => $(el).attr('href'))
      .get();
    
    // 提取内联样式
    const inlineStyles = $('style')
      .map((_, el) => $(el).html())
      .get()
      .join('\n');
    
    // 提取所有 CSS 内容
    let cssContent = inlineStyles;
    for (const link of styleLinks) {
      try {
        const cssUrl = new URL(link, url).href;
        const cssResponse = await axios.get(cssUrl);
        cssContent += '\n' + cssResponse.data;
      } catch (error) {
        console.warn(`Failed to fetch CSS from ${link}:`, error);
      }
    }
    
    return {
      html,
      css: cssContent
    };
  } catch (error) {
    console.error('Error scraping website:', error);
    throw new Error('Failed to scrape website: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
} 
"""
Hugging Face Spaces entry point for Glue application
This file provides a Gradio interface wrapper around the Glue application
"""

import gradio as gr
import requests
import json
import os
from typing import Dict, Any, Optional

# Configuration
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8080")
FIGMA_TOKEN = os.getenv("FIGMA_TOKEN")
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")

def analyze_website(url: str) -> Dict[str, Any]:
    """Analyze a website by URL"""
    try:
        response = requests.post(
            f"{API_BASE_URL}/api/analyze",
            json={"url": url},
            timeout=30
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": f"Failed to analyze website: {str(e)}"}

def analyze_figma(figma_url: str) -> Dict[str, Any]:
    """Analyze a Figma design file"""
    try:
        response = requests.post(
            f"{API_BASE_URL}/api/analyze-figma",
            json={"figmaUrl": figma_url},
            timeout=30
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": f"Failed to analyze Figma file: {str(e)}"}

def analyze_files(html_content: str, css_content: str) -> Dict[str, Any]:
    """Analyze HTML and CSS files"""
    try:
        response = requests.post(
            f"{API_BASE_URL}/api/analyze-files",
            json={"html": html_content, "css": css_content},
            timeout=30
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": f"Failed to analyze files: {str(e)}"}

def generate_component(prompt: str, analysis_data: str) -> Dict[str, Any]:
    """Generate a component using AI"""
    try:
        analysis = json.loads(analysis_data) if analysis_data else None
        response = requests.post(
            f"{API_BASE_URL}/api/generate",
            json={"prompt": prompt, "analysisData": analysis},
            timeout=30
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": f"Failed to generate component: {str(e)}"}

def format_analysis_output(analysis: Dict[str, Any]) -> str:
    """Format analysis results for display"""
    if "error" in analysis:
        return f"❌ Error: {analysis['error']}"
    
    output = "🎨 Design System Analysis Results:\n\n"
    
    if "colors" in analysis:
        output += "🎨 Colors:\n"
        for category, colors in analysis["colors"].items():
            if colors:
                output += f"  {category.title()}: {', '.join(colors[:5])}\n"
        output += "\n"
    
    if "typography" in analysis:
        output += "📝 Typography:\n"
        if "fonts" in analysis["typography"]:
            output += f"  Fonts: {', '.join(analysis['typography']['fonts'][:3])}\n"
        if "sizes" in analysis["typography"]:
            output += f"  Sizes: {', '.join(analysis['typography']['sizes'][:5])}\n"
        output += "\n"
    
    if "spacing" in analysis:
        output += f"📏 Spacing: {', '.join(analysis['spacing'][:5])}\n\n"
    
    return output

def format_component_output(component: Dict[str, Any]) -> str:
    """Format component generation results for display"""
    if "error" in component:
        return f"❌ Error: {component['error']}"
    
    output = "🤖 Generated Component:\n\n"
    
    if "html" in component:
        output += "📄 HTML:\n"
        output += f"```html\n{component['html']}\n```\n\n"
    
    if "css" in component:
        output += "🎨 CSS:\n"
        output += f"```css\n{component['css']}\n```\n\n"
    
    if "description" in component:
        output += f"📝 Description: {component['description']}\n"
    
    return output

# Gradio Interface
with gr.Blocks(title="Glue - AI Web Component Generator", theme=gr.themes.Soft()) as demo:
    gr.Markdown("# 🎨 Glue - AI Web Component Generator")
    gr.Markdown("Analyze website design systems and generate AI-powered components")
    
    with gr.Tab("🌐 Website Analysis"):
        with gr.Row():
            with gr.Column():
                website_url = gr.Textbox(
                    label="Website URL",
                    placeholder="https://example.com",
                    info="Enter the URL of the website you want to analyze"
                )
                analyze_btn = gr.Button("🔍 Analyze Website", variant="primary")
            
            with gr.Column():
                website_output = gr.Textbox(
                    label="Analysis Results",
                    lines=15,
                    max_lines=20,
                    interactive=False
                )
        
        analyze_btn.click(
            fn=lambda url: format_analysis_output(analyze_website(url)),
            inputs=[website_url],
            outputs=[website_output]
        )
    
    with gr.Tab("🎨 Figma Analysis"):
        with gr.Row():
            with gr.Column():
                figma_url = gr.Textbox(
                    label="Figma File URL",
                    placeholder="https://www.figma.com/file/...",
                    info="Enter the Figma file URL you want to analyze"
                )
                figma_analyze_btn = gr.Button("🎨 Analyze Figma", variant="primary")
            
            with gr.Column():
                figma_output = gr.Textbox(
                    label="Figma Analysis Results",
                    lines=15,
                    max_lines=20,
                    interactive=False
                )
        
        figma_analyze_btn.click(
            fn=lambda url: format_analysis_output(analyze_figma(url)),
            inputs=[figma_url],
            outputs=[figma_output]
        )
    
    with gr.Tab("📁 File Analysis"):
        with gr.Row():
            with gr.Column():
                html_content = gr.Textbox(
                    label="HTML Content",
                    placeholder="<html>...</html>",
                    lines=8,
                    info="Paste your HTML content here"
                )
                css_content = gr.Textbox(
                    label="CSS Content",
                    placeholder="body { ... }",
                    lines=8,
                    info="Paste your CSS content here"
                )
                file_analyze_btn = gr.Button("📁 Analyze Files", variant="primary")
            
            with gr.Column():
                file_output = gr.Textbox(
                    label="File Analysis Results",
                    lines=15,
                    max_lines=20,
                    interactive=False
                )
        
        file_analyze_btn.click(
            fn=lambda html, css: format_analysis_output(analyze_files(html, css)),
            inputs=[html_content, css_content],
            outputs=[file_output]
        )
    
    with gr.Tab("🤖 Component Generation"):
        with gr.Row():
            with gr.Column():
                component_prompt = gr.Textbox(
                    label="Component Description",
                    placeholder="Create a login form with email and password fields",
                    lines=3,
                    info="Describe the component you want to generate"
                )
                analysis_data = gr.Textbox(
                    label="Analysis Data (JSON)",
                    placeholder='{"colors": {...}, "typography": {...}}',
                    lines=5,
                    info="Paste analysis results from previous steps (optional)"
                )
                generate_btn = gr.Button("🤖 Generate Component", variant="primary")
            
            with gr.Column():
                component_output = gr.Textbox(
                    label="Generated Component",
                    lines=20,
                    max_lines=25,
                    interactive=False
                )
        
        generate_btn.click(
            fn=lambda prompt, data: format_component_output(generate_component(prompt, data)),
            inputs=[component_prompt, analysis_data],
            outputs=[component_output]
        )
    
    # Footer
    gr.Markdown("---")
    gr.Markdown("""
    ### 🔧 Configuration
    Make sure to set the following environment variables in your Hugging Face Space settings:
    - `FIGMA_TOKEN`: Your Figma Personal Access Token
    - `DEEPSEEK_API_KEY`: Your DeepSeek API Key
    
    ### 📚 How to Use
    1. **Analyze a website** by entering its URL
    2. **Analyze Figma files** by pasting the Figma file URL
    3. **Analyze HTML/CSS files** by pasting the content directly
    4. **Generate components** using AI based on your analysis results
    """)

# Launch the app
if __name__ == "__main__":
    demo.launch(
        server_name="0.0.0.0",
        server_port=7860,
        share=False
    ) 
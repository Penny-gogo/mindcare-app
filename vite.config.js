import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 修复GitHub Pages部署的HTML插件
function fixGithubPagesPlugin() {
  return {
    name: 'fix-github-pages',
    transformIndexHtml(html) {
      // 1. 移除crossorigin属性（同源部署不需要CORS）
      html = html.replace(/\s+crossorigin(?=\s|>)/g, '')
      // 2. 将 type="module" 改为 defer script（IIFE格式不需要module，defer确保DOM就绪）
      html = html.replace(/<script(\s+)type="module"(\s+)src=/g, '<script defer$1src=')
      return html
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), fixGithubPagesPlugin()],
  base: process.env.VITE_BASE || '/mindcare-app/',  // GitHub Pages: 仓库名; Vercel: 设VITE_BASE=/
  build: {
    rollupOptions: {
      output: {
        // 使用IIFE格式替代ES模块，绕过GitHub Pages的模块加载限制
        // IIFE作为经典<script>加载，不需要CORS检查和JavaScript MIME类型
        format: 'iife',
        name: 'MindCareApp',
        entryFileNames: 'assets/index.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      }
    }
  },
  server: {
    host: '0.0.0.0',   // DevCloud: 必须绑定0.0.0.0，不能是localhost
    port: 8080,         // DevCloud: 只暴露8080端口
    open: false,        // DevCloud: 无浏览器，不能自动打开
    allowedHosts: true,  // Vite 5+: 允许DevCloud域名的Host请求
    // DeepSeek API代理 - 开发环境避免CORS，生产环境需云函数中转
    proxy: {
      '/api/deepseek': {
        target: 'https://api.deepseek.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/deepseek/, ''),
        headers: {
          'Origin': 'https://api.deepseek.com',
        },
      },
    },
  },
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 需要兼容经典脚本；Vercel 使用 Vite 默认 ESM 输出
const isGithubPagesBuild = (process.env.VITE_BASE || '/mindcare-app/') !== '/'

// 修复 GitHub Pages 部署的 HTML
function fixGithubPagesPlugin() {
  return {
    name: 'fix-github-pages',
    transformIndexHtml(html) {
      html = html.replace(/\s+crossorigin(?=\s|>)/g, '')
      html = html.replace(/<script(\s+)type="module"(\s+)src=/g, '<script defer$1src=')
      return html
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), ...(isGithubPagesBuild ? [fixGithubPagesPlugin()] : [])],
  base: process.env.VITE_BASE || '/mindcare-app/',
  build: {
    rollupOptions: {
      output: isGithubPagesBuild
        ? {
            format: 'iife',
            name: 'MindCareApp',
            entryFileNames: 'assets/index.js',
            chunkFileNames: 'assets/[name].js',
            assetFileNames: 'assets/[name].[ext]',
          }
        : {
            entryFileNames: 'assets/index-[hash].js',
            chunkFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash].[ext]',
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
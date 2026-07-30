import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 移除crossorigin属性的插件 - GitHub Pages同源部署不需要CORS
function removeCrossoriginPlugin() {
  return {
    name: 'remove-crossorigin',
    transformIndexHtml(html) {
      return html.replace(/\s+crossorigin(?=\s|>)/g, '')
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), removeCrossoriginPlugin()],
  base: '/mindcare-app/',  // GitHub Pages: 仓库名作为base路径
  server: {
    host: '0.0.0.0',   // DevCloud: 必须绑定0.0.0.0，不能是localhost
    port: 8080,         // DevCloud: 只暴露8080端口
    open: false,        // DevCloud: 无浏览器，不能自动打开
    allowedHosts: true,  // Vite 5+: 允许DevCloud域名的Host请求
  },
})
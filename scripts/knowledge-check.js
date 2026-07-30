#!/usr/bin/env node
/**
 * MindCare 小暖知识库更新检查脚本
 * 
 * 功能：
 * 1. 读取 knowledge-tracker.json，检查各模块新鲜度
 * 2. 生成更新报告（标记 stale 模块）
 * 3. 输出采集待办清单
 * 4. 更新 tracker 中的 lastChecked 字段
 * 
 * 用法：
 *   node scripts/knowledge-check.js           # 检查并输出报告
 *   node scripts/knowledge-check.js --update   # 检查并更新 tracker 文件
 *   node scripts/knowledge-check.js --markdown # 输出 Markdown 格式报告
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TRACKER_PATH = path.resolve(__dirname, '../src/data/knowledge-tracker.json');
const DO_UPDATE = process.argv.includes('--update');
const MARKDOWN = process.argv.includes('--markdown');

function loadTracker() {
  if (!fs.existsSync(TRACKER_PATH)) {
    console.error('❌ 找不到 knowledge-tracker.json，请确认路径正确');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(TRACKER_PATH, 'utf8'));
}

function saveTracker(tracker) {
  fs.writeFileSync(TRACKER_PATH, JSON.stringify(tracker, null, 2) + '\n', 'utf8');
}

function getDaysSince(dateStr) {
  const then = new Date(dateStr);
  const now = new Date();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

function getStatus(moduleInfo) {
  const days = getDaysSince(moduleInfo.lastContentUpdate);
  const staleDays = moduleInfo.staleDays || 30;
  if (days >= staleDays) return { status: 'stale', days, emoji: '🔴' };
  if (days >= staleDays * 0.7) return { status: 'aging', days, emoji: '🟡' };
  return { status: 'fresh', days, emoji: '🟢' };
}

function generateReport(tracker) {
  const today = new Date().toISOString().split('T')[0];
  const lines = [];
  const staleModules = [];
  const agingModules = [];

  if (MARKDOWN) {
    lines.push(`# 📚 MindCare 小暖知识库更新报告`);
    lines.push(``);
    lines.push(`**检查日期**: ${today}`);
    lines.push(``);
  } else {
    lines.push(`\n📚 MindCare 小暖知识库更新报告 - ${today}`);
    lines.push(`${'='.repeat(60)}`);
  }

  // 模块状态总览
  if (MARKDOWN) {
    lines.push(`## 模块状态总览`);
    lines.push(``);
    lines.push(`| 模块 | 类型 | 上次更新 | 天数 | 状态 | 优先级 |`);
    lines.push(`|------|------|----------|------|------|--------|`);
  } else {
    lines.push(`\n模块状态总览:`);
  }

  for (const [key, mod] of Object.entries(tracker.modules)) {
    const { status, days, emoji } = getStatus(mod);
    
    // 更新 tracker 中的状态
    mod.status = status;
    mod.lastChecked = today;

    if (status === 'stale') staleModules.push({ key, ...mod, days });
    if (status === 'aging') agingModules.push({ key, ...mod, days });

    if (MARKDOWN) {
      lines.push(`| ${mod.name} | ${mod.type} | ${mod.lastContentUpdate} | ${days}天 | ${emoji} ${status} | ${mod.priority} |`);
    } else {
      lines.push(`  ${emoji} ${mod.name.padEnd(20)} | ${days.toString().padStart(3)}天 | ${status.padEnd(6)} | 优先级: ${mod.priority}`);
    }
  }

  // 统计
  const total = Object.keys(tracker.modules).length;
  const fresh = total - staleModules.length - agingModules.length;
  
  if (MARKDOWN) {
    lines.push(``);
    lines.push(`> 总计 ${total} 个模块：🟢 ${fresh} 新鲜 | 🟡 ${agingModules.length} 老化 | 🔴 ${staleModules.length} 过期`);
  } else {
    lines.push(`\n  总计: ${total} 模块 | 🟢 ${fresh} 新鲜 | 🟡 ${agingModules.length} 老化 | 🔴 ${staleModules.length} 过期`);
  }

  // 需要立即更新的模块
  if (staleModules.length > 0) {
    if (MARKDOWN) {
      lines.push(``);
      lines.push(`## 🔴 需要立即更新`);
      lines.push(``);
    } else {
      lines.push(`\n${'='.repeat(60)}`);
      lines.push(`🔴 需要立即更新的模块:`);
    }

    staleModules
      .sort((a, b) => {
        const priority = { high: 0, medium: 1, low: 2 };
        return (priority[a.priority] || 2) - (priority[b.priority] || 2);
      })
      .forEach(mod => {
        if (MARKDOWN) {
          lines.push(`### ${mod.name} (过期 ${mod.days} 天)`);
          lines.push(`- **文件**: \`${mod.file}\``);
          lines.push(`- **优先级**: ${mod.priority}`);
          lines.push(`- **更新频率**: 每${mod.updateFrequency === 'weekly' ? '周' : mod.updateFrequency === 'biweekly' ? '两周' : mod.updateFrequency === 'monthly' ? '月' : '季度'}`);
          lines.push(`- **下次计划**: ${mod.nextPlan}`);
          lines.push(``);
        } else {
          lines.push(`  ⚠️ ${mod.name} (过期${mod.days}天, 优先级:${mod.priority})`);
          lines.push(`     文件: ${mod.file}`);
          lines.push(`     计划: ${mod.nextPlan}`);
        }
      });
  }

  // 采集待办
  const backlog = tracker.collectionBacklog;
  if (backlog) {
    if (MARKDOWN) {
      lines.push(`## 📋 采集待办清单`);
      lines.push(``);
      
      if (backlog.highPriority?.length) {
        lines.push(`### 高优先级`);
        backlog.highPriority.forEach(item => {
          lines.push(`- [ ] **${item.topic}** → ${item.targetModule} (来源: ${item.source})`);
        });
        lines.push(``);
      }
      if (backlog.mediumPriority?.length) {
        lines.push(`### 中优先级`);
        backlog.mediumPriority.forEach(item => {
          lines.push(`- [ ] ${item.topic} → ${item.targetModule} (来源: ${item.source})`);
        });
        lines.push(``);
      }
      if (backlog.lowPriority?.length) {
        lines.push(`### 低优先级`);
        backlog.lowPriority.forEach(item => {
          lines.push(`- [ ] ${item.topic} → ${item.targetModule} (来源: ${item.source})`);
        });
        lines.push(``);
      }
    } else {
      lines.push(`\n${'='.repeat(60)}`);
      lines.push(`📋 采集待办清单:`);
      lines.push(`  高优先级:`);
      backlog.highPriority?.forEach(item => {
        lines.push(`    → ${item.topic} (${item.source}) → ${item.targetModule}`);
      });
      lines.push(`  中优先级:`);
      backlog.mediumPriority?.forEach(item => {
        lines.push(`    → ${item.topic} (${item.source}) → ${item.targetModule}`);
      });
    }
  }

  // 更新策略提醒
  if (MARKDOWN) {
    lines.push(`## 📌 更新策略`);
    lines.push(``);
    lines.push(`| 模块类型 | 更新频率 | 说明 |`);
    lines.push(`|----------|----------|------|`);
    const policy = tracker.updatePolicy;
    for (const [type, info] of Object.entries(policy)) {
      lines.push(`| ${type} | ${info.frequency} | ${info.reason} |`);
    }
  }

  return lines.join('\n');
}

// ===== 主流程 =====
function main() {
  const tracker = loadTracker();
  const report = generateReport(tracker);

  console.log(report);

  if (DO_UPDATE) {
    // 更新 lastChecked 和 status
    const today = new Date().toISOString().split('T')[0];
    tracker.updateLog.push({
      date: today,
      action: 'auto_check',
      description: `自动检查：${Object.values(tracker.modules).filter(m => m.status === 'stale').length}个模块过期`
    });
    saveTracker(tracker);
    console.log(`\n✅ tracker 已更新 (lastChecked: ${today})`);
  }

  // 返回退出码：有过期高优先级模块时返回1
  const hasHighStale = Object.entries(tracker.modules).some(
    ([, m]) => m.status === 'stale' && m.priority === 'high'
  );
  if (hasHighStale) {
    console.log(`\n⚠️ 存在高优先级过期模块，建议尽快更新！`);
    if (!DO_UPDATE) process.exit(1);
  }
}

main();
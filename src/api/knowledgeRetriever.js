/**
 * MindCare 知识检索模块 - RAG增强
 * 从本地知识库中检索与用户消息相关的内容，注入AI对话上下文
 * 
 * 设计原则：
 * 1. 关键词匹配 + 主题映射双通道检索
 * 2. 控制上下文长度（<1500字），避免token浪费
 * 3. 优先返回实用技巧和温暖话术，而非理论定义
 */

import enhancedKnowledgeBase, { moduleList } from '../data/knowledge/index';

// ===== 主题关键词映射 =====
// 将用户常见话题映射到知识库模块
const TOPIC_MODULE_MAP = {
  // 职场相关
  '工作压力|加班|任务重|deadline|绩效|考核|996': ['workplaceMentalHealth', 'selfHelpToolkit'],
  '同事|领导|沟通|冲突|团队|职场人际': ['workplaceMentalHealth', 'warmResponseTemplates'],
  '倦怠|职业倦怠|burnout|没动力|厌倦': ['workplaceMentalHealth', 'cbt'],
  '转行|职业发展|迷茫|职业规划': ['workplaceMentalHealth', 'eap'],

  // 情绪相关
  '焦虑|不安|担心|紧张|恐惧|panic': ['cbt', 'mindfulness', 'selfHelpToolkit'],
  '抑郁|低落|难过|沮丧|无助|空虚|悲伤': ['cbt', 'warmResponseTemplates', 'crisisIntervention'],
  '愤怒|烦躁|暴躁|生气|情绪失控': ['cbt', 'selfHelpToolkit'],
  '自卑|不自信|自我怀疑|自我否定': ['cbt', 'kyInsights'],
  '内疚|愧疚|自责|后悔': ['cbt', 'warmResponseTemplates'],

  // 身心症状
  '失眠|睡不着|早醒|噩梦|睡眠': ['mindfulness', 'selfHelpToolkit'],
  '疲劳|疲惫|没精神|乏力': ['mindfulness', 'workplaceMentalHealth'],
  '头痛|胃痛|心悸|身体不适|躯体化': ['cbt', 'mindfulness'],

  // 心理技术
  '正念|冥想|呼吸|放松|身体扫描': ['mindfulness', 'selfHelpToolkit'],
  '认知|思维|CBT|认知重构|思维记录': ['cbt'],
  'EAP|员工援助|心理咨询|心理援助': ['eap', 'crisisIntervention'],

  // 危机相关
  '自杀|不想活|想死|活不下去|自残|伤害自己': ['crisisIntervention'],

  // 成长相关
  '自我|成长|接纳|爱自己|自我关怀': ['kyInsights', 'psychologySchools'],
  '关系|亲密关系|恋爱|分手|婚姻': ['kyInsights', 'warmResponseTemplates'],
  '意义|人生|存在|价值|目的': ['kyInsights', 'psychologySchools'],
};

// ===== 搜索索引构建 =====
let searchIndex = null;

/**
 * 构建搜索索引（懒加载，首次调用时构建）
 * 将知识库扁平化为可搜索的文本块
 */
function buildSearchIndex() {
  if (searchIndex) return searchIndex;

  searchIndex = [];

  for (const module of moduleList) {
    const moduleData = enhancedKnowledgeBase[module.key];
    if (!moduleData) continue;

    // 递归提取文本内容
    extractChunks(moduleData, [module.key], module.name, searchIndex);
  }

  return searchIndex;
}

/**
 * 递归提取知识库中的文本块
 */
function extractChunks(obj, path, moduleName, chunks) {
  if (!obj || typeof obj !== 'object') return;

  for (const [key, value] of Object.entries(obj)) {
    const currentPath = [...path, key];

    if (typeof value === 'string' && value.length > 20) {
      // 有意义的文本内容
      chunks.push({
        text: value,
        path: currentPath.join('.'),
        module: moduleName,
        keywords: extractKeywords(value),
      });
    } else if (Array.isArray(value)) {
      value.forEach((item, idx) => {
        if (typeof item === 'string' && item.length > 20) {
          chunks.push({
            text: item,
            path: [...currentPath, idx].join('.'),
            module: moduleName,
            keywords: extractKeywords(item),
          });
        } else if (typeof item === 'object' && item !== null) {
          // 数组中的对象，提取desc/text/content等字段
          for (const [k, v] of Object.entries(item)) {
            if (typeof v === 'string' && v.length > 20) {
              chunks.push({
                text: v,
                path: [...currentPath, idx, k].join('.'),
                module: moduleName,
                keywords: extractKeywords(v),
              });
            }
          }
        }
      });
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      extractChunks(value, currentPath, moduleName, chunks);
    }
  }
}

/**
 * 简易关键词提取（中文分词太重，用关键词匹配代替）
 */
function extractKeywords(text) {
  const keywords = new Set();
  // 提取2-4字的中文词组
  const chineseWords = text.match(/[\u4e00-\u9fa5]{2,4}/g) || [];
  chineseWords.forEach(w => keywords.add(w));
  // 提取英文单词
  const englishWords = text.match(/[a-zA-Z]{3,}/g) || [];
  englishWords.forEach(w => keywords.add(w.toLowerCase()));
  return [...keywords];
}

// ===== 检索函数 =====

/**
 * 从用户消息中提取检索关键词
 */
function extractQueryKeywords(message) {
  const keywords = new Set();
  // 中文词组
  const chineseWords = message.match(/[\u4e00-\u9fa5]{2,4}/g) || [];
  chineseWords.forEach(w => keywords.add(w));
  // 英文单词
  const englishWords = message.match(/[a-zA-Z]{3,}/gi) || [];
  englishWords.forEach(w => keywords.add(w.toLowerCase()));
  return [...keywords];
}

/**
 * 主题映射检索：根据用户消息匹配相关模块
 */
function searchByTopicMapping(message) {
  const relevantModules = new Set();
  const relevantChunks = [];

  for (const [pattern, modules] of Object.entries(TOPIC_MODULE_MAP)) {
    const keywords = pattern.split('|');
    const matched = keywords.some(kw => message.includes(kw));
    if (matched) {
      modules.forEach(m => relevantModules.add(m));
    }
  }

  return [...relevantModules];
}

/**
 * 关键词匹配检索：在索引中搜索相关文本块
 */
function searchByKeywords(queryKeywords, topK = 5) {
  const index = buildSearchIndex();
  const scored = [];

  for (const chunk of index) {
    let score = 0;
    for (const qk of queryKeywords) {
      if (chunk.keywords.includes(qk)) {
        score += 2; // 精确匹配
      } else if (chunk.text.includes(qk)) {
        score += 1; // 文本包含
      }
    }
    if (score > 0) {
      scored.push({ ...chunk, score });
    }
  }

  // 按相关度排序，取topK
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

/**
 * 优先提取实用内容（技巧、方法、话术）而非理论定义
 */
function prioritizePracticalContent(chunks) {
  const practical = [];
  const theoretical = [];

  const practicalKeywords = ['技巧', '方法', '步骤', '练习', '话术', '建议', '试试', '可以', '如何', '怎么做'];
  const theoreticalKeywords = ['定义', '概念', '理论', '历史', '起源', '分类', '类型'];

  for (const chunk of chunks) {
    const isPractical = practicalKeywords.some(kw => chunk.text.includes(kw));
    const isTheoretical = theoreticalKeywords.some(kw => chunk.text.includes(kw));

    if (isPractical && !isTheoretical) {
      practical.push(chunk);
    } else if (isPractical) {
      practical.push(chunk); // 既有实用又有理论，优先
    } else {
      theoretical.push(chunk);
    }
  }

  return [...practical, ...theoretical];
}

// ===== 主检索函数 =====

/**
 * 检索与用户消息相关的知识上下文
 * @param {string} userMessage - 用户消息
 * @param {object} options - 检索选项
 * @param {number} options.maxContextLength - 最大上下文长度（字符数），默认1500
 * @param {number} options.topK - 关键词检索返回的最大块数，默认5
 * @returns {{ context: string, modules: string[], chunks: number }}
 */
export function retrieveKnowledgeContext(userMessage, options = {}) {
  const { maxContextLength = 1500, topK = 5 } = options;

  if (!userMessage || typeof userMessage !== 'string') {
    return { context: '', modules: [], chunks: 0 };
  }

  // 1. 主题映射检索
  const relevantModules = searchByTopicMapping(userMessage);

  // 2. 关键词匹配检索
  const queryKeywords = extractQueryKeywords(userMessage);
  const keywordResults = searchByKeywords(queryKeywords, topK);

  // 3. 合并结果，去重
  const seenTexts = new Set();
  const allChunks = [];

  // 先加入主题映射相关的模块内容
  for (const moduleKey of relevantModules) {
    const moduleData = enhancedKnowledgeBase[moduleKey];
    if (!moduleData) continue;

    // 提取模块中的实用内容
    const moduleChunks = [];
    extractChunks(moduleData, [moduleKey], moduleKey, moduleChunks);

    // 筛选与用户消息相关的块
    const relevant = moduleChunks.filter(chunk => {
      const hasOverlap = queryKeywords.some(qk => chunk.text.includes(qk));
      return hasOverlap;
    });

    for (const chunk of relevant) {
      const textKey = chunk.text.slice(0, 50);
      if (!seenTexts.has(textKey)) {
        seenTexts.add(textKey);
        allChunks.push(chunk);
      }
    }
  }

  // 再加入关键词检索结果
  for (const chunk of keywordResults) {
    const textKey = chunk.text.slice(0, 50);
    if (!seenTexts.has(textKey)) {
      seenTexts.add(textKey);
      allChunks.push(chunk);
    }
  }

  // 4. 优先实用内容
  const prioritized = prioritizePracticalContent(allChunks);

  // 5. 组装上下文，控制长度
  let context = '';
  let usedChunks = 0;

  for (const chunk of prioritized) {
    const entry = `【${chunk.module}】${chunk.text.slice(0, 200)}\n`;
    if (context.length + entry.length > maxContextLength) break;
    context += entry;
    usedChunks++;
  }

  return {
    context: context.trim(),
    modules: relevantModules,
    chunks: usedChunks,
  };
}

/**
 * 获取模块列表（供UI展示）
 */
export function getAvailableModules() {
  return moduleList;
}
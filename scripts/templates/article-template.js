/**
 * MindCare 小暖知识库 - 新文章内容模板
 * 
 * 使用说明：
 * 1. 复制此模板到 articleCollection.js 对应分类的 articles 数组中
 * 2. 替换所有占位符内容（{{...}}）
 * 3. 确保核心洞察、实用技巧、温暖话术三者齐全
 * 4. 更新 knowledge-tracker.json 中的 lastContentUpdate 日期
 * 5. 运行 node scripts/knowledge-check.js --update 验证
 * 
 * 采集流程（参考 articleCollection.collectionWorkflow）：
 *   筛选 → 阅读 → 提炼 → 分类 → AI集成 → 审核
 */
const articleTemplate = {
  // ===== 基本信息 =====
  title: '{{文章标题}}',
  source: {
    platform: '{{来源平台：KnowYourself/壹心理/简单心理/B站/学术期刊/书籍}}',
    author: '{{原作者/出处}}',
    originalUrl: '{{原文链接，如有}}',
    publishDate: '{{原文发布日期}}',
    collectedDate: '{{采集日期}}',
  },

  // ===== 核心内容提炼 =====
  // 设计原则：不是简单搬运，而是提炼精华
  // 每篇文章提取3-5个核心洞察、1-3个实用技巧、1-2条温暖话术
  
  coreInsights: [
    {
      insight: '{{核心洞察1：文章最关键的观点}}',
      evidence: '{{支撑证据：研究数据/案例/理论依据}}',
      eapRelevance: '{{与EAP/职场心理的关联}}',
    },
    {
      insight: '{{核心洞察2}}',
      evidence: '{{支撑证据}}',
      eapRelevance: '{{EAP关联}}',
    },
    {
      insight: '{{核心洞察3}}',
      evidence: '{{支撑证据}}',
      eapRelevance: '{{EAP关联}}',
    },
  ],

  practicalTips: [
    {
      title: '{{技巧标题1}}',
      steps: ['{{步骤1}}', '{{步骤2}}', '{{步骤3}}'],
      difficulty: '{{easy/medium/hard}}',
      estimatedTime: '{{预估时间，如5分钟}}',
      applicableScenario: '{{适用场景描述}}',
    },
  ],

  warmPhrases: [
    {
      phrase: '{{温暖话术1：可直接被小暖使用的安慰/鼓励语句}}',
      scenario: '{{使用场景：用户XX时}}',
      tone: '{{温和/坚定/轻松}}',
    },
    {
      phrase: '{{温暖话术2}}',
      scenario: '{{使用场景}}',
      tone: '{{语调}}',
    },
  ],

  // ===== AI对话集成 =====
  // 小暖如何调用这篇文章的内容
  aiIntegration: {
    applicableScenarios: [
      '{{场景1：用户说"我XXX"时}}',
      '{{场景2：用户表达XX情绪时}}',
    ],
    relatedModules: ['{{关联知识库模块key，如cbt/mindfulness/workplaceMentalHealth}}'],
    suggestedResponse: '{{小暖的建议回复模板，融合本文核心观点+温暖话术}}',
  },

  // ===== 质量审核 =====
  qualityCheck: {
    hasResearchEvidence: false,  // 是否有研究/数据支撑
    hasActionableAdvice: false,  // 是否有可操作建议
    warmPhrasesNatural: false,   // 温暖话术是否自然不生硬
    avoidsLabeling: false,       // 是否避免标签化和简单化
    aiTemplateUsable: false,     // AI回复模板是否可直接使用
    reviewedBy: '',              // 审核人
    reviewedDate: '',            // 审核日期
  },
};

// ===== 分类归属 =====
// 将文章放入 articleCollection.js 中对应的分类：
// 
// 1. emotionManagement  - 情绪管理（焦虑/抑郁/愤怒/情绪调节）
// 2. workplacePsychology - 职场心理（倦怠/压力/人际关系/职业发展）
// 3. intimateRelationship - 亲密关系（恋爱/婚姻/沟通/依恋）
// 4. selfGrowth - 自我成长（自尊/自我认知/价值观/人生意义）
// 5. familyRelationship - 家庭关系（原生家庭/亲子/代际沟通）
// 6. stressRelief - 减压放松（正念/冥想/呼吸/身体放松）
// 7. sleepHealth - 睡眠健康（失眠/睡眠卫生/作息调节）
// 8. psychologicalFirstAid - 心理急救（危机应对/自伤预防/求助指南）

module.exports = articleTemplate;
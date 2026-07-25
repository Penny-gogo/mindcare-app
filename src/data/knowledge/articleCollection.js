// MindCare EAP知识库 - 网络心理文章结构化采集框架
// 来源分类：公众号/知乎/B站/学术期刊/书籍
// 设计原则：每篇文章提炼核心洞察+实用技巧+温暖话术，可直接被AI对话调用

const articleCollection = {
  // 采集框架元信息
  meta: {
    version: '2.0',
    lastUpdated: '2026-07-25',
    description: '从主流心理内容平台结构化采集高质量文章，为MindCare AI对话提供丰富素材',
    designPrinciple: '不是简单搬运，而是提炼精华——每篇文章提取3-5个核心洞察、1-3个实用技巧、1-2条温暖话术'
  },

  // ============================================================
  // 来源分类与采集指南
  // ============================================================
  sourceGuide: {
    wechat: {
      name: '微信公众号',
      platforms: ['KnowYourself', '壹心理', '简单心理', '北大心理健康中心', '华东师大心理中心', '京师心理大学堂'],
      collectionMethod: '复制文章全文→按模板结构化→填入对应主题',
      qualityStandard: '10万+阅读或专业机构出品，优先选择有研究引用的文章'
    },
    zhihu: {
      name: '知乎',
      platforms: ['心理学话题', '心理咨询话题', '心理健康话题'],
      collectionMethod: '筛选高赞回答（500+赞）→提炼核心观点→按模板结构化',
      qualityStandard: '高赞+专业背景认证答主，排除个人经验分享类'
    },
    bilibili: {
      name: 'B站',
      platforms: ['心理学科普UP主', '心理咨询师频道', '高校心理公开课'],
      collectionMethod: '观看视频→提取核心知识点→转化为文字模板',
      qualityStandard: '10万+播放或专业机构/认证咨询师出品'
    },
    academic: {
      name: '学术期刊',
      platforms: ['中国心理学会官网', '心理学报', '心理科学进展', '中国临床心理学杂志'],
      collectionMethod: '阅读摘要和结论→提取关键发现→用通俗语言重述',
      qualityStandard: 'CSSCI/核心期刊，近5年发表，有实证数据支撑'
    },
    books: {
      name: '心理学书籍',
      platforms: ['得到APP', '微信读书', '豆瓣阅读'],
      collectionMethod: '阅读章节→提取核心框架和金句→按模板结构化',
      qualityStandard: '豆瓣评分8.0+，专业领域经典或畅销'
    }
  },

  // ============================================================
  // 文章结构化模板
  // ============================================================
  template: {
    // 基础模板（所有文章必须填写）
    base: {
      articleTitle: '文章标题',
      source: { platform: '来源平台', author: '作者/账号名', url: '原文链接（如有）' },
      publishDate: '发布日期',
      readCount: '阅读量/播放量',
      tags: ['标签1', '标签2'],  // 用于AI匹配
      summary: '一句话摘要（20字以内）'
    },
    // 内容模板
    content: {
      coreInsights: [
        { insight: '核心洞察', evidence: '支撑证据（研究/案例）', practicalMeaning: '对普通人的意义' }
      ],
      practicalTips: [
        { tip: '实用技巧', steps: ['步骤1', '步骤2'], difficulty: '简单/中等/需要练习', estimatedTime: '预计用时' }
      ],
      warmPhrases: [
        { phrase: '温暖话术', scenario: '适用场景', tone: '语气（温和/坚定/共情）' }
      ]
    },
    // AI对话集成模板
    aiIntegration: {
      applicableScenarios: ['用户说……时使用', '用户处于……状态时使用'],
      relatedModules: ['cbt', 'mindfulness'],  // 关联知识库模块
      suggestedResponse: '基于此文章的AI回复模板'
    }
  },

  // ============================================================
  // 主题分类（扩展版）
  // ============================================================
  categories: {
    // 核心主题
    emotionManagement: {
      name: '情绪管理',
      subtopics: ['焦虑应对', '抑郁识别与自助', '愤怒管理', '情绪调节技巧', '情绪表达'],
      relatedTherapy: ['cbt', 'act', 'dbt'],
      articles: []
    },
    workplacePsychology: {
      name: '职场心理',
      subtopics: ['职业倦怠', '工作压力', '职场人际', '向上管理', '工作生活平衡', '职业转型'],
      relatedTherapy: ['sfbt', 'cbt'],
      articles: []
    },
    interpersonalRelationships: {
      name: '人际关系',
      subtopics: ['社交焦虑', '沟通技巧', '边界设定', '冲突处理', '讨好型人格'],
      relatedTherapy: ['satir', 'familySystems'],
      articles: []
    },
    intimateRelationships: {
      name: '亲密关系',
      subtopics: ['依恋模式', '恋爱心理', '分手恢复', '婚姻经营', '原生家庭影响'],
      relatedTherapy: ['familySystems', 'psychoanalysis'],
      articles: []
    },
    selfDevelopment: {
      name: '自我发展',
      subtopics: ['自我认知', '自尊与自信', '完美主义', '拖延症', '决策困难', '意义感寻找'],
      relatedTherapy: ['humanistic', 'act'],
      articles: []
    },
    familyOfOrigin: {
      name: '原生家庭',
      subtopics: ['代际创伤', '家庭角色', '与父母的关系', '家庭规则', '自我分化'],
      relatedTherapy: ['familySystems', 'psychoanalysis'],
      articles: []
    },
    stressAndResilience: {
      name: '压力与韧性',
      subtopics: ['压力管理', '心理韧性', '创伤恢复', '倦怠预防', '正念减压'],
      relatedTherapy: ['mindfulness', 'cbt', 'act'],
      articles: []
    },
    sleepAndHealth: {
      name: '睡眠与身心健康',
      subtopics: ['失眠应对', '睡眠卫生', '身心连接', '慢性疼痛心理', '躯体化症状'],
      relatedTherapy: ['mindfulness', 'cbt'],
      articles: []
    }
  },

  // ============================================================
  // 示例文章（展示模板用法）
  // ============================================================
  examples: [
    {
      articleTitle: '为什么你总是觉得自己不够好？',
      source: { platform: 'KnowYourself', author: 'KY主创们', url: '' },
      publishDate: '2024-03',
      readCount: '10万+',
      tags: ['自尊', '自我批评', '内在声音', 'CBT'],
      summary: '自我批评的根源与转化方法',
      coreInsights: [
        { insight: '自我批评往往来自内化的"严苛父母"声音', evidence: 'Higgins(1987)自我差异理论：现实自我与应该自我的差距导致痛苦', practicalMeaning: '你内心的批评声音不是你的真实想法，而是被植入的' },
        { insight: '自我关怀比自我批评更能促进改变', evidence: 'Neff(2011)研究：自我关怀组比自我批评组在任务表现上更好', practicalMeaning: '对自己温柔不是放纵，而是更有效的成长方式' }
      ],
      practicalTips: [
        { tip: '给内心批评者起个名字', steps: ['注意自我批评的声音', '给它起一个名字（如"严先生"）', '当它出现时说"严先生又来了"'], difficulty: '简单', estimatedTime: '随时可用' },
        { tip: '给好朋友写信法', steps: ['想象好朋友遇到同样的困境', '你会对TA说什么', '把那些话对自己说'], difficulty: '简单', estimatedTime: '5-10分钟' }
      ],
      warmPhrases: [
        { phrase: '你已经够好了，只是你的内心批评者不同意', scenario: '用户自我否定时', tone: '温和' },
        { phrase: '对自己温柔一点，你也在努力', scenario: '用户对自己要求过高时', tone: '共情' }
      ],
      aiIntegration: {
        applicableScenarios: ['用户说"我不够好""我总是做不好"时', '用户自我评价过低时'],
        relatedModules: ['cbt', 'humanistic'],
        suggestedResponse: '我听到你在对自己很严格。有时候我们内心的批评声音很响，但它说的不一定是事实。心理学研究发现，自我关怀比自我批评更能帮助我们成长。试试这个：如果你最好的朋友遇到同样的情况，你会对TA说什么？那些话，也值得对自己说。'
      }
    }
  ],

  // ============================================================
  // 采集工作流（供定时任务使用）
  // ============================================================
  collectionWorkflow: {
    steps: [
      { step: 1, name: '筛选', desc: '从来源平台筛选高质量文章（阅读量/专业度/时效性）' },
      { step: 2, name: '阅读', desc: '通读全文，标记核心观点和关键数据' },
      { step: 3, name: '提炼', desc: '按模板提取核心洞察、实用技巧、温暖话术' },
      { step: 4, name: '分类', desc: '归入对应主题分类，标注关联知识库模块' },
      { step: 5, name: 'AI集成', desc: '编写AI回复模板，确保对话系统可调用' },
      { step: 6, name: '审核', desc: '检查专业准确性、温暖度、可操作性' }
    ],
    qualityChecklist: [
      '是否有研究/数据支撑？',
      '是否给出了具体可操作的建议？',
      '温暖话术是否自然不生硬？',
      '是否避免了标签化和简单化？',
      'AI回复模板是否可直接使用？'
    ],
    updateFrequency: '每周更新2-3篇，优先补充高频主题（情绪管理/职场心理/亲密关系）'
  }
};

export default articleCollection;
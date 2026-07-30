// MindCare EAP知识库 - 模块十二：主流心理学技术流派
// 来源：APA认证疗法、循证心理学研究、中国心理学会注册系统
// 价值：为MindCare AI对话提供多元化理论支撑，超越单一CBT框架

const psychologySchools = {
  overview: {
    description: '整合8大主流心理学流派核心理论，为MindCare提供多元化干预视角。不同流派适合不同人群和问题，AI可根据用户状态智能匹配最合适的理论框架。',
    designPrinciple: '不偏废任何流派，根据用户问题类型灵活选择——焦虑用CBT，创伤用EMDR，存在困惑用人本主义，关系问题用家庭系统'
  },

  // 精神分析/心理动力学
  psychoanalysis: {
    name: '精神分析/心理动力学',
    founders: ['西格蒙德·弗洛伊德', '梅兰妮·克莱因', '唐纳德·温尼科特'],
    coreConcept: '无意识冲突和早期经验塑造了当前的行为与情绪模式，通过探索无意识内容实现深层改变',
    keyPrinciples: [
      { principle: '无意识决定论', desc: '大部分心理活动发生在意识之外，行为受无意识冲突驱动' },
      { principle: '早期经验塑造', desc: '童年与主要照顾者的关系形成内在模式，影响成年后的关系和行为' },
      { principle: '防御机制', desc: '自我使用防御机制（压抑、投射、合理化等）来应对焦虑' },
      { principle: '移情与反移情', desc: '来访者将过去重要关系的模式投射到当前关系中' }
    ],
    keyTechniques: [
      { technique: '自由联想', desc: '不加审查地说出脑海中浮现的任何想法', applicableScenario: '探索无意识冲突和内在模式' },
      { technique: '梦的解析', desc: '分析梦境中的象征意义，揭示无意识愿望', applicableScenario: '用户反复做某种梦或提到梦境时' },
      { technique: '解释', desc: '咨询师将无意识内容意识化，帮助来访者获得洞察', applicableScenario: '用户反复出现相同模式但未察觉时' },
      { technique: '修通', desc: '反复探索和解释，逐步改变内在模式', applicableScenario: '长期咨询中的深层改变' }
    ],
    applicableIssues: ['反复出现的关系模式', '不明原因的焦虑', '自我破坏行为', '身份认同困惑'],
    mindCareApplication: {
      forChat: '当用户说"我总是遇到同样的问题"时，可引导探索是否有深层模式在起作用',
      warmPhrase: '"有时候我们反复遇到相似的困境，可能不是运气不好，而是内心有一种模式在悄悄影响着我们。我们可以一起看看这个模式是什么。"',
      caution: '精神分析侧重深层探索，AI对话中应避免过度解读，更多用于帮助用户觉察模式'
    }
  },

  // 人本主义疗法
  humanistic: {
    name: '人本主义/以人为中心疗法',
    founders: ['卡尔·罗杰斯', '亚伯拉罕·马斯洛', '罗洛·梅'],
    coreConcept: '每个人都有自我实现的内在动力，在安全、被接纳的关系中，人自然趋向成长和改变',
    keyPrinciples: [
      { principle: '无条件积极关注', desc: '不带任何条件地接纳和尊重来访者' },
      { principle: '共情理解', desc: '深入体会来访者的主观世界，像对方一样看世界' },
      { principle: '真诚一致', desc: '咨询师在关系中保持真实，不戴面具' },
      { principle: '自我实现倾向', desc: '相信每个人都有向善、成长的内在动力' }
    ],
    keyTechniques: [
      { technique: '反映情感', desc: '将对方表达的情感反映回去，让对方感到被理解', example: '"听起来你感到很失望，因为你付出了很多却没被看到"' },
      { technique: '无条件接纳', desc: '无论对方说什么，都不评判，只接纳', example: '"你现在的感受，无论是什么，都是被允许的"' },
      { technique: '促进自我探索', desc: '通过开放式提问帮助对方深入了解自己', example: '"对你来说，最重要的是什么？"' }
    ],
    applicableIssues: ['自我价值感低', '寻求自我认同', '人生意义困惑', '需要被理解和接纳'],
    mindCareApplication: {
      forChat: '人本主义是MindCare AI对话的底层态度——先接纳、先共情，再提供专业方法',
      warmPhrase: '"你不需要变成别人期望的样子，你本来的样子就值得被善待。我在这里，陪你一起看看真实的自己。"',
      designNote: 'MindCare的"温暖话术"模块大量借鉴人本主义理念——先接纳情绪，再处理问题'
    }
  },

  // 接纳承诺疗法 ACT
  act: {
    name: '接纳承诺疗法（ACT）',
    founders: ['斯蒂文·海斯'],
    coreConcept: '不与负面想法和情绪对抗，而是接纳它们的存在，同时承诺采取与价值观一致的行动',
    hexaflexModel: [
      { process: '接纳', desc: '主动接纳而非回避痛苦体验', metaphor: '与焦虑同坐一班车，而不是试图把它推下车' },
      { process: '认知解离', desc: '与想法保持距离，不被想法定义', metaphor: '"我有一个想法……"而不是"我就是……"' },
      { process: '接触当下', desc: '全然投入此时此刻的体验', metaphor: '像第一次看到日落一样感受当下' },
      { process: '作为观察者的自我', desc: '认识到我不是我的想法和情绪', metaphor: '天空不是云——你是天空，想法和情绪是飘过的云' },
      { process: '价值观', desc: '明确什么对你是真正重要的', metaphor: '价值观是罗盘，不是目的地——它指引方向' },
      { process: '承诺行动', desc: '基于价值观采取具体行动', metaphor: '朝着罗盘指引的方向迈出一步，哪怕很小' }
    ],
    keyTechniques: [
      { technique: '认知解离练习', desc: '"谢谢你的大脑"——对想法说谢谢，然后让它过去', example: '当出现"我不行"的想法时，说"我注意到我有一个\'我不行\'的想法"' },
      { technique: '价值观澄清', desc: '明确生活中最重要的方向', example: '"如果你不再被恐惧困扰，你最想成为什么样的人？"' },
      { technique: '接纳练习', desc: '不试图改变或消除不适，而是为它腾出空间', example: '"想象你的焦虑是一个气球，它可以在你身边飘着，你不需要戳破它"' }
    ],
    applicableIssues: ['慢性焦虑', '无法控制的担忧', '回避行为', '价值观迷茫', '接纳困难'],
    mindCareApplication: {
      forChat: '当用户反复说"我不想有这种感觉"时，引入ACT接纳理念',
      warmPhrase: '"你不需要先消灭所有不舒服的感觉才能开始生活。带着这些感觉，依然可以朝着你想要的方向走。"',
      featureMapping: 'MindCare测评模块可增加"价值观澄清"练习，帮助用户找到行动方向'
    }
  },

  // 辩证行为疗法 DBT
  dbt: {
    name: '辩证行为疗法（DBT）',
    founders: ['玛莎·莱恩汉'],
    coreConcept: '在接纳与改变之间找到辩证平衡——同时接纳自己现在的样子，同时努力改变',
    fourModules: [
      { module: '正念', desc: '活在当下，不加评判地觉察', coreSkill: '观察、描述、参与', practicalExercise: '5-4-3-2-1感官练习：说出5个看到的、4个触摸的、3个听到的、2个闻到的、1个尝到的' },
      { module: '情绪调节', desc: '理解情绪的功能，学习改变不想要的情绪', coreSkill: '相反行动、检查事实、积累积极情绪', practicalExercise: '相反行动：当你想回避时，反而靠近一步；当你想攻击时，反而温和对待' },
      { module: '人际效能', desc: '在关系中既达到目标又维护自尊', coreSkill: 'DEAR MAN（描述、表达、坚持、强化）', practicalExercise: '用DEAR MAN表达需求：描述事实→表达感受→坚持请求→强化好处' },
      { module: '痛苦耐受', desc: '在无法改变痛苦时，学会承受而不让情况更糟', coreSkill: 'TIPP（温度、剧烈运动、调节呼吸、配对放松）', practicalExercise: 'TIPP紧急降温：用冷水洗脸或握冰块→做20个开合跳→延长呼气→交替紧握松开拳头' }
    ],
    applicableIssues: ['情绪波动大', '冲动行为', '人际关系困难', '自我伤害倾向', '情绪失调'],
    mindCareApplication: {
      forChat: '当用户情绪极度波动时，优先使用DBT痛苦耐受技术稳定情绪',
      warmPhrase: '"你现在感觉很难受，这很真实。我们先不急着改变它，先让自己稳住——试试用冷水洗个脸，或者深呼吸几次。"',
      featureMapping: 'MindCare可设计"情绪急救包"功能，内置DBT的TIPP等紧急技术'
    }
  },

  // 焦点解决短期治疗 SFBT
  sfbt: {
    name: '焦点解决短期治疗（SFBT）',
    founders: ['斯蒂夫·德·沙泽尔', '茵素·金·伯格'],
    coreConcept: '不深挖问题原因，而是聚焦于解决方案和来访者想要的未来',
    coreAssumptions: [
      '问题原因不等于解决方案——了解问题不必然导致解决',
      '来访者是自己生活的专家——他们拥有解决问题的资源',
      '小改变带来大变化——系统视角下，微小改变可引发连锁反应',
      '关注有效的事——做有用的就多做，没用的就停止',
      '未来是被创造的不是被预测的——聚焦想要的未来而非害怕的未来'
    ],
    keyTechniques: [
      { technique: '奇迹提问', desc: '假设问题一夜之间解决了，你会注意到什么不同', example: '"如果今晚你睡着后，奇迹发生了，你困扰的问题都解决了，明天早上你最先注意到什么不同？"' },
      { technique: '例外提问', desc: '寻找问题不存在或较轻的时刻', example: '"有没有什么时候，这个问题没有那么严重？那时候有什么不同？"' },
      { technique: '量尺提问', desc: '用1-10分评估现状和进展', example: '"如果10分是你想要的状态，1分是最差，你现在在几分？是什么让你在这个分数而不是更低？"' },
      { technique: '应对提问', desc: '肯定来访者已有的应对能力', example: '"这么困难的情况下，你是怎么坚持到现在的？"' }
    ],
    applicableIssues: ['职场困境', '目标设定', '行动力不足', '需要快速见效的问题'],
    mindCareApplication: {
      forChat: '当用户陷入问题反复描述时，用SFBT引导转向解决方案',
      warmPhrase: '"你已经很努力地在面对了。我们来想象一下，如果事情开始好转，你会先注意到什么变化？"',
      featureMapping: 'KY月食APP的"聊愈"功能正是基于SFBT设计——MindCare可借鉴'
    }
  },

  // 叙事治疗
  narrative: {
    name: '叙事治疗',
    founders: ['迈克尔·怀特', '大卫·艾普斯顿'],
    coreConcept: '人不是问题，问题才是问题——通过重新叙述生命故事，发现被忽略的可能',
    keyPrinciples: [
      { principle: '外化对话', desc: '将问题与人分离——"你不是问题，问题才是问题"', example: '不说"我很焦虑"，而说"焦虑又来找我聊天了"' },
      { principle: '解构', desc: '拆解那些限制人的主流叙事和文化假设', example: '"谁说30岁一定要事业有成？这个想法是从哪里来的？"' },
      { principle: '重写故事', desc: '发现被问题叙事遮盖的积极故事线', example: '"虽然焦虑一直跟着你，但你还是完成了那么多事情——这个故事也很重要"' },
      { principle: '独特结果', desc: '寻找问题没有获胜的时刻', example: '"有没有什么时候焦虑本来要来，但你做了什么让它没有完全控制你？"' }
    ],
    applicableIssues: ['身份认同困扰', '被标签束缚', '自我否定叙事', '需要重新定义自我'],
    mindCareApplication: {
      forChat: '当用户说"我是……的人"（自我标签）时，用叙事治疗外化对话',
      warmPhrase: '"你不是你的焦虑，也不是你的抑郁。焦虑只是你生命故事中的一个角色，而你是整本书的作者。"',
      featureMapping: 'MindCare树洞功能可设计"重写我的故事"专题，鼓励用户分享积极转折'
    }
  },

  // 萨提亚模式
  satir: {
    name: '萨提亚转化式系统治疗',
    founders: ['维吉尼亚·萨提亚'],
    coreConcept: '每个人都有自我价值，问题行为往往是不健康的应对方式，通过提升自我价值实现转化',
    fourSurvivalStances: [
      { stance: '讨好', desc: '忽略自己，只关注他人和情境', innerMonologue: '"我什么都不是，你才重要"', transformation: '变为"关爱者"——关心他人的同时也关爱自己' },
      { stance: '指责', desc: '忽略他人，只关注自己和情境', innerMonologue: '"我才是对的，你什么都不行"', transformation: '变为"果断者"——坚定表达自己的同时也尊重他人' },
      { stance: '超理智', desc: '忽略自己和他人，只关注情境', innerMonologue: '"感受不重要，逻辑才重要"', transformation: '变为"理性者"——用智慧的同时也连接情感' },
      { stance: '打岔', desc: '忽略自己、他人和情境', innerMonologue: '"没什么重要的"', transformation: '变为"创造者"——灵活变通的同时也活在当下' }
    ],
    fifthStance: {
      stance: '一致性', desc: '同时关注自己、他人和情境——真实的、平衡的、有连接的',
      innerState: '自我价值感高，能真诚表达感受和需求，同时尊重他人',
      goal: '萨提亚模式的核心目标——帮助人从四种求生姿态走向一致性'
    },
    keyTechniques: [
      { technique: '家庭雕塑', desc: '用身体姿态呈现家庭关系中的互动模式', applicableScenario: '帮助用户"看到"而非仅仅"说到"关系模式' },
      { technique: '冰山隐喻', desc: '行为只是冰山一角，水下还有感受、观点、期待、渴望、自我', layers: ['行为（可见）', '感受', '对感受的感受', '观点', '期待', '渴望', '自我（最深层）'] },
      { technique: '自我价值提升', desc: '通过肯定、接纳、赋能提升来访者的自我价值感', example: '"你值得被爱，不是因为做了什么，而是因为你存在本身"' }
    ],
    applicableIssues: ['人际关系模式', '自我价值感低', '家庭关系困扰', '沟通困难'],
    mindCareApplication: {
      forChat: '当用户描述人际冲突时，用萨提亚冰山模型帮助探索深层需求',
      warmPhrase: '"你看到的冲突只是冰山一角，下面还有你的感受、期待和渴望。我们一起潜入水下看看？"',
      featureMapping: 'MindCare可设计"冰山探索"互动工具，帮助用户层层深入理解自己'
    }
  },

  // 家庭系统治疗
  familySystems: {
    name: '家庭系统治疗',
    founders: ['默里·鲍恩', '萨尔瓦多·米纽钦'],
    coreConcept: '个体问题不是孤立的，而是家庭系统互动的结果——改变系统才能改变个体',
    keyConcepts: [
      { concept: '三角化', desc: '当两人关系紧张时，拉入第三方来缓冲焦虑', example: '夫妻吵架时让孩子站队，或向朋友抱怨伴侣而非直接沟通', mindCareMapping: '当用户描述人际纠结时，检查是否存在三角化模式' },
      { concept: '自我分化', desc: '在情感连接中保持独立思考的能力', example: '能倾听家人意见但不被情绪裹挟，能表达不同观点但不断绝关系', mindCareMapping: '帮助用户区分"我的感受"和"他人的感受"' },
      { concept: '代际传递', desc: '家庭模式跨代重复——我们往往重复父母的关系模式', example: '父亲酗酒→儿子在压力下也倾向用物质逃避', mindCareMapping: '当用户说"我变成了我最不想成为的人"时，探索代际模式' },
      { concept: '家庭规则', desc: '不成文的家庭行为规范，影响每个成员', example: '"家里不许哭""不能说负面情绪""必须完美"', mindCareMapping: '帮助用户识别限制性的内在规则' }
    ],
    applicableIssues: ['家庭冲突', '代际创伤', '亲密关系模式', '角色困境'],
    mindCareApplication: {
      forChat: '当用户描述家庭或亲密关系问题时，用系统视角帮助理解',
      warmPhrase: '"你遇到的问题可能不只是你一个人的事，它和整个关系的互动方式有关。这不是你的错，但我们可以在你这一端做一些不同的选择。"',
      caution: '家庭系统治疗需要家庭成员参与，AI对话中主要用于帮助用户理解系统视角，而非替代家庭治疗'
    }
  }
};

export default psychologySchools;
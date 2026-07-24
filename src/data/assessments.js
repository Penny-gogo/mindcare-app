// 测评题目数据
const assessments = [
  {
    id: 'stress',
    title: '压力指数测评',
    subtitle: '了解你当前的压力水平',
    icon: '🌊',
    color: '#4a6cf7',
    type: 'keyword', // 关键词输入型
    description: '输入最近浮现在你脑海中的关键词，我们将分析你的压力状态',
    placeholder: '例如：加班、失眠、焦虑、疲惫...',
    analysisPrompt: 'keyword_stress',
  },
  {
    id: 'mood',
    title: '情绪色彩测评',
    subtitle: '用图片选择探索你的内心世界',
    icon: '🎨',
    color: '#6c5ce7',
    type: 'image', // 图片选择型
    description: '选择最吸引你的图片，发现你当下的情绪状态',
    questions: [
      {
        id: 1,
        question: '哪张图片最让你感到平静？',
        options: [
          { id: 'a', label: '宁静湖面', emoji: '🏔️', description: '平静的湖面倒映着雪山', tags: ['平静', '内省', '稳定'] },
          { id: 'b', label: '阳光森林', emoji: '🌲', description: '阳光穿过树叶洒落', tags: ['温暖', '希望', '活力'] },
          { id: 'c', label: '星空旷野', emoji: '🌌', description: '无垠星空下的旷野', tags: ['孤独', '深思', '自由'] },
          { id: 'd', label: '城市灯火', emoji: '🏙️', description: '繁华都市的万家灯火', tags: ['忙碌', '连接', '压力'] },
        ],
      },
      {
        id: 2,
        question: '哪张图片最能代表你现在的状态？',
        options: [
          { id: 'a', label: '奔跑的骏马', emoji: '🐎', description: '草原上自由奔跑', tags: ['自由', '释放', '渴望'] },
          { id: 'b', label: '蜷缩的猫', emoji: '🐱', description: '温暖角落里安静休息', tags: ['疲惫', '保护', '需要休息'] },
          { id: 'c', label: '破土新芽', emoji: '🌱', description: '从泥土中顽强生长', tags: ['坚韧', '成长', '压力中前行'] },
          { id: 'd', label: '飞舞蝴蝶', emoji: '🦋', description: '在花丛中轻盈飞舞', tags: ['轻松', '愉悦', '平衡'] },
        ],
      },
      {
        id: 3,
        question: '你最想走进哪个场景？',
        options: [
          { id: 'a', label: '海边日落', emoji: '🌅', description: '金色阳光洒满海面', tags: ['放松', '疗愈', '需要休息'] },
          { id: 'b', label: '山顶日出', emoji: '⛰️', description: '站在山顶迎接第一缕光', tags: ['挑战', '成就感', '积极'] },
          { id: 'c', label: '雨中咖啡馆', emoji: '☕', description: '窗外细雨窗内温暖', tags: ['独处', '思考', '情绪化'] },
          { id: 'd', label: '花园午后', emoji: '🌺', description: '午后阳光下的花园', tags: ['满足', '平静', '幸福'] },
        ],
      },
      {
        id: 4,
        question: '哪种自然现象最吸引你？',
        options: [
          { id: 'a', label: '绵绵细雨', emoji: '🌧️', description: '轻柔的雨丝飘落', tags: ['忧郁', '敏感', '内省'] },
          { id: 'b', label: '雷电交加', emoji: '⛈️', description: '猛烈的暴风雨', tags: ['压力', '爆发', '需要宣泄'] },
          { id: 'c', label: '彩虹横空', emoji: '🌈', description: '雨后绚丽的彩虹', tags: ['乐观', '希望', '韧性'] },
          { id: 'd', label: '微风拂面', emoji: '🍃', description: '温柔的风轻轻吹过', tags: ['平和', '舒适', '稳定'] },
        ],
      },
    ],
  },
  {
    id: 'personality',
    title: '职场性格探索',
    subtitle: '发现你的职场性格色彩',
    icon: '🧩',
    color: '#e17055',
    type: 'choice', // 文字选择型
    description: '通过情景选择，了解你的职场性格类型',
    questions: [
      {
        id: 1,
        question: '面对一个紧急项目，你的第一反应是？',
        options: [
          { id: 'a', text: '立即制定计划，分配任务', type: 'leader', label: '领导者' },
          { id: 'b', text: '先冷静分析，找到最优方案', type: 'thinker', label: '思考者' },
          { id: 'c', text: '和团队沟通，协调资源', type: 'connector', label: '连接者' },
          { id: 'd', text: '默默开始执行，用行动说话', type: 'doer', label: '行动者' },
        ],
      },
      {
        id: 2,
        question: '下班后最想做的事？',
        options: [
          { id: 'a', text: '复盘今天的工作', type: 'thinker', label: '思考者' },
          { id: 'b', text: '和朋友聚会聊天', type: 'connector', label: '连接者' },
          { id: 'c', text: '运动或户外活动', type: 'doer', label: '行动者' },
          { id: 'd', text: '独处看书或学习', type: 'leader', label: '领导者' },
        ],
      },
      {
        id: 3,
        question: '遇到与同事意见不合时，你会？',
        options: [
          { id: 'a', text: '用数据说服对方', type: 'thinker', label: '思考者' },
          { id: 'b', text: '寻找折中方案', type: 'connector', label: '连接者' },
          { id: 'c', text: '坚持自己的方案', type: 'leader', label: '领导者' },
          { id: 'd', text: '先试一下看效果', type: 'doer', label: '行动者' },
        ],
      },
      {
        id: 4,
        question: '你觉得工作中最重要的是？',
        options: [
          { id: 'a', text: '成长和学习的机会', type: 'leader', label: '领导者' },
          { id: 'b', text: '团队氛围和人际关系', type: 'connector', label: '连接者' },
          { id: 'c', text: '明确的目和成就感', type: 'doer', label: '行动者' },
          { id: 'd', text: '深度思考和创造性', type: 'thinker', label: '思考者' },
        ],
      },
    ],
    resultTypes: {
      leader: {
        title: '🦁 领导者型',
        description: '你天生具有领导力，善于统筹全局。在压力下你倾向于掌控局面，但要注意适时放权，给自己留出喘息空间。',
        advice: '建议：学会信任团队，适当分担压力，定期给自己"断联"时间。',
        color: '#e17055',
      },
      thinker: {
        title: '🦉 思考者型',
        description: '你善于深度思考和分析，追求完美方案。但过度思考可能加重心理负担，要学会"足够好即可"。',
        advice: '建议：设定决策时限，避免分析瘫痪，用行动代替过度思考。',
        color: '#4a6cf7',
      },
      connector: {
        title: '🦋 连接者型',
        description: '你重视人际关系，是团队的润滑剂。但要注意不要因过度照顾他人感受而忽略自己的需求。',
        advice: '建议：学会说"不"，给自己留出独处充电的时间，关注自身情绪。',
        color: '#6c5ce7',
      },
      doer: {
        title: '🐎 行动者型',
        description: '你执行力强，用行动说话。但持续高强度行动容易导致身心疲惫，要学会停下来倾听内心。',
        advice: '建议：定期停下来检查自己的状态，不要用忙碌逃避情绪。',
        color: '#00b894',
      },
    },
  },
  {
    id: 'rest',
    title: '休息需求测评',
    subtitle: '你该好好休息了吗？',
    icon: '😴',
    color: '#00b894',
    type: 'quiz', // 问答型
    description: '回答几个简单问题，看看你是否需要给自己放个假',
    questions: [
      {
        id: 1,
        question: '最近一周，你的睡眠质量如何？',
        options: [
          { id: 'a', text: '很好，一觉到天亮', score: 0 },
          { id: 'b', text: '还行，偶尔失眠', score: 1 },
          { id: 'c', text: '经常难以入睡或早醒', score: 2 },
          { id: 'd', text: '几乎每晚都睡不好', score: 3 },
        ],
      },
      {
        id: 2,
        question: '你对工作的热情程度？',
        options: [
          { id: 'a', text: '充满干劲', score: 0 },
          { id: 'b', text: '还行，正常完成', score: 1 },
          { id: 'c', text: '经常感到倦怠', score: 2 },
          { id: 'd', text: '完全提不起劲', score: 3 },
        ],
      },
      {
        id: 3,
        question: '最近是否经常感到身体不适？',
        options: [
          { id: 'a', text: '没有，身体状态很好', score: 0 },
          { id: 'b', text: '偶尔头痛或肩颈酸痛', score: 1 },
          { id: 'c', text: '经常感到各种不适', score: 2 },
          { id: 'd', text: '身体频繁出问题', score: 3 },
        ],
      },
      {
        id: 4,
        question: '你的情绪状态如何？',
        options: [
          { id: 'a', text: '平稳愉快', score: 0 },
          { id: 'b', text: '偶尔烦躁', score: 1 },
          { id: 'c', text: '经常焦虑或低落', score: 2 },
          { id: 'd', text: '情绪波动很大', score: 3 },
        ],
      },
      {
        id: 5,
        question: '你有多久没有做自己喜欢的事了？',
        options: [
          { id: 'a', text: '最近刚做过', score: 0 },
          { id: 'b', text: '一两周了', score: 1 },
          { id: 'c', text: '一个月以上', score: 2 },
          { id: 'd', text: '想不起来了', score: 3 },
        ],
      },
    ],
    results: [
      {
        minScore: 0,
        maxScore: 3,
        level: 'good',
        title: '状态良好 🌟',
        description: '你目前的身心状态不错！继续保持良好的生活节奏，也别忘了定期给自己充电。',
        suggestions: ['保持规律作息', '继续坚持运动', '偶尔犒劳自己'],
        color: '#00b894',
      },
      {
        minScore: 4,
        maxScore: 7,
        level: 'attention',
        title: '需要关注 ⚠️',
        description: '你的一些信号提示需要开始关注自己的状态了。适当调整节奏，给自己一些缓冲空间。',
        suggestions: ['调整工作节奏', '保证充足睡眠', '尝试冥想或深呼吸', '和朋友聊聊天'],
        color: '#f59e0b',
      },
      {
        minScore: 8,
        maxScore: 10,
        level: 'warning',
        title: '需要休息 🔴',
        description: '你的身心正在发出强烈的休息信号！请认真对待，及时调整，必要时寻求专业帮助。',
        suggestions: ['尽快安排休息时间', '与主管沟通工作负荷', '考虑寻求EAP专业支持', '关注身体健康'],
        color: '#e74c3c',
      },
      {
        minScore: 11,
        maxScore: 15,
        level: 'urgent',
        title: '亟需调整 🚨',
        description: '你正处于高压力状态，身体和情绪都在发出警报。请立即采取措施，你不必独自承受。',
        suggestions: ['立即安排休息或请假', '联系EAP专业咨询师', '与信任的人倾诉', '关注身体症状必要时就医'],
        color: '#c0392b',
      },
    ],
  },
];

export default assessments;

// 关键词压力分析映射
export const keywordStressMap = {
  // 高压力关键词
  high: {
    keywords: ['加班', '失眠', '焦虑', '疲惫', '崩溃', '压力', '烦躁', '头痛', '无力', '迷茫', '倦怠', '透支', '窒息', '压抑', '崩溃', '绝望', '抑郁', '恐慌', '想哭', '受不了'],
    analysis: {
      level: 'high',
      title: '压力指数较高 🔴',
      description: '从你输入的关键词来看，你目前正承受着较大的压力。这很正常，但请不要忽视这些信号。',
      suggestions: [
        '建议与EAP咨询师聊聊，专业的支持可以帮助你',
        '尝试每天给自己15分钟的"什么都不做"时间',
        '规律运动，哪怕只是散步10分钟',
        '与信任的朋友或家人倾诉',
        '如果持续感到不适，请及时寻求专业帮助',
      ],
    },
  },
  // 中等压力关键词
  medium: {
    keywords: ['忙碌', '紧张', '担心', '累', '烦', '赶', 'deadline', '考核', 'KPI', '开会', '加班', '出差', '应酬', '赶项目', '没时间'],
    analysis: {
      level: 'medium',
      title: '压力指数中等 🟡',
      description: '你似乎正在经历一些日常压力，这在工作中很常见。注意调节节奏，避免压力持续累积。',
      suggestions: [
        '合理安排工作优先级，学会说"稍后"',
        '每天保证7-8小时睡眠',
        '工作间隙做5分钟深呼吸',
        '周末尽量放下工作，给自己充电',
        '培养一个放松的爱好',
      ],
    },
  },
  // 低压力/积极关键词
  low: {
    keywords: ['开心', '轻松', '充实', '期待', '成长', '平衡', '满足', '幸福', '感恩', '自由', '旅行', '运动', '阅读', '音乐', '美食', '朋友', '家人', '阳光'],
    analysis: {
      level: 'low',
      title: '状态不错 🌟',
      description: '从你的关键词来看，你目前的状态比较积极。继续保持，也别忘了关注身边可能需要帮助的同事。',
      suggestions: [
        '保持当前的良好状态',
        '可以尝试帮助身边压力大的同事',
        '持续关注自己的身心变化',
        '定期做自我检查',
      ],
    },
  },
};

// 树洞预设标签
export const treeHoleTags = [
  '工作压力', '人际关系', '职业发展', '情绪管理',
  '工作生活平衡', '家庭关系', '自我成长', '团队协作',
  '领导力', '沟通技巧', '时间管理', '心理健康',
];
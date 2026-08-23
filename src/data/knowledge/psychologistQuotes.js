// lastUpdated: 2026-08-23
// MindCare EAP知识库 - 模块十三：心理学家名人名言
// 来源：心理学史经典著作、APA获奖者演讲、中国心理学会推荐
// 价值：为MindCare提供权威引用和温暖寄语，增强内容专业性和感染力

const psychologistQuotes = {
  overview: {
    description: '精选20+位心理学大师的经典名言，每位配备核心贡献、EAP应用启示和温暖解读',
    usageNote: '名言可用于：首页每日寄语、AI对话中的权威引用、测评结果页的鼓励语、树洞中的温暖回应'
  },

  // 西格蒙德·弗洛伊德
  freud: {
    name: '西格蒙德·弗洛伊德',
    title: '精神分析学派创始人',
    lifespan: '1856-1939',
    coreContribution: '发现无意识对人类行为的深远影响，开创精神分析疗法',
    quotes: [
      { text: '未被表达的情绪永远不会消失，它们只是被活埋了，终将以更丑陋的方式浮现', scenario: '用户压抑情绪时', warmReading: '你的情绪值得被看见，不需要把它们藏起来' },
      { text: '梦是通往无意识的皇家大道', scenario: '用户提到梦境时', warmReading: '梦境可能是内心在和你说话' },
      { text: '大多数人的理性思考不过是给非理性决定找的合理化借口', scenario: '用户反复为某个决定纠结时', warmReading: '有时候我们的选择来自内心深处，不需要全部用理性解释' }
    ],
    eapImplication: 'EAP咨询中关注员工的深层情感需求，而非只看表面问题'
  },

  // 卡尔·罗杰斯
  rogers: {
    name: '卡尔·罗杰斯',
    title: '人本主义心理学创始人',
    lifespan: '1902-1987',
    coreContribution: '创立以人为中心疗法，提出无条件积极关注、共情、真诚三大核心条件',
    quotes: [
      { text: '这是一个有趣的事实——当我接受自己原本的样子时，我就能改变', scenario: '用户自我否定时', warmReading: '改变不是从否定自己开始的，而是从接纳自己开始的' },
      { text: '人们最深刻的需求是被倾听——真正地被倾听', scenario: '用户需要倾诉时', warmReading: '我在这里，认真听你说' },
      { text: '好笑的是，当我不再试图成为我不是的人时，我反而成为了我一直想成为的人', scenario: '用户追求完美时', warmReading: '你不需要成为别人，做真实的自己就已经很好' }
    ],
    eapImplication: 'EAP咨询的核心态度——无条件接纳是改变的前提'
  },

  // 维克多·弗兰克尔
  frankl: {
    name: '维克多·弗兰克尔',
    title: '意义疗法创始人',
    lifespan: '1905-1997',
    coreContribution: '在纳粹集中营中创立意义疗法，提出"寻找意义"是人类最根本的驱动力',
    quotes: [
      { text: '在刺激与反应之间，有一个空间。在那个空间里，我们有选择自己反应的自由和力量', scenario: '用户感到无力时', warmReading: '即使情况无法改变，你仍然有选择如何回应的自由' },
      { text: '人可以被夺走一切，除了一样东西——人类最后的自由：在任何给定环境中选择自己的态度', scenario: '用户面临困境时', warmReading: '你的态度，是你最后的自由' },
      { text: '活着就是受苦，生存就是在苦难中寻找意义', scenario: '用户追问人生意义时', warmReading: '苦难本身不是意义，但你在苦难中的选择可以成为意义' }
    ],
    eapImplication: 'EAP帮助员工在职场困境中找到意义感，这是心理韧性的核心'
  },

  // 乔·卡巴金
  kabatZinn: {
    name: '乔·卡巴金',
    title: '正念减压疗法（MBSR）创始人',
    lifespan: '1944-',
    coreContribution: '将东方正念冥想与西方科学结合，创立MBSR，推动正念进入主流医学',
    quotes: [
      { text: '你无法平息海浪，但你可以学会冲浪', scenario: '用户试图消除焦虑时', warmReading: '不需要让焦虑消失，学会和它共处就好' },
      { text: '当下是你所拥有的全部，也是你所能成为的全部', scenario: '用户焦虑未来时', warmReading: '把注意力带回此刻，这一刻你是安全的' },
      { text: '正念不是要让你的头脑安静下来，而是要你与头脑的吵闹和平共处', scenario: '用户冥想时分心时', warmReading: '走神不是失败，注意到走神本身就是正念' }
    ],
    eapImplication: 'MBSR是EAP中最具循证基础的减压方法，8周课程可显著降低压力水平'
  },

  // 亚伦·贝克
  beck: {
    name: '亚伦·贝克',
    title: '认知行为疗法（CBT）创始人',
    lifespan: '1921-2021',
    coreContribution: '创立认知疗法，发现认知扭曲是情绪障碍的核心，开发认知重构技术',
    quotes: [
      { text: '不是事情本身困扰我们，而是我们对事情的看法', scenario: '用户陷入负面思维时', warmReading: '换个角度看，也许事情没有你想的那么糟糕' },
      { text: '如果你不能改变环境，你可以改变你对环境的反应', scenario: '用户感到环境无法改变时', warmReading: '环境可能暂时无法改变，但你的内心力量比你以为的大' }
    ],
    eapImplication: 'CBT是EAP中最广泛使用的循证疗法，对焦虑、抑郁效果显著'
  },

  // 阿尔伯特·埃利斯
  ellis: {
    name: '阿尔伯特·埃利斯',
    title: '理性情绪行为疗法（REBT）创始人',
    lifespan: '1913-2007',
    coreContribution: '提出ABC理论——不是事件(A)导致后果(C)，而是信念(B)导致后果(C)',
    quotes: [
      { text: '世界上最糟糕的事不是发生不好的事，而是你坚信它不应该发生', scenario: '用户抗拒现实时', warmReading: '接受已经发生的事，不是认输，而是给自己一个新的起点' },
      { text: '你不需要被别人喜欢，你只需要接受你自己', scenario: '用户在意他人评价时', warmReading: '你的价值不由别人的看法决定' }
    ],
    eapImplication: 'REBT的ABC模型是EAP咨询中最实用的自助工具之一'
  },

  // 维吉尼亚·萨提亚
  satir: {
    name: '维吉尼亚·萨提亚',
    title: '萨提亚转化式系统治疗创始人',
    lifespan: '1916-1988',
    coreContribution: '关注家庭系统对个人的影响，提出自我价值是心理健康的基石',
    quotes: [
      { text: '问题本身不是问题，如何应对才是问题', scenario: '用户被问题压倒时', warmReading: '重要的不是遇到了什么，而是你选择怎么面对' },
      { text: '我们每天需要4个拥抱来生存，8个拥抱来维持，12个拥抱来成长', scenario: '用户感到孤独时', warmReading: '连接是人的基本需要，寻求温暖是正常的' },
      { text: '改变总是可能的，即使改变很小', scenario: '用户觉得无法改变时', warmReading: '不需要一步到位，一小步也是改变' }
    ],
    eapImplication: 'EAP关注员工的自我价值感和人际互动模式'
  },

  // 亚伯拉罕·马斯洛
  maslow: {
    name: '亚伯拉罕·马斯洛',
    title: '人本主义心理学先驱，需求层次理论创始人',
    lifespan: '1908-1970',
    coreContribution: '提出需求层次理论和自我实现概念，开创积极心理学方向',
    quotes: [
      { text: '如果你唯一拥有的工具是锤子，你就会把所有问题都看成钉子', scenario: '用户反复用同一方法解决问题时', warmReading: '也许可以试试不同的方法，你拥有的工具比你以为的多' },
      { text: '一个人能成为什么，就必须成为什么', scenario: '用户感到迷茫时', warmReading: '你内心有一种力量，在推动你成为真正的自己' }
    ],
    eapImplication: 'EAP不仅解决问题，更要帮助员工实现自我成长'
  },

  // 埃里希·弗洛姆
  fromm: {
    name: '埃里希·弗洛姆',
    title: '人本主义精神分析学家',
    lifespan: '1900-1980',
    coreContribution: '将精神分析与社会批判结合，探讨现代人的自由、孤独与爱',
    quotes: [
      { text: '人最大的需要是克服孤独感，找到与世界的连接', scenario: '用户感到孤独时', warmReading: '孤独是人类的共同体验，寻求连接是勇敢的' },
      { text: '爱不是一种感觉，而是一种实践——一种主动的选择', scenario: '用户困惑于关系时', warmReading: '爱是每天的选择，而不仅仅是偶然的心动' }
    ],
    eapImplication: 'EAP关注员工的归属感和人际连接需求'
  },

  // 玛莎·莱恩汉
  linehan: {
    name: '玛莎·莱恩汉',
    title: '辩证行为疗法（DBT）创始人',
    lifespan: '1943-',
    coreContribution: '创立DBT，将接纳与改变的辩证平衡应用于情绪失调治疗',
    quotes: [
      { text: '我需要改变，同时也需要接纳自己本来的样子', scenario: '用户纠结于改变与接纳时', warmReading: '你可以同时接纳现在的自己，也朝着想成为的自己努力' },
      { text: '痛苦是不可避免的，但痛苦上加痛苦是可以避免的', scenario: '用户情绪痛苦加剧时', warmReading: '痛苦本身很难避免，但我们可以不再因为痛苦而责备自己' }
    ],
    eapImplication: 'DBT是EAP中处理情绪失调最有效的方法之一'
  },

  // 丹尼尔·戈尔曼
  goleman: {
    name: '丹尼尔·戈尔曼',
    title: '情商理论推广者',
    lifespan: '1946-',
    coreContribution: '将情商概念带入主流视野，提出情商比智商更重要',
    quotes: [
      { text: '如果你的情绪不能为你所用，它们就会控制你', scenario: '用户情绪失控时', warmReading: '情绪不是敌人，学会和它合作' },
      { text: '真正的共情不仅是理解他人的感受，更是能够以有益的方式回应', scenario: '用户需要共情支持时', warmReading: '理解你的感受，也愿意陪你一起面对' }
    ],
    eapImplication: 'EAP培训中情商提升是核心模块'
  },

  // 中国心理学家
  chinesePsychologists: [
    {
      name: '陈仲庚',
      title: '中国临床心理学奠基人',
      contribution: '建立中国第一个临床心理学机构，推动心理测评标准化',
      quote: '心理学的终极目标不是治病，而是帮助人成为更好的自己',
      eapImplication: 'EAP应超越问题解决，关注员工成长'
    },
    {
      name: '张厚粲',
      title: '中国心理测量学泰斗',
      contribution: '推动中国心理测量学发展，培养大批心理学人才',
      quote: '测评不是给人贴标签，而是帮助人更准确地认识自己',
      eapImplication: 'EAP心理测评应服务于自我认知，而非筛选淘汰'
    },
    {
      name: '樊富珉',
      title: '中国团体心理咨询领军人物',
      contribution: '将团体咨询引入中国，开创企业EAP团体辅导模式',
      quote: '团体是一面镜子，在别人的故事里看见自己，在自己的成长里照亮他人',
      eapImplication: 'EAP团体辅导是企业心理健康服务的高效形式'
    }
  ],

  // 每日寄语精选（用于首页轮播）
  dailyQuotes: [
    { quote: '你不需要等到不害怕了才开始行动，勇气就是带着恐惧前行', author: '纳尔逊·曼德拉', category: '勇气' },
    { quote: '最深的黑暗往往出现在黎明之前', author: '谚语', category: '希望' },
    { quote: '温柔对待自己，你正在做一件很难的事——做一个人类', author: '佚名', category: '自我关怀' },
    { quote: '成长不是变得完美，而是变得真实', author: '卡尔·罗杰斯', category: '成长' },
    { quote: '你今天的挣扎，是明天力量的种子', author: '佚名', category: '韧性' },
    { quote: '允许自己慢下来，不是放弃，是为了走更远的路', author: '佚名', category: '节奏' },
    { quote: '每一个你无法入眠的夜晚，都值得被温柔以待', author: 'MindCare', category: '关怀' },
    { quote: '寻求帮助不是软弱，而是对自己负责的勇敢选择', author: '简单心理', category: '求助' },
    { quote: '你不是你的焦虑，你是那个在焦虑中仍然坚持的人', author: 'MindCare', category: '接纳' },
    { quote: '改变不需要翻天覆地，一小步就够了', author: '焦点解决治疗', category: '改变' },
    { quote: '情绪是信使，不是敌人——它在告诉你一些重要的事', author: 'DBT', category: '情绪' },
    { quote: '在刺激与反应之间，有一个空间——那是你选择的力量', author: '维克多·弗兰克尔', category: '选择' },
    { quote: '你不是问题，问题才是问题', author: '叙事治疗', category: '外化' },
    { quote: '你无法平息海浪，但你可以学会冲浪', author: '乔·卡巴金', category: '正念' },
    { quote: '活着本身就是一种勇气', author: '维克多·弗兰克尔', category: '生命' }
  ]
};

export default psychologistQuotes;
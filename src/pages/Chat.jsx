import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import knowledgeBase from '../data/knowledgeBase';
import './Chat.css';

const AI_NAME = '小暖';
const AI_AVATAR = '🤗';

const moodOptions = [
  { emoji: '😊', label: '开心', level: 'good' },
  { emoji: '😌', label: '平静', level: 'good' },
  { emoji: '😔', label: '低落', level: 'low' },
  { emoji: '😰', label: '焦虑', level: 'anxious' },
  { emoji: '😤', label: '烦躁', level: 'stressed' },
  { emoji: '😴', label: '疲惫', level: 'tired' },
];

const quickTopics = [
  { icon: '💼', text: '工作压力', keywords: ['压力', '工作', '加班', '任务', 'deadline'] },
  { icon: '👥', text: '人际关系', keywords: ['同事', '领导', '沟通', '冲突', '团队'] },
  { icon: '😰', text: '焦虑不安', keywords: ['焦虑', '不安', '担心', '紧张', '恐惧'] },
  { icon: '😴', text: '睡眠问题', keywords: ['失眠', '睡不着', '早醒', '噩梦', '睡眠'] },
  { icon: '💔', text: '情绪低落', keywords: ['低落', '难过', '沮丧', '无助', '空虚'] },
  { icon: '🔥', text: '职业倦怠', keywords: ['倦怠', '没动力', '迷茫', '瓶颈', '想辞职'] },
];

// 危机关键词检测（基于知识库危机干预模块）
const crisisKeywords = ['自杀', '不想活', '活不下去', '想死', '结束生命', '自残', '伤害自己', '跳楼', '吃药死', '割腕'];
function detectCrisis(msg) {
  return crisisKeywords.some(kw => msg.includes(kw));
}
function getCrisisResponse() {
  return '我听到你了，你现在一定承受着巨大的痛苦。你的感受是真实的，你的生命是重要的。\n\n请现在拨打以下热线，会有专业的人陪伴你：\n📞 全国心理援助热线：400-161-9995（24小时）\n📞 北京回龙观医院危机干预：010-82951332\n\n你不是一个人，请给自己一个机会，让专业的人帮助你。';
}

// 基于知识库的智能回复系统（专业判断+温暖表达双层架构）
const responsePatterns = [
  {
    keywords: ['压力', '工作压力', '压力大', '压得喘不过气'],
    responses: [
      '我听到你了，工作压力确实让人喘不过气来。能跟我说说，最近是什么事情让你感觉压力特别大吗？\n\n💡 试试CBT的「认知三角」：当你感到压力时，注意自己的想法→情绪→身体反应，看看是不是某个想法在放大压力感。',
      '承受这么大的压力一定很辛苦。心理学研究发现，压力本身不一定会伤害我们，但「觉得压力有害」这个想法会。试试重新看待压力：它说明你在乎你做的事情。\n\n🧘 4-7-8呼吸法：吸气4秒→屏住7秒→缓缓呼出8秒，重复3次，帮助身体从「战斗模式」切换到「休息模式」。',
      '工作压力是很多人都会面对的挑战，你并不孤单。EAP的研究显示，及时寻求支持的人，压力缓解速度比独自承担快40%。\n\n让我们一起来看看，有没有什么方法可以帮你减轻一些负担？'
    ]
  },
  {
    keywords: ['焦虑', '不安', '担心', '紧张', '害怕'],
    responses: [
      '焦虑的感觉真的很不好受，那种心跳加速、思绪纷乱的状态我理解。你现在最担心的是什么呢？\n\n🧘 正念呼吸：把注意力放在呼吸上，不试图改变它，只是观察。当思绪飘走时，温柔地把注意力带回呼吸——这就是正念的核心练习。',
      '当焦虑来袭时，试试CBT的「思维记录法」：写下你担心的具体事情→评估它发生的可能性→想想最坏的结果→再想想最可能的结果。你会发现，焦虑往往放大了风险。\n\n💡 4-7-8呼吸法：吸气4秒→屏住4秒→缓缓呼出6秒，重复几次，看看身体的感觉有没有变化。',
      '你的焦虑感是真实的，不需要否定它。认知行为疗法告诉我们：焦虑不是你的敌人，它在试图保护你，只是有时候「警报」响得太响了。\n\n让我们一起看看，你担心的事情中，有哪些是真正可能发生的，哪些是焦虑在放大呢？'
    ]
  },
  {
    keywords: ['加班', '996', '熬夜', '忙', '没时间'],
    responses: [
      '长时间加班真的会透支身心。职业心理学研究发现，超过50小时/周的工作时长，每增加1小时，生产力反而下降。你最近的工作节奏是怎样的？\n\n💡 试试「微休息」：每90分钟给自己5分钟的完全休息——站起来走走、看看窗外、做几次深呼吸。这些小小的停顿能显著恢复你的注意力。',
      '我理解工作忙碌时的无奈感。但请记住，你的健康永远是第一位的。EAP的标准流程中，识别压力源是第一步——有没有可能和领导沟通一下调整工作安排？\n\n🧘 身体扫描法：闭上眼睛，从脚趾到头顶，逐一感受每个部位的状态。这只需要3分钟，但能有效缓解身体的紧绷感。',
      '忙碌到没有自己的时间，这种感受确实很压抑。职场心理学有个概念叫「边界管理」——试着在工作和生活之间划出明确的界限，哪怕只是「下班后不看工作消息」这一条。'
    ]
  },
  {
    keywords: ['同事', '领导', '人际关系', '冲突', '沟通'],
    responses: [
      '职场人际关系确实复杂。能具体说说，是什么情况让你感到困扰吗？\n\n💡 NVC非暴力沟通四步法：观察→感受→需要→请求。比如：「当会议被打断时（观察），我感到沮丧（感受），因为我需要被尊重（需要），你能否让我说完再回应？（请求）」',
      '和同事或领导之间的摩擦很常见，但确实很消耗精力。你觉得问题的核心在哪里呢？\n\n职场情绪管理有个STOP技术：S-停下来→T-深呼吸→O-观察自己的情绪→P-有意识地选择回应方式，而不是自动反应。',
      '在处理职场关系时，保护自己的边界很重要。你有没有尝试过用「我感受」的方式表达自己的需求？\n\n比如「当...的时候，我感到...」这样的句式，比指责对方更容易被接受，也更能保护你的感受。'
    ]
  },
  {
    keywords: ['失眠', '睡不着', '睡眠', '早醒', '多梦'],
    responses: [
      '睡眠问题往往和日间的压力有关。MBSR正念减压疗法建议建立「睡前仪式」：固定时间放下手机→做10分钟身体扫描→用4-7-8呼吸法放松。\n\n💡 睡不着时不要强迫自己入睡，那样反而更焦虑。可以起来做点轻松的事情，等有了困意再回到床上。',
      '睡不着的时候，试试正念身体扫描：闭上眼睛，从脚趾开始，逐一感受每个部位——不试图放松，只是观察。很多人在做身体扫描的过程中就自然入睡了。\n\n如果这种情况持续超过两周，建议你可以考虑和专业人士聊聊，这不是软弱，而是对自己负责。',
      '长期的睡眠问题值得关注。CBT-I（失眠认知行为疗法）是治疗失眠的一线推荐方法，效果比安眠药更持久。\n\n💡 一个简单技巧：设定固定的起床时间（包括周末），这比固定入睡时间更能调节生物钟。'
    ]
  },
  {
    keywords: ['倦怠', '没动力', '迷茫', '想辞职', '职业'],
    responses: [
      '职业倦怠是很真实的状态，心理学上它有三个维度：情绪耗竭、去人性化、成就感降低。你觉得是哪个维度最困扰你？\n\n💡 试试「价值观澄清」：写下工作中对你最重要的3件事，看看当前的工作在多大程度上满足了它们。这能帮你理清：是工作本身的问题，还是你和工作之间的关系需要调整。',
      '失去动力的感觉确实让人沮丧。SFBT焦点解决短期治疗有个「奇迹提问」：如果今晚你睡着后奇迹发生，所有问题都解决了，明天醒来的你会是什么样的？\n\n这个想象能帮你发现，你真正想要的是什么——有时候不是「想辞职」，而是「想要被看见」或「想要成长」。',
      '想辞职的念头出现了，说明你内心已经有了变化的需求。在做决定之前，不妨先理清：是现在的工作不适合你，还是你暂时需要休息？\n\n💡 职业倦怠的5步自我疏导：①识别情绪→②调整认知→③行为放松→④寻求支持→⑤专业求助。你现在在第几步？'
    ]
  },
  {
    keywords: ['难过', '低落', '沮丧', '想哭', '不开心'],
    responses: [
      '允许自己难过，这没什么不好。情绪就像天气，阴天也会过去。你现在最需要的是什么？有人倾听，还是一些安慰？\n\n💡 CBT提醒我们：情绪本身没有对错，但我们可以选择如何回应它。试着对自说「我现在很难过，这很正常」，而不是「我不应该难过」。',
      '低落的时候，不要勉强自己振作。给自己一些时间和空间，做一件让自己舒服的小事，哪怕只是喝一杯热巧克力。\n\n🧘 5-4-3-2-1接地练习：说出5个看到的→4个摸到的→3个听到的→2个闻到的→1个尝到的，帮助自己回到当下。',
      '我在这陪着你。如果你想说说发生了什么，我愿意倾听；如果你只是需要有人在这里，我也愿意安静地陪着你。\n\n记住华东师大心理中心说的那句话：「每个人的痛苦都值得被看见，无关痛苦的命名。」你的感受是重要的。'
    ]
  },
  {
    keywords: ['孤独', '没人理解', '一个人', '孤立'],
    responses: [
      '感到孤独是很痛苦的体验。但请记住，寻求帮助本身就是一种力量，你现在和我聊天，就是在照顾自己。\n\n壹心理的研究发现，75%的咨询者在首次咨询后就有明显改善——有时候，只是被倾听就能带来巨大的改变。',
      '有时候身边虽然有人，但还是觉得没人真正理解自己。这种感觉我懂。你愿意和我说说，什么样的事情让你觉得不被理解吗？\n\n💡 试试「情绪日记」：每天花5分钟写下今天的情绪和触发事件。这不仅能帮你理清思绪，也能让你在寻求帮助时更清楚地表达自己。',
      '你不是一个人在面对这些。EAP就是为了让员工知道，有人在乎你的感受，有人愿意倾听。\n\n北师大有个「雪绒花」朋辈互助项目，核心理念是：有时候我们不需要专家，只需要一个愿意倾听的人。MindCare的树洞也是这样的存在。'
    ]
  },
  {
    keywords: ['完美主义', '完美', '不够好', '做不到最好'],
    responses: [
      '追求卓越是好事，但当「不够完美」让你焦虑时，它可能变成了负担。华东师大的研究发现：健康追求卓越和病态完美主义的关键区别，在于你是否能接纳不完美。\n\n💡 试试这个认知重构：把「我必须做到完美」换成「我会尽力做好，但不完美也是可以的」。仅仅是这个转换，就能减轻很多压力。',
      '完美主义往往源于一个信念：「只有完美才值得被爱/被认可」。但这个信念本身就不完美——因为没有人是完美的。\n\nCBT告诉我们：挑战这个信念的方式不是放弃追求，而是在「做得好」和「照顾自己」之间找到平衡。'
    ]
  },
  {
    keywords: ['拖延', '拖延症', '不想做', '启动不了'],
    responses: [
      '华东师大的研究发现：拖延不是时间管理问题，而是情绪调节问题。我们拖延，往往是因为任务引发了负面情绪（焦虑、无聊、恐惧失败）。\n\n💡 试试「5分钟启动法」：告诉自己只做5分钟。大多数时候，一旦开始了，就会继续下去。因为启动的阻力远大于持续的阻力。',
      '拖延的时候，你可能会自责「我怎么又拖延了」。但自责只会让情绪更差，进而拖延更严重——这是一个恶性循环。\n\n试试对自己说：「我注意到自己在拖延，这很正常。让我看看，这个任务让我不舒服的地方是什么？」——从自责转向好奇，就能打破循环。'
    ]
  }
];

// 通用关怀回复（融入温暖话术模板）
const generalResponses = [
  '谢谢你的分享。能告诉我更多吗？我想更好地理解你的感受。',
  '我听到了你说的话。这种感受是很真实的，你愿意继续说说吗？',
  '你能够表达出这些，说明你对自己有很好的觉察。让我们一起来看看，有什么可以帮助你的。',
  '每个人都有需要倾诉的时候，这很正常。我在这里，随时愿意听你说。',
  '你的感受值得被认真对待。让我们一起探索，怎么让你感觉好一些。',
  '谢谢你信任我，和我分享这些。你觉得现在最困扰你的是什么？',
  '我理解这可能不容易说出口。不用急，按照你的节奏来就好。',
  '你说的话我都记在心里了。不管是什么感受，在这里都是被允许的。',
  '有时候生活确实会让人喘不过气。你不是一个人在面对，我在这里陪着你。'
];

// 开场回复（根据心情，融入温暖话术模板）
const moodResponses = {
  good: [
    '很高兴你现在的状态不错！😊 不过，如果有什么想聊的，随时可以和我说。正念减压疗法告诉我们：好的状态也值得被珍惜和维护。',
    '看到你心情不错真好！你知道吗，积极心理学研究发现，主动关注和记录美好时刻，能让幸福感持续更久。有什么我可以帮你的吗？'
  ],
  low: [
    '我理解你现在心情不太好。没关系的，允许自己有低落的时候。CBT告诉我们：情绪本身没有对错，你可以对自己说「我现在很难过，这很正常」。\n\n你想和我说说是什么让你感到低落吗？',
    '低落的时候，最重要的是不要独自承受。我在这里陪你，你可以慢慢告诉我发生了什么。\n\n🧘 如果现在不想说太多，试试5-4-3-2-1接地练习：说出5个看到的、4个摸到的、3个听到的——这能帮你回到当下。'
  ],
  anxious: [
    '焦虑的感觉确实很不舒服。不过你现在已经迈出了第一步——愿意说出来。\n\n🧘 试试4-7-8呼吸法：吸气4秒→屏住7秒→缓缓呼出8秒，重复3次。这是最快速的自主神经系统调节方法。\n\n然后告诉我，你现在最担心的是什么？',
    '我理解焦虑的感觉，那种不安和紧张真的很难受。认知行为疗法告诉我们：焦虑不是你的敌人，它在试图保护你，只是有时候「警报」响得太响了。\n\n让我们一起看看，怎么把警报调到合适的音量。'
  ],
  stressed: [
    '烦躁的时候，先让自己停下来。你不需要一个人扛着所有的事情。\n\n💡 试试STOP技术：S-停下来→T-深呼吸→O-观察自己的情绪→P-有意识地选择回应方式。和我说说，是什么让你感到烦躁？',
    '我听到了你的烦躁。这种情绪很正常，说明有些事情触碰到了你的底线。\n\n职场情绪管理研究发现：命名情绪本身就能降低其强度。试试对自己说「我现在感到烦躁，因为……」——仅仅是说出来，就会好一些。'
  ],
  tired: [
    '疲惫是身体在告诉你需要休息了。职业倦怠研究显示，持续的疲惫感是情绪耗竭的早期信号。\n\n你最近是不是一直在超负荷运转？让我了解一下你的情况，看看怎么帮你调整一下。',
    '持续的疲惫感值得重视。MBSR正念减压疗法建议：每天给自己3分钟的「无任务时间」——不做事、不看手机、只是呼吸。\n\n你最近的工作和生活节奏是怎样的？有时候，小小的调整就能带来很大的改善。'
  ]
};

// 关怀建议（融合知识库自助技巧体系）
const selfCareTips = [
  '💡 【正念呼吸】试试把注意力放在呼吸上，不试图改变它，只是观察。当思绪飘走时，温柔地把注意力带回呼吸——这就是MBSR的核心练习。',
  '💡 【5-4-3-2-1接地法】说出5个看到的、4个摸到的、3个听到的、2个闻到的、1个尝到的，帮助自己从焦虑中回到当下。',
  '💡 【担忧时间】给自己设一个"担忧时间"——每天固定15分钟专门用来担忧，其他时间提醒自己"等到担忧时间再想"。这是CBT的经典技巧。',
  '💡 【情绪日记】试试每天花5分钟写下今天的情绪和触发事件。CBT研究发现，写日记本身就能降低20-30%的焦虑水平。',
  '💡 【4-7-8呼吸法】吸气4秒→屏住7秒→缓缓呼出8秒，重复3次。这是最快速的自主神经系统调节方法之一。',
  '💡 【身体扫描】闭上眼睛，从脚趾到头顶，逐一感受每个部位的状态。MBSR研究发现，3分钟身体扫描的效果相当于30分钟小憩。',
  '💡 【认知重构】当你发现自己在想"我总是搞砸"时，试试改成"我这次没做好，但不代表我总是这样"。这就是CBT的「认知三角」练习。',
  '💡 【微休息】每90分钟给自己5分钟的完全休息——站起来走走、看看窗外、做几次深呼吸。职场心理学研究证实这能显著恢复注意力。',
  '💡 【STOP技术】S-停下来→T-深呼吸→O-观察自己的情绪→P-有意识地选择回应方式。这是职场情绪管理的核心技巧。',
  '💡 【运动抗焦虑】哪怕只是10分钟的散步，也能明显改善情绪。运动是最天然的「抗焦虑药」，效果不输药物。'
];

function getAIResponse(userMessage, mood, messageCount) {
  const msg = userMessage.toLowerCase();

  // 优先检测危机关键词
  if (detectCrisis(msg)) {
    return getCrisisResponse();
  }

  // 检查关键词匹配
  for (const pattern of responsePatterns) {
    if (pattern.keywords.some(kw => msg.includes(kw))) {
      const responses = pattern.responses;
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  // 如果是简短回复，鼓励展开
  if (msg.length <= 5) {
    const shortReplies = [
      '嗯，我在听。能多说一些吗？',
      '我理解。你想表达的是什么呢？',
      '谢谢你的回应。能告诉我更多细节吗？',
      '我在。不用急，慢慢说。'
    ];
    return shortReplies[Math.floor(Math.random() * shortReplies.length)];
  }

  // 通用回复
  return generalResponses[Math.floor(Math.random() * generalResponses.length)];
}

function formatTime(date) {
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
}

export default function Chat() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mood, setMood] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTopics, setShowTopics] = useState(true);
  const [tipCount, setTipCount] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleMoodSelect = (selectedMood) => {
    setMood(selectedMood);
    const responses = moodResponses[selectedMood.level];
    const aiReply = responses[Math.floor(Math.random() * responses.length)];

    setMessages([
      {
        id: 1,
        sender: 'ai',
        text: `你好呀，我是${AI_NAME}，你的AI心灵伙伴 🤗\n\n我看到你今天的心情是 ${selectedMood.emoji} ${selectedMood.label}。\n\n${aiReply}`,
        time: formatTime(new Date())
      }
    ]);
    setShowTopics(true);
  };

  const handleTopicClick = (topic) => {
    setInput(topic.text);
    setShowTopics(false);
  };

  const handleSend = (customInput) => {
    const text = (customInput || input).trim();
    if (!text) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text,
      time: formatTime(new Date())
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setShowTopics(false);

    // 模拟AI回复
    const delay = 800 + Math.random() * 1500;
    setTimeout(() => {
      const aiText = getAIResponse(text, mood, messages.length);
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiText,
        time: formatTime(new Date())
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);

      // 每3条消息推送一条关怀建议
      setTipCount(prev => {
        const newCount = prev + 1;
        if (newCount % 3 === 0) {
          setTimeout(() => {
            const tip = selfCareTips[Math.floor(Math.random() * selfCareTips.length)];
            setMessages(prev => [...prev, {
              id: Date.now() + 2,
              sender: 'tip',
              text: tip,
              time: formatTime(new Date())
            }]);
          }, 1500);
        }
        return newCount;
      });
    }, delay);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setMood(null);
    setMessages([]);
    setShowTopics(true);
    setTipCount(0);
  };

  if (!user) {
    return (
      <div className="chat-login-prompt">
        <span className="prompt-icon">🤗</span>
        <h2>请先登录</h2>
        <p>登录后即可和{AI_NAME}聊天</p>
        <button onClick={() => navigate('/login')} className="btn-primary">去登录</button>
      </div>
    );
  }

  // 心情选择页
  if (!mood) {
    return (
      <div className="chat-mood-page">
        <div className="mood-card">
          <div className="mood-ai-avatar">{AI_AVATAR}</div>
          <h1>嗨，我是{AI_NAME}</h1>
          <p>你的AI心灵伙伴，随时倾听你的心声</p>
          <div className="mood-divider"></div>
          <h3>今天感觉怎么样？</h3>
          <p className="mood-hint">选择一个最接近你现在心情的表情</p>
          <div className="mood-grid">
            {moodOptions.map(m => (
              <button
                key={m.level}
                className="mood-btn"
                onClick={() => handleMoodSelect(m)}
              >
                <span className="mood-emoji">{m.emoji}</span>
                <span className="mood-label">{m.label}</span>
              </button>
            ))}
          </div>
          <p className="mood-privacy">🔒 你的对话内容完全保密，不会与任何人分享</p>
        </div>
      </div>
    );
  }

  // 聊天界面
  return (
    <div className="chat-room">
      <div className="chat-header">
        <div className="chat-header-left">
          <span className="ch-ai-avatar">{AI_AVATAR}</span>
          <div>
            <h3>{AI_NAME}</h3>
            <span className="ch-status">
              <span className="status-dot"></span>
              在线 · 随时倾听
            </span>
          </div>
        </div>
        <div className="chat-header-right">
          <span className="ch-mood-badge">{mood.emoji} {mood.label}</span>
          <button className="ch-reset" onClick={handleReset}>
            重新开始
          </button>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            {msg.sender === 'ai' && (
              <span className="msg-ai-avatar">{AI_AVATAR}</span>
            )}
            <div className="msg-content">
              <div className="msg-bubble">{msg.text}</div>
              <span className="msg-time">{msg.time}</span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message ai">
            <span className="msg-ai-avatar">{AI_AVATAR}</span>
            <div className="msg-content">
              <div className="msg-bubble typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {showTopics && messages.length <= 2 && (
        <div className="quick-topics">
          <p className="topics-label">你可以聊聊：</p>
          <div className="topics-grid">
            {quickTopics.map(t => (
              <button
                key={t.text}
                className="topic-btn"
                onClick={() => handleTopicClick(t)}
              >
                <span className="topic-icon">{t.icon}</span>
                <span>{t.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="chat-input-area">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="说说你的感受..."
          rows={1}
        />
        <button className="send-btn" onClick={() => handleSend()} disabled={!input.trim()}>
          发送
        </button>
      </div>
    </div>
  );
}
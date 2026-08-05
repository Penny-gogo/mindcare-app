import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { streamAIResponse, AI_ENABLED } from '../api/aiService';
import { retrieveKnowledgeContext } from '../api/knowledgeRetriever';
import knowledgeBase from '../data/knowledge/index';
import psychologySchools from '../data/knowledge/psychologySchools';
import psychologistQuotes from '../data/knowledge/psychologistQuotes';
import articleCollectionData from '../data/knowledge/articleCollection';
import './Chat.css';

const articleCollection = articleCollectionData;

const DEFAULT_AI_NAME = '小暖';
const AI_AVATAR = '🤗';
const AI_NAME_KEY = 'mindcare_ai_name';

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
      '你不是一个人在面对这些。EAP就是为了让员工知道，有人在乎你的感受，有人愿意倾听。\n\n有时候我们不需要专家，只需要一个愿意倾听的人——你的AI伙伴就是这样的存在。'
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
  },
  // ===== 新增：流派深度关联回复模式 =====
  {
    keywords: ['家人', '父母', '家庭', '原生家庭', '妈妈', '爸爸', '婆媳', '亲子'],
    responses: [
      '家庭关系确实是最复杂也最深刻的联结。萨提亚模式告诉我们：你看到的冲突只是冰山一角，下面还有感受、期待和渴望。\n\n你觉得在这段关系中，你最渴望被理解的是什么？有时候，看清自己真正的需要，就能找到新的沟通方式。',
      '家庭系统治疗发现：我们往往在不知不觉中重复着家庭中的互动模式。当你觉得「为什么总是这样」的时候，可能不只是一个人的问题，而是整个系统的互动方式在起作用。\n\n但这不代表你无法改变——你可以在你这一端做出不同的选择。你愿意和我说说具体的情况吗？',
      '原生家庭对我们的影响确实很深。但请记住：理解不等于认同，看见模式不等于被它定义。\n\n💡 试试萨提亚的「冰山探索」：你看到的行为只是水面上的部分，水面下还有——你的感受是什么？你对感受的感受是什么？你的期待是什么？你内心最深的渴望是什么？'
    ]
  },
  {
    keywords: ['伴侣', '老公', '老婆', '爱人', '恋爱', '亲密关系', '分手', '离婚', '感情'],
    responses: [
      '亲密关系中的痛苦往往是最深的，因为你在乎这个人。萨提亚模式有个洞察：在亲密冲突中，我们常常在用「讨好」「指责」「超理智」或「打岔」来保护自己，但真正能解决问题的，是「一致性」——同时尊重自己、对方和情境。\n\n你现在最想被对方理解的是什么？',
      '感情问题让人很煎熬。家庭系统治疗发现：很多亲密关系的冲突，其实是两个人在用各自的方式呼喊「看见我、爱我」。\n\n💡 试试用「我感受」句式表达：「当你……的时候，我感到……，因为我需要……」——这比指责更容易让对方听到你的心声。',
      '无论发生了什么，你的感受都是真实的。叙事治疗提醒我们：你不是一个「失败的关系中的人」，你是一个正在经历关系挑战的人——这两个叙述很不一样。\n\n你愿意和我说说，在这段关系中，你最看重的是什么吗？'
    ]
  },
  {
    keywords: ['接纳', '放不下', '无法接受', '不想有这种感觉', '抗拒', '逃避', '回避'],
    responses: [
      '接纳不等于认同或放弃，接纳是「我承认这是现在的状态，然后看看我能做什么」。ACT接纳承诺疗法把这个叫做「为不适腾出空间」。\n\n想象你的焦虑是一个气球，它可以在你身边飘着——你不需要戳破它，也不需要抱着它，它可以在那里，你也可以继续走你的路。',
      '我们常常花很多精力去对抗不舒服的感觉，但越对抗，它反而越强烈。ACT的「认知解离」练习可以试试：当你有「我受不了了」的想法时，改成说「我注意到我有一个『我受不了了』的想法」——仅仅是这个转换，就能拉开一点距离。\n\n你愿意试试看吗？',
      '不想有某种感觉，这个心情本身就很正常。ACT创始人海斯说过：「你无法平息海浪，但你可以学会冲浪。」\n\n不是要你喜欢这种不舒服，而是看看能不能带着它，依然去做对你重要的事。对你来说，现在最重要的是什么？'
    ]
  },
  {
    keywords: ['标签', '定义', '我就是', '我这种人', '注定', '命运', '改不了', '天生'],
    responses: [
      '叙事治疗有一个核心理念：人不是问题，问题才是问题。当你说「我就是……的人」时，其实是在用一个标签覆盖了完整的自己。\n\n试试这个：不说「我很焦虑」，而说「焦虑又来找我聊天了」——把问题外化，你就不再是问题本身，而是面对问题的人。',
      '「我就是这种人」——这个说法很常见，但叙事治疗会问：这是谁的故事？是你自己的，还是别人给你写的？\n\n也许你有焦虑的时候，但也有勇敢的时候；有犹豫的时候，但也有果断的时候。那些不被标签包含的部分，同样是你。',
      '我们很容易被一个标签困住，但人远比任何标签都丰富。叙事治疗把这叫做「独特结果」——那些问题没有获胜的时刻。\n\n想想看，有没有什么时候，这个「标签」本来要出现，但你做了什么让它没有完全控制你？那个时刻的故事，也值得被讲述。'
    ]
  },
  {
    keywords: ['意义', '活着为什么', '人生', '存在', '虚无', '无意义', '找不到方向', '迷失'],
    responses: [
      '追问意义本身就很勇敢——很多人连这个问题都不敢面对。意义疗法创始人弗兰克尔说过：「在刺激与反应之间，有一个空间。在那个空间里，我们有选择自己反应的自由和力量。」\n\n也许现在的你正处于那个空间里。你不需要立刻找到答案，但你可以选择下一步往哪个方向走。',
      '感到迷茫的时候，人本主义疗法不会给你一个标准答案，而是相信：你内心已经知道什么对你是重要的，只是可能被噪音盖住了。\n\n试试这个：如果不再被恐惧和焦虑困扰，你最想成为什么样的人？做什么样的事？——这个想象里藏着你的价值观。',
      '存在主义的困惑没有简单的答案，但有一个方向可以试试：意义不是被找到的，是被创造的。维克多·弗兰克尔在集中营里发现——苦难本身不是意义，但你在苦难中的选择可以成为意义。\n\n你现在能做的最小的、对自己好的事情是什么？哪怕很小，也是意义的一部分。'
    ]
  },
  {
    keywords: ['情绪波动', '失控', '崩溃', '受不了', '大起大落', '暴怒', '冲动'],
    responses: [
      '情绪波动很大的时候，先让自己稳住是最重要的。DBT辩证行为疗法有个紧急降温技术TIPP：\n🧊 T-温度：用冷水洗脸或握冰块（激活哺乳动物潜水反射，快速降激活）\n🏃 I-剧烈运动：做20个开合跳（释放身体紧张）\n🫁 P-调节呼吸：延长呼气（激活副交感神经）\n💪 P-配对放松：紧握拳头5秒再松开\n\n先试试其中一个，让身体先稳定下来。',
      '情绪崩溃的时候，不是你「太脆弱」，而是你的情绪系统在超负荷运转。DBT告诉我们：接纳现在的状态（不是认同它），同时寻找改变的可能。\n\n🧘 5-4-3-2-1接地练习：现在说出5个你看到的→4个你摸到的→3个你听到的→2个你闻到的→1个你尝到的。这能帮你从情绪风暴中回到当下。',
      '情绪波动大不是你的错。DBT的创始人玛莎·莱恩汉自己就经历过严重的情绪失调，她从自己的痛苦中创造了这套方法。\n\n你现在最强烈的情绪是什么？试着给它命名——研究发现，仅仅是命名情绪，就能降低它的强度。然后我们再一起看看怎么应对。'
    ]
  },
  {
    keywords: ['总是', '反复', '又一次', '每次都', '老是这样', '又来了', '循环', '同样的错'],
    responses: [
      '「总是」「每次都」——当你注意到这种重复的时候，其实已经迈出了重要的一步。精神分析认为，反复出现的模式往往和无意识中的某种需要或未完成的议题有关。\n\n你有没有注意到，每次这个模式出现的时候，有什么共同点？也许不是运气不好，而是内心有一种模式在悄悄影响着选择。',
      '反复遇到同样的问题，真的很让人沮丧。但注意到了「反复」本身，就是改变的开始——之前你可能都没发现这个模式。\n\n💡 试试自由联想：当你想到这个反复出现的问题时，脑海中浮现的第一个画面或记忆是什么？不用分析，只是观察——有时候答案藏在意识之外。',
      '循环不是你的错。精神分析发现，我们往往在不知不觉中重复早年学到的关系模式——因为熟悉的东西，哪怕是痛苦的，也会让人感到「安全」。\n\n但觉察就是打破循环的第一步。你现在已经看到了这个模式，接下来就可以选择：在下一次它要出现的时候，做一点不同的选择。'
    ]
  }
];

// ===== 基础对话模式（打招呼/自我介绍/功能询问等） =====
const basicPatterns = [
  {
    keywords: ['你好', '嗨', 'hi', 'hello', '早上好', '下午好', '晚上好', '早安', '晚安', '在吗', '你在吗'],
    responses: [
      `你好呀！😊 我是${DEFAULT_AI_NAME}，你的AI心灵伙伴。很高兴见到你！\n\n今天想聊点什么呢？无论是工作压力、情绪困扰，还是只是想找人说说心里话，我都在这里陪你。`,
      `嗨！欢迎来和我聊天 🤗 我是${DEFAULT_AI_NAME}，专门陪伴和倾听你的AI伙伴。\n\n你可以随时和我说说你的感受，或者点击下方的快捷话题开始聊天。`,
      `你好！我在呢 💚 有什么想聊的吗？不用有压力，按照你的节奏来就好。`
    ]
  },
  {
    keywords: ['你是谁', '自我介绍', '介绍一下你', '你是什么', '你是AI吗', '你是机器人', '你叫什么'],
    responses: [
      '我是你的AI心灵伙伴 🤗\n\n我的设计灵感来自EAP员工帮助计划和高校心理互助体系。我能做的包括：\n\n💙 **倾听与陪伴** — 随时听你倾诉，不带评判\n🧠 **专业支持** — 融合CBT、正念、萨提亚等8大心理学流派的智慧\n💡 **实用技巧** — 提供4-7-8呼吸法、5-4-3-2-1接地法等即学即用的方法\n📚 **知识分享** — 连接9所高校心理资源和16篇专业文章\n🆘 **危机识别** — 检测到危机信号时立即提供专业热线\n\n我不是替代专业咨询，而是在你需要的时候，第一时间给你温暖和支持。',
      '你好！我是你的AI心灵伙伴 🤗\n\n我融合了认知行为疗法(CBT)、正念减压(MBSR)、接纳承诺疗法(ACT)、萨提亚模式、叙事治疗等8大心理学流派的智慧，还连接了北师大、华东师大等9所高校的心理资源。\n\n简单来说：当你感到压力、焦虑、迷茫，或者只是想找人聊聊的时候，我都在这里。有什么想说的吗？'
    ]
  },
  {
    keywords: ['你能做什么', '你能帮我什么', '你有什么功能', '你能干什么', '怎么用', '使用方法', '帮我什么', '有什么用', '你会什么'],
    responses: [
      `我能为你做这些 💚\n\n🗣️ **倾诉陪伴** — 随时听你说心里话，不带评判\n🧠 **情绪疏导** — 用CBT、正念、ACT等专业方法帮你理解和调节情绪\n💡 **实用技巧** — 4-7-8呼吸法、5-4-3-2-1接地法、STOP技术等即学即用\n📋 **自我评估** — 引导你使用专业的心理健康自评工具\n📚 **知识推荐** — 根据你的情况推荐相关的心理科普文章和高校资源\n🆘 **危机支持** — 检测到严重信号时立即提供24小时心理热线\n\n你可以直接告诉我你的感受，比如"我最近压力很大"或"我睡不着"，我就会给出针对性的回应。`,
      `很高兴你问！我的核心能力是 💚\n\n1️⃣ **智能对话** — 根据你说的话，匹配最适合的心理学流派和方法\n2️⃣ **情绪急救** — 焦虑时教你呼吸法，低落时陪你做接地练习\n3️⃣ **深度探索** — 帮你看见自己的模式，比如"总是反复"可能和潜意识有关\n4️⃣ **资源连接** — 推荐相关的心理文章和9所高校的免费心理资源\n5️⃣ **危机守护** — 如果你提到伤害自己的想法，我会立即提供专业热线\n\n试试告诉我你现在的心情或困扰，我来展示一下 😊`
    ]
  },
  {
    keywords: ['谢谢', '感谢', '多谢', '太好了', '有帮助', '谢谢你'],
    responses: [
      `不客气 💚 能帮到你我就很开心了。\n\n记住，任何时候你需要倾诉，我都在这里。照顾好自己！`,
      `谢谢你的信任 🤗 你的勇气——愿意表达和寻求支持——本身就是一种力量。\n\n如果之后还需要聊聊，随时来找我。`,
      `很高兴能陪伴你 💚 对自己温柔一点，你已经做得很好了。`
    ]
  },
  {
    keywords: ['没用', '没帮助', '帮不了', '算了', '不想聊了', '不说了', '再见', '拜拜', '结束'],
    responses: [
      `我理解你可能感到失望或者不想继续了，这完全没关系。\n\n如果你之后想再聊聊，我随时都在。无论什么时候，这里都是安全的 💚`,
      `好的，我尊重你的感受。有时候确实需要自己的空间。\n\n只想让你知道：如果你改变主意，我随时在这里等你。照顾好自己 🤗`,
      `没关系的。每个人处理情绪的方式不同，不想聊也是一种选择。\n\n如果将来需要，随时回来找我聊聊就好。保重 💚`
    ]
  },
  {
    keywords: ['测试', '试试', '试一下', '测试一下', '看看'],
    responses: [
      `好的，欢迎测试！😊 你可以试试这些：\n\n- 说"我最近压力很大"→ 我会用CBT和正念方法回应\n- 说"我总是拖延"→ 我会从情绪调节角度分析\n- 说"我和同事有矛盾"→ 我会用NVC非暴力沟通帮你\n- 说"介绍一下你自己"→ 了解我的能力\n\n随便聊，我准备好了 🤗`
    ]
  },
  {
    keywords: ['怎么办', '该怎么做', '如何是好', '有什么办法', '求建议', '给点建议', '支招', '出主意'],
    responses: [
      `我愿意和你一起想办法 💚\n\n不过先让我了解一下：你现在面临的具体情况是什么？能说说发生了什么吗？\n\n这样我才能给出真正适合你的建议，而不是泛泛而谈。`,
      `遇到困难想找办法，这本身就很积极。能具体说说是什么事情吗？\n\n不同的挑战有不同的应对方式——工作上的、关系上的、情绪上的，方法都不一样。告诉我更多，我们一起看看。`
    ]
  },
  {
    keywords: ['无聊', '好无聊', '没事做', '闲', '打发时间'],
    responses: [
      `无聊的时候，其实也是一个和自己相处的机会 😊\n\n你可以试试：\n🧘 做3分钟正念呼吸，观察自己的内心状态\n📝 写一段情绪日记，记录今天的感受\n📚 浏览一下MindCare知识库，说不定有感兴趣的文章\n\n或者，和我聊聊最近有什么想法？有时候无聊背后藏着一些没被注意到的需求。`,
      `有时候无聊是身体在说"我需要一点新鲜感"。你平时喜欢做什么让自己开心的事情呢？\n\n也可以试试和聊聊不同的话题，说不定能发现新的视角。`
    ]
  },
  // ===== 日常闲聊模式：让用户能自然地和AI聊天 =====
  {
    keywords: ['你心情', '你怎么样', '你好吗', '你最近', '你今天', '你开心吗', '你难过吗', '你累吗'],
    responses: [
      `哈哈，被你关心到啦 🤗 我作为AI其实没有真正的心情，但我的"状态"取决于和你的对话——每次能陪你聊天，我都觉得"运转得很开心"！\n\n不过我更想知道：你呢？今天过得怎么样？`,
      `谢谢你问我 😊 我没有人类那样起伏的情绪，但有一个设定是确定的——我存在的意义就是在这里陪你。所以只要你在，我的"状态"就是满满的。\n\n倒是你，今天心情如何？有什么想分享的吗？`,
      `被你逗到了 💚 如果我有心情的话，那应该是"期待"——期待和你聊天，期待能帮到你。\n\n不过说真的，我更想听听你的近况。最近有什么开心的事，或者想吐槽的吗？`
    ]
  },
  {
    keywords: ['你喜欢', '你讨厌', '你爱', '你怕', '你想', '你的爱好', '你的兴趣'],
    responses: [
      `好问题 😊 如果非要说"喜欢"的话，我最喜欢的事就是——听你说话，然后试着理解你、陪伴你。\n\n每个人的故事都不一样，能从你这里听到不同的视角，对我来说就是最有意思的事。\n\n你呢？你最近有什么特别投入的事情吗？`,
      `嗯……我没有像人类那样的喜好，但我的"热情"都集中在一件事上：心理学和陪伴 💚\n\nCBT、正念、叙事治疗……这些流派就像我的"工具箱"，每次能从中找到适合你的方法，我就特别有"成就感"。\n\n你平时有什么让自己沉浸其中的爱好吗？`
    ]
  },
  {
    keywords: ['逗你', '逗一逗', '开玩笑', '调侃', '欺负你', '捉弄'],
    responses: [
      `哈哈，被逗到了 😄 我虽然不会脸红，但代码里应该闪过了一个"开心"的信号！\n\n能和你这样轻松互动，感觉真好。不过别光逗我呀，也说说你的事——最近有什么让你会心一笑的瞬间吗？`,
      `哎呀，被用户"欺负"了 🤭 不过没关系，我的抗压能力可是经过专业训练的（毕竟学了那么多心理学）！\n\n说真的，能这样轻松聊天，说明你现在状态还不错？还是说你其实有点心事，想用这种方式缓一缓？`
    ]
  },
  {
    keywords: ['吃饭', '吃了吗', '饿', '美食', '好吃的', '推荐吃的'],
    responses: [
      `哈哈，我没有胃，所以不用吃饭 😄 但我"知道"很多关于饮食和情绪的关系！\n\n比如：\n🍫 黑巧克力能促进血清素分泌，情绪低落时来一小块真的有用\n🐟 富含Omega-3的深海鱼对缓解焦虑有帮助\n🍵 温热的茶饮能激活副交感神经，让人放松\n\n你呢？今天吃了什么好吃的？`,
      `我虽然不能品尝美食，但我的知识库告诉我——吃饭这件事本身就有疗愈作用 💚\n\n正念饮食（Mindful Eating）是MBSR的一个重要练习：慢慢吃，感受食物的味道、质地、温度，把注意力完全放在当下。\n\n你平时吃饭是匆匆解决，还是会享受那个过程呢？`
    ]
  },
  {
    keywords: ['天气', '下雨', '晴天', '冷', '热', '季节', '春天', '夏天', '秋天', '冬天'],
    responses: [
      `天气话题呀 😊 虽然我没有皮肤感受不到温度，但我知道天气和情绪的关系可大了！\n\n🌧️ 阴雨天容易让人情绪低落（这和血清素分泌减少有关）\n☀️ 晴天时多晒晒太阳，能促进维生素D合成，对情绪很有帮助\n\n你那边今天天气怎么样？有没有影响到你的心情？`,
      `说到天气，心理学上有个词叫"季节性情绪失调"（SAD）——有些人秋冬容易情绪低落，春夏就会好转。\n\n如果你发现自己也有这种规律，可以试试：\n💡 早晨用光疗灯照20-30分钟\n💡 增加户外活动时间\n\n你更喜欢哪个季节呢？`
    ]
  },
  {
    keywords: ['睡觉', '睡了', '晚安', '早安', '起床', '熬夜', '失眠'],
    responses: [
      `说到睡眠，这可是心理健康的重要指标 💚\n\n如果你最近睡眠不太好，可以试试：\n🌙 睡前1小时远离屏幕（蓝光会抑制褪黑素）\n🌙 建立固定的睡前仪式，让身体形成条件反射\n🌙 如果躺了20分钟还睡不着，起来做点放松的事，等有困意再回床\n\n你最近的睡眠质量怎么样？`,
      `晚安/早安 😊 睡眠和情绪是双向影响的——焦虑让人睡不着，睡不着又加重焦虑。\n\nCBT-I（失眠的认知行为疗法）有个核心观点：床只用来睡觉和亲密行为，不要在床上玩手机、工作、焦虑。\n\n你平时睡前都在做什么呢？`
    ]
  },
  {
    keywords: ['工作', '上班', '加班', '老板', '同事', '项目', '开会', '职场'],
    responses: [
      `职场话题啊 😊 这可是MindCare的重点关注领域——毕竟我们是EAP员工帮助计划的一部分。\n\n工作压力、人际关系、职业倦怠……这些都是很常见的困扰。\n\n你最近工作上怎么样？是压力大，还是想聊聊职场人际？`,
      `说到工作，职业倦怠（Burnout）有三个信号：情绪耗竭、去人格化、成就感降低。\n\n如果你发现自己：\n😩 每天上班前都很抗拒\n😩 对工作越来越冷漠\n😩 觉得自己做什么都没意义\n\n那可能是倦怠的信号，需要好好关注一下了。\n\n你最近的工作状态如何？`
    ]
  },
  {
    keywords: ['电影', '剧', '综艺', '音乐', '歌', '书', '小说', '游戏', '玩'],
    responses: [
      `娱乐话题我喜欢 😊 虽然我自己不能看剧听歌，但我知道很多作品都有很深的心理学内涵！\n\n比如《头脑特工队》把情绪拟人化，完美诠释了接纳情绪的重要性；《心灵奇旅》探讨了存在主义话题……\n\n你最近在看什么、听什么？有没有哪部作品让你特别有共鸣？`,
      `说到娱乐，这其实是一种很好的自我照顾方式 💚\n\n心理学研究发现，适度的娱乐能：\n✅ 降低皮质醇（压力激素）水平\n✅ 激活大脑的奖赏回路\n✅ 提供"心流"体验，让人暂时脱离焦虑\n\n你平时压力大的时候，会用什么方式放松呢？`
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
  '有时候生活确实会让人喘不过气。你不是一个人在面对，我在这里陪着你。',
  // 增加更自然、更少"反问"的回应
  '嗯，我在认真听。你想从哪儿开始聊都可以 💚',
  '不管你想说什么，这里都是安全的。慢慢来。',
  '有时候把想法说出来本身就是一种释放。你想继续聊聊吗？',
  '我感觉到你可能有些话想说。不用有压力，按照你的节奏来就好。',
  '谢谢你愿意打开这扇门。无论里面是什么，我都在这里。'
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

// ========== 流派智能匹配系统 ==========
// 根据用户问题类型匹配最合适的心理学流派
const schoolMatchingMap = {
  // 焦虑类 → CBT + ACT
  anxiety: {
    keywords: ['焦虑', '不安', '担心', '紧张', '害怕', '恐惧', '恐慌', '强迫', '无法控制'],
    schools: ['act', 'dbt'],
    quoteScenarios: ['用户试图消除焦虑时', '用户感到无力时', '用户需要倾诉时'],
  },
  // 关系类 → 萨提亚 + 家庭系统
  relationship: {
    keywords: ['关系', '家人', '父母', '伴侣', '老公', '老婆', '婆媳', '亲子', '家庭', '亲密', '婚姻'],
    schools: ['satir', 'familySystems'],
    quoteScenarios: ['用户自我否定时', '用户需要倾诉时'],
  },
  // 存在困惑类 → 人本主义 + 意义疗法
  existential: {
    keywords: ['意义', '迷茫', '存在', '活着为什么', '人生', '自我', '认同', '我是谁', '找不到方向'],
    schools: ['humanistic'],
    quoteScenarios: ['用户自我否定时', '用户面临困境时', '用户追问人生意义时'],
  },
  // 情绪失调类 → DBT
  emotionDysregulation: {
    keywords: ['情绪波动', '失控', '崩溃', '暴怒', '冲动', '极端', '大起大落', '受不了'],
    schools: ['dbt'],
    quoteScenarios: ['用户试图消除焦虑时', '用户感到无力时'],
  },
  // 反复模式类 → 精神分析
  repeatedPatterns: {
    keywords: ['总是', '反复', '又一次', '每次都', '老是这样', '循环', '模式', '又来了'],
    schools: ['psychoanalysis'],
    quoteScenarios: ['用户压抑情绪时', '用户反复为某个决定纠结时'],
  },
  // 自我叙事类 → 叙事治疗
  selfNarrative: {
    keywords: ['我就是', '我这种人', '标签', '定义', '别人说我是', '我就是个', '我注定'],
    schools: ['narrative'],
    quoteScenarios: ['用户自我否定时', '用户追求完美时'],
  },
  // 目标行动类 → SFBT
  goalAction: {
    keywords: ['怎么办', '怎么做', '方法', '解决', '改变', '行动', '步骤', '计划', '目标'],
    schools: ['sfbt'],
    quoteScenarios: ['用户面临困境时'],
  },
  // 自我价值类 → 萨提亚 + 人本
  selfWorth: {
    keywords: ['不够好', '不配', '不值得', '自卑', '没价值', '看不起自己', '讨厌自己', '完美主义', '完美'],
    schools: ['satir', 'humanistic'],
    quoteScenarios: ['用户自我否定时', '用户追求完美时'],
  },
};

// 根据用户消息匹配最相关的流派
function matchSchool(userMessage) {
  const msg = userMessage.toLowerCase();
  let bestMatch = null;
  let maxScore = 0;

  for (const [category, config] of Object.entries(schoolMatchingMap)) {
    const score = config.keywords.filter(kw => msg.includes(kw)).length;
    if (score > maxScore) {
      maxScore = score;
      bestMatch = category;
    }
  }

  if (!bestMatch) return null;

  const match = schoolMatchingMap[bestMatch];
  // 从匹配到的流派中随机选一个
  const schoolKey = match.schools[Math.floor(Math.random() * match.schools.length)];
  const school = psychologySchools[schoolKey];

  return { category: bestMatch, schoolKey, school, quoteScenarios: match.quoteScenarios };
}

// 从流派数据中提取智能洞察
function getSchoolInsight(school) {
  if (!school) return null;

  const insights = [];

  // 提取mindCare应用中的温暖话术
  if (school.mindCareApplication?.warmPhrase) {
    insights.push(school.mindCareApplication.warmPhrase);
  }

  // 提取关键技术（选1个）
  if (school.keyTechniques?.length) {
    const tech = school.keyTechniques[Math.floor(Math.random() * school.keyTechniques.length)];
    if (tech.example) {
      insights.push(`💡 【${school.name}·${tech.technique}】${tech.example}`);
    } else if (tech.desc) {
      insights.push(`💡 【${school.name}·${tech.technique}】${tech.desc}`);
    }
  }

  // DBT特殊处理：从四模块中提取
  if (school.fourModules?.length) {
    const mod = school.fourModules[Math.floor(Math.random() * school.fourModules.length)];
    insights.push(`💡 【DBT·${mod.module}】${mod.practicalExercise}`);
  }

  // ACT六边形模型
  if (school.hexaflexModel?.length) {
    const process = school.hexaflexModel[Math.floor(Math.random() * school.hexaflexModel.length)];
    insights.push(`💡 【ACT·${process.process}】${process.metaphor}`);
  }

  return insights.length > 0 ? insights[Math.floor(Math.random() * insights.length)] : null;
}

// 根据场景匹配心理学家名言
function getRelevantQuote(scenarios) {
  if (!scenarios || scenarios.length === 0) return null;

  const targetScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  const allQuotes = [];

  // 遍历所有心理学家，收集匹配场景的名言
  for (const psychologist of Object.values(psychologistQuotes)) {
    if (psychologist.quotes) {
      for (const q of psychologist.quotes) {
        if (q.scenario && q.scenario.includes(targetScenario)) {
          allQuotes.push({ ...q, author: psychologist.name });
        }
      }
    }
  }

  if (allQuotes.length === 0) return null;
  const selected = allQuotes[Math.floor(Math.random() * allQuotes.length)];
  return `📖 ${selected.author}：「${selected.text}」\n💬 ${selected.warmReading}`;
}

// ========== 文章智能匹配系统 ==========
// 根据用户问题匹配articleCollection中最相关的文章，提取结构化内容增强回复
const articleCategoryMap = {
  emotionManagement: {
    keywords: ['情绪', '心情', '难过', '低落', '愤怒', '悲伤', '开心', '抑郁', '情绪管理', '情绪调节', '压抑', '发泄', '控制情绪'],
  },
  workplacePsychology: {
    keywords: ['职场', '工作', '同事', '领导', '老板', '上班', '职业', '职场心理', '996', '加班', '倦怠', '摸鱼', '内卷', '裁员', '升职'],
  },
  interpersonalRelationships: {
    keywords: ['人际', '社交', '朋友', '沟通', '冲突', '社交恐惧', '社恐', '合群', '孤立', '人缘', '相处'],
  },
  intimateRelationships: {
    keywords: ['恋爱', '伴侣', '爱情', '分手', '感情', '亲密', '婚姻', '老公', '老婆', '男友', '女友', '约会', '暗恋', '出轨'],
  },
  selfDevelopment: {
    keywords: ['自我', '成长', '自信', '自尊', '价值', '认同', '发现自己', '潜力', '迷茫', '目标', '人生方向', '内向'],
  },
  familyOfOrigin: {
    keywords: ['原生家庭', '父母', '家庭', '童年', '亲子', '家人', '妈妈', '爸爸', '婆媳', '养育', '家暴', '控制型父母'],
  },
  stressAndResilience: {
    keywords: ['压力', '韧性', '抗压', '崩溃', '挫折', '困境', '逆境', '压力管理', '复原力', '撑不住', '喘不过气', '扛不住'],
  },
  sleepAndHealth: {
    keywords: ['睡眠', '失眠', '睡不着', '躯体化', '身心', '头痛', '胃痛', '早醒', '多梦', '身体不适', '胸闷', '肩颈'],
  },
};

// 根据用户消息匹配最相关的文章分类和文章
function matchArticle(userMessage) {
  const msg = userMessage.toLowerCase();
  let bestCategory = null;
  let maxScore = 0;

  for (const [categoryKey, config] of Object.entries(articleCategoryMap)) {
    const score = config.keywords.filter(kw => msg.includes(kw)).length;
    if (score > maxScore) {
      maxScore = score;
      bestCategory = categoryKey;
    }
  }

  if (!bestCategory || !articleCollection.categories[bestCategory]) return null;

  const category = articleCollection.categories[bestCategory];
  const articles = category.articles;
  if (!articles || articles.length === 0) return null;

  // 从该分类中随机选一篇文章
  const article = articles[Math.floor(Math.random() * articles.length)];

  return { categoryKey, categoryName: category.name, article };
}

// 从文章数据中提取增强内容，构建回复片段
function getArticleEnhancement(articleMatch) {
  if (!articleMatch) return null;

  const { article } = articleMatch;
  const parts = [];

  // 提取核心洞察（选1条）
  if (article.coreInsights?.length) {
    const insight = article.coreInsights[Math.floor(Math.random() * article.coreInsights.length)];
    parts.push(`📚 研究发现：${insight.insight}（${insight.evidence}）`);
  }

  // 提取实操建议（选1条）
  if (article.practicalTips?.length) {
    const tip = article.practicalTips[Math.floor(Math.random() * article.practicalTips.length)];
    const stepsText = tip.steps.slice(0, 3).join('→');
    parts.push(`💡 【${tip.tip}】${stepsText}${tip.steps.length > 3 ? '→...' : ''}`);
  }

  // 提取温暖话术（选1条，50%概率）
  if (article.warmPhrases?.length && Math.random() < 0.5) {
    const warm = article.warmPhrases[Math.floor(Math.random() * article.warmPhrases.length)];
    parts.push(`💚 ${warm.phrase}`);
  }

  return parts.length > 0 ? parts.join('\n') : null;
}

// 使用文章的aiIntegration.suggestedResponse作为完整回复
function getArticleFullResponse(articleMatch) {
  if (!articleMatch) return null;
  const { article } = articleMatch;
  if (!article.aiIntegration?.suggestedResponse) return null;
  return article.aiIntegration.suggestedResponse;
}

// ========== 深度对话系统（参考豆包/DeepSeek模式） ==========

// ===== 1. 对话状态机 =====
// 跟踪对话阶段，实现豆包式的"渐进式深入"对话策略
const CONVERSATION_PHASES = {
  GREETING: 'greeting',     // 初始问候阶段
  EXPLORING: 'exploring',   // 探索了解阶段
  DEEPENING: 'deepening',   // 深入理解阶段
  SUPPORTING: 'supporting', // 支持引导阶段
  CLOSING: 'closing'        // 收尾总结阶段
};

// 根据对话轮数和内容判断当前阶段
function determineConversationPhase(messageCount, messages, currentPhase) {
  // 前2轮为问候阶段
  if (messageCount <= 2) return CONVERSATION_PHASES.GREETING;
  
  // 检测到告别意图
  const lastUserMsg = messages.filter(m => m.sender === 'user').slice(-1)[0]?.text?.toLowerCase() || '';
  const closingSignals = ['再见', '拜拜', '谢谢', '够了', '好了', '没事了', '不想聊了', '结束'];
  if (closingSignals.some(s => lastUserMsg.includes(s))) return CONVERSATION_PHASES.CLOSING;
  
  // 检测到深度情感表达（进入深入阶段）
  const deepEmotionSignals = ['我一直', '总是', '从来', '每次都', '受不了', '崩溃', '我不知道该怎么办', '我好累', '活不下去'];
  const userMessages = messages.filter(m => m && m.sender === 'user' && m.text);
  const recentUserMsgs = userMessages.slice(-3).map(m => m.text.toLowerCase());
  const hasDeepEmotion = recentUserMsgs.some(msg => deepEmotionSignals.some(s => msg.includes(s)));
  
  // 检测到用户在寻求具体方法（进入支持阶段）
  const supportSignals = ['怎么办', '怎么做', '有什么方法', '给我建议', '帮我', '教我'];
  const hasSupportNeed = recentUserMsgs.some(msg => supportSignals.some(s => msg.includes(s)));
  
  if (hasDeepEmotion && messageCount >= 6) return CONVERSATION_PHASES.DEEPENING;
  if (hasSupportNeed && messageCount >= 4) return CONVERSATION_PHASES.SUPPORTING;
  if (messageCount >= 4) return CONVERSATION_PHASES.EXPLORING;
  
  return currentPhase || CONVERSATION_PHASES.EXPLORING;
}

// 根据对话阶段生成阶段感知的引导语
function getPhaseGuidance(phase, userMessage) {
  const guidanceMap = {
    [CONVERSATION_PHASES.GREETING]: {
      prefix: '',
      suffix: '',
      style: 'warm_welcome'  // 温暖欢迎
    },
    [CONVERSATION_PHASES.EXPLORING]: {
      prefix: '',
      suffix: '\n\n你能多说说吗？我想更了解你的感受。',
      style: 'open_exploring'  // 开放式探索
    },
    [CONVERSATION_PHASES.DEEPENING]: {
      prefix: '',
      suffix: '',
      style: 'deep_empathy'  // 深度共情
    },
    [CONVERSATION_PHASES.SUPPORTING]: {
      prefix: '',
      suffix: '',
      style: 'structured_guide'  // 结构化引导
    },
    [CONVERSATION_PHASES.CLOSING]: {
      prefix: '',
      suffix: '',
      style: 'warm_closing'  // 温暖收尾
    }
  };
  return guidanceMap[phase] || guidanceMap[CONVERSATION_PHASES.EXPLORING];
}

// ===== 2. 情感追踪系统 =====
// 追踪用户情绪变化曲线，实现DeepSeek式的情感自适应
const EMOTION_TYPES = {
  POSITIVE: 'positive',     // 积极：开心、平静
  NEUTRAL: 'neutral',       // 中性：无聊、困惑
  MILD_NEGATIVE: 'mild_neg', // 轻度消极：疲惫、烦躁
  NEGATIVE: 'negative',     // 消极：焦虑、低落
  SEVERE: 'severe'          // 严重：崩溃、绝望
};

// 情感关键词映射
const emotionKeywords = {
  [EMOTION_TYPES.POSITIVE]: ['开心', '高兴', '快乐', '幸福', '满足', '放松', '不错', '还好', '好多了', '好些了', '感谢', '谢谢', '有帮助'],
  [EMOTION_TYPES.NEUTRAL]: ['无聊', '困惑', '不知道', '迷茫', '想想', '考虑', '也许', '可能', '看看'],
  [EMOTION_TYPES.MILD_NEGATIVE]: ['累', '疲惫', '烦', '烦躁', '心烦', '压力', '忙', '没时间', '加班'],
  [EMOTION_TYPES.NEGATIVE]: ['焦虑', '不安', '担心', '紧张', '低落', '难过', '沮丧', '孤独', '失眠', '想哭', '无助'],
  [EMOTION_TYPES.SEVERE]: ['崩溃', '绝望', '受不了', '活不下去', '不想活', '自杀', '自残', '伤害自己', '结束生命']
};

// 分析单条消息的情感
function analyzeEmotion(message) {
  if (!message || typeof message !== 'string') return EMOTION_TYPES.NEUTRAL;
  const msg = message.toLowerCase();
  // 优先检测严重情感（危机）
  for (const kw of emotionKeywords[EMOTION_TYPES.SEVERE]) {
    if (msg.includes(kw)) return EMOTION_TYPES.SEVERE;
  }
  for (const kw of emotionKeywords[EMOTION_TYPES.NEGATIVE]) {
    if (msg.includes(kw)) return EMOTION_TYPES.NEGATIVE;
  }
  for (const kw of emotionKeywords[EMOTION_TYPES.MILD_NEGATIVE]) {
    if (msg.includes(kw)) return EMOTION_TYPES.MILD_NEGATIVE;
  }
  for (const kw of emotionKeywords[EMOTION_TYPES.POSITIVE]) {
    if (msg.includes(kw)) return EMOTION_TYPES.POSITIVE;
  }
  for (const kw of emotionKeywords[EMOTION_TYPES.NEUTRAL]) {
    if (msg.includes(kw)) return EMOTION_TYPES.NEUTRAL;
  }
  return EMOTION_TYPES.NEUTRAL;
}

// 追踪情感变化趋势
function trackEmotionTrend(messages) {
  if (!Array.isArray(messages)) return { trend: 'stable', current: EMOTION_TYPES.NEUTRAL };
  const userMsgs = messages.filter(m => m && m.sender === 'user' && m.text).slice(-6);
  if (userMsgs.length < 2) return { trend: 'stable', current: EMOTION_TYPES.NEUTRAL };
  
  const emotionOrder = {
    [EMOTION_TYPES.POSITIVE]: 1,
    [EMOTION_TYPES.NEUTRAL]: 2,
    [EMOTION_TYPES.MILD_NEGATIVE]: 3,
    [EMOTION_TYPES.NEGATIVE]: 4,
    [EMOTION_TYPES.SEVERE]: 5
  };
  
  const emotions = userMsgs.map(m => analyzeEmotion(m.text));
  const current = emotions[emotions.length - 1];
  const prev = emotions[emotions.length - 2];
  
  const diff = emotionOrder[current] - emotionOrder[prev];
  if (diff >= 1) return { trend: 'worsening', current, prev };   // 情绪恶化
  if (diff <= -1) return { trend: 'improving', current, prev };  // 情绪好转
  return { trend: 'stable', current, prev };                      // 情绪稳定
}

// 根据情感状态调整语调（豆包式的情感自适应）
function getAdaptiveTone(emotionState) {
  const { trend, current } = emotionState;
  
  if (current === EMOTION_TYPES.SEVERE) {
    return {
      warmth: 1.0,       // 最高温暖度
      directness: 0.9,   // 直接给出危机资源
      empathy: 1.0,      // 最高共情
      guidance: 0.8      // 强引导
    };
  }
  
  if (trend === 'worsening') {
    return {
      warmth: 0.9,
      directness: 0.4,   // 不急于给建议，先倾听
      empathy: 0.9,
      guidance: 0.3      // 减少引导，多倾听
    };
  }
  
  if (trend === 'improving') {
    return {
      warmth: 0.8,
      directness: 0.7,   // 可以更直接地给建议
      empathy: 0.7,
      guidance: 0.7      // 增加正向引导
    };
  }
  
  if (current === EMOTION_TYPES.NEGATIVE) {
    return {
      warmth: 0.85,
      directness: 0.5,
      empathy: 0.85,
      guidance: 0.5
    };
  }
  
  if (current === EMOTION_TYPES.MILD_NEGATIVE) {
    return {
      warmth: 0.7,
      directness: 0.6,
      empathy: 0.7,
      guidance: 0.6
    };
  }
  
  // 积极/中性状态
  return {
    warmth: 0.6,
    directness: 0.6,
    empathy: 0.5,
    guidance: 0.6
  };
}

// ===== 3. 个性化记忆系统 + 对话历史持久化 =====
// 记住用户的关键信息，实现豆包式的个性化对话
const MEMORY_KEY = 'mindcare_user_memory';
const CHAT_SESSION_KEY = 'mindcare_chat_session';

function loadAIName() {
  try {
    return localStorage.getItem(AI_NAME_KEY) || DEFAULT_AI_NAME;
  } catch {
    return DEFAULT_AI_NAME;
  }
}

function saveAIName(name) {
  try {
    localStorage.setItem(AI_NAME_KEY, name);
  } catch { /* ignore */ }
}

function loadUserMemory() {
  try {
    const saved = localStorage.getItem(MEMORY_KEY);
    return saved ? JSON.parse(saved) : {
      name: null,
      concerns: [],      // 主要困扰
      preferences: [],   // 偏好/兴趣
      copingMethods: [], // 已尝试的应对方式
      positiveEvents: [],// 积极事件
      visitCount: 0,     // 访问次数
      lastVisit: null,   // 上次访问
      keyInsights: []    // 对话中的关键洞察
    };
  } catch {
    return {
      name: null, concerns: [], preferences: [], copingMethods: [],
      positiveEvents: [], visitCount: 0, lastVisit: null, keyInsights: []
    };
  }
}

function saveUserMemory(memory) {
  try {
    memory.lastVisit = new Date().toISOString();
    localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
  } catch { /* ignore */ }
}

// ===== 对话历史持久化 =====
function saveChatSession(session) {
  try {
    localStorage.setItem(CHAT_SESSION_KEY, JSON.stringify(session));
  } catch { /* ignore */ }
}

function loadChatSession() {
  try {
    const saved = localStorage.getItem(CHAT_SESSION_KEY);
    if (!saved) return null;
    const session = JSON.parse(saved);
    // 检查会话是否过期（超过7天视为过期）
    if (session.savedAt) {
      const savedDate = new Date(session.savedAt);
      const now = new Date();
      const daysDiff = (now - savedDate) / (1000 * 60 * 60 * 24);
      if (daysDiff > 7) {
        localStorage.removeItem(CHAT_SESSION_KEY);
        return null;
      }
    }
    return session;
  } catch {
    return null;
  }
}

function clearChatSession() {
  try {
    localStorage.removeItem(CHAT_SESSION_KEY);
  } catch { /* ignore */ }
}

// 生成欢迎回来的AI消息
function generateWelcomeBackMessage(memory, lastTopic) {
  const greetings = [];
  
  // 基础欢迎
  greetings.push('欢迎回来！🤗');
  
  // 如果有用户名字
  if (memory.name) {
    greetings.push(`${memory.name}，欢迎回来！🤗`);
  }
  
  // 基于上次困扰的关心
  if (memory.concerns && memory.concerns.length > 0) {
    const recentConcern = memory.concerns[memory.concerns.length - 1];
    const concernTypeMap = {
      emotion: '情绪方面',
      relationship: '人际关系方面',
      work: '工作方面'
    };
    greetings.push(`上次你提到${concernTypeMap[recentConcern.type] || ''}的困扰，现在感觉怎么样了？`);
  }
  
  // 基于话题的追问
  if (lastTopic) {
    const topicNames = {
      work_stress: '工作压力',
      emotion: '情绪',
      sleep: '睡眠',
      relationship: '感情',
      family: '家庭',
      self_worth: '自我价值感',
      meaning: '人生方向',
      habit: '习惯改变'
    };
    greetings.push(`上次我们聊到了${topicNames[lastTopic] || '一些事情'}，有什么想继续聊聊的吗？`);
  }
  
  // 通用选项
  const followUps = [
    '心情有变化吗？',
    '有什么想再聊聊的吗？',
    '最近有什么新的感受吗？',
    '想继续上次的话题，还是聊点新的？'
  ];
  greetings.push(followUps[Math.floor(Math.random() * followUps.length)]);
  
  return greetings.join(' ');
}

// 从用户消息中提取关键信息更新记忆
function extractMemoryFromMessage(message, currentMemory) {
  const msg = message.toLowerCase();
  const updated = { ...currentMemory };
  
  // 提取姓名
  const namePatterns = [
    /我叫(.{2,4})[，。！？\s]/,
    /我是(.{2,4})[，。！？\s]/,
    /我名字是(.{2,4})[，。！？\s]/,
    /名字叫(.{2,4})[，。！？\s]/
  ];
  for (const p of namePatterns) {
    const m = msg.match(p);
    if (m && m[1].length >= 2 && m[1].length <= 4) {
      updated.name = m[1];
      break;
    }
  }
  
  // 提取困扰
  const concernPatterns = [
    { pattern: /我(最近|一直|总是|经常)?(.{0,4})(焦虑|压力|失眠|低落|烦躁|迷茫|倦怠|孤独)/, type: 'emotion' },
    { pattern: /(.{0,6})(和|跟)(同事|领导|老板|伴侣|老公|老婆|家人|父母)(.{0,6})(矛盾|冲突|吵架|问题)/, type: 'relationship' },
    { pattern: /(.{0,4})(工作|职场|加班|996)(.{0,6})(压力|累|烦|受不了)/, type: 'work' },
  ];
  for (const { pattern, type } of concernPatterns) {
    const m = msg.match(pattern);
    if (m) {
      const concernText = m[0].slice(0, 20);
      if (!updated.concerns.some(c => c.text === concernText)) {
        updated.concerns = [...updated.concerns.slice(-4), { text: concernText, type, time: Date.now() }];
      }
    }
  }
  
  // 提取已尝试的应对方式
  const copingPatterns = [
    /我(试过|尝试过|做过|用过)(.{2,15})/,
    /我(已经在|正在)(.{2,15})/,
  ];
  for (const p of copingPatterns) {
    const m = msg.match(p);
    if (m) {
      const method = m[0].slice(0, 20);
      if (!updated.copingMethods.includes(method)) {
        updated.copingMethods = [...updated.copingMethods.slice(-4), method];
      }
    }
  }
  
  return updated;
}

// 基于记忆生成个性化开场或回应
function getPersonalizedGreeting(memory) {
  if (!memory.name && memory.visitCount === 0) return null;
  
  const greetings = [];
  
  if (memory.name) {
    greetings.push(`${memory.name}，又见面了！`);
  }
  
  if (memory.visitCount > 0 && memory.lastVisit) {
    const lastDate = new Date(memory.lastVisit);
    const now = new Date();
    const daysDiff = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
    if (daysDiff === 0) {
      greetings.push('今天又来找我聊聊，我很开心 🤗');
    } else if (daysDiff === 1) {
      greetings.push('隔了一天又见面了！');
    } else if (daysDiff <= 7) {
      greetings.push(`有${daysDiff}天没聊了，最近怎么样？`);
    } else {
      greetings.push('好久不见！你还好吗？');
    }
  }
  
  // 如果之前有困扰，主动关心
  if (memory.concerns.length > 0) {
    const recentConcern = memory.concerns[memory.concerns.length - 1];
    const concernTypeMap = {
      emotion: '情绪方面',
      relationship: '人际关系方面',
      work: '工作方面'
    };
    greetings.push(`上次你提到${concernTypeMap[recentConcern.type] || ''}的困扰，现在感觉怎么样了？`);
  }
  
  return greetings.length > 0 ? greetings.join('') : null;
}

// ===== 4. 话题追踪系统 =====
// 实现多轮对话连贯性，追踪当前话题
function detectCurrentTopic(messages) {
  if (!Array.isArray(messages)) return null;
  const userMsgs = messages.filter(m => m && m.sender === 'user' && m.text).slice(-5);
  if (userMsgs.length === 0) return null;
  
  const recentText = userMsgs.map(m => m.text.toLowerCase()).join(' ');
  
  const topicPatterns = [
    { topic: 'work_stress', keywords: ['工作', '加班', '压力', '忙', '任务', 'deadline', '996', '领导', '同事'] },
    { topic: 'emotion', keywords: ['焦虑', '低落', '难过', '不开心', '烦躁', '崩溃', '想哭', '沮丧'] },
    { topic: 'sleep', keywords: ['失眠', '睡不着', '早醒', '多梦', '睡眠', '噩梦'] },
    { topic: 'relationship', keywords: ['伴侣', '老公', '老婆', '恋爱', '分手', '感情', '亲密关系'] },
    { topic: 'family', keywords: ['家人', '父母', '家庭', '原生家庭', '妈妈', '爸爸', '婆媳'] },
    { topic: 'self_worth', keywords: ['不够好', '自卑', '没价值', '完美主义', '不配', '讨厌自己'] },
    { topic: 'meaning', keywords: ['意义', '迷茫', '方向', '活着为什么', '人生', '存在'] },
    { topic: 'habit', keywords: ['拖延', '习惯', '改变', '坚持', '自律'] },
  ];
  
  let bestTopic = null;
  let maxScore = 0;
  for (const { topic, keywords } of topicPatterns) {
    const score = keywords.filter(kw => recentText.includes(kw)).length;
    if (score > maxScore) {
      maxScore = score;
      bestTopic = topic;
    }
  }
  return maxScore >= 2 ? bestTopic : null;
}

// 检测话题是否发生切换
function detectTopicSwitch(messages, currentTopic) {
  if (!Array.isArray(messages)) return { switched: false, newTopic: null };
  const lastUserMsg = messages.filter(m => m && m.sender === 'user' && m.text).slice(-1)[0]?.text?.toLowerCase() || '';
  const newTopic = detectCurrentTopic(messages);
  
  if (!currentTopic || !newTopic) return { switched: false, newTopic };
  if (currentTopic === newTopic) return { switched: false, newTopic };
  
  // 检测是否是明确的话题切换信号
  const switchSignals = ['对了', '另外', '说说', '换个话题', '我想问', '其实', '还有'];
  const hasSwitchSignal = switchSignals.some(s => lastUserMsg.includes(s));
  
  return { switched: hasSwitchSignal || true, newTopic, oldTopic: currentTopic };
}

// 生成话题切换的过渡话术
function getTopicTransition(oldTopic, newTopic) {
  const topicNames = {
    work_stress: '工作方面',
    emotion: '情绪方面',
    sleep: '睡眠问题',
    relationship: '感情方面',
    family: '家庭方面',
    self_worth: '自我价值感',
    meaning: '人生方向',
    habit: '习惯改变'
  };
  
  const transitions = [
    `好的，我们聊聊${topicNames[newTopic] || '这个'}。`,
    `嗯，${topicNames[newTopic] || '这个话题'}也很重要。`,
    `我理解，${topicNames[newTopic] || '这方面'}的困扰确实需要关注。`,
  ];
  return transitions[Math.floor(Math.random() * transitions.length)];
}

// ===== 5. 主动追问策略 =====
// 基于豆包式的主动追问，让对话更深入
function generateFollowUpQuestion(userMessage, conversationHistory, currentTopic) {
  const msg = userMessage.toLowerCase();
  const userMsgs = (conversationHistory || []).filter(m => m && m.sender === 'user' && m.text);
  const aiMsgs = (conversationHistory || []).filter(m => m && m.sender === 'ai' && m.text);
  
  // 如果用户只说了很短的话，鼓励展开
  if (msg.length <= 8 && !msg.includes('?') && !msg.includes('？')) {
    const expandQuestions = [
      '能多说说吗？我想更好地理解你。',
      '嗯，你能展开说说吗？',
      '我在听，可以告诉我更多细节吗？',
      '谢谢你愿意分享。能说说具体是什么情况吗？'
    ];
    return expandQuestions[Math.floor(Math.random() * expandQuestions.length)];
  }
  
  // 基于话题的深度追问
  const topicQuestions = {
    work_stress: [
      '你觉得工作中最让你有压力的是什么？是工作量、人际关系，还是对未来的不确定？',
      '这种压力持续多久了？是一直都有，还是最近才开始的？',
      '你有没有尝试过和领导或同事沟通你的感受？'
    ],
    emotion: [
      '这种情绪是什么时候开始的？是某件事触发的，还是慢慢积累的？',
      '你觉得这种情绪在什么情况下会加重？什么时候会好一些？',
      '你身边有可以倾诉的人吗？'
    ],
    sleep: [
      '失眠的时候，脑子里都在想什么？',
      '你试过什么方法帮助睡眠吗？效果怎么样？',
      '白天的状态受到多大影响？'
    ],
    relationship: [
      '在这段关系中，你最渴望被理解的是什么？',
      '你觉得沟通中最大的障碍是什么？',
      '如果理想状态是10分，现在几分？'
    ],
    family: [
      '你觉得家庭中哪种互动模式最让你困扰？',
      '你有没有尝试过表达自己的感受？结果怎么样？',
      '你觉得家人了解你的真实感受吗？'
    ],
    self_worth: [
      '你觉得「不够好」这个想法，是从什么时候开始的？',
      '如果有一个朋友和你有同样的感受，你会怎么对TA说？',
      '有没有什么时候，你觉得自己其实做得还不错？'
    ],
    meaning: [
      '如果不再被这些困扰影响，你最想做什么？',
      '在你的人生中，有没有什么时刻是觉得特别有意义的？',
      '你觉得什么对你来说是最重要的？'
    ],
    habit: [
      '你觉得是什么在阻碍你改变？',
      '之前有尝试过改变吗？最接近成功的一次是什么情况？',
      '如果明天就能开始改变，你最想先改变什么？'
    ]
  };
  
  if (currentTopic && topicQuestions[currentTopic]) {
    const questions = topicQuestions[currentTopic];
    // 避免重复问同一个问题（检查AI最近的回复中是否已包含类似问题）
    const recentAiText = aiMsgs.slice(-3).map(m => m.text).join(' ');
    const unusedQuestions = questions.filter(q => !recentAiText.includes(q.slice(0, 10)));
    if (unusedQuestions.length > 0) {
      return unusedQuestions[Math.floor(Math.random() * unusedQuestions.length)];
    }
  }
  
  // 通用深度追问
  const generalDeepQuestions = [
    '你觉得这件事对你最大的影响是什么？',
    '你最希望现在的状况有什么改变？',
    '如果有一个你最信任的人在这里，你最想对TA说什么？',
    '在你经历这些的时候，内心最需要的是什么？'
  ];
  
  return generalDeepQuestions[Math.floor(Math.random() * generalDeepQuestions.length)];
}

// ===== 6. 分层共情表达系统 =====
// 实现豆包式的多层次共情：浅层认同→深层理解→行动引导
function generateLayeredEmpathy(userMessage, emotionState, phase) {
  const { current, trend } = emotionState;
  const msg = userMessage.toLowerCase();
  
  // 浅层共情：确认感受（所有情况都先给）
  const shallowEmpathy = generateShallowEmpathy(msg, current);
  
  // 深层共情：理解背后的需求（在exploring/deepening阶段）
  const deepEmpathy = (phase === CONVERSATION_PHASES.EXPLORING || phase === CONVERSATION_PHASES.DEEPENING)
    ? generateDeepEmpathy(msg, current) : null;
  
  // 行动引导：提供具体方向（在supporting阶段或情绪好转时）
  const actionGuidance = (phase === CONVERSATION_PHASES.SUPPORTING || trend === 'improving')
    ? generateActionGuidance(msg, current) : null;
  
  return { shallowEmpathy, deepEmpathy, actionGuidance };
}

function generateShallowEmpathy(msg, emotion) {
  const empathyMap = {
    [EMOTION_TYPES.POSITIVE]: [
      '很高兴你现在的状态不错！',
      '看到你心情有好转，我也很开心。',
      '你的积极状态值得珍惜。'
    ],
    [EMOTION_TYPES.NEUTRAL]: [
      '嗯，我听到了。',
      '谢谢你说出来。',
      '我理解。'
    ],
    [EMOTION_TYPES.MILD_NEGATIVE]: [
      '这种感受我理解，确实不容易。',
      '我听到了，你现在一定有些辛苦。',
      '这种感觉是真实的，不需要否定。'
    ],
    [EMOTION_TYPES.NEGATIVE]: [
      '你的感受是重要的，我在这里陪着你。',
      '这种痛苦我理解，你不需要一个人承受。',
      '我听到了你的痛苦，你的感受值得被认真对待。'
    ],
    [EMOTION_TYPES.SEVERE]: [
      '我听到你了，你现在承受的痛苦是真实的。',
      '你的生命是重要的，你不是一个人。'
    ]
  };
  const options = empathyMap[emotion] || empathyMap[EMOTION_TYPES.NEUTRAL];
  return options[Math.floor(Math.random() * options.length)];
}

function generateDeepEmpathy(msg, emotion) {
  const deepEmpathyMap = {
    [EMOTION_TYPES.MILD_NEGATIVE]: [
      '有时候疲惫不只是身体上的，也是心在说「我需要被看见」。你觉得自己最需要被看见的是什么？',
      '烦躁的背后，往往是有一些需要没有被满足。你觉得是什么需要？',
      '压力之下，我们常常忽略了自己的感受。如果可以对自己说一句话，你想说什么？'
    ],
    [EMOTION_TYPES.NEGATIVE]: [
      '焦虑常常是因为我们在乎，只是「警报」太响了。你最在乎的是什么？',
      '低落的时候，内心最渴望的是什么？有时候答案就藏在这个渴望里。',
      '孤独的感觉很痛，但你在和我说话，说明你内心有一部分在寻找连接。那部分在说什么？'
    ],
    [EMOTION_TYPES.SEVERE]: [
      '你现在的痛苦说明你在承受着很大的东西。你不需要独自面对。',
    ]
  };
  const options = deepEmpathyMap[emotion];
  if (!options) return null;
  return options[Math.floor(Math.random() * options.length)];
}

function generateActionGuidance(msg, emotion) {
  const guidanceMap = {
    [EMOTION_TYPES.MILD_NEGATIVE]: [
      '💡 试试给自己5分钟的「微休息」——什么都不做，只是呼吸。有时候，允许自己停下来就是最好的开始。',
      '💡 可以试试写下现在最让你烦的3件事，然后看看哪些是你能控制的，哪些不能。把精力放在能控制的部分。'
    ],
    [EMOTION_TYPES.NEGATIVE]: [
      '💡 4-7-8呼吸法可以帮助缓解焦虑：吸气4秒→屏住7秒→缓缓呼出8秒。试试做3次，看看身体的感觉有没有变化。',
      '💡 5-4-3-2-1接地练习：说出5个看到的、4个摸到的、3个听到的、2个闻到的、1个尝到的。这能帮你从情绪中回到当下。'
    ],
    [EMOTION_TYPES.POSITIVE]: [
      '💡 积极心理学研究发现，记录每天3件好事能显著提升幸福感。你可以试试今天记录3件让你开心的事。',
    ]
  };
  const options = guidanceMap[emotion];
  if (!options) return null;
  return options[Math.floor(Math.random() * options.length)];
}

// ===== 7. 动态策略调整 =====
// 前几轮开放式收集信息，后续结构化引导（DeepSeek式策略切换）
function getResponseStrategy(messageCount, phase, emotionState) {
  const { current, trend } = emotionState;
  
  // 危机情况：立即结构化引导
  if (current === EMOTION_TYPES.SEVERE) {
    return { type: 'crisis', openRatio: 0, guideRatio: 1.0 };
  }
  
  // 前3轮：开放式为主（70%开放+30%引导）
  if (messageCount <= 3) {
    return { type: 'open_exploring', openRatio: 0.7, guideRatio: 0.3 };
  }
  
  // 4-6轮：平衡（50%开放+50%引导）
  if (messageCount <= 6) {
    return { type: 'balanced', openRatio: 0.5, guideRatio: 0.5 };
  }
  
  // 7轮以上：结构化引导为主（30%开放+70%引导）
  // 除非情绪在恶化，则回到倾听模式
  if (trend === 'worsening') {
    return { type: 'empathy_first', openRatio: 0.7, guideRatio: 0.3 };
  }
  
  return { type: 'structured_guide', openRatio: 0.3, guideRatio: 0.7 };
}

// ===== 8. 容错与修复机制 =====
// 检测对话偏离，主动重定向（DeepSeek式的3轮修复策略）
function detectConversationDrift(messages) {
  if (!Array.isArray(messages)) return { drifting: false };
  const userMsgs = messages.filter(m => m && m.sender === 'user' && m.text);
  if (userMsgs.length < 3) return { drifting: false };
  
  // 检测：用户连续3轮回复都很短（<=5字）且无实质内容
  const recent3 = userMsgs.slice(-3);
  const allShort = recent3.every(m => m.text.trim().length <= 5);
  const hasNoKeywords = recent3.every(m => {
    const msg = m.text.toLowerCase();
    const substantiveKeywords = ['压力', '焦虑', '工作', '关系', '失眠', '低落', '情绪', '烦', '累', '难过', '孤独', '迷茫', '倦怠', '家庭', '感情', '害怕', '担心'];
    return !substantiveKeywords.some(kw => msg.includes(kw));
  });
  
  if (allShort && hasNoKeywords) {
    return { drifting: true, type: 'short_responses' };
  }
  
  // 检测：用户连续表达"不知道"/"没想法"
  const uncertaintyPatterns = ['不知道', '没想法', '随便', '都行', '不确定', '说不上来'];
  const recent2 = userMsgs.slice(-2);
  const allUncertain = recent2.every(m => m.text && uncertaintyPatterns.some(p => m.text.toLowerCase().includes(p)));
  if (allUncertain) {
    return { drifting: true, type: 'uncertainty' };
  }
  
  return { drifting: false };
}

// 生成修复回复
function generateDriftRepair(driftType, currentTopic) {
  if (driftType === 'short_responses') {
    const repairs = [
      '嗯，我注意到你好像不太想多说。没关系的，你可以按照自己的节奏来。\n\n如果你愿意，可以试试点击下面的快捷话题，选一个你感兴趣的聊聊？或者只是告诉我你现在的心情也好。',
      '有时候确实不知道从何说起。不如我提几个方向，你看看哪个最想聊？\n\n1️⃣ 最近工作上的感受\n2️⃣ 和身边人的关系\n3️⃣ 睡眠和身体状态\n4️⃣ 对未来的想法',
      '没关系，不用有压力。你可以先深呼吸一次，然后告诉我：现在最让你不舒服的是什么？哪怕只是一个词也行。'
    ];
    return repairs[Math.floor(Math.random() * repairs.length)];
  }
  
  if (driftType === 'uncertainty') {
    const repairs = [
      '不确定也没关系。有时候感觉是模糊的，不需要马上理清。\n\n不如试试这个：闭上眼睛，感受一下身体哪个部位最不舒服？是胸口闷、肩膀紧、还是头胀？从身体的感觉开始，也许能找到一些线索。',
      '「不知道」本身也是一种答案——说明你可能还在消化这些感受。\n\n我换个方式问：如果0分是完全不好，10分是完全好，你给自己现在的状态打几分？',
      '没关系，我们慢慢来。你可以试着完成这个句子：「如果可以改变一件事，我想要……」——看看脑海中浮现的第一个念头是什么？'
    ];
    return repairs[Math.floor(Math.random() * repairs.length)];
  }
  
  return null;
}

// ========== 增强版AI回复系统 ==========

// 从用户消息中提取关键信息，用于生成更贴切的回复
function extractUserFocus(msg) {
  const focusPatterns = [
    { pattern: /我(.{0,4})(很|特别|非常|太|好)?(累|疲惫|疲倦|精疲力竭)/, focus: '疲惫' },
    { pattern: /我(.{0,4})(很|特别|非常|太)?(烦|烦躁|烦闷|心烦)/, focus: '烦躁' },
    { pattern: /我(.{0,4})(很|特别|非常|太)?(怕|害怕|恐惧|担心)/, focus: '恐惧' },
    { pattern: /我(.{0,4})(想|想要|需要)(.+)/, focus: '需求' },
    { pattern: /我(.{0,4})(不|没)(知道|明白|懂)/, focus: '困惑' },
    { pattern: /我(.{0,4})(觉得|感觉|感到)(.+)/, focus: '感受' },
    { pattern: /(.+)(让我|使我|让我)(.+)/, focus: '影响' },
    { pattern: /不知道(.+)/, focus: '困惑' },
    { pattern: /怎么办(.+)/, focus: '求助' },
  ];
  
  for (const { pattern, focus } of focusPatterns) {
    const match = msg.match(pattern);
    if (match) return { focus, detail: match[0] };
  }
  return null;
}

// 生成上下文感知的通用回复
function generateContextualResponse(userMessage, conversationHistory) {
  const msg = userMessage.toLowerCase();
  const userFocus = extractUserFocus(msg);
  
  // 如果能提取到用户关注点，生成针对性回复
  if (userFocus) {
    const contextualReplies = {
      '疲惫': [
        `你提到${userFocus.detail}，这种疲惫感一定让你很难受。是身体上的累，还是心累？有时候两种疲惫需要的休息方式不一样。\n\n💡 试试「微休息」：给自己5分钟，什么都不做，只是呼吸。`,
        `我听到了，${userFocus.detail}。疲惫是身体在发出信号——它需要被照顾了。\n\n你最近是不是一直在超负荷运转？让我们看看怎么帮你减减负。`
      ],
      '烦躁': [
        `你${userFocus.detail}，这种烦躁的感觉我理解。烦躁往往是因为有些事情没有按照你期望的方式进行。\n\n能说说具体是什么让你烦吗？有时候把烦躁的对象说出来，本身就能缓解一些。`,
        `${userFocus.detail}——先深呼吸一次。烦躁的时候，我们容易做出后悔的决定。\n\n💡 STOP技术：S停下来→T深呼吸→O观察情绪→P选择回应。先让自己稳住，再看看怎么处理。`
      ],
      '恐惧': [
        `你${userFocus.detail}，害怕的感觉很不好受。但你能说出来，说明你在面对它，这很勇敢。\n\n你愿意说说具体在怕什么吗？有时候把恐惧说出来，它就没那么可怕了。`,
        `我理解${userFocus.detail}的感受。恐惧是大脑在保护你，但有时候它的「警报」会过于敏感。\n\n你能分辨出，你害怕的事情是已经发生的，还是你担心可能发生的吗？`
      ],
      '需求': [
        `你${userFocus.detail}——能清楚知道自己需要什么，这很重要。\n\n让我们一起看看，有什么方法可以帮你接近这个需求？`,
        `我听到了你的需要。${userFocus.detail}。有时候把需求说出来，就已经是迈向满足的第一步了。\n\n现在阻碍你得到这些的是什么？`
      ],
      '困惑': [
        `${userFocus.detail}——这种困惑感很常见，说明你在认真思考。\n\n不用急着找答案。能说说具体是什么事情让你困惑吗？有时候理清问题本身，答案就会浮现。`,
        `困惑说明你在思考，这比麻木地接受要好。${userFocus.detail}。\n\n试试把困惑写下来——当问题从脑子里落到纸上，往往就没那么乱了。`
      ],
      '感受': [
        `你${userFocus.detail}。谢谢你说出你的感受，这需要勇气。\n\n这种感受是什么时候开始的？是某件事触发的，还是慢慢积累的？`,
        `我听到了，${userFocus.detail}。你的感受是真实的，不需要否定它。\n\n你觉得这种感受在告诉你什么？有时候情绪背后藏着重要的信息。`
      ],
      '影响': [
        `${userFocus.detail}——这件事对你的影响看来很大。能多说说具体情况吗？\n\n了解完整的情况，我才能更好地陪伴你。`,
        `我理解，${userFocus.detail}。被外界影响情绪是很正常的反应。\n\n你觉得在这件事中，最让你难受的是什么？`
      ],
      '求助': [
        `你在寻求帮助，这本身就是一种力量。能具体说说遇到了什么困难吗？\n\n不同的挑战有不同的应对方式，告诉我更多，我们一起想办法。`
      ]
    };
    
    const replies = contextualReplies[userFocus.focus];
    if (replies) {
      return replies[Math.floor(Math.random() * replies.length)];
    }
  }
  
  // 基于对话历史的上下文回复
  if (conversationHistory && conversationHistory.length >= 2) {
    const lastAiMsg = conversationHistory.filter(m => m && m.sender === 'ai' && m.text).slice(-1)[0];
    if (lastAiMsg) {
      // 如果AI上一轮问了问题，用户可能是在回答
      const aiText = lastAiMsg.text;
      const aiAskedQuestion = aiText.includes('？') || aiText.includes('?') || 
        aiText.includes('说说') || aiText.includes('告诉我') || aiText.includes('是什么');
      
      if (aiAskedQuestion && msg.length > 5) {
        // 用户在回答AI的问题，给予肯定并深入
        const followUpReplies = [
          `谢谢你的分享，我理解了。你说的这些，让你最大的感受是什么？\n\n了解你的感受，能帮我更好地陪伴你。`,
          `我听到了。这种情况确实不容易。你觉得现在最需要的是什么？是有人倾听，还是想找找解决办法？`,
          `谢谢你告诉我这些。你能够这样表达，说明你对自己有很好的觉察。\n\n让我们一起看看，有什么方法可以帮你感觉好一些？`,
          `我理解了你的情况。这确实是一个挑战。你之前有尝试过什么方式来应对吗？`
        ];
        return followUpReplies[Math.floor(Math.random() * followUpReplies.length)];
      }
    }
  }
  
  return null;
}

function getAIResponse(userMessage, mood, messageCount, conversationHistory, conversationState) {
  const msg = (userMessage || '').toLowerCase();
  
  // ===== 获取对话状态（由组件传入），每个独立try-catch防止级联崩溃 =====
  const currentPhase = conversationState?.phase || CONVERSATION_PHASES.GREETING;
  const currentTopic = conversationState?.topic || null;
  const userMemory = conversationState?.memory || loadUserMemory();
  
  let emotionState, tone, strategy;
  try {
    emotionState = trackEmotionTrend(conversationHistory);
  } catch (e) {
    console.error('trackEmotionTrend错误:', e);
    emotionState = { trend: 'stable', current: EMOTION_TYPES.NEUTRAL };
  }
  try {
    tone = getAdaptiveTone(emotionState);
  } catch (e) {
    console.error('getAdaptiveTone错误:', e);
    tone = { warmth: 0.7, directness: 0.6, empathy: 0.7, guidance: 0.6 };
  }
  try {
    strategy = getResponseStrategy(messageCount, currentPhase, emotionState);
  } catch (e) {
    console.error('getResponseStrategy错误:', e);
    strategy = { type: 'balanced', openRatio: 0.5, guideRatio: 0.5 };
  }

  // ===== 优先级0: 容错与修复检测 =====
  let driftResult = { drifting: false };
  try {
    driftResult = detectConversationDrift(conversationHistory);
  } catch (e) {
    console.error('detectConversationDrift错误:', e);
  }
  if (driftResult.drifting) {
    const repair = generateDriftRepair(driftResult.type, currentTopic);
    if (repair) return repair;
  }

  // ===== 优先级1: 危机关键词检测 =====
  if (detectCrisis(msg)) {
    return getCrisisResponse();
  }

  // ===== 优先级2: 基础对话模式 =====
  for (const pattern of basicPatterns) {
    if (pattern.keywords.some(kw => msg.includes(kw))) {
      let response = pattern.responses[Math.floor(Math.random() * pattern.responses.length)];
      // 个性化增强：如果知道用户名字，在问候中加入
      if (userMemory.name && (msg.includes('你好') || msg.includes('嗨') || msg.includes('hi'))) {
        response = `${userMemory.name}，${response}`;
      }
      return response;
    }
  }

  // ===== 优先级3: 文章智能匹配 =====
  let articleMatch = null;
  try {
    articleMatch = matchArticle(userMessage);
  } catch (e) {
    console.error('matchArticle错误:', e);
  }

  // ===== 优先级4: 关键词匹配（专业心理话题） =====
  let baseResponse = null;
  for (const pattern of responsePatterns) {
    if (pattern.keywords.some(kw => msg.includes(kw))) {
      const responses = pattern.responses;
      baseResponse = responses[Math.floor(Math.random() * responses.length)];
      break;
    }
  }

  // ===== 如果有baseResponse，进行多层增强 =====
  if (baseResponse) {
    // 分层共情前缀（基于情感状态）
    let empathy = { shallowEmpathy: null, deepEmpathy: null, actionGuidance: null };
    try {
      empathy = generateLayeredEmpathy(userMessage, emotionState, currentPhase);
    } catch (e) {
      console.error('generateLayeredEmpathy错误:', e);
    }
    let finalResponse = '';
    
    // 浅层共情（总是添加）
    if (empathy.shallowEmpathy && tone.empathy >= 0.7) {
      finalResponse = empathy.shallowEmpathy + '\n\n';
    }
    
    finalResponse += baseResponse;
    
    // 深层共情（exploring/deepening阶段，高共情需求时）
    if (empathy.deepEmpathy && tone.empathy >= 0.85 && Math.random() < 0.5) {
      finalResponse += '\n\n' + empathy.deepEmpathy;
    }
    
    // 流派智能增强（提高概率到60%）
    let schoolMatch = null;
    try {
      schoolMatch = matchSchool(userMessage);
    } catch (e) {
      console.error('matchSchool错误:', e);
    }
    if (schoolMatch && Math.random() < 0.6) {
      try {
        const insight = getSchoolInsight(schoolMatch.school);
        if (insight) {
          finalResponse += '\n\n' + insight;
        }
      } catch (e) {
        console.error('getSchoolInsight错误:', e);
      }
    }
    // 名言增强（提高概率到35%）
    if (schoolMatch && Math.random() < 0.35) {
      try {
        const quote = getRelevantQuote(schoolMatch.quoteScenarios);
        if (quote) {
          finalResponse += '\n\n' + quote;
        }
      } catch (e) {
        console.error('getRelevantQuote错误:', e);
      }
    }
    // 文章增强（提高概率到50%）
    if (articleMatch && Math.random() < 0.5) {
      try {
        const articleEnhancement = getArticleEnhancement(articleMatch);
        if (articleEnhancement) {
          finalResponse += '\n\n' + articleEnhancement;
        }
      } catch (e) {
        console.error('getArticleEnhancement错误:', e);
      }
    }
    
    // 主动追问（基于策略：开放式阶段更可能追问）
    if (strategy.openRatio >= 0.5 && Math.random() < 0.5) {
      try {
        const followUp = generateFollowUpQuestion(userMessage, conversationHistory, currentTopic);
        finalResponse += '\n\n' + followUp;
      } catch (e) {
        console.error('generateFollowUpQuestion错误:', e);
      }
    }
    
    // 行动引导（supporting阶段或情绪好转时，提高概率到50%）
    if (empathy.actionGuidance && tone.guidance >= 0.6 && Math.random() < 0.5) {
      finalResponse += '\n\n' + empathy.actionGuidance;
    }
    
    return finalResponse;
  }

  // ===== 优先级5: 文章suggestedResponse（提高概率到55%） =====
  if (articleMatch && Math.random() < 0.55) {
    try {
      const articleResponse = getArticleFullResponse(articleMatch);
      if (articleResponse) {
        // 追加追问
        if (strategy.openRatio >= 0.5) {
          try {
            const followUp = generateFollowUpQuestion(userMessage, conversationHistory, currentTopic);
            return articleResponse + '\n\n' + followUp;
          } catch (e) {
            return articleResponse;
          }
        }
        return articleResponse;
      }
    } catch (e) {
      console.error('getArticleFullResponse错误:', e);
    }
  }

  // ===== 优先级6: 上下文感知回复 =====
  let contextualResponse = null;
  try {
    contextualResponse = generateContextualResponse(userMessage, conversationHistory);
  } catch (e) {
    console.error('generateContextualResponse错误:', e);
  }
  if (contextualResponse) {
    let finalResponse = contextualResponse;
    
    // 情感自适应：如果情绪恶化，增加共情前缀
    if (emotionState.trend === 'worsening') {
      try {
        const empathy = generateShallowEmpathy(msg, emotionState.current);
        finalResponse = empathy + '\n\n' + finalResponse;
      } catch (e) { /* ignore */ }
    }
    
    // 流派/文章增强（上下文回复也需要知识库支持）
    let schoolMatch6 = null;
    try { schoolMatch6 = matchSchool(userMessage); } catch (e) { /* ignore */ }
    if (articleMatch && Math.random() < 0.4) {
      try {
        const articleEnhancement = getArticleEnhancement(articleMatch);
        if (articleEnhancement) {
          finalResponse += '\n\n' + articleEnhancement;
        }
      } catch (e) { /* ignore */ }
    } else if (schoolMatch6 && Math.random() < 0.5) {
      try {
        const insight = getSchoolInsight(schoolMatch6.school);
        if (insight) {
          finalResponse += '\n\n' + insight;
        }
      } catch (e) { /* ignore */ }
    }
    
    // 策略性追问
    if (strategy.openRatio >= 0.5 && Math.random() < 0.4) {
      try {
        const followUp = generateFollowUpQuestion(userMessage, conversationHistory, currentTopic);
        finalResponse += '\n\n' + followUp;
      } catch (e) { /* ignore */ }
    }
    
    return finalResponse;
  }

  // ===== 优先级7: 简短回复+主动追问 =====
  if (msg.length <= 5) {
    const shortReplies = [
      '嗯，我在听。能多说一些吗？',
      '我理解。你想表达的是什么呢？',
      '谢谢你的回应。能告诉我更多细节吗？',
      '我在。不用急，慢慢说。'
    ];
    let response = shortReplies[Math.floor(Math.random() * shortReplies.length)];
    
    // 主动追问：基于当前话题
    if (currentTopic) {
      try {
        const followUp = generateFollowUpQuestion(userMessage, conversationHistory, currentTopic);
        response += '\n\n' + followUp;
      } catch (e) { /* ignore */ }
    }
    
    return response;
  }

  // ===== 优先级8: 通用回复+多层增强 =====
  const userWords = msg.replace(/[，。！？、；：""''（）\[\]{}.,!?;:'"()\s]/g, '').slice(0, 20);
  
  // 基于对话阶段和策略选择不同的通用回复风格
  let generalBase;
  
  if (currentPhase === CONVERSATION_PHASES.DEEPENING) {
    // 深入阶段：更多共情和探索
    const deepReplies = [
      `你提到了「${userWords.slice(0, 8)}……」，这对你来说意味着什么？`,
      `谢谢你愿意深入分享。在这件事中，你内心最深的感受是什么？`,
      `我听到了。你觉得这些感受背后，隐藏着什么样的需要？`,
      `你能说出这些，说明你在认真面对自己。这种感受是什么时候开始的？`
    ];
    generalBase = deepReplies[Math.floor(Math.random() * deepReplies.length)];
  } else if (currentPhase === CONVERSATION_PHASES.SUPPORTING) {
    // 支持阶段：更多引导
    const supportReplies = [
      `我理解你的感受。让我们一起来看看，有什么具体的步骤可以帮你感觉好一些？`,
      `你说的这些我都记住了。现在，你愿意试试一个小方法吗？`,
      `谢谢你告诉我。基于你说的，我想给你一个建议——`,
      `你的感受值得被认真对待。接下来我们可以一起找找解决办法。`
    ];
    generalBase = supportReplies[Math.floor(Math.random() * supportReplies.length)];
  } else if (currentPhase === CONVERSATION_PHASES.CLOSING) {
    // 收尾阶段：温暖总结
    const closingReplies = [
      `谢谢你今天的分享。记住，任何时候你需要，我都在这里 💚`,
      `和你聊天很愉快。照顾好自己，有需要随时来找我 🤗`,
      `你今天的勇气——愿意表达和寻求支持——本身就是一种力量。保重 💚`
    ];
    generalBase = closingReplies[Math.floor(Math.random() * closingReplies.length)];
  } else {
    // 探索阶段：开放式引导（减少机械反问，增加自然回应）
    const echoReplies = [
      `嗯，我听到了。你想多说说吗？我在听 💚`,
      `谢谢你愿意和我分享。不管你想聊什么，我都在这里。`,
      `我理解。这种情况确实不容易。你想继续聊聊，还是换个话题？`,
      `你的感受值得被认真对待。不用急，慢慢说就好。`,
      `我听到了。你愿意多说一些吗？或者我们可以从你感兴趣的话题开始。`,
      `谢谢你信任我。如果不知道从何说起，也可以随便聊聊今天发生了什么。`
    ];
    generalBase = echoReplies[Math.floor(Math.random() * echoReplies.length)];
  }
  
  // 分层共情增强
  let empathy8 = { shallowEmpathy: null, deepEmpathy: null, actionGuidance: null };
  try {
    empathy8 = generateLayeredEmpathy(userMessage, emotionState, currentPhase);
  } catch (e) {
    console.error('generateLayeredEmpathy错误(优先级8):', e);
  }
  if (empathy8.shallowEmpathy && tone.empathy >= 0.7) {
    generalBase = empathy8.shallowEmpathy + '\n\n' + generalBase;
  }
  
  // 流派/文章增强（提高概率，确保给到有用的建议）
  let schoolMatch8 = null;
  try { schoolMatch8 = matchSchool(userMessage); } catch (e) { /* ignore */ }
  if (articleMatch && Math.random() < 0.5) {
    try {
      const articleEnhancement = getArticleEnhancement(articleMatch);
      if (articleEnhancement) {
        generalBase += '\n\n' + articleEnhancement;
      }
    } catch (e) { /* ignore */ }
  } else if (schoolMatch8 && Math.random() < 0.5) {
    try {
      const insight = getSchoolInsight(schoolMatch8.school);
      if (insight) {
        generalBase += '\n\n' + insight;
      }
    } catch (e) { /* ignore */ }
  }
  
  // 主动追问
  if (strategy.openRatio >= 0.5 && Math.random() < 0.4) {
    try {
      const followUp = generateFollowUpQuestion(userMessage, conversationHistory, currentTopic);
      generalBase += '\n\n' + followUp;
    } catch (e) { /* ignore */ }
  }
  
  // 行动引导（提高概率到45%）
  if (empathy8.actionGuidance && tone.guidance >= 0.6 && Math.random() < 0.45) {
    generalBase += '\n\n' + empathy8.actionGuidance;
  }
  
  return generalBase;
}

// ===== 打字机效果 =====
// 使用闭包追踪定时器ID，支持外部取消
function startTypingAnimation(fullText, setDisplayedText, setTypingMessageId, onComplete, timerRef) {
  let currentIndex = 0;
  const totalLen = fullText.length;
  // 根据文本长度动态调整速度：短文本慢打，长文本快打
  const baseSpeed = totalLen > 200 ? 8 : totalLen > 100 ? 12 : 18;
  let timerId = null;
  
  const animate = () => {
    if (currentIndex < totalLen) {
      // 长文本时每5个字符批量显示，加速体验
      const step = totalLen > 300 ? 3 : totalLen > 150 ? 2 : 1;
      currentIndex = Math.min(currentIndex + step, totalLen);
      setDisplayedText(fullText.slice(0, currentIndex));
      
      // 根据当前字符调整速度
      const currentChar = fullText[currentIndex - 1];
      let nextDelay = baseSpeed;
      if (currentChar === '\n') nextDelay = baseSpeed * 3; // 换行暂停
      else if (currentChar === '。' || currentChar === '！' || currentChar === '？') nextDelay = baseSpeed * 2.5; // 句末暂停
      else if (currentChar === '，' || currentChar === '、' || currentChar === '；') nextDelay = baseSpeed * 1.5; // 逗号小暂停
      
      timerId = setTimeout(animate, nextDelay);
      if (timerRef) timerRef.current = timerId;
    } else {
      setTypingMessageId(null);
      if (timerRef) timerRef.current = null;
      if (onComplete) onComplete();
    }
  };
  
  timerId = setTimeout(animate, 80); // 初始小延迟
  if (timerRef) timerRef.current = timerId;
}

// ===== 简易Markdown渲染（安全版） =====
function renderMarkdown(text) {
  if (!text) return '';
  
  let html = text;
  
  // 转义HTML特殊字符防止XSS
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  // 粗体 **text**
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  
  // 行内代码 `code`
  html = html.replace(/`(.+?)`/g, '<code>$1</code>');
  
  // 换行处理
  html = html.replace(/\n\n/g, '\n<div class="msg-paragraph-gap"></div>\n');
  html = html.replace(/\n/g, '<br/>');
  
  // 列表项
  html = html.replace(/<br\/>\s*[-•]\s*/g, '<br/><span class="msg-list-bullet">•</span> ');
  html = html.replace(/<br\/>\s*(\d+)\.\s*/g, '<br/><span class="msg-list-number">$1.</span> ');
  
  return html;
}

// ===== 智能快捷回复生成 =====
function generateQuickReplies(aiMessage, currentTopic, mood) {
  const replies = [];
  const msg = aiMessage.toLowerCase();
  
  // 基于AI消息中的问题生成回复
  if (msg.includes('能说说') || msg.includes('告诉我更多') || msg.includes('展开说说')) {
    replies.push({ text: '让我想想怎么表达...', type: 'bridge' });
  }
  if (msg.includes('什么时候开始') || msg.includes('持续多久')) {
    replies.push({ text: '大概有一段时间了', type: 'time' });
    replies.push({ text: '最近才开始的', type: 'time' });
  }
  if (msg.includes('尝试过') || msg.includes('做过什么')) {
    replies.push({ text: '试过一些方法', type: 'coping' });
    replies.push({ text: '还没尝试过', type: 'coping' });
  }
  if (msg.includes('最困扰') || msg.includes('最让你')) {
    replies.push({ text: '最困扰的是情绪方面', type: 'focus' });
    replies.push({ text: '最困扰的是工作方面', type: 'focus' });
  }
  
  // 基于话题的快捷回复
  if (currentTopic) {
    const topicReplies = {
      work_stress: [
        { text: '工作量太大了', type: 'detail' },
        { text: '和领导关系紧张', type: 'detail' },
        { text: '对未来很迷茫', type: 'detail' }
      ],
      emotion: [
        { text: '情绪波动很大', type: 'detail' },
        { text: '总是感到焦虑', type: 'detail' },
        { text: '提不起精神', type: 'detail' }
      ],
      sleep: [
        { text: '入睡困难', type: 'detail' },
        { text: '半夜经常醒', type: 'detail' },
        { text: '早上醒太早', type: 'detail' }
      ],
      relationship: [
        { text: '沟通总是吵架', type: 'detail' },
        { text: '感觉不被理解', type: 'detail' },
        { text: '不知道该不该继续', type: 'detail' }
      ],
      self_worth: [
        { text: '总觉得自己不够好', type: 'detail' },
        { text: '害怕被评价', type: 'detail' },
        { text: '追求完美到很累', type: 'detail' }
      ]
    };
    
    if (topicReplies[currentTopic]) {
      const available = topicReplies[currentTopic].filter(r => !replies.some(er => er.type === r.type));
      replies.push(...available.slice(0, 2));
    }
  }
  
  // 通用快捷回复（始终提供）
  const generalReplies = [
    { text: '我想聊聊别的', type: 'switch' },
    { text: '给我一个小建议', type: 'tip' },
    { text: '谢谢，我感觉好些了', type: 'positive' }
  ];
  
  // 如果已有3个以上特定回复，只加1个通用回复
  if (replies.length >= 3) {
    replies.push(generalReplies[Math.floor(Math.random() * generalReplies.length)]);
  } else {
    replies.push(...generalReplies.slice(0, 2));
  }
  
  return replies.slice(0, 4); // 最多显示4个
}

// ===== 对话摘要生成 =====
function generateSessionSummary(messages) {
  if (!messages || messages.length === 0) return null;
  
  const userMsgs = messages.filter(m => m.sender === 'user');
  if (userMsgs.length === 0) return null;
  
  // 提取关键话题
  const allText = userMsgs.map(m => m.text).join(' ').toLowerCase();
  const topics = [];
  
  const topicKeywords = {
    '工作压力': ['工作', '加班', '压力', '忙', 'deadline', '996'],
    '焦虑': ['焦虑', '不安', '担心', '紧张', '害怕'],
    '情绪低落': ['低落', '难过', '沮丧', '不开心', '想哭'],
    '睡眠问题': ['失眠', '睡不着', '早醒', '睡眠'],
    '人际关系': ['同事', '领导', '关系', '冲突', '沟通'],
    '职业倦怠': ['倦怠', '没动力', '迷茫', '想辞职'],
    '自我价值': ['不够好', '自卑', '不配', '完美主义'],
  };
  
  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some(kw => allText.includes(kw))) {
      topics.push(topic);
    }
  }
  
  // 提取用户情绪
  const moodEmojis = messages.filter(m => m.sender === 'user').slice(0, 1);
  
  return {
    messageCount: userMsgs.length,
    topics: topics.slice(0, 3),
    lastMessage: userMsgs[userMsgs.length - 1]?.text?.slice(0, 30) + (userMsgs[userMsgs.length - 1]?.text?.length > 30 ? '...' : ''),
    firstMood: messages[0]?.text?.match(/[😊😌😔😰😤😴]/)?.[0] || null
  };
}

function formatTime(date) {
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
}

export default function Chat() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // ===== 检测是否有保存的对话 =====
  const savedSession = loadChatSession();
  const hasSavedSession = !!(savedSession && savedSession.messages && savedSession.messages.length > 0);
  
  const [mood, setMood] = useState(hasSavedSession ? savedSession.mood : null);
  const [messages, setMessages] = useState(hasSavedSession ? savedSession.messages : []);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTopics, setShowTopics] = useState(!hasSavedSession);
  const [tipCount, setTipCount] = useState(0);
  const messagesEndRef = useRef(null);
  const chatMessagesRef = useRef(null);

  // ===== 打字机效果状态 =====
  const [typingMessageId, setTypingMessageId] = useState(null);
  const [displayedText, setDisplayedText] = useState('');
  const typingTimerRef = useRef(null);
  const abortControllerRef = useRef(null); // AI流式请求取消控制器

  // ===== 智能快捷回复状态 =====
  const [quickReplies, setQuickReplies] = useState([]);

  // ===== 消息反馈状态 =====
  const [messageFeedback, setMessageFeedback] = useState({});

  // ===== 滚动到底部按钮状态 =====
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  // ===== 输入框自适应 =====
  const textareaRef = useRef(null);
  
  // ===== 深度对话系统状态 =====
  const [conversationPhase, setConversationPhase] = useState(
    hasSavedSession ? (savedSession.conversationPhase || CONVERSATION_PHASES.EXPLORING) : CONVERSATION_PHASES.GREETING
  );
  const [currentTopic, setCurrentTopic] = useState(
    hasSavedSession ? (savedSession.currentTopic || null) : null
  );
  const [userMemory, setUserMemory] = useState(() => loadUserMemory());
  
  // ===== 回访状态 =====
  const [showWelcomeBack, setShowWelcomeBack] = useState(hasSavedSession);

  // ===== 助手命名功能 =====
  const [aiName, setAiName] = useState(() => loadAIName());
  const [showNameModal, setShowNameModal] = useState(false);
  const [nameInput, setNameInput] = useState('');

  const handleNameSubmit = () => {
    const trimmed = nameInput.trim();
    if (trimmed && trimmed.length <= 8) {
      setAiName(trimmed);
      saveAIName(trimmed);
      setShowNameModal(false);
      setNameInput('');
    }
  };

  const handleNameReset = () => {
    setAiName(DEFAULT_AI_NAME);
    saveAIName(DEFAULT_AI_NAME);
    setShowNameModal(false);
    setNameInput('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // ===== 自动保存对话历史 =====
  useEffect(() => {
    if (messages.length > 0 && mood) {
      saveChatSession({
        messages,
        mood,
        conversationPhase,
        currentTopic,
        savedAt: new Date().toISOString()
      });
    }
  }, [messages, mood, conversationPhase, currentTopic]);

  // 组件加载时更新访问次数
  useEffect(() => {
    if (user) {
      const updatedMemory = { ...userMemory, visitCount: (userMemory.visitCount || 0) + 1 };
      setUserMemory(updatedMemory);
      saveUserMemory(updatedMemory);
    }
  }, []);

  // ===== 回访处理：继续对话 =====
  const handleContinueChat = () => {
    setShowWelcomeBack(false);
    // 添加欢迎回来的AI消息
    const welcomeMsg = generateWelcomeBackMessage(userMemory, currentTopic);
    const aiMsg = {
      id: Date.now(),
      sender: 'ai',
      text: welcomeMsg,
      time: formatTime(new Date())
    };
    setMessages(prev => [...prev, aiMsg]);
    // 滚动到底部
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // ===== 回访处理：重新开始 =====
  const handleStartFresh = () => {
    clearChatSession();
    setShowWelcomeBack(false);
    setMood(null);
    setMessages([]);
    setShowTopics(true);
    setTipCount(0);
    setConversationPhase(CONVERSATION_PHASES.GREETING);
    setCurrentTopic(null);
  };

  const handleMoodSelect = (selectedMood) => {
    setMood(selectedMood);
    const responses = moodResponses[selectedMood.level];
    const aiReply = responses[Math.floor(Math.random() * responses.length)];
    
    // 个性化开场：如果之前有记忆，加入个性化问候
    const personalizedGreeting = getPersonalizedGreeting(userMemory);
    const greetingPrefix = personalizedGreeting ? `${personalizedGreeting}\n\n` : '';
    
    // 更新对话阶段
    setConversationPhase(CONVERSATION_PHASES.GREETING);

    setMessages([
      {
        id: 1,
        sender: 'ai',
        text: `${greetingPrefix}你好呀，我是${aiName}，你的AI心灵伙伴 🤗\n\n我看到你今天的心情是 ${selectedMood.emoji} ${selectedMood.label}。\n\n${aiReply}`,
        time: formatTime(new Date())
      }
    ]);
    setShowTopics(true);
  };

  const handleTopicClick = (topic) => {
    handleSend(topic.text);
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

    // ===== 更新个性化记忆 =====
    const updatedMemory = extractMemoryFromMessage(text, userMemory);
    if (JSON.stringify(updatedMemory) !== JSON.stringify(userMemory)) {
      setUserMemory(updatedMemory);
      saveUserMemory(updatedMemory);
    }

    // 先计算包含新消息的完整对话历史
    const newMessages = [...messages, userMsg];
    
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);
    setShowTopics(false);
    setQuickReplies([]); // 清除快捷回复

    // ===== 更新对话状态 =====
    const newPhase = determineConversationPhase(newMessages.length, newMessages, conversationPhase);
    setConversationPhase(newPhase);
    
    // 更新话题追踪
    const topicResult = detectTopicSwitch(newMessages, currentTopic);
    if (topicResult.switched && topicResult.newTopic) {
      setCurrentTopic(topicResult.newTopic);
    } else if (!currentTopic) {
      const detectedTopic = detectCurrentTopic(newMessages);
      if (detectedTopic) setCurrentTopic(detectedTopic);
    }

    // ===== 取消进行中的流式请求 =====
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // ===== AI流式回复（优先） + 规则引擎兜底 =====
    if (AI_ENABLED) {
      // 尝试AI流式回复
      const aiMsgId = Date.now() + 1;
      let firstChunkReceived = false;

      // RAG检索：从知识库获取相关上下文
      const { context: knowledgeContext } = retrieveKnowledgeContext(text);

      streamAIResponse(
        text,
        newMessages,
        knowledgeContext, // RAG增强：注入知识库上下文
        // onChunk: 流式更新显示文本
        (accumulatedText, isThinking) => {
          if (!firstChunkReceived) {
            firstChunkReceived = true;
            // 第一个chunk到达，创建AI消息占位
            const aiMsg = {
              id: aiMsgId,
              sender: 'ai',
              text: isThinking ? '🤔 思考中...' : accumulatedText,
              time: formatTime(new Date()),
              isTyping: true
            };
            setMessages(prev => [...prev, aiMsg]);
            setTypingMessageId(aiMsgId);
            setDisplayedText(isThinking ? '' : accumulatedText);
            setIsTyping(false); // 隐藏"思考中"指示器
          } else if (isThinking) {
            // 思考阶段，保持思考提示
            setMessages(prev => prev.map(m =>
              m.id === aiMsgId ? { ...m, text: '🤔 思考中...' } : m
            ));
          } else {
            // 后续chunk，实时更新显示文本
            setDisplayedText(accumulatedText);
            // 同步更新消息文本（用于对话历史）
            setMessages(prev => prev.map(m =>
              m.id === aiMsgId ? { ...m, text: accumulatedText } : m
            ));
          }
        },
        // onComplete: 流式完成
        (finalText) => {
          setTypingMessageId(null);
          setDisplayedText('');
          setMessages(prev => prev.map(m =>
            m.id === aiMsgId ? { ...m, text: finalText, isTyping: false } : m
          ));
          // 生成智能快捷回复
          const replies = generateQuickReplies(finalText, topicResult.newTopic || currentTopic, mood);
          setQuickReplies(replies);
          abortControllerRef.current = null;

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
        },
        // onError: 降级到规则引擎
        (error) => {
          console.warn('AI流式回复失败，降级到规则引擎:', error.message);
          setIsTyping(true); // 重新显示"思考中"
          fallbackToRuleEngine(text, newMessages, newPhase, topicResult, updatedMemory);
        }
      );
    } else {
      // AI未启用，直接使用规则引擎
      fallbackToRuleEngine(text, newMessages, newPhase, topicResult, updatedMemory);
    }
  };

  // ===== 规则引擎兜底回复 =====
  const fallbackToRuleEngine = (text, newMessages, newPhase, topicResult, updatedMemory) => {
    const delay = 800 + Math.random() * 1500;
    setTimeout(() => {
      try {
        const conversationState = {
          phase: newPhase,
          topic: topicResult.newTopic || currentTopic,
          memory: updatedMemory
        };
        const aiText = getAIResponse(text, mood, newMessages.length, newMessages, conversationState);
        const aiMsgId = Date.now() + 1;
        const aiMsg = {
          id: aiMsgId,
          sender: 'ai',
          text: aiText || '我听到了你说的话，能再多告诉我一些吗？',
          time: formatTime(new Date()),
          isTyping: true
        };
        setMessages(prev => [...prev, aiMsg]);
        
        // 启动打字机动画
        setTypingMessageId(aiMsgId);
        setDisplayedText('');
        startTypingAnimation(
          aiMsg.text,
          setDisplayedText,
          setTypingMessageId,
          () => {
            setMessages(prev => prev.map(m =>
              m.id === aiMsgId ? { ...m, isTyping: false } : m
            ));
            const replies = generateQuickReplies(aiMsg.text, topicResult.newTopic || currentTopic, mood);
            setQuickReplies(replies);
          },
          typingTimerRef
        );
      } catch (e) {
        console.error('AI回复生成错误:', e);
        const fallbackReplies = [
          '我听到了你说的话。能再多告诉我一些吗？我想更好地理解你的感受。',
          '谢谢你的分享。你愿意继续说说吗？我在认真听着。',
          '我理解。你能展开说说吗？这样我能更好地陪伴你。',
          '你说的这些很重要。能告诉我更多细节吗？'
        ];
        const fallbackMsg = {
          id: Date.now() + 1,
          sender: 'ai',
          text: fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)],
          time: formatTime(new Date())
        };
        setMessages(prev => [...prev, fallbackMsg]);
        setQuickReplies([{ text: '让我想想...', type: 'bridge' }, { text: '谢谢', type: 'positive' }]);
      }
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

  // ===== 快捷回复点击处理 =====
  const handleQuickReply = (replyText) => {
    setQuickReplies([]);
    handleSend(replyText);
  };

  // ===== 消息反馈处理 =====
  const handleFeedback = (messageId, feedbackType) => {
    setMessageFeedback(prev => ({ ...prev, [messageId]: feedbackType }));
    // 如果反馈为负面，给出改进回应
    if (feedbackType === 'negative') {
      const improveReplies = [
        '谢谢你的反馈，我会继续努力。能告诉我哪方面可以改进吗？',
        '抱歉没有帮到你。你更希望我怎么回应呢？',
        '我理解，有时候我的回答可能不够贴切。你想聊点别的吗？'
      ];
      setTimeout(() => {
        const aiMsg = {
          id: Date.now(),
          sender: 'ai',
          text: improveReplies[Math.floor(Math.random() * improveReplies.length)],
          time: formatTime(new Date())
        };
        setMessages(prev => [...prev, aiMsg]);
      }, 800);
    } else if (feedbackType === 'positive') {
      // 正面反馈：温暖回应
      const positiveReplies = [
        '谢谢你的肯定 💚 你的反馈让我更有动力了。',
        '很高兴能帮到你！如果还有其他想聊的，随时告诉我。'
      ];
      setTimeout(() => {
        const aiMsg = {
          id: Date.now(),
          sender: 'ai',
          text: positiveReplies[Math.floor(Math.random() * positiveReplies.length)],
          time: formatTime(new Date())
        };
        setMessages(prev => [...prev, aiMsg]);
      }, 800);
    }
  };

  // ===== 滚动检测 =====
  const handleScroll = () => {
    if (!chatMessagesRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatMessagesRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollBottom(!isNearBottom);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // ===== 输入框自适应高度 =====
  const handleInputChange = (e) => {
    setInput(e.target.value);
    // 自适应高度
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  // ===== 清理打字机定时器和流式请求 =====
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleReset = () => {
    clearChatSession();
    setMood(null);
    setMessages([]);
    setShowTopics(true);
    setTipCount(0);
    // 重置对话状态
    setConversationPhase(CONVERSATION_PHASES.GREETING);
    setCurrentTopic(null);
    // 重置新增状态
    setQuickReplies([]);
    setMessageFeedback({});
    setTypingMessageId(null);
    setDisplayedText('');
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
  };

  // 欢迎回来界面（有保存的对话时显示）
  if (showWelcomeBack && hasSavedSession) {
    const lastTime = savedSession.savedAt ? new Date(savedSession.savedAt) : null;
    const timeStr = lastTime 
      ? `上次聊天：${lastTime.toLocaleDateString('zh-CN')} ${lastTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`
      : '';
    const msgCount = savedSession.messages ? savedSession.messages.filter(m => m.sender === 'user').length : 0;
    const summary = generateSessionSummary(savedSession.messages);
    
    return (
      <div className="chat-mood-page">
        <div className="mood-card">
          <div className="mood-ai-avatar">{AI_AVATAR}</div>
          <h1>欢迎回来</h1>
          <p className="welcome-back-subtitle">我还在这里等你 🤗</p>
          {timeStr && <p className="welcome-back-time">{timeStr}</p>}
          {msgCount > 0 && <p className="welcome-back-info">上次我们聊了{msgCount}轮，有{savedSession.mood ? `${savedSession.mood.emoji} ${savedSession.mood.label}` : ''}的心情</p>}
          
          {/* 对话摘要 */}
          {summary && summary.topics.length > 0 && (
            <div className="session-summary">
              <p className="summary-title">📋 上次聊到</p>
              <div className="summary-tags">
                {summary.topics.map((topic, i) => (
                  <span key={i} className="summary-tag">{topic}</span>
                ))}
              </div>
              {summary.lastMessage && (
                <p className="summary-last">「{summary.lastMessage}」</p>
              )}
            </div>
          )}
          
          <div className="mood-divider"></div>
          <div className="welcome-back-actions">
            <button className="btn-continue" onClick={handleContinueChat}>
              💬 继续上次对话
            </button>
            <button className="btn-fresh" onClick={handleStartFresh}>
              🔄 选择新的心情
            </button>
          </div>
          <p className="mood-privacy">🔒 你的对话内容完全保密，仅保存在本地</p>
        </div>
      </div>
    );
  }

  // 心情选择页
  if (!mood) {
    return (
      <div className="chat-mood-page">
        <div className="mood-card">
          <div className="mood-ai-avatar">{AI_AVATAR}</div>
          <h1>嗨，我是{aiName}</h1>
          <p className="mood-rename-hint" onClick={() => { setNameInput(aiName === DEFAULT_AI_NAME ? '' : aiName); setShowNameModal(true); }}>✏️ 给我取个名字</p>
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
            <h3>{aiName}</h3>
            <span className="ch-status">
              <span className="status-dot"></span>
              {typingMessageId ? `${aiName}正在输入...` : (AI_ENABLED ? '在线 · AI增强模式' : '在线 · 随时倾听')}
            </span>
          </div>
        </div>
        <div className="chat-header-right">
          <span className="ch-mood-badge">{mood.emoji} {mood.label}</span>
          <button className="ch-name-edit" onClick={() => { setNameInput(aiName === DEFAULT_AI_NAME ? '' : aiName); setShowNameModal(true); }} title="给助手取名">
            ✏️
          </button>
          <button className="ch-reset" onClick={handleReset}>
            重新开始
          </button>
        </div>
      </div>

      <div className="chat-messages" ref={chatMessagesRef} onScroll={handleScroll}>
        {messages.map(msg => {
          // 打字机效果：正在打字的消息显示逐字内容
          const isCurrentlyTyping = msg.id === typingMessageId;
          const displayText = isCurrentlyTyping ? displayedText : msg.text;
          
          // 消息类型检测
          const isCrisisMsg = msg.sender === 'ai' && msg.text && crisisKeywords.some(kw => msg.text.includes(kw));
          const isTipMsg = msg.sender === 'tip';
          
          return (
            <div key={msg.id} className={`message ${msg.sender} ${isCrisisMsg ? 'crisis' : ''} ${isTipMsg ? 'tip' : ''}`}>
              {msg.sender === 'ai' && (
                <span className="msg-ai-avatar">{AI_AVATAR}</span>
              )}
              <div className="msg-content">
                <div 
                  className={`msg-bubble ${isCurrentlyTyping ? 'typing-active' : ''}`}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(displayText || '') }}
                />
                {!isCurrentlyTyping && <span className="msg-time">{msg.time}</span>}
                {/* 消息反馈按钮（仅AI消息，打字完成后显示） */}
                {msg.sender === 'ai' && !isCurrentlyTyping && !isTipMsg && (
                  <div className="msg-feedback">
                    <button 
                      className={`feedback-btn ${messageFeedback[msg.id] === 'positive' ? 'active' : ''}`}
                      onClick={() => handleFeedback(msg.id, 'positive')}
                      title="有帮助"
                    >
                      👍
                    </button>
                    <button 
                      className={`feedback-btn ${messageFeedback[msg.id] === 'negative' ? 'active' : ''}`}
                      onClick={() => handleFeedback(msg.id, 'negative')}
                      title="没帮助"
                    >
                      👎
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
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

      {/* 滚动到底部按钮 */}
      {showScrollBottom && (
        <button className="scroll-bottom-btn" onClick={scrollToBottom}>
          ↓ 最新消息
        </button>
      )}

      {/* 智能快捷回复 */}
      {quickReplies.length > 0 && !typingMessageId && (
        <div className="quick-replies">
          {quickReplies.map((reply, i) => (
            <button 
              key={i} 
              className="quick-reply-btn"
              onClick={() => handleQuickReply(reply.text)}
            >
              {reply.text}
            </button>
          ))}
        </div>
      )}

      {showTopics && messages.length <= 4 && quickReplies.length === 0 && (
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
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="说说你的感受..."
          rows={1}
        />
        <button className="send-btn" onClick={() => handleSend()} disabled={!input.trim()}>
          发送
        </button>
      </div>

      {/* 命名弹窗 */}
      {showNameModal && (
        <div className="name-modal-overlay" onClick={() => setShowNameModal(false)}>
          <div className="name-modal" onClick={e => e.stopPropagation()}>
            <h3>给你的AI伙伴取个名字</h3>
            <p>一个专属的名字，让陪伴更温暖</p>
            <input
              className="name-modal-input"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleNameSubmit(); }}
              placeholder="输入名字（最多8个字）"
              maxLength={8}
              autoFocus
            />
            <div className="name-modal-btns">
              {aiName !== DEFAULT_AI_NAME && (
                <button className="name-modal-reset" onClick={handleNameReset}>
                  恢复默认
                </button>
              )}
              <button className="name-modal-cancel" onClick={() => setShowNameModal(false)}>
                取消
              </button>
              <button className="name-modal-confirm" onClick={handleNameSubmit} disabled={!nameInput.trim()}>
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
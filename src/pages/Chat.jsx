import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import knowledgeBase from '../data/knowledge/index';
import psychologySchools from '../data/knowledge/psychologySchools';
import psychologistQuotes from '../data/knowledge/psychologistQuotes';
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

// ========== 增强版AI回复系统 ==========
function getAIResponse(userMessage, mood, messageCount) {
  const msg = userMessage.toLowerCase();

  // 优先检测危机关键词
  if (detectCrisis(msg)) {
    return getCrisisResponse();
  }

  // 检查关键词匹配（原有逻辑）
  let baseResponse = null;
  for (const pattern of responsePatterns) {
    if (pattern.keywords.some(kw => msg.includes(kw))) {
      const responses = pattern.responses;
      baseResponse = responses[Math.floor(Math.random() * responses.length)];
      break;
    }
  }

  // 流派智能增强（约40%概率追加流派洞察，避免每条回复都过长）
  if (baseResponse) {
    const schoolMatch = matchSchool(userMessage);
    if (schoolMatch && Math.random() < 0.4) {
      const insight = getSchoolInsight(schoolMatch.school);
      if (insight) {
        baseResponse += '\n\n' + insight;
      }
    }
    // 约25%概率追加名言（与流派增强独立）
    if (schoolMatch && Math.random() < 0.25) {
      const quote = getRelevantQuote(schoolMatch.quoteScenarios);
      if (quote) {
        baseResponse += '\n\n' + quote;
      }
    }
    return baseResponse;
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

  // 通用回复（也尝试流派增强）
  const generalBase = generalResponses[Math.floor(Math.random() * generalResponses.length)];
  const schoolMatch = matchSchool(userMessage);
  if (schoolMatch && Math.random() < 0.3) {
    const insight = getSchoolInsight(schoolMatch.school);
    if (insight) {
      return generalBase + '\n\n' + insight;
    }
  }
  return generalBase;
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
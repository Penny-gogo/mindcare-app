import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState, useRef, useEffect } from 'react';
import psychologySchools from '../../data/knowledge/psychologySchools';
import psychologistQuotes from '../../data/knowledge/psychologistQuotes';
import articleCollectionData from '../../data/knowledge/articleCollection';
import './index.scss';

const articleCollection = articleCollectionData;

const DEFAULT_AI_NAME = '小暖';
const AI_AVATAR = '🤗';
const AI_NAME_KEY = 'mindcare_ai_name';
const CHAT_HISTORY_KEY = 'mindcare_chat_history';

const moodOptions = [
  { emoji: '😊', label: '开心', level: 'good' },
  { emoji: '😌', label: '平静', level: 'good' },
  { emoji: '😔', label: '低落', level: 'low' },
  { emoji: '😰', label: '焦虑', level: 'anxious' },
  { emoji: '😤', label: '烦躁', level: 'stressed' },
  { emoji: '😴', label: '疲惫', level: 'tired' },
];

const quickTopics = [
  { icon: '💼', text: '工作压力', keywords: ['压力', '工作', '加班', '任务'] },
  { icon: '👥', text: '人际关系', keywords: ['同事', '领导', '沟通', '冲突'] },
  { icon: '😰', text: '焦虑不安', keywords: ['焦虑', '不安', '担心', '紧张'] },
  { icon: '😴', text: '睡眠问题', keywords: ['失眠', '睡不着', '早醒', '噩梦'] },
  { emoji: '💔', text: '情绪低落', keywords: ['低落', '难过', '沮丧', '无助'] },
  { icon: '🔥', text: '职业倦怠', keywords: ['倦怠', '没动力', '迷茫', '瓶颈'] },
];

// 危机关键词检测
const crisisKeywords = ['自杀', '不想活', '活不下去', '想死', '结束生命', '自残', '伤害自己'];
function detectCrisis(msg: string) {
  return crisisKeywords.some(kw => msg.includes(kw));
}
function getCrisisResponse() {
  return '我听到你了，你现在一定承受着巨大的痛苦。你的感受是真实的，你的生命是重要的。\n\n请现在拨打以下热线，会有专业的人陪伴你：\n📞 全国心理援助热线：400-161-9995（24小时）\n📞 北京回龙观医院危机干预：010-82951332\n\n你不是一个人，请给自己一个机会，让专业的人帮助你。';
}

// 基于知识库的智能回复系统
const responsePatterns = [
  {
    keywords: ['压力', '工作压力', '压力大'],
    responses: [
      '我听到你了，工作压力确实让人喘不过气来。能跟我说说，最近是什么事情让你感觉压力特别大吗？\n\n💡 试试CBT的「认知三角」：当你感到压力时，注意自己的想法→情绪→身体反应，看看是不是某个想法在放大压力感。',
      '承受这么大的压力一定很辛苦。试试重新看待压力：它说明你在乎你做的事情。\n\n🧘 4-7-8呼吸法：吸气4秒→屏住7秒→缓缓呼出8秒，重复3次，帮助身体从「战斗模式」切换到「休息模式」。',
    ]
  },
  {
    keywords: ['焦虑', '不安', '担心', '紧张'],
    responses: [
      '焦虑的感觉真的很不好受。你现在最担心的是什么呢？\n\n🧘 正念呼吸：把注意力放在呼吸上，不试图改变它，只是观察。当思绪飘走时，温柔地把注意力带回呼吸。',
      '当焦虑来袭时，试试CBT的「思维记录法」：写下你担心的具体事情→评估它发生的可能性→想想最可能的结果。你会发现，焦虑往往放大了风险。',
    ]
  },
  {
    keywords: ['失眠', '睡不着', '睡眠'],
    responses: [
      '睡眠问题往往和日间的压力有关。试试建立「睡前仪式」：固定时间放下手机→做10分钟身体扫描→用4-7-8呼吸法放松。\n\n💡 睡不着时不要强迫自己入睡，可以起来做点轻松的事情，等有了困意再回到床上。',
    ]
  },
  {
    keywords: ['同事', '领导', '人际关系'],
    responses: [
      '职场人际关系确实复杂。能具体说说是什么情况让你困扰吗？\n\n💡 NVC非暴力沟通四步法：观察→感受→需要→请求。比如：「当会议被打断时，我感到沮丧，因为我需要被尊重，你能否让我说完再回应？」',
    ]
  },
  {
    keywords: ['低落', '难过', '沮丧', '不开心'],
    responses: [
      '我能感受到你现在的心情不太好。这种低落的感觉是真实的，不需要勉强自己开心起来。\n\n有时候，允许自己难过本身就是一种力量。你愿意和我说说，是什么让你感到低落吗？',
    ]
  },
  {
    keywords: ['倦怠', '没动力', '迷茫'],
    responses: [
      '职业倦怠是很多人都会经历的阶段，这不代表你不够好。心理学研究发现，倦怠往往源于长期付出得不到认可或回报。\n\n先不急着找答案，给自己一些休息的时间。等你准备好了，我们可以一起看看，有没有什么小改变能让情况好一些。',
    ]
  },
];

// 知识库匹配
function matchKnowledgeBase(message: string, aiName: string): string | null {
  const msg = message.toLowerCase();
  // 50%概率匹配文章
  if (Math.random() < 0.5 && articleCollection.articles) {
    const articles = Object.values(articleCollection.articles);
    for (const article of articles) {
      if (article.keywords && article.keywords.some(kw => msg.includes(kw.toLowerCase()))) {
        return `${aiName}从一篇文章中看到了一些可能对你有帮助的内容：\n\n📖 ${article.title}\n\n💡 核心洞察：${article.coreInsight}\n\n${article.practicalTip || ''}`;
      }
    }
  }
  // 60%概率匹配流派
  if (Math.random() < 0.6) {
    const schools = Object.entries(psychologySchools).filter(([k]) => k !== 'overview');
    for (const [, school] of schools) {
      if (school.applicableIssues && school.applicableIssues.some(issue => msg.includes(issue))) {
        return `从${school.name}的角度来看：\n\n${school.mindCareApplication?.forChat || school.coreConcept}\n\n💡 ${aiName}建议：试试${school.keyTechniques?.[0]?.technique || '自我觉察'}——${school.keyTechniques?.[0]?.desc || '关注自己当下的感受'}`;
      }
    }
  }
  // 35%概率匹配名言
  if (Math.random() < 0.35) {
    const quotes = psychologistQuotes.dailyQuotes;
    if (quotes && quotes.length > 0) {
      const quote = quotes[Math.floor(Math.random() * quotes.length)];
      return `送你一句话：\n\n"${quote.quote}" —— ${quote.author}\n\n希望这句话能给你一些力量。${aiName}在这里陪着你。`;
    }
  }
  return null;
}

// AI回复生成
function getAIResponse(message: string, conversationHistory: any[], aiName: string): string {
  if (!message || typeof message !== 'string') return `我在呢，有什么想和${aiName}说的吗？`;

  // 危机检测
  if (detectCrisis(message)) return getCrisisResponse();

  // 知识库匹配
  const knowledgeResponse = matchKnowledgeBase(message, aiName);
  if (knowledgeResponse) return knowledgeResponse;

  // 关键词模式匹配
  for (const pattern of responsePatterns) {
    if (pattern.keywords.some(kw => message.includes(kw))) {
      return pattern.responses[Math.floor(Math.random() * pattern.responses.length)];
    }
  }

  // 通用温暖回复
  const warmResponses = [
    `谢谢你和${aiName}分享这些。你的感受很重要，我认真在听。能再多说说吗？`,
    `我理解你的感受。有时候把心里的话说出来，本身就能让负担轻一些。${aiName}在这里陪着你。`,
    `嗯，我在听。你说的每一句话${aiName}都记着呢。想继续说说吗？`,
    `你愿意打开自己，这本身就很勇敢。${aiName}不会评判你，只是陪着你。`,
  ];
  return warmResponses[Math.floor(Math.random() * warmResponses.length)];
}

// localStorage适配
function loadAIName(): string {
  try { return Taro.getStorageSync(AI_NAME_KEY) || DEFAULT_AI_NAME; }
  catch { return DEFAULT_AI_NAME; }
}
function saveAIName(name: string) {
  try { Taro.setStorageSync(AI_NAME_KEY, name); } catch {}
}
function loadChatHistory(): any[] {
  try {
    const data = Taro.getStorageSync(CHAT_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}
function saveChatHistory(history: any[]) {
  try { Taro.setStorageSync(CHAT_HISTORY_KEY, JSON.stringify(history.slice(-50))); } catch {}
}

export default function Chat() {
  const [aiName, setAiName] = useState(() => loadAIName());
  const [messages, setMessages] = useState<any[]>(() => {
    const saved = loadChatHistory();
    if (saved.length > 0) return saved;
    return [{
      id: 1, sender: 'ai', text: `你好呀！我是${loadAIName()}，你的心理健康伙伴 🤗\n\n无论你今天过得怎样，我都在这里陪你聊聊。你可以直接打字，也可以选一个话题开始~`,
      timestamp: Date.now()
    }];
  });
  const [inputText, setInputText] = useState('');
  const [showMoodPanel, setShowMoodPanel] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<any>(null);

  useEffect(() => {
    // 滚动到底部
    setTimeout(() => {
      scrollViewRef.current?.scrollIntoView({ selector: '.msg-bottom' });
    }, 100);
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg = {
      id: Date.now(), sender: 'user', text: text.trim(), timestamp: Date.now()
    };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setShowMoodPanel(false);

    // AI回复
    setIsTyping(true);
    setTimeout(() => {
      const aiResponse = getAIResponse(text.trim(), newMessages, aiName);
      const aiMsg = {
        id: Date.now() + 1, sender: 'ai', text: aiResponse, timestamp: Date.now()
      };
      const finalMessages = [...newMessages, aiMsg];
      setMessages(finalMessages);
      setIsTyping(false);
      saveChatHistory(finalMessages);
    }, 800 + Math.random() * 1200);
  };

  const handleMoodSelect = (mood: any) => {
    sendMessage(`我现在感觉${mood.emoji} ${mood.label}`);
  };

  const handleTopicSelect = (topic: any) => {
    sendMessage(`我想聊聊${topic.text}的话题`);
  };

  const handleNameSubmit = () => {
    if (nameInput.trim() && nameInput.trim().length <= 10) {
      const newName = nameInput.trim();
      setAiName(newName);
      saveAIName(newName);
      setShowNameModal(false);
      setNameInput('');
      Taro.showToast({ title: `好的，以后叫我${newName}吧~`, icon: 'none' });
    }
  };

  const handleNameReset = () => {
    setAiName(DEFAULT_AI_NAME);
    saveAIName(DEFAULT_AI_NAME);
    setShowNameModal(false);
    Taro.showToast({ title: `已恢复默认名字：${DEFAULT_AI_NAME}`, icon: 'none' });
  };

  const clearHistory = () => {
    Taro.showModal({
      title: '确认清空',
      content: '清空后聊天记录将无法恢复，确定吗？',
      success: (res) => {
        if (res.confirm) {
          const welcomeMsg = [{
            id: Date.now(), sender: 'ai',
            text: `聊天记录已清空。我是${aiName}，随时陪你聊~`,
            timestamp: Date.now()
          }];
          setMessages(welcomeMsg);
          saveChatHistory(welcomeMsg);
        }
      }
    });
  };

  return (
    <View className="chat-page">
      {/* Header */}
      <View className="chat-header">
        <Text className="chat-header-name">{aiName}</Text>
        <View className="chat-header-actions">
          <Text className="header-btn" onClick={() => setShowNameModal(true)}>✏️</Text>
          <Text className="header-btn" onClick={clearHistory}>🗑️</Text>
        </View>
      </View>

      {/* Messages */}
      <ScrollView className="chat-messages" scrollY scrollIntoView="msg-bottom" scrollWithAnimation>
        {messages.map((msg) => (
          <View key={msg.id} className={`msg-row ${msg.sender === 'ai' ? 'msg-ai' : 'msg-user'}`}>
            {msg.sender === 'ai' && <Text className="msg-avatar">{AI_AVATAR}</Text>}
            <View className={`msg-bubble ${msg.sender === 'ai' ? 'bubble-ai' : 'bubble-user'}`}>
              <Text className="msg-text">{msg.text}</Text>
            </View>
          </View>
        ))}
        {isTyping && (
          <View className="msg-row msg-ai">
            <Text className="msg-avatar">{AI_AVATAR}</Text>
            <View className="msg-bubble bubble-ai typing-bubble">
              <Text className="typing-dots">正在输入...</Text>
            </View>
          </View>
        )}
        <View id="msg-bottom" className="msg-bottom" />
      </ScrollView>

      {/* Quick Topics */}
      <View className="quick-topics">
        <ScrollView scrollX className="topics-scroll">
          {quickTopics.map((topic, i) => (
            <View key={i} className="topic-chip" onClick={() => handleTopicSelect(topic)}>
              <Text>{topic.icon} {topic.text}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Input Area */}
      <View className="chat-input-area safe-area-bottom">
        <Text className="mood-btn" onClick={() => setShowMoodPanel(!showMoodPanel)}>😊</Text>
        <Input
          className="chat-input"
          value={inputText}
          onInput={(e) => setInputText(e.detail.value)}
          onConfirm={() => sendMessage(inputText)}
          placeholder={`和${aiName}说说你的心里话...`}
          confirmType="send"
        />
        <View className="send-btn" onClick={() => sendMessage(inputText)}>
          <Text>发送</Text>
        </View>
      </View>

      {/* Mood Panel */}
      {showMoodPanel && (
        <View className="mood-panel">
          <Text className="mood-panel-title">你现在感觉怎么样？</Text>
          <View className="mood-options">
            {moodOptions.map((mood, i) => (
              <View key={i} className="mood-item" onClick={() => handleMoodSelect(mood)}>
                <Text className="mood-emoji">{mood.emoji}</Text>
                <Text className="mood-label">{mood.label}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Name Modal */}
      {showNameModal && (
        <View className="modal-overlay">
          <View className="name-modal">
            <Text className="modal-title">给助手取个名字</Text>
            <Text className="modal-desc">给它一个你喜欢的名字，最多10个字</Text>
            <Input
              className="name-input"
              value={nameInput}
              onInput={(e) => setNameInput(e.detail.value)}
              placeholder={`当前名字：${aiName}`}
              maxLength={10}
            />
            <View className="modal-btns">
              <View className="modal-btn btn-cancel" onClick={() => setShowNameModal(false)}>
                <Text>取消</Text>
              </View>
              <View className="modal-btn btn-reset" onClick={handleNameReset}>
                <Text>恢复默认</Text>
              </View>
              <View className="modal-btn btn-confirm" onClick={handleNameSubmit}>
                <Text>确定</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
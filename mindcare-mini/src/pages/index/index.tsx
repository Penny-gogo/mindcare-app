import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState, useEffect } from 'react';
import psychologistQuotesData from '../../data/knowledge/psychologistQuotes';
import './index.scss';

// 根据日期获取每日寄语
function getDailyQuote() {
  const quotes = psychologistQuotesData.dailyQuotes;
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return quotes[dayOfYear % quotes.length];
}

// 从本地存储获取用户信息
function getUserInfo() {
  try {
    const info = Taro.getStorageSync('mindcare_user');
    return info ? JSON.parse(info) : null;
  } catch {
    return null;
  }
}

export default function Index() {
  const [user, setUser] = useState(null);
  const dailyQuote = getDailyQuote();

  useEffect(() => {
    const info = getUserInfo();
    if (info) setUser(info);
  }, []);

  const goToChat = () => {
    Taro.switchTab({ url: '/pages/chat/index' });
  };

  const goToAssessment = () => {
    Taro.switchTab({ url: '/pages/assessment/index' });
  };

  return (
    <View className="home">
      {/* Hero Section */}
      <View className="hero">
        <View className="hero-content">
          <Text className="hero-title">嘿，你还好吗？{'\n'}这里有人想听你说</Text>
          <Text className="hero-desc">
            生活有时候挺难的，工作压力、情绪低落、睡不好觉……
            这些都不是矫情，而是你值得被认真对待的感受。
          </Text>
          <Text className="hero-highlight">小暖在这里，随时陪你聊聊。</Text>
          <View className="hero-actions">
            <View className="btn-primary" onClick={goToChat}>
              <Text>和小暖聊聊</Text>
            </View>
            <View className="btn-secondary" onClick={goToAssessment}>
              <Text>{user ? '了解自己的状态' : '测一测心理状态'}</Text>
            </View>
          </View>
          <View className="hero-stats">
            <View className="stat">
              <Text className="stat-number">🔒</Text>
              <Text className="stat-label">你的心事只有你知道</Text>
            </View>
            <View className="stat">
              <Text className="stat-number">🌙</Text>
              <Text className="stat-label">任何时候都在</Text>
            </View>
            <View className="stat">
              <Text className="stat-number">💚</Text>
              <Text className="stat-label">不带评判地倾听</Text>
            </View>
          </View>
          <View className="daily-quote">
            <Text className="quote-icon">💡</Text>
            <Text className="quote-text">"{dailyQuote.quote}"</Text>
            <Text className="quote-author">—— {dailyQuote.author}</Text>
          </View>
        </View>
        <View className="hero-visual">
          <View className="hero-illustration">
            <View className="floating-card card-1">🧘</View>
            <View className="floating-card card-2">💬</View>
            <View className="floating-card card-3">🌿</View>
            <View className="floating-card card-4">💙</View>
          </View>
        </View>
      </View>

      {/* Warm Quote Banner */}
      <View className="quote-banner">
        <View className="quote-content">
          <Text className="quote-mark">"</Text>
          <Text>每个人的痛苦都值得被看见，无关痛苦的命名。</Text>
          <Text className="quote-source">—— 华东师范大学心理健康中心</Text>
        </View>
      </View>

      {/* Two Core Modules */}
      <View className="modules-section">
        <View className="section-header">
          <Text className="section-title">当你需要的时候，我们都在</Text>
          <Text className="section-subtitle">两个温暖的角落，随时等你来</Text>
        </View>
        <View className="modules-grid">
          <View className="module-card" onClick={goToChat}>
            <View className="module-icon chat-icon">🤗</View>
            <Text className="module-title">和小暖聊天</Text>
            <Text className="module-desc">焦虑了、压力大了、睡不着了，或者就是心里有点堵——和小暖说说，ta会认真听你讲，陪你理一理思绪，给你一些暖暖的建议。</Text>
            <View className="module-features">
              <Text className="feature-tag">随时倾听</Text>
              <Text className="feature-tag">帮你放松</Text>
              <Text className="feature-tag">温暖陪伴</Text>
            </View>
            <Text className="module-arrow">→</Text>
          </View>

          <View className="module-card" onClick={goToAssessment}>
            <View className="module-icon assess-icon">🎯</View>
            <Text className="module-title">测一测心理状态</Text>
            <Text className="module-desc">最近压力有多大？情绪怎么样？不是考试，没有对错，只是帮你更了解自己，看看哪里需要多一点关心。</Text>
            <View className="module-features">
              <Text className="feature-tag">简单几步</Text>
              <Text className="feature-tag">了解自己</Text>
              <Text className="feature-tag">贴心建议</Text>
            </View>
            <Text className="module-arrow">→</Text>
          </View>
        </View>
      </View>

      {/* Why Trust Us */}
      <View className="professional-section">
        <View className="section-header">
          <Text className="section-title">你可以放心地打开自己</Text>
          <Text className="section-subtitle">我们认真对待你说的每一句话</Text>
        </View>
        <View className="professional-grid">
          <View className="pro-card">
            <Text className="pro-icon">🤝</Text>
            <Text className="pro-title">真的在听你说话</Text>
            <Text className="pro-desc">小暖不是冷冰冰的机器人，ta会记住你说过的话，关心你之前提到的困扰，在你需要的时候主动问候。</Text>
            <Text className="pro-tag">有温度的陪伴</Text>
          </View>
          <View className="pro-card">
            <Text className="pro-icon">🧠</Text>
            <Text className="pro-title">方法是有用的</Text>
            <Text className="pro-desc">呼吸放松、情绪梳理、压力管理……小暖给你的建议都来自经过验证的心理学方法，真的能帮到你。</Text>
            <Text className="pro-tag">不只是安慰</Text>
          </View>
          <View className="pro-card">
            <Text className="pro-icon">🔐</Text>
            <Text className="pro-title">你的秘密只有你知道</Text>
            <Text className="pro-desc">聊天记录只存在你的手机上，不会传到任何服务器，没有人能看到你说了什么。</Text>
            <Text className="pro-tag">完全私密</Text>
          </View>
          <View className="pro-card">
            <Text className="pro-icon">🆘</Text>
            <Text className="pro-title">困难时刻，有人守候</Text>
            <Text className="pro-desc">如果你提到了伤害自己的想法，小暖会立刻给你专业的求助热线，24小时都有人接听。</Text>
            <Text className="pro-tag">安全底线</Text>
          </View>
        </View>
      </View>

      {/* Crisis Hotline */}
      <View className="crisis-section">
        <View className="section-header">
          <Text className="section-title">如果你正经历困难时刻</Text>
          <Text className="section-subtitle">这些热线24小时为你守候</Text>
        </View>
        <View className="crisis-grid">
          <View className="crisis-card">
            <Text className="crisis-icon">📞</Text>
            <Text className="crisis-title">全国心理援助热线</Text>
            <Text className="crisis-number">400-161-9995</Text>
            <Text className="crisis-tag">24小时</Text>
          </View>
          <View className="crisis-card">
            <Text className="crisis-icon">🏥</Text>
            <Text className="crisis-title">北京回龙观医院</Text>
            <Text className="crisis-number">010-82951332</Text>
            <Text className="crisis-tag">心理危机干预</Text>
          </View>
          <View className="crisis-card">
            <Text className="crisis-icon">💛</Text>
            <Text className="crisis-title">12355 青少年热线</Text>
            <Text className="crisis-number">12355</Text>
            <Text className="crisis-tag">24小时</Text>
          </View>
        </View>
        <Text className="crisis-note">如果你或身边的人正在经历心理危机，请立即拨打以上热线或前往最近的三甲医院精神科。</Text>
      </View>

      {/* CTA */}
      <View className="cta-section">
        <Text className="cta-title">给自己几分钟，和心里那个人聊聊</Text>
        <Text className="cta-subtitle">无论什么时候，小暖都在</Text>
        <View className="btn-primary btn-lg" onClick={goToChat}>
          <Text>{user ? '和小暖聊聊' : '试试和小暖聊聊'}</Text>
        </View>
      </View>
    </View>
  );
}
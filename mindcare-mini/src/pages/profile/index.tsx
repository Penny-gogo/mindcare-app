import { View, Text, Input, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState, useEffect } from 'react';
import './index.scss';

const USER_KEY = 'mindcare_user';
const HISTORY_KEY = 'mindcare_chat_history';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [stats, setStats] = useState({ chatCount: 0, assessCount: 0 });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    try {
      const data = Taro.getStorageSync(USER_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        setUser(parsed);
        setEditName(parsed.name || '');
      }
      // 统计聊天数
      const chatData = Taro.getStorageSync(HISTORY_KEY);
      if (chatData) {
        const msgs = JSON.parse(chatData);
        setStats(prev => ({ ...prev, chatCount: msgs.length || 0 }));
      }
      // 统计测评数
      const assessData = Taro.getStorageSync('mindcare_assess_count');
      setStats(prev => ({ ...prev, assessCount: assessData ? parseInt(assessData) : 0 }));
    } catch {}
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      Taro.showToast({ title: '请输入昵称', icon: 'none' });
      return;
    }
    const newUser = { ...user, name: editName.trim() };
    try {
      Taro.setStorageSync(USER_KEY, JSON.stringify(newUser));
      setUser(newUser);
      setIsEditing(false);
      Taro.showToast({ title: '保存成功', icon: 'success' });
    } catch {}
  };

  const handleClearData = () => {
    Taro.showModal({
      title: '确认清除',
      content: '将清除所有聊天记录和个人数据，此操作不可恢复',
      success: (res) => {
        if (res.confirm) {
          try {
            Taro.removeStorageSync(USER_KEY);
            Taro.removeStorageSync(HISTORY_KEY);
            Taro.removeStorageSync('mindcare_ai_name');
            Taro.removeStorageSync('mindcare_assess_count');
            setUser(null);
            setStats({ chatCount: 0, assessCount: 0 });
            Taro.showToast({ title: '数据已清除', icon: 'success' });
          } catch {}
        }
      }
    });
  };

  const handleLogin = () => {
    setIsEditing(true);
    setEditName('');
  };

  // 未登录状态
  if (!user && !isEditing) {
    return (
      <View className="profile-page">
        <View className="profile-header">
          <View className="avatar-placeholder">😊</View>
          <Text className="welcome-text">欢迎使用 MindCare</Text>
          <Text className="welcome-desc">记录你的心理健康之旅</Text>
        </View>
        <View className="profile-actions">
          <View className="btn-primary" onClick={handleLogin}>
            <Text>设置昵称开始使用</Text>
          </View>
        </View>
        <View className="profile-features">
          <View className="feature-item">
            <Text className="feature-icon">🔒</Text>
            <Text className="feature-text">所有数据仅存储在本地</Text>
          </View>
          <View className="feature-item">
            <Text className="feature-icon">🛡️</Text>
            <Text className="feature-text">不会关联工作绩效</Text>
          </View>
          <View className="feature-item">
            <Text className="feature-icon">💚</Text>
            <Text className="feature-text">专业心理支持随时可用</Text>
          </View>
        </View>
      </View>
    );
  }

  // 编辑状态
  if (isEditing) {
    return (
      <View className="profile-page">
        <View className="edit-card">
          <Text className="edit-title">设置你的昵称</Text>
          <Text className="edit-desc">只用一个昵称就好，不需要其他信息</Text>
          <Input
            className="edit-input"
            value={editName}
            onInput={(e) => setEditName(e.detail.value)}
            placeholder="输入你的昵称"
            maxLength={20}
          />
          <View className="edit-btns">
            {user && (
              <View className="btn-cancel" onClick={() => setIsEditing(false)}>
                <Text>取消</Text>
              </View>
            )}
            <View className="btn-primary" onClick={handleSaveProfile}>
              <Text>保存</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // 已登录状态
  return (
    <View className="profile-page">
      <View className="profile-header">
        <View className="avatar-circle">
          <Text className="avatar-text">{user.name?.[0] || '😊'}</Text>
        </View>
        <Text className="user-name">{user.name}</Text>
        <Text className="edit-link" onClick={() => setIsEditing(true)}>编辑</Text>
      </View>

      <View className="stats-card">
        <View className="stat-item">
          <Text className="stat-value">{stats.chatCount}</Text>
          <Text className="stat-label">聊天消息</Text>
        </View>
        <View className="stat-divider" />
        <View className="stat-item">
          <Text className="stat-value">{stats.assessCount}</Text>
          <Text className="stat-label">测评次数</Text>
        </View>
      </View>

      <View className="menu-card">
        <View className="menu-item" onClick={() => Taro.switchTab({ url: '/pages/chat/index' })}>
          <Text className="menu-icon">💬</Text>
          <Text className="menu-text">和小暖聊天</Text>
          <Text className="menu-arrow">→</Text>
        </View>
        <View className="menu-item" onClick={() => Taro.switchTab({ url: '/pages/assessment/index' })}>
          <Text className="menu-icon">🎯</Text>
          <Text className="menu-text">心理测评</Text>
          <Text className="menu-arrow">→</Text>
        </View>
        <View className="menu-item" onClick={() => {
          Taro.makePhoneCall({ phoneNumber: '4001619995' });
        }}>
          <Text className="menu-icon">📞</Text>
          <Text className="menu-text">心理援助热线</Text>
          <Text className="menu-arrow">→</Text>
        </View>
      </View>

      <View className="danger-zone">
        <View className="danger-btn" onClick={handleClearData}>
          <Text>清除所有数据</Text>
        </View>
      </View>
    </View>
  );
}
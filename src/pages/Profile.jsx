import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [saved, setSaved] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSave = async () => {
    await updateProfile({ name });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <img src={user.avatar} alt={user.name} className="profile-avatar" />
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>

          <div className="profile-section">
            <h3>个人信息</h3>
            {editing ? (
              <div className="profile-edit">
                <div className="form-group">
                  <label>姓名</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <div className="profile-edit-actions">
                  <button className="btn-save" onClick={handleSave}>保存</button>
                  <button className="btn-cancel" onClick={() => setEditing(false)}>取消</button>
                </div>
              </div>
            ) : (
              <div className="profile-info">
                <div className="info-row">
                  <span className="info-label">姓名</span>
                  <span className="info-value">{user.name}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">邮箱</span>
                  <span className="info-value">{user.email}</span>
                </div>
                <button className="btn-edit" onClick={() => setEditing(true)}>编辑资料</button>
              </div>
            )}
          </div>

          {saved && <div className="save-success">资料已更新！</div>}

          <div className="profile-section">
            <h3>账号设置</h3>
            <div className="profile-actions">
              <button className="btn-action" onClick={() => navigate('/appointments')}>
                📅 我的预约
              </button>
              <button className="btn-action" onClick={() => navigate('/chat')}>
                💬 在线咨询
              </button>
              <button className="btn-action btn-logout" onClick={handleLogout}>
                🚪 退出登录
              </button>
            </div>
          </div>

          <div className="profile-section">
            <h3>心理健康小贴士</h3>
            <div className="tips-grid">
              <div className="tip-card">
                <span className="tip-icon">🧘</span>
                <h4>每日冥想</h4>
                <p>花5-10分钟进行正念冥想，帮助缓解压力</p>
              </div>
              <div className="tip-card">
                <span className="tip-icon">📝</span>
                <h4>情绪日记</h4>
                <p>记录每天的情绪变化，更好地了解自己</p>
              </div>
              <div className="tip-card">
                <span className="tip-icon">🏃</span>
                <h4>运动放松</h4>
                <p>适度运动能释放内啡肽，改善心情</p>
              </div>
              <div className="tip-card">
                <span className="tip-icon">💤</span>
                <h4>充足睡眠</h4>
                <p>保证7-8小时优质睡眠，恢复身心能量</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
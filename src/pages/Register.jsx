import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('请填写所有字段');
      return;
    }

    if (password.length < 6) {
      setError('密码至少需要6个字符');
      return;
    }

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setLoading(true);

    const result = await register(name, email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/" className="auth-brand">🧠 MindCare</Link>
          <h1>创建账号</h1>
          <p>加入 MindCare，开启您的心理健康之旅</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="name">姓名</label>
            <input
              id="name"
              type="text"
              placeholder="请输入您的姓名"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">邮箱地址</label>
            <input
              id="email"
              type="email"
              placeholder="请输入邮箱"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input
              id="password"
              type="password"
              placeholder="至少6个字符"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">确认密码</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? '注册中...' : '注册'}
          </button>
        </form>

        <div className="auth-footer">
          <p>已有账号？<Link to="/login">立即登录</Link></p>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('请填写所有字段');
      setLoading(false);
      return;
    }

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = login(email, password);
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
          <h1>欢迎回来</h1>
          <p>登录您的账号，继续心理健康之旅</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}

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
              placeholder="请输入密码"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        <div className="auth-footer">
          <p>还没有账号？<Link to="/register">立即注册</Link></p>
        </div>

        <div className="auth-demo">
          <p className="demo-hint">演示提示：请先注册账号再登录</p>
        </div>
      </div>
    </div>
  );
}
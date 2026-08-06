import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const notice = location.state?.message || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('请填写所有字段');
      setLoading(false);
      return;
    }

    // API调用本身有延迟，无需模拟
    const result = await login(email, password);
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
          {notice && <div className="auth-success">{notice}</div>}
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

          <div className="auth-links">
            <Link to="/forgot-password">忘记密码？</Link>
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
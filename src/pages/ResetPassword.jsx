import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { updatePassword } from '../api/auth';
import './Login.css';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('请填写所有字段');
      return;
    }
    if (password.length < 6) {
      setError('密码至少需要 6 个字符');
      return;
    }
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setLoading(true);
    try {
      const result = await updatePassword(password);
      if (result.success) {
        window.history.replaceState({}, '', window.location.origin + window.location.pathname);
        navigate('/login', {
          replace: true,
          state: { message: '密码已重置，请使用新密码登录。' },
        });
      } else {
        setError(result.message || '密码重置失败，请重新打开邮件中的链接');
      }
    } catch (updateError) {
      setError(updateError.message || '密码重置失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/" className="auth-brand">🧠 MindCare</Link>
          <h1>设置新密码</h1>
          <p>请输入新的登录密码</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="new-password">新密码</label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              placeholder="至少 6 个字符"
              value={password}
              onChange={event => setPassword(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-new-password">确认新密码</label>
            <input
              id="confirm-new-password"
              type="password"
              autoComplete="new-password"
              placeholder="请再次输入新密码"
              value={confirmPassword}
              onChange={event => setConfirmPassword(event.target.value)}
            />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? '保存中...' : '保存新密码'}
          </button>
        </form>
      </div>
    </div>
  );
}
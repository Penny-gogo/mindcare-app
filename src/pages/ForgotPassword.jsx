import { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '../api/auth';
import './Login.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('请输入注册邮箱');
      return;
    }

    setLoading(true);
    try {
      const result = await requestPasswordReset(email.trim());
      if (result.success) {
        setSuccess('如果该邮箱已注册，密码重置邮件将发送到您的邮箱，请注意查收。');
      } else {
        setError(result.message || '发送失败，请稍后重试');
      }
    } catch (requestError) {
      setError(requestError.message || '发送失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/" className="auth-brand">🧠 MindCare</Link>
          <h1>找回密码</h1>
          <p>输入注册邮箱，我们会向您发送密码重置链接</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          <div className="form-group">
            <label htmlFor="reset-email">邮箱地址</label>
            <input
              id="reset-email"
              type="email"
              autoComplete="email"
              placeholder="请输入注册邮箱"
              value={email}
              onChange={event => setEmail(event.target.value)}
            />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? '发送中...' : '发送重置邮件'}
          </button>
        </form>

        <div className="auth-footer">
          <p><Link to="/login">返回登录</Link></p>
        </div>
      </div>
    </div>
  );
}
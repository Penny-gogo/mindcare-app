import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">💚</span>
          <span className="brand-text">MindCare</span>
          <span className="brand-sub">EAP</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className={isActive('/')}>首页</Link>
          {user && <Link to="/treehole" className={isActive('/treehole')}>树洞</Link>}
          {user && <Link to="/chat" className={isActive('/chat')}>小暖</Link>}
          {user && <Link to="/assessment" className={isActive('/assessment')}>测评</Link>}
          {user && <Link to="/knowledge" className={isActive('/knowledge')}>知识库</Link>}
          {user && <Link to="/counselors" className={isActive('/counselors')}>咨询师</Link>}
        </div>

        <div className="navbar-auth">
          {user ? (
            <div className="user-menu">
              <Link to="/profile" className="user-avatar-link">
                <img src={user.avatar} alt={user.name} className="user-avatar-sm" />
                <span className="user-name">{user.name}</span>
                {user.role && <span className="user-role-badge">
                  {user.role === 'manager' ? '主管' : user.role === 'hrbp' ? 'HRBP' : ''}
                </span>}
              </Link>
              <button onClick={handleLogout} className="btn-logout">退出</button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">登录</Link>
              <Link to="/register" className="btn-register">注册</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
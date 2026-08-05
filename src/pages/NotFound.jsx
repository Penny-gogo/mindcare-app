import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-emoji">🌿</div>
        <h1>页面走丢了</h1>
        <p className="not-found-desc">
          你访问的页面不存在，可能已经移动或删除了。<br/>
          不过没关系，小暖还在这里等你。
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn-home">回到首页</Link>
          <Link to="/chat" className="btn-chat">和小暖聊聊</Link>
        </div>
        <div className="not-found-tip">
          💚 如果你认为这是一个错误，可以稍后再试
        </div>
      </div>
    </div>
  );
}
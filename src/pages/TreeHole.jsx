import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTreeHole } from '../context/TreeHoleContext';
import { treeHoleTags } from '../data/assessments';
import './TreeHole.css';

export default function TreeHole() {
  const { user } = useAuth();
  const { posts, addPost, likePost, addComment } = useTreeHole();
  const [showNewPost, setShowNewPost] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [expandedPost, setExpandedPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [filterTag, setFilterTag] = useState('');

  const isManager = user && (user.role === 'manager' || user.role === 'hrbp');

  const handleAddPost = async () => {
    if (!newContent.trim()) return;
    await addPost(newContent.trim(), selectedTags);
    setNewContent('');
    setSelectedTags([]);
    setShowNewPost(false);
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleAddComment = async (postId) => {
    if (!commentText.trim()) return;
    await addComment(postId, commentText.trim());
    setCommentText('');
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const filteredPosts = filterTag
    ? posts.filter(p => p.tags.includes(filterTag))
    : posts;

  // 主管/HRBP 视角的统计
  const tagStats = {};
  posts.forEach(p => {
    p.tags.forEach(t => {
      tagStats[t] = (tagStats[t] || 0) + 1;
    });
  });
  const topTags = Object.entries(tagStats).sort((a, b) => b[1] - a[1]).slice(0, 6);

  return (
    <div className="treehole-page">
      <div className="treehole-container">
        {/* Header */}
        <div className="treehole-header">
          <div className="treehole-header-left">
            <h1>🌳 匿名树洞</h1>
            <p>匿名倾诉，安全释放。这里只有你的声音，没有你的名字。</p>
            <p className="treehole-inspiration">灵感来自北师大「雪绒花」朋辈互助——每个人都可以成为他人的温暖。</p>
          </div>
          {user && (
            <button
              className="btn-new-post"
              onClick={() => setShowNewPost(!showNewPost)}
            >
              {showNewPost ? '取消' : '+ 发帖'}
            </button>
          )}
        </div>

        {/* Manager/HRBP Dashboard */}
        {isManager && (
          <div className="manager-dashboard">
            <div className="dashboard-title">
              📊 团队情绪洞察
              <span className="dashboard-badge">
                {user.role === 'hrbp' ? 'HRBP' : '主管'}视图
              </span>
            </div>
            <div className="dashboard-grid">
              <div className="dashboard-stat">
                <span className="dash-number">{posts.length}</span>
                <span className="dash-label">总发帖数</span>
              </div>
              <div className="dashboard-stat">
                <span className="dash-number">
                  {posts.reduce((sum, p) => sum + p.comments.length, 0)}
                </span>
                <span className="dash-label">互助回复</span>
              </div>
              <div className="dashboard-stat">
                <span className="dash-number">
                  {posts.reduce((sum, p) => sum + p.likes, 0)}
                </span>
                <span className="dash-label">共鸣点赞</span>
              </div>
            </div>
            <div className="tag-trends">
              <h4>热门话题标签</h4>
              <div className="tag-trend-list">
                {topTags.map(([tag, count]) => (
                  <div key={tag} className="tag-trend-item">
                    <span className="tag-trend-name">{tag}</span>
                    <div className="tag-trend-bar">
                      <div
                        className="tag-trend-fill"
                        style={{ width: `${(count / posts.length) * 100}%` }}
                      />
                    </div>
                    <span className="tag-trend-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="dashboard-notice">
              💡 提示：您只能查看匿名帖子的内容趋势，无法识别发帖人身份。如发现需要关注的情况，建议通过团队活动或EAP渠道提供支持。
            </div>
          </div>
        )}

        {/* New Post Form */}
        {showNewPost && (
          <div className="new-post-form">
            <div className="post-warm-guide">
              💚 每个人的痛苦都值得被看见。用具体的语言代替标签，比如不说"我焦虑"，而说"我在启动任务时感到困难"——这样更容易找到解决方向。
            </div>
            <textarea
              className="new-post-textarea"
              placeholder="说出你的心事，完全匿名...&#10;&#10;可以聊聊：最近的工作感受、和同事的相处、对未来的迷茫，或者任何想说的话..."
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              maxLength={500}
            />
            <div className="new-post-tags">
              <span className="tags-label">选择标签：</span>
              {treeHoleTags.map(tag => (
                <button
                  key={tag}
                  className={`tag-btn ${selectedTags.includes(tag) ? 'active' : ''}`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="new-post-footer">
              <span className="char-count">{newContent.length}/500</span>
              <button
                className="btn-submit-post"
                onClick={handleAddPost}
                disabled={!newContent.trim()}
              >
                匿名发布
              </button>
            </div>
          </div>
        )}

        {/* Filter Tags */}
        <div className="filter-bar">
          <button
            className={`filter-tag ${!filterTag ? 'active' : ''}`}
            onClick={() => setFilterTag('')}
          >
            全部
          </button>
          {treeHoleTags.slice(0, 8).map(tag => (
            <button
              key={tag}
              className={`filter-tag ${filterTag === tag ? 'active' : ''}`}
              onClick={() => setFilterTag(filterTag === tag ? '' : tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Posts List */}
        <div className="posts-list">
          {filteredPosts.length === 0 ? (
            <div className="empty-treehole">
              <div className="empty-icon">🌳</div>
              <h3>树洞空空如也</h3>
              <p>成为第一个倾诉的人吧</p>
            </div>
          ) : (
            filteredPosts.map(post => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <div className="post-avatar">
                    🌿
                  </div>
                  <div className="post-meta">
                    <span className="post-author">{post.anonymousName}</span>
                    <span className="post-time">{formatTime(post.createdAt)}</span>
                  </div>
                </div>
                <div className="post-content">{post.content}</div>
                <div className="post-tags">
                  {post.tags.map(tag => (
                    <span key={tag} className="post-tag">#{tag}</span>
                  ))}
                </div>
                <div className="post-actions">
                  <button
                    className="post-action-btn"
                    onClick={() => likePost(post.id)}
                  >
                    💙 {post.likes}
                  </button>
                  <button
                    className="post-action-btn"
                    onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                  >
                    💬 {post.comments.length}
                  </button>
                </div>

                {/* Comments */}
                {expandedPost === post.id && (
                  <div className="comments-section">
                    <div className="comments-list">
                      {post.comments.length === 0 ? (
                        <div className="no-comments">还没有回复，来说点什么吧</div>
                      ) : (
                        post.comments.map(comment => (
                          <div key={comment.id} className="comment-item">
                            <span className="comment-avatar">🌱</span>
                            <div className="comment-body">
                              <span className="comment-author">{comment.anonymousName}</span>
                              <span className="comment-text">{comment.content}</span>
                              <span className="comment-time">{formatTime(comment.createdAt)}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    {user && (
                      <div className="comment-input">
                        <input
                          type="text"
                          placeholder="匿名回复..."
                          value={commentText}
                          onChange={e => setCommentText(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleAddComment(post.id)}
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          disabled={!commentText.trim()}
                        >
                          发送
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {!user && (
          <div className="login-prompt">
            <p>登录后即可发帖和回复</p>
          </div>
        )}
      </div>
    </div>
  );
}
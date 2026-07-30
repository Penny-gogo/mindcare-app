import { createContext, useContext, useState, useEffect } from 'react';
import * as treeholeApi from '../api/treehole';

const TreeHoleContext = createContext(null);

export function TreeHoleProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 初始化加载帖子数据
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await treeholeApi.getPosts();
        setPosts(data);
      } catch (error) {
        console.error('加载树洞数据失败:', error);
        // 回退到 localStorage
        try {
          const saved = localStorage.getItem('eap_treehole_posts');
          setPosts(saved ? JSON.parse(saved) : []);
        } catch (e) {
          console.error('解析树洞数据失败:', e);
          localStorage.removeItem('eap_treehole_posts');
          setPosts([]);
        }
      }
      setLoading(false);
    };
    loadPosts();
  }, []);

  const addPost = async (content, tags) => {
    try {
      const newPost = await treeholeApi.addPost(content, tags);
      setPosts(prev => [newPost, ...prev]);
      return newPost;
    } catch (error) {
      console.error('发帖失败:', error);
      // localStorage 回退
      const anonymousNames = [
        '深夜的猫', '晨光中的树', '风中的叶子', '雨后的彩虹', '安静的角落',
        '追梦人', '小确幸', '向日葵', '星空漫步', '微风不燥',
      ];
      const newPost = {
        id: Date.now(),
        content,
        tags,
        anonymousName: anonymousNames[Math.floor(Math.random() * anonymousNames.length)],
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: [],
      };
      const updated = [newPost, ...posts];
      setPosts(updated);
      localStorage.setItem('eap_treehole_posts', JSON.stringify(updated));
      return newPost;
    }
  };

  const likePost = async (postId) => {
    try {
      await treeholeApi.likePost(postId);
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
    } catch (error) {
      console.error('点赞失败:', error);
      setPosts(prev => {
        const updated = prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p);
        localStorage.setItem('eap_treehole_posts', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const addComment = async (postId, content) => {
    try {
      await treeholeApi.addComment(postId, content);
      // 重新获取帖子以获得最新评论
      const updatedPosts = await treeholeApi.getPosts();
      setPosts(updatedPosts);
    } catch (error) {
      console.error('评论失败:', error);
      const anonymousNames = ['深夜的猫', '晨光中的树', '风中的叶子', '追梦人', '小确幸'];
      const newComment = {
        id: Date.now(),
        content,
        anonymousName: anonymousNames[Math.floor(Math.random() * anonymousNames.length)],
        createdAt: new Date().toISOString(),
      };
      setPosts(prev => {
        const updated = prev.map(p => {
          if (p.id === postId) {
            return { ...p, comments: [...p.comments, newComment] };
          }
          return p;
        });
        localStorage.setItem('eap_treehole_posts', JSON.stringify(updated));
        return updated;
      });
    }
  };

  return (
    <TreeHoleContext.Provider value={{ posts, addPost, likePost, addComment, loading }}>
      {children}
    </TreeHoleContext.Provider>
  );
}

export const useTreeHole = () => {
  const context = useContext(TreeHoleContext);
  if (!context) throw new Error('useTreeHole must be used within TreeHoleProvider');
  return context;
};
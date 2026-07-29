// 树洞 API - 开发环境走 JSON Server，生产环境走 localStorage
import { useApi, get, post, patch } from './client';

const POSTS_KEY = 'eap_treehole_posts';

const defaultPosts = [
  {
    id: 1,
    content: '最近项目压力太大了，连续加班两周了，感觉身体快撑不住了...',
    tags: ['工作压力', '工作生活平衡'],
    anonymousName: '疲惫的夜猫子',
    createdAt: '2026-07-22T10:30:00.000Z',
    likes: 12,
    comments: [
      { id: 1, content: '抱抱，一定要注意身体！', anonymousName: '温暖的路人', createdAt: '2026-07-22T11:00:00.000Z' },
      { id: 2, content: '我之前也是这样，后来学会了跟主管沟通调整节奏', anonymousName: '过来人', createdAt: '2026-07-22T12:00:00.000Z' },
    ],
  },
  {
    id: 2,
    content: '团队里有个同事总是甩锅，每次出问题都怪别人，真的好心累。不知道该怎么处理这种关系...',
    tags: ['人际关系', '团队协作'],
    anonymousName: '委屈的小透明',
    createdAt: '2026-07-21T15:20:00.000Z',
    likes: 8,
    comments: [
      { id: 1, content: '建议保留沟通记录，关键时刻能保护自己', anonymousName: '职场老鸟', createdAt: '2026-07-21T16:00:00.000Z' },
    ],
  },
  {
    id: 3,
    content: '入职三年了，感觉一直在做重复的工作，看不到成长的方向。是该继续坚持还是考虑换个环境？',
    tags: ['职业发展', '自我成长'],
    anonymousName: '迷茫的旅人',
    createdAt: '2026-07-20T09:15:00.000Z',
    likes: 15,
    comments: [
      { id: 1, content: '三年是一个节点，可以先和leader聊聊发展路径', anonymousName: 'HR小姐姐', createdAt: '2026-07-20T10:00:00.000Z' },
      { id: 2, content: '我也是！感觉每天就是复制粘贴...', anonymousName: '同款打工人', createdAt: '2026-07-20T10:30:00.000Z' },
    ],
  },
  {
    id: 4,
    content: '今天被客户骂了，虽然知道不是我的问题，但还是很沮丧。怎样才能不被别人的情绪影响？',
    tags: ['情绪管理', '心理健康'],
    anonymousName: '玻璃心',
    createdAt: '2026-07-19T18:45:00.000Z',
    likes: 20,
    comments: [],
  },
  {
    id: 5,
    content: '分享一个减压方法：每天下班后去公园走30分钟，什么都不想，就听听鸟叫声。坚持了一周，感觉好多了！',
    tags: ['情绪管理', '工作生活平衡'],
    anonymousName: '治愈系',
    createdAt: '2026-07-18T20:00:00.000Z',
    likes: 35,
    comments: [
      { id: 1, content: '谢谢分享！今晚就试试', anonymousName: '需要治愈的人', createdAt: '2026-07-18T21:00:00.000Z' },
    ],
  },
];

function getLocalPosts() {
  const saved = localStorage.getItem(POSTS_KEY);
  return saved ? JSON.parse(saved) : defaultPosts;
}
function setLocalPosts(posts) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

// 初始化
if (!localStorage.getItem(POSTS_KEY)) {
  setLocalPosts(defaultPosts);
}

const anonymousNames = [
  '深夜的猫', '晨光中的树', '风中的叶子', '雨后的彩虹', '安静的角落',
  '追梦人', '小确幸', '向日葵', '星空漫步', '微风不燥',
  '暖阳', '云朵收集者', '时间旅行者', '月光下的影子', '自由的风',
  '森林里的蘑菇', '海边拾贝', '午后阳光', '清晨露珠', '晚霞',
  '独行者', '思考者', '观察者', '守望者', '探索者',
];

function getRandomName() {
  return anonymousNames[Math.floor(Math.random() * anonymousNames.length)];
}

// 获取所有帖子
export async function getPosts() {
  if (useApi) {
    return get('/posts', { _sort: 'createdAt', _order: 'desc' });
  }
  return getLocalPosts();
}

// 添加帖子
export async function addPost(content, tags) {
  const newPost = {
    content,
    tags,
    anonymousName: getRandomName(),
    createdAt: new Date().toISOString(),
    likes: 0,
    comments: [],
  };

  if (useApi) {
    return post('/posts', newPost);
  }

  const posts = getLocalPosts();
  const postWithId = { id: Date.now(), ...newPost };
  posts.unshift(postWithId);
  setLocalPosts(posts);
  return postWithId;
}

// 点赞
export async function likePost(postId) {
  if (useApi) {
    // JSON Server 需要先获取当前 likes 再 +1
    const current = await get(`/posts/${postId}`);
    return patch(`/posts/${postId}`, { likes: current.likes + 1 });
  }

  const posts = getLocalPosts().map(p =>
    p.id === postId ? { ...p, likes: p.likes + 1 } : p
  );
  setLocalPosts(posts);
  return posts.find(p => p.id === postId);
}

// 添加评论
export async function addComment(postId, content) {
  const newComment = {
    id: Date.now(),
    content,
    anonymousName: getRandomName(),
    createdAt: new Date().toISOString(),
  };

  if (useApi) {
    const current = await get(`/posts/${postId}`);
    return patch(`/posts/${postId}`, {
      comments: [...current.comments, newComment],
    });
  }

  const posts = getLocalPosts().map(p => {
    if (p.id === postId) {
      return { ...p, comments: [...p.comments, newComment] };
    }
    return p;
  });
  setLocalPosts(posts);
  return posts.find(p => p.id === postId);
}
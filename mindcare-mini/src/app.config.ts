export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/chat/index',
    'pages/assessment/index',
    'pages/profile/index'
  ],
  tabBar: {
    color: '#999999',
    selectedColor: '#4CAF50',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'assets/tab-home.png',
        selectedIconPath: 'assets/tab-home-active.png'
      },
      {
        pagePath: 'pages/chat/index',
        text: '小暖',
        iconPath: 'assets/tab-chat.png',
        selectedIconPath: 'assets/tab-chat-active.png'
      },
      {
        pagePath: 'pages/assessment/index',
        text: '测评',
        iconPath: 'assets/tab-assess.png',
        selectedIconPath: 'assets/tab-assess-active.png'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: 'assets/tab-profile.png',
        selectedIconPath: 'assets/tab-profile-active.png'
      }
    ]
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'MindCare',
    navigationBarTextStyle: 'black'
  }
});
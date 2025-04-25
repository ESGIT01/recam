<template>
    <div class="sidebar">
      <h2 class="sidebar-title">고객지원</h2>
      
      <nav class="sidebar-nav">
        <ul class="nav-list">
          <li class="nav-item">
            <router-link to="/notices" class="nav-link" :class="{ 'active': isActive('/notice') }">
              <span class="nav-icon">📢</span>
              <span class="nav-text">공지사항</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/event" class="nav-link" :class="{ 'active': isActive('/event') }">
              <span class="nav-icon">🎉</span>
              <span class="nav-text">이벤트</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/guide" class="nav-link" :class="{ 'active': isActive('/guide') }">
              <span class="nav-icon">📚</span>
              <span class="nav-text">이용가이드</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/support" class="nav-link" :class="{ 'active': isActive('/support') }">
              <span class="nav-icon">🤝</span>
              <span class="nav-text">고객센터</span>
            </router-link>
          </li>
        </ul>
      </nav>
      
      <div class="sidebar-banner">
        <div class="banner-content">
          <h3 class="banner-title">도움이 필요하신가요?</h3>
          <p class="banner-text">문의사항이 있으시면 언제든지 연락주세요.</p>
          <button class="contact-button" @click="goToContact">고객센터 바로가기</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { useRoute, useRouter } from 'vue-router';
  
  export default {
    name: 'SideBar',
    setup() {
      const route = useRoute();
      const router = useRouter();
      
      // 현재 경로가 특정 패턴을 포함하는지 확인
      const isActive = (path) => {
        return route.path.includes(path);
      };
      
      // 고객센터 페이지로 이동
      const goToContact = () => {
        router.push('/support');
      };
      
      return {
        isActive,
        goToContact
      };
    }
  };
  </script>
  
  <style scoped>
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
  
  /* 브랜드 컬러 변수 */
  :root {
    --primary-light: #F5F5F5;
    --primary: #48CFCB;
    --primary-dark: #229799;
    --text-dark: #424242;
  }
  
  .sidebar {
    width: 240px;
    min-width: 240px;
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  }
  
  .sidebar-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-dark);
    margin: 0 0 20px;
    padding-bottom: 15px;
    border-bottom: 2px solid var(--primary);
  }
  
  .sidebar-nav {
    margin-bottom: 30px;
  }
  
  .nav-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .nav-item {
    margin-bottom: 5px;
  }
  
  .nav-link {
    display: flex;
    align-items: center;
    padding: 12px 15px;
    border-radius: 8px;
    text-decoration: none;
    color: #555;
    font-size: 15px;
    font-weight: 500;
    transition: all 0.2s ease;
  }
  
  .nav-link:hover {
    background-color: #F5F5F5;
    color: var(--primary-dark);
  }
  
  .nav-link.active {
    background-color: var(--primary-light);
    color: var(--primary-dark);
    font-weight: 600;
  }
  
  .nav-icon {
    margin-right: 10px;
    font-size: 18px;
  }
  
  .sidebar-banner {
    background-color: var(--primary-light);
    border-radius: 8px;
    padding: 20px;
    margin-top: 30px;
  }
  
  .banner-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-dark);
    margin: 0 0 8px;
  }
  
  .banner-text {
    font-size: 14px;
    color: #666;
    margin: 0 0 15px;
    line-height: 1.4;
  }
  
  .contact-button {
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: 6px;
    padding: 10px 15px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
    width: 100%;
  }
  
  .contact-button:hover {
    background-color: var(--primary-dark);
  }
  
  @media (max-width: 991px) {
    .sidebar {
      width: 100%;
      min-width: 100%;
    }
    
    .sidebar-nav {
      margin-bottom: 20px;
    }
    
    .nav-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    
    .nav-item {
      margin-bottom: 0;
      flex: 1 0 calc(50% - 5px);
    }
    
    .nav-link {
      justify-content: center;
      padding: 15px;
    }
    
    .sidebar-banner {
      margin-top: 20px;
    }
  }
  
  @media (max-width: 767px) {
    .nav-item {
      flex: 1 0 100%;
    }
  }
  </style>
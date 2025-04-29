<!-- src/layouts/PartnerLayout.vue -->
<template>
  <div class="partner-layout" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <advertiser-sidebar @collapse-change="updateSidebarState" />
    
    <div class="main-content" :style="{ marginLeft: mainContentMargin + 'px' }">
      <div class="partner-header">
        <div class="header-left">
          <div class="title-section">
            <h1 class="page-title">{{ pageTitle }}</h1>
            <div class="breadcrumbs" v-if="breadcrumbs.length > 0">
              <div class="breadcrumb-item" v-for="(item, index) in breadcrumbs" :key="index">
                <router-link v-if="item.path" :to="item.path" class="breadcrumb-link">{{ item.name }}</router-link>
                <span v-else class="breadcrumb-text">{{ item.name }}</span>
                <span v-if="index < breadcrumbs.length - 1" class="breadcrumb-separator">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="header-right">
          <div class="header-actions">
            <button v-if="showAddButton" class="action-button">
              <span class="button-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </span>
              <span class="button-text">새 캠페인</span>
            </button>
          </div>
          
          <div class="header-notifications">
            <div class="notification-bell" @click="toggleNotifications">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span class="notification-indicator" v-if="notificationCount > 0"></span>
            </div>
            
            <transition name="fade">
              <div v-if="showNotifications" class="notification-dropdown">
                <div class="dropdown-header">
                  <h3 class="dropdown-title">알림</h3>
                  <span class="dropdown-counter">{{ notificationCount }}개의 새 알림</span>
                </div>
                <div class="dropdown-body">
                  <div class="notification-item" v-for="(notification, index) in notifications" :key="index" :class="{ 'unread': !notification.read }">
                    <div class="notification-icon" :class="notification.type">
                      <svg v-if="notification.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                      <svg v-else-if="notification.type === 'info'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                    </div>
                    <div class="notification-content">
                      <p class="notification-message">{{ notification.message }}</p>
                      <span class="notification-time">{{ notification.time }}</span>
                    </div>
                  </div>
                  <div class="empty-state" v-if="notifications.length === 0">
                    <div class="empty-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                    </div>
                    <p class="empty-text">새로운 알림이 없습니다</p>
                  </div>
                </div>
                <div class="dropdown-footer">
                  <button class="view-all-btn">모든 알림 보기</button>
                </div>
              </div>
            </transition>
          </div>
          
          <div class="user-profile" @click="toggleUserMenu">
            <div class="user-avatar">{{ userInitial }}</div>
            <transition name="fade">
              <div v-if="showUserMenu" class="user-dropdown">
                <div class="user-info">
                  <div class="user-name">{{ userName }}</div>
                  <div class="user-email">{{ userEmail }}</div>
                </div>
                <div class="dropdown-divider"></div>
                <ul class="dropdown-menu">
                  <li class="dropdown-item">
                    <router-link to="/partner/profile" class="dropdown-link">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      <span>내 프로필</span>
                    </router-link>
                  </li>
                  <li class="dropdown-item">
                    <a href="#" class="dropdown-link" @click.prevent="logout">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      <span>로그아웃</span>
                    </a>
                  </li>
                </ul>
              </div>
            </transition>
          </div>
        </div>
      </div>
      
      <div class="page-content">
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>
      </div>
    </div>
    
    <!-- 모바일용 오버레이 -->
    <div v-if="isMobile && !isSidebarCollapsed" class="mobile-overlay" @click="collapseSidebar"></div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AdvertiserSidebar from '@/components/advertiser/AdvertiserSidebar.vue';

export default {
  name: 'PartnerLayout',
  components: {
    AdvertiserSidebar
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const isSidebarCollapsed = ref(false);
    const mainContentMargin = ref(250);
    const showNotifications = ref(false);
    const showUserMenu = ref(false);
    const isMobile = ref(false);
    
    // 사용자 정보
    const userName = ref('홍길동');
    const userEmail = ref('hong@gildong.com');
    const userInitial = computed(() => userName.value.charAt(0));
    
    // 알림 정보
    const notificationCount = ref(3);
    const notifications = ref([
      {
        type: 'success',
        message: '새 캠페인이 성공적으로 등록되었습니다',
        time: '방금 전',
        read: false
      },
      {
        type: 'info',
        message: '3명의 리뷰어가 캠페인에 지원했습니다',
        time: '10분 전',
        read: false
      },
      {
        type: 'warning',
        message: '캠페인 마감일이 3일 남았습니다',
        time: '1시간 전',
        read: true
      }
    ]);
    
    // 페이지 정보
    const pageTitle = computed(() => {
      const path = route.path;
      
      // 경로에 따른 페이지 타이틀 매핑
      const titleMap = {
        '/partner/dashboard': '대시보드',
        '/partner/campaigns/all': '전체 캠페인',
        '/partner/campaigns/pending': '선정 대기 캠페인',
        '/partner/campaigns/active': '모집 중 캠페인',
        '/partner/campaigns/completed': '완료된 캠페인',
        '/partner/reviews': '등록된 리뷰',
        '/partner/notices': '공지사항',
        '/partner/inquiry': '1:1 문의',
        '/partner/faq': 'FAQ',
        '/partner/profile': '내 정보',
        '/partner/proxy-campaign': '대리 캠페인 진행 신청하기',
        '/partner/blog-agency': '블로그 대행 문의',
        '/partner/blog-branding': '블로그 브랜딩 문의'
      };
      
      return titleMap[path] || '파트너센터';
    });
    
    // 새 캠페인 버튼 표시 여부
    const showAddButton = computed(() => {
      return [
        '/partner/campaigns/all',
        '/partner/campaigns/active',
        '/partner/campaigns/pending',
        '/partner/campaigns/completed',
        '/partner/dashboard'
      ].includes(route.path);
    });
    
    // 현재 경로에 따른 브레드크럼 생성
    const breadcrumbs = computed(() => {
      const path = route.path;
      const parts = path.split('/').filter(Boolean);
      
      if (parts.length <= 1) return []; // 대시보드는 브레드크럼 표시 안함
      
      const result = [
        { name: '홈', path: '/partner/dashboard' }
      ];
      
      if (parts[1] === 'campaigns') {
        result.push({ name: '캠페인 관리', path: '/partner/campaigns/all' });
        
        if (parts[2]) {
          const campaignTypeMap = {
            'all': '전체 캠페인',
            'pending': '선정 대기 캠페인',
            'active': '모집 중 캠페인',
            'completed': '완료된 캠페인'
          };
          
          result.push({ name: campaignTypeMap[parts[2]] || parts[2], path: null });
        }
      } else {
        const sectionMap = {
          'reviews': '등록된 리뷰',
          'notices': '공지사항',
          'inquiry': '1:1 문의',
          'faq': 'FAQ',
          'profile': '내 정보',
          'proxy-campaign': '대리 캠페인 진행 신청하기',
          'blog-agency': '블로그 대행 문의',
          'blog-branding': '블로그 브랜딩 문의'
        };
        
        result.push({ name: sectionMap[parts[1]] || parts[1], path: null });
      }
      
      return result;
    });
    
    // 사이드바 상태 업데이트
    const updateSidebarState = (collapsed) => {
      isSidebarCollapsed.value = collapsed;
      mainContentMargin.value = collapsed ? 70 : 250;
    };
    
    // 모바일에서 사이드바 접기
    const collapseSidebar = () => {
      isSidebarCollapsed.value = true;
      mainContentMargin.value = 70;
    };
    
    // 알림 토글
    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
      if (showNotifications.value) {
        showUserMenu.value = false;
      }
    };
    
    // 유저 메뉴 토글
    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value;
      if (showUserMenu.value) {
        showNotifications.value = false;
      }
    };
    
    // 로그아웃
    const logout = () => {
      router.push('/login');
    };
    
    // 클릭 이벤트 감지하여 드롭다운 닫기
    const handleClickOutside = (event) => {
      const notificationArea = document.querySelector('.header-notifications');
      const userMenuArea = document.querySelector('.user-profile');
      
      if (showNotifications.value && notificationArea && !notificationArea.contains(event.target)) {
        showNotifications.value = false;
      }
      
      if (showUserMenu.value && userMenuArea && !userMenuArea.contains(event.target)) {
        showUserMenu.value = false;
      }
    };
    
    // 모바일 환경 체크
    const checkMobile = () => {
      isMobile.value = window.innerWidth < 768;
      if (isMobile.value && !isSidebarCollapsed.value) {
        collapseSidebar();
      }
    };
    
    // 컴포넌트 마운트
    onMounted(() => {
      const savedState = localStorage.getItem('sidebarCollapsed');
      if (savedState !== null) {
        updateSidebarState(savedState === 'true');
      }
      
      document.addEventListener('click', handleClickOutside);
      window.addEventListener('resize', checkMobile);
      checkMobile();
    });
    
    // 컴포넌트 언마운트
    const beforeUnmount = () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('resize', checkMobile);
    };
    
    // 경로 변경 감지
    watch(route, () => {
      if (isMobile.value) {
        collapseSidebar();
      }
      
      // 드롭다운 메뉴 닫기
      showNotifications.value = false;
      showUserMenu.value = false;
    });
    
    return {
      isSidebarCollapsed,
      mainContentMargin,
      showNotifications,
      showUserMenu,
      isMobile,
      userName,
      userEmail,
      userInitial,
      notificationCount,
      notifications,
      pageTitle,
      showAddButton,
      breadcrumbs,
      updateSidebarState,
      collapseSidebar,
      toggleNotifications,
      toggleUserMenu,
      logout,
      beforeUnmount
    };
  }
};
</script>

<style scoped>
/* 브랜드 컬러 변수 정의 */
:root {
  --brand-light-grey: #F5F5F5;
  --brand-light-teal: #48CFCB;
  --brand-teal: #229799;
  --brand-dark-grey: #424242;
  
  /* 기타 변수 */
  --text-dark: var(--brand-dark-grey);
  --text-light: #5c6a7e;
  --text-muted: #94a3b8;
  --border-color: #e6e6e6;
  --bg-light: var(--brand-light-grey);
  --bg-card: #ffffff;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* 알림 상태 색상 */
  --success: #10b981;
  --warning: #f59e0b;
  --info: #3b82f6;
  --error: #ef4444;
}

/* 메인 레이아웃 */
.partner-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-light);
  font-family: 'Pretendard', sans-serif;
  position: relative;
}

.main-content {
  flex: 1;
  transition: margin-left var(--transition);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 상단 헤더 */
.partner-header {
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  background-color: #ffffff;
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
}

.title-section {
  display: flex;
  flex-direction: column;
}

.page-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0;
  letter-spacing: -0.3px;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  margin-top: 4px;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  font-size: 13px;
}

.breadcrumb-link {
  color: var(--brand-teal);
  text-decoration: none;
  transition: color var(--transition);
}

.breadcrumb-link:hover {
  color: var(--brand-light-teal);
  text-decoration: none;
}

.breadcrumb-text {
  color: var(--text-muted);
}

.dropdown-divider {
  height: 1px;
  background-color: var(--border-color);
  margin: 0;
}

.dropdown-menu {
  list-style: none;
  padding: 8px 0;
  margin: 0;
  background-color: #ffffff;
}

.dropdown-item {
  width: 100%;
}

.dropdown-link {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  color: var(--brand-teal);
  text-decoration: none;
  transition: background-color var(--transition);
  font-size: 14px;
}

.dropdown-link:hover {
  background-color: var(--bg-light);
  text-decoration: none;
}

.dropdown-link svg {
  margin-right: 12px;
  color: var(--text-light);
}

/* 페이지 콘텐츠 */
.page-content {
  flex: 1;
  background-color: var(--bg-card);
  margin: 16px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

/* 모바일 오버레이 */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 5;
}

/* 애니메이션 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 반응형 스타일 */
@media (max-width: 1024px) {
  .page-content {
    margin: 12px;
  }
}

@media (max-width: 768px) {
  .partner-header {
    padding: 0 16px;
  }
  
  .page-title {
    font-size: 18px;
  }
  
  .breadcrumbs {
    display: none;
  }
  
  .action-button .button-text {
    display: none;
  }
  
  .action-button {
    width: 38px;
    padding: 0;
    justify-content: center;
  }
  
  .notification-dropdown,
  .user-dropdown {
    position: fixed;
    top: 70px;
    right: 0;
    left: 0;
    margin-top: 0;
    width: 100%;
    border-radius: 0;
    max-height: calc(100vh - 70px);
    overflow-y: auto;
  }
  
  .dropdown-body {
    max-height: none;
  }
  
  .page-content {
    margin: 8px;
  }
}

.breadcrumb-separator {
  display: flex;
  align-items: center;
  color: var(--text-muted);
  margin: 0 4px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 새 캠페인 버튼 - 살짝 떠 있는 느낌으로 디자인 */
.action-button {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 38px;
  padding: 0 16px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  background-color: #48CFCB;
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
  position: relative;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}

.action-button:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.button-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 알림 */
.header-notifications {
  position: relative;
}

.notification-bell {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color var(--transition);
  position: relative;
  color: var(--brand-light-teal);
}

.notification-bell:hover {
  color: var(--brand-light-teal);
}

.notification-indicator {
  position: absolute;
  top: 8px;
  right: 10px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #FF0000;
  border: 2px solid #ff0000;
}

.notification-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  width: 320px;
  background-color: #ffffff;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  z-index: 20;
  border: 1px solid var(--border-color);
}

.dropdown-header {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
}

.dropdown-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0;
}

.dropdown-counter {
  font-size: 12px;
  color: var(--text-muted);
}

.dropdown-body {
  max-height: 320px;
  overflow-y: auto;
  background-color: #ffffff;
}

.dropdown-body::-webkit-scrollbar {
  width: 4px;
}

.dropdown-body::-webkit-scrollbar-thumb {
  background-color: var(--text-muted);
  border-radius: 2px;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  transition: background-color var(--transition);
  cursor: pointer;
  border-bottom: 1px solid var(--border-color);
  background-color: #ffffff;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item:hover {
  background-color: var(--bg-light);
}

.notification-item.unread {
  background-color: rgba(72, 207, 203, 0.05);
}

.notification-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
}

.notification-icon.success {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--success);
}

.notification-icon.warning {
  background-color: rgba(245, 158, 11, 0.1);
  color: var(--warning);
}

.notification-icon.info {
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--info);
}

.notification-content {
  flex: 1;
}

.notification-message {
  font-size: 14px;
  color: var(--text-dark);
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.notification-time {
  font-size: 12px;
  color: var(--text-muted);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  text-align: center;
  background-color: #ffffff;
}

.empty-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--bg-light);
  color: var(--text-muted);
  margin-bottom: 12px;
}

.empty-text {
  font-size: 14px;
  color: var(--text-muted);
  margin: 0;
}

.dropdown-footer {
  padding: 12px 16px;
  border-top: 1px solid var(--border-color);
  text-align: center;
  background-color: #ffffff;
}

.view-all-btn {
  width: 100%;
  padding: 8px 16px;
  background-color: var(--bg-light);
  color: var(--brand-teal);
  border: 1px solid var(--brand-teal);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition);
}

.view-all-btn:hover {
  background-color: #e8f7f6;
  border-color: var(--brand-teal);
}

/* 사용자 프로필 */
.user-profile {
  position: relative;
  cursor: pointer;
}

.user-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background-color: #48CFCB;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  width: 220px;
  background-color: #ffffff;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  z-index: 20;
  border: 1px solid var(--border-color);
}

.user-info {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  background-color: #ffffff;
}

.user-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 4px;
}

.user-email {
  font-size: 12px;
  color: var(--text-muted);
}
</style>
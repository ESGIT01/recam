<!-- src/components/advertiser/AdvertiserSidebar.vue -->
<template>
  <div class="advertiser-sidebar" :class="{ 'collapsed': isCollapsed }">
    <div class="sidebar-header">
      <div class="logo-container">
        <div class="text-logo">RC</div>
        <h1 class="partner-title" v-if="!isCollapsed">파트너센터</h1>
      </div>
      <button class="collapse-btn" @click="toggleCollapse">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6" v-if="!isCollapsed"></polyline>
          <polyline points="9 18 15 12 9 6" v-else></polyline>
        </svg>
      </button>
    </div>

    <div class="advertiser-info" v-if="!isCollapsed">
      <div class="advertiser-avatar">
        <div class="avatar-placeholder">{{ advertiser.name.charAt(0) }}</div>
      </div>
      <div class="advertiser-details">
        <div class="advertiser-name">{{ advertiser.name }}</div>
        <div class="advertiser-company">{{ advertiser.company }}</div>
      </div>
    </div>

    <div class="sidebar-content">
      <nav class="sidebar-nav">
        <ul class="nav-list">
          <!-- 대시보드 -->
          <li class="nav-item">
            <router-link to="/partner/dashboard" class="nav-link" :class="{ 'active': currentPath === '/partner/dashboard' }">
              <span class="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="7" height="9"></rect>
                  <rect x="14" y="3" width="7" height="5"></rect>
                  <rect x="14" y="12" width="7" height="9"></rect>
                  <rect x="3" y="16" width="7" height="5"></rect>
                </svg>
              </span>
              <span class="nav-label" v-if="!isCollapsed">대시보드</span>
              <span class="tooltip" v-if="isCollapsed">대시보드</span>
            </router-link>
          </li>

          <!-- 캠페인 관리 (드롭다운) -->
          <li class="nav-item dropdown">
            <div class="nav-link" @click="toggleSubmenu('campaigns')" :class="{ 'active': isSubmenuActive('campaigns') }">
              <span class="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                </svg>
              </span>
              <span class="nav-label" v-if="!isCollapsed">캠페인 관리</span>
              <span class="dropdown-arrow" v-if="!isCollapsed">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="{ 'rotated': openSubmenu === 'campaigns' }">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
              <span class="tooltip" v-if="isCollapsed">캠페인 관리</span>
              <span class="badge" v-if="hasPendingCampaigns">{{ pendingCount }}</span>
            </div>
            <transition name="slide-fade">
              <ul class="submenu" v-if="openSubmenu === 'campaigns' || (isCollapsed && isSubmenuHovered === 'campaigns')">
                <li class="submenu-item">
                  <router-link to="/partner/campaigns/all" class="submenu-link" :class="{ 'active': currentPath === '/partner/campaigns/all' }">
                    <span class="submenu-label">전체 캠페인</span>
                  </router-link>
                </li>
                <li class="submenu-item">
                  <router-link to="/partner/campaigns/pending" class="submenu-link" :class="{ 'active': currentPath === '/partner/campaigns/pending' }">
                    <span class="submenu-label">선정 대기 캠페인</span>
                  </router-link>
                </li>
                <li class="submenu-item">
                  <router-link to="/partner/campaigns/active" class="submenu-link" :class="{ 'active': currentPath === '/partner/campaigns/active' }">
                    <span class="submenu-label">모집 중 캠페인</span>
                  </router-link>
                </li>
                <li class="submenu-item">
                  <router-link to="/partner/campaigns/completed" class="submenu-link" :class="{ 'active': currentPath === '/partner/campaigns/completed' }">
                    <span class="submenu-label">완료된 캠페인</span>
                  </router-link>
                </li>
                <li class="submenu-item">
                  <router-link to="/partner/reviews" class="submenu-link" :class="{ 'active': currentPath === '/partner/reviews' }">
                    <span class="submenu-label">등록된 리뷰</span>
                  </router-link>
                </li>
              </ul>
            </transition>
          </li>

          <!-- 공지사항 -->
          <li class="nav-item">
            <router-link to="/partner/notices" class="nav-link" :class="{ 'active': currentPath === '/partner/notices' }">
              <span class="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </span>
              <span class="nav-label" v-if="!isCollapsed">공지사항</span>
              <span class="tooltip" v-if="isCollapsed">공지사항</span>
              <span class="badge new" v-if="hasNewNotice"></span>
            </router-link>
          </li>

          <!-- 1:1 문의 -->
          <li class="nav-item">
            <router-link to="/partner/inquiry" class="nav-link" :class="{ 'active': currentPath === '/partner/inquiry' }">
              <span class="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </span>
              <span class="nav-label" v-if="!isCollapsed">1:1 문의</span>
              <span class="tooltip" v-if="isCollapsed">1:1 문의</span>
            </router-link>
          </li>

          <!-- FAQ -->
          <li class="nav-item">
            <router-link to="/partner/faq" class="nav-link" :class="{ 'active': currentPath === '/partner/faq' }">
              <span class="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </span>
              <span class="nav-label" v-if="!isCollapsed">FAQ</span>
              <span class="tooltip" v-if="isCollapsed">FAQ</span>
            </router-link>
          </li>

          <li class="nav-divider" v-if="!isCollapsed"></li>

          <!-- 정보 수정하기 -->
          <li class="nav-item">
            <router-link to="/partner/profile" class="nav-link" :class="{ 'active': currentPath === '/partner/profile' }">
              <span class="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </span>
              <span class="nav-label" v-if="!isCollapsed">정보 수정하기</span>
              <span class="tooltip" v-if="isCollapsed">정보 수정하기</span>
            </router-link>
          </li>

          <!-- 리뷰캠퍼스 대리 캠페인 진행 신청하기 -->
          <li class="nav-item">
            <router-link to="/partner/proxy-campaign" class="nav-link" :class="{ 'active': currentPath === '/partner/proxy-campaign' }">
              <span class="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </span>
              <span class="nav-label small-text" v-if="!isCollapsed">대리 캠페인 진행 신청하기</span>
              <span class="tooltip" v-if="isCollapsed">대리 캠페인 진행 신청하기</span>
            </router-link>
          </li>

          <!-- 블로그 대행 문의 -->
          <li class="nav-item">
            <router-link to="/partner/blog-agency" class="nav-link" :class="{ 'active': currentPath === '/partner/blog-agency' }">
              <span class="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              </span>
              <span class="nav-label" v-if="!isCollapsed">블로그 대행 문의</span>
              <span class="tooltip" v-if="isCollapsed">블로그 대행 문의</span>
            </router-link>
          </li>

          <!-- 블로그 브랜딩 문의 -->
          <li class="nav-item">
            <router-link to="/partner/blog-branding" class="nav-link" :class="{ 'active': currentPath === '/partner/blog-branding' }">
              <span class="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </span>
              <span class="nav-label" v-if="!isCollapsed">블로그 브랜딩 문의</span>
              <span class="tooltip" v-if="isCollapsed">블로그 브랜딩 문의</span>
            </router-link>
          </li>

          <li class="nav-divider" v-if="!isCollapsed"></li>

          <!-- 로그아웃 -->
          <li class="nav-item">
            <a href="#" class="nav-link" @click.prevent="logout">
              <span class="nav-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </span>
              <span class="nav-label" v-if="!isCollapsed">로그아웃</span>
              <span class="tooltip" v-if="isCollapsed">로그아웃</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'AdvertiserSidebar',
  props: {
    initialCollapsed: {
      type: Boolean,
      default: false
    }
  },
  
  setup(props, { emit }) {
    const isCollapsed = ref(props.initialCollapsed);
    const openSubmenu = ref(null);
    const isSubmenuHovered = ref(null);
    const route = useRoute();
    const router = useRouter();
    
    // 현재 광고주 정보 (실제로는 API에서 가져올 것)
    const advertiser = ref({
      name: '홍길동',
      company: '길동 주식회사',
      avatar: null
    });
    
    // 알림 상태
    const hasPendingCampaigns = ref(true);
    const pendingCount = ref(3);
    const hasNewNotice = ref(true);
    
    // 현재 경로 계산
    const currentPath = computed(() => route.path);
    
    // 사이드바 접기/펼치기
    const toggleCollapse = () => {
      isCollapsed.value = !isCollapsed.value;
      localStorage.setItem('sidebarCollapsed', isCollapsed.value);
      emit('collapse-change', isCollapsed.value);
    };
    
    // 서브메뉴 토글
    const toggleSubmenu = (menuId) => {
      openSubmenu.value = openSubmenu.value === menuId ? null : menuId;
    };
    
    // 서브메뉴 활성화 여부 확인
    const isSubmenuActive = (menuId) => {
      const campaignPaths = [
        '/partner/campaigns/all',
        '/partner/campaigns/pending',
        '/partner/campaigns/active',
        '/partner/campaigns/completed',
        '/partner/reviews'
      ];
      
      if (menuId === 'campaigns') {
        return campaignPaths.includes(currentPath.value);
      }
      
      return false;
    };
    
    // 로그아웃 처리
    const logout = () => {
      // 로그아웃 로직 구현
      // API 호출 후 로그인 페이지로 리다이렉트
      router.push('/login');
    };
    
    // 서브메뉴 호버 처리
    const onMenuHover = (menuId) => {
      if (isCollapsed.value) {
        isSubmenuHovered.value = menuId;
      }
    };
    
    const onMenuLeave = () => {
      isSubmenuHovered.value = null;
    };
    
    // 컴포넌트 마운트시 localStorage에서 상태 복원
    onMounted(() => {
      const savedState = localStorage.getItem('sidebarCollapsed');
      if (savedState !== null) {
        isCollapsed.value = savedState === 'true';
      }
      
      // 현재 경로에 따라 서브메뉴 자동 오픈
      if (isSubmenuActive('campaigns')) {
        openSubmenu.value = 'campaigns';
      }
    });
    
    return {
      isCollapsed,
      openSubmenu,
      isSubmenuHovered,
      advertiser,
      currentPath,
      hasPendingCampaigns,
      pendingCount,
      hasNewNotice,
      toggleCollapse,
      toggleSubmenu,
      isSubmenuActive,
      onMenuHover,
      onMenuLeave,
      logout
    };
  }
};
</script>

<style scoped>
/* 기본 변수 */
:root {
  --primary: #229799;
  --primary-light: #48CFCB;
  --primary-dark: #1d8385;
  --gray-light: #F5F5F5;
  --gray-dark: #424242;
  --border-color: #e6e6e6;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.advertiser-sidebar {
  display: flex;
  flex-direction: column;
  width: 250px;
  height: 100vh;
  background-color: #ffffff;
  border-right: 1px solid var(--border-color);
  transition: width 0.3s ease;
  overflow-y: auto;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  box-shadow: var(--shadow-sm);
}

.advertiser-sidebar.collapsed {
  width: 70px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  height: 70px;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.text-logo {
  height: 32px;
  width: 32px;
  background-color: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(34, 151, 153, 0.2);
}

.partner-title {
  font-family: 'Pretendard', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: var(--primary);
  margin: 0;
}

.collapse-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.collapse-btn:hover {
  background-color: var(--gray-light);
}

.advertiser-info {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  gap: 12px;
}

.advertiser-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background-color: var(--primary-light);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
}

.advertiser-details {
  display: flex;
  flex-direction: column;
}

.advertiser-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--gray-dark);
}

.advertiser-company {
  font-size: 13px;
  color: #666;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
}

/* 스크롤바 스타일링 */
.sidebar-content::-webkit-scrollbar {
  width: 4px;
}

.sidebar-content::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 2px;
  position: relative;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: var(--gray-dark);
  text-decoration: none;
  border-radius: 8px;
  transition: background-color 0.2s;
  cursor: pointer;
  position: relative;
}

.nav-link:hover {
  background-color: var(--gray-light);
}

.nav-link.active {
  background-color: #e8f7f6;
  color: var(--primary);
  font-weight: 500;
}

.nav-link.active .nav-icon {
  color: var(--primary);
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  margin-right: 12px;
  color: #666;
}

.collapsed .nav-icon {
  margin-right: 0;
  margin-left: 6px;
}

.nav-label {
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.nav-label.small-text {
  font-size: 13px;
}

/* 툴팁 스타일 */
.tooltip {
  position: absolute;
  left: 60px;
  top: 50%;
  transform: translateY(-50%);
  background-color: #333;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  z-index: 10;
}

.tooltip:before {
  content: '';
  position: absolute;
  left: -4px;
  top: 50%;
  transform: translateY(-50%);
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  border-right: 4px solid #333;
}

.nav-link:hover .tooltip {
  opacity: 1;
}

.dropdown-arrow {
  margin-left: 8px;
  display: flex;
  align-items: center;
}

.dropdown-arrow svg {
  transition: transform 0.3s ease;
}

.dropdown-arrow svg.rotated {
  transform: rotate(180deg);
}

.submenu {
  list-style: none;
  padding: 0 0 0 36px;
  margin: 4px 0;
}

.collapsed .submenu {
  position: absolute;
  left: 70px;
  top: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 180px;
  padding: 8px;
  z-index: 5;
}

.submenu-item {
  margin-bottom: 2px;
}

.submenu-link {
  display: flex;
  padding: 8px 12px;
  color: #666;
  text-decoration: none;
  font-size: 13px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.submenu-link:hover {
  background-color: var(--gray-light);
  color: var(--primary);
}

.submenu-link.active {
  color: var(--primary);
  font-weight: 500;
  background-color: #e8f7f6;
}

.nav-divider {
  height: 1px;
  background-color: var(--border-color);
  margin: 12px 16px;
}

/* 배지 스타일 */
.badge {
  position: absolute;
  top: 12px;
  right: 16px;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  background-color: #ff5252;
  color: white;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
}

.badge.new {
  width: 8px;
  height: 8px;
  min-width: auto;
  padding: 0;
  right: 20px;
  top: 13px;
  background-color: #ff5252;
}

/* 애니메이션 */
.slide-fade-enter-active, 
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from, 
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .advertiser-sidebar:not(.collapsed) {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  }
  
  .advertiser-sidebar.collapsed {
    transform: translateX(-100%);
    width: 250px;
  }
}
</style>
<template>
  <header class="site-header">
    <!-- 상단 공지사항 영역 -->
    <div class="notice-bar">
      <div class="container">
        <div class="notice-slider">
          <transition name="fade-notice" mode="out-in">
            <div :key="currentNoticeIndex" class="notice-item">
              {{ notices[currentNoticeIndex].content }}
            </div>
          </transition>
        </div>
      </div>
    </div>
    
    <!-- 메인 헤더 -->
    <div class="main-header">
      <div class="container">
        <!-- 로고 영역 -->
        <div class="logo-area">
          <router-link to="/" class="logo-link">
            <img src="@/assets/logo.png" alt="로고" class="logo-image">
          </router-link>
        </div>
        
        <!-- 메인 네비게이션 -->
        <nav class="main-nav">
          <ul class="nav-list">
            <li 
              v-for="(item, index) in menuItems" 
              :key="index" 
              class="nav-item"
              @mouseenter="handleMouseEnter(item.id)"
              :class="{ 'active': activeMenu === item.id }"
            >
              <router-link :to="item.path" class="nav-link">
                {{ item.title }}
              </router-link>
            </li>
          </ul>
        </nav>
        
        <!-- 우측 유틸리티 영역 -->
        <div class="utility-area">
          <div class="utility-links">
            <router-link to="/today" class="utility-link highlight">오늘오픈</router-link>
            <router-link to="/event" class="utility-link highlight">이벤트</router-link>
            <router-link to="/guide" class="utility-link highlight">이용가이드</router-link>
            <router-link to="/support" class="utility-link highlight">고객센터</router-link>
          </div>
          
          <div class="search-box">
            <input 
              type="text" 
              class="search-input" 
              placeholder="검색어를 입력하세요" 
              v-model="searchQuery"
              :class="{ 'expanded': isSearchActive }"
              @focus="isSearchActive = true"
              @blur="handleSearchBlur"
            />
            <button class="search-btn" @click="toggleSearch">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
          
          <router-link to="/login" class="login-btn">로그인</router-link>
          <button class="ad-inquiry-btn">
            <router-link to="/ADcenter" class="btn-text">광고문의</router-link>
            <span class="wipe-effect"></span>
          </button>
        </div>
        
        <!-- 모바일 메뉴 토글 버튼 -->
        <button class="mobile-toggle" @click="isMobileMenuOpen = !isMobileMenuOpen">
          <span class="toggle-line"></span>
          <span class="toggle-line"></span>
          <span class="toggle-line"></span>
        </button>
      </div>
    </div>
    
    <!-- 메가메뉴 영역 -->
    <transition name="mega-fade">
      <div 
        v-if="activeMenu" 
        class="mega-menu-container" 
        @mouseleave="handleMouseLeave"
      >
        <MegaMenu 
          :active-menu="activeMenu" 
          :menu-items="menuItems"
        />
      </div>
    </transition>
    
    <!-- 모바일 메뉴 -->
    <transition name="slide-right">
      <div v-if="isMobileMenuOpen" class="mobile-menu">
        <div class="mobile-header">
          <img src="@/assets/logo.png" alt="로고" class="mobile-logo">
          <button class="mobile-close" @click="isMobileMenuOpen = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="mobile-content">
          <div class="mobile-search">
            <input type="text" class="mobile-search-input" placeholder="검색어를 입력하세요">
            <button class="mobile-search-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
          
          <div class="mobile-utility">
            <router-link to="/today" class="mobile-utility-link highlight">오늘오픈</router-link>
            <router-link to="/event" class="mobile-utility-link">이벤트</router-link>
            <router-link to="/guide" class="mobile-utility-link">이용가이드</router-link>
            <router-link to="/support" class="mobile-utility-link">고객센터</router-link>
          </div>
          
          <ul class="mobile-nav">
            <li v-for="(item, index) in menuItems" :key="index" class="mobile-nav-item">
              <div 
                class="mobile-nav-title" 
                @click="toggleMobileSubmenu(item.id)"
              >
                {{ item.title }}
                <span class="arrow" :class="{ 'open': mobileSubmenu === item.id }">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              </div>
              
              <div v-show="mobileSubmenu === item.id" class="mobile-submenu">
                <div v-for="(category, catIndex) in item.megaMenuContent.categories" :key="catIndex" class="mobile-category">
                  <h3 class="mobile-category-title">{{ category.title }}</h3>
                  <ul class="mobile-category-list">
                    <li v-for="(subItem, subIndex) in category.items" :key="subIndex" class="mobile-category-item">
                      <router-link :to="generateCategoryLink(item.id, subItem)" class="mobile-category-link">
                        {{ subItem.name }}
                      </router-link>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          </ul>
          
          <div class="mobile-buttons">
            <button class="mobile-login">로그인</button>
            <button class="mobile-ad">광고문의</button>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import MegaMenu from './MegaMenu.vue';

export default {
  name: 'SiteHeader',
  components: {
    MegaMenu
  },
  setup() {
    const activeMenu = ref(null);
    const isMobileMenuOpen = ref(false);
    const mobileSubmenu = ref(null);
    const isSearchActive = ref(false);
    const searchQuery = ref('');
    let timeoutId = null;
    
    // 공지사항 데이터
    const notices = ref([
      { id: 1, content: '3/22 14:00 ~ 20:00 서비스 이용 중지 안내' },
      { id: 2, content: '리뷰캠퍼스 앱 출시 안내' },
      { id: 3, content: '신규회원 가입 시 3,000포인트 지급!' }
    ]);
    
    // 공지사항 슬라이더
    const currentNoticeIndex = ref(0);
    let noticeInterval = null;
    
    const startNoticeRotation = () => {
      noticeInterval = setInterval(() => {
        currentNoticeIndex.value = (currentNoticeIndex.value + 1) % notices.value.length;
      }, 5000);
    };

    // 메뉴 데이터
    const menuItems = ref([
      {
        id: 'delivery',
        title: '배송형',
        path: '/delivery',
        megaMenuContent: {
          categories: [
            { 
              title: '배송형', 
              items: [
                { name: '전체', path: '/delivery' },
                { name: '식품', path: '/delivery/food' },
                { name: '생활', path: '/delivery/life' },
                { name: '뷰티', path: '/delivery/beauty' },
                { name: '유아동', path: '/delivery/child' },
                { name: '스포츠/아웃도어', path: '/delivery/sports' },
                { name: '패션/잡화', path: '/delivery/fashion' },
                { name: '반려동물', path: '/delivery/pet' },
                { name: '테크/가전', path: '/delivery/tech' },
                { name: '도서/교육', path: '/delivery/education' },
                { name: '서비스', path: '/delivery/service' },
                { name: '기타', path: '/delivery/etc' }
              ] 
            },
            { 
              title: '캠페인 유형', 
              items: [
                { name: '오늘오픈 캠페인', path: '/delivery/open' },
                { name: '마감임박 캠페인', path: '/delivery/imminent' },
                { name: '선정확률 높은 캠페인', path: '/delivery/probability' },
                { name: '포인트 캠페인', path: '/delivery/point' }
              ] 
            },
            { 
              title: '채널 유형', 
              items: [
                { name: '블로그', path: '/delivery/blog' },
                { name: '인스타그램', path: '/delivery/instagram' },
                { name: '유튜브', path: '/delivery/youtube' },
                { name: '틱톡', path: '/delivery/tiktok' },
                { name: '클립 - 블로그', path: '/delivery/clip' },
                { name: '릴스 - 인스타그램', path: '/delivery/reels' },
                { name: '쇼츠 - 유튜브', path: '/delivery/shorts' }
              ] 
            }
          ]
        }
      },
      {
        id: 'visit',
        title: '방문형',
        path: '/visit',
        megaMenuContent: {
          categories: [
            { 
              title: '방문형', 
              items: [
                { name: '전체', path: '/visit' },
                { name: '맛집', path: '/visit/famous' },
                { name: '숙박', path: '/visit/accommodation' },
                { name: '뷰티', path: '/visit/beauty' },
                { name: '문화', path: '/visit/culture' },
                { name: '배달', path: '/visit/delivery' },
                { name: '스포츠/레저', path: '/visit/sports' },
                { name: '테이크아웃', path: '/visit/takeout' },
                { name: '기타', path: '/visit/etc' },
              ] 
            },
            { 
              title: '캠페인 유형', 
              items: [
                { name: '오늘오픈 캠페인', path: '/visit/open' },
                { name: '마감임박 캠페인', path: '/visit/imminent' },
                { name: '선정확률 높은 캠페인', path: '/visit/probability' },
                { name: '포인트 캠페인', path: '/visit/point' }
              ] 
            },
            { 
              title: '채널 유형', 
              items: [
                { name: '블로그', path: '/visit/blog' },
                { name: '인스타그램', path: '/visit/instagram' },
                { name: '유튜브', path: '/visit/youtube' },
                { name: '틱톡', path: '/visit/tiktok' },
                { name: '클립 - 블로그', path: '/visit/clip' },
                { name: '릴스 - 인스타그램', path: '/visit/reels' },
                { name: '쇼츠 - 유튜브', path: '/visit/shorts' }
              ] 
            }
          ]
        }
      },
      {
        id: 'purchase',
        title: '구매형',
        path: '/purchase',
        megaMenuContent: {
          categories: [
            { 
              title: '구매평', 
              items: [
                { name: '전체', path: '/purchase' },
                { name: '구매평', path: '/purchase/evaluation' },
                { name: '구매평 + 리뷰', path: '/purchase/review' }
              ] 
            },
            { 
              title: '캠페인 유형', 
              items: [
                { name: '오늘오픈 캠페인', path: '/purchase/open' },
                { name: '마감임박 캠페인', path: '/purchase/imminent' },
                { name: '선정확률 높은 캠페인', path: '/purchase/probability' },
                { name: '포인트 캠페인', path: '/purchase/point' }
              ] 
            },
            { 
              title: '채널 유형', 
              items: [
                { name: '블로그', path: '/purchase/blog' },
                { name: '인스타그램', path: '/purchase/instagram' },
                { name: '유튜브', path: '/purchase/youtube' },
                { name: '틱톡', path: '/purchase/tiktok' },
                { name: '클립 - 블로그', path: '/purchase/clip' },
                { name: '릴스 - 인스타그램', path: '/purchase/reels' },
                { name: '쇼츠 - 유튜브', path: '/purchase/shorts' }
              ] 
            }
          ]
        }
      },
      {
        id: 'reporter',
        title: '기자단',
        path: '/reporter',
        megaMenuContent: {
          categories: [
            { 
              title: '기자단 소개', 
              items: [
                { name: '전체', path: '/reporter' },
                { name: '원고형', path: '/reporter/manuscript' },
                { name: '회수형', path: '/reporter/recovery' }
              ] 
            },
            { 
              title: '캠페인 유형', 
              items: [
                { name: '오늘오픈 캠페인', path: '/reporter/open' },
                { name: '마감임박 캠페인', path: '/reporter/imminent' },
                { name: '선정확률 높은 캠페인', path: '/reporter/probability' },
                { name: '포인트 캠페인', path: '/reporter/point' }
              ] 
            },
            { 
              title: '채널 유형', 
              items: [
                { name: '블로그', path: '/reporter/blog' },
                { name: '인스타그램', path: '/reporter/instagram' },
                { name: '유튜브', path: '/reporter/youtube' },
                { name: '틱톡', path: '/reporter/tiktok' },
                { name: '클립 - 블로그', path: '/reporter/clip' },
                { name: '릴스 - 인스타그램', path: '/reporter/reels' },
                { name: '쇼츠 - 유튜브', path: '/reporter/shorts' }
              ] 
            }
          ]
        }
      }
    ]);

    // 마우스 호버 처리
    const handleMouseEnter = (menuId) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        activeMenu.value = menuId;
      }, 100);
    };

    const handleMouseLeave = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        activeMenu.value = null;
      }, 150);
    };

    // 검색 함수
    const toggleSearch = () => {
      isSearchActive.value = !isSearchActive.value;
      if (isSearchActive.value) {
        setTimeout(() => {
          document.querySelector('.search-input').focus();
        }, 100);
      }
    };

    const handleSearchBlur = () => {
      if (!searchQuery.value) {
        isSearchActive.value = false;
      }
    };

    // 모바일 서브메뉴 토글
    const toggleMobileSubmenu = (menuId) => {
      mobileSubmenu.value = mobileSubmenu.value === menuId ? null : menuId;
    };

    // 카테고리 링크 생성 함수 (라우터 파라미터 활용)
    const generateCategoryLink = (mainCategory, item) => {
      const pathParts = item.path.split('/');
      
      // 전체 카테고리로 돌아가는 경우 (/delivery, /visit 등)
      if (pathParts.length <= 2 || pathParts[2] === '') {
        return { path: `/${mainCategory}` };
      }
      
      // 하위 카테고리 링크 (/delivery/beauty 등)
      const category = pathParts[2];
      
      // 특정 카테고리일 경우 라우터 이름과 파라미터 사용
      return { 
        name: `${mainCategory}-category`, 
        params: { category: category }
      };
    };

    // 창 크기 변경 처리
    const handleResize = () => {
      if (window.innerWidth > 991 && isMobileMenuOpen.value) {
        isMobileMenuOpen.value = false;
      }
    };

    onMounted(() => {
      window.addEventListener('resize', handleResize);
      startNoticeRotation();
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
      clearInterval(noticeInterval);
    });

    return {
      activeMenu,
      menuItems,
      isMobileMenuOpen,
      mobileSubmenu,
      isSearchActive,
      searchQuery,
      notices,
      currentNoticeIndex,
      handleMouseEnter,
      handleMouseLeave,
      toggleSearch,
      handleSearchBlur,
      toggleMobileSubmenu,
      generateCategoryLink // 추가된 함수 반환
    };
  }
};
</script>

<style scoped>
/* 프리텐다드 폰트 */
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

/* 브랜드 컬러 변수 */
:root {
  --primary-light: #F5F5F5;
  --primary: #48CFCB;
  --primary-dark: #229799;
  --text-dark: #424242;
}

/* 기본 스타일 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.site-header {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  position: relative;
  z-index: 100;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 공지사항 영역 */
.notice-bar {
  background-color: #f7f7f7;
  padding: 8px 0;
  border-bottom: 1px solid #eaeaea;
}

.notice-slider {
  position: relative;
  height: 22px;
  display: flex;
  align-items: center;
  padding: 0;
  width: 100%;
}

.notice-item {
  position: absolute;
  width: 100%;
  font-size: 13px;
  color: #555;
  font-weight: 400;
  display: flex;
  align-items: center;
}

.notice-item::before {
  content: '•';
  margin-right: 8px;
  color: var(--primary-dark);
  font-size: 18px;
}

/* 메인 헤더 */
.main-header {
  background-color: white;
  border-bottom: 1px solid #eee;
  padding: 15px 0;
}

/* 로고 영역 */
.logo-area {
  flex: 0 0 auto;
  margin-right: 40px;
}

.logo-image {
  height: 35px;
  width: auto;
  display: block;
}

/* 메인 네비게이션 */
.main-nav {
  flex: 1;
}

.nav-list {
  display: flex;
  list-style: none;
}

.nav-item {
  position: relative;
  margin: 0 5px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  color: var(--text-dark);
  text-decoration: none;
  font-size: 18px;
  font-weight: 600;
  transition: all 0.2s ease;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--primary);
  transition: width 0.3s ease;
}

.nav-item:hover .nav-link,
.nav-item.active .nav-link {
  color: var(--primary-dark);
}

.nav-item:hover .nav-link::after,
.nav-item.active .nav-link::after {
  width: 100%;
}

/* 우측 유틸리티 영역 */
.utility-area {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* 유틸리티 링크 */
.utility-links {
  display: flex;
  gap: 12px;
  margin-right: 5px;
}

.utility-link {
  color: #555;
  text-decoration: none;
  font-size: 13px;
  font-weight: 400;
  padding: 5px 10px;
  transition: color 0.2s ease;
}

.utility-link:hover {
  color: var(--primary-dark);
}

.utility-link.highlight {
  color: var(--primary-dark);
  font-weight: 500;
}

/* 검색 */
.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 8px 35px 8px 15px;
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
  width: 50px;
  opacity: 0;
  transition: all 0.3s ease;
  outline: none;
}

.search-input.expanded {
  width: 200px;
  opacity: 1;
}

.search-btn {
  position: absolute;
  right: 5px;
  background-color: #f5f5f5; /* 배경색 추가 */
  border: none;
  color: #444; /* 색상 진하게 조정 */
  cursor: pointer;
  z-index: 2;
  width: 30px;
  height: 30px;
  border-radius: 50%; /* 원형 모양 */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.search-btn:hover {
  background-color: #e8e8e8; /* 호버 배경색 */
  color: var(--primary-dark);
}

/* 로그인 버튼 */
.login-btn {
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
  font-weight: 500;
  background-color: white;
  color: var(--primary-dark);
  border: 1px solid var(--primary);
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.login-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(72, 207, 203, 0.2) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transition: left 0.7s ease;
}

.login-btn:hover {
  background-color: #f8f8f8;
  border-color: var(--primary-dark);
}

.login-btn:hover::before {
  left: 100%;
}

/* 광고문의 버튼 - 항상 창문 닦는 효과 적용 */
.ad-inquiry-btn {
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
  font-weight: 500;
  background-color: #229799; /* var(--primary-dark) 대신 직접 색상 지정 */
  color: white;
  border: 1px solid #1d8385; /* 테두리 추가 */
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 그림자 추가 */
  display: inline-block; /* 가능한 레이아웃 문제 방지 */
  min-width: 80px; /* 최소 너비 지정 */
  text-align: center; /* 텍스트 가운데 정렬 */
}

.btn-text {
  position: relative;
  z-index: 2;
  color: white; /* 명시적으로 흰색 지정 */
}

.wipe-effect {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: wipe 2s infinite;
}

@keyframes wipe {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

/* 메가메뉴 영역 */
.mega-menu-container {
  position: absolute;
  left: 0;
  width: 100%;
  background-color: white;
  border-top: 1px solid #eee;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  z-index: 99;
}

/* 애니메이션 */
.mega-fade-enter-active,
.mega-fade-leave-active {
  transition: opacity 0.3s ease;
}

.mega-fade-enter-from,
.mega-fade-leave-to {
  opacity: 0;
}

.fade-notice-enter-active,
.fade-notice-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-notice-enter-from,
.fade-notice-leave-to {
  opacity: 0;
  transform: translateY(5px);
}

/* 모바일 메뉴 토글 */
.mobile-toggle {
  display: none;
  background-color: #e8e8e8; /* 배경색 추가 */
  border: 1px solid #ccc; /* 테두리 추가 */
  border-radius: 4px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  position: relative;
  margin-left: 15px;
}

.toggle-line {
  display: block;
  width: 22px;
  height: 2px;
  background-color: #333; /* 어두운 색상으로 변경 */
  margin: 4px auto;
}

/* 모바일 메뉴 */
.mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  background-color: white;
  z-index: 999;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.mobile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.mobile-logo {
  height: 28px;
}

.mobile-close {
  background-color: #f5f5f5; /* 배경색 추가 */
  border: none;
  color: #444;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-content {
  padding: 15px;
}

.mobile-search {
  position: relative;
  margin-bottom: 20px;
}

.mobile-search-input {
  width: 100%;
  padding: 10px 40px 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
  outline: none;
}

.mobile-search-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background-color: #f5f5f5; /* 배경색 추가 */
  border: none;
  color: #444;
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-utility {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.mobile-utility-link {
  color: #666;
  text-decoration: none;
  font-size: 13px;
  padding: 5px 10px;
  border-radius: 15px;
  background-color: #f8f8f8;
}

.mobile-utility-link.highlight {
  background-color: #e8f7f6;
  color: var(--primary-dark);
  font-weight: 500;
}

.mobile-nav {
  list-style: none;
  margin-bottom: 30px;
}

.mobile-nav-item {
  border-bottom: 1px solid #eee;
}

.mobile-nav-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
}

.arrow {
  transition: transform 0.3s ease;
}

.arrow.open {
  transform: rotate(180deg);
}

.mobile-submenu {
  padding: 0 0 15px 15px;
}

.mobile-category {
  margin-bottom: 15px;
}

.mobile-category-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-dark);
  margin-bottom: 10px;
}

.mobile-category-list {
  list-style: none;
}

.mobile-category-item {
  margin-bottom: 8px;
}

.mobile-category-link {
  color: #666;
  text-decoration: none;
  font-size: 14px;
  display: block;
  padding: 5px 0;
  transition: color 0.2s ease;
}

.mobile-category-link:hover {
  color: var(--primary-dark);
}

.mobile-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mobile-login,
.mobile-ad {
  padding: 12px;
  border-radius: 4px;
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.mobile-login {
  background-color: white;
  color: var(--primary-dark);
  border: 1px solid var(--primary);
}

.mobile-ad {
  background-color: #229799;
  color: white; /* 명시적 흰색 지정 */
  border: 1px solid #1d8385;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 모바일 메뉴 애니메이션 */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

/* 반응형 디자인 */
@media (max-width: 1199px) {
  .nav-link {
    padding: 10px 15px;
    font-size: 16px;
  }
  
  .utility-links {
    gap: 8px;
  }
  
  .utility-link {
    font-size: 12px;
    padding: 4px 6px;
  }
  
  .search-input.expanded {
    width: 180px;
  }
}

@media (max-width: 991px) {
  .notice-bar .container {
    padding: 0 15px;
  }
  
  .main-nav {
    display: none;
  }
  
  .login-btn,
  .ad-inquiry-btn {
    display: none;
  }
  
  .utility-links {
    display: none;
  }
  
  .mobile-toggle {
    display: block;
  }
  
  .search-box {
    margin-left: auto;
  }
  
  .main-header .container {
    justify-content: space-between;
  }
  
  .utility-area {
    margin-right: 10px;
  }
}

@media (max-width: 768px) {
  .notice-item {
    font-size: 13px;
  }
}

@media (max-width: 576px) {
  .notice-bar {
    padding: 6px 0;
  }
  
  .notice-slider {
    height: 20px;
  }
  
  .notice-item {
    font-size: 12px;
  }
  
  .notice-item::before {
    font-size: 16px;
  }
  
  .main-header .container {
    padding: 0 15px;
  }
  
  .logo-image {
    height: 30px;
  }
  
  .search-input.expanded {
    width: 150px;
  }
  
  .mobile-menu {
    width: 280px;
  }
}
</style>
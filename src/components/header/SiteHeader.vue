<!-- src/components/header/SiteHeader.vue -->
<template>
    <header class="site-header">
      <!-- 일반 헤더 -->
      <template v-if="!isSearchMode">
        <!-- 상단 공지사항 영역 -->
        <NoticeBar />
        
        <!-- 메인 헤더 -->
        <MainHeader 
          :menu-items="menuItems"
          :active-menu="activeMenu"
          @menu-hover="handleMouseEnter"
          @toggle-mobile-menu="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <!-- UtilityArea를 슬롯으로 전달 -->
          <template #utility>
            <UtilityArea @activate-search="activateSearchMode" />
          </template>
        </MainHeader>
        
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
      </template>
      
      <!-- 검색 헤더 -->
      <template v-else>
        <SearchHeader 
          :initial-query="searchQuery"
          @close="deactivateSearchMode"
        />
      </template>
      
      <!-- 모바일 메뉴 (검색 모드일 때는 표시하지 않음) -->
      <MobileMenu 
        v-if="!isSearchMode"
        :is-open="isMobileMenuOpen"
        :menu-items="menuItems"
        @close="isMobileMenuOpen = false"
      />
    </header>
  </template>
  
  <script>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import NoticeBar from './NoticeBar.vue';
  import MainHeader from './MainHeader.vue';
  import UtilityArea from './UtilityArea.vue';
  import MegaMenu from '../mega-menu/MegaMenu.vue';
  import MobileMenu from './MobileMenu.vue';
  import SearchHeader from './SearchHeader.vue';
  
  export default {
    name: 'SiteHeader',
    components: {
      NoticeBar,
      MainHeader,
      UtilityArea,
      MegaMenu,
      MobileMenu,
      SearchHeader
    },
    setup() {
      const activeMenu = ref(null);
      const isMobileMenuOpen = ref(false);
      let timeoutId = null;
      
      // 검색 모드 관련 상태
      const isSearchMode = ref(false);
      const searchQuery = ref('');
  
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
  
      // 검색 모드 활성화
      const activateSearchMode = (query = '') => {
        searchQuery.value = query;
        isSearchMode.value = true;
        // 검색 모드일 때는 메가메뉴를 닫음
        activeMenu.value = null;
      };
  
      // 검색 모드 비활성화
      const deactivateSearchMode = () => {
        isSearchMode.value = false;
      };
  
      // 창 크기 변경 처리
      const handleResize = () => {
        if (window.innerWidth > 991 && isMobileMenuOpen.value) {
          isMobileMenuOpen.value = false;
        }
      };
  
      // ESC 키 누를 때 검색 모드 종료
      const handleKeyDown = (e) => {
        if (e.key === 'Escape' && isSearchMode.value) {
          deactivateSearchMode();
        }
      };
  
      onMounted(() => {
        window.addEventListener('resize', handleResize);
        document.addEventListener('keydown', handleKeyDown);
      });
  
      onBeforeUnmount(() => {
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('keydown', handleKeyDown);
        clearTimeout(timeoutId);
      });
  
      return {
        activeMenu,
        menuItems,
        isMobileMenuOpen,
        isSearchMode,
        searchQuery,
        handleMouseEnter,
        handleMouseLeave,
        activateSearchMode,
        deactivateSearchMode
      };
    }
  }
  </script>
  
  <style scoped>
  .site-header {
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    position: relative;
    z-index: 100;
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
  </style>
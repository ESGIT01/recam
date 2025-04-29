<template>
    <div class="notice-view">
      <div class="container">
        <div class="content-layout">
          <!-- 사이드바 -->
          <SideBar />
          
          <div class="main-content">
            <!-- 고정된 필터 툴바 (스크롤 시 상단에 고정) -->
            <div class="filter-toolbar" :class="{ 'sticky': isToolbarSticky }">
              <div class="filter-buttons">
                <button 
                  class="filter-button" 
                  :class="{ 'has-active': selectedCategory !== null }"
                  @click="toggleFilterSection('category')"
                >
                  <span class="button-label">카테고리</span>
                  <span v-if="selectedCategory !== null" class="active-filter">{{ getCategoryName(selectedCategory) }}</span>
                  <span v-else class="default-text">전체</span>
                  <span class="toggle-icon">{{ activeFilterSection === 'category' ? '▲' : '▼' }}</span>
                </button>
              </div>
              
              <div class="search-box">
                <input 
                  type="text"
                  v-model="searchQuery" 
                  placeholder="제목 검색" 
                  class="search-input"
                  @keyup.enter="searchNotices"
                />
                <button class="search-button" @click="searchNotices">
                  <span class="search-icon">🔍</span>
                </button>
              </div>
            </div>
            
            <!-- 확장가능한 필터 패널 -->
            <div v-if="activeFilterSection" class="filter-panel-container">
              <div class="filter-panel">
                <!-- 카테고리 필터 옵션 -->
                <div v-if="activeFilterSection === 'category'" class="filter-options-grid">
                  <button 
                    class="grid-option"
                    :class="{ 'active': selectedCategory === null }"
                    @click="selectCategory(null)"
                  >
                    전체
                  </button>
                  <button 
                    v-for="category in categories" 
                    :key="category.value"
                    class="grid-option"
                    :class="{ 'active': selectedCategory === category.value }"
                    @click="selectCategory(category.value)"
                  >
                    {{ category.name }}
                  </button>
                </div>
              </div>
            </div>
            
            <!-- 활성화된 필터 표시 및 초기화 버튼 -->
            <div class="active-filters-bar" v-if="hasActiveFilters">
              <div class="active-filter-tags">
                <div v-if="selectedCategory !== null" class="filter-tag">
                  <span class="tag-label">카테고리:</span>
                  <span class="tag-value">{{ getCategoryName(selectedCategory) }}</span>
                  <button class="remove-tag" @click="selectCategory(null)">×</button>
                </div>
                
                <div v-if="searchQuery.trim()" class="filter-tag">
                  <span class="tag-label">검색어:</span>
                  <span class="tag-value">{{ searchQuery }}</span>
                  <button class="remove-tag" @click="clearSearch">×</button>
                </div>
              </div>
              
              <button class="clear-filters" @click="clearAllFilters">
                <span class="clear-icon">⟲</span>
                필터 초기화
              </button>
            </div>
  
            <!-- 공지사항 리스트 및 결과 표시 -->
            <div class="notice-list-section">
              <!-- 로딩 상태 표시 -->
              <div v-if="loading" class="loading-container">
                <div class="loading-spinner"></div>
                <p>공지사항을 불러오고 있습니다...</p>
              </div>
              
              <!-- 결과 없음 메시지 -->
              <div v-else-if="filteredNotices.length === 0" class="no-results">
                <div class="no-results-content">
                  <div class="no-results-icon">🔍</div>
                  <h3>검색 결과가 없습니다</h3>
                  <p>다른 필터 옵션을 선택하거나 필터를 초기화해 보세요.</p>
                  <button class="reset-filters-btn" @click="clearAllFilters">필터 초기화</button>
                </div>
              </div>
              
              <!-- 공지사항 리스트 -->
              <div v-else>
                <div class="results-count">
                  <span class="count-number">{{ totalResults }}</span>개의 공지사항
                  <span v-if="hasActiveFilters">이 검색되었습니다</span>
                </div>
                
                <div class="notice-list">
                  <div class="notice-list-header">
                    <div class="col-category">카테고리</div>
                    <div class="col-title">제목</div>
                    <div class="col-date">등록일</div>
                    <div class="col-view">조회수</div>
                  </div>
                  
                  <div 
                    v-for="notice in filteredNotices" 
                    :key="notice.id"
                    class="notice-list-item"
                    :class="{ 'important': notice.isImportant }"
                    @click="viewNoticeDetail(notice.id)"
                  >
                    <div class="col-category">
                      <span 
                        class="category-badge" 
                        :class="`category-${notice.category}`"
                      >
                        {{ getCategoryName(notice.category) }}
                      </span>
                    </div>
                    <div class="col-title">
                      <div class="notice-title-wrapper">
                        <span v-if="notice.isImportant" class="important-tag">중요</span>
                        <h3 class="notice-title">{{ notice.title }}</h3>
                      </div>
                      <p v-if="notice.isNew" class="new-tag">New</p>
                    </div>
                    <div class="col-date notice-date">
                      {{ formatDate(notice.createdAt) }}
                    </div>
                    <div class="col-view notice-view-count">
                      {{ notice.viewCount.toLocaleString() }}
                    </div>
                  </div>
                </div>
                
                <!-- 페이지네이션 -->
                <div class="pagination-container" v-if="totalPages > 1">
                  <div class="pagination">
                    <button 
                      class="page-button prev" 
                      :disabled="currentPage === 1"
                      @click="changePage(currentPage - 1)"
                      :class="{ 'disabled': currentPage === 1 }"
                    >
                      <span class="page-arrow">◀</span> 이전
                    </button>
                    
                    <div class="page-numbers">
                      <button 
                        v-for="page in displayedPages" 
                        :key="page"
                        class="page-number"
                        :class="{ 'active': currentPage === page }"
                        @click="changePage(page)"
                      >
                        {{ page }}
                      </button>
                    </div>
                    
                    <button 
                      class="page-button next" 
                      :disabled="currentPage === totalPages"
                      @click="changePage(currentPage + 1)"
                      :class="{ 'disabled': currentPage === totalPages }"
                    >
                      다음 <span class="page-arrow">▶</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import SideBar from '@/components/SideBar.vue';
  
  export default {
    name: 'NoticeView',
    components: {
      SideBar
    },
    setup() {
      const router = useRouter();
      const route = useRoute();
      
      // 상태 변수들
      const notices = ref([]);
      const loading = ref(true);
      const currentPage = ref(1);
      const itemsPerPage = ref(10);
      const selectedCategory = ref(null);
      const searchQuery = ref('');
      const activeFilterSection = ref(null);
      const isToolbarSticky = ref(false);
      
      // 카테고리 데이터
      const categories = [
        { value: 'general', name: '일반' },
        { value: 'service', name: '서비스' },
        { value: 'update', name: '업데이트' },
        { value: 'event', name: '이벤트' },
        { value: 'system', name: '시스템' }
      ];
      
      // 필터 활성화 여부
      const hasActiveFilters = computed(() => {
        return selectedCategory.value !== null || 
               searchQuery.value.trim() !== '';
      });
      
      // 필터 섹션 토글
      const toggleFilterSection = (section) => {
        if (activeFilterSection.value === section) {
          activeFilterSection.value = null;
        } else {
          activeFilterSection.value = section;
        }
      };
      
      // 스크롤 이벤트 핸들러 (툴바 고정용)
      const handleScroll = () => {
        const headerHeight = 150; // 헤더의 대략적인 높이
        isToolbarSticky.value = window.scrollY > headerHeight;
      };
      
      // URL에서 필터 상태 초기화
      onMounted(() => {
        // 쿼리 파라미터에서 필터 가져오기
        if (route.query.category) {
          selectedCategory.value = route.query.category;
        }
        
        if (route.query.search) {
          searchQuery.value = route.query.search;
        }
        
        if (route.query.page) {
          currentPage.value = parseInt(route.query.page);
        }
        
        // 스크롤 이벤트 리스너 추가
        window.addEventListener('scroll', handleScroll);
        
        fetchNotices();
      });
      
      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      onUnmounted(() => {
        window.removeEventListener('scroll', handleScroll);
      });
      
      // 필터나 정렬 변경시 URL 및 데이터 업데이트
      watch([selectedCategory, searchQuery, currentPage], () => {
        updateUrl();
        activeFilterSection.value = null; // 필터 선택 후 패널 닫기
        fetchNotices();
      });
      
      // URL 업데이트 함수
      const updateUrl = () => {
        const query = {};
        
        if (selectedCategory.value !== null) {
          query.category = selectedCategory.value;
        }
        
        if (searchQuery.value.trim() !== '') {
          query.search = searchQuery.value;
        }
        
        if (currentPage.value > 1) {
          query.page = currentPage.value;
        }
        
        router.replace({
          path: '/notice',
          query
        });
      };
      
      // API에서 공지사항 데이터 가져오기
      const fetchNotices = async () => {
        loading.value = true;
        
        try {
          // API 호출은 여기에 구현하세요
          // 실제 구현에서는 axios나 fetch를 사용하여 API 호출
          // 지금은 임시 데이터를 사용합니다
          
          // 임시 데이터
          setTimeout(() => {
            notices.value = generateMockNotices();
            loading.value = false;
          }, 500);
        } catch (error) {
          console.error('공지사항 데이터를 불러오는 중 오류가 발생했습니다:', error);
          loading.value = false;
        }
      };
      
      // 날짜 포맷팅 함수
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
      };
      
      // 필터된 공지사항 데이터 계산
      const filteredNotices = computed(() => {
        let result = [...notices.value];
        
        // 카테고리 필터링
        if (selectedCategory.value !== null) {
          result = result.filter(n => n.category === selectedCategory.value);
        }
        
        // 검색어 필터링
        if (searchQuery.value.trim() !== '') {
          const query = searchQuery.value.toLowerCase();
          result = result.filter(n => 
            n.title.toLowerCase().includes(query) || 
            n.content.toLowerCase().includes(query)
          );
        }
        
        // 중요 공지를 상단에 표시
        result.sort((a, b) => {
          if (a.isImportant && !b.isImportant) return -1;
          if (!a.isImportant && b.isImportant) return 1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        
        // 페이지네이션
        const startIndex = (currentPage.value - 1) * itemsPerPage.value;
        const endIndex = startIndex + itemsPerPage.value;
        
        return result.slice(startIndex, endIndex);
      });
      
      // 총 결과 수
      const totalResults = computed(() => {
        return notices.value.filter(notice => {
          // 카테고리 필터링
          if (selectedCategory.value !== null && notice.category !== selectedCategory.value) return false;
          
          // 검색어 필터링
          if (searchQuery.value.trim() !== '') {
            const query = searchQuery.value.toLowerCase();
            if (!notice.title.toLowerCase().includes(query) && 
                !notice.content.toLowerCase().includes(query)) {
              return false;
            }
          }
          
          return true;
        }).length;
      });
      
      // 총 페이지 수
      const totalPages = computed(() => {
        return Math.ceil(totalResults.value / itemsPerPage.value);
      });
      
      // 표시할 페이지 번호
      const displayedPages = computed(() => {
        const pages = [];
        const maxPages = 5; // 한 번에 보여줄 최대 페이지 수
        
        let startPage = Math.max(1, currentPage.value - Math.floor(maxPages / 2));
        let endPage = Math.min(totalPages.value, startPage + maxPages - 1);
        
        if (endPage - startPage + 1 < maxPages) {
          startPage = Math.max(1, endPage - maxPages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
        
        return pages;
      });
      
      // 공지사항 상세 페이지로 이동
      const viewNoticeDetail = (id) => {
        router.push(`/notice/${id}`);
      };
      
      // 카테고리 선택
      const selectCategory = (category) => {
        selectedCategory.value = category;
        currentPage.value = 1;
      };
      
      // 검색 실행
      const searchNotices = () => {
        currentPage.value = 1;
      };
      
      // 검색어 초기화
      const clearSearch = () => {
        searchQuery.value = '';
        currentPage.value = 1;
      };
      
      // 페이지 변경
      const changePage = (page) => {
        currentPage.value = page;
        // 페이지 상단으로 스크롤
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      };
      
      // 모든 필터 초기화
      const clearAllFilters = () => {
        selectedCategory.value = null;
        searchQuery.value = '';
        currentPage.value = 1;
      };
      
      // 카테고리 이름 가져오기
      const getCategoryName = (value) => {
        const category = categories.find(c => c.value === value);
        return category ? category.name : '';
      };
      
      // 임시 데이터 생성 함수
      const generateMockNotices = () => {
        const mockNotices = [];
        const categoryValues = ['general', 'service', 'update', 'event', 'system'];
        const loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
        
        // 현재 날짜 기준
        const today = new Date();
        
        // 중요 공지사항 5개 생성
        for (let i = 1; i <= 5; i++) {
          const createdAt = new Date(today);
          createdAt.setDate(today.getDate() - Math.floor(Math.random() * 30));
          
          const category = categoryValues[Math.floor(Math.random() * categoryValues.length)];
          
          mockNotices.push({
            id: i,
            title: `[중요] ${i}번째 중요 공지사항`,
            content: loremIpsum,
            category,
            createdAt: createdAt.toISOString(),
            viewCount: Math.floor(Math.random() * 5000) + 1000,
            isImportant: true,
            isNew: i <= 2 // 처음 2개만 New 표시
          });
        }
        
        // 일반 공지사항 45개 생성
        for (let i = 6; i <= 50; i++) {
          const createdAt = new Date(today);
          createdAt.setDate(today.getDate() - Math.floor(Math.random() * 90));
          
          const category = categoryValues[Math.floor(Math.random() * categoryValues.length)];
          
          mockNotices.push({
            id: i,
            title: `${i}번째 공지사항 - ${getCategoryName(category)} 관련 안내`,
            content: loremIpsum,
            category,
            createdAt: createdAt.toISOString(),
            viewCount: Math.floor(Math.random() * 1000) + 100,
            isImportant: false,
            isNew: i <= 10 // 처음 10개만 New 표시
          });
        }
        
        return mockNotices;
      };
      
      return {
        notices,
        loading,
        currentPage,
        selectedCategory,
        searchQuery,
        categories,
        activeFilterSection,
        isToolbarSticky,
        hasActiveFilters,
        filteredNotices,
        totalPages,
        displayedPages,
        totalResults,
        formatDate,
        viewNoticeDetail,
        selectCategory,
        searchNotices,
        clearSearch,
        changePage,
        clearAllFilters,
        getCategoryName,
        toggleFilterSection
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
  
  .notice-view {
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    background-color: #FAFAFA;
    min-height: 100vh;
    padding-bottom: 60px;
  }
  
  .container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  /* 콘텐츠 레이아웃 */
  .content-layout {
    display: flex;
    gap: 30px;
    padding-top: 30px;
  }
  
  .main-content {
    flex: 1;
    min-width: 0; /* flexbox 내에서 overflow 방지 */
  }
  
  /* 필터 툴바 */
  .filter-toolbar {
    background-color: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 20;
    transition: box-shadow 0.3s ease;
  }
  
  .filter-toolbar.sticky {
    position: sticky;
    top: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    animation: slideDown 0.3s ease-out;
  }
  
  @keyframes slideDown {
    from {
      transform: translateY(-10px);
      opacity: 0.8;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .filter-buttons {
    display: flex;
    gap: 10px;
  }
  
  .filter-button {
    display: flex;
    align-items: center;
    background-color: white;
    border: 1px solid #E0E0E0;
    border-radius: 6px;
    padding: 8px 12px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    min-width: 120px;
  }
  
  .filter-button:hover {
    border-color: var(--primary);
  }
  
  .filter-button.has-active {
    border-color: var(--primary);
    background-color: rgba(72, 207, 203, 0.05);
  }
  
  .button-label {
    color: #666;
    font-weight: 600;
    margin-right: 6px;
  }
  
  .active-filter {
    color: var(--primary-dark);
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100px;
  }
  
  .default-text {
    color: #888;
    font-weight: 400;
  }
  
  .toggle-icon {
    margin-left: auto;
    font-size: 10px;
    color: #999;
    transform: translateY(1px);
  }
  
  /* 검색 박스 */
  .search-box {
    display: flex;
    position: relative;
    max-width: 320px;
    width: 100%;
  }
  
  .search-input {
    width: 100%;
    padding: 8px 40px 8px 12px;
    border: 1px solid #E0E0E0;
    border-radius: 6px;
    font-family: 'Pretendard', sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s ease;
  }
  
  .search-input:focus {
    border-color: var(--primary);
  }
  
  .search-button {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    background: none;
    border: none;
    padding: 0 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    transition: color 0.2s ease;
  }
  
  .search-button:hover {
    color: var(--primary-dark);
  }
  
  /* 필터 패널 */
  .filter-panel-container {
    position: relative;
    z-index: 19;
  }
  
  .filter-panel {
    background-color: white;
    border-bottom: 1px solid #EEEEEE;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    animation: fadeInDown 0.3s ease-out;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .filter-options-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 10px;
  }
  
  .grid-option {
    background-color: #F5F5F5;
    border: 1px solid #EEEEEE;
    border-radius: 6px;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 500;
    color: #666;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
    outline: none;
  }
  
  .grid-option:hover {
    background-color: #EEEEEE;
    color: #444;
  }
  
  .grid-option.active {
    background-color: var(--primary);
    border-color: var(--primary-dark);
    color: white;
  }
  
  /* 활성화된 필터 표시 영역 */
  .active-filters-bar {
    background-color: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .active-filter-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .filter-tag {
    display: flex;
    align-items: center;
    background-color: #F5F5F5;
    border: 1px solid #E0E0E0;
    border-radius: 20px;
    padding: 5px 12px;
    font-size: 13px;
  }
  
  .tag-label {
    color: #888;
    margin-right: 4px;
  }
  
  .tag-value {
    color: var(--primary-dark);
    font-weight: 500;
  }
  
  .remove-tag {
    background: none;
    border: none;
    color: #999;
    font-size: 16px;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin-left: 8px;
    width: 18px;
    height: 18px;
  }
  
  .remove-tag:hover {
    color: #666;
  }
  
  .clear-filters {
    background: none;
    border: none;
    color: #888;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    padding: 6px 10px;
    border-radius: 4px;
    transition: all 0.2s ease;
  }
  
  .clear-filters:hover {
    background-color: #EEEEEE;
    color: #666;
  }
  
  .clear-icon {
    font-size: 14px;
  }
  
  /* 공지사항 리스트 영역 */
  .notice-list-section {
    padding-top: 0;
  }
  
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 0;
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(72, 207, 203, 0.2);
    border-top: 3px solid var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .loading-container p {
    color: #888;
    font-size: 15px;
  }
  
  .no-results {
    padding: 60px 0;
    display: flex;
    justify-content: center;
  }
  
  .no-results-content {
    text-align: center;
    max-width: 360px;
  }
  
  .no-results-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  
  .no-results-content h3 {
    font-size: 18px;
    font-weight: 600;
    color: #555;
    margin: 0 0 8px;
  }
  
  .no-results-content p {
    font-size: 14px;
    color: #888;
    margin: 0 0 20px;
  }
  .reset-filters-btn {
  background-color: var(--primary);
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.reset-filters-btn:hover {
  background-color: var(--primary-dark);
}

.results-count {
  margin-bottom: 16px;
  font-size: 15px;
  color: #666;
}

.count-number {
  font-weight: 600;
  color: var(--primary-dark);
}

/* 공지사항 리스트 스타일 */
.notice-list {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.notice-list-header {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background-color: #F5F5F5;
  border-bottom: 1px solid #EEEEEE;
  font-weight: 600;
  color: #555;
  font-size: 14px;
}

.notice-list-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #EEEEEE;
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.notice-list-item:last-child {
  border-bottom: none;
}

.notice-list-item:hover {
  background-color: #F9F9F9;
}

.notice-list-item.important {
  background-color: rgba(72, 207, 203, 0.05);
}

.notice-list-item.important:hover {
  background-color: rgba(72, 207, 203, 0.1);
}

/* 컬럼 너비 설정 */
.col-category {
  width: 120px;
  flex-shrink: 0;
}

.col-title {
  flex-grow: 1;
  padding-right: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.col-date {
  width: 120px;
  flex-shrink: 0;
  text-align: center;
}

.col-view {
  width: 100px;
  flex-shrink: 0;
  text-align: center;
}

/* 공지사항 아이템 스타일 */
.category-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
}

.category-general {
  background-color: #EEEEEE;
  color: #666666;
  border: 1px solid #DDDDDD;
}

.category-service {
  background-color: #E3F2FD;
  color: #1976D2;
  border: 1px solid #BBDEFB;
}

.category-update {
  background-color: #E8F5E9;
  color: #388E3C;
  border: 1px solid #C8E6C9;
}

.category-event {
  background-color: #FFF3E0;
  color: #E64A19;
  border: 1px solid #FFE0B2;
}

.category-system {
  background-color: #FCE4EC;
  color: #C2185B;
  border: 1px solid #F8BBD0;
}

.notice-title-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.important-tag {
  background-color: #F44336;
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 6px;
  border-radius: 4px;
  flex-shrink: 0;
}

.new-tag {
  background-color: var(--primary);
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 6px;
  border-radius: 4px;
  margin: 0;
}

.notice-title {
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  color: var(--text-dark);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notice-date {
  font-size: 13px;
  color: #666;
}

.notice-view-count {
  font-size: 13px;
  color: #666;
}

/* 페이지네이션 */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 5px;
}

.page-button {
  background-color: white;
  border: 1px solid #E0E0E0;
  border-radius: 6px;
  padding: 8px 16px;
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 5px;
}

.page-button:hover:not(.disabled) {
  border-color: var(--primary);
  color: var(--primary-dark);
}

.page-button.disabled {
  background-color: #F5F5F5;
  color: #BBB;
  cursor: default;
}

.page-arrow {
  font-size: 10px;
}

.page-numbers {
  display: flex;
  gap: 5px;
}

.page-number {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 1px solid #E0E0E0;
  border-radius: 6px;
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-number:hover:not(.active) {
  border-color: var(--primary);
  color: var(--primary-dark);
}

.page-number.active {
  background-color: var(--primary);
  border-color: var(--primary);
  color: white;
}

/* 반응형 스타일 */
@media (max-width: 991px) {
  .content-layout {
    flex-direction: column;
    gap: 20px;
  }
  
  .notice-list-header {
    display: none;
  }
  
  .notice-list-item {
    flex-wrap: wrap;
    padding: 15px;
  }
  
  .col-category {
    width: auto;
    margin-right: 10px;
  }
  
  .col-title {
    width: calc(100% - 130px);
    padding-right: 0;
    margin-bottom: 10px;
  }
  
  .col-date, .col-view {
    width: auto;
    margin-right: 20px;
    text-align: left;
    font-size: 12px;
  }
  
  .col-date {
    order: 3;
  }
  
  .col-view {
    order: 4;
  }
}

@media (max-width: 767px) {
  .filter-toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  
  .filter-buttons {
    flex-direction: row;
    gap: 8px;
    width: 100%;
  }
  
  .filter-button {
    flex: 1;
  }
  
  .search-box {
    max-width: 100%;
  }
  
  .active-filters-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .notice-list-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .col-category {
    margin-bottom: 10px;
  }
  
  .col-title {
    width: 100%;
    margin-bottom: 10px;
  }
  
  .col-date, .col-view {
    width: 100%;
    margin-right: 0;
    margin-bottom: 5px;
  }
}

@media (max-width: 480px) {
  .filter-options-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .notice-title {
    font-size: 14px;
  }
}
</style>
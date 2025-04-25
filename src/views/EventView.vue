<template>
  <div class="event-view">
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
                :class="{ 'has-active': selectedStatus !== null }"
                @click="toggleFilterSection('status')"
              >
                <span class="button-label">상태</span>
                <span v-if="selectedStatus !== null" class="active-filter">{{ getStatusName(selectedStatus) }}</span>
                <span v-else class="default-text">전체</span>
                <span class="toggle-icon">{{ activeFilterSection === 'status' ? '▲' : '▼' }}</span>
              </button>
              
              <button 
                class="filter-button" 
                :class="{ 'has-active': selectedEventType !== null }"
                @click="toggleFilterSection('eventType')"
              >
                <span class="button-label">이벤트 유형</span>
                <span v-if="selectedEventType !== null" class="active-filter">{{ getEventTypeName(selectedEventType) }}</span>
                <span v-else class="default-text">전체</span>
                <span class="toggle-icon">{{ activeFilterSection === 'eventType' ? '▲' : '▼' }}</span>
              </button>
            </div>
            
            <div class="search-box">
              <input 
                type="text"
                v-model="searchQuery" 
                placeholder="이벤트명 검색" 
                class="search-input"
                @keyup.enter="searchEvents"
              />
              <button class="search-button" @click="searchEvents">
                <span class="search-icon">🔍</span>
              </button>
            </div>
          </div>
          
          <!-- 확장가능한 필터 패널 -->
          <div v-if="activeFilterSection" class="filter-panel-container">
            <div class="filter-panel">
              <!-- 상태 필터 옵션 -->
              <div v-if="activeFilterSection === 'status'" class="filter-options-grid">
                <button 
                  class="grid-option"
                  :class="{ 'active': selectedStatus === null }"
                  @click="selectStatus(null)"
                >
                  전체
                </button>
                <button 
                  v-for="status in statuses" 
                  :key="status.value"
                  class="grid-option"
                  :class="{ 'active': selectedStatus === status.value }"
                  @click="selectStatus(status.value)"
                >
                  {{ status.name }}
                </button>
              </div>
              
              <!-- 이벤트 유형 필터 옵션 -->
              <div v-if="activeFilterSection === 'eventType'" class="filter-options-grid">
                <button 
                  class="grid-option"
                  :class="{ 'active': selectedEventType === null }"
                  @click="selectEventType(null)"
                >
                  전체
                </button>
                <button 
                  v-for="type in eventTypes" 
                  :key="type.value"
                  class="grid-option"
                  :class="{ 'active': selectedEventType === type.value }"
                  @click="selectEventType(type.value)"
                >
                  {{ type.name }}
                </button>
              </div>
            </div>
          </div>
          
          <!-- 활성화된 필터 표시 및 초기화 버튼 -->
          <div class="active-filters-bar" v-if="hasActiveFilters">
            <div class="active-filter-tags">
              <div v-if="selectedStatus !== null" class="filter-tag">
                <span class="tag-label">상태:</span>
                <span class="tag-value">{{ getStatusName(selectedStatus) }}</span>
                <button class="remove-tag" @click="selectStatus(null)">×</button>
              </div>
              
              <div v-if="selectedEventType !== null" class="filter-tag">
                <span class="tag-label">이벤트 유형:</span>
                <span class="tag-value">{{ getEventTypeName(selectedEventType) }}</span>
                <button class="remove-tag" @click="selectEventType(null)">×</button>
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

          <!-- 이벤트 리스트 및 결과 표시 -->
          <div class="event-list-section">
            <!-- 로딩 상태 표시 -->
            <div v-if="loading" class="loading-container">
              <div class="loading-spinner"></div>
              <p>이벤트를 불러오고 있습니다...</p>
            </div>
            
            <!-- 결과 없음 메시지 -->
            <div v-else-if="filteredEvents.length === 0" class="no-results">
              <div class="no-results-content">
                <div class="no-results-icon">🔍</div>
                <h3>검색 결과가 없습니다</h3>
                <p>다른 필터 옵션을 선택하거나 필터를 초기화해 보세요.</p>
                <button class="reset-filters-btn" @click="clearAllFilters">필터 초기화</button>
              </div>
            </div>
            
            <!-- 이벤트 리스트 -->
            <div v-else>
              <div class="results-count">
                <span class="count-number">{{ totalResults }}</span>개의 이벤트
                <span v-if="hasActiveFilters">이 검색되었습니다</span>
              </div>
              
              <div class="event-list">
                <div class="event-list-header">
                  <div class="col-status">상태</div>
                  <div class="col-thumbnail">이미지</div>
                  <div class="col-title">이벤트명</div>
                  <div class="col-period">기간</div>
                  <div class="col-type">유형</div>
                </div>
                
                <div 
                  v-for="event in filteredEvents" 
                  :key="event.id"
                  class="event-list-item"
                  :class="{ 'inactive': event.status === 'ended' }"
                  @click="viewEventDetail(event.id)"
                >
                  <div class="col-status">
                    <span 
                      class="status-badge" 
                      :class="`status-${event.status}`"
                    >
                      {{ getStatusName(event.status) }}
                    </span>
                  </div>
                  <div class="col-thumbnail">
                    <img :src="event.thumbnailUrl" alt="이벤트 썸네일" class="event-thumbnail">
                  </div>
                  <div class="col-title">
                    <h3 class="event-title">{{ event.title }}</h3>
                    <p class="event-description">{{ event.description }}</p>
                  </div>
                  <div class="col-period event-period">
                    {{ formatDate(event.startDate) }} ~ {{ formatDate(event.endDate) }}
                  </div>
                  <div class="col-type">
                    <span class="event-type">{{ getEventTypeName(event.eventType) }}</span>
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
  name: 'EventView',
  components: {
    SideBar
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    
    // 상태 변수들
    const events = ref([]);
    const loading = ref(true);
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const selectedStatus = ref(null);
    const selectedEventType = ref(null);
    const searchQuery = ref('');
    const activeFilterSection = ref(null);
    const isToolbarSticky = ref(false);
    
    // 이벤트 상태 데이터
    const statuses = [
      { value: 'upcoming', name: '진행 예정' },
      { value: 'ongoing', name: '진행 중' },
      { value: 'ended', name: '종료됨' }
    ];
    
    // 이벤트 유형 데이터
    const eventTypes = [
      { value: 'discount', name: '할인 이벤트' },
      { value: 'gift', name: '경품 이벤트' },
      { value: 'special', name: '스페셜 이벤트' },
      { value: 'point', name: '포인트 이벤트' },
      { value: 'coupon', name: '쿠폰 이벤트' }
    ];
    
    // 필터 활성화 여부
    const hasActiveFilters = computed(() => {
      return selectedStatus.value !== null || 
             selectedEventType.value !== null || 
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
      if (route.query.status) {
        selectedStatus.value = route.query.status;
      }
      
      if (route.query.eventType) {
        selectedEventType.value = route.query.eventType;
      }
      
      if (route.query.search) {
        searchQuery.value = route.query.search;
      }
      
      if (route.query.page) {
        currentPage.value = parseInt(route.query.page);
      }
      
      // 스크롤 이벤트 리스너 추가
      window.addEventListener('scroll', handleScroll);
      
      fetchEvents();
    });
    
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
    });
    
    // 필터나 정렬 변경시 URL 및 데이터 업데이트
    watch([selectedStatus, selectedEventType, searchQuery, currentPage], () => {
      updateUrl();
      activeFilterSection.value = null; // 필터 선택 후 패널 닫기
      fetchEvents();
    });
    
    // URL 업데이트 함수
    const updateUrl = () => {
      const query = {};
      
      if (selectedStatus.value !== null) {
        query.status = selectedStatus.value;
      }
      
      if (selectedEventType.value !== null) {
        query.eventType = selectedEventType.value;
      }
      
      if (searchQuery.value.trim() !== '') {
        query.search = searchQuery.value;
      }
      
      if (currentPage.value > 1) {
        query.page = currentPage.value;
      }
      
      router.replace({
        path: '/event',
        query
      });
    };
    
    // API에서 이벤트 데이터 가져오기
    const fetchEvents = async () => {
      loading.value = true;
      
      try {
        // API 호출은 여기에 구현하세요
        // 실제 구현에서는 axios나 fetch를 사용하여 API 호출
        // 지금은 임시 데이터를 사용합니다
        
        // 임시 데이터
        setTimeout(() => {
          events.value = generateMockEvents();
          loading.value = false;
        }, 500);
      } catch (error) {
        console.error('이벤트 데이터를 불러오는 중 오류가 발생했습니다:', error);
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
    
    // 필터된 이벤트 데이터 계산
    const filteredEvents = computed(() => {
      let result = [...events.value];
      
      // 상태 필터링
      if (selectedStatus.value !== null) {
        result = result.filter(e => e.status === selectedStatus.value);
      }
      
      // 이벤트 유형 필터링
      if (selectedEventType.value !== null) {
        result = result.filter(e => e.eventType === selectedEventType.value);
      }
      
      // 검색어 필터링
      if (searchQuery.value.trim() !== '') {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(e => 
          e.title.toLowerCase().includes(query) || 
          e.description.toLowerCase().includes(query)
        );
      }
      
      // 페이지네이션
      const startIndex = (currentPage.value - 1) * itemsPerPage.value;
      const endIndex = startIndex + itemsPerPage.value;
      
      return result.slice(startIndex, endIndex);
    });
    
    // 총 결과 수
    const totalResults = computed(() => {
      return events.value.filter(event => {
        // 상태 필터링
        if (selectedStatus.value !== null && event.status !== selectedStatus.value) return false;
        
        // 이벤트 유형 필터링
        if (selectedEventType.value !== null && event.eventType !== selectedEventType.value) return false;
        
        // 검색어 필터링
        if (searchQuery.value.trim() !== '') {
          const query = searchQuery.value.toLowerCase();
          if (!event.title.toLowerCase().includes(query) && 
              !event.description.toLowerCase().includes(query)) {
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
    
    // 이벤트 상세 페이지로 이동
    const viewEventDetail = (id) => {
      router.push(`/event/${id}`);
    };
    
    // 상태 선택
    const selectStatus = (status) => {
      selectedStatus.value = status;
      currentPage.value = 1;
    };
    
    // 이벤트 유형 선택
    const selectEventType = (type) => {
      selectedEventType.value = type;
      currentPage.value = 1;
    };
    
    // 검색 실행
    const searchEvents = () => {
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
      selectedStatus.value = null;
      selectedEventType.value = null;
      searchQuery.value = '';
      currentPage.value = 1;
    };
    
    // 상태 이름 가져오기
    const getStatusName = (value) => {
      const status = statuses.find(s => s.value === value);
      return status ? status.name : '';
    };
    
    // 이벤트 유형 이름 가져오기
    const getEventTypeName = (value) => {
      const type = eventTypes.find(t => t.value === value);
      return type ? type.name : '';
    };
    
    // 임시 데이터 생성 함수
    const generateMockEvents = () => {
      const mockEvents = [];
      const eventTypes = ['discount', 'gift', 'special', 'point', 'coupon'];
      
      // 현재 날짜 기준
      const today = new Date();
      
      for (let i = 1; i <= 30; i++) {
        // 이벤트 시작일과 종료일 설정
        const startDate = new Date();
        const endDate = new Date();
        
        let status;
        
        // 상태에 따라 날짜 설정
        if (i % 3 === 0) {
          // 진행 예정 이벤트
          startDate.setDate(today.getDate() + Math.floor(Math.random() * 10) + 1);
          endDate.setDate(startDate.getDate() + Math.floor(Math.random() * 20) + 10);
          status = 'upcoming';
        } else if (i % 3 === 1) {
          // 진행 중 이벤트
          startDate.setDate(today.getDate() - Math.floor(Math.random() * 10));
          endDate.setDate(today.getDate() + Math.floor(Math.random() * 10) + 1);
          status = 'ongoing';
        } else {
          // 종료된 이벤트
          startDate.setDate(today.getDate() - Math.floor(Math.random() * 30) - 10);
          endDate.setDate(today.getDate() - Math.floor(Math.random() * 10));
          status = 'ended';
        }
        
        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        
        mockEvents.push({
          id: i,
          title: `${i}번 ${getEventTypeName(eventType)} ${status === 'ended' ? '(종료)' : ''}`,
          description: `이 이벤트는 ${getEventTypeName(eventType)} 관련 혜택을 제공합니다.`,
          thumbnailUrl: `https://picsum.photos/id/${i + 200}/300/150`,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          status,
          eventType
        });
      }
      
      return mockEvents;
    };
    
    return {
      events,
      loading,
      currentPage,
      selectedStatus,
      selectedEventType,
      searchQuery,
      statuses,
      eventTypes,
      activeFilterSection,
      isToolbarSticky,
      hasActiveFilters,
      filteredEvents,
      totalPages,
      displayedPages,
      totalResults,
      formatDate,
      viewEventDetail,
      selectStatus,
      selectEventType,
      searchEvents,
      clearSearch,
      changePage,
      clearAllFilters,
      getStatusName,
      getEventTypeName,
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

.event-view {
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

/* 이벤트 리스트 영역 */
.event-list-section {
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

/* 이벤트 리스트 스타일 */
.event-list {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.event-list-header {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background-color: #F5F5F5;
  border-bottom: 1px solid #EEEEEE;
  font-weight: 600;
  color: #555;
  font-size: 14px;
}

.event-list-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #EEEEEE;
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.event-list-item:last-child {
  border-bottom: none;
}

.event-list-item:hover {
  background-color: #F9F9F9;
}

.event-list-item.inactive {
  opacity: 0.7;
}

/* 컬럼 너비 설정 */
.col-status {
  width: 100px;
  flex-shrink: 0;
}

.col-thumbnail {
  width: 120px;
  flex-shrink: 0;
  margin-right: 20px;
}

.col-title {
  flex-grow: 1;
  padding-right: 20px;
}

.col-period {
  width: 180px;
  flex-shrink: 0;
  text-align: center;
}

.col-type {
  width: 120px;
  flex-shrink: 0;
  text-align: center;
}

/* 이벤트 아이템 스타일 */
.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
}

.status-ongoing {
  background-color: rgba(72, 207, 203, 0.1);
  color: var(--primary-dark);
  border: 1px solid rgba(72, 207, 203, 0.3);
}

.status-upcoming {
  background-color: rgba(255, 193, 7, 0.1);
  color: #F5A623;
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.status-ended {
  background-color: rgba(158, 158, 158, 0.1);
  color: #9E9E9E;
  border: 1px solid rgba(158, 158, 158, 0.3);
}

.event-thumbnail {
  width: 100px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.event-title {
  margin: 0 0 5px;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-dark);
}

.event-description {
  margin: 0;
  font-size: 13px;
  color: #777;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.event-period {
  font-size: 13px;
  color: #666;
}

.event-type {
  display: inline-block;
  font-size: 13px;
  color: #666;
  padding: 3px 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
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
  
  .event-list-header {
    display: none;
  }
  
  .event-list-item {
    flex-wrap: wrap;
    padding: 15px;
  }
  
  .col-status {
    order: 1;
    width: auto;
    margin-right: 10px;
  }
  
  .col-thumbnail {
    order: 3;
    width: 80px;
    margin-right: 15px;
  }
  
  .col-title {
    order: 4;
    width: calc(100% - 95px);
    padding-right: 0;
  }
  
  .col-period, .col-type {
    order: 5;
    width: 50%;
    text-align: left;
    margin-top: 10px;
    font-size: 12px;
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
  
  .event-list-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .col-status {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin: 0 0 10px;
  }
  
  .col-thumbnail {
    width: 100%;
    margin: 0 0 10px;
  }
  
  .event-thumbnail {
    width: 100%;
    height: 150px;
  }
  
  .col-title {
    width: 100%;
    margin-bottom: 10px;
  }
  
  .col-period, .col-type {
    width: 100%;
    margin-bottom: 5px;
  }
}

@media (max-width: 480px) {
  .filter-options-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .event-thumbnail {
    height: 120px;
  }
}
</style>
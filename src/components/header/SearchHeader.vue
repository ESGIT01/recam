<!-- src/components/header/SearchHeader.vue -->
<template>
    <div class="search-header">
      <div class="container">
        <div class="search-bar">
          <button class="back-btn" @click="closeSearch">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          
          <div class="search-input-wrapper">
            <input 
              type="text" 
              class="search-input" 
              placeholder="검색어를 입력하세요" 
              v-model="searchQuery" 
              ref="searchInput"
              @input="handleSearchInput"
              @keyup.enter="handleSearch"
            />
            <button v-if="searchQuery" class="clear-btn" @click="clearSearch">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </button>
          </div>
          
          <button class="search-btn" @click="handleSearch">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
      </div>
      
      <div class="search-content">
        <div class="container">
          <div class="search-tabs">
            <button 
              class="tab-btn" 
              :class="{ 'active': activeTab === 'recent' }"
              @click="activeTab = 'recent'"
            >
              최근 검색어
            </button>
            <button 
              class="tab-btn" 
              :class="{ 'active': activeTab === 'popular' }"
              @click="activeTab = 'popular'"
            >
              추천 검색어
            </button>
          </div>
          
          <!-- 최근 검색어 탭 -->
          <div v-if="activeTab === 'recent'" class="tab-content">
            <div v-if="recentSearches.length > 0" class="recent-searches">
              <div class="searches-header">
                <h3 class="searches-title">최근 검색어</h3>
                <button class="clear-all-btn" @click="clearAllRecentSearches">전체 삭제</button>
              </div>
              <ul class="searches-list">
                <li v-for="(item, index) in recentSearches" :key="index" class="search-item">
                  <div class="search-text" @click="selectSearch(item)">{{ item }}</div>
                  <button class="delete-btn" @click="removeRecentSearch(index)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </li>
              </ul>
            </div>
            <div v-else class="empty-state">
              <p>최근 검색어가 없습니다.</p>
            </div>
          </div>
          
          <!-- 추천 검색어 탭 -->
          <div v-if="activeTab === 'popular'" class="tab-content">
            <div class="popular-searches">
              <div class="searches-header">
                <h3 class="searches-title">인기 검색어</h3>
              </div>
              <div class="tag-container">
                <div 
                  v-for="(tag, index) in popularTags" 
                  :key="index" 
                  class="search-tag"
                  @click="selectSearch(tag)"
                >
                  {{ tag }}
                </div>
              </div>
            </div>
            
            <div class="suggestion-searches">
              <div class="searches-header">
                <h3 class="searches-title">추천 검색어</h3>
              </div>
              <ul class="searches-list">
                <li 
                  v-for="(item, index) in suggestions" 
                  :key="index" 
                  class="search-item"
                  @click="selectSearch(item)"
                >
                  <div class="search-text">{{ item }}</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, nextTick } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'SearchHeader',
    props: {
      initialQuery: {
        type: String,
        default: ''
      }
    },
    emits: ['close'],
    setup(props, { emit }) {
      const router = useRouter();
      const searchInput = ref(null);
      const searchQuery = ref(props.initialQuery || '');
      const activeTab = ref('recent');
      
      // 최근 검색어
      const recentSearches = ref([]);
      
      // 인기 검색어
      const popularTags = ref([
        '리뷰캠퍼스', '배송형', '방문형', '식품', '뷰티', '생활가전',
        '인기캠페인', '오늘오픈', '마감임박', '인스타그램', '블로그'
      ]);
      
      // 추천 검색어
      const suggestions = ref([
        '리뷰캠퍼스 사용방법', 
        '배송형 캠페인 신청하기',
        '방문형 캠페인 소개',
        '인스타그램 채널 등록',
        '블로그 캠페인 신청방법',
        '리뷰어 등급 올리기',
        '포인트 사용방법',
        '구매형 캠페인 후기',
        '인기 캠페인 TOP10',
        '리뷰캠퍼스 앱'
      ]);
      
      // 로컬스토리지에서 최근 검색어 불러오기
      const loadRecentSearches = () => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
          try {
            recentSearches.value = JSON.parse(saved);
          } catch (e) {
            recentSearches.value = [];
          }
        }
      };
      
      // 최근 검색어 저장
      const saveRecentSearch = (query) => {
        if (!query.trim()) return;
        
        // 중복 제거
        const index = recentSearches.value.indexOf(query);
        if (index > -1) {
          recentSearches.value.splice(index, 1);
        }
        
        // 배열 맨 앞에 추가
        recentSearches.value.unshift(query);
        
        // 최대 10개까지만 저장
        if (recentSearches.value.length > 10) {
          recentSearches.value = recentSearches.value.slice(0, 10);
        }
        
        // 로컬스토리지에 저장
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value));
      };
      
      // 최근 검색어 개별 삭제
      const removeRecentSearch = (index) => {
        recentSearches.value.splice(index, 1);
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value));
      };
      
      // 최근 검색어 전체 삭제
      const clearAllRecentSearches = () => {
        recentSearches.value = [];
        localStorage.removeItem('recentSearches');
      };
      
      // 검색 입력 핸들러
      const handleSearchInput = () => {
        // 여기에 검색어 입력 시 실시간 처리 로직 추가 가능
      };
      
      // 검색 실행
      const handleSearch = () => {
        if (!searchQuery.value.trim()) return;
        
        // 최근 검색어에 추가
        saveRecentSearch(searchQuery.value);
        
        // 검색 페이지로 이동
        router.push({ 
          path: '/search', 
          query: { keyword: searchQuery.value } 
        });
        
        // 검색창 닫기
        emit('close');
      };
      
      // 검색어 선택
      const selectSearch = (query) => {
        searchQuery.value = query;
        handleSearch();
      };
      
      // 검색어 초기화
      const clearSearch = () => {
        searchQuery.value = '';
        nextTick(() => {
          searchInput.value.focus();
        });
      };
      
      // 검색창 닫기
      const closeSearch = () => {
        emit('close');
      };
      
      onMounted(() => {
        loadRecentSearches();
        // 입력 필드에 포커스
        nextTick(() => {
          if (searchInput.value) {
            searchInput.value.focus();
          }
        });
      });
      
      return {
        searchInput,
        searchQuery,
        activeTab,
        recentSearches,
        popularTags,
        suggestions,
        handleSearchInput,
        handleSearch,
        selectSearch,
        clearSearch,
        closeSearch,
        removeRecentSearch,
        clearAllRecentSearches
      };
    }
  }
  </script>
  
  <style scoped>
  .search-header {
    background-color: white;
    border-bottom: 1px solid #eee;
    width: 100%;
  }
  
  .container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  /* 검색바 */
  .search-bar {
    display: flex;
    align-items: center;
    padding: 15px 0;
    gap: 12px;
  }
  
  .back-btn {
    background: none;
    border: none;
    color: #555;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease;
  }
  
  .back-btn:hover {
    background-color: #f5f5f5;
  }
  
  .search-input-wrapper {
    flex: 1;
    position: relative;
  }
  
  .search-input {
    width: 100%;
    padding: 12px 40px 12px 16px;
    border: 2px solid var(--primary);
    border-radius: 8px;
    font-family: 'Pretendard', sans-serif;
    font-size: 16px;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }
  
  .search-input:focus {
    border-color: var(--primary-dark);
    box-shadow: 0 0 0 4px rgba(72, 207, 203, 0.1);
  }
  
  .clear-btn {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #aaa;
    cursor: pointer;
    padding: 5px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s ease;
  }
  
  .clear-btn:hover {
    color: #666;
  }
  
  .search-btn {
    background-color: var(--primary);
    border: none;
    color: white;
    cursor: pointer;
    padding: 10px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 2px 5px rgba(34, 151, 153, 0.2);
  }
  
  .search-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(34, 151, 153, 0.3);
  }
  
  /* 검색 콘텐츠 */
  .search-content {
    background-color: #FFFFFF;
    padding: 20px 0;
    min-height: 300px;
    max-height: calc(100vh - 130px);
    overflow-y: auto;
  }
  
  /* 탭 */
  .search-tabs {
    display: flex;
    border-bottom: 1px solid #eee;
    margin-bottom: 20px;
  }
  
  .tab-btn {
    padding: 12px 20px;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    font-family: 'Pretendard', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #666;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .tab-btn:hover {
    color: var(--primary-dark);
  }
  
  .tab-btn.active {
    color: var(--primary-dark);
    border-bottom-color: var(--primary);
  }
  
  /* 탭 내용 */
  .tab-content {
    padding: 10px 0;
  }
  
  .searches-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .searches-title {
    font-size: 15px;
    font-weight: 600;
    color: #444;
    margin: 0;
  }
  
  .clear-all-btn {
    background: none;
    border: none;
    color: #888;
    font-size: 13px;
    cursor: pointer;
    transition: color 0.2s ease;
  }
  
  .clear-all-btn:hover {
    color: var(--primary-dark);
    text-decoration: underline;
  }
  
  .searches-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .search-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 5px;
    border-bottom: 1px solid #eee;
    transition: background-color 0.2s ease;
    cursor: pointer;
  }
  
  .search-item:hover {
    background-color: #f0f0f0;
  }
  
  .search-text {
    flex: 1;
    font-size: 14px;
    color: #333;
  }
  
  .delete-btn {
    background: none;
    border: none;
    color: #ccc;
    cursor: pointer;
    padding: 5px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s ease;
  }
  
  .delete-btn:hover {
    color: #666;
  }
  
  /* 빈 상태 */
  .empty-state {
    padding: 30px 0;
    text-align: center;
    color: #888;
    font-size: 14px;
  }
  
  /* 태그 컨테이너 */
  .tag-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 30px;
  }
  
  .search-tag {
    padding: 8px 15px;
    background-color: #f0f8f8;
    border: 1px solid #e0f0f0;
    border-radius: 20px;
    font-size: 13px;
    color: var(--primary-dark);
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .search-tag:hover {
    background-color: #e0f0f0;
    border-color: var(--primary);
  }
  
  /* 반응형 */
  @media (max-width: 768px) {
    .search-input {
      font-size: 14px;
      padding: 10px 40px 10px 12px;
    }
    
    .tab-btn {
      padding: 10px 15px;
      font-size: 13px;
    }
  }
  </style>
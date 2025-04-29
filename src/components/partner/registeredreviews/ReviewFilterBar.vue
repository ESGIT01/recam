<!-- src/components/partner/reviews/ReviewFilterBar.vue -->
<template>
    <div class="filter-bar">
      <div class="filter-row">
        <div class="search-bar">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="리뷰 검색" 
            :value="searchQuery"
            @input="updateSearchQuery($event.target.value)"
          />
        </div>
        
        <div class="view-controls">
          <button class="view-btn active">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span>그리드</span>
          </button>
          <button class="view-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
            <span>리스트</span>
          </button>
          <div class="filter-toggle" :class="{ 'is-open': isFiltersOpen }" @click="toggleFilters">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            <span>필터</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
      </div>
      
      <!-- 고급 필터 패널 -->
      <div class="advanced-filters" v-if="isFiltersOpen">
        <div class="filter-section">
          <div class="filter-group">
            <label>캠페인</label>
            <select 
              :value="campaignFilter" 
              @change="updateCampaignFilter($event.target.value)"
            >
              <option value="all">전체 캠페인</option>
              <option 
                v-for="campaign in campaigns" 
                :key="campaign.id" 
                :value="campaign.id"
              >
                {{ campaign.title }}
              </option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>채널</label>
            <select 
              :value="channelFilter" 
              @change="updateChannelFilter($event.target.value)"
            >
              <option value="all">전체 채널</option>
              <option value="블로그">블로그</option>
              <option value="인스타그램">인스타그램</option>
              <option value="유튜브">유튜브</option>
              <option value="기타">기타</option>
            </select>
          </div>
          
          <div class="filter-group date-range-group">
            <label>등록일</label>
            <div class="date-inputs">
              <div class="date-input">
                <input 
                  type="date" 
                  :value="dateRange.start" 
                  @input="updateDateRange('start', $event.target.value)"
                  placeholder="시작일"
                />
              </div>
              <span class="date-separator">~</span>
              <div class="date-input">
                <input 
                  type="date" 
                  :value="dateRange.end" 
                  @input="updateDateRange('end', $event.target.value)"
                  placeholder="종료일"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div class="filter-actions">
          <div class="sort-group">
            <label>정렬</label>
            <select 
              :value="sortOption" 
              @change="updateSortOption($event.target.value)"
            >
              <option value="newest">최신순</option>
              <option value="oldest">오래된순</option>
              <option value="rating">평점순</option>
              <option value="engagement">인게이지먼트순</option>
            </select>
          </div>
          
          <div class="filter-buttons">
            <button class="reset-btn" @click="resetFilters">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
              </svg>
              초기화
            </button>
            <button class="apply-btn" @click="applyFilters">
              적용하기
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, watch } from 'vue';
  
  export default {
    name: 'ReviewFilterBar',
    props: {
      searchQuery: {
        type: String,
        required: true
      },
      campaignFilter: {
        type: String,
        required: true
      },
      channelFilter: {
        type: String,
        required: true
      },
      dateRange: {
        type: Object,
        required: true
      },
      sortOption: {
        type: String,
        required: true
      },
      campaigns: {
        type: Array,
        default: () => []
      }
    },
    emits: [
      'update:searchQuery', 
      'update:campaignFilter', 
      'update:channelFilter', 
      'update:dateRange', 
      'update:sortOption',
      'filter-changed',
      'sort-changed'
    ],
    setup(props, { emit }) {
      const isFiltersOpen = ref(false);
      
      // 임시 상태 값들 (변경 시 바로 적용되지 않고 '적용하기' 버튼 클릭 시 적용)
      const tempSearchQuery = ref(props.searchQuery);
      const tempCampaignFilter = ref(props.campaignFilter);
      const tempChannelFilter = ref(props.channelFilter);
      const tempDateRange = ref({ ...props.dateRange });
      const tempSortOption = ref(props.sortOption);
      
      // props가 변경될 때 임시 상태 업데이트
      watch(() => props.searchQuery, (newVal) => {
        tempSearchQuery.value = newVal;
      });
      
      watch(() => props.campaignFilter, (newVal) => {
        tempCampaignFilter.value = newVal;
      });
      
      watch(() => props.channelFilter, (newVal) => {
        tempChannelFilter.value = newVal;
      });
      
      watch(() => props.dateRange, (newVal) => {
        tempDateRange.value = { ...newVal };
      }, { deep: true });
      
      watch(() => props.sortOption, (newVal) => {
        tempSortOption.value = newVal;
      });
      
      // 필터 패널 토글
      const toggleFilters = () => {
        isFiltersOpen.value = !isFiltersOpen.value;
      };
      
      // 검색어 업데이트 (실시간 반영)
      const updateSearchQuery = (value) => {
        emit('update:searchQuery', value);
        emit('filter-changed');
      };
      
      // 임시 필터 값 업데이트
      const updateCampaignFilter = (value) => {
        tempCampaignFilter.value = value;
      };
      
      const updateChannelFilter = (value) => {
        tempChannelFilter.value = value;
      };
      
      const updateDateRange = (type, value) => {
        tempDateRange.value = {
          ...tempDateRange.value,
          [type]: value
        };
      };
      
      const updateSortOption = (value) => {
        tempSortOption.value = value;
        // 정렬 옵션은 즉시 반영
        emit('update:sortOption', value);
        emit('sort-changed');
      };
      
      // 필터 적용
      const applyFilters = () => {
        emit('update:campaignFilter', tempCampaignFilter.value);
        emit('update:channelFilter', tempChannelFilter.value);
        emit('update:dateRange', { ...tempDateRange.value });
        emit('filter-changed');
      };
      
      // 필터 초기화
      const resetFilters = () => {
        tempCampaignFilter.value = 'all';
        tempChannelFilter.value = 'all';
        tempDateRange.value = { start: null, end: null };
        tempSortOption.value = 'newest';
        
        // 초기화 후 바로 적용
        emit('update:campaignFilter', 'all');
        emit('update:channelFilter', 'all');
        emit('update:dateRange', { start: null, end: null });
        emit('update:sortOption', 'newest');
        emit('filter-changed');
        emit('sort-changed');
      };
      
      return {
        isFiltersOpen,
        toggleFilters,
        updateSearchQuery,
        updateCampaignFilter,
        updateChannelFilter,
        updateDateRange,
        updateSortOption,
        applyFilters,
        resetFilters
      };
    }
  };
  </script>
  
  <style scoped>
  .filter-bar {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    margin-bottom: 24px;
    overflow: hidden;
  }
  
  .filter-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #f1f5f9;
  }
  
  .search-bar {
    position: relative;
    max-width: 300px;
    width: 100%;
  }
  
  .search-bar svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
  }
  
  .search-bar input {
    width: 100%;
    padding: 10px 10px 10px 40px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.2s;
  }
  
  .search-bar input:focus {
    outline: none;
    border-color: #229799;
  }
  
  .view-controls {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .view-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
    background-color: white;
    color: #64748b;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .view-btn:hover {
    border-color: #229799;
    color: #229799;
  }
  
  .view-btn.active {
    background-color: #F5F5F5;
    border-color: #e5e7eb;
    color: #424242;
  }
  
  .filter-toggle {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
    background-color: white;
    color: #64748b;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .filter-toggle:hover {
    border-color: #229799;
    color: #229799;
  }
  
  .filter-toggle.is-open {
    background-color: #F5F5F5;
    border-color: #e5e7eb;
    color: #424242;
  }
  
  .filter-toggle .chevron {
    transition: transform 0.2s;
  }
  
  .filter-toggle.is-open .chevron {
    transform: rotate(180deg);
  }
  
  .advanced-filters {
    padding: 16px;
    border-top: 1px solid #f1f5f9;
    background-color: #F5F5F5;
  }
  
  .filter-section {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 16px;
  }
  
  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 200px;
  }
  
  .filter-group label {
    font-size: 12px;
    font-weight: 500;
    color: #64748b;
  }
  
  .filter-group select,
  .filter-group input {
    padding: 8px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 14px;
    background-color: white;
    transition: border-color 0.2s;
  }
  
  .filter-group select:focus,
  .filter-group input:focus {
    outline: none;
    border-color: #229799;
  }
  
  .date-range-group {
    min-width: 320px;
  }
  
  .date-inputs {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .date-input {
    flex: 1;
  }
  
  .date-separator {
    color: #64748b;
    font-size: 14px;
  }
  
  .filter-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .sort-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .sort-group label {
    font-size: 12px;
    font-weight: 500;
    color: #64748b;
  }
  
  .sort-group select {
    padding: 8px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 14px;
    background-color: white;
    transition: border-color 0.2s;
  }
  
  .sort-group select:focus {
    outline: none;
    border-color: #229799;
  }
  
  .filter-buttons {
    display: flex;
    gap: 8px;
  }
  
  .reset-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
    background-color: white;
    color: #64748b;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .reset-btn:hover {
    background-color: #f8fafc;
  }
  
  .apply-btn {
    padding: 8px 16px;
    border-radius: 6px;
    border: none;
    background-color: #229799;
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .apply-btn:hover {
    background-color: #1a7a7c;
  }
  
  @media (max-width: 768px) {
    .filter-row {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
    }
    
    .search-bar {
      max-width: 100%;
    }
    
    .filter-section {
      flex-direction: column;
    }
    
    .filter-group {
      width: 100%;
    }
    
    .date-range-group {
      min-width: 100%;
    }
    
    .filter-actions {
      flex-direction: column;
      gap: 16px;
    }
    
    .sort-group {
      width: 100%;
    }
    
    .filter-buttons {
      width: 100%;
    }
    
    .reset-btn, .apply-btn {
      flex: 1;
    }
  }
  </style>
<template>
    <div class="delivery-view">
      <!-- 페이지 헤더 영역 -->
      <div class="page-header">
        <div class="container">
          <div class="breadcrumbs">
            <router-link to="/" class="breadcrumb-item">홈</router-link>
            <span class="breadcrumb-separator">&gt;</span>
            <router-link to="/delivery" class="breadcrumb-item">배송형</router-link>
            <template v-if="selectedCategory">
              <span class="breadcrumb-separator">&gt;</span>
              <span class="breadcrumb-item current">{{ getCategoryName(selectedCategory) }}</span>
            </template>
          </div>
          <h1 class="page-title">{{ pageTitle }}</h1>
          <p class="page-description">{{ pageDescription }}</p>
        </div>
      </div>
  
      <!-- 고정된 필터 툴바 (스크롤 시 상단에 고정) -->
      <div class="filter-toolbar" :class="{ 'sticky': isToolbarSticky }">
        <div class="container">
          <div class="filter-buttons">
            <button 
              class="filter-button" 
              :class="{ 'has-active': selectedCategory }"
              @click="toggleFilterSection('category')"
            >
              <span class="button-label">카테고리</span>
              <span v-if="selectedCategory" class="active-filter">{{ getCategoryName(selectedCategory) }}</span>
              <span v-else class="default-text">전체</span>
              <span class="toggle-icon">{{ activeFilterSection === 'category' ? '▲' : '▼' }}</span>
            </button>
            
            <button 
              class="filter-button" 
              :class="{ 'has-active': selectedCampaignType }"
              @click="toggleFilterSection('campaignType')"
            >
              <span class="button-label">캠페인 유형</span>
              <span v-if="selectedCampaignType" class="active-filter">{{ getCampaignTypeName(selectedCampaignType) }}</span>
              <span v-else class="default-text">전체</span>
              <span class="toggle-icon">{{ activeFilterSection === 'campaignType' ? '▲' : '▼' }}</span>
            </button>
            
            <button 
              class="filter-button" 
              :class="{ 'has-active': selectedChannelType }"
              @click="toggleFilterSection('channelType')"
            >
              <span class="button-label">채널 유형</span>
              <span v-if="selectedChannelType" class="active-filter">{{ getChannelTypeName(selectedChannelType) }}</span>
              <span v-else class="default-text">전체</span>
              <span class="toggle-icon">{{ activeFilterSection === 'channelType' ? '▲' : '▼' }}</span>
            </button>
          </div>
          
          <div class="sort-control">
            <select v-model="sortOption" class="sort-select">
              <option value="latest">최신순</option>
              <option value="imminent">마감 임박순</option>
              <option value="popular">인기순</option>
              <option value="highPoints">포인트 높은순</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- 확장가능한 필터 패널 -->
      <div v-if="activeFilterSection" class="filter-panel-container">
        <div class="filter-panel">
          <div class="container">
            <!-- 카테고리 필터 옵션 -->
            <div v-if="activeFilterSection === 'category'" class="filter-options-grid">
              <button 
                class="grid-option"
                :class="{ 'active': !selectedCategory }"
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
            
            <!-- 캠페인 유형 필터 옵션 -->
            <div v-if="activeFilterSection === 'campaignType'" class="filter-options-grid">
              <button 
                class="grid-option"
                :class="{ 'active': !selectedCampaignType }"
                @click="selectCampaignType(null)"
              >
                전체
              </button>
              <button 
                v-for="type in campaignTypes" 
                :key="type.value"
                class="grid-option"
                :class="{ 'active': selectedCampaignType === type.value }"
                @click="selectCampaignType(type.value)"
              >
                {{ type.name }}
              </button>
            </div>
            
            <!-- 채널 유형 필터 옵션 -->
            <div v-if="activeFilterSection === 'channelType'" class="filter-options-grid">
              <button 
                class="grid-option"
                :class="{ 'active': !selectedChannelType }"
                @click="selectChannelType(null)"
              >
                전체
              </button>
              <button 
                v-for="channel in channelTypes" 
                :key="channel.value"
                class="grid-option"
                :class="{ 'active': selectedChannelType === channel.value }"
                @click="selectChannelType(channel.value)"
              >
                {{ channel.name }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 활성화된 필터 표시 및 초기화 버튼 -->
      <div class="active-filters-bar" v-if="hasActiveFilters">
        <div class="container">
          <div class="active-filter-tags">
            <div v-if="selectedCategory" class="filter-tag">
              <span class="tag-label">카테고리:</span>
              <span class="tag-value">{{ getCategoryName(selectedCategory) }}</span>
              <button class="remove-tag" @click="selectCategory(null)">×</button>
            </div>
            
            <div v-if="selectedCampaignType" class="filter-tag">
              <span class="tag-label">캠페인 유형:</span>
              <span class="tag-value">{{ getCampaignTypeName(selectedCampaignType) }}</span>
              <button class="remove-tag" @click="selectCampaignType(null)">×</button>
            </div>
            
            <div v-if="selectedChannelType" class="filter-tag">
              <span class="tag-label">채널 유형:</span>
              <span class="tag-value">{{ getChannelTypeName(selectedChannelType) }}</span>
              <button class="remove-tag" @click="selectChannelType(null)">×</button>
            </div>
          </div>
          
          <button class="clear-filters" @click="clearAllFilters">
            <span class="clear-icon">⟲</span>
            필터 초기화
          </button>
        </div>
      </div>
  
      <!-- 캠페인 리스트 및 결과 표시 -->
      <div class="campaign-list-section">
        <div class="container">
          <!-- 로딩 상태 표시 -->
          <div v-if="loading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>캠페인을 불러오고 있습니다...</p>
          </div>
          
          <!-- 결과 없음 메시지 -->
          <div v-else-if="filteredCampaigns.length === 0" class="no-results">
            <div class="no-results-content">
              <div class="no-results-icon">🔍</div>
              <h3>검색 결과가 없습니다</h3>
              <p>다른 필터 옵션을 선택하거나 필터를 초기화해 보세요.</p>
              <button class="reset-filters-btn" @click="clearAllFilters">필터 초기화</button>
            </div>
          </div>
          
          <!-- 캠페인 그리드 -->
          <div v-else>
            <div class="results-count">
              <span class="count-number">{{ totalResults }}</span>개의 캠페인
              <span v-if="hasActiveFilters">이 검색되었습니다</span>
            </div>
            
            <div class="campaign-grid">
              <CampaignCard 
                v-for="campaign in filteredCampaigns" 
                :key="campaign.id"
                :campaign="campaign"
                @click="viewCampaignDetail(campaign.id)"
                class="campaign-card-wrapper"
              />
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
  </template>
  
  <script>
  import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import CampaignCard from '@/components/campaign/CampaignCard.vue';
  
  export default {
    name: 'DeliveryView',
    components: {
      CampaignCard
    },
    props: {
      category: {
        type: String,
        default: null
      }
    },
    setup(props) {
      const router = useRouter();
      const route = useRoute();
      
      // 상태 변수들
      const campaigns = ref([]);
      const loading = ref(true);
      const currentPage = ref(1);
      const itemsPerPage = ref(12);
      const selectedCategory = ref(null);
      const selectedCampaignType = ref(null);
      const selectedChannelType = ref(null);
      const sortOption = ref('latest');
      const activeFilterSection = ref(null);
      const isToolbarSticky = ref(false);
      
      // 페이지 타이틀 및 설명
      const pageTitle = computed(() => {
        if (selectedCategory.value) {
          return `배송형 > ${getCategoryName(selectedCategory.value)}`;
        }
        return '배송형';
      });
      
      const pageDescription = computed(() => {
        if (selectedCategory.value) {
          return `${getCategoryName(selectedCategory.value)} 관련 다양한 배송형 캠페인을 만나보세요`;
        }
        return '다양한 배송형 캠페인을 만나보세요';
      });
      
      // 필터 활성화 여부
      const hasActiveFilters = computed(() => {
        return selectedCategory.value || selectedCampaignType.value || selectedChannelType.value;
      });
      
      // 카테고리 데이터
      const categories = [
        { value: 'food', name: '식품' },
        { value: 'life', name: '생활' },
        { value: 'beauty', name: '뷰티' },
        { value: 'child', name: '유아동' },
        { value: 'sports', name: '스포츠/아웃도어' },
        { value: 'fashion', name: '패션/잡화' },
        { value: 'pet', name: '반려동물' },
        { value: 'tech', name: '테크/가전' },
        { value: 'education', name: '도서/교육' },
        { value: 'service', name: '서비스' },
        { value: 'etc', name: '기타' }
      ];
      
      // 캠페인 유형 데이터
      const campaignTypes = [
        { value: 'open', name: '오늘오픈 캠페인' },
        { value: 'imminent', name: '마감임박 캠페인' },
        { value: 'probability', name: '선정확률 높은 캠페인' },
        { value: 'point', name: '포인트 캠페인' }
      ];
      
      // 채널 유형 데이터
      const channelTypes = [
        { value: 'blog', name: '블로그' },
        { value: 'instagram', name: '인스타그램' },
        { value: 'youtube', name: '유튜브' },
        { value: 'tiktok', name: '틱톡' },
        { value: 'clip', name: '클립 - 블로그' },
        { value: 'reels', name: '릴스 - 인스타그램' },
        { value: 'shorts', name: '쇼츠 - 유튜브' }
      ];
      
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
        // 라우트 파라미터에서 카테고리 가져오기
        if (props.category) {
          selectedCategory.value = props.category;
        }
        
        // 쿼리 파라미터에서 필터 가져오기
        if (route.query.campaignType) {
          selectedCampaignType.value = route.query.campaignType;
        }
        
        if (route.query.channelType) {
          selectedChannelType.value = route.query.channelType;
        }
        
        if (route.query.sort) {
          sortOption.value = route.query.sort;
        }
        
        if (route.query.page) {
          currentPage.value = parseInt(route.query.page);
        }
        
        // 스크롤 이벤트 리스너 추가
        window.addEventListener('scroll', handleScroll);
        
        fetchCampaigns();
      });
      
      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      onUnmounted(() => {
        window.removeEventListener('scroll', handleScroll);
      });
      
      // 필터나 정렬 변경시 URL 및 데이터 업데이트
      watch([selectedCategory, selectedCampaignType, selectedChannelType, sortOption, currentPage], () => {
        updateUrl();
        activeFilterSection.value = null; // 필터 선택 후 패널 닫기
        fetchCampaigns();
      });
      
      // URL 업데이트 함수
      const updateUrl = () => {
        const query = {};
        
        if (selectedCampaignType.value) {
          query.campaignType = selectedCampaignType.value;
        }
        
        if (selectedChannelType.value) {
          query.channelType = selectedChannelType.value;
        }
        
        if (sortOption.value !== 'latest') {
          query.sort = sortOption.value;
        }
        
        if (currentPage.value > 1) {
          query.page = currentPage.value;
        }
        
        // 현재 라우트의 이름에 따라 적절한 라우트로 이동
        if (route.name === 'delivery-category' && selectedCategory.value) {
          router.replace({ 
            name: 'delivery-category', 
            params: { category: selectedCategory.value }, 
            query 
          });
        } else if (selectedCategory.value) {
          router.replace({ 
            name: 'delivery-category', 
            params: { category: selectedCategory.value }, 
            query 
          });
        } else {
          router.replace({
            name: 'delivery',
            query
          });
        }
      };
      
      // API에서 캠페인 데이터 가져오기
      const fetchCampaigns = async () => {
        loading.value = true;
        
        try {
          // API 호출은 여기에 구현하세요
          // 실제 구현에서는 axios나 fetch를 사용하여 API 호출
          // 지금은 임시 데이터를 사용합니다
          
          // 임시 데이터
          setTimeout(() => {
            campaigns.value = generateMockCampaigns();
            loading.value = false;
          }, 500);
        } catch (error) {
          console.error('캠페인 데이터를 불러오는 중 오류가 발생했습니다:', error);
          loading.value = false;
        }
      };
      
      // 필터된 캠페인 데이터 계산
      const filteredCampaigns = computed(() => {
        let result = [...campaigns.value];
        
        // 카테고리 필터링
        if (selectedCategory.value) {
          result = result.filter(c => c.category === selectedCategory.value);
        }
        
        // 캠페인 유형 필터링
        if (selectedCampaignType.value) {
          result = result.filter(c => c.campaignType === selectedCampaignType.value);
        }
        
        // 채널 유형 필터링
        if (selectedChannelType.value) {
          result = result.filter(c => c.channel === selectedChannelType.value);
        }
        
        // 정렬
        switch (sortOption.value) {
          case 'imminent':
            result.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
            break;
          case 'popular':
            result.sort((a, b) => b.applicants - a.applicants);
            break;
          case 'highPoints':
            result.sort((a, b) => b.points - a.points);
            break;
          default:
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        
        // 페이지네이션
        const startIndex = (currentPage.value - 1) * itemsPerPage.value;
        const endIndex = startIndex + itemsPerPage.value;
        
        return result.slice(startIndex, endIndex);
      });
      
      // 총 결과 수
      const totalResults = computed(() => {
        return campaigns.value.filter(campaign => {
          // 카테고리 필터링
          if (selectedCategory.value && campaign.category !== selectedCategory.value) return false;
          
          // 캠페인 유형 필터링
          if (selectedCampaignType.value && campaign.campaignType !== selectedCampaignType.value) return false;
          
          // 채널 유형 필터링
          if (selectedChannelType.value && campaign.channel !== selectedChannelType.value) return false;
          
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
      
      // 캠페인 상세 페이지로 이동
      const viewCampaignDetail = (id) => {
        router.push(`/delivery/detail/${id}`);
      };
      
      // 카테고리 선택
      const selectCategory = (category) => {
        selectedCategory.value = category;
        currentPage.value = 1;
      };
      
      // 캠페인 유형 선택
      const selectCampaignType = (type) => {
        selectedCampaignType.value = type;
        currentPage.value = 1;
      };
      
      // 채널 유형 선택
      const selectChannelType = (channel) => {
        selectedChannelType.value = channel;
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
        selectedCampaignType.value = null;
        selectedChannelType.value = null;
        sortOption.value = 'latest';
        currentPage.value = 1;
      };
      
      // 카테고리 이름 가져오기
      const getCategoryName = (value) => {
        const category = categories.find(c => c.value === value);
        return category ? category.name : '';
      };
      
      // 캠페인 유형 이름 가져오기
      const getCampaignTypeName = (value) => {
        const type = campaignTypes.find(t => t.value === value);
        return type ? type.name : '';
      };
      
      // 채널 유형 이름 가져오기
      const getChannelTypeName = (value) => {
        const channel = channelTypes.find(c => c.value === value);
        return channel ? channel.name : '';
      };
      
      // 임시 데이터 생성 함수
      const generateMockCampaigns = () => {
        const mockCampaigns = [];
        const categories = ['food', 'life', 'beauty', 'child', 'sports', 'fashion', 'pet', 'tech', 'education', 'service', 'etc'];
        const campaignTypes = ['open', 'imminent', 'probability', 'point'];
        const channels = ['blog', 'instagram', 'youtube', 'tiktok', 'clip', 'reels', 'shorts'];
        const locations = ['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];
        
        for (let i = 1; i <= 50; i++) {
          const today = new Date();
          const createdAt = new Date(today);
          createdAt.setDate(today.getDate() - Math.floor(Math.random() * 30));
          
          const endDate = new Date(today);
          endDate.setDate(today.getDate() + Math.floor(Math.random() * 30));
          
          const category = categories[Math.floor(Math.random() * categories.length)];
          const campaignType = campaignTypes[Math.floor(Math.random() * campaignTypes.length)];
          const channel = channels[Math.floor(Math.random() * channels.length)];
          const location = locations[Math.floor(Math.random() * locations.length)];
          
          mockCampaigns.push({
            id: i,
            title: `[${getCategoryName(category)}] 배송형 캠페인 ${i}`,
            subtitle: `이 캠페인은 ${getCategoryName(category)} 관련 제품을 리뷰하는 캠페인입니다.`,
            imageUrl: `https://picsum.photos/id/${i + 100}/300/300`,
            category,
            campaignType,
            channel,
            location,
            locationCode: location.substring(0, 1),
            points: Math.floor(Math.random() * 5 + 1) * 1000,
            applicants: Math.floor(Math.random() * 50),
            quota: Math.floor(Math.random() * 30) + 20,
            createdAt: createdAt.toISOString(),
            endDate: endDate.toISOString()
          });
        }
        
        return mockCampaigns;
      };
      
      return {
        campaigns,
        loading,
        currentPage,
        itemsPerPage,
        selectedCategory,
        selectedCampaignType,
        selectedChannelType,
        sortOption,
        categories,
        campaignTypes,
        channelTypes,
        filteredCampaigns,
        totalPages,
        displayedPages,
        activeFilterSection,
        isToolbarSticky,
        pageTitle,
        pageDescription,
        hasActiveFilters,
        totalResults,
        viewCampaignDetail,
        selectCategory,
        selectCampaignType,
        selectChannelType,
        changePage,
        clearAllFilters,
        getCategoryName,
        getCampaignTypeName,
        getChannelTypeName,
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
  
  .delivery-view {
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
  
  /* 페이지 헤더 */
  .page-header {
    background-color: white;
    padding: 30px 0 20px;
    border-bottom: 1px solid #EEEEEE;
  }
  
  .breadcrumbs {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }
  
  .breadcrumb-item {
    font-size: 14px;
    color: #666;
    text-decoration: none;
    transition: color 0.2s ease;
  }
  
  .breadcrumb-item:hover {
    color: var(--primary-dark);
  }
  
  .breadcrumb-item.current {
    color: var(--primary-dark);
    font-weight: 500;
  }
  
  .breadcrumb-separator {
    margin: 0 6px;
    color: #CCC;
    font-size: 12px;
  }
  
  .page-title {
    font-size: 28px;
    font-weight: 700;
    color: var(--text-dark);
    margin: 0 0 8px;
  }
  
  .page-description {
    font-size: 16px;
    color: #666;
    margin: 0;
  }
  
  /* 필터 툴바 */
  .filter-toolbar {
    background-color: white;
    padding: 15px 0;
    border-bottom: 1px solid #EEEEEE;
    position: relative;
    z-index: 20;
    transition: box-shadow 0.3s ease;
  }
  
  .filter-toolbar.sticky {
    position: sticky;
    top: 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    animation: slideDown 0.3s ease-out;
  }
  
  @keyframes slideDown {
    from {
      transform: translateY(-100%);
    }
    to {
      transform: translateY(0);
    }
  }
  
  .filter-toolbar .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
  
  .sort-control {
    position: relative;
  }
  
  .sort-select {
    appearance: none;
    background-color: white;
    border: 1px solid #E0E0E0;
    border-radius: 6px;
    padding: 8px 36px 8px 12px;
    font-family: 'Pretendard', sans-serif;
    font-size: 14px;
    color: #555;
    cursor: pointer;
    transition: all 0.2s ease;
    outline: none;
    min-width: 110px;
  }
  
  .sort-select:hover {
    border-color: var(--primary);
  }
  
  .sort-control::after {
    content: "▼";
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 10px;
    color: #888;
    pointer-events: none;
  }
  
  /* 필터 패널 */
  .filter-panel-container {
    position: relative;
    z-index: 19;
  }
  
  .filter-panel {
    background-color: white;
    border-bottom: 1px solid #EEEEEE;
    padding: 20px 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    animation: fadeInDown 0.3s ease-out;
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
    background-color: #F8F8F8;
    padding: 10px 0;
    border-bottom: 1px solid #EEEEEE;
  }
  
  .active-filters-bar .container {
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
    background-color: white;
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
  
  /* 캠페인 리스트 영역 */
  .campaign-list-section {
    padding-top: 30px;
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
  
  .campaign-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 24px;
    margin-bottom: 40px;
  }
  
  .campaign-card-wrapper {
    transition: transform 0.2s ease;
  }
  
  .campaign-card-wrapper:hover {
    transform: translateY(-5px);
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
  @media (max-width: 1199px) {
    .campaign-grid {
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
    }
  }
  
  @media (max-width: 991px) {
    .page-header {
      padding: 25px 0 20px;
    }
    
    .page-title {
      font-size: 24px;
    }
    
    .filter-buttons {
      flex-wrap: wrap;
    }
    
    .campaign-grid {
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 16px;
    }
    
    .filter-options-grid {
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    }
  }
  
  @media (max-width: 767px) {
    .page-header {
      padding: 20px 0 16px;
    }
    
    .breadcrumbs {
      margin-bottom: 10px;
    }
    
    .breadcrumb-item {
      font-size: 13px;
    }
    
    .page-title {
      font-size: 22px;
      margin-bottom: 6px;
    }
    
    .page-description {
      font-size: 14px;
    }
    
    .filter-toolbar .container {
      flex-direction: column;
      align-items: stretch;
      gap: 10px;
    }
    
    .filter-buttons {
      flex-direction: column;
      gap: 8px;
      width: 100%;
    }
    
    .filter-button {
      width: 100%;
    }
    
    .sort-control {
      width: 100%;
    }
    
    .sort-select {
      width: 100%;
    }
    
    .campaign-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    
    .active-filters-bar .container {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }
    
    .active-filter-tags {
      width: 100%;
    }
    
    .pagination {
      flex-wrap: wrap;
      justify-content: center;
    }
  }
  
  @media (max-width: 576px) {
    .container {
      padding: 0 16px;
    }
    
    .campaign-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    
    .filter-tag {
      font-size: 12px;
      padding: 4px 10px;
    }
    
    .page-numbers {
      gap: 4px;
    }
    
    .page-number {
      width: 32px;
      height: 32px;
      font-size: 13px;
    }
    
    .active-filter {
      max-width: 80px;
    }
  }
  
  @media (max-width: 480px) {
    .campaign-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
    
    .filter-options-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  </style>
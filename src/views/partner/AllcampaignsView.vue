<!-- src/views/partner/campaigns/AllCampaignsView.vue -->
<template>
    <div class="campaigns-view">
      <div class="page-header">
        <h1 class="page-title">전체 캠페인</h1>
        <div class="header-actions">
          <button class="btn-create-campaign">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            새 캠페인 만들기
          </button>
        </div>
      </div>
      
      <!-- 캠페인 상태별 필터 탭 -->
      <campaign-tabs 
        :tabs="campaignTabs" 
        :activeTab="activeTab" 
        @change-tab="setActiveTab" 
      />
      
      <!-- 검색 및 정렬 옵션 -->
      <div class="campaigns-tools">
        <div class="search-bar">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="캠페인 검색" 
            v-model="searchQuery"
            @input="filterCampaigns"
          />
        </div>
        <div class="sort-options">
          <label for="sort-select">정렬:</label>
          <select id="sort-select" v-model="sortOption" @change="sortCampaigns">
            <option value="newest">최신순</option>
            <option value="oldest">오래된순</option>
            <option value="applicants">지원자 많은순</option>
            <option value="deadline">마감임박순</option>
          </select>
        </div>
      </div>
      
      <!-- 캠페인 목록 영역 -->
      <div v-if="filteredCampaigns.length > 0" class="campaigns-container">
        <campaign-list 
          :campaigns="filteredCampaigns" 
          :listType="activeTab" 
          @select-reviewers="openSelectReviewers"
          @view-reviewers="viewReviewers"
          @view-review="viewReview"
        />
      </div>
      
      <!-- 검색 결과 없음 -->
      <div v-else class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p v-if="searchQuery">검색 결과가 없습니다. 다른 검색어를 입력해 주세요.</p>
        <p v-else>{{ getEmptyStateMessage() }}</p>
      </div>
      
      <!-- 리뷰어 목록 모달 (완료된 캠페인용) -->
      <reviewers-list
        v-if="showReviewersModal"
        :campaign="selectedCampaign"
        :reviewers="selectedCampaignReviewers"
        @close="closeReviewersModal"
        @view-review="viewReview"
      />
      
      <!-- 리뷰 상세 모달 -->
      <review-modal
        v-if="showReviewModal"
        :review="selectedReview"
        @close="closeReviewModal"
      />
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import CampaignTabs from '@/components/partner/allcampaings/CampaignTabs.vue';
  import CampaignList from '@/components/partner/allcampaings/CampaignList.vue';
  import ReviewersList from '@/components/partner/allcampaings/ReviewersList.vue';
  import ReviewModal from '@/components/partner/allcampaings/ReviewModal.vue';
  
  export default {
    name: 'AllCampaignsView',
    components: {
      CampaignTabs,
      CampaignList,
      ReviewersList,
      ReviewModal
    },
    setup() {
      // 탭 정의
      const campaignTabs = [
        { id: 'all', label: '전체', count: 0 },
        { id: 'pending', label: '승인 전', count: 0 },
        { id: 'waiting', label: '선정 대기', count: 0 },
        { id: 'active', label: '모집 중', count: 0 },
        { id: 'completed', label: '완료됨', count: 0 }
      ];
      
      const activeTab = ref('all');
      const searchQuery = ref('');
      const sortOption = ref('newest');
      
      // 모달 상태
      const showReviewersModal = ref(false);
      const showReviewModal = ref(false);
      const selectedCampaign = ref(null);
      const selectedReview = ref(null);
      
      // 모든 캠페인 데이터 (API에서 가져올 예정)
      const allCampaigns = ref([
        {
          id: 1,
          title: '프리미엄 스킨케어 체험단',
          description: '신규 출시된 프리미엄 스킨케어 제품을 체험하고 솔직한 리뷰를 작성해주세요.',
          type: '배송형',
          target: 10,
          applications: 24,
          daysLeft: 5,
          status: 'active',
          statusText: '모집 중',
          approvalStatus: 'approved',
          createdAt: '2025-04-10T10:00:00',
          deadline: '2025-05-10T23:59:59',
          imageBg: '#e8f7f6'
        },
        {
          id: 2,
          title: '비건 레스토랑 방문 체험단',
          description: '신규 오픈한 비건 레스토랑을 체험하고 블로그 및 SNS에 리뷰를 작성해주세요.',
          type: '방문형',
          target: 5,
          applications: 12,
          daysLeft: 0,
          status: 'waiting',
          statusText: '선정 대기',
          approvalStatus: 'approved',
          createdAt: '2025-04-05T14:30:00',
          deadline: '2025-04-25T23:59:59',
          imageBg: '#e3f2fd'
        },
        {
          id: 3,
          title: '신규 유아용품 체험단',
          description: '출시된 유아용 장난감을 체험하고 육아 커뮤니티 및 블로그에 리뷰를 작성해주세요.',
          type: '배송형',
          target: 8,
          applications: 8,
          daysLeft: 7,
          status: 'pending',
          statusText: '승인 전',
          approvalStatus: 'waiting',
          createdAt: '2025-04-15T09:15:00',
          deadline: '2025-05-15T23:59:59',
          imageBg: '#fef3c7'
        },
        {
          id: 4,
          title: '웰니스 건강식품 체험단',
          description: '프리미엄 건강기능식품을 체험하고 건강 관련 컨텐츠를 블로그에 작성해주세요.',
          type: '배송형',
          target: 15,
          applications: 18,
          daysLeft: 0,
          status: 'completed',
          statusText: '완료됨',
          approvalStatus: 'approved',
          createdAt: '2025-03-20T11:00:00',
          deadline: '2025-04-10T23:59:59',
          imageBg: '#dcfce7',
          reviewers: [
            { 
              id: 101, 
              name: '김건강', 
              channel: '블로그', 
              followers: '8.5K',
              reviewStatus: 'completed',
              reviewUrl: 'https://example.com/review/101',
              reviewDate: '2025-04-18T15:30:00'
            },
            { 
              id: 102, 
              name: '박웰빙', 
              channel: '인스타그램', 
              followers: '12K',
              reviewStatus: 'completed',
              reviewUrl: 'https://example.com/review/102',
              reviewDate: '2025-04-17T10:45:00'
            },
            { 
              id: 103, 
              name: '이영양', 
              channel: '유튜브', 
              followers: '5.2K',
              reviewStatus: 'pending',
              reviewDate: null
            }
          ]
        },
        {
          id: 5,
          title: '홈케어 전자제품 체험단',
          description: '스마트 홈 케어 제품을 체험하고 다양한 기능을 테스트한 후 상세 리뷰를 작성해주세요.',
          type: '배송형',
          target: 6,
          applications: 12,
          daysLeft: 3,
          status: 'active',
          statusText: '모집 중',
          approvalStatus: 'approved',
          createdAt: '2025-04-12T16:45:00',
          deadline: '2025-05-05T23:59:59',
          imageBg: '#f1f5f9'
        }
      ]);
      
      // 선택된 캠페인의 리뷰어 목록
      const selectedCampaignReviewers = computed(() => {
        if (!selectedCampaign.value || !selectedCampaign.value.reviewers) {
          return [];
        }
        return selectedCampaign.value.reviewers;
      });
      
      // 필터링된 캠페인 목록
      const filteredCampaigns = ref([]);
      
      // 초기 탭 카운트 설정 및 필터링
      onMounted(() => {
        updateTabCounts();
        filterCampaigns();
      });
      
      // 탭별 캠페인 수 업데이트
      const updateTabCounts = () => {
        // 전체 캠페인 수
        campaignTabs[0].count = allCampaigns.value.length;
        
        // 승인 전 캠페인 수
        campaignTabs[1].count = allCampaigns.value.filter(
          campaign => campaign.status === 'pending'
        ).length;
        
        // 선정 대기 캠페인 수
        campaignTabs[2].count = allCampaigns.value.filter(
          campaign => campaign.status === 'waiting'
        ).length;
        
        // 모집 중 캠페인 수
        campaignTabs[3].count = allCampaigns.value.filter(
          campaign => campaign.status === 'active'
        ).length;
        
        // 완료된 캠페인 수
        campaignTabs[4].count = allCampaigns.value.filter(
          campaign => campaign.status === 'completed'
        ).length;
      };
      
      // 활성 탭 변경
      const setActiveTab = (tabId) => {
        activeTab.value = tabId;
        filterCampaigns();
      };
      
      // 캠페인 필터링
      const filterCampaigns = () => {
        let filtered = [...allCampaigns.value];
        
        // 탭별 필터
        if (activeTab.value !== 'all') {
          filtered = filtered.filter(campaign => campaign.status === activeTab.value);
        }
        
        // 검색어 필터
        if (searchQuery.value) {
          const query = searchQuery.value.toLowerCase();
          filtered = filtered.filter(campaign => 
            campaign.title.toLowerCase().includes(query) || 
            campaign.description.toLowerCase().includes(query) ||
            campaign.type.toLowerCase().includes(query)
          );
        }
        
        // 정렬 적용
        sortCampaignsList(filtered);
        
        filteredCampaigns.value = filtered;
      };
      
      // 캠페인 정렬
      const sortCampaigns = () => {
        sortCampaignsList(filteredCampaigns.value);
      };
      
      const sortCampaignsList = (campaigns) => {
        switch (sortOption.value) {
          case 'newest':
            campaigns.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
          case 'oldest':
            campaigns.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
          case 'applicants':
            campaigns.sort((a, b) => b.applications - a.applications);
            break;
          case 'deadline':
            campaigns.sort((a, b) => {
              // 만료된 캠페인은 맨 뒤로
              if (a.daysLeft === 0 && b.daysLeft > 0) return 1;
              if (a.daysLeft > 0 && b.daysLeft === 0) return -1;
              return a.daysLeft - b.daysLeft;
            });
            break;
        }
      };
      
      // 리뷰어 선정 모달 열기
      const openSelectReviewers = (campaignId) => {
        console.log(`캠페인 ID ${campaignId}의 리뷰어 선정 모달 열기`);
        // 실제 구현에서는 리뷰어 선정 모달을 열거나 페이지로 이동
      };
      
      // 리뷰어 목록 모달 열기 (완료된 캠페인용)
      const viewReviewers = (campaignId) => {
        selectedCampaign.value = allCampaigns.value.find(campaign => campaign.id === campaignId);
        if (selectedCampaign.value) {
          showReviewersModal.value = true;
        }
      };
      
      // 리뷰어 목록 모달 닫기
      const closeReviewersModal = () => {
        showReviewersModal.value = false;
        selectedCampaign.value = null;
      };
      
      // 리뷰 상세 모달 열기
      const viewReview = (review) => {
        selectedReview.value = review;
        showReviewModal.value = true;
      };
      
      // 리뷰 상세 모달 닫기
      const closeReviewModal = () => {
        showReviewModal.value = false;
        selectedReview.value = null;
      };
      
      // 비어있는 상태 메시지
      const getEmptyStateMessage = () => {
        switch (activeTab.value) {
          case 'pending':
            return '승인 대기 중인 캠페인이 없습니다.';
          case 'waiting':
            return '선정 대기 중인 캠페인이 없습니다.';
          case 'active':
            return '모집 중인 캠페인이 없습니다.';
          case 'completed':
            return '완료된 캠페인이 없습니다.';
          default:
            return '등록된 캠페인이 없습니다.';
        }
      };
      
      return {
        campaignTabs,
        activeTab,
        searchQuery,
        sortOption,
        filteredCampaigns,
        showReviewersModal,
        showReviewModal,
        selectedCampaign,
        selectedReview,
        selectedCampaignReviewers,
        setActiveTab,
        filterCampaigns,
        sortCampaigns,
        openSelectReviewers,
        viewReviewers,
        closeReviewersModal,
        viewReview,
        closeReviewModal,
        getEmptyStateMessage
      };
    }
  };
  </script>
  
  <style scoped>
  .campaigns-view {
    width: 100%;
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }
  
  .page-title {
    font-size: 24px;
    font-weight: 700;
    color: #424242;
    margin: 0;
  }
  
  .btn-create-campaign {
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: #229799;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .btn-create-campaign:hover {
    background-color: #1a7a7c;
  }
  
  .campaigns-tools {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0;
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
  
  .sort-options {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .sort-options label {
    font-size: 14px;
    color: #64748b;
  }
  
  .sort-options select {
    padding: 8px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.2s;
  }
  
  .sort-options select:focus {
    outline: none;
    border-color: #229799;
  }
  
  .campaigns-container {
    margin-top: 20px;
  }
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 0;
    color: #94a3b8;
  }
  
  .empty-state svg {
    color: #e5e7eb;
    margin-bottom: 20px;
  }
  
  .empty-state p {
    font-size: 16px;
    margin: 0;
  }
  
  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }
    
    .campaigns-tools {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }
    
    .search-bar {
      max-width: 100%;
    }
  }
  </style>
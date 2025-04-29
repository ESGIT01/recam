<!-- src/views/partner/campaigns/WaitingApprovalView.vue -->
<template>
  <div class="waiting-approval-view">
    <div class="page-header">
      <h1 class="page-title">선정 대기 캠페인</h1>
      <div class="page-description">
        승인 대기 중인 캠페인 목록입니다. 캠페인 검토는 영업일 기준 최대 2일이 소요됩니다.
      </div>
      <div class="header-actions">
        <button class="btn-create-campaign" @click="navigateToCreate">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          새 캠페인 만들기
        </button>
      </div>
    </div>
    
    <!-- 필터 및 정렬 옵션 -->
    <div class="filters-container">
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
        </select>
      </div>
    </div>
    
    <!-- 대기 중인 캠페인 목록 -->
    <div v-if="filteredCampaigns.length > 0" class="campaigns-container">
      <div 
        v-for="campaign in filteredCampaigns" 
        :key="campaign.id" 
        class="campaign-card"
        :class="{ 'has-feedback': campaign.feedback }"
      >
        <div class="campaign-header">
          <div class="campaign-thumbnail" :style="{ backgroundColor: campaign.thumbnailBg }">
            {{ campaign.title.charAt(0) }}
          </div>
          <div class="campaign-status">
            <span class="status-badge" :class="campaign.status">
              {{ getStatusText(campaign.status) }}
            </span>
            <div class="create-date">{{ formatDate(campaign.createdAt) }} 등록</div>
          </div>
        </div>
        
        <div class="campaign-body">
          <h3 class="campaign-title">{{ campaign.title }}</h3>
          <p class="campaign-description">{{ campaign.description }}</p>
          
          <div class="campaign-meta">
            <div class="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>{{ campaign.type }}</span>
            </div>
            <div class="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span>{{ campaign.target }}명 모집</span>
            </div>
            <div class="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>마감일: {{ formatSimpleDate(campaign.deadline) }}</span>
            </div>
          </div>
          
          <!-- 반려 피드백이 있는 경우 -->
          <div v-if="campaign.feedback" class="feedback-section">
            <div class="feedback-header">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>승인 반려 사유</span>
            </div>
            <p class="feedback-content">{{ campaign.feedback }}</p>
          </div>
        </div>
        
        <div class="campaign-footer">
          <button class="btn btn-outline" @click="viewCampaignDetail(campaign.id)">
            상세보기
          </button>
          
          <div v-if="campaign.status === 'rejected'" class="action-buttons">
            <button class="btn btn-primary" @click="resubmitCampaign(campaign.id)">
              수정 후 재제출
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 검색 결과 없음 -->
    <div v-else class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <p v-if="searchQuery">검색 결과가 없습니다. 다른 검색어를 입력해 주세요.</p>
      <p v-else>승인 대기 중인 캠페인이 없습니다.</p>
      <button class="btn btn-primary" @click="navigateToCreate">새 캠페인 등록하기</button>
    </div>
    
    <!-- 캠페인 상세 모달 -->
    <campaign-detail-modal
      v-if="showDetailModal"
      :campaign="selectedCampaign"
      @close="closeDetailModal"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CampaignDetailModal from '@/components/partner/activecampaigns/CampaignDetailModal.vue';

export default {
  name: 'WaitingApprovalView',
  components: {
    CampaignDetailModal
  },
  setup() {
    const router = useRouter();
    const searchQuery = ref('');
    const sortOption = ref('newest');
    
    // 모달 상태
    const showDetailModal = ref(false);
    const selectedCampaign = ref(null);
    
    // 대기 중인 캠페인 데이터 (API에서 가져올 예정)
    const waitingCampaigns = ref([
      {
        id: 1,
        title: '프리미엄 스킨케어 체험단',
        description: '신규 출시된 프리미엄 스킨케어 제품을 체험하고 솔직한 리뷰를 작성해주세요.',
        type: '배송형',
        target: 10,
        reward: '제품 증정 + 활동비 50,000원',
        requirements: '스킨케어 제품 리뷰 경험 있는 블로거 또는 인스타그래머',
        status: 'waiting', // 'waiting', 'rejected'
        createdAt: '2025-04-20T10:00:00',
        deadline: '2025-05-20',
        submissions: {
          required: ['블로그', '인스타그램'],
          optional: ['유튜브']
        },
        thumbnailBg: '#e8f7f6'
      },
      {
        id: 2,
        title: '신규 유기농 식품 체험단',
        description: '새롭게 출시된 유기농 식품을 체험하고 SNS에 솔직한 리뷰를 남겨주세요.',
        type: '배송형',
        target: 5,
        reward: '제품 증정 + 활동비 30,000원',
        requirements: '요리 또는 건강식품 관련 컨텐츠 제작 경험자 우대',
        status: 'rejected',
        feedback: '제공되는 리워드가 요구되는 활동 대비 충분하지 않습니다. 적절한 리워드를 재검토해 주시기 바랍니다.',
        createdAt: '2025-04-19T14:30:00',
        deadline: '2025-05-15',
        submissions: {
          required: ['블로그'],
          optional: ['인스타그램', '페이스북']
        },
        thumbnailBg: '#edf7ed'
      },
      {
        id: 3,
        title: '홈트레이닝 운동기구 체험단',
        description: '집에서 손쉽게 사용할 수 있는 홈트레이닝 기구를 체험하고 실제 사용 경험을 리뷰해주세요.',
        type: '배송형',
        target: 8,
        reward: '제품 증정 + 활동비 80,000원',
        requirements: '운동/피트니스 관련 컨텐츠 제작자',
        status: 'waiting',
        createdAt: '2025-04-18T09:15:00',
        deadline: '2025-05-18',
        submissions: {
          required: ['유튜브', '블로그'],
          optional: ['인스타그램']
        },
        thumbnailBg: '#e6f2ff'
      }
    ]);
    
    // 필터링된 캠페인 목록
    const filteredCampaigns = ref([]);
    
    // 초기 데이터 로드 및 필터링
    onMounted(() => {
      filterCampaigns();
    });
    
    // 상태 텍스트 반환
    const getStatusText = (status) => {
      switch (status) {
        case 'waiting':
          return '승인 대기';
        case 'rejected':
          return '승인 반려';
        default:
          return '대기중';
      }
    };
    
    // 캠페인 필터링
    const filterCampaigns = () => {
      let filtered = [...waitingCampaigns.value];
      
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
      }
    };
    
    // 날짜 포맷팅
    const formatDate = (dateString) => {
      if (!dateString) return '';
      
      const date = new Date(dateString);
      const now = new Date();
      
      // 날짜 간 차이 계산 (밀리초)
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        // 오늘
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `오늘 ${hours}:${minutes}`;
      } else if (diffDays === 1) {
        // 어제
        return '어제';
      } else if (diffDays < 7) {
        // 1주일 이내
        return `${diffDays}일 전`;
      } else {
        // 그 외
        return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
      }
    };
    
    // 간단한 날짜 포맷팅
    const formatSimpleDate = (dateString) => {
      if (!dateString) return '';
      
      // YYYY-MM-DD 형식인 경우
      if (dateString.includes('-')) {
        const parts = dateString.split('-');
        return `${parts[0]}.${parts[1]}.${parts[2]}`;
      }
      
      // 날짜 객체인 경우
      const date = new Date(dateString);
      return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
    };
    
    // 새 캠페인 만들기 페이지로 이동
    const navigateToCreate = () => {
      router.push('/partner/campaigns/create');
    };
    
    // 캠페인 상세 보기
    const viewCampaignDetail = (campaignId) => {
      selectedCampaign.value = waitingCampaigns.value.find(c => c.id === campaignId);
      if (selectedCampaign.value) {
        showDetailModal.value = true;
      }
    };
    
    // 상세 모달 닫기
    const closeDetailModal = () => {
      showDetailModal.value = false;
      selectedCampaign.value = null;
    };
    
    // 캠페인 재제출
    const resubmitCampaign = (campaignId) => {
      // 캠페인 수정 페이지로 이동
      router.push(`/partner/campaigns/edit/${campaignId}`);
    };
    
    return {
      searchQuery,
      sortOption,
      filteredCampaigns,
      showDetailModal,
      selectedCampaign,
      getStatusText,
      filterCampaigns,
      sortCampaigns,
      formatDate,
      formatSimpleDate,
      navigateToCreate,
      viewCampaignDetail,
      closeDetailModal,
      resubmitCampaign
    };
  }
};
</script>

<style scoped>
.waiting-approval-view {
  width: 100%;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #424242;
  margin: 0 0 8px;
}

.page-description {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 16px;
}

.header-actions {
  margin-top: 16px;
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

.filters-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
}

.campaign-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.campaign-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.campaign-card.has-feedback {
  border-left: 4px solid #f59e0b;
}

.campaign-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f1f5f9;
}

.campaign-thumbnail {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #229799;
  font-size: 20px;
}

.campaign-status {
  text-align: right;
}

.status-badge {
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 6px;
}

.status-badge.waiting {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.status-badge.rejected {
  background-color: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.create-date {
  font-size: 12px;
  color: #64748b;
}

.campaign-body {
  padding: 16px;
}

.campaign-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px;
}

.campaign-description {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 16px;
  line-height: 1.5;
}

.campaign-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #1e293b;
  font-size: 13px;
}

.meta-item svg {
  color: #64748b;
}

.feedback-section {
  background-color: #fffbeb;
  border-radius: 8px;
  padding: 12px;
  margin-top: 16px;
}

.feedback-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #f59e0b;
  margin-bottom: 8px;
}

.feedback-content {
  font-size: 13px;
  color: #1e293b;
  margin: 0;
  line-height: 1.5;
}

.campaign-footer {
  padding: 16px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline {
  background-color: white;
  color: #64748b;
  border: 1px solid #e5e7eb;
}

.btn-outline:hover {
  background-color: #f8fafc;
}

.btn-primary {
  background-color: #229799;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #1a7a7c;
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
  margin: 0 0 20px;
}

@media (max-width: 768px) {
  .filters-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .search-bar {
    max-width: 100%;
  }
  
  .campaign-footer {
    flex-direction: column;
    gap: 12px;
  }
  
  .btn, .action-buttons {
    width: 100%;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>
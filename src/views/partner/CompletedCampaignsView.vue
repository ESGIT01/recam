<!-- src/views/partner/CompletedCampaignsView.vue -->
<template>
    <div class="completed-campaigns-view">
      <div class="page-header">
        <h1 class="page-title">완료된 캠페인</h1>
        <div class="page-description">
          리뷰어 선정이 완료된 캠페인 목록입니다. 리뷰어 활동 상태를 확인하고 리뷰를 관리할 수 있습니다.
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
        <div class="filter-options">
          <div class="status-filter">
            <label for="status-select">상태:</label>
            <select id="status-select" v-model="statusFilter" @change="filterCampaigns">
              <option value="all">전체</option>
              <option value="active">진행 중</option>
              <option value="completed">활동 완료</option>
            </select>
          </div>
          <div class="sort-options">
            <label for="sort-select">정렬:</label>
            <select id="sort-select" v-model="sortOption" @change="sortCampaigns">
              <option value="newest">최신순</option>
              <option value="oldest">오래된순</option>
              <option value="reviewRate">리뷰 등록률</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- 완료된 캠페인 목록 -->
      <div v-if="filteredCampaigns.length > 0" class="campaigns-container">
        <div 
          v-for="campaign in filteredCampaigns" 
          :key="campaign.id" 
          class="campaign-card"
        >
          <div class="campaign-header">
            <div class="campaign-thumbnail" :style="{ backgroundColor: campaign.thumbnailBg }">
              {{ campaign.title.charAt(0) }}
            </div>
            <div class="campaign-status" :class="campaign.status">
              {{ getStatusText(campaign.status) }}
            </div>
          </div>
          
          <div class="campaign-body">
            <h3 class="campaign-title">{{ campaign.title }}</h3>
            
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
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>선정완료: {{ formatDate(campaign.selectedDate) }}</span>
              </div>
            </div>
            
            <!-- 리뷰 현황 -->
            <div class="review-status">
              <div class="review-header">
                <div class="review-title">리뷰 현황</div>
                <div class="review-count">{{ getCompletedReviewCount(campaign) }}/{{ campaign.selectedReviewers.length }}</div>
              </div>
              <div class="review-progress">
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: getProgressWidth(getCompletedReviewCount(campaign), campaign.selectedReviewers.length) }"
                    :class="{ 'full': getCompletedReviewCount(campaign) === campaign.selectedReviewers.length }"
                  ></div>
                </div>
              </div>
            </div>
            
            <!-- 리뷰어 목록 테이블 -->
            <div class="reviewers-table-container">
              <table class="reviewers-table">
                <thead>
                  <tr>
                    <th>리뷰어</th>
                    <th>채널</th>
                    <th>상태</th>
                    <th>액션</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(reviewer, index) in campaign.selectedReviewers" :key="index">
                    <td>
                      <div class="reviewer-profile">
                        <div class="reviewer-avatar">{{ reviewer.name.charAt(0) }}</div>
                        <span class="reviewer-name">{{ reviewer.name }}</span>
                      </div>
                    </td>
                    <td>{{ reviewer.channel }}</td>
                    <td>
                      <span class="review-status-badge" :class="reviewer.reviewStatus">
                        {{ getReviewStatusText(reviewer.reviewStatus) }}
                      </span>
                    </td>
                    <td>
                      <button 
                        v-if="reviewer.reviewStatus === 'completed'" 
                        class="view-review-btn"
                        @click="viewReview(campaign.id, reviewer.id)"
                      >
                        리뷰 보기
                      </button>
                      <button 
                        v-else-if="campaign.status === 'active'" 
                        class="remind-btn"
                        @click="sendReminder(campaign.id, reviewer.id)"
                      >
                        리마인드
                      </button>
                      <span v-else class="waiting-text">대기중</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="campaign-footer">
            <button class="btn btn-outline" @click="viewCampaignDetail(campaign.id)">
              상세보기
            </button>
            
            <div class="action-buttons">
              <button 
                v-if="isAllReviewCompleted(campaign)" 
                class="btn btn-primary" 
                @click="completeCampaign(campaign.id)"
              >
                캠페인 완료하기
              </button>
              <button 
                v-else 
                class="btn btn-secondary" 
                @click="viewReviewers(campaign.id)"
              >
                리뷰어 관리
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
        <p v-if="searchQuery || statusFilter !== 'all'">검색 결과가 없습니다. 다른 검색어나 필터를 사용해보세요.</p>
        <p v-else>완료된 캠페인이 없습니다.</p>
      </div>
      
      <!-- 캠페인 상세 모달 -->
      <campaign-detail-modal
        v-if="showDetailModal"
        :campaign="selectedCampaign"
        :is-completed="true"
        @close="closeDetailModal"
      />
      
      <!-- 리뷰 상세 모달 -->
      <review-detail-modal
        v-if="showReviewModal"
        :campaign="selectedCampaign"
        :reviewer="selectedReviewer"
        @close="closeReviewModal"
        @approve="approveReview"
        @reject="rejectReview"
      />
      
      <!-- 리뷰어 관리 모달 -->
      <reviewers-management-modal
        v-if="showReviewersModal"
        :campaign="selectedCampaign"
        @close="closeReviewersModal"
        @send-reminder="sendReminderToAll"
      />
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import CampaignDetailModal from '@/components/partner/activecampaigns/CampaignDetailModal.vue';
  import ReviewDetailModal from '@/components/partner/completedcampaigns/ReviewDetailModal.vue';
  import ReviewersManagementModal from '@/components/partner/completedcampaigns/ReviewersManagementModal.vue';
  
  export default {
    name: 'CompletedCampaignsView',
    components: {
      CampaignDetailModal,
      ReviewDetailModal,
      ReviewersManagementModal
    },
    setup() {
      const searchQuery = ref('');
      const statusFilter = ref('all'); // 'all', 'active', 'completed'
      const sortOption = ref('newest');
      
      // 모달 상태
      const showDetailModal = ref(false);
      const showReviewModal = ref(false);
      const showReviewersModal = ref(false);
      const selectedCampaign = ref(null);
      const selectedReviewer = ref(null);
      
      // 완료된 캠페인 데이터 (API에서 가져올 예정)
      const completedCampaigns = ref([
        {
          id: 1,
          title: '프리미엄 스킨케어 체험단',
          description: '신규 출시된 프리미엄 스킨케어 제품을 체험하고 솔직한 리뷰를 작성해주세요.',
          type: '배송형',
          status: 'active', // 'active', 'completed'
          selectedDate: '2025-04-25',
          completedDate: null,
          createdAt: '2025-04-10T10:00:00',
          thumbnailBg: '#e8f7f6',
          selectedReviewers: [
            { 
              id: 101, 
              name: '김리뷰', 
              channel: '블로그', 
              followers: '5.2K',
              reviewStatus: 'completed', // 'waiting', 'in_progress', 'completed'
              reviewUrl: 'https://example.com/review1',
              reviewDate: '2025-04-28'
            },
            { 
              id: 102, 
              name: '박인스타', 
              channel: '인스타그램', 
              followers: '12.5K',
              reviewStatus: 'completed',
              reviewUrl: 'https://example.com/review2',
              reviewDate: '2025-04-27'
            },
            { 
              id: 103, 
              name: '이유튜브', 
              channel: '유튜브', 
              followers: '8.7K',
              reviewStatus: 'in_progress',
              reviewUrl: null,
              reviewDate: null
            }
          ]
        },
        {
          id: 2,
          title: '비건 레스토랑 방문 체험단',
          description: '새롭게 오픈한 비건 레스토랑을 체험하고 SNS에 솔직한 리뷰를 남겨주세요.',
          type: '방문형',
          status: 'completed',
          selectedDate: '2025-04-15',
          completedDate: '2025-04-30',
          createdAt: '2025-04-01T14:30:00',
          thumbnailBg: '#e3f2fd',
          selectedReviewers: [
            { 
              id: 201, 
              name: '맛있는리뷰', 
              channel: '블로그', 
              followers: '8.3K',
              reviewStatus: 'completed',
              reviewUrl: 'https://example.com/review3',
              reviewDate: '2025-04-20'
            },
            { 
              id: 202, 
              name: '푸드스타그램', 
              channel: '인스타그램', 
              followers: '15.8K',
              reviewStatus: 'completed',
              reviewUrl: 'https://example.com/review4',
              reviewDate: '2025-04-22'
            },
            { 
              id: 203, 
              name: '맛집탐방러', 
              channel: '유튜브', 
              followers: '5.1K',
              reviewStatus: 'completed',
              reviewUrl: 'https://example.com/review5',
              reviewDate: '2025-04-21'
            }
          ]
        },
        {
          id: 3,
          title: '신규 유아용품 체험단',
          description: '출시된 유아용 장난감을 체험하고 육아 커뮤니티 및 블로그에 리뷰를 작성해주세요.',
          type: '배송형',
          status: 'active',
          selectedDate: '2025-04-22',
          completedDate: null,
          createdAt: '2025-04-05T09:15:00',
          thumbnailBg: '#fef3c7',
          selectedReviewers: [
            { 
              id: 301, 
              name: '육아맘', 
              channel: '블로그', 
              followers: '9.7K',
              reviewStatus: 'in_progress',
              reviewUrl: null,
              reviewDate: null
            },
            { 
              id: 302, 
              name: '아이랑놀자', 
              channel: '인스타그램', 
              followers: '7.2K',
              reviewStatus: 'waiting',
              reviewUrl: null,
              reviewDate: null
            }
          ]
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
          case 'active':
            return '진행 중';
          case 'completed':
            return '활동 완료';
          default:
            return '알 수 없음';
        }
      };
      
      // 리뷰 상태 텍스트 반환
      const getReviewStatusText = (status) => {
        switch (status) {
          case 'waiting':
            return '대기중';
          case 'in_progress':
            return '진행중';
          case 'completed':
            return '완료됨';
          default:
            return '알 수 없음';
        }
      };
      
      // 완료된 리뷰 수 계산
      const getCompletedReviewCount = (campaign) => {
        return campaign.selectedReviewers.filter(r => r.reviewStatus === 'completed').length;
      };
      
      // 모든 리뷰가 완료되었는지 확인
      const isAllReviewCompleted = (campaign) => {
        return getCompletedReviewCount(campaign) === campaign.selectedReviewers.length;
      };
      
      // 진행 바 너비 계산
      const getProgressWidth = (completed, total) => {
        const percentage = Math.min((completed / total) * 100, 100);
        return `${percentage}%`;
      };
      
      // 날짜 포맷팅
      const formatDate = (dateString) => {
        if (!dateString) return '';
        
        // yyyy-mm-dd 형식인 경우
        if (typeof dateString === 'string' && dateString.includes('-') && dateString.length === 10) {
          const parts = dateString.split('-');
          return `${parts[0]}.${parts[1]}.${parts[2]}`;
        }
        
        // 날짜 객체나 다른 형식의 경우
        const date = new Date(dateString);
        return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
      };
      
      // 캠페인 필터링
      const filterCampaigns = () => {
        let filtered = [...completedCampaigns.value];
        
        // 상태 필터 적용
        if (statusFilter.value !== 'all') {
          filtered = filtered.filter(campaign => campaign.status === statusFilter.value);
        }
        
        // 검색어 필터 적용
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
            // 최신순
            campaigns.sort((a, b) => new Date(b.selectedDate) - new Date(a.selectedDate));
            break;
          case 'oldest':
            // 오래된순
            campaigns.sort((a, b) => new Date(a.selectedDate) - new Date(b.selectedDate));
            break;
          case 'reviewRate':
            // 리뷰 등록률
            campaigns.sort((a, b) => {
              const rateA = getCompletedReviewCount(a) / a.selectedReviewers.length;
              const rateB = getCompletedReviewCount(b) / b.selectedReviewers.length;
              return rateB - rateA;  // 높은순
            });
            break;
        }
      };
      
      // 캠페인 상세 보기
      const viewCampaignDetail = (campaignId) => {
        selectedCampaign.value = completedCampaigns.value.find(c => c.id === campaignId);
        if (selectedCampaign.value) {
          showDetailModal.value = true;
        }
      };
      
      // 상세 모달 닫기
      const closeDetailModal = () => {
        showDetailModal.value = false;
        selectedCampaign.value = null;
      };
      
      // 리뷰 상세 보기
      const viewReview = (campaignId, reviewerId) => {
        selectedCampaign.value = completedCampaigns.value.find(c => c.id === campaignId);
        if (selectedCampaign.value) {
          selectedReviewer.value = selectedCampaign.value.selectedReviewers.find(r => r.id === reviewerId);
          if (selectedReviewer.value) {
            showReviewModal.value = true;
          }
        }
      };
      
      // 리뷰 모달 닫기
      const closeReviewModal = () => {
        showReviewModal.value = false;
        selectedReviewer.value = null;
      };
      
      // 리뷰 승인
      const approveReview = (reviewerId) => {
        console.log(`리뷰어 ID ${reviewerId}의 리뷰 승인`);
        // 실제 구현에서는 API 요청 처리
        
        closeReviewModal();
        // 리스트 업데이트
        filterCampaigns();
      };
      
      // 리뷰 반려
      const rejectReview = (reviewerId, reason) => {
        console.log(`리뷰어 ID ${reviewerId}의 리뷰 반려. 사유: ${reason}`);
        // 실제 구현에서는 API 요청 처리
        
        closeReviewModal();
        // 리스트 업데이트
        filterCampaigns();
      };
      
      // 리마인드 발송
      const sendReminder = (campaignId, reviewerId) => {
        console.log(`캠페인 ID ${campaignId}, 리뷰어 ID ${reviewerId}에게 리마인드 발송`);
        // 실제 구현에서는 API 요청 처리
        
        alert('리마인드가 발송되었습니다.');
      };
      
      // 리뷰어 관리 모달 열기
      const viewReviewers = (campaignId) => {
        selectedCampaign.value = completedCampaigns.value.find(c => c.id === campaignId);
        if (selectedCampaign.value) {
          showReviewersModal.value = true;
        }
      };
      
      // 리뷰어 관리 모달 닫기
      const closeReviewersModal = () => {
        showReviewersModal.value = false;
      };
      
      // 모든 리뷰어에게 리마인드 발송
      const sendReminderToAll = (campaignId, reviewerIds) => {
        console.log(`캠페인 ID ${campaignId}의 선택된 리뷰어들에게 리마인드 발송:`, reviewerIds);
        // 실제 구현에서는 API 요청 처리
        
        alert('선택한 리뷰어들에게 리마인드가 발송되었습니다.');
        closeReviewersModal();
      };
      
      // 캠페인 완료 처리
      const completeCampaign = (campaignId) => {
        console.log(`캠페인 ID ${campaignId} 완료 처리`);
        // 실제 구현에서는 API 요청 처리
        
        // 상태 업데이트
        const campaign = completedCampaigns.value.find(c => c.id === campaignId);
        if (campaign) {
          campaign.status = 'completed';
          campaign.completedDate = new Date().toISOString().substring(0, 10); // yyyy-mm-dd
        }
        
        alert('캠페인이 완료 처리되었습니다.');
        filterCampaigns();
      };
      
      return {
        searchQuery,
        statusFilter,
        sortOption,
        filteredCampaigns,
        showDetailModal,
        showReviewModal,
        showReviewersModal,
        selectedCampaign,
        selectedReviewer,
        getStatusText,
        getReviewStatusText,
        getCompletedReviewCount,
        isAllReviewCompleted,
        getProgressWidth,
        formatDate,
        filterCampaigns,
        sortCampaigns,
        viewCampaignDetail,
        closeDetailModal,
        viewReview,
        closeReviewModal,
        approveReview,
        rejectReview,
        sendReminder,
        viewReviewers,
        closeReviewersModal,
        sendReminderToAll,
        completeCampaign
      };
    }
  };
  </script>
  
  <style scoped>
  .completed-campaigns-view {
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
    margin: 0;
  }
  
  .filters-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 24px 0;
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
  
  .filter-options {
    display: flex;
    gap: 16px;
  }
  
  .status-filter, .sort-options {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .status-filter label, .sort-options label {
    font-size: 14px;
    color: #64748b;
  }
  
  .status-filter select, .sort-options select {
    padding: 8px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.2s;
  }
  
  .status-filter select:focus, .sort-options select:focus {
    outline: none;
    border-color: #229799;
  }
  
  .campaigns-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
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
    font-size: 14px;
    font-weight: 500;
    padding: 4px 12px;
    border-radius: 20px;
  }
  
  .campaign-status.active {
    background-color: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
  }
  
  .campaign-status.completed {
    background-color: rgba(16, 185, 129, 0.1);
    color: #10b981;
  }
  
  .campaign-body {
    padding: 16px;
  }
  
  .campaign-title {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 16px;
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
  
  .review-status {
    background-color: #f8fafc;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 16px;
  }
  
  .review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.review-title {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

.review-count {
  font-size: 14px;
  color: #64748b;
}

.review-progress {
  width: 100%;
}

.progress-bar {
  height: 6px;
  background-color: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #48CFCB;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-fill.full {
  background-color: #229799;
}

.reviewers-table-container {
  margin-top: 16px;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  overflow: hidden;
}

.reviewers-table {
  width: 100%;
  border-collapse: collapse;
}

.reviewers-table th, .reviewers-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #f1f5f9;
}

.reviewers-table th {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  background-color: #f8fafc;
}

.reviewers-table tr:last-child td {
  border-bottom: none;
}

.reviewer-profile {
  display: flex;
  align-items: center;
  gap: 8px;
}

.reviewer-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #229799;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.reviewer-name {
  font-weight: 500;
  color: #1e293b;
}

.review-status-badge {
  font-size: 12px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 12px;
}

.review-status-badge.waiting {
  background-color: #f1f5f9;
  color: #64748b;
}

.review-status-badge.in_progress {
  background-color: rgba(234, 179, 8, 0.1);
  color: #eab308;
}

.review-status-badge.completed {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.view-review-btn {
  background: none;
  border: none;
  color: #229799;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s;
}

.view-review-btn:hover {
  color: #1a7a7c;
  text-decoration: underline;
}

.remind-btn {
  background: none;
  border: none;
  color: #f59e0b;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s;
}

.remind-btn:hover {
  color: #d97706;
  text-decoration: underline;
}

.waiting-text {
  font-size: 13px;
  color: #94a3b8;
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

.btn-secondary {
  background-color: white;
  color: #229799;
  border: 1px solid #229799;
}

.btn-secondary:hover {
  background-color: rgba(34, 151, 153, 0.05);
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
  .filters-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .search-bar {
    max-width: 100%;
  }
  
  .filter-options {
    width: 100%;
    flex-wrap: wrap;
  }
  
  .reviewers-table th:nth-child(2), .reviewers-table td:nth-child(2) {
    display: none;
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
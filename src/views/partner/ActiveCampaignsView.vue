<!-- src/views/partner/campaigns/ActiveCampaignsView.vue -->
<template>
    <div class="active-campaigns-view">
      <div class="page-header">
        <h1 class="page-title">모집 중 캠페인</h1>
        <div class="page-description">
          현재 리뷰어를 모집 중인 캠페인 목록입니다. 지원자 현황을 확인하고 리뷰어를 선정할 수 있습니다.
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
        <div class="filter-options">
          <div class="sort-options">
            <label for="sort-select">정렬:</label>
            <select id="sort-select" v-model="sortOption" @change="sortCampaigns">
              <option value="deadline">마감 임박순</option>
              <option value="applicants">지원자 많은순</option>
              <option value="newest">최신순</option>
              <option value="oldest">오래된순</option>
            </select>
          </div>
        </div>
      </div>
      
      <!-- 모집 중인 캠페인 목록 -->
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
            <div class="campaign-deadline" :class="{ 'urgent': isUrgent(campaign) }">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>{{ getDeadlineText(campaign) }}</span>
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
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                  <line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
                <span>{{ campaign.reward }}</span>
              </div>
            </div>
            
            <!-- 지원자 현황 -->
            <div class="applicants-status">
              <div class="applicants-header">
                <div class="applicants-title">지원자 현황</div>
                <div class="applicants-count">{{ campaign.applicants.length }}명 / {{ campaign.target }}명</div>
              </div>
              <div class="applicants-progress">
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: getProgressWidth(campaign.applicants.length, campaign.target) }"
                    :class="{ 'full': campaign.applicants.length >= campaign.target }"
                  ></div>
                </div>
              </div>
            </div>
            
            <!-- 지원자 미니 프로필 목록 -->
            <div v-if="campaign.applicants.length > 0" class="applicants-list">
              <div class="applicants-preview">
                <div 
                  v-for="(applicant, index) in getTopApplicants(campaign.applicants, 3)" 
                  :key="index" 
                  class="applicant-avatar"
                  :title="applicant.name"
                >
                  {{ applicant.name.charAt(0) }}
                </div>
                <div 
                  v-if="campaign.applicants.length > 3" 
                  class="more-applicants"
                >
                  +{{ campaign.applicants.length - 3 }}
                </div>
              </div>
              <button 
                class="view-applicants-btn" 
                @click="viewApplicants(campaign.id)"
              >
                지원자 관리하기
              </button>
            </div>
            
            <!-- 지원자가 없는 경우 -->
            <div v-else class="no-applicants">
              <p>아직 지원자가 없습니다.</p>
            </div>
          </div>
          
          <div class="campaign-footer">
            <button class="btn btn-outline" @click="viewCampaignDetail(campaign.id)">
              상세보기
            </button>
            
            <div class="action-buttons">
              <button 
                v-if="campaign.daysLeft <= 0 && campaign.applicants.length > 0" 
                class="btn btn-primary" 
                @click="selectReviewers(campaign.id)"
              >
                리뷰어 선정하기
              </button>
              <button 
                v-else-if="campaign.daysLeft > 0" 
                class="btn btn-secondary" 
                @click="editCampaign(campaign.id)"
              >
                수정하기
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
        <p v-else>모집 중인 캠페인이 없습니다.</p>
        <button class="btn btn-primary" @click="navigateToCreate">새 캠페인 등록하기</button>
      </div>
      
      <!-- 캠페인 상세 모달 -->
      <campaign-detail-modal
        v-if="showDetailModal"
        :campaign="selectedCampaign"
        :is-active="true"
        @close="closeDetailModal"
      />
      
      <!-- 지원자 관리 모달 -->
      <applicants-modal
        v-if="showApplicantsModal"
        :campaign="selectedCampaign"
        @close="closeApplicantsModal"
        @select-reviewers="goToSelectReviewers"
      />
      
      <!-- 리뷰어 선정 모달 -->
      <select-reviewers-modal
        v-if="showSelectModal"
        :campaign="selectedCampaign"
        @close="closeSelectModal"
        @confirm-selection="confirmReviewerSelection"
      />
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import CampaignDetailModal from '@/components/partner/activecampaigns/CampaignDetailModal.vue';
  import ApplicantsModal from '@/components/partner/activecampaigns/ApplicantsModal.vue';
  import SelectReviewersModal from '@/components/partner/activecampaigns/SelectReviewersModal.vue';
  
  export default {
    name: 'ActiveCampaignsView',
    components: {
      CampaignDetailModal,
      ApplicantsModal,
      SelectReviewersModal
    },
    setup() {
      const router = useRouter();
      const searchQuery = ref('');
      const sortOption = ref('deadline');
      
      // 모달 상태
      const showDetailModal = ref(false);
      const showApplicantsModal = ref(false);
      const showSelectModal = ref(false);
      const selectedCampaign = ref(null);
      
      // 모집 중인 캠페인 데이터 (API에서 가져올 예정)
      const activeCampaigns = ref([
        {
          id: 1,
          title: '프리미엄 스킨케어 체험단',
          description: '신규 출시된 프리미엄 스킨케어 제품을 체험하고 솔직한 리뷰를 작성해주세요.',
          type: '배송형',
          target: 10,
          reward: '제품 증정 + 활동비 50,000원',
          requirements: '스킨케어 제품 리뷰 경험 있는 블로거 또는 인스타그래머',
          daysLeft: 5,
          deadline: '2025-05-05',
          createdAt: '2025-04-10T10:00:00',
          thumbnailBg: '#e8f7f6',
          applicants: [
            { id: 101, name: '김리뷰', channel: '블로그', followers: '5.2K' },
            { id: 102, name: '박인스타', channel: '인스타그램', followers: '12.5K' },
            { id: 103, name: '이유튜브', channel: '유튜브', followers: '8.7K' },
            { id: 104, name: '최블로그', channel: '블로그', followers: '7.3K' }
          ],
          submissions: {
            required: ['블로그', '인스타그램'],
            optional: ['유튜브']
          }
        },
        {
          id: 2,
          title: '비건 레스토랑 방문 체험단',
          description: '새롭게 오픈한 비건 레스토랑을 체험하고 SNS에 솔직한 리뷰를 남겨주세요.',
          type: '방문형',
          target: 5,
          reward: '식사권 + 활동비 30,000원',
          requirements: '요리 또는 식당 리뷰 경험 있는 인플루언서',
          daysLeft: 0, // 마감됨
          deadline: '2025-04-29',
          createdAt: '2025-04-15T14:30:00',
          thumbnailBg: '#e3f2fd',
          applicants: [
            { id: 201, name: '맛있는리뷰', channel: '블로그', followers: '8.3K' },
            { id: 202, name: '푸드스타그램', channel: '인스타그램', followers: '15.8K' },
            { id: 203, name: '맛집탐방러', channel: '유튜브', followers: '5.1K' }
          ],
          submissions: {
            required: ['블로그'],
            optional: ['인스타그램', '유튜브']
          }
        },
        {
          id: 3,
          title: '신규 유아용품 체험단',
          description: '출시된 유아용 장난감을 체험하고 육아 커뮤니티 및 블로그에 리뷰를 작성해주세요.',
          type: '배송형',
          target: 8,
          reward: '제품 증정 + 활동비 40,000원',
          requirements: '육아 관련 컨텐츠 제작 경험 있는 30~40대 인플루언서',
          daysLeft: 7,
          deadline: '2025-05-07',
          createdAt: '2025-04-20T09:15:00',
          thumbnailBg: '#fef3c7',
          applicants: [
            { id: 301, name: '육아맘', channel: '블로그', followers: '9.7K' }
          ],
          submissions: {
            required: ['블로그'],
            optional: ['인스타그램']
          }
        },
        {
          id: 4,
          title: '홈케어 전자제품 체험단',
          description: '스마트 홈 케어 제품을 체험하고 다양한 기능을 테스트한 후 상세 리뷰를 작성해주세요.',
          type: '배송형',
          target: 6,
          reward: '제품 증정 + 활동비 60,000원',
          requirements: '가전/IT 리뷰 경험이 있는 인플루언서',
          daysLeft: 3,
          deadline: '2025-05-03',
          createdAt: '2025-04-18T16:45:00',
          thumbnailBg: '#f1f5f9',
          applicants: [
            { id: 401, name: '테크리뷰', channel: '유튜브', followers: '10.2K' },
            { id: 402, name: '스마트홈', channel: '블로그', followers: '6.8K' },
            { id: 403, name: '가전매니아', channel: '인스타그램', followers: '7.5K' },
            { id: 404, name: 'IT블로거', channel: '블로그', followers: '12.1K' },
            { id: 405, name: '홈스타일러', channel: '인스타그램', followers: '9.3K' }
          ],
          submissions: {
            required: ['블로그', '유튜브'],
            optional: ['인스타그램']
          }
        }
      ]);
      
      // 필터링된 캠페인 목록
      const filteredCampaigns = ref([]);
      
      // 초기 데이터 로드 및 필터링
      onMounted(() => {
        filterCampaigns();
      });
      
      // 마감 임박 여부 확인
      const isUrgent = (campaign) => {
        return campaign.daysLeft <= 3 && campaign.daysLeft > 0;
      };
      
      // 마감일 텍스트 반환
      const getDeadlineText = (campaign) => {
        if (campaign.daysLeft <= 0) {
          return '마감됨';
        } else if (campaign.daysLeft === 1) {
          return '오늘 마감';
        } else {
          return `${campaign.daysLeft}일 남음`;
        }
      };
      
      // 진행 바 너비 계산
      const getProgressWidth = (applicants, target) => {
        const percentage = Math.min((applicants / target) * 100, 100);
        return `${percentage}%`;
      };
      
      // 상위 N명의 지원자 반환
      const getTopApplicants = (applicants, count) => {
        return applicants.slice(0, count);
      };
      
      // 캠페인 필터링
      const filterCampaigns = () => {
        let filtered = [...activeCampaigns.value];
        
        // 검색어 필터
        if (searchQuery.value) {
          const query = searchQuery.value.toLowerCase();
          filtered = filtered.filter(campaign => 
            campaign.title.toLowerCase().includes(query) || 
            campaign.description.toLowerCase().includes(query) ||
            campaign.type.toLowerCase().includes(query) ||
            campaign.reward.toLowerCase().includes(query)
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
          case 'deadline':
            // 마감일 순으로 정렬 (이미 마감된 캠페인은 맨 뒤로)
            campaigns.sort((a, b) => {
              if (a.daysLeft <= 0 && b.daysLeft > 0) return 1;
              if (a.daysLeft > 0 && b.daysLeft <= 0) return -1;
              return a.daysLeft - b.daysLeft;
            });
            break;
          case 'applicants':
            // 지원자 많은 순
            campaigns.sort((a, b) => b.applicants.length - a.applicants.length);
            break;
          case 'newest':
            // 최신순
            campaigns.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
          case 'oldest':
            // 오래된순
            campaigns.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
        }
      };
      
      // 새 캠페인 만들기 페이지로 이동
      const navigateToCreate = () => {
        router.push('/partner/campaigns/create');
      };
      
      // 캠페인 상세 보기
      const viewCampaignDetail = (campaignId) => {
        selectedCampaign.value = activeCampaigns.value.find(c => c.id === campaignId);
        if (selectedCampaign.value) {
          showDetailModal.value = true;
        }
      };
      
      // 상세 모달 닫기
      const closeDetailModal = () => {
        showDetailModal.value = false;
        selectedCampaign.value = null;
      };
      
      // 지원자 관리 모달 열기
      const viewApplicants = (campaignId) => {
        selectedCampaign.value = activeCampaigns.value.find(c => c.id === campaignId);
        if (selectedCampaign.value) {
          showApplicantsModal.value = true;
        }
      };
      
      // 지원자 관리 모달 닫기
      const closeApplicantsModal = () => {
        showApplicantsModal.value = false;
      };
      
      // 캠페인 수정 페이지로 이동
      const editCampaign = (campaignId) => {
        router.push(`/partner/campaigns/edit/${campaignId}`);
      };
      
      // 리뷰어 선정 모달 열기
      const selectReviewers = (campaignId) => {
        selectedCampaign.value = activeCampaigns.value.find(c => c.id === campaignId);
        if (selectedCampaign.value) {
          showSelectModal.value = true;
        }
      };
      
      // 지원자 관리에서 리뷰어 선정으로 이동
      const goToSelectReviewers = () => {
        showApplicantsModal.value = false;
        showSelectModal.value = true;
      };
      
      // 리뷰어 선정 모달 닫기
      const closeSelectModal = () => {
        showSelectModal.value = false;
      };
      
      // 리뷰어 선정 확정
      const confirmReviewerSelection = (campaignId, selectedReviewers) => {
        console.log(`캠페인 ID ${campaignId}의 리뷰어 선정 완료:`, selectedReviewers);
        
        // 실제 구현에서는 API 요청으로 선정된 리뷰어 정보를 서버에 전송
        alert('리뷰어 선정이 완료되었습니다.');
        
        // 모달 닫기
        closeSelectModal();
        
        // 선정 완료 후 완료된 캠페인 페이지로 이동할 수 있음
        // router.push('/partner/campaigns/completed');
      };
      
      return {
        searchQuery,
        sortOption,
        filteredCampaigns,
        showDetailModal,
        showApplicantsModal,
        showSelectModal,
        selectedCampaign,
        isUrgent,
        getDeadlineText,
        getProgressWidth,
        getTopApplicants,
        filterCampaigns,
        sortCampaigns,
        navigateToCreate,
        viewCampaignDetail,
        closeDetailModal,
        viewApplicants,
        closeApplicantsModal,
        editCampaign,
        selectReviewers,
        goToSelectReviewers,
        closeSelectModal,
        confirmReviewerSelection
      };
    }
  };
  </script>
  
  <style scoped>
  .active-campaigns-view {
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
  
  .filter-options {
    display: flex;
    gap: 16px;
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
    display: grid;
    grid-template-columns: repeat(1, 1fr);
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
  
  .campaign-deadline {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 500;
    color: #64748b;
  }
  
  .campaign-deadline.urgent {
    color: #ef4444;
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
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
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
  
  .applicants-status {
    background-color: #f8fafc;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 16px;
  }
  
  .applicants-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  
  .applicants-title {
    font-size: 14px;
    font-weight: 500;
    color: #1e293b;
  }
  
  .applicants-count {
    font-size: 14px;
    color: #64748b;
  }
  
  .applicants-progress {
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

.applicants-list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.applicants-preview {
  display: flex;
  align-items: center;
}

.applicant-avatar {
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
  margin-right: -8px;
  border: 2px solid white;
}

.more-applicants {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #f1f5f9;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  margin-left: 4px;
  border: 2px solid white;
}

.view-applicants-btn {
  background: none;
  border: none;
  color: #229799;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s;
}

.view-applicants-btn:hover {
  color: #1a7a7c;
  text-decoration: underline;
}

.no-applicants {
  background-color: #f8fafc;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  color: #64748b;
  font-size: 14px;
  margin-top: 16px;
}

.no-applicants p {
  margin: 0;
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
  margin: 0 0 20px;
}

@media (min-width: 768px) {
  .campaigns-container {
    grid-template-columns: repeat(2, 1fr);
  }
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
  
  .applicants-list {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .view-applicants-btn {
    align-self: flex-end;
  }
}
</style>
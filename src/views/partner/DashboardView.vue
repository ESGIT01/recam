<!-- src/views/partner/Dashboard.vue -->
<template>
  <div class="dashboard">
    <!-- 통계 카드 섹션 -->
    <statistics-section :statistics="statistics" :current-month="currentMonth" />
    
    <!-- 캠페인 및 리뷰어 섹션 -->
    <div class="content-grid">
      <!-- 전체 캠페인 -->
      <campaign-table 
        :campaigns="allCampaigns" 
        @select-reviewers="selectReviewers" 
      />
      
      <!-- 선정된 리뷰어 현황 -->
      <reviewer-list 
        :reviewers="selectedReviewers" 
        @approve="approveReview" 
        @reject="showRejectDialog" 
      />
    </div>
    
    <!-- 파트너센터 공지사항 -->
    <notice-list :notices="partnerNotices" />
    
    <!-- 반려 사유 모달 -->
    <reject-modal 
      v-if="showRejectModal" 
      :review-id="currentReviewId"
      v-model:reason="rejectReason"
      @close="closeRejectModal"
      @confirm="rejectReview"
    />
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import StatisticsSection from '@/components/partner/dashboard/StatisticsSection.vue';
import CampaignTable from '@/components/partner/dashboard/CampaignTable.vue';
import ReviewerList from '@/components/partner/dashboard/ReviewerList.vue';
import NoticeList from '@/components/partner/dashboard/NoticeList.vue';
import RejectModal from '@/components/partner/common/RejectModal.vue';

export default {
  name: 'PartnerDashboard',
  components: {
    StatisticsSection,
    CampaignTable,
    ReviewerList,
    NoticeList,
    RejectModal
  },
  
  setup() {
    // 현재 월 표시
    const currentDate = new Date();
    const currentMonth = computed(() => {
      return `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`;
    });
    
    // 통계 데이터 (6개로 수정 및 증가/감소 표시 제거)
    const statistics = ref([
      {
        label: '전체 캠페인',
        value: '16',
        icon: 'campaign',
        color: '#229799',
        bgColor: 'rgba(34, 151, 153, 0.1)'
      },
      {
        label: '승인 전 캠페인',
        value: '2',
        icon: 'pending',
        color: '#f59e0b',
        bgColor: 'rgba(245, 158, 11, 0.1)'
      },
      {
        label: '선정 대기 캠페인',
        value: '3',
        icon: 'waiting',
        color: '#8b5cf6',
        bgColor: 'rgba(139, 92, 246, 0.1)'
      },
      {
        label: '모집 중 캠페인',
        value: '5',
        icon: 'active',
        color: '#3b82f6',
        bgColor: 'rgba(59, 130, 246, 0.1)'
      },
      {
        label: '완료된 캠페인',
        value: '6',
        icon: 'completed',
        color: '#10b981',
        bgColor: 'rgba(16, 185, 129, 0.1)'
      },
      {
        label: '등록된 리뷰',
        value: '48',
        icon: 'reviews',
        color: '#ec4899',
        bgColor: 'rgba(236, 72, 153, 0.1)'
      }
    ]);
    
    // 전체 캠페인 데이터
    const allCampaigns = ref([
      {
        id: 1,
        title: '프리미엄 스킨케어 체험단',
        type: '배송형',
        target: 10,
        applications: 24,
        daysLeft: 5,
        expired: false,
        approvalStatus: 'approved',
        approvalStatusText: '승인됨',
        imageBg: '#e8f7f6'
      },
      {
        id: 2,
        title: '비건 레스토랑 방문 체험단',
        type: '방문형',
        target: 5,
        applications: 12,
        daysLeft: 0,
        expired: true,
        approvalStatus: 'approved',
        approvalStatusText: '승인됨',
        imageBg: '#e3f2fd'
      },
      {
        id: 3,
        title: '신규 유아용품 체험단',
        type: '배송형',
        target: 8,
        applications: 8,
        daysLeft: 7,
        expired: false,
        approvalStatus: 'waiting',
        approvalStatusText: '승인대기',
        imageBg: '#fef3c7'
      },
      {
        id: 4,
        title: '웰니스 건강식품 체험단',
        type: '배송형',
        target: 15,
        applications: 18,
        daysLeft: 0,
        expired: true,
        approvalStatus: 'approved',
        approvalStatusText: '승인됨',
        imageBg: '#dcfce7'
      },
      {
        id: 5,
        title: '홈케어 전자제품 체험단',
        type: '배송형',
        target: 6,
        applications: 12,
        daysLeft: 3,
        expired: false,
        approvalStatus: 'approved',
        approvalStatusText: '승인됨',
        imageBg: '#f1f5f9'
      }
    ]);
    
    // 선정된 리뷰어 현황
    const selectedReviewers = ref([
      {
        id: 1,
        campaign: '프리미엄 스킨케어 체험단',
        time: '오늘 14:32',
        status: 'pending'
      },
      {
        id: 2,
        campaign: '비건 레스토랑 방문 체험단',
        time: '오늘 11:15',
        status: 'pending'
      },
      {
        id: 3,
        campaign: '웰니스 건강식품 체험단',
        time: '어제 16:25',
        status: 'pending'
      },
      {
        id: 4,
        campaign: '홈케어 전자제품 체험단',
        time: '어제 12:42',
        status: 'pending'
      }
    ]);
    
    // 파트너센터 공지사항
    const partnerNotices = ref([
      {
        id: 1,
        title: '2025년 5월 캠페인 마감 및 정산 안내',
        date: '2025.04.28'
      },
      {
        id: 2,
        title: '파트너센터 업데이트 안내: 리뷰어 자동 선정 기능 추가',
        date: '2025.04.25'
      },
      {
        id: 3,
        title: '신규 카테고리 추가 및 리워드 정책 변경 안내',
        date: '2025.04.22'
      },
      {
        id: 4,
        title: '리뷰캠퍼스 파트너데이 행사 초대 안내',
        date: '2025.04.15'
      },
      {
        id: 5,
        title: '서비스 이용약관 개정 안내 (2025년 5월 1일 시행)',
        date: '2025.04.10'
      }
    ]);
    
    // 반려 모달 관련 상태
    const showRejectModal = ref(false);
    const rejectReason = ref('');
    const currentReviewId = ref(null);
    
    // 리뷰어 선정 함수
    const selectReviewers = (campaignId) => {
      console.log(`캠페인 ID ${campaignId}의 리뷰어 선정 모달 열기`);
      // 실제 구현에서는 리뷰어 선정 모달을 열거나 페이지로 이동
    };
    
    // 리뷰 승인 함수
    const approveReview = (reviewId) => {
      console.log(`리뷰 ID ${reviewId} 승인 처리`);
      // 실제 구현에서는 API 요청 처리
    };
    
    // 반려 다이얼로그 표시
    const showRejectDialog = (reviewId) => {
      currentReviewId.value = reviewId;
      showRejectModal.value = true;
    };
    
    // 반려 다이얼로그 닫기
    const closeRejectModal = () => {
      showRejectModal.value = false;
      rejectReason.value = '';
      currentReviewId.value = null;
    };
    
    // 리뷰 반려 처리
    const rejectReview = () => {
      if (rejectReason.value.trim() === '') {
        alert('반려 사유를 입력해주세요.');
        return;
      }
      
      console.log(`리뷰 ID ${currentReviewId.value} 반려 처리. 사유: ${rejectReason.value}`);
      // 실제 구현에서는 API 요청 처리
      closeRejectModal();
    };
    
    return {
      currentMonth,
      statistics,
      allCampaigns,
      selectedReviewers,
      partnerNotices,
      selectReviewers,
      approveReview,
      showRejectDialog,
      closeRejectModal,
      rejectReview,
      showRejectModal,
      rejectReason,
      currentReviewId
    };
  }
};
</script>

<style scoped>
/* 전역 스타일 */
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

.dashboard {
  width: 100%;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

/* 컨텐츠 그리드 */
.content-grid {
  display: grid;
  grid-template-columns: 60% 40%;
  gap: 20px;
  margin-bottom: 24px;
}

/* 반응형 스타일 */
@media (max-width: 1280px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
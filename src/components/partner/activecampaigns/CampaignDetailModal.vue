<!-- src/components/partner/campaigns/CampaignDetailModal.vue -->
<template>
    <div class="modal-overlay" @click="closeModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">캠페인 상세</h3>
          <button class="close-btn" @click="closeModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="campaign-status-bar">
            <div class="status-info">
              <span class="status-badge" :class="campaign.status">
                {{ getStatusText(campaign.status) }}
              </span>
              <span class="status-date">{{ formatDate(campaign.createdAt) }} 등록</span>
            </div>
          </div>
          
          <div class="campaign-header">
            <div class="campaign-thumbnail" :style="{ backgroundColor: campaign.thumbnailBg }">
              {{ campaign.title.charAt(0) }}
            </div>
            <div class="campaign-title-info">
              <h2 class="campaign-title">{{ campaign.title }}</h2>
              <div class="campaign-meta">
                <div class="meta-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>{{ campaign.type }}</span>
                </div>
                <div class="meta-separator">•</div>
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
          
          <div class="campaign-details">
            <div class="detail-section">
              <h4 class="section-title">캠페인 설명</h4>
              <p class="section-content">{{ campaign.description }}</p>
            </div>
            
            <div class="detail-section">
              <h4 class="section-title">모집 정보</h4>
              <div class="detail-row">
                <div class="detail-label">모집 인원</div>
                <div class="detail-value">{{ campaign.target }}명</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">리워드</div>
                <div class="detail-value">{{ campaign.reward }}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">참여 조건</div>
                <div class="detail-value">{{ campaign.requirements }}</div>
              </div>
            </div>
            
            <div class="detail-section">
              <h4 class="section-title">제출물 정보</h4>
              <div class="submission-info">
                <div class="submission-group">
                  <div class="submission-label">필수 제출물</div>
                  <div class="submission-platforms">
                    <span 
                      v-for="(platform, index) in campaign.submissions.required" 
                      :key="`required-${index}`" 
                      class="platform-chip required"
                    >
                      {{ platform }}
                    </span>
                  </div>
                </div>
                
                <div v-if="campaign.submissions.optional && campaign.submissions.optional.length > 0" class="submission-group">
                  <div class="submission-label">선택 제출물</div>
                  <div class="submission-platforms">
                    <span 
                      v-for="(platform, index) in campaign.submissions.optional" 
                      :key="`optional-${index}`" 
                      class="platform-chip optional"
                    >
                      {{ platform }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="detail-section">
              <h4 class="section-title">검토 및 승인 정보</h4>
              <p class="review-info">
                캠페인은 등록 후 영업일 기준 최대 2일 이내에 검토 후 승인됩니다. 
                승인된 캠페인은 즉시 리뷰어들에게 공개되어 지원을 받을 수 있습니다.
                캠페인이 반려된 경우, 반려 사유를 확인하고 수정 후 재등록이 가능합니다.
              </p>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-outline" @click="closeModal">닫기</button>
          
          <div v-if="campaign.status === 'rejected'" class="action-buttons">
            <button class="btn btn-primary" @click="resubmitCampaign">
              수정 후 재제출
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default defineComponent({
    name: 'CampaignDetailModal',
    props: {
      campaign: {
        type: Object,
        required: true
      }
    },
    emits: ['close'],
    setup(props, { emit }) {
      const router = useRouter();
      
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
      
      // 날짜 포맷팅
      const formatDate = (dateString) => {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
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
      
      // 모달 닫기
      const closeModal = () => {
        emit('close');
      };
      
      // 캠페인 재제출
      const resubmitCampaign = () => {
        // 캠페인 수정 페이지로 이동
        router.push(`/partner/campaigns/edit/${props.campaign.id}`);
        closeModal();
      };
      
      return {
        getStatusText,
        formatDate,
        formatSimpleDate,
        closeModal,
        resubmitCampaign
      };
    }
  });
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-container {
    background-color: white;
    border-radius: 12px;
    width: 95%;
    max-width: 700px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .modal-title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
  }
  
  .close-btn {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    transition: color 0.2s;
  }
  
  .close-btn:hover {
    color: #1e293b;
  }
  
  .modal-body {
    padding: 0;
    flex: 1;
    overflow-y: auto;
  }
  
  .campaign-status-bar {
    padding: 12px 20px;
    background-color: #f8fafc;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .status-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .status-badge {
    display: inline-flex;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
  }
  
  .status-badge.waiting {
    background-color: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
  }
  
  .status-badge.rejected {
    background-color: rgba(245, 158, 11, 0.1);
    color: #f59e0b;
  }
  
  .status-date {
    font-size: 12px;
    color: #64748b;
  }
  
  .campaign-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
  }
  
  .campaign-thumbnail {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: #229799;
    font-size: 24px;
  }
  
  .campaign-title-info {
    flex: 1;
  }
  
  .campaign-title {
    font-size: 20px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 8px;
  }
  
  .campaign-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
  }
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #64748b;
    font-size: 13px;
  }
  
  .meta-item svg {
    color: #94a3b8;
  }
  
  .meta-separator {
    color: #cbd5e1;
    font-size: 13px;
  }
  
  .feedback-section {
    margin: 0 20px;
    background-color: #fffbeb;
    border-radius: 8px;
    padding: 16px;
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
    font-size: 14px;
    color: #1e293b;
    margin: 0;
    line-height: 1.6;
  }
  
  .campaign-details {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }
  
  .detail-section {
    background-color: #f8fafc;
    border-radius: 10px;
    padding: 16px;
  }
  
  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 12px;
  }
  
  .section-content {
    font-size: 14px;
    color: #1e293b;
    margin: 0;
    line-height: 1.6;
  }
  
  .detail-row {
    display: flex;
    align-items: flex-start;
    margin-bottom: 10px;
  }
  
  .detail-row:last-child {
    margin-bottom: 0;
  }
  
  .detail-label {
    width: 100px;
    flex-shrink: 0;
    font-size: 14px;
    font-weight: 500;
    color: #1e293b;
  }
  
  .detail-value {
    flex: 1;
    font-size: 14px;
    color: #1e293b;
  }
  
  .submission-info {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .submission-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .submission-label {
    font-size: 14px;
    font-weight: 500;
    color: #1e293b;
  }
  
  .submission-platforms {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .platform-chip {
    display: inline-flex;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
  }
  
  .platform-chip.required {
    background-color: rgba(34, 151, 153, 0.1);
    color: #229799;
  }
  
  .platform-chip.optional {
    background-color: rgba(148, 163, 184, 0.1);
    color: #64748b;
  }
  
  .review-info {
    font-size: 14px;
    color: #1e293b;
    margin: 0;
    line-height: 1.6;
  }
  
  .modal-footer {
    padding: 16px 20px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .action-buttons {
    display: flex;
    gap: 8px;
  }
  
  .btn {
    padding: 10px 16px;
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
  
  @media (max-width: 640px) {
    .modal-footer {
      flex-direction: column;
      gap: 12px;
    }
    
    .btn, .action-buttons {
      width: 100%;
    }
    
    .action-buttons {
      display: flex;
      flex-direction: column;
    }
  }
  </style>
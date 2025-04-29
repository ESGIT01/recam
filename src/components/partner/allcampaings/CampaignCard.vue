<!-- src/components/partner/campaigns/CampaignCard.vue -->
<template>
    <div class="campaign-card">
      <div class="card-header">
        <div class="campaign-image" :style="{ backgroundColor: campaign.imageBg }">
          {{ campaign.title.charAt(0) }}
        </div>
        <div class="campaign-status">
          <span class="status-badge" :class="campaign.status">
            {{ campaign.statusText }}
          </span>
        </div>
      </div>
      
      <div class="card-body">
        <h3 class="campaign-title">{{ campaign.title }}</h3>
        <p class="campaign-description">{{ campaign.description }}</p>
        
        <div class="campaign-meta">
          <div class="meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>{{ campaign.type }}</span>
          </div>
          <div class="meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span>{{ campaign.target }}명</span>
          </div>
          <div class="meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>{{ formatDeadline(campaign) }}</span>
          </div>
        </div>
        
        <!-- 지원자 수 표시 -->
        <div class="applications-bar">
          <div class="applications-progress">
            <div class="progress-fill" :style="{ width: progressWidth }"></div>
          </div>
          <div class="applications-text">
            <span>{{ campaign.applications }}명</span> 지원 / <span>{{ campaign.target }}명</span> 모집
          </div>
        </div>
      </div>
      
      <div class="card-footer">
        <!-- 상태별 다른 액션 버튼들 표시 -->
        <template v-if="campaign.status === 'pending'">
          <button class="btn btn-primary">승인 요청</button>
        </template>
        
        <template v-else-if="campaign.status === 'waiting'">
          <button class="btn btn-primary" @click="onSelectReviewers">리뷰어 선정하기</button>
        </template>
        
        <template v-else-if="campaign.status === 'active'">
          <button class="btn btn-outline">지원자 보기</button>
          <button class="btn btn-primary">수정하기</button>
        </template>
        
        <template v-else-if="campaign.status === 'completed'">
          <button class="btn btn-primary" @click="onViewReviewers">리뷰어 현황</button>
        </template>
        
        <template v-else>
          <button class="btn btn-primary">상세보기</button>
        </template>
      </div>
      
      <!-- 완료된 캠페인의 경우 리뷰어 미니 목록 -->
      <div v-if="campaign.status === 'completed' && campaign.reviewers" class="reviewers-preview">
        <h4 class="reviewers-title">리뷰어 현황 ({{ getReviewCompletionRate() }})</h4>
        <div class="reviewer-list-preview">
          <div 
            v-for="reviewer in limitedReviewers" 
            :key="reviewer.id" 
            class="reviewer-preview-item"
            :class="{ 'completed': reviewer.reviewStatus === 'completed' }"
          >
            <div class="reviewer-info">
              <div class="reviewer-avatar">{{ reviewer.name.charAt(0) }}</div>
              <div class="reviewer-details">
                <div class="reviewer-name">{{ reviewer.name }}</div>
                <div class="reviewer-channel">{{ reviewer.channel }}</div>
              </div>
            </div>
            
            <button 
              v-if="reviewer.reviewStatus === 'completed'" 
              class="view-review-btn"
              @click="onViewReview(reviewer)"
            >
              리뷰 보기
            </button>
            <span v-else class="pending-review">리뷰 대기중</span>
          </div>
          
          <div v-if="isMoreReviewers" class="more-reviewers" @click="onViewReviewers">
            + {{ campaign.reviewers.length - previewLimit }}명 더보기
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, computed } from 'vue';
  
  export default defineComponent({
    name: 'CampaignCard',
    props: {
      campaign: {
        type: Object,
        required: true
      },
      listType: {
        type: String,
        default: 'all'
      }
    },
    emits: ['select-reviewers', 'view-reviewers', 'view-review'],
    setup(props, { emit }) {
      // 미리보기에 표시할 리뷰어 수 제한
      const previewLimit = 2;
      
      // 진행률 바 너비 계산
      const progressWidth = computed(() => {
        const percentage = (props.campaign.applications / props.campaign.target) * 100;
        return `${Math.min(percentage, 100)}%`;
      });
      
      // 미리보기에 표시할 리뷰어 목록
      const limitedReviewers = computed(() => {
        if (!props.campaign.reviewers) return [];
        return props.campaign.reviewers.slice(0, previewLimit);
      });
      
      // 더 많은 리뷰어가 있는지 여부
      const isMoreReviewers = computed(() => {
        if (!props.campaign.reviewers) return false;
        return props.campaign.reviewers.length > previewLimit;
      });
      
      // 리뷰 완료율 계산
      const getReviewCompletionRate = () => {
        if (!props.campaign.reviewers || props.campaign.reviewers.length === 0) {
          return '0/0';
        }
        
        const completedReviews = props.campaign.reviewers.filter(
          reviewer => reviewer.reviewStatus === 'completed'
        ).length;
        
        return `${completedReviews}/${props.campaign.reviewers.length}`;
      };
      
      // 마감일 포맷팅
      const formatDeadline = (campaign) => {
        if (campaign.status === 'completed') {
          return '완료됨';
        }
        
        if (campaign.daysLeft === 0) {
          return '마감됨';
        }
        
        return `${campaign.daysLeft}일 남음`;
      };
      
      // 리뷰어 선정 버튼 클릭
      const onSelectReviewers = () => {
        emit('select-reviewers', props.campaign.id);
      };
      
      // 리뷰어 현황 버튼 클릭
      const onViewReviewers = () => {
        emit('view-reviewers', props.campaign.id);
      };
      
      // 리뷰 보기 버튼 클릭
      const onViewReview = (reviewer) => {
        emit('view-review', reviewer);
      };
      
      return {
        progressWidth,
        limitedReviewers,
        isMoreReviewers,
        previewLimit,
        getReviewCompletionRate,
        formatDeadline,
        onSelectReviewers,
        onViewReviewers,
        onViewReview
      };
    }
  });
  </script>
  
  <style scoped>
  .campaign-card {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: box-shadow 0.3s;
  }
  
  .campaign-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .card-header {
    position: relative;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  
  .campaign-image {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: #229799;
    font-size: 20px;
  }
  
  .campaign-status {
    display: flex;
    align-items: center;
  }
  
  .status-badge {
    display: inline-flex;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
  }
  
  .status-badge.pending {
    background-color: rgba(245, 158, 11, 0.1);
    color: #f59e0b;
  }
  
  .status-badge.waiting {
    background-color: rgba(139, 92, 246, 0.1);
    color: #8b5cf6;
  }
  
  .status-badge.active {
    background-color: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
  }
  
  .status-badge.completed {
    background-color: rgba(16, 185, 129, 0.1);
    color: #10b981;
  }
  
  .card-body {
    padding: 0 16px 16px;
    flex: 1;
  }
  
  .campaign-title {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 12px;
    line-height: 1.3;
  }
  
  .campaign-description {
    font-size: 14px;
    color: #64748b;
    margin: 0 0 16px;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .campaign-meta {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
  }
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #64748b;
    font-size: 13px;
  }
  
  .meta-item svg {
    color: #94a3b8;
  }
  
  .applications-bar {
    margin-bottom: 16px;
  }
  
  .applications-progress {
    height: 6px;
    background-color: #f1f5f9;
    border-radius: 3px;
    margin-bottom: 8px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background-color: #229799;
    border-radius: 3px;
    transition: width 0.3s;
  }
  
  .applications-text {
    font-size: 13px;
    color: #64748b;
  }
  
  .applications-text span {
    font-weight: 600;
    color: #1e293b;
  }
  
  .card-footer {
    padding: 16px;
    border-top: 1px solid #f1f5f9;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
  
  .btn {
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .btn-primary {
    background-color: #229799;
    color: white;
    border: none;
  }
  
  .btn-primary:hover {
    background-color: #1a7a7c;
  }
  
  .btn-outline {
    background-color: white;
    color: #64748b;
    border: 1px solid #e5e7eb;
  }
  
  .btn-outline:hover {
    background-color: #f8fafc;
  }
  
  /* 리뷰어 미리보기 영역 */
  .reviewers-preview {
    padding: 16px;
    border-top: 1px solid #f1f5f9;
  }
  
  .reviewers-title {
    font-size: 15px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 12px;
  }
  
  .reviewer-list-preview {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .reviewer-preview-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background-color: #f8fafc;
    border-radius: 8px;
  }
  
  .reviewer-preview-item.completed {
    background-color: rgba(16, 185, 129, 0.05);
  }
  
  .reviewer-info {
    display: flex;
    align-items: center;
    gap: 12px;
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
  
  .reviewer-details {
    display: flex;
    flex-direction: column;
  }
  
  .reviewer-name {
    font-size: 14px;
    font-weight: 500;
    color: #1e293b;
  }
  
  .reviewer-channel {
    font-size: 12px;
    color: #64748b;
  }
  
  .view-review-btn {
    padding: 6px 12px;
    background-color: rgba(16, 185, 129, 0.1);
    color: #10b981;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .view-review-btn:hover {
    background-color: rgba(16, 185, 129, 0.2);
  }
  
  .pending-review {
    font-size: 12px;
    color: #94a3b8;
  }
  
  .more-reviewers {
    padding: 8px;
    text-align: center;
    font-size: 13px;
    color: #3b82f6;
    cursor: pointer;
    background-color: #f1f5f9;
    border-radius: 6px;
    transition: background-color 0.2s;
  }
  
  .more-reviewers:hover {
    background-color: #e5e7eb;
  }
  
  @media (max-width: 640px) {
    .campaign-meta {
      flex-wrap: wrap;
      gap: 10px;
    }
    
    .card-footer {
      flex-direction: column;
    }
    
    .btn {
      width: 100%;
      text-align: center;
    }
  }
  </style>
<!-- src/components/partner/campaigns/WaitingCampaignCard.vue -->
<template>
    <div class="campaign-card">
      <div class="card-header">
        <div class="campaign-thumbnail" :style="{ backgroundColor: campaign.thumbnailBg }">
          {{ campaign.title.charAt(0) }}
        </div>
        <div class="create-info">
          <div class="create-date">{{ formatDate(campaign.createdAt) }}</div>
          <div class="brand-name">{{ campaign.brand }}</div>
        </div>
      </div>
      
      <div class="card-body">
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
        </div>
        
        <!-- 제출물 요구사항 -->
        <div class="submission-requirements">
          <div class="requirement-title">필수 제출</div>
          <div class="requirement-chips">
            <span 
              v-for="(platform, index) in campaign.submissions.required" 
              :key="`required-${index}`" 
              class="chip required"
            >
              {{ platform }}
            </span>
          </div>
        </div>
        
        <div v-if="campaign.submissions.optional.length > 0" class="submission-requirements">
          <div class="requirement-title">선택 제출</div>
          <div class="requirement-chips">
            <span 
              v-for="(platform, index) in campaign.submissions.optional" 
              :key="`optional-${index}`" 
              class="chip optional"
            >
              {{ platform }}
            </span>
          </div>
        </div>
        
        <!-- 리워드 정보 -->
        <div class="reward-info">
          <div class="reward-title">리워드</div>
          <div class="reward-value">{{ campaign.reward }}</div>
        </div>
      </div>
      
      <div class="card-footer">
        <button class="btn btn-outline" @click="onViewDetail">상세보기</button>
        <div class="action-buttons">
          <button class="btn btn-approve" @click="onApprove">승인</button>
          <button class="btn btn-reject" @click="onReject">반려</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'WaitingCampaignCard',
    props: {
      campaign: {
        type: Object,
        required: true
      }
    },
    emits: ['view-detail', 'approve', 'reject'],
    setup(props, { emit }) {
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
      
      // 상세보기 버튼 클릭
      const onViewDetail = () => {
        emit('view-detail', props.campaign.id);
      };
      
      // 승인하기 버튼 클릭
      const onApprove = () => {
        emit('approve', props.campaign.id);
      };
      
      // 반려하기 버튼 클릭
      const onReject = () => {
        emit('reject', props.campaign.id);
      };
      
      return {
        formatDate,
        onViewDetail,
        onApprove,
        onReject
      };
    }
  });
  </script>
  
  <style scoped>
  .campaign-card {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
    transition: box-shadow 0.2s;
  }
  
  .campaign-card:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .card-header {
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid #f1f5f9;
  }
  
  .campaign-thumbnail {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: #229799;
    font-size: 18px;
  }
  
  .create-info {
    flex: 1;
  }
  
  .create-date {
    font-size: 12px;
    color: #64748b;
    margin-bottom: 4px;
  }
  
  .brand-name {
    font-size: 14px;
    font-weight: 500;
    color: #229799;
  }
  
  .card-body {
    padding: 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .campaign-title {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
    line-height: 1.4;
  }
  
  .campaign-description {
    font-size: 13px;
    color: #64748b;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    line-height: 1.5;
  }
  
  .campaign-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #64748b;
    font-size: 12px;
  }
  
  .meta-item svg {
    color: #94a3b8;
  }
  
  .submission-requirements {
    background-color: #f8fafc;
    padding: 12px;
    border-radius: 8px;
  }
  
  .requirement-title {
    font-size: 12px;
    font-weight: 500;
    color: #64748b;
    margin-bottom: 8px;
  }
  
  .requirement-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  
  .chip {
    display: inline-flex;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
  }
  
  .chip.required {
    background-color: rgba(34, 151, 153, 0.1);
    color: #229799;
  }
  
  .chip.optional {
    background-color: rgba(148, 163, 184, 0.1);
    color: #64748b;
  }
  
  .reward-info {
    background-color: #f8fafc;
    padding: 12px;
    border-radius: 8px;
  }
  
  .reward-title {
    font-size: 12px;
    font-weight: 500;
    color: #64748b;
    margin-bottom: 4px;
  }
  
  .reward-value {
    font-size: 14px;
    font-weight: 500;
    color: #1e293b;
  }
  
  .card-footer {
    padding: 16px;
    border-top: 1px solid #f1f5f9;
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }
  
  .action-buttons {
    display: flex;
    gap: 8px;
  }
  
  .btn {
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }
  
  .btn-outline {
    background-color: white;
    color: #64748b;
    border: 1px solid #e5e7eb;
    flex: 1;
  }
  
  .btn-outline:hover {
    background-color: #f8fafc;
  }
  
  .btn-approve {
    background-color: #229799;
    color: white;
    border: none;
  }
  
  .btn-approve:hover {
    background-color: #1b7a7c;
  }
  
  .btn-reject {
    background-color: white;
    color: #ef4444;
    border: 1px solid #ef4444;
  }
  
  .btn-reject:hover {
    background-color: rgba(239, 68, 68, 0.05);
  }
  
  @media (max-width: 640px) {
    .card-footer {
      flex-direction: column;
    }
    
    .action-buttons {
      width: 100%;
    }
    
    .btn {
      flex: 1;
      text-align: center;
      display: flex;
      justify-content: center;
    }
  }
  </style>
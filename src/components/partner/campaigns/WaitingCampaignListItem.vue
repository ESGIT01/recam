<!-- src/components/partner/campaigns/WaitingCampaignListItem.vue -->
<template>
    <div class="campaign-list-item">
      <div class="campaign-info">
        <div class="campaign-thumbnail" :style="{ backgroundColor: campaign.thumbnailBg }">
          {{ campaign.title.charAt(0) }}
        </div>
        <div class="campaign-details">
          <h3 class="campaign-title">{{ campaign.title }}</h3>
          <div class="campaign-meta">
            <div class="meta-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>{{ formatDate(campaign.createdAt) }}</span>
            </div>
            <div class="meta-separator">•</div>
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
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span>{{ campaign.target }}명 모집</span>
            </div>
            <div class="meta-separator">•</div>
            <div class="meta-item brand">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
              <span>{{ campaign.brand }}</span>
            </div>
          </div>
          <p class="campaign-description">{{ campaign.description }}</p>
        </div>
      </div>
      
      <div class="campaign-actions">
        <button class="btn btn-outline" @click="onViewDetail">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          상세보기
        </button>
        <button class="btn btn-approve" @click="onApprove">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          승인하기
        </button>
        <button class="btn btn-reject" @click="onReject">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          반려하기
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'WaitingCampaignListItem',
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
  .campaign-list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    transition: box-shadow 0.2s;
  }
  
  .campaign-list-item:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .campaign-info {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    flex: 1;
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
  flex-shrink: 0;
}

.campaign-details {
  flex: 1;
  min-width: 0; /* 텍스트 오버플로우를 위해 필요 */
}

.campaign-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.campaign-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
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

.meta-item.brand {
  color: #229799;
  font-weight: 500;
}

.meta-separator {
  color: #cbd5e1;
  font-size: 12px;
}

.campaign-description {
  font-size: 13px;
  color: #64748b;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.campaign-actions {
  display: flex;
  gap: 8px;
  margin-left: 16px;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
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

@media (max-width: 920px) {
  .campaign-list-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .campaign-actions {
    margin-left: 0;
    margin-top: 16px;
    width: 100%;
    justify-content: flex-end;
  }
}

@media (max-width: 640px) {
  .campaign-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .btn {
    width: 100%;
  }
}
</style>
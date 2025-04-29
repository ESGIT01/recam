<!-- src/components/partner/campaigns/ReviewersList.vue -->
<template>
    <div class="modal-overlay" @click="closeModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">리뷰어 현황</h3>
          <button class="close-btn" @click="closeModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="campaign-info">
            <div class="campaign-image" :style="{ backgroundColor: campaign.imageBg }">
              {{ campaign.title.charAt(0) }}
            </div>
            <div class="campaign-details">
              <h4 class="campaign-title">{{ campaign.title }}</h4>
              <div class="campaign-meta">
                <span class="meta-item">{{ campaign.type }}</span>
                <span class="meta-separator">•</span>
                <span class="meta-item">{{ campaign.target }}명 모집</span>
              </div>
            </div>
          </div>
          
          <div class="reviewers-stats">
            <div class="stat-item">
              <div class="stat-value">{{ reviewers.length }}</div>
              <div class="stat-label">선정된 리뷰어</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ completedReviews }}</div>
              <div class="stat-label">완료된 리뷰</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ pendingReviews }}</div>
              <div class="stat-label">대기중인 리뷰</div>
            </div>
          </div>
          
          <div class="reviewers-filter">
            <button 
              class="filter-btn" 
              :class="{ 'active': activeFilter === 'all' }"
              @click="setFilter('all')"
            >
              전체
            </button>
            <button 
              class="filter-btn" 
              :class="{ 'active': activeFilter === 'completed' }"
              @click="setFilter('completed')"
            >
              리뷰 완료
            </button>
            <button 
              class="filter-btn" 
              :class="{ 'active': activeFilter === 'pending' }"
              @click="setFilter('pending')"
            >
              리뷰 대기
            </button>
          </div>
          
          <div class="reviewers-list">
            <div 
              v-for="reviewer in filteredReviewers" 
              :key="reviewer.id" 
              class="reviewer-item"
              :class="{ 'completed': reviewer.reviewStatus === 'completed' }"
            >
              <div class="reviewer-info">
                <div class="reviewer-avatar">{{ reviewer.name.charAt(0) }}</div>
                <div class="reviewer-details">
                  <div class="reviewer-name">{{ reviewer.name }}</div>
                  <div class="reviewer-meta">
                    <span class="reviewer-channel">{{ reviewer.channel }}</span>
                    <span class="meta-separator">•</span>
                    <span class="reviewer-followers">팔로워 {{ reviewer.followers }}</span>
                  </div>
                </div>
              </div>
              
              <div class="reviewer-status">
                <template v-if="reviewer.reviewStatus === 'completed'">
                  <div class="review-date">{{ formatDate(reviewer.reviewDate) }}</div>
                  <button class="view-review-btn" @click="onViewReview(reviewer)">
                    리뷰 보기
                  </button>
                </template>
                <div v-else class="pending-status">리뷰 대기중</div>
              </div>
            </div>
            
            <div v-if="filteredReviewers.length === 0" class="empty-state">
              <p>{{ getEmptyMessage() }}</p>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="close-modal-btn" @click="closeModal">닫기</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref, computed } from 'vue';
  
  export default defineComponent({
    name: 'ReviewersList',
    props: {
      campaign: {
        type: Object,
        required: true
      },
      reviewers: {
        type: Array,
        required: true
      }
    },
    emits: ['close', 'view-review'],
    setup(props, { emit }) {
      const activeFilter = ref('all');
      
      // 필터링된 리뷰어 목록
      const filteredReviewers = computed(() => {
        if (activeFilter.value === 'all') {
          return props.reviewers;
        }
        
        return props.reviewers.filter(reviewer => reviewer.reviewStatus === activeFilter.value);
      });
      
      // 완료된 리뷰 수
      const completedReviews = computed(() => {
        return props.reviewers.filter(reviewer => reviewer.reviewStatus === 'completed').length;
      });
      
      // 대기 중인 리뷰 수
      const pendingReviews = computed(() => {
        return props.reviewers.filter(reviewer => reviewer.reviewStatus === 'pending').length;
      });
      
      // 필터 설정
      const setFilter = (filter) => {
        activeFilter.value = filter;
      };
      
      // 날짜 포맷팅
      const formatDate = (dateString) => {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        const today = new Date();
        
        // 날짜 포맷팅 (오늘, 어제, 날짜)
        if (date.toDateString() === today.toDateString()) {
          return `오늘 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        }
        
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        if (date.toDateString() === yesterday.toDateString()) {
          return `어제 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        }
        
        return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
      };
      
      // 빈 목록 메시지
      const getEmptyMessage = () => {
        if (activeFilter.value === 'completed') {
          return '완료된 리뷰가 없습니다.';
        } else if (activeFilter.value === 'pending') {
          return '대기 중인 리뷰가 없습니다.';
        }
        return '선정된 리뷰어가 없습니다.';
      };
      
      // 모달 닫기
      const closeModal = () => {
        emit('close');
      };
      
      // 리뷰 상세 보기
      const onViewReview = (reviewer) => {
        emit('view-review', reviewer);
      };
      
      return {
        activeFilter,
        filteredReviewers,
        completedReviews,
        pendingReviews,
        setFilter,
        formatDate,
        getEmptyMessage,
        closeModal,
        onViewReview
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
    max-width: 600px;
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
    padding: 20px;
    flex: 1;
    overflow-y: auto;
  }
  
  .campaign-info {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
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
  
  .campaign-details {
    flex: 1;
  }
  
  .campaign-title {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 4px;
  }
  
  .campaign-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #64748b;
  }
  
  .meta-separator {
    color: #cbd5e1;
  }
  
  .reviewers-stats {
    display: flex;
    justify-content: space-between;
    background-color: #f8fafc;
    border-radius: 10px;
    padding: 16px;
    margin-bottom: 20px;
  }
  
  .stat-item {
    text-align: center;
    flex: 1;
  }
  
  .stat-value {
    font-size: 20px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 4px;
  }
  
  .stat-label {
    font-size: 13px;
    color: #64748b;
  }
  
  .reviewers-filter {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .filter-btn {
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 13px;
    background-color: #f1f5f9;
    border: none;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .filter-btn:hover {
    background-color: #e2e8f0;
  }
  
  .filter-btn.active {
    background-color: #229799;
    color: white;
  }
  
  .reviewers-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .reviewer-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-radius: 10px;
    background-color: #f8fafc;
    transition: background-color 0.2s;
  }
  
  .reviewer-item.completed {
    background-color: rgba(16, 185, 129, 0.05);
  }
  
  .reviewer-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reviewer-avatar {
  width: 36px;
  height: 36px;
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
  margin-bottom: 4px;
}

.reviewer-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #64748b;
}

.reviewer-status {
  display: flex;
  align-items: center;
  gap: 12px;
}

.review-date {
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

.pending-status {
  font-size: 12px;
  color: #94a3b8;
}

.empty-state {
  padding: 24px;
  text-align: center;
  color: #64748b;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
}

.close-modal-btn {
  padding: 8px 16px;
  background-color: #f1f5f9;
  color: #64748b;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.close-modal-btn:hover {
  background-color: #e2e8f0;
}

@media (max-width: 640px) {
  .reviewer-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .reviewer-status {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
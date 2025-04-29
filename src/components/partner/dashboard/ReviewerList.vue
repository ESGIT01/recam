<!-- src/components/partner/dashboard/ReviewerList.vue -->
<template>
    <div class="content-card">
      <div class="card-header">
        <h2 class="card-title">선정된 리뷰어 현황</h2>
        <div class="card-actions">
          <button 
            v-for="(status, index) in statusFilters" 
            :key="index"
            class="card-action" 
            :class="{ active: activeFilter === status.value }"
            @click="setFilter(status.value)"
          >
            {{ status.label }}
          </button>
        </div>
      </div>
      <div class="card-content">
        <div class="review-list">
          <div 
            class="review-item" 
            v-for="(review, index) in filteredReviewers" 
            :key="index"
          >
            <div class="review-campaign">
              <div class="campaign-name">{{ review.campaign }}</div>
              <div class="review-time">{{ review.time }} 등록</div>
            </div>
            <div class="review-actions">
              <button 
                class="action-btn approve" 
                @click="onApprove(review.id)" 
                title="최종 승인"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </button>
              <button 
                class="action-btn reject" 
                @click="onReject(review.id)" 
                title="반려"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
          
          <div v-if="filteredReviewers.length === 0" class="empty-state">
            <p>해당 상태의 리뷰가 없습니다.</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref, computed } from 'vue';
  
  export default defineComponent({
    name: 'ReviewerList',
    props: {
      reviewers: {
        type: Array,
        required: true
      }
    },
    emits: ['approve', 'reject'],
    setup(props, { emit }) {
      const statusFilters = [
        { label: '대기중', value: 'pending' },
        { label: '승인됨', value: 'approved' },
        { label: '반려됨', value: 'rejected' }
      ];
      
      const activeFilter = ref('pending');
      
      const setFilter = (filter) => {
        activeFilter.value = filter;
      };
      
      const filteredReviewers = computed(() => {
        return props.reviewers.filter(review => review.status === activeFilter.value);
      });
      
      const onApprove = (reviewId) => {
        emit('approve', reviewId);
      };
      
      const onReject = (reviewId) => {
        emit('reject', reviewId);
      };
      
      return {
        statusFilters,
        activeFilter,
        setFilter,
        filteredReviewers,
        onApprove,
        onReject
      };
    }
  });
  </script>
  
  <style scoped>
  .content-card {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #f1f5f9;
  }
  
  .card-title {
    font-size: 16px;
    font-weight: 600;
    color: #424242;
    margin: 0;
  }
  
  .card-actions {
    display: flex;
    gap: 8px;
  }
  
  .card-action {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 13px;
    background-color: #f8fafc;
    border: none;
    color: #5c6a7e;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .card-action:hover {
    background-color: #f1f5f9;
  }
  
  .card-action.active {
    background-color: #229799;
    color: white;
  }
  
  .card-content {
    padding: 0 20px 20px;
  }
  
  .review-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 16px;
  }
  
  .review-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-radius: 10px;
    background-color: #f8fafc;
    transition: background-color 0.2s;
  }
  
  .review-item:hover {
    background-color: #f1f5f9;
  }
  
  .review-campaign {
    flex: 1;
  }
  
  .campaign-name {
    font-size: 14px;
    font-weight: 500;
    color: #1e293b;
    margin-bottom: 4px;
  }
  
  .review-time {
    font-size: 12px;
    color: #64748b;
  }
  
  .review-actions {
    display: flex;
    gap: 8px;
  }
  
  .action-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .action-btn.approve {
    background-color: rgba(16, 185, 129, 0.1);
    color: #10b981;
  }
  
  .action-btn.approve:hover {
    background-color: rgba(16, 185, 129, 0.2);
  }
  
  .action-btn.reject {
    background-color: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }
  
  .action-btn.reject:hover {
    background-color: rgba(239, 68, 68, 0.2);
  }
  
  .empty-state {
    padding: 24px;
    text-align: center;
    color: #64748b;
    font-size: 14px;
  }
  </style>
<!-- src/components/partner/campaigns/ReviewersManagementModal.vue -->
<template>
    <div class="modal-overlay" @click="closeModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">리뷰어 관리</h3>
          <button class="close-btn" @click="closeModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="modal-subheader">
          <div class="campaign-info">
            <div class="campaign-thumbnail" :style="{ backgroundColor: campaign.thumbnailBg }">
              {{ campaign.title.charAt(0) }}
            </div>
            <div class="campaign-title-info">
              <h4 class="campaign-title">{{ campaign.title }}</h4>
              <div class="campaign-meta">
                <span>{{ campaign.type }}</span>
                <span class="separator">|</span>
                <span>선정된 리뷰어 {{ campaign.selectedReviewers.length }}명</span>
                <span class="separator">|</span>
                <span>리뷰 완료 {{ getCompletedReviewCount() }}/{{ campaign.selectedReviewers.length }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-body">
          <div class="reviewers-filter">
            <div class="search-bar">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                placeholder="이름 또는 채널 검색" 
                v-model="searchQuery"
              />
            </div>
            <div class="status-filter">
              <label for="status-select">상태:</label>
              <select id="status-select" v-model="statusFilter" @change="filterReviewers">
                <option value="all">전체</option>
                <option value="waiting">대기중</option>
                <option value="in_progress">진행중</option>
                <option value="completed">완료됨</option>
              </select>
            </div>
          </div>
          
          <div v-if="filteredReviewers.length > 0" class="reviewers-table-container">
            <table class="reviewers-table">
              <thead>
                <tr>
                  <th class="column-checkbox">
                    <input 
                      type="checkbox" 
                      :checked="isAllSelected" 
                      @change="toggleSelectAll"
                      :disabled="!canSelectReviewers"
                    />
                  </th>
                  <th class="column-name">리뷰어</th>
                  <th class="column-channel">채널</th>
                  <th class="column-followers">팔로워</th>
                  <th class="column-status">상태</th>
                  <th class="column-date">리뷰 등록일</th>
                  <th class="column-actions">액션</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="reviewer in filteredReviewers" :key="reviewer.id">
                  <td class="column-checkbox">
                    <input 
                      type="checkbox" 
                      :checked="selectedReviewers.includes(reviewer.id)"
                      @change="toggleSelectReviewer(reviewer.id)"
                      :disabled="reviewer.reviewStatus === 'completed' || !canSelectReviewers"
                    />
                  </td>
                  <td class="column-name">
                    <div class="reviewer-profile">
                      <div class="reviewer-avatar">{{ reviewer.name.charAt(0) }}</div>
                      <span class="reviewer-name">{{ reviewer.name }}</span>
                    </div>
                  </td>
                  <td class="column-channel">{{ reviewer.channel }}</td>
                  <td class="column-followers">{{ reviewer.followers }}</td>
                  <td class="column-status">
                    <span class="review-status-badge" :class="reviewer.reviewStatus">
                      {{ getReviewStatusText(reviewer.reviewStatus) }}
                    </span>
                  </td>
                  <td class="column-date">
                    {{ reviewer.reviewDate ? formatDate(reviewer.reviewDate) : '-' }}
                  </td>
                  <td class="column-actions">
                    <button 
                      v-if="reviewer.reviewStatus === 'completed'" 
                      class="view-review-btn"
                      @click="viewReview(reviewer.id)"
                    >
                      리뷰 보기
                    </button>
                    <button 
                      v-else 
                      class="remind-btn"
                      @click="sendSingleReminder(reviewer.id)"
                      :disabled="!canSendReminder"
                    >
                      리마인드
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div v-else class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p v-if="searchQuery || statusFilter !== 'all'">검색 결과가 없습니다.</p>
          <p v-else>선정된 리뷰어가 없습니다.</p>
        </div>
        
        <!-- 리마인드 메시지 설정 -->
        <div v-if="selectedReviewers.length > 0" class="remind-message-section">
          <div class="section-header">
            <h4 class="section-title">리마인드 메시지</h4>
            <div class="selected-info">{{ selectedReviewers.length }}명 선택됨</div>
          </div>
          
          <div class="message-selector">
            <div class="message-option">
              <input 
                type="radio" 
                id="default-message" 
                value="default" 
                v-model="messageType"
                name="message-type"
              />
              <label for="default-message">기본 메시지 사용</label>
            </div>
            <div class="message-option">
              <input 
                type="radio" 
                id="custom-message" 
                value="custom" 
                v-model="messageType"
                name="message-type"
              />
              <label for="custom-message">직접 작성</label>
            </div>
          </div>
          
          <div v-if="messageType === 'default'" class="default-message-preview">
            <div class="message-preview-header">기본 메시지 미리보기</div>
            <div class="message-preview-content">
              {{ campaign.title }} 캠페인의 리뷰 작성 기한이 곧 종료됩니다. 리뷰 작성을 부탁드립니다.
            </div>
          </div>
          
          <div v-else class="custom-message-editor">
            <textarea 
              v-model="customMessage" 
              placeholder="리뷰어에게 전달할 리마인드 메시지를 작성해주세요."
              rows="4"
            ></textarea>
            <div class="char-count" :class="{ 'limit-near': isNearLimit, 'limit-exceeded': isLimitExceeded }">
              {{ customMessage.length }}/200자
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn btn-outline" @click="closeModal">
          닫기
        </button>
        
        <button 
          v-if="selectedReviewers.length > 0"
          class="btn btn-primary"
          :disabled="isLimitExceeded || !canSendReminder"
          @click="sendReminderToSelected"
        >
          선택한 리뷰어에게 리마인드 발송
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch } from 'vue';

export default defineComponent({
  name: 'ReviewersManagementModal',
  props: {
    campaign: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'send-reminder', 'view-review'],
  setup(props, { emit }) {
    const searchQuery = ref('');
    const statusFilter = ref('all');
    const selectedReviewers = ref([]);
    const messageType = ref('default');
    const customMessage = ref('');
    
    // 리마인드 발송 쿨타임 관리 (실제로는 API로 확인)
    const canSendReminder = ref(true);
    
    // 필터링된 리뷰어 목록
    const filteredReviewers = ref([]);
    
    // 완료된 리뷰 수 계산
    const getCompletedReviewCount = () => {
      return props.campaign.selectedReviewers.filter(r => r.reviewStatus === 'completed').length;
    };
    
    // 모든 리뷰어가 선택되었는지 확인
    const isAllSelected = computed(() => {
      const selectableReviewers = filteredReviewers.value.filter(r => r.reviewStatus !== 'completed');
      return selectableReviewers.length > 0 && 
             selectableReviewers.every(r => selectedReviewers.value.includes(r.id));
    });
    
    // 리뷰어 선택 가능 여부
    const canSelectReviewers = computed(() => {
      return canSendReminder.value;
    });
    
    // 메시지 길이 제한
    const isNearLimit = computed(() => {
      return customMessage.value.length > 150 && customMessage.value.length <= 200;
    });
    
    const isLimitExceeded = computed(() => {
      return customMessage.value.length > 200;
    });
    
    // 초기 데이터 로드 및 필터링
    watch([searchQuery, statusFilter], () => {
      filterReviewers();
    }, { immediate: true });
    
    // 리뷰어 필터링
    const filterReviewers = () => {
      let filtered = [...props.campaign.selectedReviewers];
      
      // 상태 필터 적용
      if (statusFilter.value !== 'all') {
        filtered = filtered.filter(r => r.reviewStatus === statusFilter.value);
      }
      
      // 검색어 필터 적용
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(r => 
          r.name.toLowerCase().includes(query) || 
          r.channel.toLowerCase().includes(query)
        );
      }
      
      filteredReviewers.value = filtered;
      
      // 필터링 후 선택된 목록 업데이트 (존재하지 않는 ID 제거)
      selectedReviewers.value = selectedReviewers.value.filter(id => 
        filtered.some(r => r.id === id && r.reviewStatus !== 'completed')
      );
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
    
    // 날짜 포맷팅
    const formatDate = (dateString) => {
      if (!dateString) return '-';
      
      const date = new Date(dateString);
      return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
    };
    
    // 모든 리뷰어 선택/해제 토글
    const toggleSelectAll = (event) => {
      if (event.target.checked) {
        // 모든 선택 가능한 리뷰어 선택
        const selectableIds = filteredReviewers.value
          .filter(r => r.reviewStatus !== 'completed')
          .map(r => r.id);
        selectedReviewers.value = selectableIds;
      } else {
        // 모든 리뷰어 선택 해제
        selectedReviewers.value = [];
      }
    };
    
    // 개별 리뷰어 선택/해제 토글
    const toggleSelectReviewer = (reviewerId) => {
      const index = selectedReviewers.value.indexOf(reviewerId);
      if (index === -1) {
        // 선택되지 않은 경우 선택
        selectedReviewers.value.push(reviewerId);
      } else {
        // 선택된 경우 선택 해제
        selectedReviewers.value.splice(index, 1);
      }
    };
    
    // 단일 리뷰어에게 리마인드 발송
    const sendSingleReminder = (reviewerId) => {
      if (!canSendReminder.value) return;
      
      const message = messageType.value === 'custom' && customMessage.value.trim() 
        ? customMessage.value 
        : `${props.campaign.title} 캠페인의 리뷰 작성 기한이 곧 종료됩니다. 리뷰 작성을 부탁드립니다.`;
      
      emit('send-reminder', props.campaign.id, [reviewerId], message);
    };
    
    // 선택된 리뷰어들에게 리마인드 발송
    const sendReminderToSelected = () => {
      if (!canSendReminder.value || selectedReviewers.value.length === 0) return;
      
      if (messageType.value === 'custom' && isLimitExceeded.value) {
        alert('리마인드 메시지는 200자를 넘을 수 없습니다.');
        return;
      }
      
      const message = messageType.value === 'custom' && customMessage.value.trim() 
        ? customMessage.value 
        : `${props.campaign.title} 캠페인의 리뷰 작성 기한이 곧 종료됩니다. 리뷰 작성을 부탁드립니다.`;
      
      emit('send-reminder', props.campaign.id, selectedReviewers.value, message);
    };
    
    // 리뷰 상세 보기
    const viewReview = (reviewerId) => {
      const reviewer = props.campaign.selectedReviewers.find(r => r.id === reviewerId);
      if (reviewer && reviewer.reviewStatus === 'completed') {
        emit('view-review', props.campaign.id, reviewerId);
      }
    };
    
    // 모달 닫기
    const closeModal = () => {
      emit('close');
    };
    
    return {
      searchQuery,
      statusFilter,
      selectedReviewers,
      messageType,
      customMessage,
      filteredReviewers,
      isAllSelected,
      canSelectReviewers,
      canSendReminder,
      isNearLimit,
      isLimitExceeded,
      getCompletedReviewCount,
      filterReviewers,
      getReviewStatusText,
      formatDate,
      toggleSelectAll,
      toggleSelectReviewer,
      sendSingleReminder,
      sendReminderToSelected,
      viewReview,
      closeModal
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
  max-width: 900px;
  height: 90vh;
  max-height: 800px;
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

.modal-subheader {
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f8fafc;
}

.campaign-info {
  display: flex;
  align-items: center;
  gap: 12px;
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

.campaign-title-info {
  flex: 1;
}

.campaign-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px;
}

.campaign-meta {
  font-size: 13px;
  color: #64748b;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.separator {
  color: #cbd5e1;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.reviewers-filter {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-bar {
  position: relative;
  width: 300px;
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
  padding: 8px 8px 8px 36px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.search-bar input:focus {
  outline: none;
  border-color: #229799;
}

.status-filter {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-filter label {
  font-size: 14px;
  color: #64748b;
}

.status-filter select {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
  transition: border-color 0.2s;
}

.status-filter select:focus {
  outline: none;
  border-color: #229799;
}

.reviewers-table-container {
  margin-bottom: 20px;
  border: 1px solid #e5e7eb;
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

.column-checkbox {
  width: 48px;
  text-align: center;
}

.column-checkbox input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.column-checkbox input[type="checkbox"]:disabled {
  cursor: not-allowed;
}

.column-name {
  width: 20%;
}

.column-channel, .column-status, .column-followers, .column-date {
  width: 15%;
}

.column-actions {
  width: 15%;
  text-align: right;
}

.reviewer-profile {
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

.reviewer-name {
  font-weight: 500;
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

.remind-btn:hover:not(:disabled) {
  color: #d97706;
  text-decoration: underline;
}

.remind-btn:disabled {
  color: #cbd5e1;
  cursor: not-allowed;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #94a3b8;
}

.empty-state svg {
  color: #e5e7eb;
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 15px;
  margin: 0;
}

.remind-message-section {
  margin-top: 24px;
  padding: 16px;
  background-color: #f8fafc;
  border-radius: 8px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.selected-info {
  font-size: 14px;
  color: #64748b;
}

.message-selector {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
}

.message-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.message-option label {
  font-size: 14px;
  color: #1e293b;
  cursor: pointer;
}

.default-message-preview {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 12px;
}

.message-preview-header {
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 8px;
}

.message-preview-content {
  font-size: 14px;
  color: #1e293b;
  line-height: 1.5;
}

.custom-message-editor {
  position: relative;
}

.custom-message-editor textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s;
}

.custom-message-editor textarea:focus {
  outline: none;
  border-color: #229799;
}

.char-count {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 12px;
  color: #94a3b8;
}

.char-count.limit-near {
  color: #f59e0b;
}

.char-count.limit-exceeded {
  color: #ef4444;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
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

.btn-primary:hover:not(:disabled) {
  background-color: #1a7a7c;
}

.btn-primary:disabled {
  background-color: #cbd5e1;
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .reviewers-filter {
    flex-direction: column;
    gap: 12px;
  }
  
  .search-bar {
    width: 100%;
  }
  
  .reviewers-table th:nth-child(4),
  .reviewers-table td:nth-child(4),
  .reviewers-table th:nth-child(6),
  .reviewers-table td:nth-child(6) {
    display: none;
  }
  
  .modal-footer {
    flex-direction: column;
    gap: 12px;
  }
  
  .btn {
    width: 100%;
  }
}
</style>
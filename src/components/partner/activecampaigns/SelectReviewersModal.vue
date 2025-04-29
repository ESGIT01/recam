<!-- src/components/partner/campaigns/SelectReviewersModal.vue -->
<template>
    <div class="modal-overlay" @click="closeModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">리뷰어 선정</h3>
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
              <div class="applicants-count">
                <span>지원자 {{ campaign.applicants.length }}명</span>
                <span class="separator">|</span>
                <span>모집인원 {{ campaign.target }}명</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-body">
          <div class="selection-container">
            <div class="selection-info">
              <div class="panel-title">모집인원 설정</div>
              <div class="target-selector">
                <label for="reviewer-count">선정할 리뷰어 수:</label>
                <div class="count-control">
                  <button 
                    class="count-btn" 
                    @click="decreaseCount"
                    :disabled="reviewerCount <= 1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                  <input 
                    id="reviewer-count" 
                    type="number" 
                    v-model="reviewerCount" 
                    min="1" 
                    :max="campaign.applicants.length"
                  />
                  <button 
                    class="count-btn" 
                    @click="increaseCount"
                    :disabled="reviewerCount >= campaign.applicants.length"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div class="selection-method">
                <div class="panel-title">선정 방식</div>
                <div class="selection-options">
                  <label class="selection-option">
                    <input 
                      type="radio" 
                      name="selection-method" 
                      value="manual" 
                      v-model="selectionMethod"
                    />
                    <span class="option-label">수동 선정</span>
                    <span class="option-desc">직접 리뷰어를 선택합니다.</span>
                  </label>
                  <label class="selection-option">
                    <input 
                      type="radio" 
                      name="selection-method" 
                      value="auto" 
                      v-model="selectionMethod"
                    />
                    <span class="option-label">랜덤 선정</span>
                    <span class="option-desc">지정한 수만큼 자동으로 선택합니다.</span>
                  </label>
                </div>
                
                <div class="action-controls">
                  <button 
                    v-if="selectionMethod === 'auto'" 
                    class="btn btn-secondary"
                    @click="selectRandom"
                  >
                    랜덤 선정하기
                  </button>
                  <button 
                    v-if="selectedApplicants.length > 0" 
                    class="btn btn-secondary clear-btn"
                    @click="clearSelection"
                  >
                    선택 초기화
                  </button>
                </div>
              </div>
            </div>
            
            <div class="applicants-selection">
              <div class="panel-title">지원자 목록 ({{ selectedApplicants.length }}/{{ reviewerCount }}명 선택됨)</div>
              
              <div v-if="campaign.applicants.length > 0" class="applicants-grid">
                <div 
                  v-for="applicant in campaign.applicants" 
                  :key="applicant.id"
                  class="applicant-card"
                  :class="{ 'selected': isSelected(applicant.id) }"
                  @click="toggleSelectApplicant(applicant.id)"
                >
                  <div class="selection-marker">
                    <svg v-if="isSelected(applicant.id)" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div class="applicant-info">
                    <div class="applicant-avatar">{{ applicant.name.charAt(0) }}</div>
                    <div class="applicant-details">
                    <div class="applicant-name">{{ applicant.name }}</div>
                    <div class="applicant-channel">
                      {{ applicant.channel }} · {{ applicant.followers }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="empty-applicants">
              <p>지원자가 없습니다.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn btn-outline" @click="closeModal">
          취소
        </button>
        <button 
          class="btn btn-primary" 
          @click="confirmSelection"
          :disabled="selectedApplicants.length !== reviewerCount"
        >
          {{ selectedApplicants.length }}/{{ reviewerCount }}명 선정 완료하기
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'SelectReviewersModal',
  props: {
    campaign: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'confirm-selection'],
  setup(props, { emit }) {
    // 리뷰어 선정 수
    const reviewerCount = ref(Math.min(props.campaign.target, props.campaign.applicants.length));
    
    // 선정 방식 (manual: 수동, auto: 자동)
    const selectionMethod = ref('manual');
    
    // 선택된 지원자 ID 목록
    const selectedApplicants = ref([]);
    
    // 리뷰어 선정 수 조절
    const decreaseCount = () => {
      if (reviewerCount.value > 1) {
        reviewerCount.value--;
      }
    };
    
    const increaseCount = () => {
      if (reviewerCount.value < props.campaign.applicants.length) {
        reviewerCount.value++;
      }
    };
    
    // 리뷰어 선정 수 변경 시 선택된 지원자 수 조정
    watch(reviewerCount, (newCount) => {
      // 선택된 지원자가 새 리뷰어 수보다 많다면 초과분 제거
      if (selectedApplicants.value.length > newCount) {
        selectedApplicants.value = selectedApplicants.value.slice(0, newCount);
      }
    });
    
    // 랜덤 선정
    const selectRandom = () => {
      const availableApplicants = props.campaign.applicants.map(app => app.id);
      const selected = [];
      
      // 선정할 수 있는 지원자가 리뷰어 수보다 적다면 모두 선택
      if (availableApplicants.length <= reviewerCount.value) {
        selectedApplicants.value = [...availableApplicants];
        return;
      }
      
      // 랜덤 선정
      while (selected.length < reviewerCount.value) {
        const randomIndex = Math.floor(Math.random() * availableApplicants.length);
        const applicantId = availableApplicants[randomIndex];
        
        if (!selected.includes(applicantId)) {
          selected.push(applicantId);
        }
      }
      
      selectedApplicants.value = selected;
    };
    
    // 선택 초기화
    const clearSelection = () => {
      selectedApplicants.value = [];
    };
    
    // 지원자 선택 여부 확인
    const isSelected = (applicantId) => {
      return selectedApplicants.value.includes(applicantId);
    };
    
    // 지원자 선택/해제 토글
    const toggleSelectApplicant = (applicantId) => {
      const index = selectedApplicants.value.indexOf(applicantId);
      
      if (index === -1) {
        // 아직 선택 가능한 경우만 추가
        if (selectedApplicants.value.length < reviewerCount.value) {
          selectedApplicants.value.push(applicantId);
        }
      } else {
        // 선택 해제
        selectedApplicants.value.splice(index, 1);
      }
    };
    
    // 모달 닫기
    const closeModal = () => {
      emit('close');
    };
    
    // 선정 확정
    const confirmSelection = () => {
      // 지정한 수만큼 선택되었는지 확인
      if (selectedApplicants.value.length !== reviewerCount.value) {
        alert(`리뷰어를 ${reviewerCount.value}명 모두 선택해주세요.`);
        return;
      }
      
      // 선택된 지원자의 상세 정보 수집
      const selectedReviewers = props.campaign.applicants.filter(
        app => selectedApplicants.value.includes(app.id)
      );
      
      emit('confirm-selection', props.campaign.id, selectedReviewers);
    };
    
    return {
      reviewerCount,
      selectionMethod,
      selectedApplicants,
      decreaseCount,
      increaseCount,
      selectRandom,
      clearSelection,
      isSelected,
      toggleSelectApplicant,
      closeModal,
      confirmSelection
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

.applicants-count {
  font-size: 13px;
  color: #64748b;
  display: flex;
  align-items: center;
}

.separator {
  margin: 0 8px;
  color: #cbd5e1;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.selection-container {
  display: flex;
  gap: 20px;
  height: 100%;
}

.selection-info {
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
}

.target-selector {
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 16px;
}

.target-selector label {
  display: block;
  font-size: 14px;
  margin-bottom: 8px;
  color: #1e293b;
}

.count-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.count-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background-color: white;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.count-btn:hover:not(:disabled) {
  background-color: #f1f5f9;
  color: #1e293b;
}

.count-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

#reviewer-count {
  width: 60px;
  padding: 8px;
  text-align: center;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
}

#reviewer-count:focus {
  outline: none;
  border-color: #229799;
}

.selection-method {
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 16px;
}

.selection-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.selection-option {
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.selection-option input {
  margin-right: 8px;
}

.option-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 4px;
}

.option-desc {
  font-size: 12px;
  color: #64748b;
  margin-left: 24px;
}

.action-controls {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

.applicants-selection {
  flex: 1;
  min-width: 0;
}

.applicants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  overflow-y: auto;
}

.applicant-card {
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  display: flex;
  flex-direction: column;
}

.applicant-card:hover {
  background-color: #f1f5f9;
}

.applicant-card.selected {
  background-color: rgba(34, 151, 153, 0.1);
  border: 1px solid #229799;
  padding: 11px;
}

.selection-marker {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.applicant-card.selected .selection-marker {
  background-color: #229799;
  color: white;
}

.applicant-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.applicant-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #229799;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
}

.applicant-details {
  flex: 1;
  min-width: 0;
}

.applicant-name {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.applicant-channel {
  font-size: 12px;
  color: #64748b;
}

.empty-applicants {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #64748b;
  font-size: 14px;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
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

.btn-primary:disabled {
  background-color: #cbd5e1;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: white;
  color: #229799;
  border: 1px solid #229799;
}

.btn-secondary:hover {
  background-color: rgba(34, 151, 153, 0.05);
}

.clear-btn {
  color: #ef4444;
  border-color: #ef4444;
}

.clear-btn:hover {
  background-color: rgba(239, 68, 68, 0.05);
}

@media (max-width: 900px) {
  .selection-container {
    flex-direction: column;
  }
  
  .selection-info {
    width: 100%;
  }
  
  .action-controls {
    flex-direction: column;
  }
  
  .modal-footer {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>
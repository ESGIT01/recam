<!-- src/components/partner/campaigns/ReviewModal.vue -->
<template>
    <div class="modal-overlay" @click="closeModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">리뷰 상세</h3>
          <button class="close-btn" @click="closeModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="reviewer-info">
            <div class="reviewer-avatar">{{ review.name.charAt(0) }}</div>
            <div class="reviewer-details">
              <div class="reviewer-name">{{ review.name }}</div>
              <div class="reviewer-meta">
                <span class="reviewer-channel">{{ review.channel }}</span>
                <span class="meta-separator">•</span>
                <span class="reviewer-followers">팔로워 {{ review.followers }}</span>
              </div>
            </div>
          </div>
          
          <div class="review-date-info">
            <div class="info-label">리뷰 작성일</div>
            <div class="info-value">{{ formatDate(review.reviewDate) }}</div>
          </div>
          
          <div class="review-preview">
            <div class="preview-header">
              <h4 class="preview-title">리뷰 미리보기</h4>
              <a :href="review.reviewUrl" target="_blank" class="open-review-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                새 창에서 보기
              </a>
            </div>
            
            <div class="preview-frame">
              <iframe 
                v-if="review.reviewUrl" 
                :src="review.reviewUrl" 
                frameborder="0" 
                class="review-iframe"
              ></iframe>
              <div v-else class="preview-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <p>리뷰 미리보기를 불러올 수 없습니다.</p>
                <p>위의 '새 창에서 보기' 버튼을 눌러 리뷰를 확인해주세요.</p>
              </div>
            </div>
          </div>
          
          <div class="review-actions">
            <div class="action-section">
              <h4 class="action-title">리뷰 관리</h4>
              <div class="action-buttons">
                <button class="approve-btn" @click="approveReview">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  리뷰 승인하기
                </button>
                <button class="reject-btn" @click="showRejectDialog">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                  리뷰 반려하기
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="close-modal-btn" @click="closeModal">닫기</button>
        </div>
        
        <!-- 반려 사유 입력 다이얼로그 -->
        <div v-if="showRejectForm" class="reject-dialog">
          <div class="reject-dialog-content">
            <h4 class="reject-title">반려 사유 입력</h4>
            <p class="reject-description">리뷰 반려 사유를 입력해주세요.</p>
            
            <div class="form-group">
              <label for="reject-reason">반려 사유</label>
              <textarea 
                id="reject-reason" 
                v-model="rejectReason" 
                rows="4" 
                placeholder="리뷰 반려 사유를 상세히 작성해주세요."
              ></textarea>
            </div>
            
            <div class="reject-actions">
              <button class="cancel-btn" @click="cancelReject">취소</button>
              <button 
                class="confirm-btn" 
                @click="rejectReview" 
                :disabled="!rejectReason.trim()"
              >
                반려하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref } from 'vue';
  
  export default defineComponent({
    name: 'ReviewModal',
    props: {
      review: {
        type: Object,
        required: true
      }
    },
    emits: ['close'],
    setup(props, { emit }) {
      const showRejectForm = ref(false);
      const rejectReason = ref('');
      
      // 날짜 포맷팅
      const formatDate = (dateString) => {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      };
      
      // 모달 닫기
      const closeModal = () => {
        emit('close');
      };
      
      // 리뷰 승인
      const approveReview = () => {
        console.log(`리뷰 ID ${props.review.id} 승인 처리`);
        // 실제 구현에서는 API 요청 처리
        alert('리뷰가 승인되었습니다.');
        closeModal();
      };
      
      // 반려 다이얼로그 표시
      const showRejectDialog = () => {
        showRejectForm.value = true;
      };
      
      // 반려 취소
      const cancelReject = () => {
        showRejectForm.value = false;
        rejectReason.value = '';
      };
      
      // 리뷰 반려
      const rejectReview = () => {
        if (!rejectReason.value.trim()) {
          return;
        }
        
        console.log(`리뷰 ID ${props.review.id} 반려 처리. 사유: ${rejectReason.value}`);
        // 실제 구현에서는 API 요청 처리
        alert('리뷰가 반려되었습니다.');
        closeModal();
      };
      
      return {
        showRejectForm,
        rejectReason,
        formatDate,
        closeModal,
        approveReview,
        showRejectDialog,
        cancelReject,
        rejectReview
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
    position: relative;
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
    padding: 20px;
    flex: 1;
    overflow-y: auto;
  }
  
  .reviewer-info {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
  }
  
  .reviewer-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: #229799;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 18px;
  }
  
  .reviewer-details {
    flex: 1;
  }
  
  .reviewer-name {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 6px;
  }
  
  .reviewer-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: #64748b;
  }
  
  .meta-separator {
    color: #cbd5e1;
  }
  
  .review-date-info {
    display: flex;
    align-items: center;
    gap: 12px;
    background-color: #f8fafc;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 24px;
  }
  
  .info-label {
    font-size: 14px;
    color: #64748b;
  }
  
  .info-value {
    font-size: 14px;
    font-weight: 500;
    color: #1e293b;
  }
  
  .review-preview {
    margin-bottom: 24px;
  }
  
  .preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  
  .preview-title {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }
  
  .open-review-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: #3b82f6;
    text-decoration: none;
    transition: color 0.2s;
  }
  
  .open-review-btn:hover {
    color: #2563eb;
    text-decoration: underline;
  }
  
  .preview-frame {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    height: 300px;
    overflow: hidden;
  }
  
  .review-iframe {
    width: 100%;
    height: 100%;
  }
  
  .preview-placeholder {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    padding: 20px;
    text-align: center;
  }
  
  .preview-placeholder svg {
    color: #e2e8f0;
    margin-bottom: 16px;
  }
  
  .preview-placeholder p {
    margin: 4px 0;
    font-size: 14px;
  }
  
  .review-actions {
    background-color: #f8fafc;
    padding: 16px;
    border-radius: 8px;
  }
  
  .action-section {
    margin-bottom: 16px;
  }
  
  .action-title {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 12px;
  }
  
  .action-buttons {
    display: flex;
    gap: 12px;
  }
  
  .approve-btn, .reject-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
  }
  
  .approve-btn {
    background-color: #10b981;
    color: white;
  }
  
  .approve-btn:hover {
    background-color: #059669;
  }
  
  .reject-btn {
    background-color: white;
    color: #ef4444;
    border: 1px solid #ef4444;
  }
  
  .reject-btn:hover {
    background-color: rgba(239, 68, 68, 0.05);
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
  
  /* 반려 사유 다이얼로그 */
  .reject-dialog {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }
  
  .reject-dialog-content {
    width: 90%;
    max-width: 500px;
    background-color: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  
  .reject-title {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 8px;
  }
  
  .reject-description {
    font-size: 14px;
    color: #64748b;
    margin: 0 0 16px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #1e293b;
    margin-bottom: 8px;
  }
  
  .form-group textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 14px;
    resize: vertical;
    transition: border-color 0.2s;
  }
  
  .form-group textarea:focus {
    outline: none;
    border-color: #229799;
  }
  
  .reject-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
  
  .cancel-btn, .confirm-btn {
    padding: 10px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .cancel-btn {
    background-color: white;
    color: #64748b;
    border: 1px solid #e5e7eb;
  }
  
  .cancel-btn:hover {
    background-color: #f8fafc;
  }
  
  .confirm-btn {
    background-color: #ef4444;
    color: white;
    border: none;
  }
  
  .confirm-btn:hover {
    background-color: #dc2626;
  }
  
  .confirm-btn:disabled {
    background-color: #fca5a5;
    cursor: not-allowed;
  }
  
  @media (max-width: 640px) {
    .action-buttons {
      flex-direction: column;
    }
    
    .approve-btn, .reject-btn {
      width: 100%;
    }
  }
  </style>
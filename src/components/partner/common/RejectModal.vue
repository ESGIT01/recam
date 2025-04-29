<!-- src/components/partner/common/RejectModal.vue -->
<template>
    <div class="modal">
      <div class="modal-container">
        <div class="modal-header">
          <h3>반려 사유</h3>
          <button class="close-btn" @click="onClose">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-content">
          <div class="form-group">
            <label for="reject-reason">반려 사유를 입력해주세요</label>
            <textarea 
              id="reject-reason" 
              :value="reason" 
              @input="updateReason($event)" 
              rows="4" 
              placeholder="리뷰 반려 사유를 입력해주세요"
            ></textarea>
            <p v-if="isError" class="error-message">반려 사유를 입력해주세요.</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="onClose">취소</button>
          <button class="primary-btn" @click="onConfirm">반려하기</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref } from 'vue';
  
  export default defineComponent({
    name: 'RejectModal',
    props: {
      reviewId: {
        type: Number,
        required: true
      },
      reason: {
        type: String,
        default: ''
      }
    },
    emits: ['update:reason', 'close', 'confirm'],
    setup(props, { emit }) {
      const isError = ref(false);
      
      const updateReason = (event) => {
        const newValue = event.target.value;
        emit('update:reason', newValue);
        
        // 이전에 에러가 있었다면 입력 시작 시 초기화
        if (isError.value && newValue.trim() !== '') {
          isError.value = false;
        }
      };
      
      const onClose = () => {
        emit('close');
      };
      
      const onConfirm = () => {
        if (props.reason.trim() === '') {
          isError.value = true;
          return;
        }
        
        emit('confirm', props.reviewId, props.reason);
      };
      
      return {
        isError,
        updateReason,
        onClose,
        onConfirm
      };
    }
  });
  </script>
  
  <style scoped>
  .modal {
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
    width: 100%;
    max-width: 500px;
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
  
  .modal-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #424242;
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
  
  .modal-content {
    padding: 20px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #424242;
  }
  
  .form-group textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-family: inherit;
    font-size: 14px;
    resize: vertical;
    transition: border-color 0.2s;
  }
  
  .form-group textarea:focus {
    outline: none;
    border-color: #229799;
  }
  
  .error-message {
    color: #ef4444;
    font-size: 12px;
    margin-top: 8px;
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    padding: 20px;
    gap: 12px;
    border-top: 1px solid #e5e7eb;
  }
  
  .cancel-btn {
    padding: 10px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    border: 1px solid #e5e7eb;
    background-color: white;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .cancel-btn:hover {
    background-color: #f8fafc;
  }
  
  .primary-btn {
    padding: 10px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    border: none;
    background-color: #229799;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .primary-btn:hover {
    background-color: #1a7a7c;
  }
  </style>
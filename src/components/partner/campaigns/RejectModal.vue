<!-- src/components/partner/campaigns/RejectModal.vue -->
<template>
    <div class="modal-overlay" @click="closeModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">반려 사유 입력</h3>
          <button class="close-btn" @click="closeModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <p class="description">캠페인 반려 사유를 입력해주세요. 입력된 사유는 광고주에게 전달됩니다.</p>
          
          <div class="form-group">
            <label for="reject-reason">반려 사유</label>
            <textarea 
              id="reject-reason" 
              :value="reason" 
              @input="updateReason($event)" 
              rows="6" 
              placeholder="반려 사유를 상세히 입력해주세요."
            ></textarea>
            <p v-if="isError" class="error-message">반려 사유를 입력해주세요.</p>
          </div>
          
          <div class="reason-templates">
            <h4 class="templates-title">자주 사용하는 반려 사유</h4>
            <div class="templates">
              <button 
                v-for="(template, index) in reasonTemplates" 
                :key="index"
                class="template-btn"
                @click="applyTemplate(template)"
              >
                {{ template.title }}
              </button>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-outline" @click="closeModal">취소</button>
          <button 
            class="btn btn-reject" 
            @click="onConfirm"
            :disabled="!reason.trim()"
          >
            반려하기
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref } from 'vue';
  
  export default defineComponent({
    name: 'RejectModal',
    props: {
      campaignId: {
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
      
      // 자주 사용하는 반려 사유 템플릿
      const reasonTemplates = [
        {
          title: '부적절한 컨텐츠',
          content: '캠페인 내용이 당사의 콘텐츠 정책에 부합하지 않습니다. 특히 [부적절한 내용]에 대한 부분을 수정해주시기 바랍니다.'
        },
        {
          title: '리워드 부족',
          content: '제공되는 리워드가 요구되는 활동 대비 충분하지 않습니다. 적절한 리워드를 재검토해 주시기 바랍니다.'
        },
        {
          title: '정보 미흡',
          content: '캠페인에 대한 정보가 충분하지 않아 리뷰어들이 활동 내용을 정확히 이해하기 어렵습니다. 보다 상세한 정보를 추가해 주시기 바랍니다.'
        },
        {
          title: '지나친 요구사항',
          content: '리뷰어에게 요구하는 활동 내용이 제공되는 리워드에 비해 과도합니다. 요구사항을 줄이거나 리워드를 증가시켜 주시기 바랍니다.'
        }
      ];
      
      // 반려 사유 업데이트
      const updateReason = (event) => {
        const newValue = event.target.value;
        emit('update:reason', newValue);
        
        // 입력 시작 시 에러 초기화
        if (isError.value && newValue.trim() !== '') {
          isError.value = false;
        }
      };
      
      // 반려 사유 템플릿 적용
      const applyTemplate = (template) => {
        emit('update:reason', template.content);
        isError.value = false;
      };
      
      // 모달 닫기
      const closeModal = () => {
        emit('close');
      };
      
      // 반려 확인
      const onConfirm = () => {
        if (!props.reason.trim()) {
          isError.value = true;
          return;
        }
        
        emit('confirm', props.campaignId, props.reason);
      };
      
      return {
        isError,
        reasonTemplates,
        updateReason,
        applyTemplate,
        closeModal,
        onConfirm
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
  }
  
  .description {
    font-size: 14px;
    color: #64748b;
    margin: 0 0 20px;
  }
  
  .form-group {
    margin-bottom: 24px;
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
    font-family: inherit;
    resize: vertical;
    transition: border-color 0.2s;
  }
  
  .form-group textarea:focus {
    outline: none;
    border-color: #229799;
  }
  
  .error-message {
    font-size: 13px;
    color: #ef4444;
    margin: 8px 0 0;
  }
  
  .reason-templates {
    background-color: #f8fafc;
    padding: 16px;
    border-radius: 10px;
  }
  
  .templates-title {
    font-size: 14px;
    font-weight: 500;
    color: #1e293b;
    margin: 0 0 12px;
  }
  
  .templates {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .template-btn {
    padding: 8px 12px;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 13px;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .template-btn:hover {
    background-color: #229799;
    border-color: #229799;
    color: white;
  }
  
  .modal-footer {
    padding: 16px 20px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
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
  
  .btn-reject {
    background-color: #ef4444;
    color: white;
    border: none;
  }
  
  .btn-reject:hover {
    background-color: #dc2626;
  }
  
  .btn-reject:disabled {
    background-color: #fca5a5;
    cursor: not-allowed;
  }
  
  @media (max-width: 640px) {
    .modal-footer {
      flex-direction: column;
    }
    
    .btn {
      width: 100%;
    }
  }
  </style>
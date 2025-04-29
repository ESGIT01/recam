<!-- src/components/partner/inquiry/InquiryForm.vue -->
<template>
    <div class="inquiry-form-component">
      <div class="inquiry-form">
        <div class="form-group">
          <label for="inquiry-category">문의 유형</label>
          <select 
            id="inquiry-category" 
            v-model="form.category"
            @change="validateField('category')"
          >
            <option value="">유형을 선택해주세요</option>
            <option value="account">계정 문의</option>
            <option value="campaign">캠페인 문의</option>
            <option value="payment">결제 문의</option>
            <option value="reviewer">리뷰어 문의</option>
            <option value="other">기타 문의</option>
          </select>
          <div v-if="errors.category" class="form-error">{{ errors.category }}</div>
        </div>
        
        <div class="form-group">
          <label for="inquiry-title">제목</label>
          <input 
            type="text" 
            id="inquiry-title" 
            v-model="form.title" 
            placeholder="문의 제목을 입력해주세요"
            @blur="validateField('title')"
          />
          <div v-if="errors.title" class="form-error">{{ errors.title }}</div>
        </div>
        
        <div class="form-group">
          <label for="inquiry-content">내용</label>
          <textarea 
            id="inquiry-content" 
            v-model="form.content" 
            rows="6" 
            placeholder="문의 내용을 상세히 입력해주세요"
            @blur="validateField('content')"
          ></textarea>
          <div v-if="errors.content" class="form-error">{{ errors.content }}</div>
        </div>
        
        <div class="form-group">
          <label for="inquiry-attachments">첨부파일 (선택)</label>
          <div class="file-input-container">
            <label class="file-input-label">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              파일 선택
              <input 
                type="file" 
                id="inquiry-attachments" 
                @change="handleFileUpload" 
                multiple
                class="hidden-file-input"
              />
            </label>
            <span class="file-info">최대 3개, 파일당 5MB 이하</span>
          </div>
          
          <div v-if="form.attachments.length > 0" class="attachments-list">
            <div 
              v-for="(file, index) in form.attachments" 
              :key="index" 
              class="attachment-item"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                <polyline points="13 2 13 9 20 9"></polyline>
              </svg>
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">{{ formatFileSize(file.size) }}</span>
              <button class="remove-file-btn" @click.stop="removeFile(index)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
          
          <div v-if="errors.attachments" class="form-error">{{ errors.attachments }}</div>
        </div>
        
        <div class="form-actions">
          <button class="btn btn-cancel" @click="$emit('cancel')">취소</button>
          <button 
            class="btn btn-submit" 
            @click="submitForm" 
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting">
              <svg class="spinner" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
              </svg>
              제출 중...
            </span>
            <span v-else>문의 제출</span>
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'InquiryForm',
    props: {
      isSubmitting: {
        type: Boolean,
        default: false
      }
    },
    emits: ['submit', 'cancel'],
    data() {
      return {
        form: {
          category: '',
          title: '',
          content: '',
          attachments: []
        },
        errors: {
          category: null,
          title: null,
          content: null,
          attachments: null
        }
      };
    },
    methods: {
      // 파일 업로드 처리
      handleFileUpload(event) {
        const files = Array.from(event.target.files);
        
        // 최대 3개 파일만 허용
        if (this.form.attachments.length + files.length > 3) {
          this.errors.attachments = '첨부파일은 최대 3개까지만 가능합니다.';
          return;
        }
        
        // 파일 크기 검사 (5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        const oversizedFiles = files.filter(file => file.size > maxSize);
        
        if (oversizedFiles.length > 0) {
          this.errors.attachments = '파일 크기는 5MB 이하여야 합니다.';
          return;
        }
        
        // 파일 추가
        this.form.attachments = [
          ...this.form.attachments,
          ...files
        ];
        
        this.errors.attachments = null;
        
        // 파일 input 초기화 (같은 파일 다시 선택 가능하도록)
        event.target.value = '';
      },
      
      // 파일 삭제
      removeFile(index) {
        this.form.attachments.splice(index, 1);
      },
      
      // 파일 크기 포맷팅
      formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      },
      
      // 필드 검증
      validateField(field) {
        switch (field) {
          case 'category':
            this.errors.category = !this.form.category ? '문의 유형을 선택해주세요.' : null;
            break;
          case 'title':
            this.errors.title = !this.form.title ? '제목을 입력해주세요.' : null;
            break;
          case 'content':
            this.errors.content = !this.form.content ? '내용을 입력해주세요.' : null;
            break;
        }
        
        return !this.errors[field];
      },
      
      // 모든 필드 검증
      validateForm() {
        this.validateField('category');
        this.validateField('title');
        this.validateField('content');
        
        return !this.errors.category && !this.errors.title && !this.errors.content && !this.errors.attachments;
      },
      
      // 폼 제출
      submitForm() {
        if (this.validateForm()) {
          this.$emit('submit', { ...this.form });
        }
      },
      
      // 폼 초기화
      resetForm() {
        this.form = {
          category: '',
          title: '',
          content: '',
          attachments: []
        };
        
        this.errors = {
          category: null,
          title: null,
          content: null,
          attachments: null
        };
      }
    }
  };
  </script>
  
  <style scoped>
  .inquiry-form-component {
    width: 100%;
  }
  
  .inquiry-form {
    background-color: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
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
  
  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.2s;
  }
  
  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #229799;
  }
  
  .form-error {
    font-size: 12px;
    color: #ef4444;
    margin-top: 4px;
  }
  
  .file-input-container {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .file-input-label {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background-color: #f8fafc;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 14px;
    color: #1e293b;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .file-input-label:hover {
    background-color: #f1f5f9;
  }
  
  .hidden-file-input {
    display: none;
  }
  
  .file-info {
    font-size: 12px;
    color: #94a3b8;
  }
  
  .attachments-list {
    margin-top: 12px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    overflow: hidden;
  }
  
  .attachment-item {
    display: flex;
    align-items: center;
    padding: 10px 12px;
    border-bottom: 1px solid #e5e7eb;
    background-color: #f8fafc;
  }
  
  .attachment-item:last-child {
    border-bottom: none;
  }
  
  .attachment-item svg {
    color: #64748b;
    margin-right: 8px;
  }
  
  .file-name {
    flex: 1;
    font-size: 14px;
    color: #1e293b;
    margin-right: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .file-size {
    font-size: 12px;
    color: #94a3b8;
    white-space: nowrap;
    margin-right: 8px;
  }
  
  .remove-file-btn {
    background: none;
    border: none;
    color: #ef4444;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 4px;
    transition: background-color 0.2s;
    border-radius: 4px;
  }
  
  .remove-file-btn:hover {
    background-color: rgba(239, 68, 68, 0.1);
  }
  
  .form-actions {
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
  
  .btn-cancel {
    background-color: white;
    color: #64748b;
    border: 1px solid #e5e7eb;
  }
  
  .btn-cancel:hover {
    background-color: #f8fafc;
  }
  
  .btn-submit {
    background-color: #229799;
    color: white;
    border: none;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .btn-submit:hover:not(:disabled) {
    background-color: #1a7a7c;
  }
  
  .btn-submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .spinner {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @media (max-width: 768px) {
    .form-actions {
      flex-direction: column;
    }
    
    .btn {
      width: 100%;
    }
  }
  </style>
<!-- src/components/partner/inquiry/InquiryDetailModal.vue -->
<template>
    <div class="modal-overlay" @click="$emit('close')">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">문의 상세</h3>
          <button class="close-btn" @click="$emit('close')">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="inquiry-detail-header">
            <span class="inquiry-category-badge">{{ getCategoryText(inquiry.category) }}</span>
            <span class="inquiry-status-badge" :class="inquiry.status">
              {{ getStatusText(inquiry.status) }}
            </span>
          </div>
          
          <h2 class="inquiry-detail-title">{{ inquiry.title }}</h2>
          
          <div class="inquiry-detail-meta">
            <div class="inquiry-date">문의일: {{ formatDate(inquiry.createdAt) }}</div>
          </div>
          
          <div class="inquiry-detail-content">
            <p v-for="(paragraph, index) in inquiryContentParagraphs" :key="index">
              {{ paragraph }}
            </p>
          </div>
          
          <div v-if="inquiry.attachments && inquiry.attachments.length > 0" class="inquiry-attachments">
            <h4 class="attachments-title">첨부파일</h4>
            <ul class="attachments-list-detail">
              <li v-for="(attachment, index) in inquiry.attachments" :key="index" class="attachment-detail-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                  <polyline points="13 2 13 9 20 9"></polyline>
                </svg>
                <a :href="attachment.url" target="_blank" class="attachment-link">
                  {{ attachment.name }}
                </a>
                <span class="attachment-size">{{ formatFileSize(attachment.size) }}</span>
              </li>
            </ul>
          </div>
          
          <!-- 답변 섹션 -->
          <div v-if="inquiry.status === 'answered'" class="inquiry-answer-section">
            <h4 class="answer-title">답변</h4>
            <div class="answer-meta">
              <div class="answer-date">답변일: {{ formatDate(inquiry.answeredAt) }}</div>
            </div>
            <div class="answer-content">
              <p v-for="(paragraph, index) in answerContentParagraphs" :key="index">
                {{ paragraph }}
              </p>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-outline" @click="$emit('close')">닫기</button>
          <button v-if="inquiry.status === 'pending'" class="btn btn-primary" @click="$emit('create-new')">
            새 문의 작성
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'InquiryDetailModal',
    props: {
      inquiry: {
        type: Object,
        required: true
      }
    },
    emits: ['close', 'create-new'],
    computed: {
      // 문의 내용을 단락으로 분리
      inquiryContentParagraphs() {
        return this.inquiry.content.split('\n').filter(p => p.trim() !== '');
      },
      
      // 답변을 단락으로 분리
      answerContentParagraphs() {
        if (!this.inquiry.answer) return [];
        return this.inquiry.answer.split('\n').filter(p => p.trim() !== '');
      }
    },
    methods: {
      // 카테고리 텍스트 반환
      getCategoryText(category) {
        switch (category) {
          case 'account':
            return '계정 문의';
          case 'campaign':
            return '캠페인 문의';
          case 'payment':
            return '결제 문의';
          case 'reviewer':
            return '리뷰어 문의';
          case 'other':
            return '기타 문의';
          default:
            return '기타';
        }
      },
      
      // 상태 텍스트 반환
      getStatusText(status) {
        switch (status) {
          case 'pending':
            return '대기중';
          case 'answered':
            return '답변완료';
          default:
            return '알 수 없음';
        }
      },
      
      // 날짜 포맷팅
      formatDate(dateString) {
        const date = new Date(dateString);
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
      },
      
      // 파일 크기 포맷팅
      formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      }
    }
  };
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
    flex: 1;
    overflow-y: auto;
    padding: 20px;
  }
  
  .inquiry-detail-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
  }
  
  .inquiry-category-badge {
    font-size: 12px;
    font-weight: 500;
    padding: 4px 8px;
    border-radius: 4px;
    background-color: #f1f5f9;
    color: #64748b;
  }
  
  .inquiry-status-badge {
    font-size: 12px;
    font-weight: 500;
    padding: 4px 8px;
    border-radius: 4px;
  }
  
  .inquiry-status-badge.pending {
    background-color: #f1f5f9;
    color: #64748b;
  }
  
  .inquiry-status-badge.answered {
    background-color: #e8f7f6;
    color: #229799;
  }
  
  .inquiry-detail-title {
    font-size: 20px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 12px;
  }
  
  .inquiry-detail-meta {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
    font-size: 14px;
    color: #64748b;
  }
  
  .inquiry-detail-content {
    background-color: #f8fafc;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 24px;
  }
  
  .inquiry-detail-content p {
    margin: 0 0 12px;
    line-height: 1.6;
    color: #1e293b;
  }
  
  .inquiry-detail-content p:last-child {
    margin-bottom: 0;
  }
  
  .inquiry-attachments {
    margin-bottom: 24px;
  }
  
  .attachments-title {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 12px;
  }
  
  .attachments-list-detail {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .attachment-detail-item {
    display: flex;
    align-items: center;
    padding: 10px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    background-color: #f8fafc;
    margin-bottom: 8px;
  }
  
  .attachment-detail-item:last-child {
    margin-bottom: 0;
  }
  
  .attachment-detail-item svg {
    color: #64748b;
    margin-right: 8px;
  }
  
  .attachment-link {
    flex: 1;
    font-size: 14px;
    color: #229799;
    text-decoration: none;
    margin-right: 8px;
  }
  
  .attachment-link:hover {
    text-decoration: underline;
  }
  
  .attachment-size {
    font-size: 12px;
    color: #94a3b8;
  }
  
  .inquiry-answer-section {
    background-color: #f0fdf4;
    padding: 16px;
    border-radius: 8px;
    border-left: 3px solid #10b981;
  }
  
  .answer-title {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 8px;
  }
  
  .answer-meta {
    margin-bottom: 12px;
    font-size: 14px;
    color: #64748b;
  }
  
  .answer-content {
    color: #1e293b;
  }
  
  .answer-content p {
    margin: 0 0 12px;
    line-height: 1.6;
  }
  
  .answer-content p:last-child {
    margin-bottom: 0;
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    padding: 20px;
    border-top: 1px solid #e5e7eb;
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
  
  .btn-primary {
    background-color: #229799;
    color: white;
    border: none;
  }
  
  .btn-primary:hover {
    background-color: #1a7a7c;
  }
  
  @media (max-width: 768px) {
    .modal-footer {
      flex-direction: column;
    }
    
    .btn {
      width: 100%;
    }
  }
  </style>
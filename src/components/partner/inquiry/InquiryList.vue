<!-- src/components/partner/inquiry/InquiryList.vue -->
<template>
    <div class="inquiry-list-component">
      <!-- 필터 및 검색 -->
      <div class="filter-container">
        <div class="search-bar">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="문의 검색" 
            :value="searchQuery"
            @input="$emit('update:searchQuery', $event.target.value)"
          />
        </div>
        
        <div class="filter-options">
          <div class="status-filter">
            <label for="status-select">상태:</label>
            <select 
              id="status-select" 
              :value="statusFilter" 
              @change="$emit('update:statusFilter', $event.target.value)"
            >
              <option value="all">전체</option>
              <option value="pending">대기중</option>
              <option value="answered">답변완료</option>
            </select>
          </div>
          
          <div class="category-filter">
            <label for="category-select">유형:</label>
            <select 
              id="category-select" 
              :value="categoryFilter" 
              @change="$emit('update:categoryFilter', $event.target.value)"
            >
              <option value="all">전체</option>
              <option value="account">계정 문의</option>
              <option value="campaign">캠페인 문의</option>
              <option value="payment">결제 문의</option>
              <option value="reviewer">리뷰어 문의</option>
              <option value="other">기타 문의</option>
            </select>
          </div>
        </div>
      </div>
  
      <!-- 문의 목록 -->
      <div v-if="inquiries.length > 0" class="inquiry-list">
        <div 
          v-for="inquiry in inquiries" 
          :key="inquiry.id" 
          class="inquiry-item"
          :class="{ 'unread': inquiry.status === 'answered' && !inquiry.isRead }"
          @click="$emit('view-detail', inquiry.id)"
        >
          <div class="inquiry-status" :class="inquiry.status">
            {{ getStatusText(inquiry.status) }}
          </div>
          <div class="inquiry-content">
            <div class="inquiry-category">{{ getCategoryText(inquiry.category) }}</div>
            <h3 class="inquiry-title">{{ inquiry.title }}</h3>
            <p class="inquiry-preview">{{ inquiry.content }}</p>
          </div>
          <div class="inquiry-meta">
            <div class="inquiry-date">{{ formatDate(inquiry.createdAt) }}</div>
            <div v-if="inquiry.status === 'answered'" class="inquiry-answer-date">
              답변: {{ formatDate(inquiry.answeredAt) }}
            </div>
          </div>
          <div v-if="inquiry.status === 'answered' && !inquiry.isRead" class="new-answer-badge">
            새 답변
          </div>
        </div>
      </div>
      
      <!-- 검색 결과 없음 -->
      <div v-else class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p v-if="searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'">
          검색 결과가 없습니다. 다른 검색어나 필터를 사용해보세요.
        </p>
        <p v-else>
          등록된 문의 내역이 없습니다. 
          <button class="empty-create-btn" @click="$emit('create-new')">
            새 문의 작성하기
          </button>
        </p>
      </div>
      
      <!-- 페이지네이션 -->
      <div v-if="inquiries.length > 0" class="pagination">
        <button 
          class="pagination-btn" 
          :disabled="currentPage === 1"
          @click="$emit('change-page', currentPage - 1)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div class="page-numbers">
          <button 
            v-for="page in displayedPages" 
            :key="page" 
            class="page-number" 
            :class="{ active: currentPage === page }"
            @click="$emit('change-page', page)"
          >
            {{ page }}
          </button>
        </div>
        <button 
          class="pagination-btn" 
          :disabled="currentPage === totalPages"
          @click="$emit('change-page', currentPage + 1)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'InquiryList',
    props: {
      inquiries: {
        type: Array,
        required: true
      },
      searchQuery: {
        type: String,
        default: ''
      },
      statusFilter: {
        type: String,
        default: 'all'
      },
      categoryFilter: {
        type: String,
        default: 'all'
      },
      currentPage: {
        type: Number,
        default: 1
      },
      totalPages: {
        type: Number,
        default: 1
      },
      displayedPages: {
        type: Array,
        default: () => [1]
      }
    },
    emits: [
      'update:searchQuery', 
      'update:statusFilter', 
      'update:categoryFilter',
      'view-detail',
      'change-page',
      'create-new'
    ],
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
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
      }
    }
  };
  </script>
  
  <style scoped>
  .inquiry-list-component {
    width: 100%;
  }
  
  /* 필터 컨테이너 */
  .filter-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 16px;
  }
  
  .search-bar {
    position: relative;
    max-width: 300px;
    width: 100%;
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
    padding: 10px 10px 10px 40px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.2s;
  }
  
  .search-bar input:focus {
    outline: none;
    border-color: #229799;
  }
  
  .filter-options {
    display: flex;
    gap: 16px;
  }
  
  .status-filter, .category-filter {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .status-filter label, .category-filter label {
    font-size: 14px;
    color: #64748b;
  }
  
  .status-filter select, .category-filter select {
    padding: 8px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.2s;
  }
  
  .status-filter select:focus, .category-filter select:focus {
    outline: none;
    border-color: #229799;
  }
  
  /* 문의 목록 */
  .inquiry-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;
  }
  
  .inquiry-item {
    position: relative;
    display: flex;
    background-color: white;
    border: 1px solid #f1f5f9;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .inquiry-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .inquiry-item.unread {
    border-left: 3px solid #48CFCB;
  }
  
  .inquiry-status {
    width: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 500;
  }
  
  .inquiry-status.pending {
    background-color: #f1f5f9;
    color: #64748b;
  }
  
  .inquiry-status.answered {
    background-color: #e8f7f6;
    color: #229799;
  }
  
  .inquiry-content {
    flex: 1;
    padding: 16px;
    border-left: 1px solid #f1f5f9;
    border-right: 1px solid #f1f5f9;
  }
  
  .inquiry-category {
    display: inline-block;
    font-size: 12px;
    color: #64748b;
    margin-bottom: 8px;
  }
  
  .inquiry-title {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 8px;
  }
  
  .inquiry-preview {
    font-size: 14px;
    color: #64748b;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .inquiry-meta {
    width: 120px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
  }
  
  .inquiry-date, .inquiry-answer-date {
    font-size: 12px;
    color: #94a3b8;
    white-space: nowrap;
  }
  
  .new-answer-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #48CFCB;
    color: white;
    font-size: 10px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 10px;
  }
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 0;
    color: #94a3b8;
  }
  
  .empty-state svg {
    color: #e5e7eb;
    margin-bottom: 20px;
  }
  
  .empty-state p {
    font-size: 16px;
    margin: 0;
  }
  
  .empty-create-btn {
    background: none;
    border: none;
    color: #229799;
    font-size: 16px;
    cursor: pointer;
    margin-top: 8px;
  }
  
  .empty-create-btn:hover {
    text-decoration: underline;
  }
  
  /* 페이지네이션 */
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 32px;
    gap: 8px;
  }
  
  .pagination-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
    background-color: white;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .pagination-btn:not(:disabled):hover {
    border-color: #229799;
    color: #229799;
  }
  
  .page-numbers {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .page-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
    background-color: white;
    color: #64748b;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .page-number:hover {
    border-color: #229799;
    color: #229799;
  }
  
  .page-number.active {
    background-color: #229799;
    color: white;
    border-color: #229799;
  }
  
  @media (max-width: 768px) {
    .filter-container {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .search-bar {
      max-width: 100%;
    }
    
    .filter-options {
      width: 100%;
      flex-direction: column;
    }
    
    .status-filter, .category-filter {
      width: 100%;
    }
    
    .status-filter select, .category-filter select {
      width: 100%;
    }
    
    .inquiry-item {
      flex-direction: column;
    }
    
    .inquiry-status {
      width: 100%;
      padding: 8px 0;
    }
    
    .inquiry-content {
      border-left: none;
      border-right: none;
      border-top: 1px solid #f1f5f9;
      border-bottom: 1px solid #f1f5f9;
    }
    
    .inquiry-meta {
      width: 100%;
      flex-direction: row;
      justify-content: space-between;
    }
  }
  </style>
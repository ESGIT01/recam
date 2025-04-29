<!-- src/components/partner/dashboard/NoticeList.vue -->
<template>
    <div class="notice-section">
      <div class="content-card">
        <div class="card-header">
          <h2 class="card-title">리뷰캠퍼스 파트너센터 공지사항</h2>
          <router-link to="/partner/notices" class="card-link">
            모두 보기
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </router-link>
        </div>
        <div class="card-content">
          <div class="notice-list">
            <router-link 
              :to="`/partner/notices/${notice.id}`" 
              class="notice-item" 
              v-for="(notice, index) in notices" 
              :key="index"
            >
              <div class="notice-content">
                <div class="notice-title">{{ notice.title }}</div>
                <div class="notice-date">{{ notice.date }}</div>
              </div>
              <div class="notice-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'NoticeList',
    props: {
      notices: {
        type: Array,
        required: true
      }
    }
  });
  </script>
  
  <style scoped>
  .notice-section {
    margin-bottom: 24px;
  }
  
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
  
  .card-link {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    color: #229799;
    text-decoration: none;
    transition: color 0.2s;
  }
  
  .card-link:hover {
    color: #1d8385;
    text-decoration: none;
  }
  
  .card-content {
    padding: 0 20px 20px;
  }
  
  .notice-list {
    display: flex;
    flex-direction: column;
    margin-top: 16px;
  }
  
  .notice-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #f1f5f9;
    color: inherit;
    text-decoration: none;
    transition: background-color 0.2s;
  }
  
  .notice-item:last-child {
    border-bottom: none;
  }
  
  .notice-item:hover {
    background-color: #f8fafc;
  }
  
  .notice-content {
    flex: 1;
  }
  
  .notice-title {
    font-size: 15px;
    font-weight: 500;
    color: #1e293b;
    margin-bottom: 6px;
  }
  
  .notice-date {
    font-size: 12px;
    color: #64748b;
  }
  
  .notice-arrow {
    color: #94a3b8;
  }
  </style>
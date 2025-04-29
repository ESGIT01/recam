<!-- src/components/partner/dashboard/StatisticsSection.vue -->
<template>
    <div class="stats-section">
      <div class="section-header">
        <h2 class="section-title">캠페인 현황</h2>
        <div class="date-range">
          <span class="date-label">{{ currentMonth }}</span>
          <button class="date-selector">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </button>
        </div>
      </div>
      
      <div class="stats-grid">
        <stat-card 
          v-for="(stat, index) in statistics" 
          :key="index" 
          :stat="stat" 
        />
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent } from 'vue';
  import StatCard from '@/components/partner/common/StatCard.vue';
  
  export default defineComponent({
    name: 'StatisticsSection',
    components: {
      StatCard
    },
    props: {
      statistics: {
        type: Array,
        required: true
      },
      currentMonth: {
        type: String,
        required: true
      }
    }
  });
  </script>
  
  <style scoped>
  .stats-section {
    margin-bottom: 24px;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: #424242;
    margin: 0;
  }
  
  .date-range {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .date-label {
    font-size: 14px;
    color: #5c6a7e;
  }
  
  .date-selector {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    border: 1px solid #e6e6e6;
    background-color: white;
    color: #5c6a7e;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .date-selector:hover {
    border-color: #229799;
    color: #229799;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  
  /* 반응형 스타일 */
  @media (max-width: 1280px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 768px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>
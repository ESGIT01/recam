<!-- src/components/partner/common/StatCard.vue -->
<template>
    <div class="stat-card">
      <div class="stat-content">
        <div class="stat-value" :style="{ color: stat.color }">{{ stat.value }}</div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
      <div class="stat-icon" :style="{ backgroundColor: stat.bgColor }">
        <div v-html="getSvgIcon(stat.icon)"></div>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'StatCard',
    props: {
      stat: {
        type: Object,
        required: true
      }
    },
    methods: {
      // 아이콘 SVG 문자열 반환
      getSvgIcon(iconName) {
        const icons = {
          campaign: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                    </svg>`,
          pending: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="6" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>`,
          waiting: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>`,
          active: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>`,
          completed: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>`,
          reviews: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>`
        };
        
        return icons[iconName] || '';
      }
    }
  });
  </script>
  
  <style scoped>
  .stat-card {
    background-color: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    position: relative;
  }
  
  .stat-content {
    flex: 1;
  }
  
  .stat-value {
    font-size: 30px;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 8px;
  }
  
  .stat-label {
    font-size: 14px;
    color: #5c6a7e;
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 12px;
  }
  
  /* CSS 변수 사용 버전 */
  @media (prefers-reduced-motion: no-preference) {
    .stat-card {
      background-color: var(--color-bg-white, white);
    }
  
    .stat-value {
      color: var(--color-text-primary, #2c3e50);
    }
  
    .stat-label {
      color: var(--color-text-secondary, #5c6a7e);
    }
  }
  </style>
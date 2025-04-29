<!-- src/components/partner/reviews/ReviewStatsCard.vue -->
<template>
    <div class="stats-card" :class="{ 'is-alert': isAlert }">
      <div class="stats-icon" :style="{ backgroundColor: bgColor }">
        <svg v-if="icon === 'file-text'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        <svg v-else-if="icon === 'calendar'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <svg v-else-if="icon === 'star'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
        <svg v-else-if="icon === 'alert-circle'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      
      <div class="stats-content">
        <div class="stats-title">{{ title }}</div>
        <div class="stats-value">
          {{ value }}<span v-if="suffix" class="stats-suffix">{{ suffix }}</span>
        </div>
        <div v-if="change !== null" class="stats-change" :class="{ 'positive': change > 0, 'negative': change < 0 }">
          <svg v-if="change > 0" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
          <svg v-else-if="change < 0" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
          <span>{{ Math.abs(change).toFixed(1) }}% {{ changeLabel }}</span>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ReviewStatsCard',
    props: {
      title: {
        type: String,
        required: true
      },
      value: {
        type: [Number, String],
        required: true
      },
      suffix: {
        type: String,
        default: null
      },
      icon: {
        type: String,
        required: true
      },
      color: {
        type: String,
        default: '#229799'
      },
      change: {
        type: Number,
        default: null
      },
      changeLabel: {
        type: String,
        default: ''
      },
      isAlert: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      bgColor() {
        return `${this.color}20`; // 20% opacity version of the color
      }
    }
  };
  </script>
  
  <style scoped>
  .stats-card {
    background-color: white;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    align-items: flex-start;
    gap: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    transition: box-shadow 0.2s, transform 0.2s;
    border: 1px solid #f1f5f9;
  }
  
  .stats-card:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
  
  .stats-card.is-alert {
    border-left: 3px solid #F97066;
  }
  
  .stats-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #229799;
  }
  
  .stats-content {
    flex: 1;
  }
  
  .stats-title {
    font-size: 14px;
    color: #64748b;
    margin-bottom: 4px;
  }
  
  .stats-value {
    font-size: 24px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 4px;
  }
  
  .stats-suffix {
    font-size: 14px;
    color: #64748b;
    font-weight: 400;
    margin-left: 2px;
  }
  
  .stats-change {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 500;
  }
  
  .stats-change.positive {
    color: #10b981;
  }
  
  .stats-change.negative {
    color: #ef4444;
  }
  
  @media (max-width: 768px) {
    .stats-card {
      padding: 12px;
    }
    
    .stats-value {
      font-size: 20px;
    }
  }
  </style>
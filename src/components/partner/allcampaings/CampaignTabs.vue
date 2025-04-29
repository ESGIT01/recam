<!-- src/components/partner/campaigns/CampaignTabs.vue -->
<template>
    <div class="tabs-container">
      <div class="tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id" 
          class="tab" 
          :class="{ 'active': activeTab === tab.id }"
          @click="onTabClick(tab.id)"
        >
          {{ tab.label }}
          <span class="tab-count">{{ tab.count }}</span>
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'CampaignTabs',
    props: {
      tabs: {
        type: Array,
        required: true
      },
      activeTab: {
        type: String,
        required: true
      }
    },
    emits: ['change-tab'],
    setup(props, { emit }) {
      const onTabClick = (tabId) => {
        emit('change-tab', tabId);
      };
      
      return {
        onTabClick
      };
    }
  });
  </script>
  
  <style scoped>
  .tabs-container {
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 20px;
  }
  
  .tabs {
    display: flex;
    overflow-x: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
  }
  
  .tabs::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  
  .tab {
    padding: 12px 20px;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    color: #64748b;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .tab:hover {
    color: #229799;
  }
  
  .tab.active {
    color: #229799;
    border-bottom-color: #229799;
  }
  
  .tab-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    border-radius: 10px;
    background-color: #f1f5f9;
    color: #64748b;
    font-size: 12px;
    font-weight: 600;
  }
  
  .tab.active .tab-count {
    background-color: rgba(34, 151, 153, 0.1);
    color: #229799;
  }
  
  @media (max-width: 640px) {
    .tab {
      padding: 12px 16px;
    }
  }
  </style>
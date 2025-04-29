<!-- src/components/partner/faq/FaqSearch.vue -->
<template>
    <div class="faq-search">
      <div class="search-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input 
          type="text" 
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          placeholder="질문 검색하기" 
          class="search-input"
        />
        <button 
          v-if="modelValue" 
          class="clear-btn" 
          @click="$emit('update:modelValue', '')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="popular-queries" v-if="popularQueries && popularQueries.length > 0">
        <span class="popular-label">인기 검색어:</span>
        <div class="query-tags">
          <button 
            v-for="query in popularQueries" 
            :key="query"
            @click="$emit('update:modelValue', query)"
            class="query-tag"
          >
            {{ query }}
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FaqSearch',
    props: {
      modelValue: {
        type: String,
        required: true
      },
      popularQueries: {
        type: Array,
        default: () => []
      }
    },
    emits: ['update:modelValue']
  }
  </script>
  
  <style scoped>
  .faq-search {
    margin-bottom: 32px;
  }
  
  .search-container {
    position: relative;
    width: 100%;
  }
  
  .search-container svg {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #64748b;
  }
  
  .search-input {
    width: 100%;
    padding: 14px 16px 14px 48px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 16px;
    color: #424242;
    background-color: white;
    transition: border-color 0.3s;
  }
  
  .search-input:focus {
    outline: none;
    border-color: #229799;
    box-shadow: 0 0 0 2px rgba(34, 151, 153, 0.2);
  }
  
  .clear-btn {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border-radius: 50%;
  }
  
  .clear-btn:hover {
    background-color: #f1f5f9;
  }
  
  .popular-queries {
    display: flex;
    align-items: center;
    margin-top: 12px;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .popular-label {
    font-size: 14px;
    color: #64748b;
  }
  
  .query-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .query-tag {
    background-color: #f1f5f9;
    color: #424242;
    border: none;
    border-radius: 16px;
    padding: 4px 12px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .query-tag:hover {
    background-color: #e2e8f0;
  }
  </style>
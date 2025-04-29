<!-- src/components/partner/faq/FaqCategory.vue -->
<template>
    <div class="faq-category">
      <h2 class="category-title">{{ title }}</h2>
      <div class="category-items">
        <faq-item 
          v-for="item in items" 
          :key="item.id" 
          :question="item.question" 
          :answer="item.answer"
        />
      </div>
    </div>
  </template>
  
  <script>
  import FaqItem from './FaqItem.vue';
  
  export default {
    name: 'FaqCategory',
    components: {
      FaqItem
    },
    props: {
      title: {
        type: String,
        required: true
      },
      items: {
        type: Array,
        required: true
      }
    }
  }
  </script>
  
  <style scoped>
  .faq-category {
    margin-bottom: 32px;
  }
  
  .category-title {
    font-size: 20px;
    font-weight: 600;
    color: #424242;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 2px solid #48CFCB;
  }
  
  .category-items {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  </style>
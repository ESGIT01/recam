<!-- src/components/partner/faq/FaqItem.vue -->
<template>
    <div class="faq-item" :class="{ 'active': isOpen }">
      <div class="faq-question" @click="toggleOpen">
        <h3>{{ question }}</h3>
        <div class="toggle-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline v-if="isOpen" points="18 15 12 9 6 15"></polyline>
            <polyline v-else points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
      <transition name="fade">
        <div v-if="isOpen" class="faq-answer">
          <div v-html="answer"></div>
        </div>
      </transition>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FaqItem',
    props: {
      question: {
        type: String,
        required: true
      },
      answer: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        isOpen: false
      }
    },
    methods: {
      toggleOpen() {
        this.isOpen = !this.isOpen;
      }
    }
  }
  </script>
  
  <style scoped>
  .faq-item {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    margin-bottom: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  .faq-item.active {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  .faq-question {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background-color: white;
    cursor: pointer;
  }
  
  .faq-question h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    color: #424242;
  }
  
  .toggle-icon {
    color: #229799;
    transition: transform 0.3s ease;
  }
  
  .faq-answer {
    padding: 0 16px 16px 16px;
    color: #64748b;
    line-height: 1.6;
    background-color: #F5F5F5;
  }
  
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s, max-height 0.3s;
    max-height: 500px;
    overflow: hidden;
  }
  
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
    max-height: 0;
  }
  </style>
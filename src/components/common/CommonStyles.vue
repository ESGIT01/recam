<!-- src/components/common/CommonStyles.vue -->
<template>
    <div>
      <slot></slot>
    </div>
  </template>
  
  <style>
  /* 프리텐다드 폰트 */
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
  
  /* 브랜드 컬러 변수 */
  :root {
    --primary-light: #F5F5F5;
    --primary: #48CFCB;
    --primary-dark: #229799;
    --text-dark: #424242;
  }
  
  /* 기본 스타일 */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  }
  
  .container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 20px;
  }
  </style>
  
  <script>
  export default {
    name: 'CommonStyles'
  }
  </script>
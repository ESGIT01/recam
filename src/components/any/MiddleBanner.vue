<!-- MiddleBanner.vue -->
<template>
    <section class="middle-banner-section">
      <a :href="linkUrl" target="_blank" rel="noopener noreferrer" class="banner-link">
        <img :src="bannerImage" alt="배너 이미지" class="banner-image">
      </a>
    </section>
  </template>
  
  <script>
  export default {
    name: 'MiddleBanner',
    props: {
      bannerImage: {
        type: String,
        default: '/assets/baaners/kakao-channel-banner.png'
      },
      linkUrl: {
        type: String,
        default: 'https://www.naver.com'
      }
    }
  }
  </script>
  
  <style scoped>
  .middle-banner-section {
    width: 100%;
    margin: 48px 0;
    padding: 0 16px;
  }
  
  .banner-link {
    display: block;
    max-width: 1200px;
    margin: 0 auto;
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.2s ease;
  }
  
  .banner-link:hover {
    transform: translateY(-4px);
  }
  
  .banner-image {
    width: 100%;
    height: auto;
    vertical-align: middle;
  }
  
  @media (max-width: 768px) {
    .middle-banner-section {
      margin: 32px 0;
    }
  }
  </style>
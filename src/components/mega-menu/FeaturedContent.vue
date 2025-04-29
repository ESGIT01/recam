<!-- src/components/mega-menu/FeaturedContent.vue -->
<template>
    <div class="mega-menu-featured">
      <div class="featured-header">
        <h3 class="featured-title">추천 {{ title }} 캠페인</h3>
        <router-link :to="path" class="view-all">
          전체보기
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </router-link>
      </div>
      <div class="featured-content">
        <div class="featured-item">
          <div class="featured-image">
            <div class="image-placeholder"></div>
          </div>
          <div class="featured-info">
            <div class="featured-badge">NEW</div>
            <h4 class="featured-name">인기 {{ title }} {{ index + 1 }}</h4>
            <p class="featured-desc">인기 {{ title }} 서비스에 대한 간략한 설명이 들어갑니다.</p>
          </div>
        </div>
        <div class="featured-item">
          <div class="featured-image">
            <div class="image-placeholder"></div>
          </div>
          <div class="featured-info">
            <div class="featured-badge">HOT</div>
            <h4 class="featured-name">베스트 {{ title }} {{ index + 2 }}</h4>
            <p class="featured-desc">베스트 {{ title }} 상품에 대한 간략한 설명이 들어갑니다.</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FeaturedContent',
    props: {
      title: {
        type: String,
        required: true
      },
      path: {
        type: String,
        required: true
      },
      index: {
        type: Number,
        default: 0
      }
    }
  }
  </script>
  
  <style scoped>
  .mega-menu-featured {
    flex: 0 0 300px;
    border-right: 1px solid rgba(0,0,0,0.08);
    padding-right: 30px;
  }
  
  .featured-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .featured-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-dark);
    margin: 0;
    letter-spacing: -0.02em;
  }
  
  .view-all {
    display: flex;
    align-items: center;
    gap: 5px;
    color: var(--primary-dark);
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: color 0.2s ease;
  }
  
  .view-all:hover {
    color: #1a7477;
  }
  
  .featured-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .featured-item {
    display: flex;
    gap: 15px;
    padding: 12px;
    border-radius: 10px;
    background-color: white;
    transition: all 0.2s ease;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  }
  
  .featured-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.08);
  }
  
  .featured-image {
    flex: 0 0 70px;
  }
  
  .image-placeholder {
    width: 70px;
    height: 70px;
    background-color: var(--primary-light);
    border-radius: 8px;
    position: relative;
    overflow: hidden;
  }
  
  .image-placeholder::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(72, 207, 203, 0.2), rgba(34, 151, 153, 0.3));
  }
  
  .featured-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 4px 0;
  }
  
  .featured-badge {
    display: inline-block;
    padding: 3px 8px;
    background-color: var(--primary);
    color: white;
    font-size: 10px;
    font-weight: 700;
    border-radius: 4px;
    margin-bottom: 8px;
    letter-spacing: 0.03em;
    align-self: flex-start;
  }
  
  .featured-name {
    font-size: 15px;
    font-weight: 600;
    margin: 0 0 5px 0;
    color: var(--text-dark);
    letter-spacing: -0.01em;
  }
  
  .featured-desc {
    font-size: 12px;
    color: #6B6B6B;
    margin: 0;
    line-height: 1.5;
  }
  
  /* 반응형 디자인 */
  @media (max-width: 1199px) {
    .mega-menu-featured {
      flex-basis: 250px;
      padding-right: 20px;
    }
    
    .featured-image {
      flex-basis: 60px;
    }
    
    .image-placeholder {
      width: 60px;
      height: 60px;
    }
  }
  
  @media (max-width: 768px) {
    .mega-menu-featured {
      flex-basis: auto;
      border-right: none;
      border-bottom: 1px solid rgba(0,0,0,0.08);
      padding-right: 0;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }
  }
  </style>
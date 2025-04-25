<!-- AdvertiserCard.vue -->
<template>
    <div class="advertiser-card">
      <div class="card-image">
        <img :src="require('@/assets/logo.png')" alt="무료 체험단 모집" />
        <div class="overlay">
          <div class="badge">FREE</div>
        </div>
      </div>
      
      <div class="card-content">
        <div class="card-type">[무료 체험단 모집]</div>
        
        <div class="card-title">광고주님의 체험단을 무료로 등록하세요</div>
        
        <p class="card-description">최대 5명 모집 가능, 100% 무료 서비스</p>
        
        <div class="card-footer">
          <div class="register-btn">신청하기</div>
          <div class="service-info">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>제한 없음</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AdvertiserCard'
  };
  </script>
  
  <style scoped>
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
  
  .advertiser-card {
    font-family: 'Pretendard', sans-serif;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    background-color: white;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    border: 2px solid #229799;
  }
  
  .advertiser-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(34, 151, 153, 0.2);
  }
  
  .card-image {
    position: relative;
    padding-top: 100%; /* 정사각형 (1:1 비율) */
    overflow: hidden;
    background: linear-gradient(135deg, #48CFCB, #229799);
  }
  
  .card-image img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    opacity: 0.85;
  }
  
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    padding: 10px;
  }
  
  .badge {
    background-color: #FF3B30;
    color: white;
    font-size: 12px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 4px;
  }
  
  .card-content {
    padding: 14px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-height: 140px; /* 최소 높이로 컨텐츠 영역 통일 */
  }
  
  .card-type {
    color: #229799;
    font-weight: 600;
    font-size: 13px;
    margin-bottom: 6px;
  }
  
  .card-title {
    font-weight: 700;
    font-size: 15px;
    color: #424242;
    margin-bottom: 6px;
    line-height: 1.4;
    height: 2.8em; /* 2줄로 제한 */
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  
  .card-description {
    color: #666;
    font-size: 13px;
    margin-bottom: 10px;
    line-height: 1.4;
    height: 2.8em; /* 2줄로 제한 */
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    flex-grow: 1;
  }
  
  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
  }
  
  .register-btn {
    background-color: #229799;
    color: white;
    font-size: 12px;
    font-weight: 600;
    padding: 5px 12px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .register-btn:hover {
    background-color: #1b8486;
  }
  
  .service-info {
    display: flex;
    align-items: center;
    color: #999;
    font-size: 12px;
  }
  
  .service-info svg {
    margin-right: 4px;
    width: 14px;
    height: 14px;
  }
  </style>
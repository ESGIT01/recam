<!-- src/components/header/UtilityArea.vue -->
<template>
    <div class="utility-area">
      <div class="utility-links">
        <router-link to="/today" class="utility-link highlight">오늘오픈</router-link>
        <router-link to="/event" class="utility-link highlight">이벤트</router-link>
        <router-link to="/guide" class="utility-link highlight">이용가이드</router-link>
        <router-link to="/support" class="utility-link highlight">고객센터</router-link>
      </div>
      
      <div class="search-box">
        <input 
          type="text" 
          class="search-input" 
          placeholder="검색어를 입력하세요" 
          v-model="searchQuery"
          :class="{ 'expanded': isSearchActive }"
          @focus="handleSearchFocus"
          @blur="handleSearchBlur"
        />
        <button class="search-btn" @click="activateFullSearch">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>
      
      <router-link to="/login" class="login-btn">로그인</router-link>
      <button class="ad-inquiry-btn">
        <router-link to="/ADcenter" class="btn-text">광고문의</router-link>
        <span class="wipe-effect"></span>
      </button>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    name: 'UtilityArea',
    emits: ['activate-search'],
    setup(props, { emit }) {
      const isSearchActive = ref(false);
      const searchQuery = ref('');
      
      // 검색 포커스 핸들러
      const handleSearchFocus = () => {
        isSearchActive.value = true;
      };
      
      // 검색 블러 핸들러
      const handleSearchBlur = () => {
        if (!searchQuery.value) {
          isSearchActive.value = false;
        }
      };
      
      // 전체 검색 모드 활성화
      const activateFullSearch = () => {
        emit('activate-search', searchQuery.value);
      };
  
      return {
        isSearchActive,
        searchQuery,
        handleSearchFocus,
        handleSearchBlur,
        activateFullSearch
      };
    }
  }
  </script>
  
  <style scoped>
  .utility-area {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  /* 유틸리티 링크 */
  .utility-links {
    display: flex;
    gap: 12px;
    margin-right: 5px;
  }
  
  .utility-link {
    color: #555;
    text-decoration: none;
    font-size: 13px;
    font-weight: 400;
    padding: 5px 10px;
    transition: color 0.2s ease;
  }
  
  .utility-link:hover {
    color: var(--primary-dark);
  }
  
  .utility-link.highlight {
    color: #555;
    font-weight: 500;
  }
  
  /* 검색 */
  .search-box {
    position: relative;
    display: flex;
    align-items: center;
  }
  
  .search-input {
    border: 1px solid #ddd;
    border-radius: 20px;
    padding: 8px 35px 8px 15px;
    font-family: 'Pretendard', sans-serif;
    font-size: 14px;
    width: 50px;
    opacity: 0;
    transition: all 0.3s ease;
    outline: none;
  }
  
  .search-input.expanded {
    width: 200px;
    opacity: 1;
  }
  
  .search-btn {
    position: absolute;
    right: 5px;
    background-color: #f5f5f5;
    border: none;
    color: #444;
    cursor: pointer;
    z-index: 2;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }
  
  .search-btn:hover {
    background-color: #e8e8e8;
    color: var(--primary-dark);
  }
  
  /* 로그인 버튼 */
  .login-btn {
    font-family: 'Pretendard', sans-serif;
    font-size: 14px;
    font-weight: 500;
    background-color: white;
    color: var(--primary-dark);
    border: 1px solid var(--primary);
    border-radius: 4px;
    padding: 8px 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .login-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(72, 207, 203, 0.2) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transition: left 0.7s ease;
  }
  
  .login-btn:hover {
    background-color: #f8f8f8;
    border-color: var(--primary-dark);
  }
  
  .login-btn:hover::before {
    left: 100%;
  }
  
  /* 광고문의 버튼 */
  .ad-inquiry-btn {
    font-family: 'Pretendard', sans-serif;
    font-size: 14px;
    font-weight: 500;
    background-color: #229799;
    color: white;
    border: 1px solid #1d8385;
    border-radius: 4px;
    padding: 8px 16px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: inline-block;
    min-width: 80px;
    text-align: center;
  }
  
  .btn-text {
    position: relative;
    z-index: 2;
    color: white;
  }
  
  .wipe-effect {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: wipe 2s infinite;
  }
  
  @keyframes wipe {
    0% {
      left: -100%;
    }
    100% {
      left: 100%;
    }
  }
  
  /* 반응형 */
  @media (max-width: 1199px) {
    .utility-links {
      gap: 8px;
    }
    
    .utility-link {
      font-size: 12px;
      padding: 4px 6px;
    }
    
    .search-input.expanded {
      width: 180px;
    }
  }
  
  @media (max-width: 991px) {
    .login-btn,
    .ad-inquiry-btn {
      display: none;
    }
    
    .utility-links {
      display: none;
    }
    
    .search-box {
      margin-left: auto;
    }
    
    .utility-area {
      margin-right: 10px;
    }
  }
  
  @media (max-width: 576px) {
    .search-input.expanded {
      width: 150px;
    }
  }
  </style>
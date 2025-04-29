<!-- src/components/header/MainHeader.vue -->
<template>
    <div class="main-header">
      <div class="container">
        <!-- 로고 영역 -->
        <div class="logo-area">
          <router-link to="/" class="logo-link">
            <img src="@/assets/logo.png" alt="로고" class="logo-image">
          </router-link>
        </div>
        
        <!-- 메인 네비게이션 -->
        <MainNav 
          :menu-items="menuItems" 
          :active-menu="activeMenu"
          @menu-hover="$emit('menu-hover', $event)"
        />
        
        <!-- 우측 유틸리티 영역 (슬롯으로 수정) -->
        <slot name="utility">
          <!-- 기본 UtilityArea 대신 슬롯 사용 -->
        </slot>
        
        <!-- 모바일 메뉴 토글 버튼 -->
        <button class="mobile-toggle" @click="$emit('toggle-mobile-menu')">
          <span class="toggle-line"></span>
          <span class="toggle-line"></span>
          <span class="toggle-line"></span>
        </button>
      </div>
    </div>
  </template>
  
  <script>
  import MainNav from './MainNav.vue';
  
  export default {
    name: 'MainHeader',
    components: {
      MainNav
    },
    props: {
      menuItems: {
        type: Array,
        required: true
      },
      activeMenu: {
        type: String,
        default: null
      }
    },
    emits: ['menu-hover', 'toggle-mobile-menu']
  }
  </script>
  
  <style scoped>
  .main-header {
    background-color: white;
    border-bottom: 1px solid #eee;
    padding: 15px 0;
  }
  
  .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  /* 로고 영역 */
  .logo-area {
    flex: 0 0 auto;
    margin-right: 40px;
  }
  
  .logo-image {
    height: 35px;
    width: auto;
    display: block;
  }
  
  /* 모바일 메뉴 토글 */
  .mobile-toggle {
    display: none;
    background-color: #e8e8e8;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 40px;
    height: 40px;
    cursor: pointer;
    position: relative;
    margin-left: 15px;
  }
  
  .toggle-line {
    display: block;
    width: 22px;
    height: 2px;
    background-color: #333;
    margin: 4px auto;
  }
  
  /* 반응형 디자인 */
  @media (max-width: 991px) {
    .mobile-toggle {
      display: block;
    }
    
    .main-header .container {
      justify-content: space-between;
    }
  }
  
  @media (max-width: 576px) {
    .main-header .container {
      padding: 0 15px;
    }
    
    .logo-image {
      height: 30px;
    }
  }
  </style>
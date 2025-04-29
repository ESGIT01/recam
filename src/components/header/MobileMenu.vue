<!-- src/components/header/MobileMenu.vue -->
<template>
  <transition name="slide-right">
    <div v-if="isOpen" class="mobile-menu">
      <div class="mobile-header">
        <img src="@/assets/logo.png" alt="로고" class="mobile-logo">
        <button class="mobile-close" @click="close">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div class="mobile-content">
        <div class="mobile-search">
          <input type="text" class="mobile-search-input" placeholder="검색어를 입력하세요">
          <button class="mobile-search-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
        
        <div class="mobile-utility">
          <router-link to="/today" class="mobile-utility-link highlight">오늘오픈</router-link>
          <router-link to="/event" class="mobile-utility-link">이벤트</router-link>
          <router-link to="/guide" class="mobile-utility-link">이용가이드</router-link>
          <router-link to="/support" class="mobile-utility-link">고객센터</router-link>
        </div>
        
        <ul class="mobile-nav">
          <li v-for="(item, index) in menuItems" :key="index" class="mobile-nav-item">
            <div 
              class="mobile-nav-title" 
              @click="toggleMobileSubmenu(item.id)"
            >
              {{ item.title }}
              <span class="arrow" :class="{ 'open': mobileSubmenu === item.id }">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
            </div>
            
            <div v-show="mobileSubmenu === item.id" class="mobile-submenu">
              <div v-for="(category, catIndex) in item.megaMenuContent.categories" :key="catIndex" class="mobile-category">
                <h3 class="mobile-category-title">{{ category.title }}</h3>
                <ul class="mobile-category-list">
                  <li v-for="(subItem, subIndex) in category.items" :key="subIndex" class="mobile-category-item">
                    <router-link :to="generateCategoryLink(item.id, subItem, category.title)" class="mobile-category-link">
                      {{ subItem.name }}
                    </router-link>
                  </li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
        
        <div class="mobile-buttons">
          <router-link to="/login" class="mobile-login">로그인</router-link>
          <router-link to="/login" class="mobile-ad">광고문의</router-link>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'MobileMenu',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    menuItems: {
      type: Array,
      required: true
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const mobileSubmenu = ref(null);
    
    const close = () => {
      emit('close');
    };
    
    const toggleMobileSubmenu = (menuId) => {
      mobileSubmenu.value = mobileSubmenu.value === menuId ? null : menuId;
    };
    
    // 카테고리 링크 생성 함수 (라우터 파라미터 활용)
    const generateCategoryLink = (mainCategory, item, categoryTitle) => {
      const pathParts = item.path.split('/');
      
      // 전체 카테고리로 돌아가는 경우 (/delivery, /visit 등)
      if (pathParts.length <= 2 || pathParts[2] === '') {
        return { path: `/${mainCategory}` };
      }
      
      // 캠페인 유형이나 채널 유형인 경우 쿼리 파라미터로 처리
      if (categoryTitle === '캠페인 유형') {
        const campaignType = pathParts[2];
        return {
          name: `${mainCategory}`,
          query: { campaignType: campaignType }
        };
      }
      
      if (categoryTitle === '채널 유형') {
        const channelType = pathParts[2];
        return {
          name: `${mainCategory}`,
          query: { channelType: channelType }
        };
      }
      
      // 일반 하위 카테고리 링크 (/delivery/beauty 등)
      const category = pathParts[2];
      
      // 특정 카테고리일 경우 라우터 이름과 파라미터 사용
      return { 
        name: `${mainCategory}-category`, 
        params: { category: category }
      };
    };
    
    return {
      mobileSubmenu,
      close,
      toggleMobileSubmenu,
      generateCategoryLink
    };
  }
}
</script>

<style scoped>
.mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  background-color: white;
  z-index: 999;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.mobile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.mobile-logo {
  height: 28px;
}

.mobile-close {
  background-color: #f5f5f5;
  border: none;
  color: #444;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-content {
  padding: 15px;
}

.mobile-search {
  position: relative;
  margin-bottom: 20px;
}

.mobile-search-input {
  width: 100%;
  padding: 10px 40px 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
  outline: none;
}

.mobile-search-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background-color: #f5f5f5;
  border: none;
  color: #444;
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-utility {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.mobile-utility-link {
  color: #666;
  text-decoration: none;
  font-size: 13px;
  padding: 5px 10px;
  border-radius: 15px;
  background-color: #f8f8f8;
}

.mobile-utility-link.highlight {
  background-color: #e8f7f6;
  color: var(--primary-dark);
  font-weight: 500;
}

.mobile-nav {
  list-style: none;
  margin-bottom: 30px;
}

.mobile-nav-item {
  border-bottom: 1px solid #eee;
}

.mobile-nav-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
}

.arrow {
  transition: transform 0.3s ease;
}

.arrow.open {
  transform: rotate(180deg);
}

.mobile-submenu {
  padding: 0 0 15px 15px;
}

.mobile-category {
  margin-bottom: 15px;
}

.mobile-category-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-dark);
  margin-bottom: 10px;
}

.mobile-category-list {
  list-style: none;
}

.mobile-category-item {
  margin-bottom: 8px;
}

.mobile-category-link {
  color: #666;
  text-decoration: none;
  font-size: 14px;
  display: block;
  padding: 5px 0;
  transition: color 0.2s ease;
}

.mobile-category-link:hover {
  color: var(--primary-dark);
}

.mobile-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mobile-login,
.mobile-ad {
  padding: 12px;
  border-radius: 4px;
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  text-align: center;
  text-decoration: none;
  display: block;
}

.mobile-login {
  background-color: white;
  color: var(--primary-dark);
  border: 1px solid var(--primary);
}

.mobile-ad {
  background-color: #229799;
  color: white;
  border: 1px solid #1d8385;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 모바일 메뉴 애니메이션 */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

@media (max-width: 576px) {
  .mobile-menu {
    width: 280px;
  }
}
</style>
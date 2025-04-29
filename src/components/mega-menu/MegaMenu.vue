<!-- src/components/mega-menu/MegaMenu.vue -->
<template>
    <div class="mega-menu">
      <div class="container">
        <div v-for="(item, index) in menuItems" :key="index">
          <div v-if="activeMenu === item.id" class="mega-menu-content">
            <!-- 추천 콘텐츠 영역 -->
            <FeaturedContent 
              :title="item.title"
              :path="item.path"
              :index="index"
            />
            
            <!-- 카테고리 영역 -->
            <CategorySection 
              :categories="item.megaMenuContent.categories"
              :main-category="item.id"
            />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import FeaturedContent from './FeaturedContent.vue';
  import CategorySection from './CategorySection.vue';
  
  export default {
    name: 'MegaMenu',
    components: {
      FeaturedContent,
      CategorySection
    },
    props: {
      activeMenu: {
        type: String,
        required: true
      },
      menuItems: {
        type: Array,
        required: true
      }
    }
  };
  </script>
  
  <style scoped>
  .mega-menu {
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    padding: 30px 0;
    border-top: 1px solid rgba(0,0,0,0.05);
  }
  
  .mega-menu-content {
    display: flex;
    gap: 40px;
  }
  
  @media (max-width: 1199px) {
    .mega-menu-content {
      gap: 30px;
    }
  }
  
  @media (max-width: 992px) {
    .mega-menu {
      display: none; /* 모바일에서는 표시하지 않음 */
    }
  }
  
  @media (max-width: 768px) {
    .mega-menu-content {
      flex-direction: column;
    }
  }
  </style>
<!-- src/components/mega-menu/CategorySection.vue -->
<template>
    <div class="mega-menu-categories">
      <div 
        v-for="(category, catIndex) in categories" 
        :key="catIndex"
        class="mega-menu-category"
      >
        <h3 class="category-title">{{ category.title }}</h3>
        <ul class="category-items">
          <li 
            v-for="(subItem, subIndex) in category.items" 
            :key="subIndex"
            class="category-item"
          >
            <router-link :to="generateCategoryLink(mainCategory, subItem, category.title)" class="category-link">
              <span class="link-text">{{ subItem.name }}</span>
              <span class="link-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CategorySection',
    props: {
      categories: {
        type: Array,
        required: true
      },
      mainCategory: {
        type: String,
        required: true
      }
    },
    methods: {
      generateCategoryLink(mainCategory, item, categoryTitle) {
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
      }
    }
  }
  </script>
  
  <style scoped>
  .mega-menu-categories {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 30px;
  }
  
  .mega-menu-category {
    padding: 0;
  }
  
  .category-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--text-dark);
    margin: 0 0 15px 0;
    padding-bottom: 8px;
    border-bottom: 2px solid var(--primary);
    display: inline-block;
    position: relative;
    letter-spacing: -0.01em;
  }
  
  .category-title::after {
    content: '';
    position: absolute;
    bottom: -2px;
    right: -10px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--primary-dark);
  }
  
  .category-items {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .category-item {
    margin: 0;
  }
  
  .category-link {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 8px;
    border-radius: 6px;
    color: var(--text-dark);
    text-decoration: none;
    font-size: 14px;
    font-weight: 400;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
    background-color: transparent;
  }
  
  .category-link:hover {
    background-color: rgba(72, 207, 203, 0.08);
    color: var(--primary-dark);
    font-weight: 500;
  }
  
  .link-arrow {
    opacity: 0;
    transform: translateX(-10px);
    transition: all 0.2s ease;
    color: var(--primary-dark);
  }
  
  .category-link:hover .link-arrow {
    opacity: 1;
    transform: translateX(0);
  }
  
  /* 반응형 디자인 */
  @media (max-width: 768px) {
    .mega-menu-categories {
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 20px;
    }
  }
  </style>
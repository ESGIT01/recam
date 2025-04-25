<template>
  <div class="mega-menu">
    <div class="container">
      <div v-for="(item, index) in menuItems" :key="index">
        <div v-if="activeMenu === item.id" class="mega-menu-content">
          <!-- 추천 콘텐츠 영역 -->
          <div class="mega-menu-featured">
            <div class="featured-header">
              <h3 class="featured-title">추천 {{ item.title }} 콘텐츠</h3>
              <router-link :to="item.path" class="view-all">
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
                  <h4 class="featured-name">인기 {{ item.title }} {{ index + 1 }}</h4>
                  <p class="featured-desc">인기 {{ item.title }} 서비스에 대한 간략한 설명이 들어갑니다.</p>
                </div>
              </div>
              <div class="featured-item">
                <div class="featured-image">
                  <div class="image-placeholder"></div>
                </div>
                <div class="featured-info">
                  <div class="featured-badge">HOT</div>
                  <h4 class="featured-name">베스트 {{ item.title }} {{ index + 2 }}</h4>
                  <p class="featured-desc">베스트 {{ item.title }} 상품에 대한 간략한 설명이 들어갑니다.</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 카테고리 영역 -->
          <div class="mega-menu-categories">
            <div 
              v-for="(category, catIndex) in item.megaMenuContent.categories" 
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
                  <router-link :to="generateCategoryLink(item.id, subItem)" class="category-link">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MegaMenu',
  props: {
    activeMenu: {
      type: String,
      required: true
    },
    menuItems: {
      type: Array,
      required: true
    }
  },
  methods: {
    generateCategoryLink(mainCategory, item) {
      const pathParts = item.path.split('/');
      
      // 전체 카테고리로 돌아가는 경우 (/delivery, /visit 등)
      if (pathParts.length <= 2 || pathParts[2] === '') {
        return { path: `/${mainCategory}` };
      }
      
      // 하위 카테고리 링크 (/delivery/beauty 등)
      const category = pathParts[2];
      
      // 특정 카테고리일 경우 라우터 이름과 파라미터 사용
      return { 
        name: `${mainCategory}-category`, 
        params: { category: category }
      };
    }
  }
};
</script>

<style scoped>
/* 프리텐다드 폰트 */
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

/* 브랜드 컬러 변수 */
:root {
  --primary-light: #F5F5F5;
  --primary: #48CFCB;
  --primary-dark: #229799;
  --text-dark: #424242;
}

.mega-menu {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  padding: 30px 0;
  border-top: 1px solid rgba(0,0,0,0.05);
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
}

.mega-menu-content {
  display: flex;
  gap: 40px;
}

/* 추천 콘텐츠 영역 */
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

/* 카테고리 영역 */
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
@media (max-width: 1199px) {
  .mega-menu-content {
    gap: 30px;
  }
  
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

@media (max-width: 992px) {
  .mega-menu {
    display: none; /* 모바일에서는 표시하지 않음 */
  }
}

@media (max-width: 768px) {
  .mega-menu-content {
    flex-direction: column;
  }
  
  .mega-menu-featured {
    flex-basis: auto;
    border-right: none;
    border-bottom: 1px solid rgba(0,0,0,0.08);
    padding-right: 0;
    padding-bottom: 20px;
    margin-bottom: 20px;
  }
  
  .mega-menu-categories {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
  }
}
</style>
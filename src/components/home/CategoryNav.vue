<!-- PremiumCategoryNav.vue -->
<template>
  <div class="category-wrapper">
    <div class="category-container">
      <div 
        v-for="(category, index) in categories" 
        :key="index" 
        class="category-item"
        @click="navigateToCategory(category)"
        @mouseenter="activeIndex = index"
        @mouseleave="activeIndex = null"
        :class="{ 
          'active': activeIndex === index,
          'premium-item': category.title === '체험단 모집'
        }"
      >
        <div v-if="category.title === '오늘 오픈'" class="category-icon" :class="{'active': activeIndex === index}">
          <div class="icon-circle">
            <img src="@/assets/icons/todayopen.svg" alt="오늘 오픈" />
            <span class="notification-badge">N</span>
          </div>
        </div>

        <div v-else-if="category.title === '이벤트'" class="category-icon" :class="{'active': activeIndex === index}">
          <div class="icon-circle">
            <img src="@/assets/icons/event.svg" alt="이벤트" />
            <span class="notification-badge">N</span>
          </div>
        </div>

        <div v-else-if="category.title === '공지사항'" class="category-icon" :class="{'active': activeIndex === index}">
          <div class="icon-circle">
            <img src="@/assets/icons/notice.svg" alt="공지사항" />
          </div>
        </div>

        <div v-else-if="category.title === '이용 가이드'" class="category-icon" :class="{'active': activeIndex === index}">
          <div class="icon-circle">
            <img src="@/assets/icons/guide.svg" alt="이용 가이드" />
          </div>
        </div>

        <div v-else-if="category.title === '고객센터'" class="category-icon" :class="{'active': activeIndex === index}">
          <div class="icon-circle">
            <img src="@/assets/icons/cs.svg" alt="고객센터" />
          </div>
        </div>

        <div v-else-if="category.title === '체험단 모집'" class="category-icon premium-icon" :class="{'active': activeIndex === index}">
          <div class="icon-circle premium-circle">
            <img src="@/assets/icons/ad.svg" alt="체험단 모집" />
            <div class="sparkle-effect"></div>
          </div>
        </div>

        <div class="title-container">
          <span class="category-title" :class="{'premium-title': category.title === '체험단 모집'}">
            {{ category.title }}
            <span v-if="category.title === '체험단 모집'" class="premium-badge">FREE</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PremiumCategoryNav',
  data() {
    return {
      activeIndex: null,
      categories: [
        {
          title: '오늘 오픈',
          link: '/today-open'
        },
        {
          title: '이벤트',
          link: '/event'
        },
        {
          title: '공지사항',
          link: '/notices'
        },
        {
          title: '이용 가이드',
          link: '/guide'
        },
        {
          title: '고객센터',
          link: '/support'
        },
        {
          title: '체험단 모집',
          link: '/free-trial'
        }
      ]
    }
  },
  methods: {
    navigateToCategory(category) {
      // router 사용 시
      this.$router.push(category.link);
      
      // 기본 네비게이션 (router가 없을 경우)
      // window.location.href = category.link;
    }
  }
});
</script>

<style scoped>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

.category-wrapper {
  width: 100%;
  background-color: white;
  padding: 1.5rem 0;
}

.category-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;
  padding: 0 1.5rem;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 0.75rem;
  background-color: white;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.category-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, #48CFCB, #229799);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.category-item:hover, .category-item.active {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
}

.category-item:hover::after, .category-item.active::after {
  width: 70%;
}

/* 무료 체험단 모집 특별 스타일 */
.premium-item {
  background: linear-gradient(to bottom, white, #f8fdfd);
  border: 1px solid rgba(72, 207, 203, 0.2);
}

.premium-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2.5px;
  background: linear-gradient(90deg, #48CFCB, #229799);
}

.premium-item:hover, .premium-item.active {
  background: linear-gradient(to bottom, white, #ebf9f8);
  transform: translateY(-4px) scale(1.02);
}

.premium-circle {
  background: linear-gradient(145deg, #f6f8fa, #ebf9f8);
  box-shadow: 0 3px 8px rgba(72, 207, 203, 0.15);
}

.premium-title {
  color: #229799;
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
}

.premium-badge {
  background-color: #229799;
  color: white;
  font-size: 0.6rem;
  padding: 2px 4px;
  border-radius: 4px;
  display: inline-block;
  font-weight: 700;
  position: relative;
  top: -1px;
}

.icon-container {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f6f8fa;
  border-radius: 50%;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.category-icon {
  color: #424242;
  transition: all 0.3s ease;
}

.category-icon.active, .category-item:hover .category-icon {
  color: #229799;
}

.category-item:hover .icon-container, .category-item.active .icon-container {
  background-color: #ebf9f8;
}

.title-container {
  text-align: center;
}

.category-title {
  font-family: 'Pretendard', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #424242;
  transition: all 0.3s ease;
}

.category-item:hover .category-title, .category-item.active .category-title {
  color: #229799;
}

.icon-circle {
  width: 50px;
  height: 50px;
  background-color: #f6f8fa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
}

.icon-circle img {
  width: 28px;
  height: 28px;
  z-index: 2;
}

.category-item:hover .icon-circle, 
.category-item.active .icon-circle {
  background-color: #ebf9f8;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(0.95);
    opacity: 0.7;
  }
  70% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0;
  }
  100% {
    transform: translate(-50%, -50%) scale(0.95);
    opacity: 0;
  }
}

/* 이벤트 알림 배지 */
.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #ff5252;
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}

/* 무료 체험단 모집 특별 효과 */
.sparkle-effect {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(72, 207, 203, 0.15) 0%, transparent 70%);
  z-index: 1;
}

.premium-icon:hover .sparkle-effect {
  animation: sparkle 2s infinite;
}

@keyframes sparkle {
  0% {
    opacity: 0.3;
    transform: rotate(0deg);
  }
  50% {
    opacity: 0.5;
    transform: rotate(180deg);
  }
  100% {
    opacity: 0.3;
    transform: rotate(360deg);
  }
}

/* 반응형 스타일링 */
@media (max-width: 1024px) {
  .category-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 640px) {
  .category-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    padding: 0 1rem;
  }
  
  .category-item {
    padding: 1.25rem 0.5rem;
  }
  
  .icon-container {
    width: 50px;
    height: 50px;
    margin-bottom: 0.75rem;
  }
  
  .category-title {
    font-size: 0.875rem;
  }
  
  .icon-circle {
    width: 45px;
    height: 45px;
  }
  
  .icon-circle img {
    width: 24px;
    height: 24px;
  }
  
  .notification-badge {
    width: 16px;
    height: 16px;
    font-size: 0.6rem;
  }
}
</style>
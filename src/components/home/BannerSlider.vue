<!-- BannerSlider.vue -->
<template>
  <div class="banner-container">
    <div class="slider" ref="sliderRef">
      <div 
        class="slide"
        v-for="(banner, index) in banners" 
        :key="index"
        :class="{ active: currentIndex === index }"
        :style="{ transform: `translateX(${100 * (index - currentIndex)}%)` }"
      >
        <a :href="banner.link" target="_blank" rel="noopener noreferrer">
          <img :src="banner.image" :alt="banner.alt" class="banner-image">
        </a>
      </div>
    </div>
    
    <!-- Navigation Dots -->
    <div class="slider-dots">
      <button 
        v-for="(_, index) in banners" 
        :key="index" 
        class="slider-dot"
        :class="{ active: currentIndex === index }"
        @click="goToSlide(index)"
        :aria-label="`Go to slide ${index + 1}`"
      ></button>
    </div>
    
    <!-- Arrow Navigation -->
    <button class="slider-arrow prev" @click="prevSlide" aria-label="Previous slide">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    </button>
    <button class="slider-arrow next" @click="nextSlide" aria-label="Next slide">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

// 배너 데이터
const banners = [
  {
    image: require('@/assets/banners/949.jpeg'),
    alt: '배너 이미지 1',
    link: 'https://www.naver.com'
  },
  {
    image: require('@/assets/banners/917.jpeg'), // 실제 환경에선 다른 이미지로 변경
    alt: '배너 이미지 2',
    link: 'https://www.naver.com'
  },
  {
    image: require('@/assets/banners/947.jpeg'), // 실제 환경에선 다른 이미지로 변경
    alt: '배너 이미지 3',
    link: 'https://www.naver.com'
  }
];

// 현재 슬라이드 인덱스
const currentIndex = ref(0);
const sliderRef = ref(null);
let autoplayInterval = null;

// 다음 슬라이드로 이동
const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % banners.length;
};

// 이전 슬라이드로 이동
const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + banners.length) % banners.length;
};

// 특정 슬라이드로 이동
const goToSlide = (index) => {
  currentIndex.value = index;
};

// 자동 슬라이드 시작
const startAutoplay = () => {
  autoplayInterval = setInterval(() => {
    nextSlide();
  }, 5000); // 5초마다 자동 슬라이드
};

// 자동 슬라이드 정지
const stopAutoplay = () => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
  }
};

// 터치 이벤트 관련 변수
let touchStartX = 0;
let touchEndX = 0;

// 터치 이벤트 핸들러
const handleTouchStart = (e) => {
  touchStartX = e.changedTouches[0].screenX;
};

const handleTouchEnd = (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
};

// 스와이프 처리
const handleSwipe = () => {
  const swipeThreshold = 50; // 스와이프로 인식할 최소 거리
  if (touchEndX - touchStartX > swipeThreshold) {
    // 오른쪽으로 스와이프 - 이전 슬라이드
    prevSlide();
  } else if (touchStartX - touchEndX > swipeThreshold) {
    // 왼쪽으로 스와이프 - 다음 슬라이드
    nextSlide();
  }
};

// 컴포넌트 마운트 시 이벤트 리스너 등록 및 자동 슬라이드 시작
onMounted(() => {
  if (sliderRef.value) {
    sliderRef.value.addEventListener('touchstart', handleTouchStart, false);
    sliderRef.value.addEventListener('touchend', handleTouchEnd, false);
  }
  startAutoplay();
});

// 컴포넌트 언마운트 시 이벤트 리스너 제거 및 자동 슬라이드 정지
onBeforeUnmount(() => {
  if (sliderRef.value) {
    sliderRef.value.removeEventListener('touchstart', handleTouchStart, false);
    sliderRef.value.removeEventListener('touchend', handleTouchEnd, false);
  }
  stopAutoplay();
});
</script>

<style scoped>
/* 프리텐다드 폰트 적용 */
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

/* 브랜드 컬러 변수 정의 */
:root {
  --brand-light-gray: #F5F5F5;
  --brand-teal-light: #48CFCB;
  --brand-teal-dark: #229799;
  --brand-dark-gray: #424242;
}

/* 슬라이더 컨테이너 스타일 */
.banner-container {
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
  border-radius: 0px;
  font-family: 'Pretendard', sans-serif;
}

/* 슬라이더 스타일 */
.slider {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 개별 슬라이드 스타일 */
.slide {
  position: absolute;
  width: 100%;
  height: 100%;
  transition: transform 0.6s ease-in-out;
}

/* 배너 이미지 스타일 */
.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
}

/* 배너 내용 스타일 삭제 */

/* 슬라이더 화살표 스타일 */
.slider-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--brand-dark-gray);
  z-index: 10;
  transition: all 0.3s;
}

.slider-arrow:hover {
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.slider-arrow.prev {
  left: 20px;
}

.slider-arrow.next {
  right: 20px;
}

/* 슬라이더 도트 네비게이션 스타일 */
.slider-dots {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
  padding: 8px 12px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 20px;
}

.slider-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(66, 66, 66, 0.5); /* 반투명 진한 회색 */
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s;
}

.slider-dot:hover {
  background-color: #424242; /* 호버시 완전 불투명 진한 회색 */
}

.slider-dot.active {
  background-color: #424242; /* 활성화된 도트도 진한 회색으로 통일 */
  width: 24px;
  border-radius: 6px;
}

/* 반응형 스타일링 */
@media (max-width: 768px) {
  .banner-container {
    height: 400px;
  }
}

@media (max-width: 480px) {
  .banner-container {
    height: 300px;
    border-radius: 0px;
  }
  
  .slider-arrow {
    width: 36px;
    height: 36px;
  }
}
</style>
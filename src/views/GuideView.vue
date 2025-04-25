<template>
  <div class="guide-view">
    <div class="container">
      <div class="content-layout">
        <!-- 사이드바 -->
        <SideBar />
        
        <div class="main-content">
          <div class="guide-header">
            <h1 class="guide-title">이용 가이드</h1>
            <p class="guide-description">서비스를 이용하시는 데 필요한 안내사항을 확인하세요.</p>
            
            <!-- 가이드 타입 선택 탭 -->
            <div class="guide-tabs">
              <button 
                class="guide-tab-button" 
                :class="{ 'active': selectedGuideType === 'reviewer' }"
                @click="selectGuideType('reviewer')"
              >
                <span class="tab-icon">👤</span>
                리뷰어 이용 가이드
              </button>
              <button 
                class="guide-tab-button" 
                :class="{ 'active': selectedGuideType === 'advertiser' }"
                @click="selectGuideType('advertiser')"
              >
                <span class="tab-icon">🏢</span>
                광고주 이용 가이드
              </button>
            </div>
          </div>
          
          <!-- 선택된 가이드 콘텐츠 렌더링 -->
          <div class="guide-content-wrapper">
            <transition name="fade" mode="out-in">
              <div v-if="selectedGuideType === 'reviewer'" class="guide-content">
                <h2>리뷰어 이용 가이드</h2>
                <p>이 섹션에는 리뷰어를 위한 이용 가이드가 표시됩니다.</p>
                <!-- 실제 구현 시 ReviewerGuide 컴포넌트로 교체 -->
              </div>
              <div v-else class="guide-content">
                <h2>광고주 이용 가이드</h2>
                <p>이 섹션에는 광고주를 위한 이용 가이드가 표시됩니다.</p>
                <!-- 실제 구현 시 AdvertiserGuide 컴포넌트로 교체 -->
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import SideBar from '@/components/SideBar.vue';

export default {
  name: 'GuideView',
  components: {
    SideBar
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const selectedGuideType = ref('reviewer'); // 기본 선택값
    
    // URL에서 가이드 타입 초기화
    onMounted(() => {
      if (route.query.type && ['reviewer', 'advertiser'].includes(route.query.type)) {
        selectedGuideType.value = route.query.type;
      }
    });
    
    // 가이드 타입 선택 함수
    const selectGuideType = (type) => {
      selectedGuideType.value = type;
      // URL 업데이트
      router.replace({
        path: '/guide',
        query: { type }
      });
    };
    
    return {
      selectedGuideType,
      selectGuideType
    };
  }
};
</script>

<style scoped>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

/* 브랜드 컬러 변수 */
:root {
  --primary-light: #F5F5F5;
  --primary: #48CFCB;
  --primary-dark: #229799;
  --text-dark: #424242;
}

.guide-view {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  background-color: #FAFAFA;
  min-height: 100vh;
  padding-bottom: 60px;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 콘텐츠 레이아웃 */
.content-layout {
  display: flex;
  gap: 30px;
  padding-top: 30px;
}

.main-content {
  flex: 1;
  min-width: 0; /* flexbox 내에서 overflow 방지 */
}

/* 가이드 헤더 스타일 */
.guide-header {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 30px;
  margin-bottom: 30px;
}

.guide-title {
  font-size: 26px;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0 0 10px;
}

.guide-description {
  font-size: 16px;
  color: #666;
  margin: 0 0 30px;
}

/* 가이드 탭 스타일 */
.guide-tabs {
  display: flex;
  gap: 15px;
  border-bottom: 1px solid #EEEEEE;
  padding-bottom: 1px;
}

.guide-tab-button {
  background: none;
  border: none;
  padding: 12px 20px;
  font-family: 'Pretendard', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 3px solid transparent;
  display: flex;
  align-items: center;
  gap: 8px;
}

.guide-tab-button:hover {
  color: var(--primary-dark);
}

.guide-tab-button.active {
  color: var(--primary-dark);
  border-bottom-color: var(--primary);
}

.tab-icon {
  font-size: 18px;
}

/* 가이드 콘텐츠 영역 */
.guide-content-wrapper {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  min-height: 500px; /* 최소 높이 설정 */
}

.guide-content {
  padding: 30px;
}

.guide-content h2 {
  font-size: 22px;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0 0 20px;
}

.guide-content p {
  font-size: 16px;
  line-height: 1.6;
  color: #555;
}

/* 트랜지션 효과 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 반응형 스타일 */
@media (max-width: 991px) {
  .content-layout {
    flex-direction: column;
    gap: 20px;
  }
  
  .guide-header {
    padding: 20px;
  }
  
  .guide-title {
    font-size: 22px;
  }
  
  .guide-description {
    font-size: 15px;
    margin-bottom: 20px;
  }
  
  .guide-content {
    padding: 20px;
  }
}

@media (max-width: 767px) {
  .guide-tabs {
    flex-direction: column;
    gap: 10px;
    border-bottom: none;
  }
  
  .guide-tab-button {
    border: 1px solid #EEEEEE;
    border-radius: 8px;
    border-bottom-width: 1px;
    justify-content: center;
  }
  
  .guide-tab-button.active {
    background-color: var(--primary-light);
    border-color: var(--primary);
    border-bottom-color: var(--primary);
  }
}

@media (max-width: 480px) {
  .guide-header {
    padding: 15px;
  }
  
  .guide-title {
    font-size: 20px;
  }
  
  .guide-description {
    font-size: 14px;
  }
  
  .guide-tab-button {
    font-size: 14px;
    padding: 10px 15px;
  }
  
  .guide-content {
    padding: 15px;
  }
  
  .guide-content h2 {
    font-size: 18px;
    margin-bottom: 15px;
  }
  
  .guide-content p {
    font-size: 14px;
  }
}
</style>
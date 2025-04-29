<template>
  <div class="app">
  <!--만약 헤더와 푸터가 AuthPage거나 PartnerPage면 랜더링이 안됨-->
    <SiteHeader v-if="!isAuthPage && !isPartnerPage" />
    <main class="main-content">
      <router-view />
    </main>
    <SiteFooter v-if="!isAuthPage && !isPartnerPage" />
  </div>
</template>

<script>
import SiteHeader from '@/components/header/SiteHeader.vue';
import SiteFooter from '@/components/SiteFooter.vue';

export default {
  name: 'App',
  components: {
    SiteHeader,
    SiteFooter
  },
  watch: {
    $route() {
      window.scrollTo(0, 0);
    }
  },
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
    isAuthPage() {
      //로그인 페이지인지 확인하는 부분, 추후 AuthPage 관련 부분은 PartnerPage처럼 변경해야할 것 같음
      return ['/login', '/select-type', '/reviewer-signup', '/advertiser-signup'].includes(this.$route.path);
    },
    isPartnerPage() {
      // 파트너센터 페이지인지 확인 - 경로가 /partner로 시작하는지 체크
      return this.$route.path.startsWith('/partner');
    }
  },
  // App.vue script 부분에 추가
  mounted() {
    window.scrollTo(0, 0);
  },
  updated() {
    window.scrollTo(0, 0);
  }
};
</script>

<style>
/* 폰트 임포트 */
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

/* 변수 정의 */
:root {
  --primary-light: #48CFCB;
  --primary: #229799;
  --primary-dark: #229799;
  --gray-light: #F5F5F5;
  --gray-dark: #424242;
}

/* 기본 리셋 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 기본 스타일 */
html, body {
  font-family: 'Pretendard', sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: var(--gray-dark);
  background-color : #FFFFFF;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
}

/* 앱 레이아웃 */
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

.main-content {
  flex: 1;
  padding: 0;
}

.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer {
  background-color: #f1f1f1;
  padding: 20px 0;
  text-align: center;
  font-size: 14px;
  color: #777;
}

/* 공통 요소 스타일 */
button {
  font-family: 'Pretendard', sans-serif;
}

a {
  color: var(--primary);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* 버튼 스타일 */
.primary-button {
  background-color: var(--primary-light);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.primary-button:hover {
  background-color: var(--primary);
}

.secondary-button {
  background-color: white;
  color: var(--primary);
  border: 1px solid var(--primary);
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.secondary-button:hover {
  background-color: var(--primary);
  color: white;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
  
  .main-content {
    padding: 0;
  }
}
</style>
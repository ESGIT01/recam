<template>
    <div class="select-type-page">
      <div class="select-type-container">
        <!-- 로고 -->
        <router-link to="/" class="logo-link">
          <img src="@/assets/logo.png" alt="로고" class="logo">
        </router-link>
  
        <!-- 페이지 타이틀 -->
        <h1 class="page-title">회원 유형 선택</h1>
        <p class="page-subtitle">어떤 목적으로 리뷰캠퍼스를 이용하실 건가요?</p>
        
        <!-- 유형 선택 카드 -->
        <div class="type-cards">
          <!-- 리뷰어 카드 -->
          <div 
            class="type-card" 
            :class="{ 'selected': selectedType === 'reviewer' }"
            @click="selectType('reviewer')"
          >
            <div class="card-icon reviewer-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M20 22C20 17.5817 16.4183 14 12 14C7.58172 14 4 17.5817 4 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M19 8L19.9292 8.46459C20.572 8.78588 21.3447 8.55922 21.6613 7.91621L22 7.23607" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h2 class="card-title">리뷰어로 가입</h2>
            <p class="card-description">다양한 제품을 경험하고 솔직한 리뷰를 작성하세요.</p>
            <ul class="card-benefits">
              <li>브랜드 제품 체험 기회</li>
              <li>다양한 리뷰 작성 활동</li>
              <li>리뷰 활동에 따른 혜택</li>
            </ul>
            <button 
              class="select-btn reviewer-btn" 
              :class="{ 'active': selectedType === 'reviewer' }"
              @click.stop="selectType('reviewer')"
            >
              {{ selectedType === 'reviewer' ? '선택됨' : '선택하기' }}
            </button>
          </div>
  
          <!-- 광고주 카드 -->
          <div 
            class="type-card" 
            :class="{ 'selected': selectedType === 'advertiser' }"
            @click="selectType('advertiser')"
          >
            <div class="card-icon advertiser-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 8.99998H21C21.5523 8.99998 22 9.44769 22 9.99998V13C22 13.5523 21.5523 14 21 14H19.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 9.99998C2 9.44769 2.44772 8.99998 3 8.99998H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 11.9999H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3.5 14H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 21H12C12.5523 21 13 20.5523 13 20V4C13 3.44772 12.5523 3 12 3H8C7.44772 3 7 3.44772 7 4V20C7 20.5523 7.44772 21 8 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h2 class="card-title">광고주로 가입</h2>
            <p class="card-description">제품 홍보를 위한 진정성 있는 리뷰어를 찾으세요.</p>
            <ul class="card-benefits">
              <li>타겟 리뷰어 맞춤 매칭</li>
              <li>효과적인 제품 마케팅</li>
              <li>리뷰 분석 및 인사이트</li>
            </ul>
            <button 
              class="select-btn advertiser-btn" 
              :class="{ 'active': selectedType === 'advertiser' }"
              @click.stop="selectType('advertiser')"
            >
              {{ selectedType === 'advertiser' ? '선택됨' : '선택하기' }}
            </button>
          </div>
        </div>
  
        <!-- 계속 진행 버튼 -->
        <button 
          class="continue-btn" 
          :disabled="!selectedType"
          @click="continueToSignup"
        >
          다음 단계로
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
  
        <!-- 로그인 링크 -->
        <div class="login-link">
          <p>이미 계정이 있으신가요? <router-link to="/login">로그인</router-link></p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'SelectType',
    setup() {
      const router = useRouter();
      const selectedType = ref('');
  
      // 유형 선택 함수
      const selectType = (type) => {
        selectedType.value = type;
      };
  
      // 다음 단계로 진행
      const continueToSignup = () => {
  if (!selectedType.value) return;
  
  if (selectedType.value === 'reviewer') {
    router.push('/reviewer-signup');
  } else if (selectedType.value === 'advertiser') {
    router.push('/advertiser-signup');
  }
};
  
      return {
        selectedType,
        selectType,
        continueToSignup
      };
    }
  };
  </script>
  
  <style scoped>
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  /* 기본 스타일 */
  body {
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #333;
  }
  
  /* 페이지 레이아웃 */
  .select-type-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #F5F5F5;
    padding: 20px;
  }
  
  .select-type-container {
    width: 100%;
    max-width: 900px;
    background-color: #FFFFFF;
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
    padding: 40px;
    animation: fadeIn 0.4s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  /* 로고 */
  .logo-link {
    display: block;
    text-align: center;
    margin-bottom: 30px;
    transition: transform 0.2s ease;
  }
  
  .logo-link:hover {
    transform: scale(1.05);
  }
  
  .logo {
    height: 50px;
    width: auto;
  }
  
  /* 페이지 타이틀 */
  .page-title {
    font-size: 28px;
    font-weight: 700;
    text-align: center;
    color: #333;
    margin-bottom: 12px;
  }
  
  .page-subtitle {
    font-size: 16px;
    color: #666;
    text-align: center;
    margin-bottom: 40px;
  }
  
  /* 유형 선택 카드 */
  .type-cards {
    display: flex;
    gap: 24px;
    margin-bottom: 40px;
  }
  
  .type-card {
    flex: 1;
    background-color: #FFFFFF;
    border: 1px solid #E0E0E0;
    border-radius: 12px;
    padding: 30px;
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  
  .type-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
  
  .type-card.selected {
    border-color: #229799;
    box-shadow: 0 8px 24px rgba(34, 151, 153, 0.15);
  }
  
  .type-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 0;
    background-color: #229799;
    transition: height 0.3s ease;
  }
  
  .type-card.selected::before {
    height: 100%;
  }
  
  .card-icon {
    width: 70px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin-bottom: 24px;
    transition: all 0.3s ease;
    color: #229799;
    background-color: rgba(34, 151, 153, 0.1);
  }
  
  .type-card.selected .card-icon {
    background-color: rgba(34, 151, 153, 0.2);
    transform: scale(1.05);
  }
  
  .card-title {
    font-size: 20px;
    font-weight: 700;
    color: #333;
    margin-bottom: 12px;
  }
  
  .card-description {
    font-size: 15px;
    color: #666;
    margin-bottom: 24px;
    line-height: 1.5;
  }
  
  .card-benefits {
    list-style-position: inside;
    margin-bottom: 30px;
    padding-left: 4px;
  }
  
  .card-benefits li {
    margin-bottom: 8px;
    color: #555;
    position: relative;
    padding-left: 12px;
    font-size: 14px;
  }
  
  .card-benefits li::before {
    content: '•';
    position: absolute;
    left: 0;
    color: #229799;
  }
  
  .select-btn {
    width: 100%;
    padding: 12px 0;
    border: 1px solid #229799;
    background-color: white;
    color: #229799;
    font-size: 15px;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .select-btn:hover:not(.active) {
    background-color: rgba(34, 151, 153, 0.05);
  }
  
  .select-btn.active {
    background-color: #229799;
    color: white;
  }
  
  /* 계속 진행 버튼 */
  .continue-btn {
    width: 100%;
    padding: 16px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background-color: #229799;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 24px;
  }
  
  .continue-btn:hover:not(:disabled) {
    background-color: #1D8789;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(34, 151, 153, 0.2);
  }
  
  .continue-btn:disabled {
    background-color: #A0A0A0;
    cursor: not-allowed;
  }
  
  /* 로그인 링크 */
  .login-link {
    text-align: center;
    font-size: 14px;
    color: #666;
  }
  
  .login-link a {
    color: #229799;
    font-weight: 600;
    text-decoration: none;
    margin-left: 4px;
    transition: color 0.2s ease;
  }
  
  .login-link a:hover {
    text-decoration: underline;
    color: #48CFCB;
  }
  
  /* 반응형 스타일 */
  @media (max-width: 768px) {
    .select-type-container {
      padding: 30px 20px;
    }
  
    .type-cards {
      flex-direction: column;
    }
  
    .type-card {
      padding: 24px;
    }
  }
  </style>
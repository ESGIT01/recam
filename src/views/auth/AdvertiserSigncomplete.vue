<template>
    <div class="signup-complete-page">
      <div class="complete-container">
        <!-- 로고 -->
        <router-link to="/" class="logo-link">
          <img src="@/assets/logo.png" alt="로고" class="logo">
        </router-link>
  
        <!-- 완료 아이콘 -->
        <div class="complete-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="11" stroke="#229799" stroke-width="2"/>
            <path d="M7 12L10 15L17 8" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
  
        <!-- 완료 메시지 -->
        <h1 class="complete-title">회원가입이 완료되었습니다!</h1>
        <p class="complete-message">
          리뷰캠퍼스의 리뷰어가 되신 것을 환영합니다.<br>
          다양한 제품을 경험하고 진정성 있는 리뷰를 작성해보세요.
        </p>
  
        <!-- 회원 정보 -->
        <div class="user-info">
          <div class="info-item">
            <div class="info-label">이메일</div>
            <div class="info-value">{{ userEmail }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">이름</div>
            <div class="info-value">{{ userName }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">회원 유형</div>
            <div class="info-value">리뷰어</div>
          </div>
        </div>
  
        <!-- 액션 버튼 -->
        <div class="action-buttons">
          <button class="login-btn" @click="goToLogin">
            로그인하기
          </button>
          <button class="home-btn" @click="goToHome">
            홈으로 이동
          </button>
        </div>
  
        <!-- 추가 안내 -->
        <div class="additional-info">
          <p>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="#229799" stroke-width="2"/>
              <path d="M12 8V12" stroke="#229799" stroke-width="2" stroke-linecap="round"/>
              <circle cx="12" cy="16" r="1" fill="#229799"/>
            </svg>
            회원가입 인증 메일을 발송했습니다. 이메일을 확인해주세요.
          </p>
          <p>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="#229799" stroke-width="2"/>
              <path d="M12 8V12" stroke="#229799" stroke-width="2" stroke-linecap="round"/>
              <circle cx="12" cy="16" r="1" fill="#229799"/>
            </svg>
            이메일을 받지 못하셨나요? <button class="resend-btn" @click="resendEmail">이메일 재발송</button>
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  
  export default {
    name: 'ReviewerSignupComplete',
    setup() {
      const router = useRouter();
      const route = useRoute();
      
      // 사용자 정보
      const userEmail = ref('');
      const userName = ref('');
      
      // 라우터에서 전달받은 이메일과 이름 정보 가져오기
      onMounted(() => {
        if (route.query.email) {
          userEmail.value = route.query.email;
        } else {
          // 테스트용 기본값
          userEmail.value = 'user@example.com';
        }
        
        if (route.query.name) {
          userName.value = route.query.name;
        } else {
          // 테스트용 기본값
          userName.value = '홍길동';
        }
      });
      
      // 로그인 페이지로 이동
      const goToLogin = () => {
        router.push('/login');
      };
      
      // 홈으로 이동
      const goToHome = () => {
        router.push('/');
      };
      
      // 인증 이메일 재발송
      const resendEmail = () => {
        // 실제 이메일 재발송 로직 구현
        alert('인증 이메일이 재발송되었습니다. 이메일을 확인해주세요.');
      };
      
      return {
        userEmail,
        userName,
        goToLogin,
        goToHome,
        resendEmail
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
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  
  /* 페이지 레이아웃 */
  .signup-complete-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #F5F5F5;
    padding: 20px;
  }
  
  .complete-container {
    width: 100%;
    max-width: 600px;
    background-color: #FFFFFF;
    border-radius: 16px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    padding: 40px;
    text-align: center;
    animation: fadeIn 0.5s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  /* 로고 */
  .logo-link {
    display: inline-block;
    margin-bottom: 30px;
    transition: transform 0.2s ease;
  }
  
  .logo-link:hover {
    transform: scale(1.05);
  }
  
  .logo {
    height: 40px;
    width: auto;
  }
  
  /* 완료 아이콘 */
  .complete-icon {
    margin-bottom: 24px;
    animation: scaleIn 0.5s ease 0.2s forwards;
    transform: scale(0.9);
    opacity: 0.9;
  }
  
  @keyframes scaleIn {
    to { transform: scale(1); opacity: 1; }
  }
  
  /* 완료 메시지 */
  .complete-title {
    font-size: 28px;
    font-weight: 700;
    color: #333;
    margin-bottom: 16px;
  }
  
  .complete-message {
    font-size: 16px;
    color: #666;
    line-height: 1.6;
    margin-bottom: 30px;
  }
  
  /* 회원 정보 */
  .user-info {
    background-color: #F8F8F8;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 30px;
    text-align: left;
  }
  
  .info-item {
    display: flex;
    margin-bottom: 12px;
  }
  
  .info-item:last-child {
    margin-bottom: 0;
  }
  
  .info-label {
    width: 100px;
    font-size: 14px;
    font-weight: 600;
    color: #666;
  }
  
  .info-value {
    flex: 1;
    font-size: 15px;
    color: #333;
  }
  
  /* 액션 버튼 */
  .action-buttons {
    display: flex;
    gap: 12px;
    margin-bottom: 30px;
  }
  
  .login-btn, .home-btn {
    flex: 1;
    padding: 14px 0;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .login-btn {
    background-color: #229799;
    color: white;
    border: none;
  }
  
  .login-btn:hover {
    background-color: #1b8082;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(34, 151, 153, 0.2);
  }
  
  .home-btn {
    background-color: white;
    color: #333;
    border: 1px solid #DDD;
  }
  
  .home-btn:hover {
    background-color: #F5F5F5;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  /* 추가 안내 */
  .additional-info {
    text-align: left;
  }
  
  .additional-info p {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    font-size: 14px;
    color: #666;
  }
  
  .additional-info svg {
    flex-shrink: 0;
  }
  
  .resend-btn {
    background: none;
    border: none;
    color: #229799;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: underline;
    padding: 0;
    margin-left: 4px;
  }
  
  .resend-btn:hover {
    color: #1b8082;
  }
  
  /* 반응형 스타일 */
  @media (max-width: 576px) {
    .complete-container {
      padding: 30px 20px;
    }
    
    .complete-title {
      font-size: 24px;
    }
    
    .action-buttons {
      flex-direction: column;
    }
    
    .user-info {
      padding: 20px;
    }
    
    .info-label {
      width: 80px;
    }
  }
  </style>
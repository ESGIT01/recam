<template>
  <div class="login-page">
    <div class="login-container">
      <!-- 로고 - 클릭시 메인으로 이동 -->
      <router-link to="/" class="logo-link">
        <img src="@/assets/logo.png" alt="로고" class="logo">
      </router-link>

      <!-- 로그인 타이틀 -->
      <h1 class="login-title">로그인</h1>

      <!-- 사용자 유형 선택 -->
      <div class="user-type-container">
        <div class="user-type-wrapper">
          <button 
            class="user-type-btn" 
            :class="{ active: userType === 'reviewer' }"
            @click="userType = 'reviewer'"
          >
            <div class="user-type-icon reviewer">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.5 7.5C15.5 9.98528 13.4853 12 11 12C8.51472 12 6.5 9.98528 6.5 7.5C6.5 5.01472 8.51472 3 11 3C13.4853 3 15.5 5.01472 15.5 7.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M11 15C7.13401 15 4 18.134 4 22H18C18 18.134 14.866 15 11 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M19 8L19.9292 8.46459C20.572 8.78588 21.3447 8.55922 21.6613 7.91621L22 7.23607" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M17.5 10.5L18.4292 10.9646C19.072 11.2859 19.8447 11.0592 20.1613 10.4162L21.5 7.76393" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <span>리뷰어</span>
          </button>
          <button 
            class="user-type-btn" 
            :class="{ active: userType === 'advertiser' }"
            @click="userType = 'advertiser'"
          >
            <div class="user-type-icon advertiser">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 8.99998H21C21.5523 8.99998 22 9.44769 22 9.99998V13C22 13.5523 21.5523 14 21 14H19.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 9.99998C2 9.44769 2.44772 8.99998 3 8.99998H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 11.9999H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3.5 14H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 21H12C12.5523 21 13 20.5523 13 20V4C13 3.44772 12.5523 3 12 3H8C7.44772 3 7 3.44772 7 4V20C7 20.5523 7.44772 21 8 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <span>광고주</span>
          </button>
        </div>
      </div>

      <!-- 사용자 유형별 안내 메시지 -->
      <div class="user-type-message" v-if="userType">
        <p v-if="userType === 'reviewer'">
          다양한 제품을 경험하고 <span class="highlight">진정성 있는 리뷰</span>를 작성해보세요
        </p>
        <p v-else-if="userType === 'advertiser'">
          <span class="highlight">효과적인 마케팅</span>을 위한 리뷰어와 함께하세요
        </p>
      </div>

      <!-- 로그인 폼 -->
      <form @submit.prevent="handleLogin" class="login-form">
        <!-- 이메일 입력 -->
        <div class="form-field">
          <label class="field-label">이메일</label>
          <div class="input-container" :class="{ 'error': emailError }">
            <div class="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              placeholder="이메일 주소를 입력하세요" 
              @input="validateEmail"
              class="input-field"
            >
          </div>
          <p v-if="emailError" class="error-message">{{ emailError }}</p>
        </div>

        <!-- 비밀번호 입력 -->
        <div class="form-field">
          <label class="field-label">비밀번호</label>
          <div class="input-container" :class="{ 'error': passwordError }">
            <div class="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 11H5C3.89543 11 3 11.8954 3 13V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V13C21 11.8954 20.1046 11 19 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M7 11V7C7 5.93913 7.42143 4.92172 8.17157 4.17157C8.92172 3.42143 9.93913 3 11 3H13C14.0609 3 15.0783 3.42143 15.8284 4.17157C16.5786 4.92172 17 5.93913 17 7V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="password" 
              v-model="password" 
              placeholder="비밀번호를 입력하세요" 
              @input="validatePassword"
              class="input-field"
            >
            <button 
              type="button"
              class="toggle-password" 
              @click="showPassword = !showPassword"
            >
              <!-- 눈 아이콘 (보기/숨기기) -->
              <svg v-if="showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.9 4.24002C10.5883 4.0789 11.2931 3.99836 12 4.00002C19 4.00002 23 12 23 12C22.393 13.1356 21.6691 14.2048 20.84 15.19M14.12 14.12C13.8454 14.4148 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1752 15.0074 10.8016 14.8565C10.4281 14.7056 10.0887 14.4811 9.80385 14.1962C9.51897 13.9113 9.29439 13.572 9.14351 13.1984C8.99262 12.8249 8.91853 12.4247 8.92563 12.0219C8.93274 11.6191 9.02091 11.2219 9.18485 10.8539C9.34879 10.4859 9.58525 10.1547 9.88 9.88002M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20.00002C5 20.00002 1 12 1 12C2.24389 9.68192 3.96914 7.65663 6.06 6.06002L17.94 17.94Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M1 1L23 23" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          <p v-if="passwordError" class="error-message">{{ passwordError }}</p>
        </div>

        <!-- 로그인 옵션 -->
        <div class="login-options">
          <label class="remember-me">
            <input type="checkbox" v-model="rememberMe">
            <span class="checkmark"></span>
            <span>로그인 상태 유지</span>
          </label>
          <router-link to="/forgot-password" class="forgot-link">비밀번호 찾기</router-link>
        </div>

        <!-- 로그인 버튼 -->
        <button 
          type="submit" 
          class="login-btn"
          :disabled="loading || !isFormValid"
        >
          <span v-if="loading" class="spinner"></span>
          <span v-else>로그인</span>
        </button>
      </form>

      <!-- 구분선 -->
      <div class="divider">또는</div>

      <!-- 소셜 로그인 버튼 -->
      <div class="social-login">
        <!-- 카카오 로그인 -->
        <button 
          class="kakao-btn"
          @click="loginWithKakao"
          :disabled="loading"
        >
          <svg class="kakao-icon" width="20" height="20" viewBox="0 0 36 33" fill="currentColor">
            <path d="M18 0C8.055 0 0 6.268 0 14C0 18.549 2.855 22.56 7.143 25C6.552 27.045 5.709 30.527 5.504 31.402C5.229 32.665 6.143 32.708 6.903 32.214C7.46 31.847 11.935 28.877 13.806 27.587C15.169 27.864 16.584 28 18 28C27.945 28 36 21.732 36 14C36 6.268 27.945 0 18 0Z"/>
          </svg>
          <span>카카오로 로그인</span>
        </button>

        <!-- 네이버 로그인 -->
        <button 
          class="naver-btn"
          @click="loginWithNaver"
          :disabled="loading"
        >
          <svg class="naver-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M19 0H1C0.447 0 0 0.447 0 1V19C0 19.553 0.447 20 1 20H19C19.553 20 20 19.553 20 19V1C20 0.447 19.553 0 19 0ZM13.566 16H11.196L6.828 9.345V16H4.434V4H6.804L11.172 10.655V4H13.566V16Z"/>
          </svg>
          <span>네이버로 로그인</span>
        </button>
      </div>

      <!-- 회원가입 링크 -->
      <div class="signup-link">
        <p>아직 계정이 없으신가요? <router-link to="/select-type">회원가입</router-link></p>
      </div>
    </div>
  </div>

  <!-- 토스트 메시지 -->
  <transition name="toast">
    <div v-if="toastMessage" class="toast">
      <span class="toast-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
          <path d="M12 8V12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          <circle cx="12" cy="16" r="1" fill="currentColor" />
        </svg>
      </span>
      <span class="toast-message">{{ toastMessage }}</span>
      <button class="toast-close" @click="toastMessage = ''">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  </transition>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter();
    
    // 폼 데이터
    const email = ref('');
    const password = ref('');
    const userType = ref('reviewer'); // 기본값은 리뷰어
    const rememberMe = ref(false);
    const showPassword = ref(false);
    
    // 상태 관리
    const loading = ref(false);
    const emailError = ref('');
    const passwordError = ref('');
    const toastMessage = ref('');
    
    // 이메일 유효성 검사
    const validateEmail = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!email.value) {
        emailError.value = '이메일을 입력해주세요';
      } else if (!emailRegex.test(email.value)) {
        emailError.value = '올바른 이메일 형식이 아닙니다';
      } else {
        emailError.value = '';
      }
    };
    
    // 비밀번호 유효성 검사
    const validatePassword = () => {
      if (!password.value) {
        passwordError.value = '비밀번호를 입력해주세요';
      } else if (password.value.length < 6) {
        passwordError.value = '비밀번호는 최소 6자 이상이어야 합니다';
      } else {
        passwordError.value = '';
      }
    };
    
    // 폼 유효성 계산
    const isFormValid = computed(() => {
      return (
        email.value && 
        password.value && 
        !emailError.value && 
        !passwordError.value
      );
    });
    
    // 토스트 메시지 표시
    const showToast = (message, duration = 3000) => {
      toastMessage.value = message;
      setTimeout(() => {
        toastMessage.value = '';
      }, duration);
    };
    
    // 이메일 로그인 처리
    const handleLogin = async () => {
      validateEmail();
      validatePassword();
      
      if (!isFormValid.value) return;
      
      loading.value = true;
      
      try {
        // 실제 로그인 처리 로직이 들어갈 자리
        console.log('로그인 시도:', {
          email: email.value,
          password: password.value,
          userType: userType.value,
          rememberMe: rememberMe.value
        });
        
        // 임시 딜레이 (실제 API 요청으로 대체해야 함)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 로그인 성공 시 대시보드로 이동
        router.push('/dashboard');
      } catch (error) {
        console.error('로그인 실패:', error);
        showToast('로그인에 실패했습니다. 다시 시도해주세요.');
      } finally {
        loading.value = false;
      }
    };
    
    // 소셜 로그인 처리
    const loginWithKakao = async () => {
      loading.value = true;
      
      try {
        console.log('카카오 로그인 시도:', { userType: userType.value });
        await new Promise(resolve => setTimeout(resolve, 1500));
        router.push('/dashboard');
      } catch (error) {
        console.error('카카오 로그인 실패:', error);
        showToast('카카오 로그인에 실패했습니다. 다시 시도해주세요.');
      } finally {
        loading.value = false;
      }
    };
    
    const loginWithNaver = async () => {
      loading.value = true;
      
      try {
        console.log('네이버 로그인 시도:', { userType: userType.value });
        await new Promise(resolve => setTimeout(resolve, 1500));
        router.push('/dashboard');
      } catch (error) {
        console.error('네이버 로그인 실패:', error);
        showToast('네이버 로그인에 실패했습니다. 다시 시도해주세요.');
      } finally {
        loading.value = false;
      }
    };

    return {
      // 상태값
      email,
      password,
      userType,
      rememberMe,
      showPassword,
      loading,
      emailError,
      passwordError,
      toastMessage,
      isFormValid,
      
      // 메서드
      validateEmail,
      validatePassword,
      handleLogin,
      loginWithKakao,
      loginWithNaver,
      showToast
    };
  }
};
</script>

<style scoped>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

:root {
  --color-bg-light: #F5F5F5;
  --color-primary-light: #48CFCB;
  --color-primary: #229799;
  --color-dark: #424242;
  --color-error: #FF5252;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.08);
}

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

/* 로그인 페이지 레이아웃 */
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #F5F5F5;
  padding: 16px;
}

.login-container {
  width: 100%;
  max-width: 400px;
  background-color: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  padding: 32px 24px;
  animation: fadeIn 0.4s ease;
  border: 1px solid #E0E0E0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 로고 */
.logo-link {
  display: block;
  text-align: center;
  margin-bottom: 24px;
  transition: transform 0.2s ease;
}

.logo-link:hover {
  transform: scale(1.05);
}

.logo {
  height: 48px;
  width: auto;
}

/* 로그인 타이틀 */
.login-title {
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  color: #333;
  margin-bottom: 24px;
}

/* 사용자 유형 선택 - 새로운 디자인 */
.user-type-container {
  margin-bottom: 20px;
}

.user-type-wrapper {
  display: flex;
  background-color: #F0F0F0;
  border-radius: 10px;
  padding: 4px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
  position: relative;
}

.user-type-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 0;
  border: none;
  background: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  color: #555;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.user-type-btn.active {
  color: #229799;
  font-weight: 600;
}

.user-type-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  border-radius: 8px;
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.3s ease;
  z-index: -1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.user-type-btn.active::before {
  opacity: 1;
  transform: scale(1);
}

.user-type-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
}

.user-type-btn.active .user-type-icon {
  color: #229799;
}

/* 사용자 유형별 안내 메시지 */
.user-type-message {
  text-align: center;
  margin-bottom: 24px;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
  padding: 0 10px;
  animation: fadeInUp 0.3s ease;
  height: 36px; /* 고정 높이로 레이아웃 안정화 */
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

.highlight {
  color: #229799;
  font-weight: 600;
}

/* 폼 필드 */
.form-field {
  margin-bottom: 20px;
}

.field-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.input-container {
  display: flex;
  align-items: center;
  border: 1px solid #BBBBBB;
  border-radius: 8px;
  background-color: #FFFFFF;
  overflow: hidden;
  transition: all 0.2s ease;
}

.input-container:focus-within {
  border-color: #229799;
  box-shadow: 0 0 0 2px rgba(34, 151, 153, 0.15);
}

.input-container.error {
  border-color: #FF3B30;
}

.input-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  color: #555;
}

.input-field {
  flex: 1;
  height: 44px;
  padding: 0 4px;
  border: none;
  background: none;
  font-size: 15px;
  color: #333;
  outline: none;
  font-family: 'Pretendard', sans-serif;
}

.input-field::placeholder {
  color: #999;
}

.toggle-password {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  background: none;
  border: none;
  color: #555;
  cursor: pointer;
  transition: color 0.2s ease;
}

.toggle-password:hover {
  color: #333;
}

.error-message {
  font-size: 12px;
  color: #FF3B30;
  margin-top: 6px;
  padding-left: 4px;
  font-weight: 500;
}

/* 로그인 옵션 */
.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.remember-me {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.remember-me input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: relative;
  height: 18px;
  width: 18px;
  background-color: #F8F8F8;
  border: 1px solid #999;
  border-radius: 4px;
  margin-right: 8px;
  transition: all 0.2s ease;
}

.remember-me:hover input ~ .checkmark {
  background-color: #F0F0F0;
  border-color: #666;
}

.remember-me input:checked ~ .checkmark {
  background-color: #48CFCB;
  border-color: #229799;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 6px;
  top: 2px;
  width: 4px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.remember-me input:checked ~ .checkmark:after {
  display: block;
}

.remember-me span:last-child {
  font-size: 14px;
  color: #666;
}

.forgot-link {
  font-size: 14px;
  color: #229799;
  text-decoration: none;
  transition: color 0.2s ease;
}

.forgot-link:hover {
  text-decoration: underline;
  color: #48CFCB;
}

/* 로그인 버튼 */
.login-btn {
  width: 100%;
  height: 48px;
  background-color: #229799;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 8px rgba(34, 151, 153, 0.2);
  position: relative;
  overflow: hidden;
}

.login-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.login-btn:hover:not(:disabled)::before {
  left: 100%;
}

.login-btn:hover:not(:disabled) {
  background-color: #1D8789;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(34, 151, 153, 0.3);
}

.login-btn:active:not(:disabled) {
  transform: translateY(0);
  background-color: #1A7A7C;
}

.login-btn:disabled {
  background-color: #A0A0A0;
  color: #E0E0E0;
  cursor: not-allowed;
  box-shadow: none;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 구분선 */
.divider {
  position: relative;
  text-align: center;
  margin: 28px 0;
  color: #888;
  font-size: 14px;
}

.divider::before,
.divider::after {
  content: "";
  position: absolute;
  top: 50%;
  width: calc(50% - 30px);
  height: 1px;
  background-color: #E0E0E0;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

/* 소셜 로그인 버튼 */
.social-login {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

/* 카카오/네이버 버튼 */
.kakao-btn,
.naver-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 48px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.kakao-btn::before,
.naver-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.kakao-btn:hover:not(:disabled)::before,
.naver-btn:hover:not(:disabled)::before {
  left: 100%;
}

.kakao-btn {
  background-color: #FEE500;
  color: #000000;
}

.kakao-btn:hover:not(:disabled) {
  background-color: #F6DC00;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(254, 229, 0, 0.3);
}

.naver-btn {
  background-color: #03C75A;
  color: white;
}

.naver-btn:hover:not(:disabled) {
  background-color: #02B350;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(3, 199, 90, 0.3);
}

.kakao-btn:active:not(:disabled),
.naver-btn:active:not(:disabled) {
  transform: translateY(0);
}

.kakao-btn:disabled,
.naver-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.kakao-icon,
.naver-icon {
  flex-shrink: 0;
}

/* 회원가입 링크 */
.signup-link {
  text-align: center;
  font-size: 14px;
  color: #666;
}

.signup-link a {
  color: #229799;
  font-weight: 600;
  text-decoration: none;
  margin-left: 4px;
  transition: color 0.2s ease;
}

.signup-link a:hover {
  text-decoration: underline;
  color: #48CFCB;
}

/* 토스트 알림 */
.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  background-color: #333;
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 300px;
  max-width: 90%;
}

.toast-icon {
  margin-right: 10px;
  color: #48CFCB;
  display: flex;
  align-items: center;
}

.toast-message {
  flex: 1;
}

.toast-close {
  margin-left: 10px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
  transition: color 0.2s ease;
}

.toast-close:hover {
  color: white;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

/* 반응형 스타일 */
@media (max-width: 480px) {
  .login-container {
    padding: 24px 20px;
  }

  .login-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .login-btn,
  .kakao-btn,
  .naver-btn {
    height: 44px;
  }

  .toast {
    min-width: unset;
    width: 90%;
  }
}
</style>
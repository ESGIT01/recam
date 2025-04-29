<template>
    <div class="reviewer-signup-page">
      <div class="signup-container">
        <!-- 로고 -->
        <router-link to="/" class="logo-link">
          <img src="@/assets/logo.png" alt="로고" class="logo">
        </router-link>
  
        <!-- 페이지 타이틀 -->
        <h1 class="page-title">리뷰어 회원가입</h1>
        <p class="page-subtitle">다양한 제품을 경험하고 진정성 있는 리뷰를 작성해보세요</p>
  
        <!-- 회원가입 진행 단계 -->
        <div class="progress-steps">
          <div class="step completed">
            <div class="step-circle">
              <svg class="step-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12L10 17L20 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="step-label">유형 선택</div>
          </div>
          <div class="step-connector"></div>
          <div class="step active">
            <div class="step-circle">2</div>
            <div class="step-label">정보 입력</div>
          </div>
          <div class="step-connector"></div>
          <div class="step">
            <div class="step-circle">3</div>
            <div class="step-label">가입 완료</div>
          </div>
        </div>
  
        <!-- 회원가입 폼 -->
        <form @submit.prevent="submitForm" class="signup-form">
          <!-- 필수 정보 섹션 -->
          <div class="form-section">
            <h2 class="section-title">
              <span class="section-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 15V23" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9 18H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              필수 정보
              <span class="required-badge">필수입력</span>
            </h2>
            
            <!-- 이메일 -->
            <div class="form-field">
              <label for="email" class="field-label">이메일</label>
              <div class="input-container" :class="{ 'error': errors.email, 'focused': focusedField === 'email' }">
                <div class="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <input 
                  type="email" 
                  id="email" 
                  v-model="form.email" 
                  placeholder="이메일 주소를 입력하세요" 
                  @focus="focusedField = 'email'"
                  @blur="focusedField = null"
                  @input="validateEmail"
                  class="input-field"
                >
              </div>
              <p v-if="errors.email" class="error-message">
                <svg class="error-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 9V14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 17.5V18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {{ errors.email }}
              </p>
            </div>
  
            <!-- 비밀번호 -->
            <div class="form-field">
              <label for="password" class="field-label">비밀번호</label>
              <div class="input-container" :class="{ 'error': errors.password, 'focused': focusedField === 'password' }">
                <div class="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 11H5C3.89543 11 3 11.8954 3 13V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V13C21 11.8954 20.1046 11 19 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M7 11V7C7 5.93913 7.42143 4.92172 8.17157 4.17157C8.92172 3.42143 9.93913 3 11 3H13C14.0609 3 15.0783 3.42143 15.8284 4.17157C16.5786 4.92172 17 5.93913 17 7V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  id="password" 
                  v-model="form.password" 
                  placeholder="비밀번호를 입력하세요" 
                  @focus="focusedField = 'password'"
                  @blur="focusedField = null"
                  @input="validatePassword"
                  class="input-field"
                >
                <button 
                  type="button"
                  class="toggle-password" 
                  @click="showPassword = !showPassword"
                >
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
              <p v-if="errors.password" class="error-message">
                <svg class="error-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 9V14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 17.5V18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {{ errors.password }}
              </p>
              <div v-if="!errors.password && form.password" class="password-strength">
                <div class="strength-label">비밀번호 안전도:</div>
                <div class="strength-bars">
                  <div 
                    v-for="i in 4" 
                    :key="i" 
                    class="strength-bar"
                    :class="{ 'active': passwordStrength >= i }"
                  ></div>
                </div>
                <div class="strength-text" :class="passwordStrengthClass">{{ passwordStrengthText }}</div>
              </div>
            </div>
  
            <!-- 비밀번호 확인 -->
            <div class="form-field">
              <label for="passwordConfirm" class="field-label">비밀번호 확인</label>
              <div class="input-container" :class="{ 'error': errors.passwordConfirm, 'focused': focusedField === 'passwordConfirm' }">
                <div class="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 11H5C3.89543 11 3 11.8954 3 13V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V13C21 11.8954 20.1046 11 19 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M7 11V7C7 5.93913 7.42143 4.92172 8.17157 4.17157C8.92172 3.42143 9.93913 3 11 3H13C14.0609 3 15.0783 3.42143 15.8284 4.17157C16.5786 4.92172 17 5.93913 17 7V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  id="passwordConfirm" 
                  v-model="form.passwordConfirm" 
                  placeholder="비밀번호를 다시 입력하세요" 
                  @focus="focusedField = 'passwordConfirm'"
                  @blur="focusedField = null"
                  @input="validatePasswordConfirm"
                  class="input-field"
                >
              </div>
              <p v-if="errors.passwordConfirm" class="error-message">
                <svg class="error-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 9V14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 17.5V18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {{ errors.passwordConfirm }}
              </p>
              <div v-else-if="form.password && form.passwordConfirm && form.password === form.passwordConfirm" class="success-message">
                <svg class="success-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18457 2.99721 7.13633 4.39828 5.49707C5.79935 3.85782 7.69279 2.71538 9.79619 2.24015C11.8996 1.76491 14.1003 1.98234 16.07 2.86" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                비밀번호가 일치합니다
              </div>
            </div>
  
            <!-- 이름 -->
            <div class="form-field">
              <label for="name" class="field-label">이름</label>
              <div class="input-container" :class="{ 'error': errors.name, 'focused': focusedField === 'name' }">
                <div class="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M20 22C20 17.5817 16.4183 14 12 14C7.58172 14 4 17.5817 4 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <input 
                  type="text" 
                  id="name" 
                  v-model="form.name" 
                  placeholder="이름을 입력하세요" 
                  @focus="focusedField = 'name'"
                  @blur="focusedField = null"
                  @input="validateName"
                  class="input-field"
                >
              </div>
              <p v-if="errors.name" class="error-message">
                <svg class="error-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 9V14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 17.5V18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {{ errors.name }}
              </p>
            </div>
  
            <!-- 휴대폰 번호 -->
            <div class="form-field">
              <label for="phone" class="field-label">휴대폰 번호</label>
              <div class="input-container" :class="{ 'error': errors.phone, 'focused': focusedField === 'phone' }">
                <div class="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 2H7C5.89543 2 5 2.89543 5 4V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V4C19 2.89543 18.1046 2 17 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 18H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <input 
                  type="tel" 
                  id="phone" 
                  v-model="form.phone" 
                  placeholder="'-' 없이 입력하세요" 
                  @focus="focusedField = 'phone'"
                  @blur="focusedField = null"
                  @input="validatePhone"
                  class="input-field"
                >
                <button 
                  type="button"
                  class="verify-btn"
                  @click="verifyPhone"
                  :disabled="!canVerifyPhone"
                >
                  인증
                </button>
              </div>
              <p v-if="errors.phone" class="error-message">
                <svg class="error-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 9V14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 17.5V18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {{ errors.phone }}
              </p>
            </div>
          </div>
  
          <!-- 선택 정보 섹션 -->
          <div class="form-section">
            <h2 class="section-title">
              <span class="section-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M15.75 9H8.25" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M15.75 15H8.25" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              선택 정보
              <span class="optional-badge">선택입력</span>
            </h2>
            
            <!-- 블로그 주소 -->
            <div class="form-field">
              <label for="blog" class="field-label">블로그 주소</label>
              <div class="input-container" :class="{ 'error': errors.blog, 'focused': focusedField === 'blog' }">
                <div class="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 13C10.5523 13 11 12.5523 11 12C11 11.4477 10.5523 11 10 11C9.44772 11 9 11.4477 9 12C9 12.5523 9.44772 13 10 13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10 5H8C6.93913 5 5.92172 5.42143 5.17157 6.17157C4.42143 6.92172 4 7.93913 4 9V19C4 20.0609 4.42143 21.0783 5.17157 21.8284C5.92172 22.5786 6.93913 23 8 23H16C17.0609 23 18.0783 22.5786 18.8284 21.8284C19.5786 21.0783 20 20.0609 20 19V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M18 4V10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M15 7H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <input 
                  type="url" 
                  id="blog" 
                  v-model="form.blog" 
                  placeholder="블로그 주소를 입력하세요 (예: https://blog.naver.com/...)" 
                  @focus="focusedField = 'blog'"
                  @blur="focusedField = null"
                  @input="validateBlog"
                  class="input-field"
                >
              </div>
              <p v-if="errors.blog" class="error-message">
                <svg class="error-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 9V14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 17.5V18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {{ errors.blog }}
              </p>
            </div>
  
            <!-- 인스타그램 주소 -->
            <div class="form-field">
              <label for="instagram" class="field-label">인스타그램 주소</label>
              <div class="input-container" :class="{ 'error': errors.instagram, 'focused': focusedField === 'instagram' }">
                <div class="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.9079 12.2384 16.0396 11.4078 15.9059C10.5771 15.7723 9.80976 15.3801 9.21484 14.7852C8.61991 14.1902 8.22773 13.4229 8.09406 12.5922C7.9604 11.7615 8.09206 10.9099 8.47032 10.1584C8.84858 9.40685 9.45418 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87658 12.63 8C13.4789 8.12588 14.2648 8.52146 14.8717 9.12831C15.4785 9.73515 15.8741 10.5211 16 11.37Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M17.5 6.5H17.51" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <input 
                  type="url" 
                  id="instagram" 
                  v-model="form.instagram" 
                  placeholder="인스타그램 주소를 입력하세요 (예: https://instagram.com/...)" 
                  @focus="focusedField = 'instagram'"
                  @blur="focusedField = null"
                  @input="validateInstagram"
                  class="input-field"
                >
              </div>
              <p v-if="errors.instagram" class="error-message">
                <svg class="error-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 9V14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 17.5V18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {{ errors.instagram }}
              </p>
            </div>
  
            <!-- 유튜브 주소 -->
            <div class="form-field">
              <label for="youtube" class="field-label">유튜브 주소</label>
              <div class="input-container" :class="{ 'error': errors.youtube, 'focused': focusedField === 'youtube' }">
                <div class="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.54 6.42C22.4212 5.94541 22.1792 5.51057 21.8382 5.15941C21.4971 4.80824 21.0707 4.55318 20.6 4.42C18.88 4 12 4 12 4C12 4 5.12001 4 3.40001 4.46C2.92933 4.59318 2.50293 4.84824 2.16188 5.19941C1.82083 5.55057 1.57878 5.98541 1.46001 6.46C1.14522 8.20556 0.991243 9.97631 1.00001 11.75C0.988802 13.537 1.14276 15.3213 1.46001 17.08C1.59097 17.5398 1.83833 17.9581 2.17817 18.2945C2.518 18.6308 2.93884 18.8738 3.40001 19C5.12001 19.46 12 19.46 12 19.46C12 19.46 18.88 19.46 20.6 19C21.0707 18.8668 21.4971 18.6118 21.8382 18.2606C22.1792 17.9094 22.4212 17.4746 22.54 17C22.8524 15.2676 23.0063 13.5103 23 11.75C23.0112 9.96295 22.8573 8.1787 22.54 6.42Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9.75 15.02L15.5 11.75L9.75 8.48001V15.02Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <input 
                  type="url" 
                  id="youtube" 
                  v-model="form.youtube" 
                  placeholder="유튜브 채널 주소를 입력하세요 (예: https://youtube.com/...)" 
                  @focus="focusedField = 'youtube'"
                  @blur="focusedField = null"
                  @input="validateYoutube"
                  class="input-field"
                >
              </div>
              <p v-if="errors.youtube" class="error-message">
                <svg class="error-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 9V14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 17.5V18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {{ errors.youtube }}
              </p>
            </div>
  
            <!-- 주소 -->
            <div class="form-field">
              <label for="address" class="field-label">주소</label>
              <div class="address-input-group">
                <div class="input-container address-code" :class="{ 'error': errors.addressCode, 'focused': focusedField === 'addressCode' }">
                  <div class="input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    id="addressCode" 
                    v-model="form.addressCode" 
                    placeholder="우편번호" 
                    readonly
                    class="input-field"
                  >
                  <button 
                    type="button"
                    class="address-search-btn"
                    @click="searchAddress"
                  >
                    주소 검색
                  </button>
                </div>
                
                <div class="input-container" :class="{ 'error': errors.address, 'focused': focusedField === 'address' }">
                  <input 
                    type="text" 
                    id="address" 
                    v-model="form.address" 
                    placeholder="기본 주소" 
                    readonly
                    class="input-field"
                  >
                </div>
                
                <div class="input-container" :class="{ 'focused': focusedField === 'addressDetail' }">
                  <input 
                    type="text" 
                    id="addressDetail" 
                    v-model="form.addressDetail" 
                    placeholder="상세 주소 입력" 
                    @focus="focusedField = 'addressDetail'"
                    @blur="focusedField = null"
                    class="input-field"
                  >
                </div>
              </div>
              <p v-if="errors.address" class="error-message">
                <svg class="error-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 9V14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 17.5V18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {{ errors.address }}
              </p>
            </div>
          </div>
  
          <!-- 약관 동의 섹션 -->
          <div class="form-section">
            <h2 class="section-title">
              <span class="section-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 11L12 14L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              약관 동의
            </h2>
            
            <div class="terms-container">
              <!-- 전체 동의 -->
              <label class="terms-checkbox all-agree">
                <input 
                  type="checkbox" 
                  v-model="form.agreeAll"
                  @change="toggleAllAgreements"
                >
                <span class="checkmark"></span>
                <span class="terms-text">
                  <strong>전체 동의</strong>
                  <span class="terms-description">이용약관, 개인정보 수집 및 이용, 이벤트 및 혜택 안내 수신에 모두 동의합니다.</span>
                </span>
              </label>
              
              <div class="terms-divider"></div>
              
              <!-- 14세 이상 확인 -->
              <label class="terms-checkbox">
                <input 
                  type="checkbox" 
                  v-model="form.agreeAge"
                  @change="updateAgreeAll"
                >
                <span class="checkmark"></span>
                <span class="terms-text">
                  본인은 만 14세 이상입니다. <span class="required-mark">(필수)</span>
                </span>
              </label>
              
              <!-- 서비스 이용약관 -->
              <label class="terms-checkbox">
                <input 
                  type="checkbox" 
                  v-model="form.agreeTerms"
                  @change="updateAgreeAll"
                >
                <span class="checkmark"></span>
                <span class="terms-text">
                  서비스 이용 약관에 동의합니다. <span class="required-mark">(필수)</span>
                  <button class="terms-view-btn" @click.prevent="showTermsModal('terms')">내용보기</button>
                </span>
              </label>
              
              <!-- 개인정보 수집 및 이용 -->
              <label class="terms-checkbox">
                <input 
                  type="checkbox" 
                  v-model="form.agreePrivacy"
                  @change="updateAgreeAll"
                >
                <span class="checkmark"></span>
                <span class="terms-text">
                  개인정보 수집 및 이용에 동의합니다. <span class="required-mark">(필수)</span>
                  <button class="terms-view-btn" @click.prevent="showTermsModal('privacy')">내용보기</button>
                </span>
              </label>
              
              <div class="terms-divider"></div>
              
              <!-- 마케팅 정보 동의 -->
              <!-- 수신 방법 선택 (v-if 제거하여 항상 표시) -->
  
              <label class="terms-checkbox marketing-label">
    <input 
      type="checkbox" 
      v-model="form.agreeMarketing"
      @change="handleMarketingChange"
    >
    <span class="checkmark"></span>
    <span class="terms-text">
      이벤트 및 혜택안내 개인정보 수집 · 이용에 동의합니다. <span class="optional-mark">(선택)</span>
      <button class="terms-view-btn" @click.prevent="showTermsModal('marketing')">내용보기</button>
    </span>
  </label>
  
  <div class="marketing-options">
    <label class="terms-checkbox">
      <input 
        type="checkbox" 
        v-model="form.agreeEmail"
        @change="handleMarketingOptionChange"
      >
      <span class="checkmark"></span>
      <span class="terms-text">이메일 수신 동의 <span class="optional-mark">(선택)</span></span>
    </label>
    
    <label class="terms-checkbox">
      <input 
        type="checkbox" 
        v-model="form.agreeSms"
        @change="handleMarketingOptionChange"
      >
      <span class="checkmark"></span>
      <span class="terms-text">SMS 수신 동의 <span class="optional-mark">(선택)</span></span>
    </label>
  </div>
              
              <p v-if="errors.terms" class="error-message terms-error">
                <svg class="error-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 9V14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 17.5V18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {{ errors.terms }}
              </p>
            </div>
          </div>
  
          <!-- 회원가입 버튼 -->
          <button 
            type="submit" 
            class="signup-btn"
            :disabled="loading || !isFormValid"
          >
            <span v-if="loading" class="spinner"></span>
            <span v-else>가입하기</span>
          </button>
        </form>
  
        <!-- 로그인 링크 -->
        <div class="login-link">
          <p>이미 계정이 있으신가요? <router-link to="/login">로그인</router-link></p>
        </div>
      </div>
    </div>
  
    <!-- 약관 내용 모달 -->
    <div v-if="showModal" class="modal-backdrop" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ modalTitle }}</h3>
          <button class="modal-close" @click="closeModal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div v-html="modalContent"></div>
        </div>
        <div class="modal-footer">
          <button class="modal-confirm-btn" @click="closeModal">확인</button>
        </div>
      </div>
    </div>
  </template>
  <script>
  import { ref, computed, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  export default {
      name: 'ReviewerSignup',
      setup() {
        const router = useRouter();
        const loading = ref(false);
        const showPassword = ref(false);
        const showModal = ref(false);
        const modalTitle = ref('');
        const modalContent = ref('');
        const focusedField = ref(null);
        
        // 폼 데이터
        const form = reactive({
          email: '',
          password: '',
          passwordConfirm: '',
          name: '',
          phone: '',
          blog: '',
          instagram: '',
          youtube: '',
          addressCode: '',
          address: '',
          addressDetail: '',
          agreeAll: false,
          agreeAge: false,
          agreeTerms: false,
          agreePrivacy: false,
          agreeMarketing: false,
          agreeEmail: false,
          agreeSms: false
        });
        
        // 에러 상태
        const errors = reactive({
          email: '',
          password: '',
          passwordConfirm: '',
          name: '',
          phone: '',
          blog: '',
          instagram: '',
          youtube: '',
          address: '',
          terms: ''
        });
        
        // 비밀번호 강도 계산
        const passwordStrength = computed(() => {
          if (!form.password) return 0;
          
          let strength = 0;
          
          // 길이 검사
          if (form.password.length >= 8) strength++;
          
          // 대문자 포함 검사
          if (/[A-Z]/.test(form.password)) strength++;
          
          // 숫자 포함 검사
          if (/[0-9]/.test(form.password)) strength++;
          
          // 특수문자 포함 검사
          if (/[^A-Za-z0-9]/.test(form.password)) strength++;
          
          return strength;
        });
        
        // 비밀번호 강도 텍스트
        const passwordStrengthText = computed(() => {
          switch (passwordStrength.value) {
            case 0: return '매우 약함';
            case 1: return '약함';
            case 2: return '보통';
            case 3: return '강함';
            case 4: return '매우 강함';
            default: return '';
          }
        });
        
        // 비밀번호 강도 클래스
        const passwordStrengthClass = computed(() => {
          switch (passwordStrength.value) {
            case 0: return 'very-weak';
            case 1: return 'weak';
            case 2: return 'medium';
            case 3: return 'strong';
            case 4: return 'very-strong';
            default: return '';
          }
        });
        
        // 폼 유효성 검사
        const isFormValid = computed(() => {
          // 필수 입력 필드 검사
          const requiredFieldsValid = 
            form.email && 
            form.password && 
            form.passwordConfirm && 
            form.name && 
            form.phone &&
            !errors.email && 
            !errors.password && 
            !errors.passwordConfirm && 
            !errors.name && 
            !errors.phone;
          
          // 필수 약관 동의 검사
          const requiredTermsValid = 
            form.agreeAge && 
            form.agreeTerms && 
            form.agreePrivacy;
          
          return requiredFieldsValid && requiredTermsValid;
        });
        
        // 휴대폰 인증 가능 여부
        const canVerifyPhone = computed(() => {
          // 휴대폰 번호 유효성 검사 (11자리 숫자)
          return /^01[016789]\d{7,8}$/.test(form.phone) && !errors.phone;
        });
        
        // 이메일 유효성 검사
        const validateEmail = () => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          
          if (!form.email) {
            errors.email = '이메일을 입력해주세요';
          } else if (!emailRegex.test(form.email)) {
            errors.email = '유효한 이메일 형식이 아닙니다';
          } else {
            errors.email = '';
          }
        };
        
        // 비밀번호 유효성 검사
        const validatePassword = () => {
          if (!form.password) {
            errors.password = '비밀번호를 입력해주세요';
          } else if (form.password.length < 8) {
            errors.password = '비밀번호는 8자 이상이어야 합니다';
          } else if (!/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])/.test(form.password)) {
            errors.password = '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다';
          } else {
            errors.password = '';
          }
          
          // 비밀번호 확인 필드가 있다면 일치 여부 확인
          if (form.passwordConfirm) {
            validatePasswordConfirm();
          }
        };
        
        // 비밀번호 확인 유효성 검사
        const validatePasswordConfirm = () => {
          if (!form.passwordConfirm) {
            errors.passwordConfirm = '비밀번호 확인을 입력해주세요';
          } else if (form.password !== form.passwordConfirm) {
            errors.passwordConfirm = '비밀번호가 일치하지 않습니다';
          } else {
            errors.passwordConfirm = '';
          }
        };
        
        // 이름 유효성 검사
        const validateName = () => {
          if (!form.name) {
            errors.name = '이름을 입력해주세요';
          } else if (form.name.length < 2) {
            errors.name = '이름은 2자 이상이어야 합니다';
          } else {
            errors.name = '';
          }
        };
        
        // 휴대폰 번호 유효성 검사
        const validatePhone = () => {
          if (!form.phone) {
            errors.phone = '휴대폰 번호를 입력해주세요';
          } else if (!/^01[016789]\d{7,8}$/.test(form.phone)) {
            errors.phone = '유효한 휴대폰 번호 형식이 아닙니다';
          } else {
            errors.phone = '';
          }
        };
        
        // 블로그 주소 유효성 검사 (선택 필드)
        const validateBlog = () => {
          if (form.blog && !/^(http|https):\/\/[^ "]+$/.test(form.blog)) {
            errors.blog = '유효한 URL 형식이 아닙니다';
          } else {
            errors.blog = '';
          }
        };
        
        // 인스타그램 주소 유효성 검사 (선택 필드)
        const validateInstagram = () => {
          if (form.instagram && !/^(http|https):\/\/[^ "]+$/.test(form.instagram)) {
            errors.instagram = '유효한 URL 형식이 아닙니다';
          } else {
            errors.instagram = '';
          }
        };
        
        // 유튜브 주소 유효성 검사 (선택 필드)
        const validateYoutube = () => {
          if (form.youtube && !/^(http|https):\/\/[^ "]+$/.test(form.youtube)) {
            errors.youtube = '유효한 URL 형식이 아닙니다';
          } else {
            errors.youtube = '';
          }
        };
        
        // 휴대폰 인증 요청
        const verifyPhone = () => {
          // 실제 인증 로직이 들어갈 자리
          alert('인증번호가 발송되었습니다. (실제 기능은 구현 필요)');
        };
        
        // 주소 검색 창 열기
        const searchAddress = () => {
          // 주소 검색 API 연동 로직이 들어갈 자리
          // 실제로는 다음 또는 카카오 주소 검색 API 등을 사용
          
          // 임시 테스트용 코드
          alert('주소 검색 기능 (실제 기능은 구현 필요)');
          
          // 테스트 데이터 설정
          form.addressCode = '12345';
          form.address = '서울시 강남구 테헤란로 123';
        };
        
        // 약관 동의 모달 표시
        const showTermsModal = (type) => {
          showModal.value = true;
          
          switch (type) {
            case 'terms':
              modalTitle.value = '서비스 이용약관';
              modalContent.value = `
                <h4>서비스 이용약관</h4>
                <p>본 약관은 리뷰캠퍼스(이하 '회사')가 제공하는 서비스의 이용 조건과 절차, 회사와 회원 간의 권리, 의무 및 책임사항 등을 규정하는 것을 목적으로 합니다.</p>
                <p>1. 회원가입 및 서비스 이용 계약</p>
                <p>2. 회원정보의 관리</p>
                <p>3. 서비스 이용</p>
                <p>4. 리뷰 작성 규정</p>
                <p>5. 서비스 제공 및 변경</p>
                <p>6. 손해배상 및 면책</p>
                <p>7. 기타 조항</p>
                <p>본 약관은 서비스 이용에 필요한 기본적인 사항을 규정하고 있으며, 상세 내용은 회사 웹사이트에서 확인할 수 있습니다.</p>
              `;
              break;
            case 'privacy':
              modalTitle.value = '개인정보 수집 및 이용 동의';
              modalContent.value = `
                <h4>개인정보 수집 및 이용 동의</h4>
                <p>회사는 아래와 같이 개인정보를 수집 및 이용합니다.</p>
                <p><strong>1. 수집하는 개인정보 항목</strong></p>
                <p>- 필수항목: 이메일 주소, 비밀번호, 이름, 휴대폰 번호</p>
                <p>- 선택항목: 블로그 주소, 인스타그램 주소, 유튜브 주소, 주소</p>
                <p><strong>2. 수집 및 이용 목적</strong></p>
                <p>- 회원 관리 및 서비스 제공</p>
                <p>- 리뷰어 매칭 및 제품 체험 기회 제공</p>
                <p><strong>3. 보유 및 이용 기간</strong></p>
                <p>- 회원 탈퇴 시까지 (단, 관계 법령에 따라 보존할 필요가 있는 경우 해당 기간 동안 보존)</p>
                <p>귀하는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있으나, 필수 항목에 대한 동의를 거부할 경우 회원가입이 제한됩니다.</p>
              `;
              break;
            case 'marketing':
              modalTitle.value = '이벤트 및 혜택안내 개인정보 수집·이용 동의';
              modalContent.value = `
                <h4>이벤트 및 혜택안내 개인정보 수집·이용 동의</h4>
                <p>회사는 아래와 같이 마케팅 목적으로 개인정보를 수집 및 이용합니다.</p>
                <p><strong>1. 수집하는 개인정보 항목</strong></p>
                <p>- 이메일 주소, 휴대폰 번호</p>
                <p><strong>2. 수집 및 이용 목적</strong></p>
                <p>- 이벤트, 프로모션, 마케팅 정보 제공</p>
                <p>- 신규 서비스 안내 및 혜택 정보 제공</p>
                <p><strong>3. 보유 및 이용 기간</strong></p>
                <p>- 회원 탈퇴 시 또는 마케팅 정보 수신 철회 시까지</p>
                <p>귀하는 마케팅 목적의 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있으며, 동의를 거부하더라도 기본 서비스 이용에는 제한이 없습니다.</p>
              `;
              break;
            default:
              break;
          }
        };
        
        // 모달 닫기
        const closeModal = () => {
          showModal.value = false;
        };
        
        // 전체 동의 처리
        const toggleAllAgreements = () => {
          const value = form.agreeAll;
          form.agreeAge = value;
          form.agreeTerms = value;
          form.agreePrivacy = value;
          form.agreeMarketing = value;
          form.agreeEmail = value;
          form.agreeSms = value;
          
          validateTerms();
        };
  
        // 마케팅 동의 처리를 위한 메서드
  const handleMarketingChange = () => {
    // 마케팅 동의가 체크되면 이메일/SMS 수신 동의도 체크
    if (form.agreeMarketing) {
      form.agreeEmail = true;
      form.agreeSms = true;
    }
    
    updateAgreeAll();
  };
  
  // 이메일/SMS 동의 처리를 위한 메서드
  const handleMarketingOptionChange = () => {
    // 이메일 또는 SMS 수신 동의 중 하나라도 체크되면 마케팅 동의도 체크
    if (form.agreeEmail || form.agreeSms) {
      form.agreeMarketing = true;
    } else {
      // 둘 다 체크 해제되면 마케팅 동의도 해제
      form.agreeMarketing = false;
    }
    
    updateAgreeAll();
  };
        
        // 개별 동의에 따른 전체 동의 상태 업데이트
        const updateAgreeAll = () => {
          form.agreeAll = 
            form.agreeAge && 
            form.agreeTerms && 
            form.agreePrivacy && 
            form.agreeMarketing &&
            form.agreeEmail &&
            form.agreeSms;
          
          validateTerms();
        };
        
        // 약관 동의 검증
        const validateTerms = () => {
          if (!form.agreeAge || !form.agreeTerms || !form.agreePrivacy) {
            errors.terms = '필수 약관에 모두 동의해주세요';
          } else {
            errors.terms = '';
          }
        };
        
        // 폼 제출 처리
        const submitForm = async () => {
          // 모든 필드 유효성 검사 실행
          validateEmail();
          validatePassword();
          validatePasswordConfirm();
          validateName();
          validatePhone();
          validateBlog();
          validateInstagram();
          validateYoutube();
          validateTerms();
          
          // 유효성 검사 통과 여부 확인
          if (!isFormValid.value) {
            // 필수 약관 동의 확인
            if (!form.agreeAge || !form.agreeTerms || !form.agreePrivacy) {
              errors.terms = '필수 약관에 모두 동의해주세요';
              // 약관 섹션으로 스크롤
              document.querySelector('.terms-container').scrollIntoView({ behavior: 'smooth' });
            }
            return;
          }
          
          // 로딩 상태 시작
          loading.value = true;
          
          try {
            // 실제 회원가입 API 요청 로직이 들어갈 자리
            console.log('회원가입 제출:', form);
            
            // 임시 딜레이 (실제 API 요청으로 대체해야 함)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // 회원가입 성공 시 완료 페이지로 이동
            router.push('/signup-complete');
          } catch (error) {
            console.error('회원가입 실패:', error);
            alert('회원가입 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
          } finally {
            loading.value = false;
          }
        };
    
        return {
          // 상태값
          loading,
          showPassword,
          showModal,
          modalTitle,
          modalContent,
          form,
          errors,
          focusedField,
          
          // 계산된 값
          passwordStrength,
          passwordStrengthText,
          passwordStrengthClass,
          isFormValid,
          canVerifyPhone,
          
          // 메서드
          validateEmail,
          validatePassword,
          validatePasswordConfirm,
          validateName,
          validatePhone,
          validateBlog,
          validateInstagram,
          validateYoutube,
          verifyPhone,
          searchAddress,
          showTermsModal,
          closeModal,
          toggleAllAgreements,
          updateAgreeAll,
          submitForm,
          handleMarketingChange,
          handleMarketingOptionChange
        };
      }
    }
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
    .reviewer-signup-page {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #F5F5F5;
      padding: 40px 20px;
      min-height: 100vh;
    }
    
    .signup-container {
      width: 100%;
      max-width: 760px;
      background-color: #FFFFFF;
      border-radius: 16px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
      padding: 40px;
      animation: fadeIn 0.5s ease;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
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
    
    /* 페이지 타이틀 */
    .page-title {
      text-align: center;
      font-size: 28px;
      font-weight: 700;
      color: #333;
      margin-bottom: 8px;
    }
    
    .page-subtitle {
      text-align: center;
      font-size: 16px;
      color: #666;
      margin-bottom: 32px;
    }
    
    /* 진행 단계 */
    .progress-steps {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 40px;
      position: relative;
    }
    
    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      z-index: 2;
    }
    
    .step-circle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #E0E0E0;
      color: #757575;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 8px;
      transition: all 0.3s ease;
    }
    
    .step.completed .step-circle {
      background-color: #229799;
      color: white;
    }
    
    .step.active .step-circle {
      background-color: #48CFCB;
      color: white;
      box-shadow: 0 0 0 4px rgba(72, 207, 203, 0.2);
    }
    
    .step-icon {
      color: white;
    }
    
    .step-label {
      font-size: 14px;
      color: #757575;
      font-weight: 500;
    }
    
    .step.active .step-label {
      color: #333;
      font-weight: 600;
    }
    
    .step-connector {
      flex-grow: 1;
      height: 2px;
      background-color: #E0E0E0;
      margin: 0 16px;
      position: relative;
      top: -20px;
      z-index: 1;
      max-width: 100px;
    }
    
    /* 폼 섹션 */
    .form-section {
      background-color: #FFFFFF;
      border-radius: 12px;
      padding: 30px;
      margin-bottom: 24px;
      border: 1px solid #EEEEEE;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    }
    
    .section-title {
      display: flex;
      align-items: center;
      font-size: 18px;
      font-weight: 700;
      color: #333;
      margin-bottom: 24px;
      position: relative;
    }
    
    .section-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
      color: #229799;
    }
    
    .required-badge,
    .optional-badge {
      font-size: 12px;
      padding: 3px 8px;
      border-radius: 12px;
      margin-left: 10px;
      font-weight: 500;
    }
    
    .required-badge {
      background-color: rgba(255, 76, 81, 0.1);
      color: #FF4C51;
    }
    
    .optional-badge {
      background-color: rgba(72, 207, 203, 0.1);
      color: #229799;
    }
    
    .section-description {
      font-size: 14px;
      color: #666;
      margin-top: 4px;
      margin-bottom: 20px;
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
      border: 1px solid #DDDDDD;
      border-radius: 8px;
      background-color: #FFFFFF;
      transition: all 0.2s ease;
      overflow: hidden;
    }
    
    .input-container.focused {
      border-color: #48CFCB;
      box-shadow: 0 0 0 3px rgba(72, 207, 203, 0.15);
    }
    
    .input-container.error {
      border-color: #FF4C51;
    }
    
    .input-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 12px;
      color: #999;
    }
    
    .input-container.focused .input-icon {
      color: #229799;
    }
    
    .input-field {
      flex: 1;
      height: 48px;
      padding: 0 12px 0 0;
      border: none;
      background: none;
      font-size: 15px;
      color: #333;
      outline: none;
    }
    
    .input-field::placeholder {
      color: #BBB;
    }
    
    .toggle-password {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 12px;
      background: none;
      border: none;
      color: #999;
      cursor: pointer;
      transition: color 0.2s ease;
    }
    
    .toggle-password:hover {
      color: #333;
    }
    
    .verify-btn,
    .address-search-btn {
      background-color: #48CFCB;
      color: white;
      border: none;
      padding: 0 16px;
      height: 48px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: background-color 0.2s ease;
    }
    
    .verify-btn:hover,
    .address-search-btn:hover {
      background-color: #229799;
    }
    
    .verify-btn:disabled,
    .address-search-btn:disabled {
      background-color: #CCC;
      cursor: not-allowed;
    }
    
    .error-message,
    .success-message {
      display: flex;
      align-items: center;
      font-size: 13px;
      margin-top: 6px;
      padding-left: 4px;
    }
    
    .error-message {
      color: #FF4C51;
    }
    
    .success-message {
      color: #4CAF50;
    }
    
    .error-icon,
    .success-icon {
      margin-right: 6px;
      flex-shrink: 0;
    }
    
    /* 비밀번호 강도 표시 */
    .password-strength {
      display: flex;
      align-items: center;
      margin-top: 8px;
      padding-left: 4px;
    }
    
    .strength-label {
      font-size: 13px;
      color: #666;
      margin-right: 10px;
    }
    
    .strength-bars {
      display: flex;
      gap: 4px;
    }
    
    .strength-bar {
      width: 30px;
      height: 4px;
      background-color: #EEEEEE;
      border-radius: 2px;
      transition: background-color 0.2s ease;
    }
    
    .strength-bar.active.very-weak {
      background-color: #FF4C51;
    }
    
    .strength-bar.active.weak {
      background-color: #FF9800;
    }
    
    .strength-bar.active.medium {
      background-color: #FFEB3B;
    }
    
    .strength-bar.active.strong {
      background-color: #8BC34A;
    }
    
    .strength-bar.active.very-strong {
      background-color: #4CAF50;
    }
    
    .strength-text {
      margin-left: 10px;
      font-size: 13px;
      font-weight: 600;
    }
    
    .strength-text.very-weak {
      color: #FF4C51;
    }
    
    .strength-text.weak {
      color: #FF9800;
    }
    
    .strength-text.medium {
      color: #FFB300;
    }
    
    .strength-text.strong {
      color: #8BC34A;
    }
    
    .strength-text.very-strong {
      color: #4CAF50;
    }
    
    /* 주소 입력 그룹 */
    .address-input-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .address-code {
      max-width: 240px;
    }
    
    /* 약관 동의 섹션 */
    .terms-container {
      margin-top: 10px;
    }
    
    .terms-checkbox {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      cursor: pointer;
      user-select: none;
    }
    
    .terms-checkbox.all-agree {
      padding: 16px;
      background-color: #F8F8F8;
      border-radius: 8px;
      margin-bottom: 16px;
    }
    
    .terms-checkbox input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }
    
    .checkmark {
      position: relative;
      width: 20px;
      height: 20px;
      background-color: #FFFFFF;
      border: 1px solid #DDDDDD;
      border-radius: 4px;
      margin-right: 10px;
      transition: all 0.2s ease;
    }
    
    .checkmark.small {
      width: 16px;
      height: 16px;
    }
    
    .terms-checkbox:hover input ~ .checkmark {
      border-color: #48CFCB;
    }
    
    .terms-checkbox input:checked ~ .checkmark {
      background-color: #229799;
      border-color: #229799;
    }
    
    .checkmark:after {
      content: "";
      position: absolute;
      display: none;
      left: 7px;
      top: 3px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
    
    .checkmark.small:after {
      left: 5px;
      top: 2px;
      width: 4px;
      height: 8px;
    }
    
    .terms-checkbox input:checked ~ .checkmark:after {
      display: block;
    }
    
    .terms-text {
      flex: 1;
      font-size: 14px;
      color: #333;
    }
    
    .terms-description {
      display: block;
      font-size: 13px;
      color: #666;
      font-weight: normal;
      margin-top: 2px;
    }
    
    .required-mark {
      color: #FF4C51;
      font-weight: 500;
    }
    
    .optional-mark {
      color: #666;
    }
    
    .terms-view-btn {
      background: none;
      border: none;
      color: #229799;
      font-size: 13px;
      cursor: pointer;
      text-decoration: underline;
      padding: 0;
      margin-left: 8px;
    }
    
    .terms-divider {
      height: 1px;
      background-color: #EEEEEE;
      margin: 16px 0;
    }
    
    .marketing-options {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-top: 8px;
      margin-left: 30px;
      margin-bottom: 12px;
    }
    
    .marketing-option {
      display: flex;
      align-items: center;
      font-size: 13px;
      color: #666;
      cursor: pointer;
    }
    
    .terms-error {
      margin-top: 12px;
    }
    
    /* 회원가입 버튼 */
    .signup-btn {
      width: 100%;
      height: 54px;
      background-color: #229799;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      margin-bottom: 20px;
    }
    
    .signup-btn:hover:not(:disabled) {
      background-color: #1b7a7c;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(34, 151, 153, 0.2);
    }
    
    .signup-btn:disabled {
      background-color: #A0A0A0;
      cursor: not-allowed;
    }
    
    .spinner {
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
      transition: color 0.2s ease;
    }
    
    .login-link a:hover {
      color: #48CFCB;
      text-decoration: underline;
    }
    
    /* 모달 */
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.2s ease;
    }
    
    .modal-content {
      background-color: white;
      border-radius: 12px;
      width: 90%;
      max-width: 500px;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      animation: scaleIn 0.3s ease;
    }
    
    @keyframes scaleIn {
      from { transform: scale(0.9); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid #EEEEEE;
    }
    
    .modal-header h3 {
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
    
    .modal-close {
      background: none;
      border: none;
      color: #999;
      cursor: pointer;
      padding: 4px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    
    .modal-close:hover {
      background-color: #F5F5F5;
      color: #333;
    }
    
    .modal-body {
      padding: 20px;
      overflow-y: auto;
      flex: 1;
    }
    
    .modal-footer {
      padding: 16px 20px;
      border-top: 1px solid #EEEEEE;
      text-align: right;
    }
    
    .modal-confirm-btn {
      background-color: #229799;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    
    .modal-confirm-btn:hover {
      background-color: #1b7a7c;
    }
    
    /* 반응형 스타일 */
    @media (max-width: 768px) {
      .signup-container {
        padding: 30px 20px;
      }
      
      .form-section {
        padding: 20px;
      }
      
      .progress-steps {
        padding: 0 20px;
      }
      
      .step-connector {
        max-width: 40px;
      }
    }
    
    @media (max-width: 576px) {
      .verify-btn,
      .address-search-btn {
        padding: 0 10px;
        font-size: 13px;
      }
      
      .marketing-options {
        flex-direction: column;
        gap: 10px;
      }
    }
    </style>
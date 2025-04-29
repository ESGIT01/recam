<!-- src/components/partner/profile/PasswordChange.vue -->
<template>
    <div class="password-change">
      <h3 class="section-title">비밀번호 변경</h3>
      <p class="section-desc">비밀번호를 변경하려면 현재 비밀번호를 입력한 후 새 비밀번호를 입력해주세요.</p>
      
      <div class="form-container">
        <form-input
          id="current-password"
          label="현재 비밀번호"
          type="password"
          v-model="formData.currentPassword"
          placeholder="현재 비밀번호를 입력하세요"
          autocomplete="current-password"
          :error-message="errors.currentPassword"
          validate-on-blur
        />
        
        <form-input
          id="new-password"
          label="새 비밀번호"
          type="password"
          v-model="formData.newPassword"
          placeholder="새 비밀번호를 입력하세요"
          autocomplete="new-password"
          :error-message="errors.newPassword"
          validate-on-blur
          helper-text="8자 이상, 영문, 숫자, 특수문자를 포함해주세요"
          @blur="validateNewPassword"
        />
        
        <form-input
          id="confirm-password"
          label="새 비밀번호 확인"
          type="password"
          v-model="formData.confirmPassword"
          placeholder="새 비밀번호를 다시 입력하세요"
          autocomplete="new-password"
          :error-message="errors.confirmPassword"
          validate-on-blur
          @blur="validateConfirmPassword"
        />
        
        <div class="password-guide">
          <h4 class="guide-title">안전한 비밀번호 작성 가이드</h4>
          <ul class="guide-list">
            <li class="guide-item" :class="{ active: passwordStrength.length }">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>8자 이상 입력</span>
            </li>
            <li class="guide-item" :class="{ active: passwordStrength.uppercase }">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>대문자 포함</span>
            </li>
            <li class="guide-item" :class="{ active: passwordStrength.lowercase }">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>소문자 포함</span>
            </li>
            <li class="guide-item" :class="{ active: passwordStrength.number }">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>숫자 포함</span>
            </li>
            <li class="guide-item" :class="{ active: passwordStrength.special }">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>특수문자 포함 (!@#$%^&*)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, reactive, computed, watch } from 'vue';
  import FormInput from '@/components/partner/campaigns/FormInput.vue';
  
  export default defineComponent({
    name: 'PasswordChange',
    components: {
      FormInput
    },
    emits: ['update:data'],
    setup(props, { emit }) {
      const formData = reactive({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      const errors = reactive({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // 비밀번호 강도 검사
      const passwordStrength = computed(() => {
        const password = formData.newPassword;
        return {
          length: password.length >= 8,
          uppercase: /[A-Z]/.test(password),
          lowercase: /[a-z]/.test(password),
          number: /[0-9]/.test(password),
          special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
      });
      
      // 비밀번호 유효성 검사
      const isValidPassword = computed(() => {
        const { length, uppercase, lowercase, number, special } = passwordStrength.value;
        return length && (uppercase || lowercase) && number && special;
      });
      
      // 새 비밀번호 검증
      const validateNewPassword = () => {
        if (!formData.newPassword) {
          errors.newPassword = '';
          return;
        }
        
        if (!isValidPassword.value) {
          errors.newPassword = '비밀번호는 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.';
        } else {
          errors.newPassword = '';
        }
        
        // 확인 비밀번호가 있는 경우 일치 여부 확인
        if (formData.confirmPassword) {
          validateConfirmPassword();
        }
      };
      
      // 비밀번호 확인 검증
      const validateConfirmPassword = () => {
        if (!formData.confirmPassword) {
          errors.confirmPassword = '';
          return;
        }
        
        if (formData.newPassword !== formData.confirmPassword) {
          errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
        } else {
          errors.confirmPassword = '';
        }
      };
      
      // 데이터 변경 시 상위 컴포넌트로 전달
      watch(formData, (newValue) => {
        // 에러가 없고 모든 필드가 채워진 경우에만 업데이트
        if (!errors.currentPassword && !errors.newPassword && !errors.confirmPassword) {
          emit('update:data', {
            ...newValue,
            isValid: formData.newPassword ? isValidPassword.value : true
          });
        }
      }, { deep: true });
      
      return {
        formData,
        errors,
        passwordStrength,
        validateNewPassword,
        validateConfirmPassword
      };
    }
  });
  </script>
  
  <style scoped>
  .password-change {
    margin-bottom: 32px;
  }
  
  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: #424242;
    margin: 0 0 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .section-desc {
    font-size: 14px;
    color: #64748b;
    margin: 0 0 24px;
  }
  
  .form-container {
    max-width: 600px;
  }
  
  .password-guide {
    margin-top: 24px;
    padding: 16px;
    background-color: #F5F5F5;
    border-radius: 8px;
  }
  
  .guide-title {
    font-size: 15px;
    font-weight: 600;
    color: #424242;
    margin: 0 0 12px;
  }
  
  .guide-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .guide-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 0;
    color: #64748b;
    font-size: 14px;
  }
  
  .guide-item svg {
    color: #d1d5db;
  }
  
  .guide-item.active {
    color: #229799;
  }
  
  .guide-item.active svg {
    color: #229799;
  }
  </style>
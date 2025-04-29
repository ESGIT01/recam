<!-- src/views/partner/EditProfileView.vue -->
<template>
    <div class="edit-profile-view">
      <div class="page-header">
        <h1 class="page-title">정보수정</h1>
        <div class="page-description">
          리뷰캠퍼스 파트너 계정 정보를 수정할 수 있습니다. 변경사항은 저장 버튼을 눌러야 적용됩니다.
        </div>
      </div>
  
      <!-- 프로필 헤더 -->
      <profile-header
        :company-name="profileData.companyName"
        :business-type="profileData.businessType"
        :avatar-url="profileImage.preview"
        :is-verified="isVerified"
        :partner-level="partnerLevel"
      >
        <template #actions>
          <div class="header-actions">
            <button 
              type="button" 
              class="cancel-btn" 
              @click="cancelEdit"
            >
              취소
            </button>
            <button 
              type="submit" 
              class="save-btn" 
              @click="saveProfile"
              :disabled="isSaving"
            >
              {{ isSaving ? '저장 중...' : '저장하기' }}
            </button>
          </div>
        </template>
      </profile-header>
  
      <!-- 알림 메시지 -->
      <div v-if="showMessage" class="alert-message" :class="messageType">
        <svg v-if="messageType === 'success'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <svg v-else-if="messageType === 'error'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>{{ message }}</span>
        <button class="close-btn" @click="showMessage = false">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
  
      <!-- 프로필 폼 -->
      <div class="profile-form">
        <div class="form-card">
          <!-- 프로필 이미지 -->
          <profile-image
            :initial-image="profileData.avatarUrl"
            :company-name="profileData.companyName"
            @update:image="handleImageUpdate"
          />
          
          <div class="divider"></div>
          
          <!-- 사업자 정보 -->
          <business-info
            :initial-data="profileData"
            @update:data="handleBusinessInfoUpdate"
          />
          
          <div class="divider"></div>
          
          <!-- 비밀번호 변경 -->
          <password-change
            @update:data="handlePasswordUpdate"
          />
          
          <!-- 제출 버튼 -->
          <div class="form-actions">
            <button 
              type="button" 
              class="cancel-btn" 
              @click="cancelEdit"
            >
              취소
            </button>
            <button 
              type="submit" 
              class="save-btn" 
              @click="saveProfile"
              :disabled="isSaving"
            >
              {{ isSaving ? '저장 중...' : '저장하기' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, reactive, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import ProfileHeader from '@/components/partner/editprofile/ProfileHeader.vue';
  import ProfileImage from '@/components/partner/editprofile/ProfileImage.vue';
  import BusinessInfo from '@/components/partner/editprofile/BusinessInfo.vue';
  import PasswordChange from '@/components/partner/editprofile/PasswordChange.vue';
  
  export default {
    name: 'EditProfileView',
    components: {
      ProfileHeader,
      ProfileImage,
      BusinessInfo,
      PasswordChange
    },
    setup() {
      const router = useRouter();
      
      // 알림 메시지 상태
      const message = ref('');
      const showMessage = ref(false);
      const messageType = ref('success');
      
      // 저장 상태 
      const isSaving = ref(false);
      
      // 프로필 데이터
      const profileData = reactive({
        companyName: '',
        businessNumber: '',
        representative: '',
        businessType: '',
        phone: '',
        email: '',
        website: '',
        address: '',
        addressDetail: '',
        avatarUrl: ''
      });
      
      // 프로필 이미지
      const profileImage = reactive({
        file: null,
        preview: ''
      });
      
      // 비밀번호 데이터
      const passwordData = reactive({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        isValid: true
      });
      
      // 부가 정보
      const isVerified = ref(true);
      const partnerLevel = ref('일반 파트너');
      
      // 초기 데이터 로드 (실제로는 API 호출)
      onMounted(() => {
        // 여기서 실제로는 API를 통해 사용자 정보를 불러오는 로직이 들어갑니다
        // 예시 데이터로 채웁니다
        Object.assign(profileData, {
          companyName: '리뷰캠퍼스 파트너',
          businessNumber: '123-45-67890',
          representative: '홍길동',
          businessType: '서비스업',
          phone: '010-1234-5678',
          email: 'partner@reviewcampus.com',
          website: 'https://reviewcampus.com',
          address: '서울특별시 강남구 테헤란로 123',
          addressDetail: '리뷰캠퍼스 빌딩 7층',
          avatarUrl: '' // 실제로는 이미지 URL
        });
        
        profileImage.preview = profileData.avatarUrl;
      });
      
      // 이미지 업데이트 처리
      const handleImageUpdate = (data) => {
        if (data) {
          profileImage.file = data.file;
          profileImage.preview = data.preview;
        } else {
          profileImage.file = null;
          profileImage.preview = '';
        }
      };
      
      // 비즈니스 정보 업데이트 처리
      const handleBusinessInfoUpdate = (data) => {
        Object.assign(profileData, data);
      };
      
      // 비밀번호 업데이트 처리
      const handlePasswordUpdate = (data) => {
        Object.assign(passwordData, data);
      };
      
      // 알림 메시지 표시
      const showAlert = (msg, type = 'success') => {
        message.value = msg;
        messageType.value = type;
        showMessage.value = true;
        
        // 3초 후 자동으로 알림 숨기기
        setTimeout(() => {
          showMessage.value = false;
        }, 3000);
      };
      
      // 프로필 저장
      const saveProfile = async () => {
        try {
          isSaving.value = true;
          
          // 비밀번호 변경 시 유효성 검사
          if (passwordData.currentPassword && !passwordData.isValid) {
            showAlert('비밀번호 형식이 올바르지 않습니다.', 'error');
            isSaving.value = false;
            return;
          }
          
          // 실제로는 API 호출하여 저장
          // 여기서는 타이머로 API 호출 시뮬레이션
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          showAlert('정보가 성공적으로 저장되었습니다.', 'success');
          
          // 비밀번호 정보 초기화
          passwordData.currentPassword = '';
          passwordData.newPassword = '';
          passwordData.confirmPassword = '';
          
        } catch (error) {
          console.error('정보 저장 실패:', error);
          showAlert('정보 저장에 실패했습니다. 다시 시도해주세요.', 'error');
        } finally {
          isSaving.value = false;
        }
      };
      
      // 취소 처리
      const cancelEdit = () => {
        if (confirm('변경사항이 저장되지 않습니다. 취소하시겠습니까?')) {
          router.push('/partner/dashboard');
        }
      };
      
      return {
        profileData,
        profileImage,
        isVerified,
        partnerLevel,
        message,
        showMessage,
        messageType,
        isSaving,
        handleImageUpdate,
        handleBusinessInfoUpdate,
        handlePasswordUpdate,
        saveProfile,
        cancelEdit
      };
    }
  };
  </script>
  
  <style scoped>
  .edit-profile-view {
    width: 100%;
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: #424242;
    padding-bottom: 48px;
  }
  
  .page-header {
    margin-bottom: 32px;
  }
  
  .page-title {
    font-size: 28px;
    font-weight: 700;
    color: #424242;
    margin: 0 0 12px;
  }
  
  .page-description {
    font-size: 16px;
    color: #64748b;
    max-width: 700px;
  }
  
  .header-actions {
    display: flex;
    gap: 12px;
  }
  
  .alert-message {
    display: flex;
    align-items: center;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 24px;
    font-size: 15px;
  }
  
  .alert-message.success {
    background-color: #ecfdf5;
    color: #047857;
  }
  
  .alert-message.error {
    background-color: #fef2f2;
    color: #b91c1c;
  }
  
  .alert-message svg {
    margin-right: 12px;
    flex-shrink: 0;
  }
  
  .alert-message span {
    flex: 1;
  }
  
  .close-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: currentColor;
    opacity: 0.7;
    transition: opacity 0.3s;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .close-btn:hover {
    opacity: 1;
  }
  
  .profile-form {
    margin-top: 24px;
  }
  
  .form-card {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    padding: 32px;
    border: 1px solid #e5e7eb;
  }
  
  .divider {
    height: 1px;
    background-color: #e5e7eb;
    margin: 32px 0;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 32px;
  }
  
  .save-btn {
    padding: 12px 24px;
    background-color: #229799;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .save-btn:hover:not(:disabled) {
    background-color: #1a7a7c;
  }
  
  .save-btn:disabled {
    background-color: #94a3b8;
    cursor: not-allowed;
  }
  
  .cancel-btn {
    padding: 12px 24px;
    background-color: white;
    color: #424242;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .cancel-btn:hover {
    background-color: #F5F5F5;
  }
  
  @media (max-width: 768px) {
    .form-card {
      padding: 24px 16px;
    }
    
    .form-actions {
      flex-direction: column-reverse;
    }
    
    .save-btn, .cancel-btn {
      width: 100%;
    }
  }
  </style>
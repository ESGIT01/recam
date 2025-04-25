<template>
    <div class="reviewer-edit-profile">
      <div class="page-layout">
        <!-- 왼쪽 사이드바 -->
        <ReviewerSidebar />
        
        <!-- 메인 콘텐츠 영역 -->
        <div class="profile-content">
          <!-- 페이지 헤더 -->
          <div class="page-header">
            <h1 class="page-title">내 정보 수정</h1>
          </div>
  
          <!-- 프로필 수정 폼 -->
          <div class="profile-edit-form">
            <!-- 프로필 이미지 섹션 -->
            <div class="profile-image-section">
              <div class="profile-image-container">
                <div v-if="previewImage || userProfile.avatarUrl" class="profile-image">
                  <img :src="previewImage || userProfile.avatarUrl" alt="프로필 이미지" />
                </div>
                <div v-else class="profile-image-placeholder">
                  {{ userProfile.nickname.charAt(0) }}
                </div>
                <div class="image-overlay" @click="triggerImageUpload">
                  <div class="overlay-content">
                    <div class="overlay-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <div class="overlay-text">변경</div>
                  </div>
                </div>
                <input 
                  type="file" 
                  ref="imageInput" 
                  style="display: none" 
                  @change="handleImageUpload"
                  accept="image/*"
                />
              </div>
              <div class="image-actions">
                <button v-if="previewImage || userProfile.avatarUrl" class="remove-image-button" @click="removeImage">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6H5H21" stroke="#F44336" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="#F44336" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>이미지 삭제</span>
                </button>
              </div>
              <div class="image-note">
                JPG, PNG 파일 (최대 5MB), 정사각형 이미지 권장
              </div>
            </div>
  
            <!-- 기본 정보 섹션 -->
            <div class="form-section">
              <h2 class="section-title">기본 정보</h2>
              
              <div class="form-group">
                <label for="nickname">닉네임<span class="required">*</span></label>
                <div class="input-group">
                  <input 
                    type="text" 
                    id="nickname" 
                    v-model="userProfile.nickname" 
                    class="form-input"
                    placeholder="닉네임을 입력하세요"
                    maxlength="20"
                  />
                  <div class="input-note">2-20자 이내로 입력해주세요</div>
                </div>
              </div>
              
              <div class="form-group">
                <label for="bio">자기소개</label>
                <div class="input-group">
                  <textarea 
                    id="bio" 
                    v-model="userProfile.bio" 
                    class="form-textarea"
                    placeholder="자기소개를 입력하세요"
                    maxlength="100"
                    rows="3"
                  ></textarea>
                  <div class="input-note">최대 100자까지 입력 가능합니다 ({{ userProfile.bio.length }}/100)</div>
                </div>
              </div>
            </div>
  
            <!-- 연락처 정보 섹션 -->
            <div class="form-section">
              <h2 class="section-title">연락처 정보</h2>
              
              <div class="form-group">
                <label for="email">이메일<span class="required">*</span></label>
                <div class="input-group">
                  <input 
                    type="email" 
                    id="email" 
                    v-model="userProfile.email" 
                    class="form-input"
                    placeholder="이메일을 입력하세요"
                    :disabled="!emailEditable"
                  />
                  <button v-if="!emailEditable" class="change-button" @click="startEmailChange">
                    변경
                  </button>
                </div>
              </div>
              
              <div v-if="emailEditable" class="form-group verification-group">
                <label for="emailVerificationCode">인증코드<span class="required">*</span></label>
                <div class="input-group">
                  <input 
                    type="text" 
                    id="emailVerificationCode" 
                    v-model="emailVerificationCode" 
                    class="form-input"
                    placeholder="인증코드 6자리를 입력하세요"
                    maxlength="6"
                  />
                  <button 
                    class="verification-button" 
                    :class="{ 'sent': emailCodeSent }"
                    @click="sendEmailVerificationCode"
                  >
                    {{ emailCodeSent ? '재전송' : '인증코드 전송' }}
                  </button>
                </div>
                <div class="verification-note" v-if="emailCodeSent">
                  인증코드가 이메일로 전송되었습니다. 5분 내로 입력해주세요.
                </div>
              </div>
              
              <div class="form-group">
                <label for="phone">휴대폰 번호<span class="required">*</span></label>
                <div class="input-group">
                  <input 
                    type="tel" 
                    id="phone" 
                    v-model="userProfile.phone" 
                    class="form-input"
                    placeholder="'-' 없이 숫자만 입력하세요"
                    maxlength="11"
                    :disabled="!phoneEditable"
                  />
                  <button v-if="!phoneEditable" class="change-button" @click="startPhoneChange">
                    변경
                  </button>
                </div>
              </div>
              
              <div v-if="phoneEditable" class="form-group verification-group">
                <label for="phoneVerificationCode">인증코드<span class="required">*</span></label>
                <div class="input-group">
                  <input 
                    type="text" 
                    id="phoneVerificationCode" 
                    v-model="phoneVerificationCode" 
                    class="form-input"
                    placeholder="인증코드 6자리를 입력하세요"
                    maxlength="6"
                  />
                  <button 
                    class="verification-button" 
                    :class="{ 'sent': phoneCodeSent }"
                    @click="sendPhoneVerificationCode"
                  >
                    {{ phoneCodeSent ? '재전송' : '인증코드 전송' }}
                  </button>
                </div>
                <div class="verification-note" v-if="phoneCodeSent">
                  인증코드가 SMS로 전송되었습니다. 5분 내로 입력해주세요.
                </div>
              </div>
            </div>
  
            <!-- 관심 카테고리 섹션 -->
            <div class="form-section">
              <h2 class="section-title">관심 카테고리</h2>
              <div class="category-note">관심 있는 카테고리를 선택하시면 해당 카테고리의 캠페인을 우선적으로 추천해 드립니다. (최대 5개)</div>
              
              <div class="categories-grid">
                <div 
                  v-for="category in categories" 
                  :key="category.id" 
                  class="category-item"
                  :class="{ 'selected': selectedCategories.includes(category.id) }"
                  @click="toggleCategory(category.id)"
                >
                  <div class="category-icon">{{ category.icon }}</div>
                  <div class="category-name">{{ category.name }}</div>
                </div>
              </div>
            </div>
  
            <!-- SNS 계정 섹션 -->
            <div class="form-section">
              <h2 class="section-title">SNS 계정</h2>
              <div class="sns-note">리뷰를 작성할 SNS 계정을 입력해주세요. 캠페인 신청 시 참고됩니다.</div>
              
              <div class="form-group">
                <label for="instagram">인스타그램</label>
                <div class="input-group sns-input-group">
                  <div class="sns-prefix">instagram.com/</div>
                  <input 
                    type="text" 
                    id="instagram" 
                    v-model="userProfile.sns.instagram" 
                    class="form-input sns-input"
                    placeholder="계정명"
                  />
                </div>
              </div>
              
              <div class="form-group">
                <label for="blog">블로그</label>
                <input 
                  type="url" 
                  id="blog" 
                  v-model="userProfile.sns.blog" 
                  class="form-input"
                  placeholder="URL을 입력해주세요 (예: https://blog.naver.com/account)"
                />
              </div>
              
              <div class="form-group">
                <label for="youtube">유튜브</label>
                <div class="input-group sns-input-group">
                  <div class="sns-prefix">youtube.com/</div>
                  <input 
                    type="text" 
                    id="youtube" 
                    v-model="userProfile.sns.youtube" 
                    class="form-input sns-input"
                    placeholder="채널명 또는 ID"
                  />
                </div>
              </div>
            </div>
  
            <!-- 하단 버튼 영역 -->
            <div class="form-actions">
              <button class="cancel-button" @click="cancelEdit">취소</button>
              <button 
                class="save-button" 
                :disabled="!canSave"
                @click="saveProfile"
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import ReviewerSidebar from '@/components/ReviewerSidebar.vue';
  
  export default {
    name: 'ReviewerEditProfile',
    components: {
      ReviewerSidebar
    },
    data() {
      return {
        // 프로필 이미지 프리뷰
        previewImage: null,
        
        // 이메일/휴대폰 인증 관련
        emailEditable: false,
        phoneEditable: false,
        emailVerificationCode: '',
        phoneVerificationCode: '',
        emailCodeSent: false,
        phoneCodeSent: false,
        
        // 사용자 프로필 정보
        userProfile: {
          nickname: '리뷰어123',
          bio: '안녕하세요! 화장품과 푸드 분야의 열정적인 리뷰어입니다.',
          avatarUrl: '',
          email: 'reviewer123@example.com',
          phone: '01012345678',
          sns: {
            instagram: 'reviewer123',
            blog: 'https://blog.naver.com/reviewer123',
            youtube: ''
          }
        },
        
        // 카테고리 목록
        categories: [
          { id: 1, name: '뷰티', icon: '💄' },
          { id: 2, name: '푸드', icon: '🍔' },
          { id: 3, name: '패션', icon: '👗' },
          { id: 4, name: '디지털', icon: '📱' },
          { id: 5, name: '생활용품', icon: '🧹' },
          { id: 6, name: '육아', icon: '🧸' },
          { id: 7, name: '반려동물', icon: '🐶' },
          { id: 8, name: '도서', icon: '📚' },
          { id: 9, name: '여행', icon: '✈️' },
          { id: 10, name: '건강', icon: '💪' },
          { id: 11, name: '인테리어', icon: '🏠' },
          { id: 12, name: '스포츠', icon: '⚽' }
        ],
        selectedCategories: [1, 2, 5]
      }
    },
    computed: {
      canSave() {
        // 필수 입력 사항 확인
        const hasRequiredFields = this.userProfile.nickname && 
                                 this.userProfile.email && 
                                 this.userProfile.phone;
        
        // 이메일 또는 휴대폰 인증 중인 경우 인증 완료 필요
        if (this.emailEditable && (!this.emailVerificationCode || this.emailVerificationCode.length !== 6)) {
          return false;
        }
        
        if (this.phoneEditable && (!this.phoneVerificationCode || this.phoneVerificationCode.length !== 6)) {
          return false;
        }
        
        return hasRequiredFields;
      }
    },
    methods: {
      triggerImageUpload() {
        this.$refs.imageInput.click();
      },
      handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // 이미지 타입 확인
        if (!file.type.match('image.*')) {
          alert('이미지 파일만 업로드 가능합니다.');
          return;
        }
        
        // 파일 크기 확인 (5MB 제한)
        if (file.size > 5 * 1024 * 1024) {
          alert('이미지 크기는 5MB 이하여야 합니다.');
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewImage = e.target.result;
        };
        reader.readAsDataURL(file);
      },
      removeImage() {
        this.previewImage = null;
        this.userProfile.avatarUrl = '';
        this.$refs.imageInput.value = '';
      },
      startEmailChange() {
        this.emailEditable = true;
        this.emailVerificationCode = '';
        this.emailCodeSent = false;
      },
      startPhoneChange() {
        this.phoneEditable = true;
        this.phoneVerificationCode = '';
        this.phoneCodeSent = false;
      },
      sendEmailVerificationCode() {
        // 실제로는 API 호출하여 인증 코드 전송
        // 여기서는 UI만 업데이트
        if (!this.userProfile.email) {
          alert('이메일을 입력해주세요.');
          return;
        }
        
        this.emailCodeSent = true;
        alert(`${this.userProfile.email}로 인증 코드가 전송되었습니다. (실제로는 전송되지 않습니다)`);
      },
      sendPhoneVerificationCode() {
        // 실제로는 API 호출하여 인증 코드 전송
        // 여기서는 UI만 업데이트
        if (!this.userProfile.phone) {
          alert('휴대폰 번호를 입력해주세요.');
          return;
        }
        
        this.phoneCodeSent = true;
        alert(`${this.userProfile.phone}로 인증 코드가 전송되었습니다. (실제로는 전송되지 않습니다)`);
      },
      toggleCategory(categoryId) {
        const index = this.selectedCategories.indexOf(categoryId);
        
        if (index === -1) {
          // 최대 5개 제한
          if (this.selectedCategories.length >= 5) {
            alert('관심 카테고리는 최대 5개까지 선택 가능합니다.');
            return;
          }
          this.selectedCategories.push(categoryId);
        } else {
          this.selectedCategories.splice(index, 1);
        }
      },
      cancelEdit() {
        // 변경 사항 취소하고 이전 페이지로 이동
        if (confirm('변경사항이 저장되지 않습니다. 취소하시겠습니까?')) {
          this.$router.push('/reviewer-mypage');
        }
      },
      saveProfile() {
        if (!this.canSave) return;
        
        // 이메일 또는 전화번호 변경 시 인증 확인
        if (this.emailEditable && this.emailVerificationCode !== '123456') {
          alert('이메일 인증 코드가 올바르지 않습니다.');
          return;
        }
        
        if (this.phoneEditable && this.phoneVerificationCode !== '123456') {
          alert('휴대폰 인증 코드가 올바르지 않습니다.');
          return;
        }
        
        // 실제로는 API 호출하여 프로필 업데이트
        // 여기서는 UI 메시지만 표시
        alert('프로필이 성공적으로 업데이트되었습니다.');
        
        // 인증 상태 초기화
        this.emailEditable = false;
        this.phoneEditable = false;
        this.emailVerificationCode = '';
        this.phoneVerificationCode = '';
        this.emailCodeSent = false;
        this.phoneCodeSent = false;
        
        // 마이페이지로 이동
        this.$router.push('/reviewer-mypage');
      }
    }
  };
  </script>
  
  <style scoped>
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
  
  * {
    font-family: 'Pretendard', sans-serif;
    box-sizing: border-box;
  }
  
  .reviewer-edit-profile {
    background-color: #FFFFFF;
    min-height: 100vh;
  }
  
  .page-layout {
    display: flex;
    max-width: 1280px;
    margin: 0 auto;
  }
  
  .profile-content {
    flex: 1;
    padding: 40px;
  }
  
  .page-header {
    margin-bottom: 24px;
  }
  
  .page-title {
    font-size: 24px;
    font-weight: 700;
    color: #229799;
    margin: 0;
  }
  
  /* 프로필 수정 폼 */
  .profile-edit-form {
    background-color: white;
    border-radius: 12px;
    padding: 32px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #F0F0F0;
  }
  
  /* 프로필 이미지 섹션 */
  .profile-image-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 32px;
  }
  
  .profile-image-container {
    position: relative;
    width: 120px;
    height: 120px;
    margin-bottom: 16px;
  }
  
  .profile-image {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
  }
  
  .profile-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .profile-image-placeholder {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #48CFCB;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    font-weight: 700;
    color: white;
  }
  
  .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 0.2s;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .profile-image-container:hover .image-overlay {
    opacity: 1;
  }
  
  .overlay-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
  }
  
  .overlay-icon {
    margin-bottom: 4px;
  }
  
  .overlay-text {
    font-size: 14px;
  }
  
  .image-actions {
    margin-bottom: 8px;
  }
  
  .remove-image-button {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    color: #F44336;
    font-size: 14px;
    cursor: pointer;
  }
  
  .remove-image-button svg {
    margin-right: 4px;
  }
  
  .image-note {
    font-size: 13px;
    color: #757575;
    text-align: center;
  }
  
  /* 폼 섹션 */
  .form-section {
    margin-bottom: 32px;
    padding-bottom: 32px;
    border-bottom: 1px solid #E0E0E0;
  }
  
  .form-section:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
  
  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: #424242;
    margin: 0 0 16px 0;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group:last-child {
    margin-bottom: 0;
  }
  
  .form-group label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #424242;
    margin-bottom: 8px;
  }
  
  .required {
    color: #F44336;
    margin-left: 2px;
  }
  
  .input-group {
    position: relative;
  }
  
  .form-input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #E0E0E0;
    border-radius: 6px;
    font-size: 16px;
  }
  
  .form-input:disabled {
    background-color: #F5F5F5;
    color: #757575;
  }
  
  .form-textarea {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #E0E0E0;
    border-radius: 6px;
    font-size: 16px;
    resize: vertical;
  }
  
  .input-note {
    font-size: 13px;
    color: #757575;
    margin-top: 4px;
  }
  
  .change-button {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    background-color: transparent;
    border: 1px solid #229799;
    color: #229799;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
  }
  
  /* 인증 관련 */
  .verification-group {
    margin-top: -10px;
    margin-bottom: 24px;
  }
  
  .verification-button {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    background-color: #229799;
    border: none;
    color: white;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
  }
  
  .verification-button.sent {
    background-color: #757575;
  }
  
  .verification-note {
    font-size: 13px;
    color: #229799;
    margin-top: 4px;
  }
  
  /* 관심 카테고리 */
  .category-note {
    font-size: 14px;
    color: #757575;
    margin-bottom: 16px;
  }
  
  .categories-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 12px;
  }
  
  .category-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px;
    border: 1px solid #E0E0E0;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .category-item:hover {
    border-color: #48CFCB;
  }
  
  .category-item.selected {
    border-color: #229799;
    background-color: rgba(72, 207, 203, 0.1);
  }
  
  .category-icon {
    font-size: 24px;
    margin-bottom: 8px;
  }
  
  .category-name {
    font-size: 14px;
    color: #424242;
  }
  
  /* SNS 계정 */
  .sns-note {
    font-size: 14px;
    color: #757575;
    margin-bottom: 16px;
  }
  
  .sns-input-group {
    display: flex;
    align-items: center;
  }
  
  .sns-prefix {
    font-size: 16px;
    color: #757575;
    padding-right: 8px;
  }
  
  .sns-input {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  
  /* 하단 버튼 영역 */
  .form-actions {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 32px;
  }
  
  .cancel-button {
    padding: 12px 32px;
    border: 1px solid #E0E0E0;
    background-color: white;
    border-radius: 6px;
    color: #666;
    font-weight: 500;
    font-size: 16px;
    cursor: pointer;
  }
  
  .cancel-button:hover {
    background-color: #F5F5F5;
  }
  
  .save-button {
    padding: 12px 32px;
    border: none;
    background-color: #229799;
    color: white;
    border-radius: 6px;
    font-weight: 500;
    font-size: 16px;
    cursor: pointer;
  }
  
  .save-button:hover {
    background-color: #1b7a7b;
  }
  
  .save-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  /* 반응형 설정 */
  @media (max-width: 1200px) {
    .profile-content {
      padding: 24px;
    }
    
    .categories-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  
  @media (max-width: 768px) {
    .profile-edit-form {
      padding: 24px 16px;
    }
    
    .categories-grid {
      grid-template-columns: repeat(3, 1fr);
    }
    
    .form-actions {
      flex-direction: column;
    }
    
    .cancel-button, .save-button {
      width: 100%;
    }
  }
  
  @media (max-width: 480px) {
    .categories-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  </style>
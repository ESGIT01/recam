<!-- src/components/partner/profile/ProfileImage.vue -->
<template>
    <div class="profile-image-uploader">
      <h3 class="section-title">프로필 이미지</h3>
      
      <div class="profile-image-container">
        <div class="profile-preview">
          <img v-if="imagePreview" :src="imagePreview" alt="프로필 이미지" class="profile-img" />
          <div v-else class="profile-placeholder">
            <span>{{ userInitials }}</span>
          </div>
          
          <div class="image-overlay">
            <label for="image-upload" class="upload-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
            </label>
            <input 
              type="file" 
              id="image-upload" 
              class="hidden-input" 
              accept="image/jpeg, image/png" 
              @change="handleImageUpload"
            />
          </div>
        </div>
        
        <div class="image-info">
          <h4 class="info-title">프로필 이미지 등록</h4>
          <ul class="info-list">
            <li>JPG, PNG 파일 형식만 지원합니다.</li>
            <li>최대 5MB까지 업로드 가능합니다.</li>
            <li>기업 로고나 대표 이미지를 등록해주세요.</li>
          </ul>
          
          <div v-if="imageFile" class="file-info">
            <div class="file-name">{{ imageFile.name }}</div>
            <div class="file-size">{{ formatFileSize(imageFile.size) }}</div>
            <button class="remove-button" @click="removeImage">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              삭제
            </button>
          </div>
          
          <div v-if="uploadError" class="error-message">{{ uploadError }}</div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, defineComponent, computed } from 'vue';
  
  export default defineComponent({
    name: 'ProfileImage',
    props: {
      initialImage: {
        type: String,
        default: ''
      },
      companyName: {
        type: String,
        default: ''
      }
    },
    emits: ['update:image'],
    setup(props, { emit }) {
      const imageFile = ref(null);
      const imagePreview = ref(props.initialImage);
      const uploadError = ref('');
      
      const userInitials = computed(() => {
        if (!props.companyName) return '';
        return props.companyName.charAt(0).toUpperCase();
      });
      
      const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        // 파일 유형 검증
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
          uploadError.value = 'JPG 또는 PNG 파일만 업로드 가능합니다.';
          return;
        }
        
        // 파일 크기 검증 (5MB)
        if (file.size > 5 * 1024 * 1024) {
          uploadError.value = '파일 크기는 최대 5MB까지 가능합니다.';
          return;
        }
        
        uploadError.value = '';
        imageFile.value = file;
        
        // 이미지 미리보기 생성
        const reader = new FileReader();
        reader.onload = (e) => {
          imagePreview.value = e.target.result;
          emit('update:image', {
            file: imageFile.value,
            preview: imagePreview.value
          });
        };
        reader.readAsDataURL(file);
      };
      
      const removeImage = () => {
        imageFile.value = null;
        imagePreview.value = '';
        // input 필드 리셋
        const input = document.getElementById('image-upload');
        if (input) input.value = '';
        
        emit('update:image', null);
      };
      
      const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
      };
      
      return {
        imageFile,
        imagePreview,
        uploadError,
        userInitials,
        handleImageUpload,
        removeImage,
        formatFileSize
      };
    }
  });
  </script>
  
  <style scoped>
  .profile-image-uploader {
    margin-bottom: 32px;
  }
  
  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: #424242;
    margin: 0 0 16px;
  }
  
  .profile-image-container {
    display: flex;
    align-items: flex-start;
    gap: 24px;
  }
  
  .profile-preview {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
    background-color: #F5F5F5;
  }
  
  .profile-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .profile-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    font-weight: 600;
    color: #229799;
  }
  
  .image-overlay {
    position: absolute;
    bottom: 0;
    right: 0;
    background-color: #229799;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: white;
    transition: background-color 0.3s;
  }
  
  .image-overlay:hover {
    background-color: #1a7a7c;
  }
  
  .upload-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
  
  .hidden-input {
    display: none;
  }
  
  .image-info {
    flex: 1;
  }
  
  .info-title {
    font-size: 16px;
    font-weight: 600;
    color: #424242;
    margin: 0 0 12px;
  }
  
  .info-list {
    list-style-type: none;
    padding: 0;
    margin: 0 0 16px;
  }
  
  .info-list li {
    position: relative;
    padding-left: 20px;
    margin-bottom: 8px;
    font-size: 14px;
    color: #64748b;
  }
  
  .info-list li::before {
    content: "•";
    position: absolute;
    left: 0;
    color: #229799;
  }
  
  .file-info {
    padding: 12px;
    background-color: #F5F5F5;
    border-radius: 8px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
  }
  
  .file-name {
    flex: 1;
    font-size: 14px;
    color: #424242;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .file-size {
    margin: 0 12px;
    font-size: 12px;
    color: #64748b;
  }
  
  .remove-button {
    display: flex;
    align-items: center;
    gap: 4px;
    background: none;
    border: none;
    color: #f43f5e;
    font-size: 14px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    transition: background-color 0.3s;
  }
  
  .remove-button:hover {
    background-color: #fee2e2;
  }
  
  .error-message {
    color: #e11d48;
    font-size: 14px;
    margin-top: 8px;
  }
  
  @media (max-width: 640px) {
    .profile-image-container {
      flex-direction: column;
      align-items: center;
    }
    
    .profile-preview {
      margin-bottom: 16px;
    }
    
    .image-info {
      width: 100%;
      text-align: center;
    }
    
    .info-list li {
      text-align: left;
    }
  }
  </style>
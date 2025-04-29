<!-- src/components/partner/common/ProfileHeader.vue -->
<template>
    <div class="profile-header">
      <div class="profile-avatar">
        <img v-if="avatarUrl" :src="avatarUrl" alt="프로필 이미지" />
        <div v-else class="avatar-placeholder">
          <span>{{ userInitials }}</span>
        </div>
      </div>
      <div class="profile-info">
        <h2 class="company-name">{{ companyName }}</h2>
        <p class="business-type">{{ businessType }}</p>
        <div class="profile-badges">
          <span class="badge verified" v-if="isVerified">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            인증완료
          </span>
          <span class="badge" :class="partnerLevelClass">
            {{ partnerLevel }}
          </span>
        </div>
      </div>
      <div class="profile-actions">
        <slot name="actions">
          <router-link to="/partner/edit-profile" class="edit-profile-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            정보수정
          </router-link>
        </slot>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ProfileHeader',
    props: {
      companyName: {
        type: String,
        required: true
      },
      businessType: {
        type: String,
        default: ''
      },
      avatarUrl: {
        type: String,
        default: ''
      },
      isVerified: {
        type: Boolean,
        default: false
      },
      partnerLevel: {
        type: String,
        default: '일반 파트너'
      }
    },
    computed: {
      userInitials() {
        if (!this.companyName) return '';
        return this.companyName.charAt(0).toUpperCase();
      },
      partnerLevelClass() {
        const levelMap = {
          '일반 파트너': 'regular',
          '실버 파트너': 'silver',
          '골드 파트너': 'gold',
          '플래티넘 파트너': 'platinum'
        };
        
        return levelMap[this.partnerLevel] || 'regular';
      }
    }
  };
  </script>
  
  <style scoped>
  .profile-header {
    display: flex;
    align-items: center;
    padding: 24px;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    margin-bottom: 24px;
    border: 1px solid #e5e7eb;
  }
  
  .profile-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 20px;
    flex-shrink: 0;
  }
  
  .profile-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .avatar-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #F5F5F5;
    color: #229799;
    font-size: 32px;
    font-weight: 600;
  }
  
  .profile-info {
    flex: 1;
  }
  
  .company-name {
    font-size: 20px;
    font-weight: 600;
    color: #424242;
    margin: 0 0 4px;
  }
  
  .business-type {
    color: #64748b;
    font-size: 14px;
    margin: 0 0 8px;
  }
  
  .profile-badges {
    display: flex;
    gap: 8px;
  }
  
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    background-color: #F5F5F5;
    color: #64748b;
  }
  
  .badge.verified {
    background-color: #ecfdf5;
    color: #047857;
  }
  
  .badge.regular {
    background-color: #F5F5F5;
    color: #64748b;
  }
  
  .badge.silver {
    background-color: #f1f5f9;
    color: #475569;
  }
  
  .badge.gold {
    background-color: #fef9c3;
    color: #854d0e;
  }
  
  .badge.platinum {
    background-color: #e0f2fe;
    color: #0369a1;
  }
  
  .profile-actions {
    margin-left: auto;
  }
  
  .edit-profile-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    color: #424242;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.3s ease;
  }
  
  .edit-profile-btn:hover {
    background-color: #F5F5F5;
  }
  
  @media (max-width: 640px) {
    .profile-header {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .profile-avatar {
      margin-bottom: 16px;
    }
    
    .profile-actions {
      margin-left: 0;
      margin-top: 16px;
      width: 100%;
    }
    
    .edit-profile-btn {
      width: 100%;
      justify-content: center;
    }
  }
  </style>
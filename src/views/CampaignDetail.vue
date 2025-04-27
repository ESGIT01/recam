<template>
    <div class="campaign-detail">
      <!-- 헤더 영역 -->
      <header class="header-section">
        <div class="header-content">
          <button class="back-button" @click="goBack">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <h1>캠페인 상세보기</h1>
          <button class="share-button" @click="shareCampaign">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8.59 13.51L15.42 17.49" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15.41 6.51L8.59 10.49" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </header>
  
      <!-- 메인 콘텐츠 -->
      <main class="main-content">
        <!-- 히어로 섹션 -->
        <section class="hero-section">
          <div class="hero-image-container">
            <img :src="campaign.thumbnail" :alt="campaign.title" />
            <div class="hero-overlay"></div>
            <div class="hero-badges">
              <div class="campaign-type-badge">{{ getCampaignTypeLabel(campaign.type) }}</div>
              <div class="category-badge">{{ getCategoryLabel(campaign.category) }}</div>
            </div>
            <div class="campaign-status" :class="campaign.status">
              <span class="status-dot"></span>
              {{ getStatusLabel(campaign.status) }}
            </div>
          </div>
          
          <!-- 빠른 정보 카드 -->
          <div class="quick-stats-card">
            <div class="stat-item">
              <div class="stat-icon recruitment">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="stat-info">
                <div class="stat-label">모집현황</div>
                <div class="stat-value">
                  <span class="current">{{ campaign.currentApplicants }}</span>
                  <span class="divider">/</span>
                  <span class="total">{{ campaign.recruitmentCount }}명</span>
                </div>
                <div class="progress-bar">
                  <div class="progress" :style="{ width: recruitmentProgress + '%' }"></div>
                </div>
              </div>
            </div>
            
            <div class="stat-item">
              <div class="stat-icon deadline">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 6V12L16 14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="stat-info">
                <div class="stat-label">남은 기간</div>
                <div class="stat-value">{{ remainingDays }}일</div>
              </div>
            </div>
            
            <div class="stat-item">
              <div class="stat-icon reward">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="stat-info">
                <div class="stat-label">리워드</div>
                <div class="stat-value">{{ formatPrice(campaign.rewardPoint) }}P</div>
              </div>
            </div>
          </div>
        </section>
  
        <!-- 캠페인 기본 정보 -->
        <section class="campaign-info-section">
          <div class="info-header">
            <div class="company-info">
              <div class="company-logo">
                <img :src="campaign.companyLogo" :alt="campaign.companyName" />
              </div>
              <div class="company-details">
                <h2>{{ campaign.companyName }}</h2>
                <div class="company-rating">
                  <div class="rating-stars">
                    <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= campaign.companyRating }">★</span>
                  </div>
                  <span class="rating-number">{{ campaign.companyRating }}</span>
                </div>
              </div>
            </div>
            <button class="follow-button" @click="toggleFollow" :class="{ following: isFollowing }">
              {{ isFollowing ? '팔로잉' : '팔로우' }}
            </button>
          </div>
          
          <h1 class="campaign-title">{{ campaign.title }}</h1>
          
          <div class="campaign-tags">
            <span v-for="tag in campaign.tags" :key="tag" class="tag">#{{ tag }}</span>
          </div>
        </section>
  
        <!-- 상세 일정 타임라인 -->
        <section class="timeline-section">
          <h3 class="section-title">캠페인 일정</h3>
          <div class="timeline">
            <div class="timeline-item" :class="{ active: isDateActive('application') }">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <div class="timeline-date">{{ formatDate(campaign.startDate) }} ~ {{ formatDate(campaign.endDate) }}</div>
                <div class="timeline-title">신청 기간</div>
                <div class="timeline-description">체험단 신청을 받는 기간입니다</div>
              </div>
            </div>
            <div class="timeline-item" :class="{ active: isDateActive('announcement') }">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <div class="timeline-date">{{ formatDate(campaign.announceDate) }}</div>
                <div class="timeline-title">발표일</div>
                <div class="timeline-description">선정된 체험단을 발표합니다</div>
              </div>
            </div>
            <div class="timeline-item" :class="{ active: isDateActive('experience') }">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <div class="timeline-date">{{ formatDate(campaign.experienceStartDate) }} ~ {{ formatDate(campaign.experienceEndDate) }}</div>
                <div class="timeline-title">체험 및 리뷰 기간</div>
                <div class="timeline-description">제품 체험 후 리뷰를 작성해주세요</div>
              </div>
            </div>
          </div>
        </section>
  
        <!-- 제공 내역 섹션 -->
        <section class="provision-section">
          <h3 class="section-title">제공 내역</h3>
          <div class="provision-card">
            <div class="provision-items">
              <div v-for="item in campaign.provisionItems" :key="item.id" class="provision-item" @click="showItemDetail(item)">
                <div class="item-image">
                  <img :src="item.image" :alt="item.name" />
                </div>
                <div class="item-info">
                  <h4>{{ item.name }}</h4>
                  <p class="item-description">{{ item.description }}</p>
                  <div class="item-price">{{ formatPrice(item.price) }}원 상당</div>
                </div>
              </div>
            </div>
            <div class="provision-summary">
              <div class="summary-row">
                <span>총 제공 금액</span>
                <span class="summary-value">{{ formatPrice(totalProvisionPrice) }}원</span>
              </div>
              <div v-if="campaign.rewardPoint > 0" class="summary-row highlight">
                <span>추가 리워드</span>
                <span class="summary-value">{{ formatPrice(campaign.rewardPoint) }}P</span>
              </div>
            </div>
          </div>
        </section>
  
        <!-- 미션 가이드 섹션 -->
        <section class="mission-section">
          <h3 class="section-title">미션 가이드</h3>
          <div class="mission-cards">
            <div v-for="(mission, index) in campaign.missions" :key="index" class="mission-card" :style="{ animationDelay: `${index * 0.1}s` }">
              <div class="mission-header">
                <div class="mission-number">Mission {{ index + 1 }}</div>
                <div class="mission-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10" stroke="#48CFCB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#48CFCB" stroke-width="2"/>
                  </svg>
                </div>
              </div>
              <div class="mission-content">
                <h4>{{ mission.title }}</h4>
                <p>{{ mission.description }}</p>
                <div v-if="mission.example" class="mission-example">
                  <span class="example-label">예시</span>
                  <p>{{ mission.example }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
  
        <!-- 채널 & 키워드 섹션 -->
        <section class="channel-keyword-section">
          <div class="channel-subsection">
            <h3 class="section-title">진행 채널</h3>
            <div class="channel-grid">
              <div v-for="channel in campaign.channelTypes" :key="channel" class="channel-card">
                <div class="channel-icon">
                  <img :src="getChannelIcon(channel)" :alt="getChannelLabel(channel)" />
                </div>
                <div class="channel-name">{{ getChannelLabel(channel) }}</div>
                <div class="channel-description">{{ getChannelDescription(channel) }}</div>
              </div>
            </div>
          </div>
          
          <div class="keyword-subsection">
            <h3 class="section-title">필수 키워드</h3>
            <div class="keyword-guide">
              <div class="guide-card title-keyword">
                <div class="guide-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M4 7V4H20V7" stroke="#48CFCB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9 20H15" stroke="#48CFCB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 4V20" stroke="#48CFCB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="guide-content">
                  <h4>제목 필수 키워드</h4>
                  <p>아래 키워드 중 1개를 제목에 포함</p>
                </div>
              </div>
              <div class="guide-card content-keyword">
                <div class="guide-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#48CFCB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14 2V8H20" stroke="#48CFCB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 13H8" stroke="#48CFCB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 17H8" stroke="#48CFCB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10 9H9H8" stroke="#48CFCB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="guide-content">
                  <h4>본문 필수 키워드</h4>
                  <p>아래 키워드 중 3개를 본문에 포함</p>
                </div>
              </div>
            </div>
            <div class="keyword-list">
              <div v-for="(keyword, index) in campaign.keywords" :key="index" class="keyword-item" :style="{ animationDelay: `${index * 0.05}s` }">
                {{ keyword }}
              </div>
            </div>
          </div>
        </section>
  
        <!-- 상세 설명 섹션 -->
        <section class="detail-section">
          <h3 class="section-title">캠페인 상세 안내</h3>
          <div class="detail-content" v-html="formattedDescription"></div>
          
          <div class="additional-info-grid">
            <div class="info-card">
              <div class="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M13 16H12V12H11" stroke="#48CFCB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 8H12.01" stroke="#48CFCB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#48CFCB" stroke-width="2"/>
                </svg>
              </div>
              <h4>신청 전 확인사항</h4>
              <ul>
                <li>선정된 체험단은 개별 연락드립니다</li>
                <li>체험 후 7일 이내 리뷰 작성 필수</li>
                <li>솔직하고 상세한 리뷰 작성 요망</li>
              </ul>
            </div>
            
            <div class="info-card">
              <div class="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#48CFCB" stroke-width="2"/>
                  <path d="M12 8V12" stroke="#48CFCB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 16H12.01" stroke="#48CFCB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h4>주의사항</h4>
              <ul>
                <li>타 체험단과 중복 신청 불가</li>
                <li>허위/불성실 리뷰 작성 시 불이익</li>
                <li>리뷰 미작성 시 향후 참여 제한</li>
              </ul>
            </div>
          </div>
        </section>
  
        <!-- FAQ 섹션 -->
        <section class="faq-section">
          <h3 class="section-title">자주 묻는 질문</h3>
          <div class="faq-list">
            <div v-for="(faq, index) in faqs" :key="index" class="faq-item" :class="{ active: activeFaq === index }">
              <div class="faq-question" @click="toggleFaq(index)">
                <span>{{ faq.question }}</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="faq-arrow">
                  <path d="M6 9L12 15L18 9" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="faq-answer">
                <p>{{ faq.answer }}</p>
              </div>
            </div>
          </div>
        </section>
  
        <!-- 관련 캠페인 섹션 -->
        <section class="related-campaigns-section">
          <h3 class="section-title">이런 캠페인도 있어요</h3>
          <div class="related-campaigns-slider">
            <div class="slider-container">
              <div v-for="related in relatedCampaigns" :key="related.id" class="related-campaign-card" @click="goToCampaign(related.id)">
                <div class="related-image">
                  <img :src="related.thumbnail" :alt="related.title" />
                  <div class="related-badge">{{ getCampaignTypeLabel(related.type) }}</div>
                </div>
                <div class="related-info">
                  <h4>{{ related.title }}</h4>
                  <div class="related-meta">
                    <span class="related-company">{{ related.companyName }}</span>
                    <span class="related-reward">{{ formatPrice(related.rewardPoint) }}P</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
  
      <!-- 플로팅 신청 버튼 -->
      <div class="floating-apply-button" :class="{ visible: showFloatingButton }">
        <div class="floating-content">
          <div class="floating-info">
            <div class="floating-title">{{ campaign.title }}</div>
            <div class="floating-meta">
              <span>{{ campaign.currentApplicants }}/{{ campaign.recruitmentCount }}명</span>
              <span>•</span>
              <span>{{ remainingDays }}일 남음</span>
            </div>
          </div>
          <button 
            class="apply-button" 
            :class="{ disabled: isApplicationClosed }"
            @click="applyForCampaign"
          >
            {{ getApplyButtonText() }}
          </button>
        </div>
      </div>
  
      <!-- 신청 모달 -->
      <transition name="modal">
        <div v-if="showApplyModal" class="modal-overlay" @click.self="closeModal">
          <div class="modal-content">
            <div class="modal-header">
              <h3>캠페인 신청하기</h3>
              <button class="close-button" @click="closeModal">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6 6L18 18" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            
            <form @submit.prevent="submitApplication" class="application-form">
              <!-- 채널 선택 -->
              <div class="form-group">
                <label>신청 채널 선택</label>
                <div class="channel-select-grid">
                  <div 
                    v-for="ch in campaign.channelTypes" 
                    :key="ch" 
                    class="channel-select-item"
                    :class="{ selected: applicationData.selectedChannel === ch }"
                    @click="applicationData.selectedChannel = ch"
                  >
                    <img :src="getChannelIcon(ch)" :alt="getChannelLabel(ch)" />
                    <span>{{ getChannelLabel(ch) }}</span>
                  </div>
                </div>
              </div>
              
              <!-- 채널 URL -->
              <div class="form-group">
                <label>채널 URL</label>
                <div class="input-with-validation">
                  <input 
                    v-model="applicationData.channelUrl" 
                    type="url" 
                    placeholder="https://" 
                    required 
                    @input="validateUrl"
                  />
                  <div v-if="urlValidation.message" class="validation-message" :class="urlValidation.type">
                    {{ urlValidation.message }}
                  </div>
                </div>
              </div>
              
              <!-- 신청 동기 -->
              <div class="form-group">
                <label>신청 동기</label>
                <textarea 
                  v-model="applicationData.motivation" 
                  placeholder="캠페인에 참여하고 싶은 이유를 작성해주세요" 
                  rows="4"
                  required
                ></textarea>
                <div class="character-count">{{ applicationData.motivation.length }}/500</div>
              </div>
              
              <!-- 동의 체크박스 -->
              <div class="agreement-section">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="applicationData.agreement" required />
                  <span class="checkbox-custom"></span>
                  <span>캠페인 진행 가이드 및 주의사항을 모두 확인했으며, 이에 동의합니다.</span>
                </label>
              </div>
              
              <!-- 제출 버튼 -->
              <div class="modal-footer">
                <button type="button" class="cancel-button" @click="closeModal">취소</button>
                <button 
                  type="submit" 
                  class="submit-button"
                  :disabled="!isFormValid"
                >
                  신청하기
                </button>
              </div>
            </form>
          </div>
        </div>
      </transition>
  
      <!-- 공유 모달 -->
      <transition name="modal">
        <div v-if="showShareModal" class="modal-overlay" @click.self="closeShareModal">
          <div class="share-modal-content">
            <h3>캠페인 공유하기</h3>
            <div class="share-options">
              <button class="share-option" @click="shareToKakao">
                <img src="/api/placeholder/40/40" alt="카카오톡" />
                <span>카카오톡</span>
              </button>
              <button class="share-option" @click="shareToFacebook">
                <img src="/api/placeholder/40/40" alt="페이스북" />
                <span>페이스북</span>
              </button>
              <button class="share-option" @click="shareToTwitter">
                <img src="/api/placeholder/40/40" alt="트위터" />
                <span>트위터</span>
              </button>
              <button class="share-option" @click="copyLink">
                <img src="/api/placeholder/40/40" alt="링크복사" />
                <span>링크복사</span>
              </button>
            </div>
          </div>
        </div>
      </transition>
  
      <!-- 토스트 메시지 -->
      <transition name="toast">
        <div v-if="showToast" class="toast-message" :class="toastType">
          {{ toastMessage }}
        </div>
      </transition>
    </div>
  </template>
  <script setup>
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  // 캠페인 데이터
  const campaign = ref({
    id: 1,
    companyName: '프리미엄 식품',
    companyLogo: '/api/placeholder/60/60',
    companyRating: 4.8,
    title: '프리미엄 홍삼진액 체험단 모집 🌟 건강한 하루의 시작!',
    thumbnail: '/api/placeholder/1200/600',
    type: 'delivery',
    category: 'food',
    status: 'recruiting',
    recruitmentCount: 50,
    currentApplicants: 32,
    startDate: '2025-04-28',
    endDate: '2025-05-10',
    announceDate: '2025-05-12',
    experienceStartDate: '2025-05-14',
    experienceEndDate: '2025-05-28',
    provisionItems: [
      { 
        id: 1, 
        name: '프리미엄 홍삼진액 30포', 
        price: 89000,
        image: '/api/placeholder/300/300',
        description: '6년근 홍삼만을 엄선하여 만든 프리미엄 제품'
      },
      { 
        id: 2, 
        name: '전용 보관함', 
        price: 15000,
        image: '/api/placeholder/300/300',
        description: '홍삼진액 전용 프리미엄 보관함'
      }
    ],
    rewardPoint: 10000,
    channelTypes: ['blog', 'instagram', 'youtube'],
    missions: [
      {
        title: '제품 언박싱 및 구성품 촬영',
        description: '제품 패키지부터 구성품까지 상세하게 촬영해주세요.',
        example: '패키지 외관, 개봉 과정, 구성품 전체샷, 각 구성품 클로즈업'
      },
      {
        title: '섭취 경험 공유',
        description: '실제 섭취하는 모습과 맛, 향에 대한 솔직한 리뷰를 작성해주세요.',
        example: '제품 섭취 모습, 텍스처/색상 클로즈업, 맛과 향에 대한 상세 설명'
      },
      {
        title: '일상 속 활용법 소개',
        description: '일상에서 어떻게 섭취하는지, 나만의 활용법을 소개해주세요.',
        example: '아침 루틴, 운동 전후, 피로할 때 등 다양한 상황에서의 활용'
      },
      {
        title: '장단점 정리',
        description: '제품의 장점과 개선점을 솔직하게 작성해주세요.',
        example: '맛, 효과, 가격, 패키징 등 다양한 관점에서 평가'
      }
    ],
    keywords: ['홍삼진액', '면역력강화', '건강기능식품', '프리미엄홍삼', '체력증진'],
    description: `저희 프리미엄 홍삼진액은 6년근 홍삼만을 엄선하여 만든 최고급 건강기능식품입니다.
    
    이번 체험단을 통해 제품의 우수성을 널리 알리고자 합니다. 선정되신 분들께서는 한 달간 꾸준히 섭취하시면서 체감하신 효과를 상세히 기록해주시면 됩니다.
    
    특히 다음과 같은 분들을 우선 선정합니다:
    - 건강/웰빙 콘텐츠를 주로 다루시는 분
    - 꾸준한 포스팅 활동을 하시는 분
    - 사진/영상 촬영 능력이 우수하신 분
    - 상세하고 진솔한 리뷰를 작성하시는 분`,
    tags: ['홍삼', '건강식품', '면역력', '프리미엄', '체험단']
  });
  
  // UI 상태 관리
  const showApplyModal = ref(false);
  const showShareModal = ref(false);
  const showToast = ref(false);
  const toastMessage = ref('');
  const toastType = ref('success');
  const showFloatingButton = ref(false);
  const isFollowing = ref(false);
  const activeFaq = ref(null);
  
  // 신청 폼 데이터
  const applicationData = ref({
    selectedChannel: '',
    channelUrl: '',
    motivation: '',
    agreement: false
  });
  
  // URL 유효성 검사
  const urlValidation = ref({
    type: '',
    message: ''
  });
  
  // FAQ 데이터
  const faqs = ref([
    {
      question: '체험단 선정은 어떤 기준으로 이루어지나요?',
      answer: '채널 활성화 정도, 콘텐츠 품질, 팔로워 수, 이전 리뷰 이력 등을 종합적으로 고려하여 선정합니다.'
    },
    {
      question: '리뷰는 언제까지 작성해야 하나요?',
      answer: '제품 수령 후 7일 이내에 리뷰를 작성해주셔야 합니다. 기간 내 미작성 시 향후 체험단 참여에 제한이 있을 수 있습니다.'
    },
    {
      question: '리워드 포인트는 언제 지급되나요?',
      answer: '리뷰 작성 완료 후 검수를 거쳐 승인되면 영업일 기준 3일 이내에 지급됩니다.'
    },
    {
      question: '여러 채널에 리뷰를 작성해도 되나요?',
      answer: '네, 가능합니다. 다만 신청 시 선택한 채널에는 반드시 작성해주셔야 하며, 추가 채널 작성 시 보너스 포인트가 지급될 수 있습니다.'
    }
  ]);
  
  // 관련 캠페인 데이터
  const relatedCampaigns = ref([
    {
      id: 2,
      title: '프리미엄 비타민C 체험단 모집',
      thumbnail: '/api/placeholder/400/300',
      companyName: '헬스케어',
      type: 'delivery',
      rewardPoint: 8000
    },
    {
      id: 3,
      title: '유기농 녹즙 체험단 모집',
      thumbnail: '/api/placeholder/400/300',
      companyName: '그린팜',
      type: 'delivery',
      rewardPoint: 12000
    },
    {
      id: 4,
      title: '홍삼 스틱 체험단 모집',
      thumbnail: '/api/placeholder/400/300',
      companyName: '한방약품',
      type: 'delivery',
      rewardPoint: 15000
    }
  ]);
  
  // Computed properties
  const recruitmentProgress = computed(() => {
    return (campaign.value.currentApplicants / campaign.value.recruitmentCount) * 100;
  });
  
  const remainingDays = computed(() => {
    const today = new Date();
    const endDate = new Date(campaign.value.endDate);
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  });
  
  const totalProvisionPrice = computed(() => {
    return campaign.value.provisionItems.reduce((sum, item) => sum + item.price, 0);
  });
  
  const isApplicationClosed = computed(() => {
    return campaign.value.currentApplicants >= campaign.value.recruitmentCount || 
           new Date() > new Date(campaign.value.endDate);
  });
  
  const isFormValid = computed(() => {
    return applicationData.value.selectedChannel &&
           applicationData.value.channelUrl &&
           applicationData.value.motivation &&
           applicationData.value.agreement &&
           urlValidation.value.type !== 'error';
  });
  
  const formattedDescription = computed(() => {
    return campaign.value.description.replace(/\n/g, '<br>');
  });
  
  // Methods
  const getApplyButtonText = () => {
    if (isApplicationClosed.value) {
      if (campaign.value.currentApplicants >= campaign.value.recruitmentCount) {
        return '모집 완료';
      } else {
        return '신청 마감';
      }
    }
    return '캠페인 신청하기';
  };
  
  const getCampaignTypeLabel = (type) => {
    const types = {
      delivery: '배송형',
      visit: '방문형',
      purchase: '구매형',
      reporter: '기자단'
    };
    return types[type] || type;
  };
  
  const getCategoryLabel = (category) => {
    const categories = {
      food: '식품',
      living: '생활',
      beauty: '뷰티',
      tech: '테크',
      fashion: '패션'
    };
    return categories[category] || category;
  };
  
  const getStatusLabel = (status) => {
    const statuses = {
      recruiting: '모집중',
      closed: '모집완료',
      ended: '종료'
    };
    return statuses[status] || status;
  };
  
  const getChannelLabel = (channelCode) => {
    const channels = {
      blog: '블로그',
      instagram: '인스타그램',
      youtube: '유튜브',
      tiktok: '틱톡',
      reels: '릴스',
      shorts: '쇼츠'
    };
    return channels[channelCode] || channelCode;
  };
  const getChannelIcon = () => require('@/assets/icons/ad.svg');


  
  const getChannelDescription = (channelCode) => {
    const descriptions = {
      blog: '상세한 리뷰와 사진으로 제품을 소개해주세요',
      instagram: '감성적인 사진과 함께 솔직한 후기를 남겨주세요',
      youtube: '영상으로 생생한 체험기를 전달해주세요',
      tiktok: '짧지만 임팩트 있는 영상을 만들어주세요',
      reels: '15-30초 내외의 짧은 영상으로 제품을 소개해주세요',
      shorts: '1분 이내의 세로형 영상으로 제품을 리뷰해주세요'
    };
    return descriptions[channelCode] || '';
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  
  const isDateActive = (phase) => {
    const today = new Date();
    const startDate = new Date(campaign.value.startDate);
    const endDate = new Date(campaign.value.endDate);
    const announceDate = new Date(campaign.value.announceDate);
    const experienceStartDate = new Date(campaign.value.experienceStartDate);
    const experienceEndDate = new Date(campaign.value.experienceEndDate);
  
    switch (phase) {
      case 'application':
        return today >= startDate && today <= endDate;
      case 'announcement':
        return today >= announceDate && today < experienceStartDate;
      case 'experience':
        return today >= experienceStartDate && today <= experienceEndDate;
      default:
        return false;
    }
  };
  
  const validateUrl = () => {
    const url = applicationData.value.channelUrl;
    if (!url) {
      urlValidation.value = { type: '', message: '' };
      return;
    }
  
    try {
      new URL(url);
      if (url.includes(applicationData.value.selectedChannel) || 
          (applicationData.value.selectedChannel === 'blog' && url.includes('blog'))) {
        urlValidation.value = { type: 'success', message: '유효한 URL입니다' };
      } else {
        urlValidation.value = { type: 'warning', message: '선택한 채널과 URL이 일치하는지 확인해주세요' };
      }
    } catch {
      urlValidation.value = { type: 'error', message: '올바른 URL 형식이 아닙니다' };
    }
  };
  
  const goBack = () => {
    router.back();
  };
  
  const shareCampaign = () => {
    showShareModal.value = true;
  };
  
  const toggleFollow = () => {
    isFollowing.value = !isFollowing.value;
    showToastMessage(isFollowing.value ? '팔로우했습니다' : '팔로우가 취소되었습니다', 'success');
  };
  
  const applyForCampaign = () => {
    if (!isApplicationClosed.value) {
      showApplyModal.value = true;
    }
  };
  
  const closeModal = () => {
    showApplyModal.value = false;
    resetForm();
  };
  
  const resetForm = () => {
    applicationData.value = {
      selectedChannel: '',
      channelUrl: '',
      motivation: '',
      agreement: false
    };
    urlValidation.value = { type: '', message: '' };
  };
  
  const submitApplication = () => {
    // 실제 구현에서는 API 호출
    showToastMessage('캠페인 신청이 완료되었습니다', 'success');
    closeModal();
  };
  
  const toggleFaq = (index) => {
    activeFaq.value = activeFaq.value === index ? null : index;
  };
  
  const showToastMessage = (message, type = 'success') => {
    toastMessage.value = message;
    toastType.value = type;
    showToast.value = true;
    setTimeout(() => {
      showToast.value = false;
    }, 3000);
  };
  
  const closeShareModal = () => {
    showShareModal.value = false;
  };
  
  const shareToKakao = () => {
    showToastMessage('카카오톡 공유 기능은 준비중입니다', 'info');
    closeShareModal();
  };
  
  const shareToFacebook = () => {
    showToastMessage('페이스북 공유 기능은 준비중입니다', 'info');
    closeShareModal();
  };
  
  const shareToTwitter = () => {
    showToastMessage('트위터 공유 기능은 준비중입니다', 'info');
    closeShareModal();
  };
  
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToastMessage('링크가 복사되었습니다', 'success');
    closeShareModal();
  };
  
  const goToCampaign = (campaignId) => {
    router.push(`/campaign/${campaignId}`);
  };
  
  const showItemDetail = (item) => {
    // 제품 상세 모달 표시 (추후 구현)
    showToastMessage(`${item.name} 상세 정보`, 'info');
  };
  
  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    showFloatingButton.value = scrollPosition > 300;
  };
  
  // Lifecycle hooks
  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
  });
  
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
  
  // 채널 URL 감시
  watch(() => applicationData.value.channelUrl, validateUrl);
  </script>
  <style scoped>
  /* 기본 스타일 */
  .campaign-detail {
    min-height: 100vh;
    background-color: #ffffff;
    font-family: 'Pretendard', sans-serif;
  }
  
  /* 헤더 */
  .header-section {
    position: sticky;
    top: 0;
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid #F5F5F5;
    z-index: 100;
  }
  
  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .back-button,
  .share-button {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 50%;
    background: transparent;
    border: none;
    transition: all 0.2s;
  }
  
  .back-button:hover,
  .share-button:hover {
    background-color: #F5F5F5;
    transform: scale(1.05);
  }
  
  .header-content h1 {
    font-size: 18px;
    font-weight: 600;
    color: #424242;
  }
  
  /* 메인 콘텐츠 */
  .main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px 120px;
  }
  
  /* 히어로 섹션 */
  .hero-section {
    margin-bottom: 40px;
  }
  
  .hero-image-container {
    position: relative;
    width: 100%;
    height: 500px;
    border-radius: 24px;
    overflow: hidden;
    margin-bottom: 24px;
  }
  
  .hero-image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  .hero-image-container:hover img {
    transform: scale(1.05);
  }
  
  .hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%);
  }
  
  .hero-badges {
    position: absolute;
    top: 24px;
    left: 24px;
    display: flex;
    gap: 8px;
  }
  
  .campaign-type-badge,
  .category-badge {
    padding: 8px 16px;
    border-radius: 24px;
    font-size: 14px;
    font-weight: 500;
    backdrop-filter: blur(8px);
  }
  
  .campaign-type-badge {
    background-color: rgba(72, 207, 203, 0.9);
    color: white;
  }
  
  .category-badge {
    background-color: rgba(255, 255, 255, 0.9);
    color: #424242;
  }
  
  .campaign-status {
    position: absolute;
    top: 24px;
    right: 24px;
    padding: 8px 16px;
    border-radius: 24px;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
    backdrop-filter: blur(8px);
  }
  
  .campaign-status.recruiting {
    background-color: rgba(72, 207, 203, 0.9);
    color: white;
  }
  
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: currentColor;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
  
  /* 빠른 통계 카드 */
  .quick-stats-card {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-bottom: 40px;
  }
  
  .stat-item {
    background-color: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    gap: 16px;
    transition: transform 0.2s ease;
  }
  
  .stat-item:hover {
    transform: translateY(-4px);
  }
  
  .stat-icon {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .stat-icon.recruitment {
    background-color: #48CFCB;
  }
  
  .stat-icon.deadline {
    background-color: #229799;
  }
  
  .stat-icon.reward {
    background-color: #424242;
  }
  
  .stat-info {
    flex: 1;
  }
  
  .stat-label {
    font-size: 14px;
    color: #757575;
    margin-bottom: 4px;
  }
  
  .stat-value {
    font-size: 24px;
    font-weight: 700;
    color: #424242;
  }
  
  .stat-value .current {
    color: #48CFCB;
  }
  
  .stat-value .divider {
    color: #BDBDBD;
    margin: 0 4px;
  }
  
  .progress-bar {
    width: 100%;
    height: 4px;
    background-color: #F5F5F5;
    border-radius: 2px;
    margin-top: 8px;
    overflow: hidden;
  }
  
  .progress-bar .progress {
    height: 100%;
    background-color: #48CFCB;
    transition: width 0.5s ease;
    border-radius: 2px;
  }
  
  /* 캠페인 정보 섹션 */
  .campaign-info-section {
    background-color: white;
    border-radius: 24px;
    padding: 32px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    margin-bottom: 40px;
  }
  
  .info-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }
  
  .company-info {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .company-logo {
    width: 60px;
    height: 60px;
    border-radius: 16px;
    overflow: hidden;
  }
  
  .company-logo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .company-details h2 {
    font-size: 18px;
    font-weight: 600;
    color: #424242;
    margin-bottom: 4px;
  }
  
  .company-rating {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .rating-stars {
    display: flex;
    gap: 2px;
  }
  
  .star {
    color: #E0E0E0;
    font-size: 16px;
  }
  
  .star.filled {
    color: #FFD700;
  }
  
  .rating-number {
    font-size: 14px;
    color: #757575;
    font-weight: 500;
  }
  
  .follow-button {
    padding: 10px 24px;
    border-radius: 24px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    border: 1px solid #48CFCB;
    background-color: white;
    color: #48CFCB;
    transition: all 0.2s;
  }
  
  .follow-button:hover {
    background-color: #48CFCB;
    color: white;
  }
  
  .follow-button.following {
    background-color: #48CFCB;
    color: white;
  }
  
  .campaign-title {
    font-size: 32px;
    font-weight: 700;
    color: #424242;
    margin-bottom: 16px;
    line-height: 1.4;
  }
  
  .campaign-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .tag {
    padding: 6px 12px;
    background-color: #F5F5F5;
    border-radius: 16px;
    font-size: 14px;
    color: #757575;
    transition: all 0.2s;
    cursor: pointer;
  }
  
  .tag:hover {
    background-color: #48CFCB;
    color: white;
  }
  
  /* 섹션 공통 스타일 */
  section {
    margin-bottom: 48px;
  }
  
  .section-title {
    font-size: 24px;
    font-weight: 700;
    color: #424242;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .section-title::after {
    content: '';
    flex: 1;
    height: 2px;
    background: linear-gradient(to right, #48CFCB, transparent);
  }
  
  /* 타임라인 섹션 */
  .timeline {
    position: relative;
    padding-left: 40px;
  }
  
  .timeline::before {
    content: '';
    position: absolute;
    left: 8px;
    top: 8px;
    bottom: 8px;
    width: 2px;
    background-color: #E0E0E0;
  }
  
  .timeline-item {
    position: relative;
    margin-bottom: 32px;
    opacity: 0.6;
    transition: opacity 0.3s;
  }
  
  .timeline-item.active {
    opacity: 1;
  }
  
  .timeline-dot {
    position: absolute;
    left: -33px;
    top: 8px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #E0E0E0;
    border: 3px solid white;
    box-shadow: 0 0 0 2px #E0E0E0;
  }
  
  .timeline-item.active .timeline-dot {
    background-color: #48CFCB;
    box-shadow: 0 0 0 2px #48CFCB;
  }
  
  .timeline-content {
    background-color: #F5F5F5;
    border-radius: 16px;
    padding: 20px;
    transition: all 0.3s;
  }
  
  .timeline-item.active .timeline-content {
    background-color: #F0FAF9;
  }
  
  .timeline-date {
    font-size: 14px;
    color: #757575;
    margin-bottom: 8px;
  }
  
  .timeline-item.active .timeline-date {
    color: #229799;
  }
  
  .timeline-title {
    font-size: 18px;
    font-weight: 600;
    color: #424242;
    margin-bottom: 8px;
  }
  
  .timeline-description {
    font-size: 14px;
    color: #757575;
  }
  
  /* 제공 내역 섹션 */
  .provision-card {
    background-color: white;
    border-radius: 24px;
    padding: 32px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  }
  
  .provision-items {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
    margin-bottom: 32px;
  }
  
  .provision-item {
    background-color: #F5F5F5;
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.3s ease;
  }
  
  .provision-item:hover {
    transform: translateY(-4px);
  }
  
  .item-image {
    width: 100%;
    height: 200px;
    overflow: hidden;
  }
  
  .item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  .provision-item:hover .item-image img {
    transform: scale(1.1);
  }
  
  .item-info {
    padding: 20px;
  }
  
  .item-info h4 {
    font-size: 18px;
    font-weight: 600;
    color: #424242;
    margin-bottom: 8px;
  }
  
  .item-description {
    font-size: 14px;
    color: #757575;
    margin-bottom: 12px;
  }
  
  .item-price {
    font-size: 16px;
    font-weight: 600;
    color: #229799;
  }
  
  .provision-summary {
    border-top: 1px solid #E0E0E0;
    padding-top: 24px;
  }
  
  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-size: 16px;
  }
  
  .summary-row.highlight {
    background-color: #F0FAF9;
    padding: 12px 16px;
    border-radius: 12px;
    margin-top: 16px;
  }
  
  .summary-value {
    font-weight: 600;
    color: #424242;
  }
  
  .summary-row.highlight .summary-value {
    color: #229799;
  }
  
  /* 미션 섹션 */
  .mission-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
  }
  
  .mission-card {
    background-color: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    animation: slideUp 0.5s ease-out;
    animation-fill-mode: backwards;
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .mission-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .mission-number {
    font-size: 14px;
    font-weight: 600;
    color: #48CFCB;
    background-color: #F0FAF9;
    padding: 4px 12px;
    border-radius: 12px;
  }
  
  .mission-icon {
    width: 40px;
    height: 40px;
    background-color: #F0FAF9;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .mission-content h4 {
    font-size: 18px;
    font-weight: 600;
    color: #424242;
    margin-bottom: 8px;
  }
  
  .mission-content p {
    font-size: 14px;
    color: #757575;
    line-height: 1.6;
    margin-bottom: 12px;
  }
  
  .mission-example {
    background-color: #F5F5F5;
    border-radius: 12px;
    padding: 12px;
    margin-top: 12px;
  }
  
  .example-label {
    font-size: 12px;
    font-weight: 600;
    color: #48CFCB;
    margin-bottom: 4px;
    display: block;
  }
  
  .mission-example p {
    font-size: 13px;
    margin: 0;
  }
  
  /* 채널 & 키워드 섹션 */
  .channel-keyword-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
  
  .channel-subsection,
  .keyword-subsection {
    background-color: white;
    border-radius: 24px;
    padding: 32px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  }
  
  .channel-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 16px;
  }
  
  .channel-card {
    background-color: #F5F5F5;
    border-radius: 16px;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .channel-card:hover {
    background-color: #48CFCB;
    transform: translateY(-4px);
  }
  
  .channel-card:hover .channel-name,
  .channel-card:hover .channel-description {
    color: white;
  }
  
  .channel-icon {
    width: 48px;
    height: 48px;
    margin: 0 auto 12px;
  }
  
  .channel-icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  .channel-name {
    font-size: 16px;
    font-weight: 600;
    color: #424242;
    margin-bottom: 8px;
  }
  
  .channel-description {
    font-size: 12px;
    color: #757575;
    line-height: 1.4;
  }
  
  .keyword-guide {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 24px;
  }
  
  .guide-card {
    background-color: #F5F5F5;
    border-radius: 16px;
    padding: 20px;
    display: flex;
    gap: 16px;
  }
  
  .guide-icon {
    width: 48px;
    height: 48px;
    background-color: white;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  .guide-content h4 {
    font-size: 16px;
    font-weight: 600;
    color: #424242;
    margin-bottom: 4px;
  }
  
  .guide-content p {
    font-size: 13px;
    color: #757575;
  }
  
  .keyword-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .keyword-item {
    padding: 10px 20px;
    background-color: #F0FAF9;
    color: #229799;
    border-radius: 20px;
    font-size: 15px;
    font-weight: 500;
    animation: fadeInScale 0.3s ease-out;
    animation-fill-mode: backwards;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .keyword-item:hover {
    background-color: #48CFCB;
    color: white;
    transform: translateY(-2px);
  }
  
  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  /* 상세 설명 섹션 */
  .detail-section {
    background-color: white;
    border-radius: 24px;
    padding: 32px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  }
  
  .detail-content {
    font-size: 16px;
    line-height: 1.8;
    color: #424242;
    margin-bottom: 32px;
  }
  
  .additional-info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
  
  .info-card {
    background-color: #F5F5F5;
    border-radius: 16px;
    padding: 24px;
  }
  
  .info-icon {
    width: 48px;
    height: 48px;
    background-color: white;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }
  
  .info-card h4 {
    font-size: 18px;
    font-weight: 600;
    color: #424242;
    margin-bottom: 12px;
  }
  
  .info-card ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .info-card li {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #757575;
    margin-bottom: 8px;
  }
  
  .info-card li::before {
    content: '✓';
    color: #48CFCB;
    margin-right: 8px;
    font-weight: 600;
  }
  
  /* FAQ 섹션 */
  .faq-section {
    background-color: white;
    border-radius: 24px;
    padding: 32px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  }
  
  .faq-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .faq-item {
    border: 1px solid #E0E0E0;
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  .faq-item.active {
    border-color: #48CFCB;
  }
  
  .faq-question {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    cursor: pointer;
    background-color: white;
    transition: background-color 0.3s ease;
  }
  
  .faq-question:hover {
    background-color: #F5F5F5;
  }
  
  .faq-item.active .faq-question {
    background-color: #F0FAF9;
  }
  
  .faq-arrow {
    transition: transform 0.3s ease;
  }
  
  .faq-item.active .faq-arrow {
    transform: rotate(180deg);
  }
  
  .faq-answer {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }
  
  .faq-item.active .faq-answer {
    max-height: 200px;
  }
  
  .faq-answer p {
    padding: 0 20px 20px;
    margin: 0;
    color: #757575;
    line-height: 1.6;
  }
  
  /* 관련 캠페인 섹션 */
  .related-campaigns-section {
    background-color: #F5F5F5;
    padding: 48px 0;
    margin: 0 -24px;
  }
  
  .related-campaigns-section .section-title {
    padding: 0 24px;
  }
  
  .related-campaigns-slider {
    padding: 0 24px;
    overflow: hidden;
  }
  
  .slider-container {
    display: flex;
    gap: 24px;
    padding-bottom: 24px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
  }
  
  .slider-container::-webkit-scrollbar {
    height: 8px;
  }
  
  .slider-container::-webkit-scrollbar-track {
    background: #E0E0E0;
    border-radius: 4px;
  }
  
  .slider-container::-webkit-scrollbar-thumb {
    background: #48CFCB;
    border-radius: 4px;
  }
  
  .related-campaign-card {
    flex: 0 0 320px;
    background-color: white;
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.3s ease;
    scroll-snap-align: start;
  }
  
  .related-campaign-card:hover {
    transform: translateY(-8px);
  }
  
  .related-image {
    position: relative;
    height: 180px;
    overflow: hidden;
  }
  
  .related-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  .related-campaign-card:hover .related-image img {
    transform: scale(1.1);
  }
  
  .related-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    padding: 6px 12px;
    background-color: rgba(72, 207, 203, 0.9);
    color: white;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 500;
  }
  
  .related-info {
    padding: 20px;
  }
  
  .related-info h4 {
    font-size: 16px;
    font-weight: 600;
    color: #424242;
    margin-bottom: 12px;
    line-height: 1.4;
  }
  
  .related-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
  }
  
  .related-company {
    color: #757575;
  }
  
  .related-reward {
    font-weight: 600;
    color: #229799;
  }
  
  /* 플로팅 신청 버튼 */
  .floating-apply-button {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: white;
    border-top: 1px solid #E0E0E0;
    padding: 16px 24px;
    transform: translateY(100%);
    transition: transform 0.3s ease;
    z-index: 100;
  }
  
  .floating-apply-button.visible {
    transform: translateY(0);
  }
  
  .floating-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .floating-info {
    flex: 1;
    margin-right: 24px;
  }
  
  .floating-title {
    font-size: 16px;
    font-weight: 600;
    color: #424242;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .floating-meta {
    font-size: 14px;
    color: #757575;
  }
  
  .apply-button {
    padding: 14px 32px;
    background-color: #48CFCB;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .apply-button:hover {
    background-color: #229799;
    transform: translateY(-2px);
  }
  
  .apply-button.disabled {
    background-color: #E0E0E0;
    cursor: not-allowed;
  }
  
  .apply-button.disabled:hover {
    transform: none;
  }
  
  /* 모달 */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 24px;
  }
  
  .modal-content {
    background-color: white;
    border-radius: 24px;
    width: 100%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    animation: modalSlideIn 0.3s ease-out;
  }
  
  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid #E0E0E0;
  }
  
  .modal-header h3 {
    font-size: 24px;
    font-weight: 700;
    color: #424242;
  }
  
  .close-button {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: none;
    cursor: pointer;
    border-radius: 50%;
    transition: background-color 0.2s;
  }
  
  .close-button:hover {
    background-color: #F5F5F5;
  }
  
  .application-form {
    padding: 24px;
  }
  
  .form-group {
    margin-bottom: 24px;
  }
  
  .form-group label {
    display: block;
    font-size: 16px;
    font-weight: 600;
    color: #424242;
    margin-bottom: 12px;
  }
  
 .channel-select-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 12px;
}

.channel-select-item {
  background-color: #F5F5F5;
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.channel-select-item:hover {
  background-color: #E0E0E0;
}

.channel-select-item.selected {
  background-color: #F0FAF9;
  border-color: #48CFCB;
}

.channel-select-item img {
  width: 40px;
  height: 40px;
  margin-bottom: 8px;
}

.channel-select-item span {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #424242;
}

.input-with-validation {
  position: relative;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 14px;
  border: 1px solid #E0E0E0;
  border-radius: 12px;
  font-size: 16px;
  font-family: 'Pretendard', sans-serif;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #48CFCB;
  outline: none;
}

.validation-message {
  font-size: 13px;
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.validation-message.success {
  color: #48CFCB;
}

.validation-message.warning {
  color: #FFA726;
}

.validation-message.error {
  color: #EF5350;
}

.character-count {
  text-align: right;
  font-size: 13px;
  color: #757575;
  margin-top: 6px;
}

.agreement-section {
  margin-bottom: 24px;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #E0E0E0;
  border-radius: 4px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.checkbox-label input[type="checkbox"]:checked + .checkbox-custom {
  background-color: #48CFCB;
  border-color: #48CFCB;
}

.checkbox-custom::after {
  content: '✓';
  color: white;
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.2s;
}

.checkbox-label input[type="checkbox"]:checked + .checkbox-custom::after {
  opacity: 1;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #E0E0E0;
}

.cancel-button,
.submit-button {
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-button {
  background-color: white;
  border: 1px solid #E0E0E0;
  color: #757575;
}

.cancel-button:hover {
  background-color: #F5F5F5;
}

.submit-button {
  background-color: #48CFCB;
  border: none;
  color: white;
}

.submit-button:hover {
  background-color: #229799;
}

.submit-button:disabled {
  background-color: #E0E0E0;
  cursor: not-allowed;
}

/* 공유 모달 */
.share-modal-content {
  background-color: white;
  border-radius: 24px;
  padding: 24px;
  width: 100%;
  max-width: 400px;
  animation: modalSlideIn 0.3s ease-out;
}

.share-modal-content h3 {
  font-size: 20px;
  font-weight: 600;
  color: #424242;
  margin-bottom: 24px;
  text-align: center;
}

.share-options {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.share-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.share-option:hover {
  background-color: #F5F5F5;
}

.share-option img {
  width: 40px;
  height: 40px;
}

.share-option span {
  font-size: 12px;
  color: #424242;
}

/* 토스트 메시지 */
.toast-message {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  z-index: 2000;
  animation: toastSlideIn 0.3s ease-out;
}

.toast-message.success {
  background-color: #48CFCB;
}

.toast-message.error {
  background-color: #EF5350;
}

.toast-message.info {
  background-color: #424242;
}

@keyframes toastSlideIn {
  from {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

/* 애니메이션 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.toast-enter-active {
  animation: toastSlideIn 0.3s ease-out;
}

.toast-leave-active {
  animation: toastSlideIn 0.3s ease-out reverse;
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .channel-keyword-section {
    grid-template-columns: 1fr;
  }
  
  .additional-info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 0 16px 100px;
  }
  
  .hero-image-container {
    height: 400px;
  }
  
  .quick-stats-card {
    grid-template-columns: 1fr;
  }
  
  .campaign-title {
    font-size: 24px;
  }
  
  .section-title {
    font-size: 20px;
  }
  
  .mission-cards {
    grid-template-columns: 1fr;
  }
  
  .channel-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }
  
  .keyword-guide {
    grid-template-columns: 1fr;
  }
  
  .info-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .follow-button {
    width: 100%;
  }
  
  .floating-apply-button {
    padding: 12px 16px;
  }
  
  .floating-content {
    flex-direction: column;
    gap: 12px;
  }
  
  .floating-info {
    margin-right: 0;
    width: 100%;
  }
  
  .apply-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .hero-image-container {
    height: 300px;
    border-radius: 16px;
  }
  
  .campaign-title {
    font-size: 20px;
  }
  
  .provision-items {
    grid-template-columns: 1fr;
  }
  
  .share-options {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
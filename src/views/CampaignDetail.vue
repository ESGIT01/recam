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
            <path d="M8.59 13.51L15.42 17.49M15.41 6.51L8.59 10.49" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </header>

    <!-- 메인 콘텐츠 -->
    <main class="main-content">
      <!-- 히어로 섹션 -->
      <section class="hero-section">
        <div class="campaign-top-container">
          <div class="hero-image-container">
            <img :src="campaign.thumbnail" :alt="campaign.title" />
            <div class="hero-overlay"></div>
          </div>
          <div class="campaign-top-info">
            <div class="top-status-badges">
              <div class="campaign-type-badge">{{ getCampaignTypeLabel(campaign.type) }}</div>
              <div class="category-badge">{{ getCategoryLabel(campaign.category) }}</div>
            </div>
            <h1 class="campaign-title">{{ campaign.title }}</h1>
            <p class="campaign-subtitle">{{ campaign.subtitle }}</p>
            
            <div class="top-reward-info">
              <div class="reward-item">
                <span class="reward-label">리워드</span>
                <span class="reward-value">{{ formatPrice(campaign.rewardPoint) }}P</span>
              </div>
              <div class="divider"></div>
              <div class="reward-item">
                <span class="reward-label">제공품</span>
                <span class="reward-value">{{ formatPrice(totalProvisionPrice) }}원 상당</span>
              </div>
            </div>
            
            <div class="top-status-info">
              <div class="status-bar">
                <div class="status-progress" :style="{ width: recruitmentProgress + '%' }"></div>
              </div>
              <div class="status-text">
                <span class="recruitment-count">
                  <strong>{{ campaign.currentApplicants }}</strong>/{{ campaign.recruitmentCount }}명 모집중
                </span>
                <span class="deadline">
                  D-{{ remainingDays }}
                </span>
              </div>
            </div>
          </div>
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
          <div class="provision-list">
            <div v-for="item in campaign.provisionItems" :key="item.id" class="provision-item">
              <div class="item-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="#48CFCB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="#48CFCB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="item-info">
                <h4>{{ item.name }}</h4>
                <p class="item-description">{{ item.description }}</p>
              </div>
              <div class="item-price">{{ formatPrice(item.price) }}원 상당</div>
            </div>
          </div>
          <div class="provision-summary">
            <div class="summary-row">
              <span>총 제공 금액</span>
              <span class="summary-value">{{ formatPrice(totalProvisionPrice) }}원 상당</span>
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
        <div class="mission-slider">
          <div class="mission-progress">
            <div v-for="(mission, index) in campaign.missions" :key="index" 
                 class="progress-step"
                 :class="{ active: selectedMission === index }"
                 @click="selectMission(index)">
              <div class="step-number">{{ index + 1 }}</div>
              <div class="step-bar"></div>
            </div>
          </div>
          
          <div class="mission-carousel">
            <button class="carousel-btn prev" @click="prevMission" v-if="selectedMission > 0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            
            <div class="mission-content-wrapper">
              <transition name="fade" mode="out-in">
                <div v-if="selectedMission >= 0" :key="selectedMission" class="mission-content-card">
                  <div class="mission-header">
                    <div class="mission-title">
                      <span class="mission-step">Step {{ selectedMission + 1 }}</span>
                      <h4>{{ campaign.missions[selectedMission].title }}</h4>
                    </div>
                  </div>
                  <div class="mission-description">
                    <p>{{ campaign.missions[selectedMission].description }}</p>
                  </div>
                  <div v-if="campaign.missions[selectedMission].example" class="mission-example">
                    <div class="example-header">
                      <div class="example-icon">💡</div>
                      <span>이렇게 진행해보세요</span>
                    </div>
                    <div class="example-content">
                      {{ campaign.missions[selectedMission].example }}
                    </div>
                  </div>
                  <div class="mission-checklist">
                    <div v-for="(item, itemIndex) in campaign.missions[selectedMission].checklist" :key="itemIndex" class="checklist-item">
                      <div class="check-icon">✓</div>
                      <span>{{ item }}</span>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
            
            <button class="carousel-btn next" @click="nextMission" v-if="selectedMission < campaign.missions.length - 1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      <!-- 필수 키워드 섹션 -->
      <section class="keyword-section">
        <h3 class="section-title">필수 키워드</h3>
        <div class="keyword-guide">
          <div class="guide-card">
            <div class="guide-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 7V4H20V7" stroke="#48CFCB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 20H15" stroke="#48CFCB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 4V20" stroke="#48CFCB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="guide-content">
              <h4>제목 필수 키워드</h4>
              <p>아래 키워드 중 1개를 제목에 포함해주세요</p>
            </div>
          </div>
          <div class="guide-card">
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
              <p>아래 키워드 중 3개를 본문에 포함해주세요</p>
            </div>
          </div>
        </div>
        <div class="keyword-actions">
          <button class="copy-all-btn" @click="copyAllKeywords">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 16H4C3.46957 16 2.96086 15.7893 2.58579 15.4142C2.21071 15.0391 2 14.5304 2 14V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            전체 키워드 복사
          </button>
        </div>
        <div class="keyword-tags">
          <div v-for="(keyword, index) in campaign.keywords" :key="index" 
               class="keyword-tag" 
               @click="copyKeyword(keyword)">
            {{ keyword }}
            <div class="copy-indicator">클릭하여 복사</div>
          </div>
        </div>
      </section>

      <!-- 상세 설명 섹션 -->
      <section class="detail-section">
        <h3 class="section-title">캠페인 상세 안내</h3>
        <div class="detail-content" v-html="formattedDescription"></div>
        
        <div class="info-cards">
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

      <!-- 관련 캠페인 섹션 -->
      <section class="related-campaigns-section">
        <h3 class="section-title">이런 캠페인도 있어요</h3>
        <div class="related-campaigns-grid">
          <div v-for="related in relatedCampaigns" :key="related.id" 
               class="related-campaign-card" 
               @click="goToCampaign(related.id)">
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
              <div class="related-stats">
                <span>모집 {{ related.currentApplicants }}/{{ related.recruitmentCount }}명</span>
                <span>{{ calculateRemainingDays(related.endDate) }}일 남음</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 플로팅 신청 버튼 -->
    <div class="floating-apply-section">
      <div class="floating-apply-content">
        <div class="campaign-quick-info">
          <div class="campaign-info-row">
            <div class="info-item">
              <span class="info-label">모집현황</span>
              <span class="info-value">{{ campaign.currentApplicants }}/{{ campaign.recruitmentCount }}명</span>
            </div>
            <div class="info-item">
              <span class="info-label">남은기간</span>
              <span class="info-value">{{ remainingDays }}일</span>
            </div>
            <div class="info-item">
              <span class="info-label">리워드</span>
              <span class="info-value">{{ formatPrice(campaign.rewardPoint) }}P</span>
            </div>
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
                <path d="M18 6L6 18M6 6L18 18" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="submitApplication" class="application-form">
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
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 캠페인 데이터
const campaign = ref({
  id: 1,
  title: '프리미엄 홍삼진액 체험단 모집 🌟 건강한 하루의 시작!',
  subtitle: '6년근 홍삼 진액을 효과적 섭취로 건강한 활력을 경험해보세요',
  thumbnail: '/api/placeholder/1200/1200',
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
  channelType: 'blog',
  provisionItems: [
    { 
      id: 1, 
      name: '프리미엄 홍삼진액 30포', 
      price: 89000,
      description: '6년근 홍삼만을 엄선하여 만든 프리미엄 제품'
    },
    { 
      id: 2, 
      name: '전용 보관함', 
      price: 15000,
      description: '홍삼진액 전용 프리미엄 보관함'
    }
  ],
  rewardPoint: 10000,
  missions: [
    {
      title: '제품 패키지 및 구성품 소개',
      description: '제품 패키지 디자인부터 구성품까지 상세하게 촬영하고 설명해주세요.',
      example: '패키지 외관, 개봉 과정, 구성품 전체샷, 각 구성품 클로즈업',
      checklist: [
        '제품 패키지 전체 사진',
        '개봉 과정 사진 또는 영상',
        '구성품 상세 촬영',
        '패키지 디자인 특징 설명'
      ]
    },
    {
      title: '섭취 방법 및 경험 공유',
      description: '실제 섭취하는 모습과 맛, 향, 텍스처에 대한 솔직한 리뷰를 작성해주세요.',
      example: '제품 섭취 모습, 텍스처/색상 클로즈업, 맛과 향에 대한 상세 설명',
      checklist: [
        '섭취 방법 설명',
        '맛과 향에 대한 평가',
        '텍스처 설명 및 사진',
        '섭취 후 느낌 공유'
      ]
    },
    {
      title: '일상 속 제품 활용법',
      description: '일상에서 어떻게 섭취하는지, 나만의 활용법이나 꿀팁을 소개해주세요.',
      example: '아침 루틴, 운동 전후, 피로할 때 등 다양한 상황에서의 활용',
      checklist: [
        '일상 속 섭취 시간대',
        '개인만의 섭취 꿀팁',
        '보관 방법 소개',
        '휴대성 평가'
      ]
    },
    {
      title: '2주간의 섭취 후기',
      description: '2주 동안 꾸준히 섭취한 후 느낀 변화나 효과를 솔직하게 작성해주세요.',
      example: '체력 변화, 피로 개선, 컨디션 변화 등 구체적인 경험',
      checklist: [
        '섭취 전후 컨디션 비교',
        '체감 효과 상세 설명',
        '장기 섭취 시 느낀 점',
        '주변 반응 공유'
      ]
    },
    {
      title: '종합 평가 및 추천',
      description: '제품의 장단점과 어떤 분들께 추천하고 싶은지 종합적으로 평가해주세요.',
      example: '맛, 효과, 가격, 패키징 등 다양한 관점에서의 평가',
      checklist: [
        '장단점 정리',
        '추천 대상 설명',
        '가격 대비 만족도',
        '재구매 의향 여부'
      ]
    }
  ],
  keywords: ['홍삼진액', '면역력강화', '건강기능식품', '프리미엄홍삼', '체력증진', '피로회복', '영양보충'],
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
const selectedMission = ref(0);

// 신청 폼 데이터
const applicationData = ref({
  channelUrl: '',
  motivation: '',
  agreement: false
});

// URL 유효성 검사
const urlValidation = ref({
  type: '',
  message: ''
});

// 관련 캠페인 데이터
const relatedCampaigns = ref([
  {
    id: 2,
    title: '프리미엄 비타민C 체험단 모집',
    thumbnail: '/api/placeholder/400/400',
    companyName: '헬스케어',
    type: 'delivery',
    rewardPoint: 8000,
    recruitmentCount: 30,
    currentApplicants: 22,
    endDate: '2025-05-15'
  },
  {
    id: 3,
    title: '유기농 녹즙 체험단 모집',
    thumbnail: '/api/placeholder/400/400',
    companyName: '그린팜',
    type: 'delivery',
    rewardPoint: 12000,
    recruitmentCount: 20,
    currentApplicants: 18,
    endDate: '2025-05-08'
  },
  {
    id: 4,
    title: '홍삼 스틱 체험단 모집',
    thumbnail: '/api/placeholder/400/400',
    companyName: '한방약품',
    type: 'delivery',
    rewardPoint: 15000,
    recruitmentCount: 40,
    currentApplicants: 35,
    endDate: '2025-05-12'
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
  return applicationData.value.channelUrl &&
         applicationData.value.motivation &&
         applicationData.value.agreement &&
         urlValidation.value.type !== 'error';
});

const formattedDescription = computed(() => {
  return campaign.value.description.replace(/\n/g, '<br>');
});

// Methods
const calculateRemainingDays = (endDate) => {
  const today = new Date();
  const end = new Date(endDate);
  const diffTime = end - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

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
    if (url.includes(campaign.value.channelType) || 
        (campaign.value.channelType === 'blog' && url.includes('blog'))) {
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

const selectMission = (index) => {
  selectedMission.value = index;
};

const prevMission = () => {
  if (selectedMission.value > 0) {
    selectedMission.value--;
  }
};

const nextMission = () => {
  if (selectedMission.value < campaign.value.missions.length - 1) {
    selectedMission.value++;
  }
};

const copyKeyword = (keyword) => {
  navigator.clipboard.writeText(keyword);
  showToastMessage(`'${keyword}' 키워드가 복사되었습니다`, 'success');
};

const copyAllKeywords = () => {
  const allKeywords = campaign.value.keywords.join(', ');
  navigator.clipboard.writeText(allKeywords);
  showToastMessage('전체 키워드가 복사되었습니다', 'success');
};

const goToCampaign = (campaignId) => {
  router.push(`/campaign/${campaignId}`);
};

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

.campaign-top-container {
  display: flex;
  gap: 32px;
  background-color: white;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.hero-image-container {
  position: relative;
  width: 400px;
  height: 400px;
  border-radius: 16px;
  overflow: hidden;
  flex-shrink: 0;
}

.hero-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 100%);
}

.campaign-top-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.top-status-badges {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.campaign-type-badge,
.category-badge {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
}

.campaign-type-badge {
  background-color: #48CFCB;
  color: white;
}

.category-badge {
  background-color: #F5F5F5;
  color: #424242;
}

.campaign-title {
  font-size: 28px;
  font-weight: 700;
  color: #424242;
  margin-bottom: 12px;
  line-height: 1.4;
}

.campaign-subtitle {
  font-size: 16px;
  color: #757575;
  margin-bottom: 24px;
  line-height: 1.5;
}

.top-reward-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background-color: #F5F5F5;
  border-radius: 12px;
  margin-bottom: 24px;
}

.reward-item {
  display: flex;
  flex-direction: column;
}

.reward-label {
  font-size: 13px;
  color: #757575;
  margin-bottom: 4px;
}

.reward-value {
  font-size: 18px;
  font-weight: 700;
  color: #424242;
}

.divider {
  width: 1px;
  height: 32px;
  background-color: #E0E0E0;
}

.top-status-info {
  margin-top: auto;
}

.status-bar {
  width: 100%;
  height: 8px;
  background-color: #F5F5F5;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
}

.status-progress {
  height: 100%;
  background-color: #48CFCB;
  transition: width 0.5s ease;
}

.status-text {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.recruitment-count {
  color: #757575;
}

.recruitment-count strong {
  color: #48CFCB;
  font-weight: 700;
}

.deadline {
  font-weight: 700;
  color: #424242;
}
.quick-stats-card {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
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

.stat-icon.channel {
  background-color: #FF9800;
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

/* 섹션 공통 스타일 */
section {
  margin-bottom: 48px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #424242;
  margin-bottom: 24px;
  position: relative;
  padding-bottom: 12px;
}

.section-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 60px;
  height: 4px;
  background: linear-gradient(to right, #48CFCB, #229799);
  border-radius: 2px;
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

.provision-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 32px;
}

.provision-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background-color: #F5F5F5;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.provision-item:hover {
  background-color: #F0FAF9;
  transform: translateX(10px);
}

.item-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 12px;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
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
}

.item-price {
  font-size: 18px;
  font-weight: 700;
  color: #229799;
  flex-shrink: 0;
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

.summary-row.total {
  background-color: #424242;
  color: white;
  padding: 16px;
  margin-top: 16px;
  font-size: 18px;
  font-weight: 700;
}

.summary-row.total .summary-value {
  color: white;
}

/* 미션 섹션 */
.mission-section {
  margin-bottom: 48px;
}

.mission-slider {
  background-color: white;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.mission-progress {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  position: relative;
  padding: 0 40px;
}

.mission-progress::before {
  content: '';
  position: absolute;
  top: 19px;
  left: 60px;
  right: 60px;
  height: 2px;
  background-color: #E0E0E0;
  z-index: 1;
}

.progress-step {
  position: relative;
  z-index: 2;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #F5F5F5;
  color: #757575;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: all 0.3s ease;
}

.progress-step.active .step-number {
  background-color: #48CFCB;
  color: white;
  transform: scale(1.2);
}

.mission-carousel {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 400px;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  border: 1px solid #E0E0E0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.carousel-btn:hover {
  background-color: #F5F5F5;
  transform: translateY(-50%) scale(1.1);
}

.carousel-btn.prev {
  left: -20px;
}

.carousel-btn.next {
  right: -20px;
}

.mission-content-wrapper {
  width: 100%;
  overflow: hidden;
  position: relative;
}

.mission-content-card {
  background-color: #F5F5F5;
  border-radius: 16px;
  padding: 32px;
  min-height: 300px;
}

.mission-header {
  margin-bottom: 24px;
}

.mission-title {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mission-step {
  font-size: 14px;
  font-weight: 600;
  color: #48CFCB;
}

.mission-title h4 {
  font-size: 24px;
  font-weight: 700;
  color: #424242;
}

.mission-description {
  margin-bottom: 24px;
}

.mission-description p {
  font-size: 16px;
  color: #757575;
  line-height: 1.6;
}

.mission-example {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.example-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.example-icon {
  font-size: 20px;
}

.example-header span {
  font-weight: 600;
  color: #424242;
}

.example-content {
  font-size: 14px;
  color: #757575;
  line-height: 1.6;
}

.mission-checklist {
  display: grid;
  gap: 12px;
}

.checklist-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background-color: white;
  border-radius: 8px;
}

.check-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #48CFCB;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.checklist-item span {
  font-size: 15px;
  color: #424242;
}

/* 애니메이션 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .campaign-top-container {
    flex-direction: column;
    align-items: center;
  }
  
  .hero-image-container {
    width: 100%;
    max-width: 400px;
    height: auto;
    padding-bottom: 100%;
  }
  
  .mission-progress {
    padding: 0 20px;
  }
  
  .mission-progress::before {
    left: 40px;
    right: 40px;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 0 16px 140px;
  }
  
  .campaign-top-container {
    padding: 24px;
  }
  
  .campaign-title {
    font-size: 24px;
  }
  
  .section-title {
    font-size: 20px;
  }
  
  .mission-slider {
    padding: 24px;
  }
  
  .mission-content-card {
    padding: 24px;
  }
  
  .carousel-btn {
    display: none;
  }
  
  .mission-progress {
    overflow-x: auto;
    margin-bottom: 24px;
    padding-bottom: 12px;
  }
}

@media (max-width: 480px) {
  .campaign-top-container {
    padding: 16px;
    border-radius: 16px;
  }
  
  .hero-image-container {
    border-radius: 12px;
  }
  
  .campaign-title {
    font-size: 20px;
  }
  
  .campaign-subtitle {
    font-size: 14px;
  }
  
  .top-reward-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .divider {
    width: 100%;
    height: 1px;
  }
  
  .mission-content-card {
    padding: 16px;
    min-height: auto;
  }
  
  .mission-title h4 {
    font-size: 20px;
  }
  
  .mission-description p {
    font-size: 14px;
  }
  
  .checklist-item {
    padding: 10px 14px;
  }
  
  .checklist-item span {
    font-size: 14px;
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

.info-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.info-card {
  background-color: #F5F5F5;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
}

.info-card:hover {
  background-color: #F0FAF9;
  transform: translateY(-4px);
}

.info-icon {
  width: 56px;
  height: 56px;
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

/* 관련 캠페인 섹션 */
.related-campaigns-section {
  margin-top: 64px;
}

.related-campaigns-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.related-campaign-card {
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}

.related-campaign-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
}

.related-image {
  position: relative;
  width: 100%;
  padding-bottom: 100%; /* 1:1 비율 */
  overflow: hidden;
}

.related-image img {
  position: absolute;
  top: 0;
  left: 0;
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
  margin-bottom: 12px;
}

.related-company {
  color: #757575;
}

.related-reward {
  font-weight: 600;
  color: #229799;
}

.related-stats {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #757575;
}

/* 플로팅 신청 버튼 */
.floating-button-wrapper {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}

.apply-button {
  padding: 16px 48px;
  background: linear-gradient(135deg, #48CFCB, #229799);
  color: white;
  border: none;
  border-radius: 32px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(72, 207, 203, 0.4);
  transition: all 0.3s ease;
}

.apply-button:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(72, 207, 203, 0.6);
}

.apply-button.disabled {
  background: #E0E0E0;
  cursor: not-allowed;
  box-shadow: none;
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
  backdrop-filter: blur(4px);
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
  background: linear-gradient(135deg, #48CFCB, #229799);
  border: none;
  color: white;
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(72, 207, 203, 0.3);
}

.submit-button:disabled {
  background: #E0E0E0;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
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
  transition: all 0.2s;
}

.share-option:hover {
  background-color: #F5F5F5;
  transform: translateY(-4px);
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
  .quick-stats-card {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .keyword-guide {
    grid-template-columns: 1fr;
  }
  
  .info-cards {
    grid-template-columns: 1fr;
  }

  .campaign-info-row {
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 0 16px 140px;
  }
  
  .hero-image-container {
    border-radius: 16px;
    padding-bottom: 70%;
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
  
  .related-campaigns-grid {
    grid-template-columns: 1fr;
  }
  
  .floating-apply-content {
    flex-direction: column;
    align-items: stretch;
    padding: 16px;
  }

  .campaign-quick-info {
    margin-bottom: 16px;
  }

  .campaign-info-row {
    justify-content: space-between;
  }

  .apply-button {
    width: 100%;
    padding: 14px;
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 12px 16px;
  }
  
  .hero-image-container {
    border-radius: 12px;
    padding-bottom: 75%;
  }
  
  .campaign-title {
    font-size: 20px;
  }
  
  .stat-item {
    padding: 16px;
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
  }
  
  .stat-value {
    font-size: 20px;
  }
  
  .provision-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .item-price {
    margin-top: 0;
  }
  
  .share-options {
    grid-template-columns: repeat(2, 1fr);
  }

  .mission-header {
    padding: 12px 16px;
  }

  .mission-content {
    padding: 16px;
  }

  .keyword-actions {
    margin-bottom: 16px;
  }

  .copy-all-btn {
    width: 100%;
    justify-content: center;
  }

  .campaign-info-row {
    flex-direction: column;
    gap: 12px;
  }

  .info-item {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .info-label {
    margin-bottom: 0;
  }
}
</style>
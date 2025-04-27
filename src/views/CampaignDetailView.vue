<template>
  <div class="campaign-detail">
    <!-- 상단 고정 헤더 (스크롤 시) -->
    <div class="sticky-header" :class="{ 'visible': isScrolled }">
      <div class="sticky-content">
        <h2 class="sticky-title">{{ campaign.title }}</h2>
        <div class="sticky-actions">
          <button class="apply-button" @click="applyCampaign">참여하기</button>
          <button class="bookmark-button" :class="{ 'active': isBookmarked }" @click="toggleBookmark">
            <span v-if="isBookmarked">♥</span>
            <span v-else>♡</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 히어로 섹션 -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-image">
          <img :src="campaign.thumbnail" :alt="campaign.title" />
          <div class="channel-badges">
            <span v-for="channel in campaign.channelTypes" :key="channel" class="channel-badge">
              {{ getChannelIcon(channel) }}
            </span>
          </div>
        </div>
        
        <div class="hero-info">
          <div class="campaign-meta">
            <span class="company-name">{{ campaign.companyName }}</span>
            <span class="campaign-type">{{ getCampaignTypeText(campaign.type) }}</span>
          </div>
          
          <h1 class="campaign-title">{{ campaign.title }}</h1>
          
          <div class="campaign-status">
            <span class="status-badge" :class="campaign.status">
              {{ getStatusText(campaign.status) }}
            </span>
            <span class="deadline">D-{{ getDday(campaign.deadline) }}</span>
          </div>
          
          <div class="applicant-info">
            <div class="applicant-progress">
              <div class="progress-bar">
                <div class="progress" :style="{ width: `${getProgress()}%` }"></div>
              </div>
              <div class="applicant-count">
                <span class="current">{{ campaign.applicants.current }}</span>
                <span class="divider">/</span>
                <span class="total">{{ campaign.applicants.total }}명</span>
              </div>
            </div>
          </div>
          
          <div class="action-buttons">
            <button class="primary-button" @click="applyCampaign">참여하기</button>
            <button class="secondary-button" @click="toggleBookmark">
              <span v-if="isBookmarked">♥ 찜 취소</span>
              <span v-else>♡ 찜하기</span>
            </button>
            <button class="icon-button" @click="shareCampaign">
              <span class="share-icon">⤴</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 핵심 정보 섹션 -->
    <section class="key-info-section">
      <div class="info-cards">
        <div class="info-card">
          <div class="card-icon">📦</div>
          <div class="card-content">
            <h3>제공 내역</h3>
            <p class="highlight">{{ formatPrice(campaign.totalProvisionValue) }}원</p>
          </div>
        </div>
        
        <div class="info-card">
          <div class="card-icon">💰</div>
          <div class="card-content">
            <h3>리워드</h3>
            <p class="highlight">{{ formatPoints(campaign.rewardPoint) }}</p>
          </div>
        </div>
        
        <div class="info-card">
          <div class="card-icon">📍</div>
          <div class="card-content">
            <h3>카테고리</h3>
            <p>{{ getCategoryText(campaign.category) }}</p>
          </div>
        </div>
        
        <div class="info-card">
          <div class="card-icon">📞</div>
          <div class="card-content">
            <h3>담당자</h3>
            <p>{{ campaign.contactInfo }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 상세 정보 탭 섹션 -->
    <section class="detail-tabs-section">
      <div class="tabs-container">
        <div class="tabs-header">
          <button 
            v-for="tab in tabs" 
            :key="tab.id" 
            class="tab-button"
            :class="{ 'active': activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>
        
        <div class="tabs-content">
          <!-- 기본정보 탭 -->
          <div v-show="activeTab === 'basic'" class="tab-panel">
            <div class="panel-section">
              <h3>캠페인 정보</h3>
              <div class="info-grid">
                <div class="info-item">
                  <label>캠페인 유형</label>
                  <p>{{ getCampaignTypeText(campaign.type) }}</p>
                </div>
                <div class="info-item">
                  <label>카테고리</label>
                  <p>{{ getCategoryText(campaign.category) }}</p>
                </div>
                <div class="info-item" v-if="campaign.url">
                  <label>URL</label>
                  <a :href="campaign.url" target="_blank" class="link">{{ campaign.url }}</a>
                </div>
                <div class="info-item" v-if="campaign.address">
                  <label>주소</label>
                  <p>{{ campaign.address }}</p>
                </div>
              </div>
            </div>
            
            <div class="panel-section">
              <h3>제공 내역</h3>
              <div class="provision-list">
                <div v-for="item in campaign.provisionItems" :key="item.name" class="provision-item">
                  <span class="item-name">{{ item.name }}</span>
                  <span class="item-price">{{ formatPrice(item.price) }}원</span>
                </div>
                <div class="provision-total">
                  <span>총 제공 금액</span>
                  <span class="total-price">{{ formatPrice(campaign.totalProvisionValue) }}원</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 미션 탭 -->
          <div v-show="activeTab === 'mission'" class="tab-panel">
            <div class="panel-section">
              <h3>체험단 미션</h3>
              <div class="mission-tags">
                <span v-for="mission in campaign.missions" :key="mission" class="mission-tag">
                  {{ mission }}
                </span>
              </div>
            </div>
            
            <div class="panel-section">
              <h3>필수 키워드</h3>
              <div class="keyword-info">
                <p class="keyword-desc">제목에 1개, 본문에 3개 이상 포함해주세요</p>
                <div class="keyword-tags">
                  <span v-for="keyword in campaign.keywords" :key="keyword" class="keyword-tag">
                    {{ keyword }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="panel-section">
              <h3>작성 가이드라인</h3>
              <ul class="guidelines">
                <li>실제 사용 후기를 솔직하게 작성해주세요</li>
                <li>사진은 최소 5장 이상 포함해주세요</li>
                <li>제품의 장단점을 모두 언급해주세요</li>
                <li>광고 문구를 반드시 포함해주세요</li>
              </ul>
            </div>
          </div>
          
          <!-- 리워드 탭 -->
          <div v-show="activeTab === 'reward'" class="tab-panel">
            <div class="panel-section">
              <h3>리워드 정보</h3>
              <div class="reward-info">
                <div class="reward-item">
                  <label>지급 포인트</label>
                  <p class="highlight">{{ formatPoints(campaign.rewardPoint) }}</p>
                </div>
                <div class="reward-item">
                  <label>수수료 (5%)</label>
                  <p>{{ formatPoints(campaign.fee) }}</p>
                </div>
                <div class="reward-item total">
                  <label>실 지급 포인트</label>
                  <p class="highlight">{{ formatPoints(campaign.rewardPoint - campaign.fee) }}</p>
                </div>
              </div>
            </div>
            
            <div class="panel-section">
              <h3>지급 일정</h3>
              <div class="schedule-timeline">
                <div class="timeline-item">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <h4>캠페인 종료</h4>
                    <p>{{ campaign.endDate }}</p>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <h4>콘텐츠 검수</h4>
                    <p>종료 후 7일 이내</p>
                  </div>
                </div>
                <div class="timeline-item">
                  <div class="timeline-dot"></div>
                  <div class="timeline-content">
                    <h4>포인트 지급</h4>
                    <p>검수 완료 후 3일 이내</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 참여방법 탭 -->
          <div v-show="activeTab === 'process'" class="tab-panel">
            <div class="panel-section">
              <h3>참여 조건</h3>
              <ul class="condition-list">
                <li v-for="condition in campaign.conditions" :key="condition">
                  {{ condition }}
                </li>
              </ul>
            </div>
            
            <div class="panel-section">
              <h3>진행 프로세스</h3>
              <div class="process-steps">
                <div v-for="(step, index) in campaign.processSteps" :key="index" class="process-step">
                  <div class="step-number">{{ index + 1 }}</div>
                  <div class="step-content">
                    <h4>{{ step.title }}</h4>
                    <p>{{ step.description }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="panel-section">
              <h3>주의사항</h3>
              <ul class="notice-list">
                <li>캠페인 참여 후 중도 취소는 불가능합니다</li>
                <li>제공된 제품은 반납하지 않으셔도 됩니다</li>
                <li>작성 기한을 반드시 준수해주세요</li>
                <li>가이드라인에 맞지 않는 콘텐츠는 수정 요청될 수 있습니다</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ 섹션 -->
    <section class="faq-section">
      <h2>자주 묻는 질문</h2>
      <div class="faq-accordion">
        <div v-for="(faq, index) in faqs" :key="index" class="faq-item">
          <button class="faq-question" @click="toggleFaq(index)">
            <span>{{ faq.question }}</span>
            <span class="faq-arrow" :class="{ 'open': activeFaq === index }">▼</span>
          </button>
          <div class="faq-answer" v-show="activeFaq === index">
            <p>{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 하단 CTA -->
    <section class="bottom-cta">
      <div class="cta-content">
        <div class="cta-info">
          <p class="cta-text">캠페인에 참여하고 리워드를 받아보세요!</p>
          <p class="cta-subtext">마감까지 {{ getDday(campaign.deadline) }}일 남았습니다</p>
        </div>
        <button class="cta-button" @click="applyCampaign">지금 참여하기</button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'CampaignDetail',
  data() {
    return {
      campaign: {
        id: 1,
        companyName: '○○ 화장품',
        title: '2024 신제품 수분크림 체험단 모집',
        type: 'delivery',
        category: 'beauty',
        status: 'ongoing',
        thumbnail: '/images/campaign-thumbnail.jpg',
        channelTypes: ['blog', 'instagram', 'youtube'],
        deadline: '2024-12-31',
        startDate: '2024-12-01',
        endDate: '2024-12-31',
        applicants: {
          current: 15,
          total: 30
        },
        provisionItems: [
          { name: '수분크림 50ml', price: 35000 },
          { name: '토너 150ml', price: 25000 },
          { name: '샘플 키트', price: 10000 }
        ],
        totalProvisionValue: 70000,
        rewardPoint: 30000,
        fee: 1500,
        contactInfo: '010-1234-5678',
        url: 'https://example.com/product',
        missions: [
          '사용감이 좋아요',
          '수분감이 오래가요',
          '촉촉한 마무리감',
          '민감성 피부도 OK'
        ],
        keywords: [
          '○○수분크림',
          '수분폭탄크림',
          '겨울보습크림',
          '건성피부추천',
          '민감성피부화장품'
        ],
        conditions: [
          '블로그 방문자 수 일 평균 300명 이상',
          '인스타그램 팔로워 1,000명 이상',
          '뷰티/화장품 관련 콘텐츠 운영자'
        ],
        processSteps: [
          {
            title: '캠페인 신청',
            description: '캠페인 상세 내용 확인 후 신청'
          },
          {
            title: '선정 발표',
            description: '신청 마감 후 3일 이내 개별 연락'
          },
          {
            title: '제품 수령',
            description: '선정자에 한해 택배 발송'
          },
          {
            title: '콘텐츠 작성',
            description: '제품 수령 후 14일 이내 작성'
          },
          {
            title: '리워드 지급',
            description: '콘텐츠 검수 후 포인트 지급'
          }
        ]
      },
      isBookmarked: false,
      isScrolled: false,
      activeTab: 'basic',
      activeFaq: null,
      tabs: [
        { id: 'basic', label: '기본정보' },
        { id: 'mission', label: '미션' },
        { id: 'reward', label: '리워드' },
        { id: 'process', label: '참여방법' }
      ],
      faqs: [
        {
          question: '캠페인 신청 후 취소가 가능한가요?',
          answer: '선정 발표 전까지는 취소가 가능합니다. 선정 이후에는 취소가 불가능하니 신중히 신청해주세요.'
        },
        {
          question: '제품은 언제 받을 수 있나요?',
          answer: '선정자 발표 후 3-5일 이내에 등록하신 주소로 발송됩니다.'
        },
        {
          question: '리워드는 언제 지급되나요?',
          answer: '콘텐츠 검수 완료 후 3영업일 이내에 포인트로 지급됩니다.'
        }
      ]
    }
  },
  computed: {
    getProgress() {
      return (this.campaign.applicants.current / this.campaign.applicants.total) * 100;
    }
  },
  methods: {
    getChannelIcon(channel) {
      const icons = {
        blog: 'B',
        instagram: 'I',
        youtube: 'Y',
        tiktok: 'T'
      };
      return icons[channel] || channel[0].toUpperCase();
    },
    getCampaignTypeText(type) {
      const types = {
        delivery: '배송형',
        visit: '방문형',
        purchase: '구매형',
        reporter: '기자단'
      };
      return types[type] || type;
    },
    getCategoryText(category) {
      const categories = {
        beauty: '뷰티',
        food: '식품',
        living: '생활',
        tech: '테크'
      };
      return categories[category] || category;
    },
    getStatusText(status) {
      const statuses = {
        ongoing: '모집중',
        upcoming: '예정',
        closed: '마감'
      };
      return statuses[status] || status;
    },
    getDday(deadline) {
      const today = new Date();
      const deadlineDate = new Date(deadline);
      const diffTime = deadlineDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    },
    formatPrice(price) {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    formatPoints(points) {
      return this.formatPrice(points) + 'P';
    },
    toggleBookmark() {
      this.isBookmarked = !this.isBookmarked;
      // API 호출 등 추가 로직
    },
    applyCampaign() {
      // 캠페인 신청 로직
      console.log('캠페인 신청');
    },
    shareCampaign() {
      // 공유 기능 구현
      console.log('캠페인 공유');
    },
    toggleFaq(index) {
      this.activeFaq = this.activeFaq === index ? null : index;
    },
    handleScroll() {
      this.isScrolled = window.scrollY > 100;
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
}
</script>

<style scoped>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

.campaign-detail {
  font-family: 'Pretendard', sans-serif;
  color: #424242;
  background-color: #F5F5F5;
  min-height: 100vh;
}

/* 상단 고정 헤더 */
.sticky-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  z-index: 100;
  transform: translateY(-100%);
  transition: transform 0.3s ease;
}

.sticky-header.visible {
  transform: translateY(0);
}

.sticky-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sticky-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.sticky-actions {
  display: flex;
  gap: 8px;
}

/* 히어로 섹션 */
.hero-section {
  background: white;
  padding: 40px 0;
  margin-bottom: 20px;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  gap: 40px;
}

.hero-image {
  flex: 0 0 500px;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
}

.hero-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.channel-badges {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  gap: 8px;
}

.channel-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #48CFCB;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hero-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.campaign-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.company-name {
  font-weight: 600;
  color: #229799;
}

.campaign-type {
  padding: 4px 12px;
  background: #F5F5F5;
  border-radius: 16px;
  font-size: 14px;
  color: #666;
}

.campaign-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 16px;
  line-height: 1.3;
}

.campaign-status {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
}

.status-badge.ongoing {
  background: rgba(72, 207, 203, 0.1);
  color: #48CFCB;
}

.status-badge.closed {
  background: rgba(66, 66, 66, 0.1);
  color: #666;
}

.deadline {
  font-weight: 600;
  color: #FF5252;
}

.applicant-info {
  margin-bottom: 24px;
}

.applicant-progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-bar {
  height: 8px;
  background: #E0E0E0;
  border-radius: 4px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #48CFCB;
  transition: width 0.3s ease;
}

.applicant-count {
  font-size: 14px;
  color: #666;
  text-align: right;
}

.current {
  font-weight: 600;
  color: #48CFCB;
}

.divider {
  margin: 0 2px;
  color: #999;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.primary-button {
  flex: 1;
  padding: 14px 24px;
  background: #48CFCB;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.primary-button:hover {
  background: #229799;
}

.secondary-button {
  padding: 14px 24px;
  background: white;
  color: #424242;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.secondary-button:hover {
  border-color: #48CFCB;
  color: #48CFCB;
}

.icon-button {
  padding: 14px;
  background: white;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-button:hover {
  border-color: #48CFCB;
}

.share-icon {
  font-size: 20px;
  color: #424242;
}

/* 핵심 정보 섹션 */
.key-info-section {
  max-width: 1200px;
  margin: 0 auto 20px;
  padding: 0 20px;
}

.info-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.card-icon {
  font-size: 24px;
  line-height: 1;
}

.card-content h3 {
  font-size: 14px;
  color: #666;
  margin: 0 0 8px;
}

.card-content p {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.card-content .highlight {
  color: #48CFCB;
}

/* 상세 정보 탭 섹션 */
.detail-tabs-section {
  max-width: 1200px;
  margin: 0 auto 20px;
  padding: 0 20px;
}

.tabs-container {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.tabs-header {
  display: flex;
  border-bottom: 1px solid #E0E0E0;
  margin-bottom: 24px;
}

.tab-button {
  padding: 12px 24px;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}

.tab-button.active {
  color: #48CFCB;
  font-weight: 600;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #48CFCB;
}

.tab-panel {
  animation: fadeIn 0.3s ease;
}

.panel-section {
  margin-bottom: 32px;
}

.panel-section:last-child {
  margin-bottom: 0;
}

.panel-section h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #E0E0E0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.info-item p {
  font-size: 16px;
  margin: 0;
}

.info-item .link {
  color: #48CFCB;
  text-decoration: none;
}

.info-item .link:hover {
  text-decoration: underline;
}

.provision-list {
  background: #F5F5F5;
  border-radius: 8px;
  padding: 16px;
}

.provision-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #E0E0E0;
}

.provision-item:last-child {
  border-bottom: none;
}

.item-name {
  font-weight: 500;
}

.item-price {
  color: #666;
}

.provision-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0 0;
  margin-top: 16px;
  border-top: 2px solid #E0E0E0;
  font-weight: 600;
}

.total-price {
  color: #48CFCB;
  font-size: 18px;
}

.mission-tags, .keyword-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.mission-tag, .keyword-tag {
  padding: 8px 16px;
  background: rgba(72, 207, 203, 0.1);
  color: #229799;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.keyword-desc {
  font-size: 14px;
  color: #666;
  margin: 0 0 12px;
}

.guidelines, .condition-list, .notice-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.guidelines li, .condition-list li, .notice-list li {
  position: relative;
  padding-left: 24px;
  margin-bottom: 12px;
  line-height: 1.5;
}

.guidelines li::before, .condition-list li::before, .notice-list li::before {
  content: '•';
  position: absolute;
  left: 8px;
  color: #48CFCB;
}

.reward-info {
  background: #F5F5F5;
  border-radius: 8px;
  padding: 16px;
}

.reward-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.reward-item.total {
  border-top: 2px solid #E0E0E0;
  margin-top: 12px;
  padding-top: 16px;
}

.reward-item label {
  font-size: 14px;
  color: #666;
}

.reward-item p {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.schedule-timeline {
  position: relative;
  padding-left: 30px;
}

.timeline-item {
  position: relative;
  padding-bottom: 24px;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -25px;
  top: 12px;
  bottom: -12px;
  width: 2px;
  background: #E0E0E0;
}

.timeline-item:last-child::before {
  display: none;
}

.timeline-dot {
  position: absolute;
  left: -30px;
  top: 8px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #48CFCB;
  border: 2px solid white;
  box-shadow: 0 0 0 2px #48CFCB;
}

.timeline-content h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px;
}

.timeline-content p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.process-steps {
  display: grid;
  gap: 16px;
}

.process-step {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 16px;
  background: #F5F5F5;
  border-radius: 8px;
}

.step-number {
  width: 32px;
  height: 32px;
  background: #48CFCB;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px;
}

.step-content p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* FAQ 섹션 */
.faq-section {
  max-width: 1200px;
  margin: 0 auto 20px;
  padding: 0 20px;
}

.faq-section h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 16px;
}

.faq-accordion {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.faq-item {
  border-bottom: 1px solid #E0E0E0;
}

.faq-item:last-child {
  border-bottom: none;
}

.faq-question {
  width: 100%;
  padding: 20px 24px;
  background: none;
  border: none;
  text-align: left;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.faq-arrow {
  font-size: 12px;
  color: #666;
  transition: transform 0.3s;
}

.faq-arrow.open {
  transform: rotate(180deg);
}

.faq-answer {
  padding: 0 24px 20px;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

/* 하단 CTA */
.bottom-cta {
  background: white;
  padding: 24px 0;
  margin-top: 40px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
}

.cta-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cta-text {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px;
}

.cta-subtext {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.cta-button {
  padding: 14px 32px;
  background: #48CFCB;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.cta-button:hover {
  background: #229799;
}

/* 애니메이션 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .hero-content {
    flex-direction: column;
  }
  
  .hero-image {
    flex: none;
    width: 100%;
  }
  
  .info-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-image img {
    height: 300px;
  }
  
  .campaign-title {
    font-size: 24px;
  }
  
  .info-cards {
    grid-template-columns: 1fr;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .tabs-header {
    flex-wrap: wrap;
  }
  
  .tab-button {
    flex: 1 0 50%;
  }
  
  .cta-content {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .cta-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 20px 0;
  }
  
  .campaign-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .secondary-button, .icon-button {
    width: 100%;
  }
  
  .tab-button {
    flex: 1 0 100%;
  }
}
</style>
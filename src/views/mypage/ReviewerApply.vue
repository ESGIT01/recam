<template>
    <div class="reviewer-apply">
      <div class="page-layout">
        <!-- 왼쪽 사이드바 -->
        <ReviewerSidebar />
        
        <!-- 메인 콘텐츠 영역 -->
        <div class="apply-content">
          <!-- 페이지 헤더 -->
          <div class="page-header">
            <h1 class="page-title">내가 신청한 캠페인</h1>
          </div>
  
          <!-- 필터 및 검색 영역 -->
          <div class="filter-section">
            <div class="filter-tabs">
              <button 
                v-for="(tab, index) in tabs" 
                :key="index" 
                @click="currentTab = tab.value"
                :class="['tab-button', { active: currentTab === tab.value }]"
              >
                {{ tab.name }}
                <span class="count" v-if="tab.count">{{ tab.count }}</span>
              </button>
            </div>
            <div class="search-box">
              <input 
                type="text" 
                v-model="searchKeyword" 
                placeholder="캠페인명 검색" 
                class="search-input"
              />
              <button class="search-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M21 21L16.65 16.65" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
  
          <!-- 캠페인 목록 -->
          <div class="campaigns-list">
            <div v-if="filteredCampaigns.length === 0" class="no-campaigns">
              <div class="no-content-icon">📋</div>
              <p class="no-content-text">신청한 캠페인이 없습니다.</p>
            </div>
  
            <div 
              v-for="campaign in filteredCampaigns" 
              :key="campaign.id" 
              class="campaign-card"
            >
              <!-- 캠페인 이미지 -->
              <div class="campaign-image">
                <img :src="campaign.imageUrl" :alt="campaign.title" />
                <div class="campaign-status" :class="campaign.status">
                  {{ getStatusText(campaign.status) }}
                </div>
              </div>
  
              <!-- 캠페인 정보 -->
              <div class="campaign-info">
                <div class="campaign-header">
                  <div class="campaign-category">{{ campaign.category }}</div>
                  <div class="campaign-date">신청일: {{ formatDate(campaign.appliedAt) }}</div>
                </div>
                <h3 class="campaign-title">{{ campaign.title }}</h3>
                <div class="campaign-meta">
                  <div class="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#757575" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M16 2V6" stroke="#757575" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M8 2V6" stroke="#757575" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M3 10H21" stroke="#757575" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>모집기간: {{ campaign.recruitmentPeriod }}</span>
                  </div>
                  <div class="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#757575" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M12 6V12L16 14" stroke="#757575" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>리뷰기간: {{ campaign.reviewPeriod }}</span>
                  </div>
                  <div class="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 12V22H4V12" stroke="#757575" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M22 7H2V12H22V7Z" stroke="#757575" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M12 22V7" stroke="#757575" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z" stroke="#757575" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z" stroke="#757575" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>제공: {{ campaign.benefits }}</span>
                  </div>
                </div>
              </div>
  
              <!-- 캠페인 액션 영역 -->
              <div class="campaign-actions">
                <button 
                  v-if="campaign.status === 'selected'"
                  class="action-button delivery-btn"
                  @click="openDeliveryModal(campaign.id)"
                >
                  배송정보 등록
                </button>
                <button 
                  v-if="campaign.status === 'inReview' || campaign.status === 'completed'"
                  class="action-button review-btn"
                  @click="goToReviewPage(campaign.id)"
                >
                  리뷰 작성
                </button>
                <button 
                  v-if="campaign.status === 'pending'"
                  class="action-button cancel-btn"
                  @click="cancelApplication(campaign.id)"
                >
                  신청 취소
                </button>
                <button 
                  v-if="['rejected', 'completed'].includes(campaign.status)"
                  class="action-button detail-btn"
                  @click="showCampaignDetail(campaign.id)"
                >
                  상세보기
                </button>
              </div>
            </div>
          </div>
  
          <!-- 페이지네이션 -->
          <div class="pagination" v-if="filteredCampaigns.length > 0">
            <button class="pagination-button" :disabled="currentPage === 1" @click="currentPage--">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div class="page-numbers">
              <button 
                v-for="page in totalPages" 
                :key="page" 
                :class="['page-number', { active: currentPage === page }]"
                @click="currentPage = page"
              >
                {{ page }}
              </button>
            </div>
            <button class="pagination-button" :disabled="currentPage === totalPages" @click="currentPage++">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
  
      <!-- 배송정보 모달 -->
      <div class="modal-overlay" v-if="showDeliveryModal" @click="closeDeliveryModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">배송정보 등록</h3>
            <button class="close-btn" @click="closeDeliveryModal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6 6L18 18" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="recipient">수령인<span class="required">*</span></label>
              <input 
                type="text" 
                id="recipient" 
                v-model="deliveryInfo.recipient" 
                class="form-input" 
                placeholder="수령인 이름을 입력하세요"
              />
            </div>
            <div class="form-group">
              <label for="phone">연락처<span class="required">*</span></label>
              <input 
                type="tel" 
                id="phone" 
                v-model="deliveryInfo.phone" 
                class="form-input" 
                placeholder="'-' 없이 숫자만 입력하세요"
                maxlength="11"
              />
            </div>
            <div class="form-group">
              <label for="zipcode">우편번호<span class="required">*</span></label>
              <div class="zipcode-group">
                <input 
                  type="text" 
                  id="zipcode" 
                  v-model="deliveryInfo.zipcode" 
                  class="form-input zipcode-input" 
                  placeholder="우편번호" 
                  readonly
                />
                <button class="zipcode-btn" @click="searchAddress">주소 검색</button>
              </div>
            </div>
            <div class="form-group">
              <label for="address1">주소<span class="required">*</span></label>
              <input 
                type="text" 
                id="address1" 
                v-model="deliveryInfo.address1" 
                class="form-input" 
                placeholder="기본 주소" 
                readonly
              />
            </div>
            <div class="form-group">
              <label for="address2">상세 주소<span class="required">*</span></label>
              <input 
                type="text" 
                id="address2" 
                v-model="deliveryInfo.address2" 
                class="form-input" 
                placeholder="상세 주소를 입력하세요"
              />
            </div>
            <div class="form-group">
              <label for="request">배송 요청사항</label>
              <input 
                type="text" 
                id="request" 
                v-model="deliveryInfo.request" 
                class="form-input" 
                placeholder="배송 요청사항을 입력하세요"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button class="modal-cancel-btn" @click="closeDeliveryModal">취소</button>
            <button class="modal-save-btn" @click="saveDeliveryInfo" :disabled="!isDeliveryFormValid">등록하기</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
import ReviewerSidebar from '@/components/ReviewerSidebar.vue';

export default {
  name: 'ReviewerApply',
  components: {
    ReviewerSidebar
  },
  data() {
    return {
      // 현재 탭 (전체, 신청중, 선정, 진행중, 완료됨, 미선정)
      currentTab: 'all',
      
      // 탭 정보
      tabs: [
        { name: '전체', value: 'all', count: 12 },
        { name: '신청중', value: 'pending', count: 2 },
        { name: '선정', value: 'selected', count: 3 },
        { name: '진행중', value: 'inReview', count: 2 },
        { name: '완료됨', value: 'completed', count: 3 },
        { name: '미선정', value: 'rejected', count: 2 }
      ],
      
      // 검색어
      searchKeyword: '',
      
      // 현재 페이지
      currentPage: 1,
      
      // 페이지당 아이템 수
      itemsPerPage: 5,
      
      // 배송 정보 모달
      showDeliveryModal: false,
      selectedCampaignId: null,
      deliveryInfo: {
        recipient: '',
        phone: '',
        zipcode: '',
        address1: '',
        address2: '',
        request: ''
      },
      
      // 캠페인 데이터
      campaigns: [
        {
          id: 1,
          title: "신상 유기농 그린티 샴푸 체험단 모집",
          category: "뷰티",
          imageUrl: "/api/placeholder/300/160",
          status: "pending",
          appliedAt: new Date(2025, 3, 15),
          recruitmentPeriod: "2025.04.10 ~ 2025.04.20",
          reviewPeriod: "2025.04.25 ~ 2025.05.10",
          benefits: "제품 제공 + 리뷰비 3만원"
        },
        {
          id: 2,
          title: "프리미엄 헤어 트리트먼트 사용자 모집",
          category: "뷰티",
          imageUrl: "/api/placeholder/300/160",
          status: "selected",
          appliedAt: new Date(2025, 3, 10),
          recruitmentPeriod: "2025.04.05 ~ 2025.04.15",
          reviewPeriod: "2025.04.20 ~ 2025.05.05",
          benefits: "제품 제공 + 리뷰비 5만원"
        },
        {
          id: 3,
          title: "홈카페 에스프레소 머신 체험단",
          category: "생활용품",
          imageUrl: "/api/placeholder/300/160",
          status: "inReview",
          appliedAt: new Date(2025, 3, 5),
          recruitmentPeriod: "2025.03.25 ~ 2025.04.05",
          reviewPeriod: "2025.04.15 ~ 2025.04.30",
          benefits: "제품 대여 + 리뷰비 10만원"
        },
        {
          id: 4,
          title: "비건 친환경 클렌징 폼 체험단",
          category: "뷰티",
          imageUrl: "/api/placeholder/300/160",
          status: "completed",
          appliedAt: new Date(2025, 2, 15),
          recruitmentPeriod: "2025.03.01 ~ 2025.03.15",
          reviewPeriod: "2025.03.20 ~ 2025.04.05",
          benefits: "제품 제공 + 리뷰비 2만원"
        },
        {
          id: 5,
          title: "프리미엄 반려견 사료 체험단",
          category: "반려동물",
          imageUrl: "/api/placeholder/300/160",
          status: "rejected",
          appliedAt: new Date(2025, 2, 10),
          recruitmentPeriod: "2025.02.25 ~ 2025.03.10",
          reviewPeriod: "2025.03.15 ~ 2025.03.30",
          benefits: "제품 제공 + 리뷰비 3만원"
        },
        {
          id: 6,
          title: "다이어트 건강식품 체험단",
          category: "건강",
          imageUrl: "/api/placeholder/300/160",
          status: "completed",
          appliedAt: new Date(2025, 1, 20),
          recruitmentPeriod: "2025.02.01 ~ 2025.02.15",
          reviewPeriod: "2025.02.20 ~ 2025.03.10",
          benefits: "제품 제공 + 리뷰비 5만원"
        },
        {
          id: 7,
          title: "무선 이어폰 체험단 모집",
          category: "디지털",
          imageUrl: "/api/placeholder/300/160",
          status: "inReview",
          appliedAt: new Date(2025, 3, 1),
          recruitmentPeriod: "2025.03.20 ~ 2025.04.01",
          reviewPeriod: "2025.04.05 ~ 2025.04.20",
          benefits: "제품 제공 + 리뷰비 8만원"
        },
        {
          id: 8,
          title: "친환경 세탁세제 체험단 모집",
          category: "생활용품",
          imageUrl: "/api/placeholder/300/160",
          status: "pending",
          appliedAt: new Date(2025, 3, 18),
          recruitmentPeriod: "2025.04.15 ~ 2025.04.25",
          reviewPeriod: "2025.04.30 ~ 2025.05.15",
          benefits: "제품 제공 + 리뷰비 2만원"
        },
        {
          id: 9,
          title: "프리미엄 유아 스킨케어 체험단",
          category: "육아",
          imageUrl: "/api/placeholder/300/160",
          status: "selected",
          appliedAt: new Date(2025, 3, 8),
          recruitmentPeriod: "2025.04.01 ~ 2025.04.12",
          reviewPeriod: "2025.04.17 ~ 2025.05.02",
          benefits: "제품 제공 + 리뷰비 4만원"
        },
        {
          id: 10,
          title: "웰빙 샐러드 도시락 체험단 모집",
          category: "푸드",
          imageUrl: "/api/placeholder/300/160",
          status: "rejected",
          appliedAt: new Date(2025, 2, 20),
          recruitmentPeriod: "2025.03.10 ~ 2025.03.20",
          reviewPeriod: "2025.03.25 ~ 2025.04.10",
          benefits: "제품 제공 + 리뷰비 3만원"
        },
        {
          id: 11,
          title: "프리미엄 블루투스 스피커 체험단",
          category: "디지털",
          imageUrl: "/api/placeholder/300/160",
          status: "selected",
          appliedAt: new Date(2025, 3, 12),
          recruitmentPeriod: "2025.04.05 ~ 2025.04.15",
          reviewPeriod: "2025.04.20 ~ 2025.05.05",
          benefits: "제품 제공 + 리뷰비 7만원"
        },
        {
          id: 12,
          title: "헬스케어 영양제 체험단 모집",
          category: "건강",
          imageUrl: "/api/placeholder/300/160",
          status: "completed",
          appliedAt: new Date(2025, 2, 5),
          recruitmentPeriod: "2025.02.20 ~ 2025.03.05",
          reviewPeriod: "2025.03.10 ~ 2025.03.25",
          benefits: "제품 제공 + 리뷰비 4만원"
        }
      ]
    }
  },
  computed: {
    // 필터링된 캠페인
    filteredCampaigns() {
      // 탭 필터링
      let filtered = this.campaigns;
      if (this.currentTab !== 'all') {
        filtered = filtered.filter(campaign => campaign.status === this.currentTab);
      }
      
      // 검색어 필터링
      if (this.searchKeyword.trim()) {
        const keyword = this.searchKeyword.trim().toLowerCase();
        filtered = filtered.filter(campaign => 
          campaign.title.toLowerCase().includes(keyword) || 
          campaign.category.toLowerCase().includes(keyword)
        );
      }
      
      // 페이지네이션
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return filtered.slice(startIndex, endIndex);
    },
    
    // 총 페이지 수
    totalPages() {
      let filtered = this.campaigns;
      if (this.currentTab !== 'all') {
        filtered = filtered.filter(campaign => campaign.status === this.currentTab);
      }
      
      if (this.searchKeyword.trim()) {
        const keyword = this.searchKeyword.trim().toLowerCase();
        filtered = filtered.filter(campaign => 
          campaign.title.toLowerCase().includes(keyword) || 
          campaign.category.toLowerCase().includes(keyword)
        );
      }
      
      return Math.ceil(filtered.length / this.itemsPerPage);
    },
    
    // 배송정보 폼 유효성 검사
    isDeliveryFormValid() {
      return (
        this.deliveryInfo.recipient &&
        this.deliveryInfo.phone &&
        this.deliveryInfo.zipcode &&
        this.deliveryInfo.address1 &&
        this.deliveryInfo.address2
      );
    }
  },
  methods: {
    // 날짜 포맷팅
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}.${month}.${day}`;
    },
    
    // 상태 텍스트 반환
    getStatusText(status) {
      const statusMap = {
        'pending': '신청중',
        'selected': '선정',
        'inReview': '진행중',
        'completed': '완료됨',
        'rejected': '미선정'
      };
      return statusMap[status] || status;
    },
    
    // 배송정보 모달 열기
    openDeliveryModal(campaignId) {
      this.selectedCampaignId = campaignId;
      this.showDeliveryModal = true;
    },
    
    // 배송정보 모달 닫기
    closeDeliveryModal() {
      this.showDeliveryModal = false;
      this.selectedCampaignId = null;
      // 폼 초기화
      this.deliveryInfo = {
        recipient: '',
        phone: '',
        zipcode: '',
        address1: '',
        address2: '',
        request: ''
      };
    },
    
    // 주소 검색
    searchAddress() {
      // 실제로는 Daum 주소 API 등을 사용하여 구현
      alert('주소 검색 기능은 실제 구현이 필요합니다.');
      // 테스트용 데이터
      this.deliveryInfo.zipcode = '12345';
      this.deliveryInfo.address1 = '서울시 강남구 테헤란로 123';
    },
    
    // 배송정보 저장
    saveDeliveryInfo() {
      if (!this.isDeliveryFormValid) return;
      
      // 실제로는 API 호출하여 저장
      alert('배송 정보가 등록되었습니다.');
      
      // 해당 캠페인 상태 업데이트 (UI 업데이트용)
      const campaignIndex = this.campaigns.findIndex(c => c.id === this.selectedCampaignId);
      if (campaignIndex !== -1) {
        // 실제로는 API 응답에 따라 상태를 업데이트해야 함
        // 이 예제에서는 단순하게 UI 업데이트만
        this.campaigns[campaignIndex].deliveryRegistered = true;
      }
      
      this.closeDeliveryModal();
    },
    
    // 리뷰 작성 페이지로 이동
    goToReviewPage(campaignId) {
      // 실제로는 라우팅으로 구현
      alert(`리뷰 작성 페이지로 이동합니다. 캠페인 ID: ${campaignId}`);
      // this.$router.push(`/reviewer/review/${campaignId}`);
    },
    
    // 신청 취소
    cancelApplication(campaignId) {
      if (confirm('캠페인 신청을 취소하시겠습니까?')) {
        // 실제로는 API 호출하여 취소 처리
        const campaignIndex = this.campaigns.findIndex(c => c.id === campaignId);
        if (campaignIndex !== -1) {
          // 예제를 위해 배열에서 제거
          this.campaigns.splice(campaignIndex, 1);
          
          // 탭 카운트 업데이트
          this.updateTabCounts();
          
          alert('캠페인 신청이 취소되었습니다.');
        }
      }
    },
    
    // 캠페인 상세 보기
    showCampaignDetail(campaignId) {
      // 실제로는 라우팅으로 구현
      alert(`캠페인 상세 페이지로 이동합니다. 캠페인 ID: ${campaignId}`);
      // this.$router.push(`/reviewer/campaign/${campaignId}`);
    },
    
    // 탭 카운트 업데이트
    updateTabCounts() {
      const counts = {
        'all': this.campaigns.length,
        'pending': this.campaigns.filter(c => c.status === 'pending').length,
        'selected': this.campaigns.filter(c => c.status === 'selected').length,
        'inReview': this.campaigns.filter(c => c.status === 'inReview').length,
        'completed': this.campaigns.filter(c => c.status === 'completed').length,
        'rejected': this.campaigns.filter(c => c.status === 'rejected').length
      };
      
      this.tabs = this.tabs.map(tab => ({
        ...tab,
        count: counts[tab.value]
      }));
    }
  },
  watch: {
    // 탭이나 검색어 변경 시 페이지 초기화
    currentTab() {
      this.currentPage = 1;
    },
    searchKeyword() {
      this.currentPage = 1;
    }
  },
  mounted() {
    // 탭 카운트 초기화
    this.updateTabCounts();
  }
}
</script>
<style scoped>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

* {
  font-family: 'Pretendard', sans-serif;
  box-sizing: border-box;
}

.reviewer-apply {
  background-color: #FFFFFF;
  min-height: 100vh;
}

.page-layout {
  display: flex;
  max-width: 1280px;
  margin: 0 auto;
}

.apply-content {
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

/* 필터 및 검색 영역 */
.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.filter-tabs {
  display: flex;
  gap: 8px;
}

.tab-button {
  background: none;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  color: #757575;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
}

.tab-button:hover {
  background-color: #F5F5F5;
}

.tab-button.active {
  background-color: #229799;
  color: white;
}

.count {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  height: 20px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  font-size: 12px;
  margin-left: 6px;
  padding: 0 6px;
}

.tab-button.active .count {
  background-color: #F5F5F5;
  color: #229799;
}

.search-box {
  position: relative;
  width: 280px;
}

.search-input {
  width: 100%;
  padding: 10px 40px 10px 16px;
  border: 1px solid #E0E0E0;
  border-radius: 20px;
  font-size: 14px;
}

.search-button {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

/* 캠페인 목록 */
.campaigns-list {
  margin-bottom: 32px;
}

.campaign-card {
  display: flex;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
  background-color: white;
  transition: all 0.2s;
}

.campaign-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.campaign-image {
  position: relative;
  width: 240px;
  height: 160px;
  flex-shrink: 0;
}

.campaign-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.campaign-status {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.campaign-status.pending {
  background-color: #FFF3E0;
  color: #FF9800;
}

.campaign-status.selected {
  background-color: #E0F7FA;
  color: #00BCD4;
}

.campaign-status.inReview {
  background-color: #E8F5E9;
  color: #4CAF50;
}

.campaign-status.completed {
  background-color: #EFEBE9;
  color: #795548;
}

.campaign-status.rejected {
  background-color: #FFEBEE;
  color: #F44336;
}

.campaign-info {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.campaign-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.campaign-category {
  font-size: 13px;
  color: #757575;
  background-color: #F5F5F5;
  padding: 4px 8px;
  border-radius: 4px;
}

.campaign-date {
  font-size: 13px;
  color: #9E9E9E;
}

.campaign-title {
  font-size: 18px;
  font-weight: 600;
  color: #424242;
  margin: 0 0 12px 0;
  flex-grow: 1;
}

.campaign-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #757575;
}

.meta-item svg {
  margin-right: 4px;
}

.campaign-actions {
  width: 140px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  border-left: 1px solid #F0F0F0;
}

.action-button {
  width: 100%;
  padding: 8px 0;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.delivery-btn {
  background-color: #229799;
  color: white;
  border: none;
}

.delivery-btn:hover {
  background-color: #1b7a7b;
}

.review-btn {
  background-color: #48CFCB;
  color: white;
  border: none;
}

.review-btn:hover {
  background-color: #3bb9b5;
}

.cancel-btn {
  background-color: white;
  color: #F44336;
  border: 1px solid #F44336;
}

.cancel-btn:hover {
  background-color: #FFEBEE;
}

.detail-btn {
  background-color: white;
  color: #424242;
  border: 1px solid #E0E0E0;
}

.detail-btn:hover {
  background-color: #F5F5F5;
}

/* 내용 없음 표시 */
.no-campaigns {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: #9E9E9E;
}

.no-content-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.no-content-text {
  font-size: 16px;
}

/* 페이지네이션 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.pagination-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  background-color: white;
  color: #757575;
  cursor: pointer;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  background-color: white;
  color: #424242;
  font-size: 14px;
  cursor: pointer;
}

.page-number.active {
  background-color: #229799;
  color: white;
  border-color: #229799;
}

/* 모달 스타일 */
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
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #E0E0E0;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #424242;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #E0E0E0;
}

.modal-cancel-btn {
  padding: 10px 20px;
  border: 1px solid #E0E0E0;
  background-color: white;
  border-radius: 4px;
  color: #757575;
  font-weight: 500;
  cursor: pointer;
}

.modal-save-btn {
  padding: 10px 20px;
  border: none;
  background-color: #229799;
  color: white;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
}

.modal-save-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* 배송정보 폼 */
.form-group {
  margin-bottom: 16px;
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

.form-input {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  font-size: 14px;
}

.zipcode-group {
  display: flex;
  gap: 8px;
}

.zipcode-input {
  width: 120px;
}

.zipcode-btn {
  padding: 10px 16px;
  background-color: #F5F5F5;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  color: #424242;
  font-size: 14px;
  cursor: pointer;
}

/* 반응형 스타일 */
@media (max-width: 1200px) {
  .apply-content {
    padding: 24px;
  }
}

@media (max-width: 900px) {
  .filter-section {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .filter-tabs {
    overflow-x: auto;
    padding-bottom: 8px;
  }
  
  .search-box {
    width: 100%;
  }
  
  .campaign-card {
    flex-direction: column;
  }
  
  .campaign-image {
    width: 100%;
    height: 180px;
  }
  
  .campaign-actions {
    width: 100%;
    flex-direction: row;
    border-left: none;
    border-top: 1px solid #F0F0F0;
    padding: 12px 16px;
  }
  
  .action-button {
    flex: 1;
  }
}

@media (max-width: 600px) {
  .campaign-meta {
    flex-direction: column;
    gap: 6px;
  }
  
  .campaign-actions {
    flex-wrap: wrap;
  }
  
  .action-button {
    flex: 0 0 calc(50% - 4px);
  }
}
</style>
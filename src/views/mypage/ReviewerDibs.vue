<template>
    <div class="reviewer-dibs">
      <div class="page-layout">
        <!-- 왼쪽 사이드바 -->
        <ReviewerSidebar />
        
        <!-- 메인 콘텐츠 영역 -->
        <div class="dibs-content">
          <!-- 페이지 헤더 -->
          <div class="page-header">
            <h1 class="page-title">찜한 캠페인</h1>
          </div>
  
          <!-- 필터 및 검색 영역 -->
          <div class="filter-section">
            <div class="filter-controls">
              <div class="category-filter">
                <select v-model="categoryFilter" class="filter-select">
                  <option value="all">전체 카테고리</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
              <div class="status-filter">
                <select v-model="statusFilter" class="filter-select">
                  <option value="all">전체 상태</option>
                  <option value="recruiting">모집중</option>
                  <option value="upcoming">모집예정</option>
                  <option value="closed">모집마감</option>
                </select>
              </div>
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
  
          <!-- 캠페인 카드 그리드 -->
          <div class="dibs-grid">
            <div v-if="filteredCampaigns.length === 0" class="no-campaigns">
              <div class="no-content-icon">❤️</div>
              <p class="no-content-text">찜한 캠페인이 없습니다.</p>
              <button class="go-campaign-btn" @click="goToCampaignList">캠페인 둘러보기</button>
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
                <button class="remove-dibs-btn" @click="removeDibs(campaign.id)" title="찜 해제">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.5 12.572L12 20L4.5 12.572C4.0216 12.0908 3.65661 11.5101 3.43228 10.8724C3.20795 10.2346 3.1298 9.55526 3.20313 8.88328C3.27645 8.21131 3.49876 7.56418 3.85585 6.99098C4.21294 6.41778 4.69413 5.93628 5.26748 5.57883C5.84084 5.22138 6.48823 4.99865 7.16053 4.92485C7.83282 4.85106 8.51253 4.92871 9.15072 5.15257C9.78891 5.37644 10.3702 5.74103 10.852 6.21909C11.3338 6.69715 11.7229 7.28145 11.9887 7.927L12 8L12.0113 7.927C12.2771 7.28145 12.6662 6.69715 13.148 6.21909C13.6298 5.74103 14.2111 5.37644 14.8493 5.15257C15.4875 4.92871 16.1672 4.85106 16.8395 4.92485C17.5118 4.99865 18.1592 5.22138 18.7325 5.57883C19.3059 5.93628 19.7871 6.41778 20.1442 6.99098C20.5012 7.56418 20.7236 8.21131 20.7969 8.88328C20.8702 9.55526 20.7921 10.2346 20.5677 10.8724C20.3434 11.5101 19.9784 12.0908 19.5 12.572Z" fill="#F44336" stroke="#F44336" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
  
              <!-- 캠페인 정보 -->
              <div class="campaign-info">
                <div class="campaign-header">
                  <div class="campaign-category">{{ campaign.category }}</div>
                  <div class="campaign-dday" :class="{'urgent': isDdayUrgent(campaign.dday)}">
                    {{ formatDday(campaign.dday) }}
                  </div>
                </div>
                <h3 class="campaign-title" @click="showCampaignDetail(campaign.id)">{{ campaign.title }}</h3>
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
                      <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#757575" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#757575" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#757575" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#757575" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>모집인원: {{ campaign.recruitmentCount }}명</span>
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
                
                <!-- 캠페인 액션 영역 -->
                <div class="campaign-actions">
                  <button 
                    v-if="campaign.status === 'recruiting'"
                    class="action-button apply-btn"
                    @click="applyCampaign(campaign.id)"
                  >
                    지금 신청하기
                  </button>
                  <button 
                    v-if="campaign.status === 'upcoming'"
                    class="action-button notify-btn"
                    @click="setNotification(campaign.id)"
                  >
                    알림 설정하기
                  </button>
                  <button 
                    class="action-button detail-btn"
                    @click="showCampaignDetail(campaign.id)"
                  >
                    상세보기
                  </button>
                </div>
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
      
      <!-- 알림 설정 모달 -->
      <div class="modal-overlay" v-if="showNotificationModal" @click="closeNotificationModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">알림 설정</h3>
            <button class="close-btn" @click="closeNotificationModal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6 6L18 18" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="notification-info">
              <p class="notification-campaign-title">{{ selectedCampaign?.title }}</p>
              <p class="notification-desc">해당 캠페인이 모집을 시작하면 알림을 받으시겠습니까?</p>
            </div>
            <div class="notification-options">
              <label class="notification-option">
                <input type="checkbox" v-model="notificationOptions.email">
                <span class="option-text">이메일 알림</span>
              </label>
              <label class="notification-option">
                <input type="checkbox" v-model="notificationOptions.sms">
                <span class="option-text">SMS 알림</span>
              </label>
              <label class="notification-option">
                <input type="checkbox" v-model="notificationOptions.push">
                <span class="option-text">앱 푸시 알림</span>
              </label>
            </div>
          </div>
          <div class="modal-footer">
            <button class="modal-cancel-btn" @click="closeNotificationModal">취소</button>
            <button class="modal-save-btn" @click="saveNotification" :disabled="!isNotificationValid">설정하기</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import ReviewerSidebar from '@/components/ReviewerSidebar.vue';
  
  export default {
    name: 'ReviewerDibs',
    components: {
      ReviewerSidebar
    },
    data() {
      return {
        // 필터링
        categoryFilter: 'all',
        statusFilter: 'all',
        searchKeyword: '',
        
        // 현재 페이지
        currentPage: 1,
        
        // 페이지당 아이템 수
        itemsPerPage: 6,
        
        // 알림 설정 모달
        showNotificationModal: false,
        selectedCampaignId: null,
        notificationOptions: {
          email: true,
          sms: false,
          push: false
        },
        
        // 카테고리 목록
        categories: [
          { id: 1, name: '뷰티' },
          { id: 2, name: '푸드' },
          { id: 3, name: '패션' },
          { id: 4, name: '디지털' },
          { id: 5, name: '생활용품' },
          { id: 6, name: '육아' },
          { id: 7, name: '반려동물' },
          { id: 8, name: '도서' },
          { id: 9, name: '여행' },
          { id: 10, name: '건강' },
          { id: 11, name: '인테리어' },
          { id: 12, name: '스포츠' }
        ],
        
        // 찜한 캠페인 데이터
        dibsCampaigns: [
          {
            id: 1,
            title: "봄맞이 유기농 스킨케어 제품 체험단",
            category: "뷰티",
            imageUrl: "/api/placeholder/300/180",
            status: "recruiting",
            dday: 5, // 마감 D-day
            recruitmentPeriod: "2025.04.20 ~ 2025.04.30",
            recruitmentCount: 30,
            benefits: "제품 제공 + 리뷰비 5만원",
            dibsDate: new Date(2025, 3, 18)
          },
          {
            id: 2,
            title: "프리미엄 와인 시음회 체험단",
            category: "푸드",
            imageUrl: "/api/placeholder/300/180",
            status: "recruiting",
            dday: 2,
            recruitmentPeriod: "2025.04.15 ~ 2025.04.27",
            recruitmentCount: 10,
            benefits: "와인 2병 제공 + 리뷰비 8만원",
            dibsDate: new Date(2025, 3, 16)
          },
          {
            id: 3,
            title: "신세대 스마트워치 체험단",
            category: "디지털",
            imageUrl: "/api/placeholder/300/180",
            status: "upcoming",
            dday: -5, // 시작까지 남은 일수 (음수는 시작 전)
            recruitmentPeriod: "2025.04.30 ~ 2025.05.10",
            recruitmentCount: 5,
            benefits: "제품 제공 + 리뷰비 15만원",
            dibsDate: new Date(2025, 3, 14)
          },
          {
            id: 4,
            title: "친환경 주방용품 체험단",
            category: "생활용품",
            imageUrl: "/api/placeholder/300/180",
            status: "recruiting",
            dday: 7,
            recruitmentPeriod: "2025.04.20 ~ 2025.05.02",
            recruitmentCount: 20,
            benefits: "제품 세트 제공 + 리뷰비 4만원",
            dibsDate: new Date(2025, 3, 12)
          },
          {
            id: 5,
            title: "가정의 달 특별 케이크 체험단",
            category: "푸드",
            imageUrl: "/api/placeholder/300/180",
            status: "upcoming",
            dday: -10,
            recruitmentPeriod: "2025.05.01 ~ 2025.05.10",
            recruitmentCount: 15,
            benefits: "케이크 2종 제공 + 리뷰비 3만원",
            dibsDate: new Date(2025, 3, 10)
          },
          {
            id: 6,
            title: "프리미엄 반려견 간식 체험단",
            category: "반려동물",
            imageUrl: "/api/placeholder/300/180",
            status: "closed",
            dday: 0,
            recruitmentPeriod: "2025.04.01 ~ 2025.04.15",
            recruitmentCount: 25,
            benefits: "제품 세트 제공 + 리뷰비 3만원",
            dibsDate: new Date(2025, 3, 5)
          },
          {
            id: 7,
            title: "봄 신상 데님 의류 체험단",
            category: "패션",
            imageUrl: "/api/placeholder/300/180",
            status: "recruiting",
            dday: 3,
            recruitmentPeriod: "2025.04.15 ~ 2025.04.28",
            recruitmentCount: 10,
            benefits: "의류 1벌 제공 + 리뷰비 6만원",
            dibsDate: new Date(2025, 3, 14)
          },
          {
            id: 8,
            title: "캠핑용 가전제품 체험단",
            category: "생활용품",
            imageUrl: "/api/placeholder/300/180",
            status: "upcoming",
            dday: -3,
            recruitmentPeriod: "2025.04.28 ~ 2025.05.10",
            recruitmentCount: 8,
            benefits: "제품 제공 + 리뷰비 10만원",
            dibsDate: new Date(2025, 3, 13)
          },
          {
            id: 9,
            title: "힐링 아로마 테라피 체험단",
            category: "건강",
            imageUrl: "/api/placeholder/300/180",
            status: "closed",
            dday: 0,
            recruitmentPeriod: "2025.04.05 ~ 2025.04.20",
            recruitmentCount: 30,
            benefits: "제품 세트 제공 + 리뷰비 4만원",
            dibsDate: new Date(2025, 3, 8)
          }
        ]
      }
    },
    computed: {
      // 선택된 캠페인 정보
      selectedCampaign() {
        return this.dibsCampaigns.find(campaign => campaign.id === this.selectedCampaignId);
      },
      
      // 필터링된 캠페인
      filteredCampaigns() {
        // 카테고리 필터링
        let filtered = this.dibsCampaigns;
        if (this.categoryFilter !== 'all') {
          filtered = filtered.filter(campaign => {
            const categoryObj = this.categories.find(cat => cat.name === campaign.category);
            return categoryObj && categoryObj.id === this.categoryFilter;
          });
        }
        
        // 상태 필터링
        if (this.statusFilter !== 'all') {
          filtered = filtered.filter(campaign => campaign.status === this.statusFilter);
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
        let filtered = this.dibsCampaigns;
        if (this.categoryFilter !== 'all') {
          filtered = filtered.filter(campaign => {
            const categoryObj = this.categories.find(cat => cat.name === campaign.category);
            return categoryObj && categoryObj.id === this.categoryFilter;
          });
        }
        
        if (this.statusFilter !== 'all') {
          filtered = filtered.filter(campaign => campaign.status === this.statusFilter);
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
      
      // 알림 설정 유효성 검사
      isNotificationValid() {
        return this.notificationOptions.email || 
               this.notificationOptions.sms || 
               this.notificationOptions.push;
      }
    },
    methods: {
      // D-day 포맷팅
      formatDday(dday) {
        if (dday > 0) {
          return `마감 D-${dday}`;
        } else if (dday < 0) {
          return `시작 D-${Math.abs(dday)}`;
        } else {
          return '오늘 마감';
        }
      },
      
      // D-day가 긴급한지 확인 (3일 이하)
      isDdayUrgent(dday) {
        return dday >= 0 && dday <= 3;
      },
      
      // 상태 텍스트 반환
      getStatusText(status) {
        const statusMap = {
          'recruiting': '모집중',
          'upcoming': '모집예정',
          'closed': '모집마감'
        };
        return statusMap[status] || status;
      },
      
      // 찜 해제
      removeDibs(campaignId) {
        if (confirm('찜한 캠페인에서 삭제하시겠습니까?')) {
          // 실제로는 API 호출하여 삭제 처리
          const campaignIndex = this.dibsCampaigns.findIndex(c => c.id === campaignId);
          if (campaignIndex !== -1) {
            this.dibsCampaigns.splice(campaignIndex, 1);
            alert('찜한 캠페인에서 삭제되었습니다.');
          }
        }
      },
      
      // 알림 설정 모달 열기
      setNotification(campaignId) {
        this.selectedCampaignId = campaignId;
        this.showNotificationModal = true;
      },
      
      // 알림 설정 모달 닫기
      closeNotificationModal() {
        this.showNotificationModal = false;
        this.selectedCampaignId = null;
        // 옵션 초기화
        this.notificationOptions = {
          email: true,
          sms: false,
          push: false
        };
      },
      
      // 알림 설정 저장
      saveNotification() {
        if (!this.isNotificationValid) return;
        
        // 실제로는 API 호출하여 알림 설정 저장
        alert('알림이 설정되었습니다.');
        this.closeNotificationModal();
      },
      
      // 캠페인 신청
      applyCampaign(campaignId) {
        // 실제로는 라우팅으로 구현
        alert(`캠페인 신청 페이지로 이동합니다. 캠페인 ID: ${campaignId}`);
        // this.$router.push(`/reviewer/campaign/apply/${campaignId}`);
      },
      
      // 캠페인 상세 보기
      showCampaignDetail(campaignId) {
        // 실제로는 라우팅으로 구현
        alert(`캠페인 상세 페이지로 이동합니다. 캠페인 ID: ${campaignId}`);
        // this.$router.push(`/reviewer/campaign/${campaignId}`);
      },
      
      // 캠페인 목록 페이지로 이동
      goToCampaignList() {
        // 실제로는 라우팅으로 구현
        alert('캠페인 목록 페이지로 이동합니다.');
        // this.$router.push('/reviewer/campaigns');
      }
    },
    watch: {
      // 필터 변경 시 페이지 초기화
      categoryFilter() {
        this.currentPage = 1;
      },
      statusFilter() {
        this.currentPage = 1;
      },
      searchKeyword() {
        this.currentPage = 1;
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

.reviewer-dibs {
  background-color: #FFFFFF;
  min-height: 100vh;
}

.page-layout {
  display: flex;
  max-width: 1280px;
  margin: 0 auto;
}

.dibs-content {
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

.filter-controls {
  display: flex;
  gap: 12px;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #E0E0E0;
  border-radius: 6px;
  font-size: 14px;
  color: #424242;
  background-color: white;
  cursor: pointer;
  min-width: 140px;
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

/* 캠페인 카드 그리드 */
.dibs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.campaign-card {
  border: 1px solid #E0E0E0;
  border-radius: 12px;
  overflow: hidden;
  background-color: white;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.campaign-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
}

.campaign-image {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.campaign-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.campaign-card:hover .campaign-image img {
  transform: scale(1.05);
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

.campaign-status.recruiting {
  background-color: #E0F7FA;
  color: #00BCD4;
}

.campaign-status.upcoming {
  background-color: #EDE7F6;
  color: #673AB7;
}

.campaign-status.closed {
  background-color: #EFEBE9;
  color: #795548;
}

.remove-dibs-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s;
}

.campaign-card:hover .remove-dibs-btn {
  opacity: 1;
}

.campaign-info {
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.campaign-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.campaign-category {
  font-size: 13px;
  color: #757575;
  background-color: #F5F5F5;
  padding: 4px 8px;
  border-radius: 4px;
}

.campaign-dday {
  font-size: 13px;
  font-weight: 500;
  color: #757575;
}

.campaign-dday.urgent {
  color: #F44336;
}

.campaign-title {
  font-size: 16px;
  font-weight: 600;
  color: #424242;
  margin: 0 0 12px 0;
  line-height: 1.4;
  cursor: pointer;
  transition: color 0.2s;
}

.campaign-title:hover {
  color: #229799;
}

.campaign-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #757575;
}

.meta-item svg {
  margin-right: 6px;
  flex-shrink: 0;
}

.campaign-actions {
  margin-top: auto;
  display: flex;
  gap: 8px;
}

.action-button {
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  flex: 1;
}

.apply-btn {
  background-color: #229799;
  color: white;
  border: none;
}

.apply-btn:hover {
  background-color: #1b7a7b;
}

.notify-btn {
  background-color: #48CFCB;
  color: white;
  border: none;
}

.notify-btn:hover {
  background-color: #3bb9b5;
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
  grid-column: 1 / -1;
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
  margin-bottom: 24px;
}

.go-campaign-btn {
  padding: 10px 20px;
  background-color: #229799;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.go-campaign-btn:hover {
  background-color: #1b7a7b;
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
  border-radius: 12px;
  width: 440px;
  max-width: 90%;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
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

.notification-info {
  margin-bottom: 24px;
}

.notification-campaign-title {
  font-size: 16px;
  font-weight: 600;
  color: #424242;
  margin: 0 0 8px 0;
}

.notification-desc {
  font-size: 14px;
  color: #757575;
  margin: 0;
  line-height: 1.5;
}

.notification-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.notification-option {
  display: flex;
  align-items: center;
  font-size: 15px;
  color: #424242;
  cursor: pointer;
}

.notification-option input[type="checkbox"] {
  margin-right: 10px;
  width: 18px;
  height: 18px;
  accent-color: #229799;
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
  border-radius: 6px;
  color: #757575;
  font-weight: 500;
  cursor: pointer;
}

.modal-save-btn {
  padding: 10px 20px;
  border: none;
  background-color: #229799;
  color: white;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
}

.modal-save-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* 반응형 스타일 */
@media (max-width: 1200px) {
  .dibs-content {
    padding: 24px;
  }
  
  .dibs-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .filter-section {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .filter-controls {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
  }
  
  .search-box {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .dibs-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-controls {
    grid-template-columns: 1fr;
  }
  
  .campaign-actions {
    flex-direction: column;
  }
}
</style>
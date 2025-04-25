<!-- ClosingSoonCampaign.vue -->
<template>
    <div class="closing-soon-section">
      <div class="section-header">
        <h2 class="section-title"><span class="highlight">마감 임박</span> 캠페인</h2>
        <div class="navigation-buttons">
          <button class="nav-button prev" @click="scrollLeft" aria-label="이전">
            <i class="arrow left"></i>
          </button>
          <button class="nav-button next" @click="scrollRight" aria-label="다음">
            <i class="arrow right"></i>
          </button>
        </div>
      </div>
      
      <div class="carousel-container" ref="carouselContainer">
        <div class="carousel-track">
          <div v-for="campaign in closingSoonCampaigns" :key="campaign.id" class="carousel-item">
            <!-- 캠페인 카드 컴포넌트 사용 -->
            <CampaignCard :campaign="campaign" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import CampaignCard from '@/components/campaign/CampaignCard.vue'
  
  export default {
    name: 'ClosingSoonCampaign',
    components: {
      CampaignCard
    },
    data() {
      return {
        closingSoonCampaigns: [
          {
            id: 1,
            imageUrl: 'https://example.com/images/chicken.jpg',
            channel: 'blog',
            category: '마감 임박',
            location: null,
            points: null,
            title: '[잇미이트] 크리스피 닭가슴살',
            subtitle: '닭가슴살 10팩',
            locationCode: 'D-1',
            applicants: 1671,
            quota: '10명'
          },
          {
            id: 2,
            imageUrl: 'https://example.com/images/cosmetics.jpg',
            channel: 'instagram',
            category: '마감 임박',
            location: null,
            points: 30000,
            title: '[라로슈포제] 시카플라스트 크림',
            subtitle: '화장품 체험단',
            locationCode: 'D-1',
            applicants: 1282,
            quota: '3명'
          },
          {
            id: 3,
            imageUrl: 'https://example.com/images/coffee.jpg',
            channel: 'blog',
            category: '마감 임박',
            location: null,
            points: 15000,
            title: '[스타벅스] 시즌 한정 음료 체험단',
            subtitle: '음료 체험권',
            locationCode: 'D-1',
            applicants: 1198,
            quota: '15명'
          },
          {
            id: 4,
            imageUrl: 'https://example.com/images/bedding.jpg',
            channel: 'blog',
            category: '마감 임박',
            location: null,
            points: 206100,
            title: '[프레쉬파인드] 모달인견 차렵이불세트',
            subtitle: '리뷰 포인트',
            locationCode: 'D-1',
            applicants: 1474,
            quota: '10명'
          },
          {
            id: 5,
            imageUrl: 'https://example.com/images/cosmetics2.jpg',
            channel: 'instagram',
            category: '마감 임박',
            location: null,
            points: 25000,
            title: '[아베다] 헤어케어 세트 체험단',
            subtitle: '헤어케어 3종 세트',
            locationCode: 'D-1',
            applicants: 962,
            quota: '5명'
          },
          {
            id: 6,
            imageUrl: 'https://example.com/images/bakery.jpg',
            channel: 'blog',
            category: '마감 임박',
            location: '서울',
            points: null,
            title: '[뚜레쥬르] 신제품 베이커리 체험단',
            subtitle: '베이커리 세트',
            locationCode: 'D-1',
            applicants: 845,
            quota: '8명'
          },
          {
            id: 7,
            imageUrl: 'https://example.com/images/facial.jpg',
            channel: 'instagram',
            category: '마감 임박',
            location: '강남',
            points: 50000,
            title: '[에스테틱] 프리미엄 페이셜 체험단',
            subtitle: '페이셜 1회 체험권',
            locationCode: 'D-1',
            applicants: 723,
            quota: '3명'
          },
          {
            id: 8,
            imageUrl: 'https://example.com/images/vitamin.jpg',
            channel: 'blog',
            category: '마감 임박',
            location: null,
            points: 18000,
            title: '[종근당] 비타민 서포터즈',
            subtitle: '비타민 3종 세트',
            locationCode: 'D-1',
            applicants: 652,
            quota: '10명'
          }
        ],
        scrollAmount: 240 // 한 번에 스크롤할 픽셀 양
      }
    },
    methods: {
      scrollLeft() {
        if (this.$refs.carouselContainer) {
          this.$refs.carouselContainer.scrollBy({
            left: -this.scrollAmount,
            behavior: 'smooth'
          });
        }
      },
      scrollRight() {
        if (this.$refs.carouselContainer) {
          this.$refs.carouselContainer.scrollBy({
            left: this.scrollAmount,
            behavior: 'smooth'
          });
        }
      }
    }
  }
  </script>
  
  <style scoped>
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
  
  .closing-soon-section {
    font-family: 'Pretendard', sans-serif;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px 0 40px;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }
  
  .section-title {
    font-size: 24px;
    font-weight: 600;
    color: #424242;
    margin: 0;
  }
  
  .navigation-buttons {
    display: flex;
    gap: 8px;
  }
  
  .nav-button {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid #E0E0E0;
    background-color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .nav-button:hover {
    background-color: #F5F5F5;
  }
  
  .arrow {
    border: solid #666;
    border-width: 0 2px 2px 0;
    display: inline-block;
    padding: 3px;
  }
  
  .left {
    transform: rotate(135deg);
  }
  
  .right {
    transform: rotate(-45deg);
  }
  
  .carousel-container {
    width: 100%;
    overflow-x: auto;
    scrollbar-width: none; /* Firefox에서 스크롤바 숨기기 */
    -ms-overflow-style: none; /* IE/Edge에서 스크롤바 숨기기 */
  }
  
  .carousel-container::-webkit-scrollbar {
    display: none; /* Chrome, Safari에서 스크롤바 숨기기 */
  }
  
  .carousel-track {
    display: flex;
    gap: 24px;
    padding: 4px 0; /* 그림자를 위한 패딩 */
  }
  
  .carousel-item {
    flex: 0 0 auto;
    width: 220px; /* 카드 너비 */
  }
  .highlight {
  color: #48CFCB; /* 브랜드 컬러 */
  font-weight: 700;
  position: relative;
}
  
  @media (max-width: 768px) {
    .section-title {
      font-size: 20px;
    }
    
    .carousel-item {
      width: 180px; /* 작은 화면에서 카드 너비 축소 */
    }
    
    .scrollAmount {
      width: 180px; /* 작은 화면에서 스크롤 양 조정 */
    }
  }
  </style>
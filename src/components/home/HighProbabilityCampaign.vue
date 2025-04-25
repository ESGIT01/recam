<!-- HighProbabilityCampaign.vue -->
<template>
    <div class="high-probability-section">
      <div class="section-header">
        <h2 class="section-title"><span class="highlight">선정 확률</span> 높은 캠페인</h2>
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
          <div v-for="campaign in highProbabilityCampaigns" :key="campaign.id" class="carousel-item">
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
    name: 'HighProbabilityCampaign',
    components: {
      CampaignCard
    },
    data() {
      return {
        highProbabilityCampaigns: [
          {
            id: 1,
            imageUrl: 'https://example.com/images/bookstore.jpg',
            channel: 'blog',
            category: '선정확률 높음',
            location: '전국',
            points: null,
            title: '[교보문고] 신간 도서 서평단',
            subtitle: '도서 증정',
            locationCode: 'D-5',
            applicants: 7,
            quota: '20명'
          },
          {
            id: 2,
            imageUrl: 'https://example.com/images/cheese.jpg',
            channel: 'instagram',
            category: '선정확률 높음',
            location: null,
            points: 20000,
            title: '[매일유업] 슬라이스 치즈 체험단',
            subtitle: '치즈 세트',
            locationCode: 'D-3',
            applicants: 12,
            quota: '30명'
          },
          {
            id: 3,
            imageUrl: 'https://example.com/images/cinema.jpg',
            channel: 'blog',
            category: '선정확률 높음',
            location: '서울',
            points: 10000,
            title: '[CGV] 신작 영화 시사회',
            subtitle: '2인 관람권',
            locationCode: 'D-2',
            applicants: 25,
            quota: '50명'
          },
          {
            id: 4,
            imageUrl: 'https://example.com/images/cleanser.jpg',
            channel: 'blog',
            category: '선정확률 높음',
            location: null,
            points: 15000,
            title: '[아이소이] 클렌저 체험단',
            subtitle: '클렌저 1종',
            locationCode: 'D-4',
            applicants: 18,
            quota: '40명'
          },
          {
            id: 5,
            imageUrl: 'https://example.com/images/pizza.jpg',
            channel: 'instagram',
            category: '선정확률 높음',
            location: '전국',
            points: null,
            title: '[도미노피자] 신메뉴 시식단',
            subtitle: '피자 기프티콘',
            locationCode: 'D-3',
            applicants: 32,
            quota: '100명'
          },
          {
            id: 6,
            imageUrl: 'https://example.com/images/cafe.jpg',
            channel: 'blog',
            category: '선정확률 높음',
            location: '서울',
            points: 8000,
            title: '[폴바셋] 신규 카페 방문 체험단',
            subtitle: '음료 2잔 + 디저트',
            locationCode: 'D-4',
            applicants: 15,
            quota: '30명'
          },
          {
            id: 7,
            imageUrl: 'https://example.com/images/perfume.jpg',
            channel: 'instagram',
            category: '선정확률 높음',
            location: null,
            points: 35000,
            title: '[조말론] 신상 향수 체험단',
            subtitle: '미니 퍼퓸 2종',
            locationCode: 'D-3',
            applicants: 28,
            quota: '60명'
          },
          {
            id: 8,
            imageUrl: 'https://example.com/images/yogurt.jpg',
            channel: 'blog',
            category: '선정확률 높음',
            location: null,
            points: 12000,
            title: '[빙그레] 요거트 신제품 체험단',
            subtitle: '요거트 6종 세트',
            locationCode: 'D-3',
            applicants: 20,
            quota: '50명'
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
  
  .high-probability-section {
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
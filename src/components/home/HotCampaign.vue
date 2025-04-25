<!-- HotCampaignGrid.vue -->
<template>
  <div class="hot-campaigns-section">
    <h2 class="section-title">지금 <span class="highlight">인기</span> 캠페인</h2>
    
    <div class="campaigns-grid-wrapper">
      <div class="campaigns-grid">
        <div v-for="campaign in hotCampaigns" :key="campaign.id" class="campaign-item">
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
  name: 'HotCampaignGrid',
  components: {
    CampaignCard
  },
  data() {
    return {
      hotCampaigns: [
        {
          id: 1,
          imageUrl: 'https://example.com/images/chicken.jpg',
          channel: 'blog',
          category: '마감 임박',
          location: null,
          points: null,
          title: '[잇미이트] 크리스피 닭가슴살',
          subtitle: '닭가슴살 10팩',
          locationCode: 'D-2',
          applicants: 1671,
          quota: '10명'
        },
        {
          id: 2,
          imageUrl: 'https://example.com/images/balloon.jpg',
          channel: 'blog',
          category: '2일 남음',
          location: null,
          points: null,
          title: '[마르헨제이] 4월 블루밍세일',
          subtitle: '가방 1개',
          locationCode: 'D-2',
          applicants: 1597,
          quota: '10명'
        },
        {
          id: 3,
          imageUrl: 'https://example.com/images/chicken_sauce.jpg',
          channel: 'blog',
          category: '마감 임박',
          location: '온작',
          points: null,
          title: '[온작] 이영자 매운마늘찜닭픽',
          subtitle: '매운마늘찜닭픽 3팩',
          locationCode: 'D-1',
          applicants: 1541,
          quota: '10명'
        },
        {
          id: 4,
          imageUrl: 'https://example.com/images/bedding.jpg',
          channel: 'both',
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
          imageUrl: 'https://example.com/images/toaster.jpg',
          channel: 'blog',
          category: '2일 남음',
          location: null,
          points: null,
          title: '[올리] 2구팝업 토스트기 OLT03',
          subtitle: '토스트기 1개',
          locationCode: 'D-2',
          applicants: 1508,
          quota: '10명'
        },
        {
          id: 6,
          imageUrl: 'https://example.com/images/hotel.jpg',
          channel: 'blog',
          category: '기자단',
          location: '인플루언서',
          points: 40000,
          title: '[인플루언서] 플러스무인텔',
          subtitle: '서울오빠 40,000P',
          locationCode: 'D-2',
          applicants: 1347,
          quota: '5명'
        },
        {
          id: 7,
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
          id: 8,
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
          id: 9,
          imageUrl: 'https://example.com/images/shoes.jpg',
          channel: 'youtube',
          category: '3일 남음',
          location: null,
          points: 50000,
          title: '[아디다스] 신제품 러닝화 체험단',
          subtitle: '러닝화 1켤레',
          locationCode: 'D-3',
          applicants: 1103,
          quota: '2명'
        },
        {
          id: 10,
          imageUrl: 'https://example.com/images/camping.jpg',
          channel: 'blog',
          category: '4일 남음',
          location: null,
          points: 45000,
          title: '[콜맨] 캠핑 텐트 리뷰어 모집',
          subtitle: '2인용 텐트',
          locationCode: 'D-4',
          applicants: 987,
          quota: '3명'
        }
      ]
    }
  }
}
</script>

<style scoped>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

.hot-campaigns-section {
  font-family: 'Pretendard', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 0 40px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #424242;
  margin-bottom: 24px;
}

/* 인기 부분 하이라이트 스타일 */
.highlight {
  color: #48CFCB; /* 브랜드 컬러 */
  font-weight: 700;
  position: relative;
}

.campaigns-grid-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}

.campaigns-grid {
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 24px;
  width: 100%;
  justify-content: center;
}

/* 반응형 조정 */
@media (max-width: 991px) {
  .campaigns-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .campaigns-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 575px) {
  .campaigns-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.campaign-item {
  position: relative;
  display: flex;
  justify-content: center;
}

.campaign-item > * {
  width: 100%;
}
</style>
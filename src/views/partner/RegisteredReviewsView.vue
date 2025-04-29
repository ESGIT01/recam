<!-- src/views/partner/RegisteredReviewsView.vue -->
<template>
    <div class="registered-reviews-view">
      <div class="page-header">
        <h1 class="page-title">등록된 리뷰</h1>
        <div class="page-description">
          파트너님의 캠페인에 등록된 모든 리뷰를 확인하고 관리할 수 있습니다. 리뷰 활동 통계와 인사이트를 확인해보세요.
        </div>
      </div>
  
      <!-- 통계 카드 섹션 -->
      <div class="stats-cards">
        <review-stats-card
          title="총 리뷰 수"
          :value="totalReviewsCount"
          icon="file-text"
          color="#229799"
        />
        <review-stats-card
          title="이번 달 등록된 리뷰"
          :value="monthlyReviewsCount"
          icon="calendar"
          color="#48CFCB"
          :change="monthlyReviewsChange"
          change-label="지난달 대비"
        />
        <review-stats-card
          title="평균 평점"
          :value="averageRating.toFixed(1)"
          icon="star"
          color="#FFB547"
          suffix="/5.0"
        />
        <review-stats-card
          title="미확인 리뷰"
          :value="unreadReviewsCount"
          icon="alert-circle"
          color="#F97066"
          :is-alert="unreadReviewsCount > 0"
        />
      </div>
  
      <!-- 필터 및 정렬 옵션 -->
      <review-filter-bar
        v-model:search-query="searchQuery"
        v-model:campaign-filter="campaignFilter"
        v-model:channel-filter="channelFilter"
        v-model:date-range="dateRange"
        v-model:sort-option="sortOption"
        :campaigns="campaignOptions"
        @filter-changed="filterReviews"
        @sort-changed="sortReviews"
      />
  
      <!-- 리뷰 그리드 -->
      <div v-if="filteredReviews.length > 0" class="reviews-grid">
        <review-card
          v-for="review in filteredReviews"
          :key="review.id"
          :review="review"
          @view-detail="viewReviewDetail"
          @mark-read="markReviewAsRead"
          @toggle-favorite="toggleFavorite"
        />
      </div>
  
      <!-- 검색 결과 없음 -->
      <div v-else class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p v-if="searchQuery || campaignFilter !== 'all' || channelFilter !== 'all' || dateRange.start || dateRange.end">
          검색 결과가 없습니다. 다른 검색어나 필터를 사용해보세요.
        </p>
        <p v-else>등록된 리뷰가 없습니다. 첫 번째 캠페인을 시작해보세요!</p>
      </div>
  
      <!-- 페이지네이션 -->
      <div v-if="filteredReviews.length > 0" class="pagination">
        <button 
          class="pagination-btn" 
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <span class="pagination-info">{{ currentPage }} / {{ totalPages }}</span>
        <button 
          class="pagination-btn" 
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
  
      <!-- 리뷰 상세 모달 -->
      <review-detail-modal
        v-if="showDetailModal"
        :review="selectedReview"
        @close="closeDetailModal"
        @share="shareReview"
        @download="downloadReviewReport"
        @reply="replyToReview"
      />
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import ReviewStatsCard from '@/components/partner/registeredreviews/ReviewStatsCard.vue';
  import ReviewFilterBar from '@/components/partner/registeredreviews/ReviewFilterBar.vue';
  import ReviewCard from '@/components/partner/registeredreviews/ReviewCard.vue';
  import ReviewDetailModal from '@/components/partner/completedcampaigns/ReviewDetailModal.vue';
  
  export default {
    name: 'RegisteredReviewsView',
    components: {
      ReviewStatsCard,
      ReviewFilterBar,
      ReviewCard,
      ReviewDetailModal
    },
    setup() {
      // 상태 변수
      const searchQuery = ref('');
      const campaignFilter = ref('all');
      const channelFilter = ref('all');
      const dateRange = ref({ start: null, end: null });
      const sortOption = ref('newest');
      const currentPage = ref(1);
      const perPage = ref(12);
      
      // 모달 상태
      const showDetailModal = ref(false);
      const selectedReview = ref(null);
      
      // 샘플 데이터 (실제로는 API에서 가져올 예정)
      const reviews = ref([
        {
          id: 1,
          campaignId: 1,
          campaignTitle: '프리미엄 스킨케어 체험단',
          reviewer: {
            id: 101,
            name: '김리뷰',
            avatar: 'KR',
            channel: '블로그',
            followers: '5.2K'
          },
          platform: '네이버 블로그',
          rating: 4.5,
          content: '피부에 자극없이 부드럽게 발리고 보습력도 좋아요. 특히 향이 너무 좋아서 계속 사용하고 싶어요!',
          images: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
          url: 'https://example.com/review1',
          views: 1240,
          likes: 87,
          comments: 32,
          publishedAt: '2025-04-25T12:30:00',
          isRead: true,
          isFavorite: true,
          stats: {
            engagement: 8.2,
            reach: 3500
          }
        },
        {
          id: 2,
          campaignId: 1,
          campaignTitle: '프리미엄 스킨케어 체험단',
          reviewer: {
            id: 102,
            name: '박인스타',
            avatar: 'PI',
            channel: '인스타그램',
            followers: '12.5K'
          },
          platform: '인스타그램',
          rating: 5.0,
          content: '이 제품 정말 좋아요! 피부가 훨씬 부드러워지고 탄력이 생겼어요. 지인들에게도 추천했답니다.',
          images: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
          url: 'https://example.com/review2',
          views: 3600,
          likes: 450,
          comments: 75,
          publishedAt: '2025-04-26T15:45:00',
          isRead: false,
          isFavorite: false,
          stats: {
            engagement: 12.5,
            reach: 8700
          }
        },
        {
          id: 3,
          campaignId: 2,
          campaignTitle: '비건 레스토랑 방문 체험단',
          reviewer: {
            id: 201,
            name: '맛있는리뷰',
            avatar: '맛리',
            channel: '블로그',
            followers: '8.3K'
          },
          platform: '티스토리',
          rating: 4.0,
          content: '비건이 아니어도 맛있게 즐길 수 있는 레스토랑이었습니다. 특히 비건 버거가 일반 버거와 맛이 비슷해서 놀랐어요!',
          images: ['https://via.placeholder.com/150'],
          url: 'https://example.com/review3',
          views: 2100,
          likes: 165,
          comments: 28,
          publishedAt: '2025-04-20T10:15:00',
          isRead: true,
          isFavorite: false,
          stats: {
            engagement: 9.1,
            reach: 5200
          }
        },
        {
          id: 4,
          campaignId: 2,
          campaignTitle: '비건 레스토랑 방문 체험단',
          reviewer: {
            id: 202,
            name: '푸드스타그램',
            avatar: '푸스',
            channel: '인스타그램',
            followers: '15.8K'
          },
          platform: '인스타그램',
          rating: 4.5,
          content: '채식주의자인 친구와 함께 방문했는데 둘 다 만족했어요! 공간도 예쁘고 음식도 맛있고 가격도 합리적이었습니다.',
          images: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
          url: 'https://example.com/review4',
          views: 4100,
          likes: 520,
          comments: 48,
          publishedAt: '2025-04-22T18:20:00',
          isRead: true,
          isFavorite: true,
          stats: {
            engagement: 13.8,
            reach: 9200
          }
        },
        {
          id: 5,
          campaignId: 3,
          campaignTitle: '신규 유아용품 체험단',
          reviewer: {
            id: 301,
            name: '육아맘',
            avatar: '육맘',
            channel: '블로그',
            followers: '9.7K'
          },
          platform: '네이버 블로그',
          rating: 3.5,
          content: '아이가 좋아하긴 하는데 내구성이 조금 아쉬워요. 하지만 디자인은 정말 예쁘고 크기도 적당해서 휴대하기 좋습니다.',
          images: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
          url: 'https://example.com/review5',
          views: 1850,
          likes: 142,
          comments: 56,
          publishedAt: '2025-04-28T09:10:00',
          isRead: false,
          isFavorite: false,
          stats: {
            engagement: 10.7,
            reach: 5600
          }
        },
        {
          id: 6,
          campaignId: 3,
          campaignTitle: '신규 유아용품 체험단',
          reviewer: {
            id: 302,
            name: '아이랑놀자',
            avatar: '아놀',
            channel: '인스타그램',
            followers: '7.2K'
          },
          platform: '인스타그램',
          rating: 5.0,
          content: '이 장난감 정말 좋아요! 아이가 가지고 노는 시간이 확실히 늘었고, 교육적인 요소도 있어서 더 마음에 듭니다.',
          images: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
          url: 'https://example.com/review6',
          views: 2700,
          likes: 310,
          comments: 28,
          publishedAt: '2025-04-29T11:55:00',
          isRead: false,
          isFavorite: false,
          stats: {
            engagement: 11.2,
            reach: 4800
          }
        }
      ]);
      
      // 필터링된 리뷰 목록
      const filteredReviews = ref([]);
      
      // 페이지네이션을 위한 계산된 속성
      const totalPages = computed(() => {
        if (filteredReviews.value.length === 0) return 1;
        return Math.ceil(filteredReviews.value.length / perPage.value);
      });
      
      // 현재 페이지에 표시될 리뷰
      const paginatedReviews = computed(() => {
        const start = (currentPage.value - 1) * perPage.value;
        const end = start + perPage.value;
        return filteredReviews.value.slice(start, end);
      });
      
      // 캠페인 옵션
      const campaignOptions = computed(() => {
        const campaigns = [];
        const uniqueCampaigns = new Set();
        
        reviews.value.forEach(review => {
          if (!uniqueCampaigns.has(review.campaignId)) {
            uniqueCampaigns.add(review.campaignId);
            campaigns.push({
              id: review.campaignId,
              title: review.campaignTitle
            });
          }
        });
        
        return campaigns;
      });
      
      // 통계 계산
      const totalReviewsCount = computed(() => reviews.value.length);
      
      const monthlyReviewsCount = computed(() => {
        const currentMonth = new Date().getMonth();
        return reviews.value.filter(review => {
          const reviewDate = new Date(review.publishedAt);
          return reviewDate.getMonth() === currentMonth;
        }).length;
      });
      
      const monthlyReviewsChange = computed(() => {
        // 임의의 변화율 (실제로는 이전 달 데이터와 비교해서 계산)
        return 15.8;
      });
      
      const averageRating = computed(() => {
        if (reviews.value.length === 0) return 0;
        const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0);
        return sum / reviews.value.length;
      });
      
      const unreadReviewsCount = computed(() => {
        return reviews.value.filter(review => !review.isRead).length;
      });
      
      // 초기 데이터 로드 및 필터링
      onMounted(() => {
        filterReviews();
      });
      
      // 리뷰 필터링
      const filterReviews = () => {
        let filtered = [...reviews.value];
        
        // 캠페인 필터
        if (campaignFilter.value !== 'all') {
          const campaignId = parseInt(campaignFilter.value);
          filtered = filtered.filter(review => review.campaignId === campaignId);
        }
        
        // 채널 필터
        if (channelFilter.value !== 'all') {
          filtered = filtered.filter(review => review.reviewer.channel === channelFilter.value);
        }
        
        // 날짜 범위 필터
        if (dateRange.value.start) {
          const startDate = new Date(dateRange.value.start);
          filtered = filtered.filter(review => new Date(review.publishedAt) >= startDate);
        }
        
        if (dateRange.value.end) {
          const endDate = new Date(dateRange.value.end);
          endDate.setHours(23, 59, 59, 999); // 종료일 끝까지 포함
          filtered = filtered.filter(review => new Date(review.publishedAt) <= endDate);
        }
        
        // 검색어 필터
        if (searchQuery.value) {
          const query = searchQuery.value.toLowerCase();
          filtered = filtered.filter(review => 
            review.content.toLowerCase().includes(query) || 
            review.reviewer.name.toLowerCase().includes(query) ||
            review.campaignTitle.toLowerCase().includes(query)
          );
        }
        
        // 정렬 적용
        sortReviewsList(filtered);
        
        filteredReviews.value = filtered;
        currentPage.value = 1; // 필터링 후 첫 페이지로 이동
      };
      
      // 리뷰 정렬
      const sortReviews = () => {
        sortReviewsList(filteredReviews.value);
      };
      
      const sortReviewsList = (reviews) => {
        switch (sortOption.value) {
          case 'newest':
            // 최신순
            reviews.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
            break;
          case 'oldest':
            // 오래된순
            reviews.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
            break;
          case 'rating':
            // 평점순
            reviews.sort((a, b) => b.rating - a.rating);
            break;
          case 'engagement':
            // 인게이지먼트순
            reviews.sort((a, b) => b.stats.engagement - a.stats.engagement);
            break;
        }
      };
      
      // 페이지 변경
      const changePage = (page) => {
        if (page < 1 || page > totalPages.value) return;
        currentPage.value = page;
      };
      
      // 리뷰 상세 보기
      const viewReviewDetail = (reviewId) => {
        selectedReview.value = reviews.value.find(r => r.id === reviewId);
        if (selectedReview.value) {
          // 읽음 표시
          const reviewIndex = reviews.value.findIndex(r => r.id === reviewId);
          if (reviewIndex !== -1 && !reviews.value[reviewIndex].isRead) {
            reviews.value[reviewIndex].isRead = true;
          }
          showDetailModal.value = true;
        }
      };
      
      // 상세 모달 닫기
      const closeDetailModal = () => {
        showDetailModal.value = false;
        selectedReview.value = null;
      };
      
      // 리뷰 읽음 표시
      const markReviewAsRead = (reviewId) => {
        const reviewIndex = reviews.value.findIndex(r => r.id === reviewId);
        if (reviewIndex !== -1) {
          reviews.value[reviewIndex].isRead = true;
        }
      };
      
      // 즐겨찾기 토글
      const toggleFavorite = (reviewId) => {
        const reviewIndex = reviews.value.findIndex(r => r.id === reviewId);
        if (reviewIndex !== -1) {
          reviews.value[reviewIndex].isFavorite = !reviews.value[reviewIndex].isFavorite;
        }
      };
      
      // 리뷰 공유
      const shareReview = (reviewId) => {
        console.log(`리뷰 ID ${reviewId} 공유`);
        // 실제 구현에서는 공유 기능 처리
        alert('리뷰 링크가 클립보드에 복사되었습니다.');
      };
      
      // 리뷰 레포트 다운로드
      const downloadReviewReport = (reviewId) => {
        console.log(`리뷰 ID ${reviewId} 레포트 다운로드`);
        // 실제 구현에서는 다운로드 처리
        alert('리뷰 레포트 다운로드를 시작합니다.');
      };
      
      // 리뷰에 답변
      const replyToReview = (reviewId, message) => {
        console.log(`리뷰 ID ${reviewId}에 답변: ${message}`);
        // 실제 구현에서는 API 요청 처리
        alert('답변이 등록되었습니다.');
        closeDetailModal();
      };
      
      return {
        searchQuery,
        campaignFilter,
        channelFilter,
        dateRange,
        sortOption,
        currentPage,
        perPage,
        totalPages,
        showDetailModal,
        selectedReview,
        reviews: paginatedReviews,
        filteredReviews,
        totalReviewsCount,
        monthlyReviewsCount,
        monthlyReviewsChange,
        averageRating,
        unreadReviewsCount,
        campaignOptions,
        filterReviews,
        sortReviews,
        changePage,
        viewReviewDetail,
        closeDetailModal,
        markReviewAsRead,
        toggleFavorite,
        shareReview,
        downloadReviewReport,
        replyToReview
      };
    }
  };
  </script>
  
  <style scoped>
  .registered-reviews-view {
    width: 100%;
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  
  .page-header {
    margin-bottom: 24px;
  }
  
  .page-title {
    font-size: 24px;
    font-weight: 700;
    color: #424242;
    margin: 0 0 8px;
  }
  
  .page-description {
    font-size: 14px;
    color: #64748b;
    margin: 0;
  }
  
  .stats-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin: 24px 0;
  }
  
  .reviews-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-top: 24px;
  }
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 0;
    color: #94a3b8;
  }
  
  .empty-state svg {
    color: #e5e7eb;
    margin-bottom: 20px;
  }
  
  .empty-state p {
    font-size: 16px;
    margin: 0;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 32px;
    gap: 16px;
  }
  
  .pagination-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
    background-color: white;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .pagination-btn:not(:disabled):hover {
    border-color: #229799;
    color: #229799;
  }
  
  .pagination-info {
    font-size: 14px;
    color: #64748b;
  }
  
  @media (max-width: 1200px) {
    .reviews-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 768px) {
    .stats-cards {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .reviews-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>
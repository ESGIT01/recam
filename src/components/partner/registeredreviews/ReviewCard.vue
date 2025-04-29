<!-- src/components/partner/reviews/ReviewCard.vue -->
<template>
    <div class="review-card" :class="{ 'unread': !review.isRead }">
      <div class="review-header">
        <div class="reviewer-info">
          <div class="reviewer-avatar" :class="{ 'unread': !review.isRead }">
            {{ review.reviewer.avatar }}
          </div>
          <div class="reviewer-details">
            <div class="reviewer-name">
              {{ review.reviewer.name }}
              <span class="review-platform">{{ review.platform }}</span>
            </div>
            <div class="reviewer-followers">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              {{ review.reviewer.followers }} 팔로워
            </div>
          </div>
        </div>
        <div class="review-actions">
          <button 
            class="favorite-btn" 
            :class="{ 'favorited': review.isFavorite }"
            @click="$emit('toggle-favorite', review.id)"
            title="즐겨찾기"
          >
            <svg v-if="review.isFavorite" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#FFB547" stroke="#FFB547" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </button>
          <div class="menu-dropdown">
            <button class="menu-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
              </svg>
            </button>
            <div class="dropdown-menu">
              <button @click="$emit('view-detail', review.id)">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                상세 보기
              </button>
              <button @click="copyReviewLink(review.url)">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                링크 복사
              </button>
              <button v-if="!review.isRead" @click="$emit('mark-read', review.id)">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                읽음 표시
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="review-campaign">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
        </svg>
        {{ review.campaignTitle }}
      </div>
      
      <div class="review-rating">
        <span class="rating-label">평점</span>
        <div class="rating-stars">
          <div v-for="i in 5" :key="i" class="star" :class="{ 'filled': i <= Math.floor(review.rating), 'half': i - 0.5 === review.rating }">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <span class="rating-value">{{ review.rating.toFixed(1) }}</span>
        </div>
      </div>
      
      <div class="review-content">
        {{ review.content }}
      </div>
      
      <div v-if="review.images && review.images.length > 0" class="review-images">
        <div
          v-for="(image, index) in displayedImages"
          :key="index"
          class="review-image"
        >
          <img :src="image" alt="Review Image" />
        </div>
        <div v-if="review.images.length > maxDisplayedImages" class="more-images">
          +{{ review.images.length - maxDisplayedImages }}
        </div>
      </div>
      
      <div class="review-meta">
        <div class="review-date">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          {{ formatDate(review.publishedAt) }}
        </div>
        <div class="review-stats">
          <div class="stat-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            {{ formatNumber(review.views) }}
          </div>
          <div class="stat-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            {{ formatNumber(review.likes) }}
          </div>
          <div class="stat-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            {{ formatNumber(review.comments) }}
          </div>
        </div>
      </div>
      
      <div class="review-footer">
        <div class="engagement-rate">
          <div class="engagement-label">인게이지먼트</div>
          <div class="engagement-value" :class="getEngagementClass(review.stats.engagement)">
            {{ review.stats.engagement.toFixed(1) }}%
          </div>
        </div>
        <button 
          class="view-btn"
          @click="$emit('view-detail', review.id)"
        >
          상세보기
        </button>
      </div>
  
      <div v-if="!review.isRead" class="unread-badge">NEW</div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ReviewCard',
    props: {
      review: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        maxDisplayedImages: 3
      };
    },
    computed: {
      displayedImages() {
        return this.review.images.slice(0, this.maxDisplayedImages);
      }
    },
    methods: {
      formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffInHours < 24) {
          return diffInHours === 0 
            ? '방금 전' 
            : `${diffInHours}시간 전`;
        } else if (diffInHours < 48) {
          return '어제';
        } else {
          return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
        }
      },
      formatNumber(num) {
        if (num >= 10000) {
          return (num / 10000).toFixed(1) + '만';
        } else if (num >= 1000) {
          return (num / 1000).toFixed(1) + 'K';
        } else {
          return num.toString();
        }
      },
      getEngagementClass(rate) {
        if (rate >= 10) {
          return 'high';
        } else if (rate >= 5) {
          return 'medium';
        } else {
          return 'low';
        }
      },
      copyReviewLink(url) {
        navigator.clipboard.writeText(url)
          .then(() => {
            alert('링크가 클립보드에 복사되었습니다.');
          })
          .catch(err => {
            console.error('클립보드 복사 실패:', err);
            alert('링크 복사에 실패했습니다.');
          });
      }
    }
  };
  </script>
  
  <style scoped>
  .review-card {
    position: relative;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    border: 1px solid #f1f5f9;
    overflow: hidden;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  
  .review-card:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
  
  .review-card.unread {
    border-left: 3px solid #48CFCB;
  }
  
  .review-header {
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f1f5f9;
  }
  
  .reviewer-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .reviewer-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #229799;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 14px;
  }
  
  .reviewer-avatar.unread {
    background-color: #48CFCB;
  }
  
  .reviewer-details {
    display: flex;
    flex-direction: column;
  }
  
  .reviewer-name {
    font-weight: 600;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .review-platform {
    font-size: 12px;
    font-weight: 400;
    color: #64748b;
    background-color: #F5F5F5;
    padding: 2px 6px;
    border-radius: 4px;
  }
  
  .reviewer-followers {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #64748b;
    margin-top: 2px;
  }
  
  .review-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .favorite-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #94a3b8;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .favorite-btn:hover {
    color: #FFB547;
  }
  
  .menu-dropdown {
    position: relative;
  }
  
  .menu-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #94a3b8;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .menu-btn:hover {
    color: #64748b;
  }
  
  .dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    width: 120px;
    background-color: white;
    border-radius: 6px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 4px;
    z-index: 10;
    display: none;
  }
  
  .menu-dropdown:hover .dropdown-menu {
    display: block;
  }
  
  .dropdown-menu button {
    width: 100%;
    padding: 8px;
    background: none;
    border: none;
    text-align: left;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s;
  }
  
  .dropdown-menu button:hover {
    background-color: #f8fafc;
  }
  
  .review-campaign {
    padding: 0 16px;
    margin-top: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #64748b;
  }
  
  .review-rating {
    padding: 0 16px;
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .rating-label {
    font-size: 12px;
    color: #64748b;
  }
  
  .rating-stars {
    display: flex;
    align-items: center;
    gap: 2px;
  }
  
  .star {
    color: #e5e7eb;
  }
  
  .star.filled {
    color: #FFB547;
  }
  
  .star.half {
    position: relative;
    color: #e5e7eb;
  }
  
  .star.half::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    background-color: #FFB547;
    clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%);
  }
  
  .rating-value {
    margin-left: 4px;
    font-weight: 600;
    font-size: 14px;
    color: #1e293b;
  }
  
  .review-content {
    padding: 16px;
    font-size: 14px;
    color: #1e293b;
    line-height: 1.5;
    max-height: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
  }
  
  .review-images {
    padding: 0 16px 16px;
    display: flex;
    gap: 8px;
  }
  
  .review-image {
    width: 80px;
    height: 80px;
    border-radius: 6px;
    overflow: hidden;
  }
  
  .review-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .more-images {
    width: 80px;
    height: 80px;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 600;
    border-radius: 6px;
  }
  
  .review-meta {
    padding: 12px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #f1f5f9;
    border-bottom: 1px solid #f1f5f9;
  }
  
  .review-date {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #64748b;
  }
  
  .review-stats {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .stat-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #64748b;
  }
  
  .review-footer {
    padding: 12px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .engagement-rate {
    display: flex;
    flex-direction: column;
  }
  
  .engagement-label {
    font-size: 12px;
    color: #64748b;
  }
  
  .engagement-value {
    font-size: 16px;
    font-weight: 600;
  }
  
  .engagement-value.high {
    color: #10b981;
  }
  
  .engagement-value.medium {
    color: #f59e0b;
  }
  
  .engagement-value.low {
    color: #64748b;
  }
  
  .view-btn {
    padding: 6px 12px;
    background-color: #F5F5F5;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 13px;
    color: #424242;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .view-btn:hover {
    background-color: #e5e7eb;
  }
  
  .unread-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background-color: #48CFCB;
    color: white;
    font-size: 10px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 10px;
  }
  
  @media (max-width: 768px) {
    .review-content {
      max-height: 80px;
      -webkit-line-clamp: 3;
    }
    
    .review-image {
      width: 60px;
      height: 60px;
    }
    
    .more-images {
      width: 60px;
      height: 60px;
    }
    
    .review-meta {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
    
    .review-stats {
      width: 100%;
      justify-content: space-between;
    }
  }
  </style>
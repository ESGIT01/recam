<!-- src/components/partner/reviews/ReviewDetailModal.vue -->
<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">리뷰 상세</h3>
        <button class="close-btn" @click="closeModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div class="modal-body">
        <div class="review-info-section">
          <div class="reviewer-profile">
            <div class="reviewer-avatar">{{ review.reviewer.avatar }}</div>
            <div class="reviewer-details">
              <h4 class="reviewer-name">{{ review.reviewer.name }}</h4>
              <div class="reviewer-meta">
                <span class="channel">{{ review.reviewer.channel }}</span>
                <span class="meta-separator">•</span>
                <span class="platform">{{ review.platform }}</span>
                <span class="meta-separator">•</span>
                <span class="followers">팔로워 {{ review.reviewer.followers }}</span>
              </div>
            </div>
            <div v-if="!review.isRead" class="unread-badge">NEW</div>
          </div>
          
          <div class="stats-section">
            <div class="stat-card">
              <div class="stat-value">{{ formatNumber(review.views) }}</div>
              <div class="stat-label">조회수</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ formatNumber(review.likes) }}</div>
              <div class="stat-label">좋아요</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ formatNumber(review.comments) }}</div>
              <div class="stat-label">댓글</div>
            </div>
            <div class="stat-card highlight">
              <div class="stat-value">{{ review.stats.engagement.toFixed(1) }}%</div>
              <div class="stat-label">인게이지먼트</div>
            </div>
          </div>
          
          <div class="campaign-info">
            <div class="info-header">캠페인 정보</div>
            <div class="info-content">
              <div class="campaign-title">{{ review.campaignTitle }}</div>
              <div class="review-date">{{ formatDate(review.publishedAt) }} 등록</div>
            </div>
          </div>
          
          <div class="rating-info">
            <div class="info-header">평점</div>
            <div class="rating-stars">
              <div v-for="i in 5" :key="i" class="star" :class="{ 'filled': i <= Math.floor(review.rating), 'half': i - 0.5 === review.rating }">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <span class="rating-value">{{ review.rating.toFixed(1) }}/5.0</span>
            </div>
          </div>
        </div>
        
        <div class="review-content-section">
          <div class="section-header">
            <h4 class="section-title">리뷰 내용</h4>
            <a :href="review.url" target="_blank" class="external-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              새 창에서 보기
            </a>
          </div>
          
          <div class="review-text">
            {{ review.content }}
          </div>
          
          <div v-if="review.images && review.images.length > 0" class="review-images">
            <div
              v-for="(image, index) in review.images"
              :key="index"
              class="review-image"
            >
              <img :src="image" :alt="`리뷰 이미지 ${index + 1}`" />
            </div>
          </div>
          
          <div class="embed-container">
            <iframe 
              v-if="review.url" 
              :src="review.url" 
              frameborder="0" 
              class="review-iframe"
            ></iframe>
            <div v-else class="embed-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <p>리뷰 미리보기를 불러올 수 없습니다.</p>
              <p>위의 '새 창에서 보기' 버튼을 눌러 리뷰를 확인해주세요.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <div class="reply-section">
          <div class="reply-header">
            <h4 class="reply-title">리뷰 답변</h4>
            <div class="reply-info">리뷰에 감사 인사나 추가 정보를 남겨보세요.</div>
          </div>
          <textarea 
            v-model="replyMessage" 
            placeholder="리뷰어에게 남길 감사 인사나 추가 정보를 입력해주세요."
            rows="4"
          ></textarea>
        </div>
        
        <div class="action-buttons">
          <button class="btn btn-outline" @click="downloadReport">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            리포트 다운로드
          </button>
          <button class="btn btn-outline share-btn" @click="shareReview">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
            리뷰 공유하기
          </button>
          <button class="btn btn-primary" :disabled="!replyMessage" @click="sendReply">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            답변 등록하기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'ReviewDetailModal',
  props: {
    review: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'share', 'download', 'reply'],
  setup(props, { emit }) {
    const replyMessage = ref('');
    
    // 날짜 포맷팅
    const formatDate = (dateString) => {
      if (!dateString) return '아직 등록되지 않음';
      
      const date = new Date(dateString);
      return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    };
    
    // 숫자 포맷팅
    const formatNumber = (num) => {
      if (num >= 10000) {
        return (num / 10000).toFixed(1) + '만';
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
      } else {
        return num.toString();
      }
    };
    
    // 모달 닫기
    const closeModal = () => {
      emit('close');
    };
    
    // 리포트 다운로드
    const downloadReport = () => {
      emit('download', props.review.id);
    };
    
    // 리뷰 공유
    const shareReview = () => {
      emit('share', props.review.id);
    };
    
    // 답변 전송
    const sendReply = () => {
      if (!replyMessage.value.trim()) return;
      
      emit('reply', props.review.id, replyMessage.value);
      replyMessage.value = '';
    };
    
    return {
      replyMessage,
      formatDate,
      formatNumber,
      closeModal,
      downloadReport,
      shareReview,
      sendReply
    };
  }
});
</script>

<style scoped>
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

.modal-container {
  background-color: white;
  border-radius: 12px;
  width: 95%;
  max-width: 800px;
  height: 90vh;
  max-height: 800px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #1e293b;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.review-info-section {
  margin-bottom: 24px;
}

.reviewer-profile {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  position: relative;
}

.reviewer-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #229799;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 18px;
}

.reviewer-details {
  flex: 1;
}

.reviewer-name {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px;
}

.reviewer-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 14px;
  flex-wrap: wrap;
}

.meta-separator {
  color: #cbd5e1;
}

.unread-badge {
  background-color: #48CFCB;
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 12px;
}

.stats-section {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.stat-card {
  flex: 1;
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
}

.stat-card.highlight {
  background-color: #e8f7f6;
  color: #229799;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
}

.campaign-info, .rating-info {
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.info-header {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 8px;
}

.info-content {
  color: #1e293b;
}

.campaign-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.review-date {
  font-size: 14px;
  color: #64748b;
}

.rating-stars {
  display: flex;
  align-items: center;
  gap: 4px;
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
  margin-left: 8px;
  font-weight: 600;
  color: #1e293b;
}

.review-content-section {
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.external-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #3b82f6;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s;
}

.external-link:hover {
  color: #2563eb;
  text-decoration: underline;
}

.review-text {
  font-size: 15px;
  line-height: 1.6;
  color: #1e293b;
  margin-bottom: 20px;
}

.review-images {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
}

.review-image {
  width: 120px;
  height: 120px;
  border-radius: 6px;
  overflow: hidden;
}

.review-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.embed-container {
  height: 300px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.review-iframe {
  width: 100%;
  height: 100%;
}

.embed-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  padding: 20px;
  text-align: center;
}

.embed-placeholder svg {
  color: #e2e8f0;
  margin-bottom: 16px;
}

.embed-placeholder p {
  margin: 4px 0;
  font-size: 14px;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #e5e7eb;
}

.reply-section {
  margin-bottom: 20px;
}

.reply-header {
  margin-bottom: 12px;
}

.reply-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px;
}

.reply-info {
  font-size: 14px;
  color: #64748b;
}

.reply-section textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s;
}

.reply-section textarea:focus {
  outline: none;
  border-color: #229799;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-outline {
  background-color: white;
  color: #64748b;
  border: 1px solid #e5e7eb;
}

.btn-outline:hover:not(:disabled) {
  background-color: #f8fafc;
}

.btn-primary {
  background-color: #229799;
  color: white;
  border: none;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1a7a7c;
}

.share-btn {
  color: #3b82f6;
  border-color: #3b82f6;
}

.share-btn:hover {
  background-color: rgba(59, 130, 246, 0.05);
}

@media (max-width: 768px) {
  .stats-section {
    flex-wrap: wrap;
  }
  
  .stat-card {
    min-width: calc(50% - 6px);
  }
  
  .review-image {
    width: 100px;
    height: 100px;
  }
  
  .embed-container {
    height: 250px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
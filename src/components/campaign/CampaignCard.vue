<!-- CampaignCard.vue -->
<template>
  <div class="campaign-card">
    <!-- 이미지 영역 -->
    <div class="image-container">
      <img :src="campaign.imageUrl" alt="캠페인 이미지" class="campaign-image">
      <!-- 채널 아이콘 (다시 좌측 상단으로) -->
      <div class="channel-icon">
        <span>{{ channelIcon }}</span>
      </div>
    </div>
    
    <!-- 콘텐츠 영역 -->
    <div class="card-content">
      <!-- 카테고리, 위치, 포인트 등 정보 (개선된 배지 스타일) -->
      <div class="info-tags">
        <span v-if="campaign.category" class="info-tag category-tag">{{ campaign.category }}</span>
        <span v-if="campaign.location" class="info-tag location-tag">{{ campaign.location }}</span>
        <span v-if="campaign.points" class="info-tag points-tag">{{ formatPoints(campaign.points) }}</span>
      </div>
      
      <!-- 제목 (한 줄, ... 처리) -->
      <h3 class="title text-ellipsis">{{ campaign.title }}</h3>
      
      <!-- 설명 (한 줄, ... 처리) -->
      <p class="subtitle text-ellipsis">{{ campaign.subtitle }}</p>
      
      <!-- 하단 정보 (개선된 레이아웃) -->
      <div class="bottom-info">
        <div class="left-info">
          <span class="location-code">{{ campaign.locationCode }}</span>
        </div>
        <div class="right-info">
          <div class="applicants">
            <span class="applicant-count">{{ campaign.applicants }}</span>
            <span class="applicant-label">신청</span>
          </div>
          <div class="quota-divider">/</div>
          <div class="quota">{{ campaign.quota }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CampaignCard',
  props: {
    campaign: {
      type: Object,
      required: true
    }
  },
  computed: {
    channelIcon() {
      const channelIcons = {
        blog: 'b',
        instagram: 'i',
        youtube: 'y',
        both: 'b'
      };
      return channelIcons[this.campaign.channel] || 'b';
    }
  },
  methods: {
    formatPoints(points) {
      return points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + 'P';
    }
  }
}
</script>

<style scoped>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

.campaign-card {
  width: 100%;
  max-width: 220px;
  border-radius: 12px;
  overflow: hidden;
  background-color: #FFFFFF;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
  font-family: 'Pretendard', sans-serif;
}

.campaign-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
}

.image-container {
  position: relative;
  width: 100%;
  padding-top: 100%; /* 정사각형 비율 */
}

.campaign-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.channel-icon {
  position: absolute;
  top: 12px;
  left: 12px; /* 다시 좌측 상단으로 이동 */
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #48CFCB;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-content {
  padding: 14px 16px 16px;
}

.info-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.info-tag {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
}

.category-tag {
  background-color: #F2F2F2;
  color: #666666;
}

.location-tag {
  background-color: rgba(34, 151, 153, 0.1);
  color: #229799;
}

.points-tag {
  background-color: rgba(72, 207, 203, 0.1);
  color: #48CFCB;
}

.title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 6px;
  color: #424242;
  line-height: 1.4;
}

.subtitle {
  font-size: 14px;
  color: #48CFCB;
  margin: 0 0 12px;
  line-height: 1.4;
}

.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bottom-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.location-code {
  font-weight: 600;
  color: #666;
  padding: 3px 6px;
  background-color: #F5F5F5;
  border-radius: 4px;
}

.right-info {
  display: flex;
  align-items: center;
  gap: 3px;
  color: #999;
}

.applicants {
  display: flex;
  align-items: center;
  gap: 2px;
}

.applicant-count {
  color: #666;
  font-weight: 500;
}

.applicant-label {
  font-size: 12px;
}

.quota-divider {
  color: #CCC;
  margin: 0 2px;
}

.quota {
  color: #999;
  font-size: 12px;
}
</style>
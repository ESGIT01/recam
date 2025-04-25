<template>
  <div class="reviewer-mypage">
    <div class="page-layout">
      <!-- 왼쪽 사이드바 -->
      <ReviewerSidebar />
      
      <!-- 메인 콘텐츠 영역 -->
      <div class="mypage-content">
        <!-- 페이지 헤더 -->
        <div class="page-header">
          <h1 class="page-title">마이페이지</h1>
        </div>

        <!-- 프로필 요약 카드 -->
        <div class="profile-card">
          <div class="profile-info">
            <div class="profile-avatar">
              <img v-if="profile.avatarUrl" :src="profile.avatarUrl" alt="프로필 이미지" />
              <div v-else class="avatar-placeholder">{{ profile.nickname.charAt(0) }}</div>
            </div>
            <div class="profile-details">
              <h2 class="profile-name">{{ profile.nickname }}</h2>
              <div class="profile-membership">
                <div class="membership-icon diamond">D</div>
                <span>{{ getMembershipName(profile.membershipLevel) }}</span>
              </div>
              <div class="profile-bio">{{ profile.bio || '자기소개가 없습니다.' }}</div>
              <button class="edit-profile-btn">프로필 수정</button>
            </div>
          </div>
        </div>

        <!-- 통계 요약 -->
        <div class="stats-grid">
          <div class="stats-card">
            <div class="stats-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L14.5 9H22L16.5 13.5L19 21L12 17L5 21L7.5 13.5L2 9H9.5L12 2Z" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="stats-info">
              <div class="stats-label">포인트</div>
              <div class="stats-value">{{ formatNumber(profile.points) }} P</div>
            </div>
          </div>

          <div class="stats-card">
            <div class="stats-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M20 8V14" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M23 11H17" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="stats-info">
              <div class="stats-label">다음 등급</div>
              <div class="stats-value">{{ formatNumber(profile.pointsToNextLevel) }} P</div>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: profile.levelProgressPercentage + '%' }"></div>
            </div>
          </div>

          <div class="stats-card">
            <div class="stats-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 7V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V7" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="stats-info">
              <div class="stats-label">캠페인 활동</div>
              <div class="stats-value">{{ profile.completedCampaigns }}회</div>
            </div>
          </div>

          <div class="stats-card">
            <div class="stats-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="stats-info">
              <div class="stats-label">리뷰 작성</div>
              <div class="stats-value">{{ profile.reviewsCount }}개</div>
            </div>
          </div>
        </div>

        <!-- 활동 요약 -->
        <div class="activity-summary">
          <h3 class="section-title">활동 요약</h3>
          <div class="activity-grid">
            <div class="activity-card">
              <div class="activity-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 2V6" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8 2V6" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M3 10H21" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="activity-info">
                <div class="activity-label">이번 달 출석</div>
                <div class="activity-value">{{ profile.attendanceThisMonth }}일</div>
              </div>
            </div>

            <div class="activity-card">
              <div class="activity-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12H18L15 21L9 3L6 12H2" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="activity-info">
                <div class="activity-label">진행 중인 캠페인</div>
                <div class="activity-value">{{ profile.ongoingCampaigns }}개</div>
              </div>
            </div>

            <div class="activity-card">
              <div class="activity-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M22 4L12 14.01L9 11.01" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="activity-info">
                <div class="activity-label">선정률</div>
                <div class="activity-value">{{ profile.selectionRate }}%</div>
              </div>
            </div>

            <div class="activity-card">
              <div class="activity-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8V12" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 16H12.01" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="activity-info">
                <div class="activity-label">페널티</div>
                <div class="activity-value">{{ profile.penalties }}회</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 최근 캠페인 -->
        <div class="recent-campaigns">
          <div class="section-header">
            <h3 class="section-title">최근 참여 캠페인</h3>
            <router-link to="/" class="view-all-link">더보기 &gt;</router-link>
          </div>
          
          <div v-if="profile.recentCampaigns.length > 0" class="campaigns-list">
            <div v-for="(campaign, index) in profile.recentCampaigns" :key="index" class="campaign-item">
              <div class="campaign-image">
                <img :src="campaign.imageUrl" alt="캠페인 이미지" />
              </div>
              <div class="campaign-details">
                <div class="campaign-title">{{ campaign.title }}</div>
                <div class="campaign-date">{{ formatDate(campaign.completedDate) }}</div>
              </div>
              <div class="campaign-status" :class="{ 'completed': campaign.status === 'completed' }">
                {{ getCampaignStatusText(campaign.status) }}
              </div>
            </div>
          </div>
          
          <div v-else class="no-campaigns">
            <p>참여한 캠페인이 없습니다.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ReviewerSidebar from '@/components/ReviewerSidebar.vue';

export default {
  name: 'ReviewerMypage',
  components: {
    ReviewerSidebar
  },
  data() {
    return {
      profile: {
        nickname: '리뷰어123',
        membershipLevel: 'diamond',
        bio: '안녕하세요! 화장품과 푸드 분야의 열정적인 리뷰어입니다.',
        avatarUrl: '',
        points: 12450,
        pointsToNextLevel: 550,
        levelProgressPercentage: 84,
        completedCampaigns: 32,
        reviewsCount: 42,
        attendanceThisMonth: 24,
        ongoingCampaigns: 3,
        selectionRate: 76,
        penalties: 0,
        recentCampaigns: [
          {
            title: '새로운 스킨케어 제품 체험단',
            imageUrl: '/api/placeholder/100/100',
            completedDate: '2025-04-18',
            status: 'completed'
          },
          {
            title: '프리미엄 다이닝 식사권 리뷰',
            imageUrl: '/api/placeholder/100/100',
            completedDate: '2025-04-10',
            status: 'completed'
          },
          {
            title: '헤어 케어 신제품 테스터',
            imageUrl: '/api/placeholder/100/100',
            completedDate: '2025-03-25',
            status: 'completed'
          }
        ]
      }
    };
  },
  methods: {
    formatNumber(number) {
      return number.toLocaleString();
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    },
    getMembershipName(level) {
      const levels = {
        bronze: '브론즈',
        silver: '실버',
        gold: '골드',
        platinum: '플래티넘',
        diamond: '다이아몬드'
      };
      return levels[level] || level;
    },
    getCampaignStatusText(status) {
      const statusMap = {
        pending: '대기 중',
        ongoing: '진행 중',
        completed: '완료',
        rejected: '반려'
      };
      return statusMap[status] || status;
    }
  }
};
</script>

<style scoped>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

.reviewer-mypage {
  font-family: 'Pretendard', sans-serif;
  background-color: #FFFFFF;
  min-height: 100vh;
}

.page-layout {
  display: flex;
  max-width: 1280px;
  margin: 0 auto;
}

.mypage-content {
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
}

/* 프로필 카드 */
.profile-card {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #F0F0F0;
}

.profile-info {
  display: flex;
  align-items: center;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #48CFCB;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: 700;
  color: white;
  margin-right: 24px;
  overflow: hidden;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-details {
  flex: 1;
}

.profile-name {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.profile-membership {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.membership-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #48CFCB 0%, #229799 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  margin-right: 8px;
}

.profile-bio {
  color: #666;
  margin-bottom: 16px;
  font-size: 14px;
}

.edit-profile-btn {
  background-color: #F5F5F5;
  color: #424242;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-profile-btn:hover {
  background-color: #E0E0E0;
}

/* 통계 카드 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.stats-card {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #F0F0F0;
  display: flex;
  position: relative;
}

.stats-icon {
  color: #229799;
  margin-right: 16px;
}

.stats-info {
  flex: 1;
}

.stats-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.stats-value {
  font-size: 24px;
  font-weight: 700;
  color: #229799;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background-color: #E0E0E0;
  border-radius: 2px;
  margin-top: 12px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #48CFCB;
  border-radius: 2px;
}

/* 활동 요약 */
.activity-summary {
  margin-bottom: 32px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #424242;
}

.activity-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.activity-card {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #F0F0F0;
  display: flex;
  align-items: center;
}

.activity-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(72, 207, 203, 0.1);
  border-radius: 8px;
  margin-right: 16px;
  color: #229799;
}

.activity-info {
  flex: 1;
}

.activity-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.activity-value {
  font-size: 18px;
  font-weight: 600;
  color: #424242;
}

/* 최근 캠페인 */
.recent-campaigns {
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #F0F0F0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.view-all-link {
  color: #229799;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
}

.campaigns-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.campaign-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #F8F8F8;
  border-radius: 8px;
}

.campaign-image {
  width: 50px;
  height: 50px;
  border-radius: 6px;
  overflow: hidden;
  margin-right: 16px;
}

.campaign-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.campaign-details {
  flex: 1;
}

.campaign-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.campaign-date {
  font-size: 13px;
  color: #666;
}

.campaign-status {
  padding: 4px 10px;
  border-radius: 4px;
  background-color: #FFC107;
  color: white;
  font-size: 13px;
  font-weight: 500;
  margin-left: 8px;
}

.campaign-status.completed {
  background-color: #48CFCB;
}

.no-campaigns {
  padding: 24px 0;
  text-align: center;
  color: #666;
}

/* 반응형 설정 */
@media (max-width: 1200px) {
  .stats-grid, .activity-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .mypage-content {
    padding: 24px;
  }
  
  .profile-info {
    flex-direction: column;
    text-align: center;
  }
  
  .profile-avatar {
    margin-right: 0;
    margin-bottom: 16px;
  }

  .stats-grid, .activity-grid {
    grid-template-columns: 1fr;
  }
}
</style>
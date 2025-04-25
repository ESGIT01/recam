<template>
    <div class="sidebar-container">
      <div class="user-info">
        <div class="greeting">
          <span class="username">{{ username }}</span>님 안녕하세요!
        </div>
        <div class="membership">
          <div class="membership-level">
            <div class="membership-badge">
              <div v-if="membershipLevel === 'diamond'" class="membership-icon diamond">
                <span>D</span>
              </div>
              <div v-else-if="membershipLevel === 'platinum'" class="membership-icon platinum">
                <span>P</span>
              </div>
              <div v-else-if="membershipLevel === 'gold'" class="membership-icon gold">
                <span>G</span>
              </div>
              <div v-else-if="membershipLevel === 'silver'" class="membership-icon silver">
                <span>S</span>
              </div>
              <div v-else class="membership-icon bronze">
                <span>B</span>
              </div>
            </div>
            <span class="membership-name">{{ getMembershipName(membershipLevel) }}</span>
          </div>
          <router-link to="/" class="view-level">등급보기</router-link>
        </div>
        <router-link to="/" class="notification">
          <span class="notification-icon">
            <bell-icon />
          </span>
          <span>새로운 알림</span>
          <span v-if="notifications > 0" class="notification-badge">{{ notifications }}</span>
        </router-link>
      </div>
  
      <div class="menu-section">
        <div class="section-title">내 정보 관리</div>
        <ul class="menu-list">
          <li><router-link to="/reviewer-mypage" class="menu-item"><profile-icon /> 프로필</router-link></li>
          <li><router-link to="/reviewer-attendance" class="menu-item"><attendance-icon /> 출석체크</router-link></li>
          <li><router-link to="/reviewer-point" class="menu-item"><point-icon /> 포인트</router-link></li>
          <li><router-link to="/reviewer-penalty" class="menu-item"><penalty-icon /> 페널티 내역</router-link></li>
          <li><router-link to="/reviewer-edit" class="menu-item"><edit-icon /> 내 정보 수정</router-link></li>
        </ul>
      </div>
  
      <div class="menu-section">
        <div class="section-title">내 캠페인</div>
        <ul class="menu-list">
          <li><router-link to="/reviewer-apply" class="menu-item"><applied-icon /> 내가 신청한 캠페인</router-link></li>
          <li><router-link to="/" class="menu-item"><selected-icon /> 선정된 캠페인</router-link></li>
          <li><router-link to="/" class="menu-item"><completed-icon /> 완료한 캠페인</router-link></li>
          <li><router-link to="/reviewer-dibs" class="menu-item"><bookmark-icon /> 찜한 캠페인</router-link></li>
        </ul>
      </div>
  
      <div class="menu-section">
        <div class="section-title">고객지원</div>
        <ul class="menu-list">
          <li><router-link to="/" class="menu-item"><notice-icon /> 공지사항</router-link></li>
          <li><router-link to="/" class="menu-item"><event-icon /> 이벤트</router-link></li>
          <li><router-link to="/" class="menu-item"><guide-icon /> 이용가이드</router-link></li>
          <li><router-link to="/" class="menu-item"><support-icon /> 고객 센터</router-link></li>
        </ul>
      </div>
  
      <div class="widget-section">
        <router-link to="/">
          <div class="widget-banner">
            <widget-icon />
            <span>리뷰캠퍼스 위젯 달기</span>
          </div>
        </router-link>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ReviewerSidebar',
    components: {
      BellIcon: {
        template: `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `
      },
      ProfileIcon: {
        template: `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `
      },
      AttendanceIcon: {
        template: `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 2V6" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 2V6" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3 10H21" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 16L11 18L15 14" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `
      },
      PointIcon: {
        template: `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L14.5 9H22L16.5 13.5L19 21L12 17L5 21L7.5 13.5L2 9H9.5L12 2Z" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `
      },
      PenaltyIcon: {
        template: `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V12" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 16H12.01" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `
      },
      EditIcon: {
        template: `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `
      },
      AppliedIcon: {
        template: `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 12H3" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 6H3" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 18H3" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 12L16 10V14L21 12Z" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `
      },
      SelectedIcon: {
        template: `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M22 4L12 14.01L9 11.01" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `
      },
      CompletedIcon: {
        template: `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 11L12 14L22 4" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `
      },
      BookmarkIcon: {
        template: `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `
      },
      NoticeIcon: {
        template: `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3 7L12 13L21 7" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `
      },
      EventIcon: {
        template: `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16 2V6" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 2V6" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3 10H21" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 16L11 14L13 16L15 14" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `
      },
      GuideIcon: {
        template: `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9.09 9.00001C9.3251 8.33167 9.78915 7.76811 10.4 7.40914C11.0108 7.05016 11.7289 6.91894 12.4272 7.03872C13.1255 7.15849 13.7588 7.52153 14.2151 8.06353C14.6713 8.60554 14.9211 9.29153 14.92 10C14.92 12 11.92 13 11.92 13" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 17H12.01" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `
      },
      SupportIcon: {
        template: `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 4.5V5C15 6.88071 13.8807 8 12 8C10.1193 8 9 6.88071 9 5V4.5" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 8V13" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13.5 2H10.5C9.67157 2 9 2.67157 9 3.5V3.5C9 4.32843 9.67157 5 10.5 5H13.5C14.3284 5 15 4.32843 15 3.5V3.5C15 2.67157 14.3284 2 13.5 2Z" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18.5 13C18.5 14.6569 18.0259 16.1569 17.1966 17.4925C16.108 19.2413 14.394 20.5 12 20.5C9.606 20.5 7.892 19.2413 6.80338 17.4925C5.97412 16.1569 5.5 14.6569 5.5 13" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M5.5 13H7.5" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M16.5 13H18.5" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `
      },
      WidgetIcon: {
        template: `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 5H9V9H5V5Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15 5H19V9H15V5Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M5 15H9V19H5V15Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15 15H19V19H15V15Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `
      }
    },
    data() {
      return {
        username: '리뷰어',
        membershipLevel: 'diamond',
        notifications: 3
      }
    },
    methods: {
      getMembershipName(level) {
        const levelNames = {
          diamond: '다이아몬드',
          platinum: '플래티넘',
          gold: '골드',
          silver: '실버',
          bronze: '브론즈'
        };
        return levelNames[level] || level;
      }
    }
  }
  </script>
  
  <style scoped>
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

.sidebar-container {
  width: 280px;
  background-color: #FFFFFF;
  min-height: 100vh;
  height: auto;
  padding: 30px 20px;
  font-family: 'Pretendard', sans-serif;
  color: #424242;
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.03);
  position: relative;
  z-index: 1;
}

.user-info {
  background-color: #F5F5F5;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 28px;
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(72, 207, 203, 0.2);
}

.greeting {
  font-size: 16px;
  margin-bottom: 16px;
  font-weight: 500;
}

.username {
  font-weight: 700;
  color: #229799;
}

.membership {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.membership-level {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.membership-badge {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.membership-icon {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 20px;
  color: white;
}

.membership-icon.diamond {
  background: linear-gradient(135deg, #48CFCB 0%, #229799 100%);
  box-shadow: 0 2px 8px rgba(34, 151, 153, 0.3);
}

.membership-icon.platinum {
  background: linear-gradient(135deg, #E5E5E5 0%, #A0A0A0 100%);
  box-shadow: 0 2px 8px rgba(160, 160, 160, 0.3);
}

.membership-icon.gold {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
}

.membership-icon.silver {
  background: linear-gradient(135deg, #C0C0C0 0%, #A9A9A9 100%);
  box-shadow: 0 2px 8px rgba(192, 192, 192, 0.3);
}

.membership-icon.bronze {
  background: linear-gradient(135deg, #CD7F32 0%, #A0522D 100%);
  box-shadow: 0 2px 8px rgba(205, 127, 50, 0.3);
}

.membership-name {
  font-size: 14px;
  font-weight: 600;
  color: #229799;
}

.view-level {
  font-size: 13px;
  color: #424242;
  text-decoration: none;
  padding: 6px 10px;
  background-color: rgba(72, 207, 203, 0.1);
  border-radius: 6px;
  transition: all 0.2s;
}

.view-level:hover {
  background-color: rgba(72, 207, 203, 0.2);
}

.notification {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background-color: white;
  border-radius: 8px;
  text-decoration: none;
  color: #424242;
  font-weight: 500;
  position: relative;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.notification:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.notification-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-badge {
  position: absolute;
  right: 12px;
  background-color: #229799;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

.menu-section {
  margin-bottom: 28px;
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.04);
  position: relative;
}

.menu-section::before {
  content: '';
  position: absolute;
  left: 0;
  top: 16px;
  width: 4px;
  height: 24px;
  background: linear-gradient(to bottom, #48CFCB, #229799);
  border-radius: 0 2px 2px 0;
}

.section-title {
  font-weight: 700;
  font-size: 15px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  padding-left: 10px;
  color: #229799;
  border-bottom: 1px solid rgba(72, 207, 203, 0.2);
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-list li {
  margin-bottom: 6px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  text-decoration: none;
  color: #424242;
  border-radius: 8px;
  transition: all 0.3s;
  font-weight: 500;
  margin-bottom: 2px;
  position: relative;
  overflow: hidden;
}

.menu-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #48CFCB;
  transition: width 0.3s ease;
}

.menu-item:hover {
  background-color: rgba(72, 207, 203, 0.1);
  color: #229799;
  transform: translateX(3px);
}

.menu-item:hover::after {
  width: 100%;
}

.widget-section {
  margin-top: 60px;
  margin-bottom: 30px;
}

.widget-banner {
  background: linear-gradient(135deg, #229799 0%, #48CFCB 100%);
  color: white;
  padding: 18px;
  border-radius: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(34, 151, 153, 0.2);
  position: relative;
  overflow: hidden;
  margin: 10px 0;
}

.widget-banner::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
  opacity: 0;
  transform: scale(0.5);
  transition: transform 0.5s, opacity 0.5s;
}

.widget-banner:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(34, 151, 153, 0.35);
}

.widget-banner:hover::before {
  opacity: 1;
  transform: scale(1);
}
  </style>
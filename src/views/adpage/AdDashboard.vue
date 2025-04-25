<template>
  <div class="ad-dashboard">
    <div class="dashboard-layout">
      <!-- 메인 콘텐츠 영역 -->
      <div class="dashboard-content">
        <!-- 상단 네비게이션 바 -->
        <div class="top-navbar">
          <div class="logo">ReviewCampus</div>
          <div class="top-nav-actions">
            <div class="search-box">
              <input type="text" placeholder="캠페인, 리뷰어 검색" class="search-input">
              <button class="search-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#757575" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M21 21L16.65 16.65" stroke="#757575" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            <div class="notification-bell">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="notification-badge" v-if="notificationCount > 0">{{ notificationCount }}</span>
            </div>
            <div class="user-profile" @click="toggleUserMenu">
              <div class="user-avatar">{{ userInitial }}</div>
              <div class="user-name">{{ advertiserName }}</div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9L12 15L18 9" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <!-- 사용자 메뉴 드롭다운 -->
              <div v-if="showUserMenu" class="user-menu">
                <div class="menu-item" @click="navigateTo('/advertiser/profile')">프로필 설정</div>
                <div class="menu-item" @click="navigateTo('/advertiser/settings')">계정 설정</div>
                <div class="menu-divider"></div>
                <div class="menu-item logout" @click="logout">로그아웃</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 헤더 영역 -->
        <div class="dashboard-header">
          <div class="welcome-section">
            <h1 class="welcome-title">안녕하세요, {{ advertiserName }}님</h1>
            <p class="welcome-subtitle">{{ todayDateString }} | 오늘도 좋은 하루 되세요!</p>
          </div>
          <div class="header-actions">
            <button class="action-button help-button" @click="showHelp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9.09 9.00008C9.3251 8.33175 9.78915 7.76819 10.4 7.40921C11.0108 7.05024 11.7289 6.91902 12.4272 7.03879C13.1255 7.15857 13.7588 7.52161 14.2151 8.06361C14.6713 8.60561 14.9211 9.2916 14.92 10.0001C14.92 12.0001 11.92 13.0001 11.92 13.0001" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 17H12.01" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>도움말</span>
            </button>
            <button class="new-campaign-btn" @click="createNewCampaign">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M5 12H19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              새 캠페인 등록
            </button>
          </div>
        </div>

        <!-- 메인 메뉴 탭 -->
        <div class="main-menu-tabs">
          <div 
            v-for="tab in mainTabs" 
            :key="tab.id" 
            class="menu-tab" 
            :class="{ active: currentTab === tab.id }"
            @click="currentTab = tab.id"
          >
            <div class="tab-icon" v-html="tab.icon"></div>
            <span class="tab-text">{{ tab.label }}</span>
          </div>
        </div>

        <!-- 핵심 지표 요약 -->
        <div class="metrics-cards">
          <div class="metric-card">
            <div class="metric-icon active-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 4H8C5.79086 4 4 5.79086 4 8V16C4 18.2091 5.79086 20 8 20H16C18.2091 20 20 18.2091 20 16V8C20 5.79086 18.2091 4 16 4Z" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 8V16" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 12H16" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="metric-info">
              <h2 class="metric-value">{{ campaignStats.active }}</h2>
              <p class="metric-label">진행 중인 캠페인</p>
            </div>
            <div class="metric-trend" :class="{ up: campaignTrends.active > 0, down: campaignTrends.active < 0 }">
              <span v-if="campaignTrends.active !== 0">{{ Math.abs(campaignTrends.active) }}%</span>
              <svg v-if="campaignTrends.active > 0" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 19V5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M5 12L12 5L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-if="campaignTrends.active < 0" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M19 12L12 19L5 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon recruiting-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#48CFCB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#48CFCB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#48CFCB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#48CFCB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="metric-info">
              <h2 class="metric-value">{{ campaignStats.recruiting }}</h2>
              <p class="metric-label">모집 중인 캠페인</p>
            </div>
            <div class="metric-trend" :class="{ up: campaignTrends.recruiting > 0, down: campaignTrends.recruiting < 0 }">
              <span v-if="campaignTrends.recruiting !== 0">{{ Math.abs(campaignTrends.recruiting) }}%</span>
              <svg v-if="campaignTrends.recruiting > 0" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 19V5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M5 12L12 5L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-if="campaignTrends.recruiting < 0" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M19 12L12 19L5 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon completed-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M22 4L12 14.01L9 11.01" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="metric-info">
              <h2 class="metric-value">{{ campaignStats.completed }}</h2>
              <p class="metric-label">완료된 캠페인</p>
            </div>
            <div class="metric-trend" :class="{ up: campaignTrends.completed > 0, down: campaignTrends.completed < 0 }">
              <span v-if="campaignTrends.completed !== 0">{{ Math.abs(campaignTrends.completed) }}%</span>
              <svg v-if="campaignTrends.completed > 0" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 19V5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M5 12L12 5L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-if="campaignTrends.completed < 0" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M19 12L12 19L5 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon reviewers-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 3C17.2626 2.73735 17.5744 2.52901 17.9176 2.38687C18.2608 2.24473 18.6286 2.17157 19 2.17157C19.3714 2.17157 19.7392 2.24473 20.0824 2.38687C20.4256 2.52901 20.7374 2.73735 21 3C21.2626 3.26264 21.471 3.57444 21.6131 3.9176C21.7553 4.26077 21.8284 4.62856 21.8284 5C21.8284 5.37143 21.7553 5.73923 21.6131 6.08239C21.471 6.42555 21.2626 6.73735 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="metric-info">
              <h2 class="metric-value">{{ totalReviewers }}</h2>
              <p class="metric-label">총 리뷰어</p>
            </div>
            <div class="metric-trend" :class="{ up: reviewerTrend > 0, down: reviewerTrend < 0 }">
              <span v-if="reviewerTrend !== 0">{{ Math.abs(reviewerTrend) }}%</span>
              <svg v-if="reviewerTrend > 0" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 19V5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M5 12L12 5L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-if="reviewerTrend < 0" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M19 12L12 19L5 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- 대시보드 그리드 -->
        <div class="dashboard-grid">
          <!-- 캠페인 현황 섹션 -->
          <div class="dashboard-card campaign-status">
            <div class="card-header">
              <h2 class="card-title">캠페인 현황</h2>
              <div class="card-actions">
                <div class="status-filter">
                  <button 
                    v-for="(status, index) in statusFilters" 
                    :key="index" 
                    class="status-filter-btn" 
                    :class="{ active: selectedStatus === status.value }"
                    @click="selectedStatus = status.value"
                  >
                    {{ status.label }}
                  </button>
                </div>
                <button class="view-all-btn" @click="navigateTo('/advertiser/campaigns')">전체보기</button>
              </div>
            </div>
            <div class="campaigns-table">
              <table>
                <thead>
                  <tr>
                    <th>캠페인명</th>
                    <th>상태</th>
                    <th>지원자</th>
                    <th>마감일</th>
                    <th>작업</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="campaign in filteredCampaigns" :key="campaign.id">
                    <td class="campaign-name">
                      <div class="campaign-name-cell">
                        <img :src="campaign.imageUrl" :alt="campaign.title" class="campaign-thumbnail">
                        <span>{{ campaign.title }}</span>
                      </div>
                    </td>
                    <td>
                      <span class="status-badge" :class="campaign.status">
                        {{ getStatusText(campaign.status) }}
                      </span>
                    </td>
                    <td>
                      <div class="applicant-progress">
                        <div class="progress-bar">
                          <div 
                            class="progress-value"
                            :style="{ width: `${(campaign.applicantCount / campaign.recruitmentCount) * 100}%` }"
                            :class="{ full: campaign.applicantCount >= campaign.recruitmentCount }"
                          ></div>
                        </div>
                        <span class="progress-text">{{ campaign.applicantCount }}/{{ campaign.recruitmentCount }}</span>
                      </div>
                    </td>
                    <td>
                      <div class="deadline-info">
                        <span class="deadline-date">{{ formatDate(campaign.endDate) }}</span>
                        <span 
                          v-if="getDaysLeft(campaign.endDate) > 0" 
                          class="deadline-days" 
                          :class="{ 'urgent': getDaysLeft(campaign.endDate) <= 3 }"
                        >
                          D-{{ getDaysLeft(campaign.endDate) }}
                        </span>
                        <span v-else-if="getDaysLeft(campaign.endDate) === 0" class="deadline-days urgent">오늘 마감</span>
                        <span v-else class="deadline-days ended">마감됨</span>
                      </div>
                    </td>
                    <td>
                      <div class="campaign-actions">
                        <button class="action-btn detail-btn" @click="viewCampaignDetail(campaign.id)" title="상세보기">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                        </button>
                        <button v-if="campaign.status === 'recruiting'" class="action-btn select-btn" @click="selectReviewers(campaign.id)" title="리뷰어 선정">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                        </button>
                        <button v-if="campaign.status === 'draft'" class="action-btn edit-btn" @click="editCampaign(campaign.id)" title="수정하기">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 3C17.2626 2.73735 17.5744 2.52901 17.9176 2.38687C18.2608 2.24473 18.6286 2.17157 19 2.17157C19.3714 2.17157 19.7392 2.24473 20.0824 2.38687C20.4256 2.52901 20.7374 2.73735 21 3C21.2626 3.26264 21.471 3.57444 21.6131 3.9176C21.7553 4.26077 21.8284 4.62856 21.8284 5C21.8284 5.37143 21.7553 5.73923 21.6131 6.08239C21.471 6.42555 21.2626 6.73735 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="filteredCampaigns.length === 0" class="no-data">
              <div class="no-data-icon">📋</div>
              <p class="no-data-text">{{ selectedStatus === 'all' ? '등록된 캠페인이 없습니다.' : `${getStatusText(selectedStatus)} 상태의 캠페인이 없습니다.` }}</p>
              <button class="new-campaign-action" @click="createNewCampaign">새 캠페인 등록하기</button>
            </div>
          </div>

          <!-- 성과 그래프 -->
          <div class="dashboard-card performance-graph">
            <div class="card-header">
              <h2 class="card-title">리뷰어 신청 추이</h2>
              <div class="period-selector">
                <button 
                  v-for="period in periods" 
                  :key="period.value" 
                  :class="['period-btn', { active: selectedPeriod === period.value }]"
                  @click="selectedPeriod = period.value"
                >
                  {{ period.label }}
                </button>
              </div>
            </div>
            <div class="graph-container">
              <!-- 실제 구현 시 차트 라이브러리를 사용하여 그래프 그리기 -->
              <div class="chart-container">
                <div class="chart-y-axis">
                  <div v-for="value in [100, 75, 50, 25, 0]" :key="value" class="chart-y-label">{{ value }}</div>
                </div>
                <div class="chart-bars">
                  <div v-for="(item, index) in chartData" :key="index" class="chart-bar-container">
                    <div class="chart-bar" :style="{ height: `${item.value}%` }">
                      <div class="value-tooltip">{{ item.value }}명</div>
                    </div>
                    <div class="chart-label">{{ item.label }}</div>
                  </div>
                </div>
              </div>
            </div><div class="graph-insights">
              <div class="insight-item">
                <div class="insight-icon" :class="{ positive: performanceInsights.trend > 0, negative: performanceInsights.trend < 0 }">
                  <svg v-if="performanceInsights.trend > 0" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 19V5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M5 12L12 5L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <svg v-else-if="performanceInsights.trend < 0" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M19 12L12 19L5 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="insight-content">
                  <div class="insight-title">{{ performanceInsights.title }}</div>
                  <div class="insight-value">{{ performanceInsights.value }}</div>
                </div>
              </div>
              <div class="insight-item">
                <div class="insight-content">
                  <div class="insight-title">최고 신청일</div>
                  <div class="insight-value">{{ performanceInsights.peakDay }}</div>
                </div>
              </div>
              <div class="insight-item">
                <div class="insight-content">
                  <div class="insight-title">평균</div>
                  <div class="insight-value">일 {{ performanceInsights.dailyAverage }}명</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 대기 중인 승인 요청 -->
          <div class="dashboard-card pending-approvals">
            <div class="card-header">
              <h2 class="card-title">대기 중인 승인 요청</h2>
              <div class="approval-counts">
                <div class="count-badge pending">{{ getPendingCount }}</div>
              </div>
            </div>
            <div v-if="pendingApprovals.length > 0" class="approvals-list">
              <div v-for="approval in pendingApprovals" :key="approval.id" class="approval-item">
                <div class="approval-status">
                  <span class="approval-badge" :class="approval.status">{{ getApprovalStatusText(approval.status) }}</span>
                </div>
                <div class="approval-content">
                  <h3 class="approval-title">{{ approval.title }}</h3>
                  <p class="approval-desc">{{ approval.description }}</p>
                  <div class="approval-meta">
                    <span class="approval-date">제출일: {{ formatDate(approval.submittedAt) }}</span>
                    <span v-if="approval.feedback" class="approval-feedback">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="#F44336" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      피드백: {{ approval.feedback }}
                    </span>
                  </div>
                </div>
                <div class="approval-actions">
                  <button class="edit-approval-btn" @click="editApproval(approval.id)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 3C17.2626 2.73735 17.5744 2.52901 17.9176 2.38687C18.2608 2.24473 18.6286 2.17157 19 2.17157C19.3714 2.17157 19.7392 2.24473 20.0824 2.38687C20.4256 2.52901 20.7374 2.73735 21 3C21.2626 3.26264 21.471 3.57444 21.6131 3.9176C21.7553 4.26077 21.8284 4.62856 21.8284 5C21.8284 5.37143 21.7553 5.73923 21.6131 6.08239C21.471 6.42555 21.2626 6.73735 21 7L7.5 20.5L2 22L3.5 16.5L17 3Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    수정하기
                  </button>
                  <button class="cancel-approval-btn" @click="cancelApproval(approval.id)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    취소하기
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="no-approvals">
              <div class="no-data-icon">📋</div>
              <p class="no-data-text">현재 대기 중인 승인 요청이 없습니다.</p>
              <button class="new-approval-btn" @click="createNewCampaign">새 캠페인 등록하기</button>
            </div>
          </div>

          <!-- 최근 활동 및 알림 -->
          <div class="dashboard-card recent-activities">
            <div class="card-header">
              <h2 class="card-title">최근 활동 및 알림</h2>
              <button class="view-all-btn" @click="navigateTo('/advertiser/notifications')">전체보기</button>
            </div>
            <div class="activities-list">
              <div v-for="(activity, index) in recentActivities" :key="index" class="activity-item">
                <div class="activity-icon" :class="activity.type">
                  <svg v-if="activity.type === 'application'" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M17 11L19 13L23 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <svg v-else-if="activity.type === 'review'" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 18H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 14H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10 10H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <svg v-else-if="activity.type === 'approval'" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="activity-content">
                  <p class="activity-text">{{ activity.text }}</p>
                  <p class="activity-time">{{ formatTimeAgo(activity.timestamp) }}</p>
                </div>
                <button v-if="activity.actionable" class="activity-action-btn" @click="handleActivityAction(activity)">
                  확인
                </button>
              </div>
            </div>
            <div v-if="recentActivities.length === 0" class="no-activities">
              <div class="no-data-icon">🔔</div>
              <p class="no-data-text">새로운 알림이 없습니다.</p>
            </div>
          </div>

          <!-- 요약 통계 카드 -->
          <div class="dashboard-card summary-stats">
            <div class="summary-header">
              <h2 class="card-title">캠페인 성과 요약</h2>
              <div class="date-range">
                {{ formatMonth(new Date()) }} 기준
              </div>
            </div>
            <div class="summary-content">
              <div class="summary-widgets">
                <div class="summary-widget">
                  <div class="widget-value">{{ campaignPerformance.reviewCount }}</div>
                  <div class="widget-label">총 리뷰 수</div>
                  <div class="widget-trend" :class="{ up: campaignPerformance.reviewTrend > 0, down: campaignPerformance.reviewTrend < 0 }">
                    <svg v-if="campaignPerformance.reviewTrend > 0" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 19V5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M5 12L12 5L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <svg v-else-if="campaignPerformance.reviewTrend < 0" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M19 12L12 19L5 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>{{ Math.abs(campaignPerformance.reviewTrend) }}%</span>
                  </div>
                </div>
                <div class="summary-widget">
                  <div class="widget-value rating">{{ campaignPerformance.avgRating }}<small>/5.0</small></div>
                  <div class="widget-label">평균 평점</div>
                  <div class="widget-trend" :class="{ up: campaignPerformance.ratingTrend > 0, down: campaignPerformance.ratingTrend < 0 }">
                    <svg v-if="campaignPerformance.ratingTrend > 0" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 19V5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M5 12L12 5L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <svg v-else-if="campaignPerformance.ratingTrend < 0" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M19 12L12 19L5 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>{{ Math.abs(campaignPerformance.ratingTrend) }}%</span>
                  </div>
                </div>
                <div class="summary-widget">
                  <div class="widget-value">{{ formatCurrency(campaignPerformance.totalBudget) }}</div>
                  <div class="widget-label">총 예산</div>
                  <div class="remaining-budget">잔여: {{ formatCurrency(campaignPerformance.remainingBudget) }}</div>
                </div>
              </div>
              <div class="popular-campaigns">
                <h3 class="popular-title">인기 캠페인 TOP 3</h3>
                <div class="popular-list">
                  <div v-for="(campaign, index) in topCampaigns" :key="campaign.id" class="popular-item">
                    <div class="popular-rank">{{ index + 1 }}</div>
                    <div class="popular-details">
                      <div class="popular-name">{{ campaign.title }}</div>
                      <div class="popular-metrics">
                        <span class="metric-item">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#757575" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#757575" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                          {{ campaign.applicants }}명
                        </span>
                        <span class="metric-item">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#757575" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                          {{ campaign.rating }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 도움말 모달 -->
        <div v-if="showHelpModal" class="modal-overlay" @click="closeHelpModal">
          <div class="modal-content help-modal" @click.stop>
            <div class="modal-header">
              <h3 class="modal-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9.09 9.00008C9.3251 8.33175 9.78915 7.76819 10.4 7.40921C11.0108 7.05024 11.7289 6.91902 12.4272 7.03879C13.1255 7.15857 13.7588 7.52161 14.2151 8.06361C14.6713 8.60561 14.9211 9.2916 14.92 10.0001C14.92 12.0001 11.92 13.0001 11.92 13.0001" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 17H12.01" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                대시보드 도움말
              </h3>
              <button class="close-btn" @click="closeHelpModal">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6 6L18 18" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <div class="help-section">
                <h4 class="help-title">대시보드 둘러보기</h4>
                <p>대시보드에서는 캠페인 관리에 필요한 다양한 정보를 한눈에 확인할 수 있습니다.</p>
                <ul class="help-list">
                  <li><strong>핵심 지표</strong>: 진행 중인 캠페인, 모집 중인 캠페인, 완료된 캠페인, 총 리뷰어 수를 확인할 수 있습니다.</li>
                  <li><strong>캠페인 현황</strong>: 현재 운영 중인 캠페인의 상태와 진행 상황을 확인할 수 있습니다.</li>
                  <li><strong>리뷰어 신청 추이</strong>: 기간별 리뷰어 신청 수 추이를 그래프로 확인할 수 있습니다.</li>
                  <li><strong>대기 중인 승인 요청</strong>: 승인을 기다리고 있는 캠페인을 관리할 수 있습니다.</li>
                  <li><strong>최근 활동 및 알림</strong>: 중요한 알림과 최근 활동을 확인할 수 있습니다.</li>
                </ul>
              </div>
              <div class="help-section">
                <h4 class="help-title">자주 묻는 질문</h4>
                <div class="help-faq">
                  <div class="faq-item">
                    <div class="faq-question">
                      <span>새 캠페인은 어떻게 등록하나요?</span>
                    </div>
                    <div class="faq-answer">
                      상단의 '새 캠페인 등록' 버튼을 클릭하여 캠페인 정보를 입력하고 제출하면 관리자 승인 후 등록됩니다.
                    </div>
                  </div>
                  <div class="faq-item">
                    <div class="faq-question">
                      <span>리뷰어는 어떻게 선정하나요?</span>
                    </div>
                    <div class="faq-answer">
                      모집이 완료된 캠페인에서 '리뷰어 선정' 버튼을 클릭하여 지원자 목록에서 선정할 수 있습니다.
                    </div>
                  </div>
                  <div class="faq-item">
                    <div class="faq-question">
                      <span>캠페인 승인이 거절되었을 때 어떻게 해야 하나요?</span>
                    </div>
                    <div class="faq-answer">
                      거절 사유를 확인하고 '수정하기' 버튼을 클릭하여 필요한 부분을 수정한 후 다시 제출하시면 됩니다.
                    </div>
                  </div>
                </div>
              </div>
              <div class="help-contact">
                <p>더 자세한 도움이 필요하시면 <a href="mailto:support@reviewcampus.com">support@reviewcampus.com</a>으로 문의해주세요.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdDashboard',
  data() {
    return {
      // 광고주 정보
      advertiserName: '에코브랜드',
      
      // 사용자 메뉴 표시 여부
      showUserMenu: false,
      
      // 현재 탭
      currentTab: 'dashboard',
      
      // 메인 탭 목록
      mainTabs: [
        { 
          id: 'dashboard', 
          label: '대시보드',
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 22V12H15V22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        },
        { 
          id: 'campaigns', 
          label: '캠페인 관리',
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 4H8C5.79086 4 4 5.79086 4 8V16C4 18.2091 5.79086 20 8 20H16C18.2091 20 20 18.2091 20 16V8C20 5.79086 18.2091 4 16 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 8V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        },
        {id: 'reviewers', 
          label: '리뷰어 관리',
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        },
        { 
          id: 'reports', 
          label: '통계 및 리포트',
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 20V10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 20V4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 20V14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        },
        { 
          id: 'payments', 
          label: '결제 및 정산',
          icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 10H23" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        }
      ],
      
      // 알림 카운트
      notificationCount: 8,
      
      // 캠페인 통계
      campaignStats: {
        active: 5,
        recruiting: 3,
        completed: 12
      },
      
      // 캠페인 증감율
      campaignTrends: {
        active: 20,
        recruiting: -10,
        completed: 8
      },
      
      // 총 리뷰어 수
      totalReviewers: 156,
      
      // 리뷰어 증감율
      reviewerTrend: 15,
      
      // 도움말 모달 표시 여부
      showHelpModal: false,
      
      // 상태 필터
      selectedStatus: 'all',
      statusFilters: [
        { label: '전체', value: 'all' },
        { label: '모집중', value: 'recruiting' },
        { label: '진행중', value: 'inReview' },
        { label: '완료됨', value: 'completed' },
        { label: '승인대기', value: 'pending' }
      ],
      
      // 최근 캠페인 목록
      recentCampaigns: [
        {
          id: 1,
          title: "에코 프렌들리 세탁세제 체험단",
          imageUrl: "/api/placeholder/40/40",
          status: "recruiting",
          applicantCount: 45,
          recruitmentCount: 50,
          endDate: new Date(2025, 4, 30)
        },
        {
          id: 2,
          title: "친환경 주방용품 리뷰어 모집",
          imageUrl: "/api/placeholder/40/40",
          status: "inReview",
          applicantCount: 30,
          recruitmentCount: 30,
          endDate: new Date(2025, 4, 15)
        },
        {
          id: 3,
          title: "비건 스킨케어 체험단",
          imageUrl: "/api/placeholder/40/40",
          status: "draft",
          applicantCount: 0,
          recruitmentCount: 40,
          endDate: new Date(2025, 5, 10)
        },
        {
          id: 4,
          title: "재활용 패브릭 홈웨어 체험단",
          imageUrl: "/api/placeholder/40/40",
          status: "recruiting",
          applicantCount: 15,
          recruitmentCount: 25,
          endDate: new Date(2025, 5, 5)
        },
        {
          id: 5,
          title: "제로웨이스트 키친 툴 체험단",
          imageUrl: "/api/placeholder/40/40",
          status: "pending",
          applicantCount: 0,
          recruitmentCount: 20,
          endDate: new Date(2025, 5, 15)
        }
      ],
      
      // 차트 관련
      selectedPeriod: 'week',
      periods: [
        { label: '주간', value: 'week' },
        { label: '월간', value: 'month' },
        { label: '분기', value: 'quarter' }
      ],
      chartData: [
        { label: '월', value: 35 },
        { label: '화', value: 42 },
        { label: '수', value: 58 },
        { label: '목', value: 75 },
        { label: '금', value: 90 },
        { label: '토', value: 65 },
        { label: '일', value: 45 }
      ],
      
      // 성과 인사이트
      performanceInsights: {
        trend: 30,
        title: '지난 주 대비',
        value: '30% 상승',
        peakDay: '금요일',
        dailyAverage: 58
      },
      
      // 최근 활동
      recentActivities: [
        {
          type: 'application',
          text: '김민수님이 "에코 프렌들리 세탁세제 체험단"에 지원했습니다.',
          timestamp: new Date(2025, 3, 24, 14, 30),
          actionable: true
        },
        {
          type: 'review',
          text: '이지은님이 "친환경 주방용품 리뷰어 모집" 캠페인에 리뷰를 작성했습니다.',
          timestamp: new Date(2025, 3, 24, 12, 15),
          actionable: true
        },
        {
          type: 'approval',
          text: '"비건 스킨케어 체험단" 캠페인이 승인되었습니다.',
          timestamp: new Date(2025, 3, 24, 10, 45),
          actionable: false
        },
        {
          type: 'system',
          text: '결제 시스템 점검 안내: 4월 26일 오전 2시~4시',
          timestamp: new Date(2025, 3, 23, 16, 0),
          actionable: false
        },
        {
          type: 'application',
          text: '박지영님 외 5명이 "에코 프렌들리 세탁세제 체험단"에 지원했습니다.',
          timestamp: new Date(2025, 3, 23, 15, 20),
          actionable: true
        }
      ],
      
      // 대기 중인 승인 요청
      pendingApprovals: [
        {
          id: 1,
          title: "제로웨이스트 키친 툴 체험단",
          description: "친환경 주방 도구 5종 체험 및 리뷰 캠페인입니다.",
          status: "pending",
          submittedAt: new Date(2025, 3, 22),
          feedback: null
        },
        {
          id: 2,
          title: "유기농 면 침구 체험단",
          description: "GOTS 인증 유기농 코튼 침구 체험 캠페인입니다.",
          status: "rejected",
          submittedAt: new Date(2025, 3, 20),
          feedback: "제품 상세 정보와 이미지가 더 필요합니다."
        }
      ],
      
      // 캠페인 성과 요약
      campaignPerformance: {
        reviewCount: 256,
        reviewTrend: 12,
        avgRating: 4.8,
        ratingTrend: 5,
        totalBudget: 5000000,
        remainingBudget: 3200000
      },
      
      // 인기 캠페인 TOP 3
      topCampaigns: [
        {
          id: 5,
          title: "친환경 주방용품 리뷰어 모집",
          applicants: 173,
          rating: 4.9
        },
        {
          id: 2,
          title: "에코 프렌들리 세탁세제 체험단",
          applicants: 142,
          rating: 4.7
        },
        {
          id: 9,
          title: "비건 화장품 체험단",
          applicants: 118,
          rating: 4.6
        }
      ]
    }
  },
  computed: {
    // 사용자 이름의 첫 글자 추출
    userInitial() {
      return this.advertiserName.charAt(0);
    },
    
    // 오늘 날짜 문자열 포맷팅
    todayDateString() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      
      const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
      const weekday = weekdays[today.getDay()];
      
      return `${year}년 ${month}월 ${day}일 (${weekday})`;
    },
    
    // 필터링된 캠페인
    filteredCampaigns() {
      if (this.selectedStatus === 'all') {
        return this.recentCampaigns;
      } else {
        return this.recentCampaigns.filter(campaign => campaign.status === this.selectedStatus);
      }
    },
    
    // 대기 중인 승인 요청 갯수
    getPendingCount() {
      return this.pendingApprovals.filter(item => item.status === 'pending').length;
    }
  },
  methods: {
    // 날짜 포맷팅
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}.${month}.${day}`;
    },
    
    // 월 포맷팅
    formatMonth(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      return `${year}년 ${month}월`;
    },
    
    // 화폐 포맷팅
    formatCurrency(value) {
      return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value);
    },
    
    // 남은 일수 계산
    getDaysLeft(endDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(0, 0, 0, 0);
      
      const diffTime = end - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    },
    
    // 시간 경과 표시
    formatTimeAgo(date) {
      const now = new Date();
      const diffMs = now - date;
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      
      if (diffMinutes < 60) {
        return `${diffMinutes}분 전`;
      } else if (diffMinutes < 1440) {
        return `${Math.floor(diffMinutes / 60)}시간 전`;
      } else {
        return `${Math.floor(diffMinutes / 1440)}일 전`;
      }
    },
    
    // 상태 텍스트 반환
    getStatusText(status) {
      const statusMap = {
        'draft': '작성중',
        'pending': '승인대기',
        'recruiting': '모집중',
        'inReview': '진행중',
        'completed': '완료됨',
        'rejected': '반려됨'
      };
      return statusMap[status] || status;
    },
    
    // 승인 상태 텍스트 반환
    getApprovalStatusText(status) {
      const statusMap = {
        'pending': '검토중',
        'approved': '승인됨',
        'rejected': '반려됨'
      };
      return statusMap[status] || status;
    },
    
    // 사용자 메뉴 토글
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu;
    },
    
    // 도움말 모달 표시
    showHelp() {
      this.showHelpModal = true;
    },
    
    // 도움말 모달 닫기
    closeHelpModal() {
      this.showHelpModal = false;
    },
    
    // 새 캠페인 등록
    createNewCampaign() {
      // 실제로는 라우팅으로 구현
      this.navigateTo('/advertiser/campaigns/create');
    },
    
    // 캠페인 상세 보기
    viewCampaignDetail(campaignId) {
      // 실제로는 라우팅으로 구현
      this.navigateTo(`/advertiser/campaigns/${campaignId}`);
    },
    
    // 리뷰어 선정
    selectReviewers(campaignId) {
      // 실제로는 라우팅으로 구현
      this.navigateTo(`/advertiser/campaigns/${campaignId}/select-reviewers`);
    },
    
    // 캠페인 수정
    editCampaign(campaignId) {
      // 실제로는 라우팅으로 구현
      this.navigateTo(`/advertiser/campaigns/${campaignId}/edit`);
    },
    
    // 승인 요청 수정
    editApproval(approvalId) {
      const approval = this.pendingApprovals.find(a => a.id === approvalId);
      if (approval) {
        // 실제로는 라우팅으로 구현
        this.navigateTo(`/advertiser/campaigns/${approvalId}/edit`);
      }
    },
    
    // 승인 요청 취소
    cancelApproval(approvalId) {
      if (confirm('승인 요청을 취소하시겠습니까?')) {
        // 실제로는 API 호출
        this.pendingApprovals = this.pendingApprovals.filter(a => a.id !== approvalId);
      }
    },
    
    // 알림 액션 처리
    handleActivityAction(activity) {
      // 실제로는 API 호출 및 라우팅으로 구현
      alert(`'${activity.text}' 확인 처리되었습니다.`);
      
      // 알림 목록에서 제거하거나 상태 변경
      const index = this.recentActivities.findIndex(a => a === activity);
      if (index !== -1) {
        this.recentActivities[index].actionable = false;
      }
      
      // 알림 카운트 감소
      if (this.notificationCount > 0) {
        this.notificationCount--;
      }
    },
    
    // 로그아웃
    logout() {
      // 실제로는 로그아웃 API 호출 후 로그인 페이지로 이동
      alert('로그아웃 되었습니다.');
      this.navigateTo('/login');
    },
    
    // 페이지 이동
    navigateTo(path) {
      // 실제로는 Vue Router를 사용
      alert(`페이지 이동: ${path}`);
      // this.$router.push(path);
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

.ad-dashboard {
  background-color: #F5F5F5;
  min-height: 100vh;
}

.dashboard-layout {
  max-width: 1280px;
  margin: 0 auto;
}

.dashboard-content {
  padding: 20px;
}

/* 상단 네비게이션 바 */
.top-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  margin-bottom: 24px;
}

.logo {
  font-size: 20px;
  font-weight: 700;
  color: #229799;
}

.top-nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
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
  background-color: #F5F5F5;
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

.notification-bell {
  position: relative;
  cursor: pointer;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #F44336;
  color: white;
  font-size: 10px;
  font-weight: 600;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 20px;
  transition: background-color 0.2s;
  position: relative;
}

.user-profile:hover {
  background-color: #F5F5F5;
}

.user-avatar {
  width: 32px;
  height: 32px;
  background-color: #48CFCB;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #424242;
}

.user-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  width: 180px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  overflow: hidden;
}

.menu-item {
  padding: 12px 16px;
  font-size: 14px;
  color: #424242;
  cursor: pointer;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background-color: #F5F5F5;
}

.menu-divider {
  height: 1px;
  background-color: #F0F0F0;
  margin: 4px 0;
}

.menu-item.logout {
  color: #F44336;
}

/* 헤더 영역 */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.welcome-title {
  font-size: 24px;
  font-weight: 700;
  color: #229799;
  margin: 0 0 4px 0;
}

.welcome-subtitle {
  font-size: 14px;
  color: #757575;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  background-color: white;
  border: 1px solid #E0E0E0;
}

.help-button {
  color: #424242;
}

.new-campaign-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: #229799;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.new-campaign-btn:hover {
  background-color: #1b7a7b;
}

/* 메인 메뉴 탭 */
.main-menu-tabs {
  display: flex;
  gap: 8px;
  background-color: white;
  padding: 6px;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow-x: auto;
}

.menu-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  color: #757575;
}

.menu-tab:hover {
  background-color: #F5F5F5;
}

.menu-tab.active {
  background-color: rgba(34, 151, 153, 0.1);
  color: #229799;
  font-weight: 500;
}

.menu-tab.active .tab-icon {
  color: #229799;
}

/* 핵심 지표 카드 */
.metrics-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.metric-card {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  position: relative;
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
}

.active-icon {
  background-color: rgba(34, 151, 153, 0.1);
  color: #229799;
}

.recruiting-icon {
  background-color: rgba(72, 207, 203, 0.1);
  color: #48CFCB;
}

.completed-icon {
  background-color: rgba(66, 66, 66, 0.1);
  color: #424242;
}

.reviewers-icon {
  background-color: rgba(34, 151, 153, 0.1);
  color: #229799;
}

.metric-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.metric-value {
  font-size: 24px;
  font-weight: 700;
  color: #424242;
  margin: 0 0 4px 0;
}

.metric-label {
  font-size: 14px;
  color: #757575;
  margin: 0;
}

.metric-trend {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
}

.metric-trend.up {
  color: #4CAF50;
}

.metric-trend.down {
  color: #F44336;
}

/* 대시보드 그리드 */
.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: auto auto;
  gap: 20px;
}

.dashboard-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #F0F0F0;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #424242;
  margin: 0;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-filter {
  display: flex;
  gap: 8px;
}

.status-filter-btn {
  background: none;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 13px;
  color: #757575;
  cursor: pointer;
  transition: all 0.2s;
}

.status-filter-btn:hover {
  background-color: #F5F5F5;
}

.status-filter-btn.active {
  background-color: #229799;
  color: white;
}

.view-all-btn {
  background: none;
  border: none;
  color: #229799;
  font-size: 14px;
  cursor: pointer;
}

/* 캠페인 현황 */
.campaign-status {
  grid-row: span 2;
}

.campaigns-table {
  padding: 0 20px 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 12px 8px;
  font-size: 14px;
  font-weight: 500;
  color: #757575;
  border-bottom: 1px solid #F0F0F0;
}

td {
  padding: 12px 8px;
  font-size: 14px;
  color: #424242;
  border-bottom: 1px solid #F0F0F0;
}

tr:last-child td {
  border-bottom: none;
}

.campaign-name-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.campaign-thumbnail {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  object-fit: cover;
}

.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.draft {
  background-color: #F5F5F5;
  color: #9E9E9E;
}

.status-badge.pending {
  background-color: #FFF3E0;
  color: #FF9800;
}

.status-badge.recruiting {
  background-color: #E0F7FA;
  color: #00BCD4;
}

.status-badge.inReview {
  background-color: #E8F5E9;
  color: #4CAF50;
}

.status-badge.completed {
  background-color: #EFEBE9;
  color: #795548;
}

.status-badge.rejected {
  background-color: #FFEBEE;
  color: #F44336;
}

.applicant-progress {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background-color: #F0F0F0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-value {
  height: 100%;
  background-color: #48CFCB;
  border-radius: 3px;
  transition: width 0.3s;
}

.progress-value.full {
  background-color: #4CAF50;
}

.progress-text {
  font-size: 13px;
  color: #757575;
}

.deadline-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.deadline-date {
  font-size: 14px;
  color: #424242;
}

.deadline-days {
  font-size: 12px;
  font-weight: 500;
  color: #757575;
}

.deadline-days.urgent {
  color: #F44336;
}

.deadline-days.ended {
  color: #9E9E9E;
}

.campaign-actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid #E0E0E0;
  background-color: white;
  color: #757575;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background-color: #F5F5F5;
}

.action-btn.detail-btn:hover {
  color: #229799;
  border-color: #229799;
}

.action-btn.select-btn:hover {
  color: #4CAF50;
  border-color: #4CAF50;
}

.action-btn.edit-btn:hover {
  color: #FF9800;
  border-color: #FF9800;
}

.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  text-align: center;
}

.no-data-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.no-data-text {
  font-size: 16px;
  color: #9E9E9E;
  margin-bottom: 24px;
}

.new-campaign-action {
  padding: 10px 24px;
  background-color: #229799;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

/* 성과 그래프 */
.performance-graph {
  position: relative;
}

.period-selector {
  display: flex;
  gap: 8px;
}

.period-btn {
  border: none;
  background: none;
  padding: 4px 10px;
  font-size: 13px;
  color: #757575;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.period-btn:hover {
  background-color: #F5F5F5;
}

.period-btn.active {
  background-color: #229799;
  color: white;
}

.graph-container {
  padding: 20px;
  height: 220px;
}

/* 차트 스타일 */
.chart-container {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
}

.chart-bars {
  flex-grow: 1;
  display: flex;
  align-items: flex-end;
  height: 200px;
  gap: 12px;
  padding-left: 40px;
}

.chart-bar-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
}

.chart-bar {
  width: 100%;
  max-width: 40px;
  background-color: #48CFCB;
  border-radius: 6px 6px 0 0;
  transition: height 0.3s;
  position: relative;
}

.chart-bar:hover .value-tooltip {
  opacity: 1;
  transform: translateY(0);
}

.value-tooltip {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  background-color: #424242;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  opacity: 0;
  transition: all 0.2s;
  white-space: nowrap;
  pointer-events: none;
}

.value-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: #424242 transparent transparent transparent;
}

.chart-label {
  margin-top: 8px;
  font-size: 12px;
  color: #757575;
}

.chart-y-axis {
  position: absolute;
  left: 0;
  top: 0;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.chart-y-label {
  font-size: 12px;
  color: #9E9E9E;
}

.graph-insights {
  display: flex;
  padding: 0 20px 20px;
  gap: 16px;
}

.insight-item {
  flex: 1;
  background-color: #F5F5F5;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.insight-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.insight-icon.positive {
  background-color: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
}

.insight-icon.negative {
  background-color: rgba(244, 67, 54, 0.2);
  color: #F44336;
}

.insight-content {
  flex: 1;
}

.insight-title {
  font-size: 12px;
  color: #757575;
  margin-bottom: 4px;
}

.insight-value {
  font-size: 14px;
  font-weight: 500;
  color: #424242;
}

/* 대기 중인 승인 요청 */
.approval-counts {
  display: flex;
  gap: 8px;
}

.count-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.count-badge.pending {
  background-color: #FFF3E0;
  color: #FF9800;
}

.approvals-list {
  padding: 12px 20px;
  max-height: 300px;
  overflow-y: auto;
}

.approval-item {
  padding: 16px 0;
  border-bottom: 1px solid #F0F0F0;
}

.approval-item:last-child {
  border-bottom: none;
}

.approval-status {
  margin-bottom: 8px;
}

.approval-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.approval-badge.pending {
  background-color: #FFF3E0;
  color: #FF9800;
}

.approval-badge.approved {
  background-color: #E8F5E9;
  color: #4CAF50;
}

.approval-badge.rejected {
  background-color: #FFEBEE;
  color: #F44336;
}

.approval-title {
  font-size: 16px;
  font-weight: 600;
  color: #424242;
  margin: 0 0 8px 0;
}

.approval-desc {
  font-size: 14px;
  color: #757575;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.approval-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
  font-size: 13px;
}

.approval-date {
  color: #9E9E9E;
}

.approval-feedback {
  color: #F44336;
  display: flex;
  align-items: center;
  gap: 4px;
}

.approval-actions {
  display: flex;
  gap: 8px;
}

.edit-approval-btn, .cancel-approval-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}

.edit-approval-btn {
  background-color: #229799;
  color: white;
  border: none;
}

.cancel-approval-btn {
  background-color: white;
  color: #F44336;
  border: 1px solid #F44336;
}

.no-approvals {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  text-align: center;
}

.new-approval-btn {
  padding: 8px 16px;
  background-color: #229799;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

/* 최근 활동 및 알림 */
.activities-list {
  padding: 8px 20px;
  max-height: 300px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #F0F0F0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
}

.activity-icon.application {
  background-color: #E0F7FA;
  color: #00BCD4;
}

.activity-icon.review {
  background-color: #E8F5E9;
  color: #4CAF50;
}

.activity-icon.approval {
  background-color: #E1F5FE;
  color: #03A9F4;
}

.activity-icon.system {
  background-color: #F5F5F5;
  color: #757575;
}

.activity-content {
  flex-grow: 1;
}

.activity-text {
  font-size: 14px;
  color: #424242;
  margin: 0 0 4px 0;
  line-height: 1.4;
  word-break: break-word;
}

.activity-time {
  font-size: 12px;
  color: #9E9E9E;
  margin: 0;
}

.activity-action-btn {
  align-self: center;
  padding: 6px 12px;
  background-color: #229799;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  margin-left: 12px;
  flex-shrink: 0;
}

.no-activities {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  text-align: center;
}

/* 요약 통계 카드 */
.summary-stats {
  overflow: visible;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #F0F0F0;
}

.date-range {
  font-size: 14px;
  color: #757575;
}

.summary-content {
  padding: 20px;
}

.summary-widgets {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.summary-widget {
  flex: 1;
  padding: 16px;
  border-radius: 8px;
  background-color: #F5F5F5;
  text-align: center;
}

.widget-value {
  font-size: 20px;
  font-weight: 700;
  color: #424242;
  margin-bottom: 4px;
}

.widget-value.rating {
  color: #FF9800;
}

.widget-value.rating small {
  font-size: 14px;
  font-weight: 400;
}

.widget-label {
  font-size: 13px;
  color: #757575;
  margin-bottom: 8px;
}

.widget-trend {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
}

.widget-trend.up {
  color: #4CAF50;
}

.widget-trend.down {
  color: #F44336;
}

.remaining-budget {
  font-size: 13px;
  color: #757575;
}

.popular-campaigns {
  padding: 16px;
  border-radius: 8px;
  background-color: #F5F5F5;
}

.popular-title {
  font-size: 14px;
  font-weight: 600;
  color: #424242;
  margin: 0 0 16px 0;
}

.popular-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.popular-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.popular-rank {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #229799;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
}

.popular-details {
  flex: 1;
}

.popular-name {
  font-size: 14px;
  font-weight: 500;
  color: #424242;
  margin-bottom: 4px;
}

.popular-metrics {
  display: flex;
  gap: 12px;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #757575;
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
  width: 600px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #F0F0F0;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #424242;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
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

.help-section {
  margin-bottom: 24px;
}

.help-title {
  font-size: a6px;
  font-weight: 600;
  color: #424242;
  margin: 0 0 12px 0;
}

.help-list {
  padding-left: 20px;
  margin: 0;
  color: #424242;
  line-height: 1.6;
}

.help-faq {
  margin-top: 12px;
}

.faq-item {
  margin-bottom: 16px;
}

.faq-question {
  font-weight: 500;
  color: #424242;
  margin-bottom: 8px;
}

.faq-answer {
  color: #757575;
  padding-left: 20px;
  line-height: 1.6;
}

.help-contact {
  color: #757575;
  line-height: 1.6;
}

.help-contact a {
  color: #229799;
  text-decoration: none;
}

/* 반응형 스타일 */
@media (max-width: 1200px) {
  .dashboard-content {
    padding: 16px;
  }
  
  .metrics-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 992px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .campaign-status {
    grid-row: auto;
  }
  
  .summary-widgets {
    flex-direction: column;
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .top-navbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 16px;
  }
  
  .top-nav-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .search-box {
    width: 100%;
  }
  
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .metrics-cards {
    grid-template-columns: 1fr;
  }
  
  .main-menu-tabs {
    overflow-x: auto;
    padding-bottom: 8px;
  }
  
  table th:nth-child(4),
  table td:nth-child(4) {
    display: none;
  }
}

@media (max-width: 576px) {
  .top-nav-actions {
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .search-box {
    order: 3;
    width: 100%;
  }
  
  table th:nth-child(3),
  table td:nth-child(3) {
    display: none;
  }
  
  .activity-item {
    flex-wrap: wrap;
  }
  
  .activity-action-btn {
    margin-left: 48px;
    margin-top: 8px;
  }
  
  .graph-insights {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
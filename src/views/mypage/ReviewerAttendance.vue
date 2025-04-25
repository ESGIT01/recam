<template>
    <div class="reviewer-attendance">
      <div class="page-layout">
        <!-- 왼쪽 사이드바 -->
        <ReviewerSidebar />
        
        <!-- 메인 콘텐츠 영역 -->
        <div class="attendance-content">
          <!-- 페이지 헤더 -->
          <div class="page-header">
            <h1 class="page-title">출석체크</h1>
            <div class="date-display">{{ currentDate }}</div>
          </div>
  
          <!-- 출석체크 카드 -->
          <div class="attendance-card">
            <div class="attendance-status">
              <div class="status-circle" :class="{ active: isCheckedIn }"></div>
              <span class="status-text">{{ attendanceStatus }}</span>
            </div>
            
            <div class="time-info">
              <div class="time-item">
                <span class="time-label">출석 시간</span>
                <span class="time-value">{{ checkInTime || '-' }}</span>
              </div>
            </div>
            
            <button 
              class="check-button" 
              :class="{ disabled: isCheckedIn }" 
              @click="checkAttendance"
              :disabled="isCheckedIn"
            >
              출석하기
            </button>
          </div>
          
          <!-- 출석 현황 -->
          <div class="attendance-history">
            <h2 class="section-title">이번 달 출석 현황</h2>
            <div class="calendar">
              <div class="calendar-header">
                <div class="month-selector">
                  <button class="arrow-btn" @click="prevMonth">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15 18L9 12L15 6" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  <span>{{ currentYear }}년 {{ currentMonth }}월</span>
                  <button class="arrow-btn" @click="nextMonth">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 18L15 12L9 6" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div class="weekdays">
                <div class="weekday" v-for="day in weekdays" :key="day">{{ day }}</div>
              </div>
              
              <div class="days">
                <div 
                  v-for="day in calendarDays" 
                  :key="day.date" 
                  class="day" 
                  :class="{
                    'other-month': !day.isCurrentMonth,
                    'attended': day.attended,
                    'today': day.isToday
                  }"
                >
                  <span class="day-number">{{ day.dayNumber }}</span>
                  <div class="attendance-mark" v-if="day.attended"></div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 통계 섹션 -->
          <div class="stats-grid">
            <div class="stats-card">
              <div class="stats-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12H18L15 21L9 3L6 12H2" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="stats-info">
                <div class="stats-label">이번 달 출석률</div>
                <div class="stats-value">{{ attendanceRate }}%</div>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{width: `${attendanceRate}%`}"></div>
                </div>
              </div>
            </div>
            
            <div class="stats-card">
              <div class="stats-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 2V6" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8 2V6" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M3 10H21" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="stats-info">
                <div class="stats-label">연속 출석일</div>
                <div class="stats-value">{{ consecutiveDays }}일</div>
                <div class="streak-days">
                  <div 
                    v-for="(day, index) in streakDisplay" 
                    :key="index" 
                    class="streak-day"
                    :class="{ attended: day }"
                  ></div>
                </div>
              </div>
            </div>
            
            <div class="stats-card">
              <div class="stats-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L14.5 9H22L16.5 13.5L19 21L12 17L5 21L7.5 13.5L2 9H9.5L12 2Z" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="stats-info">
                <div class="stats-label">획득 포인트</div>
                <div class="stats-value">{{ formatNumber(earnedPoints) }} P</div>
                <div class="points-info">이번 달 출석으로 획득한 포인트</div>
              </div>
            </div>
            
            <div class="stats-card">
              <div class="stats-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M22 4L12 14.01L9 11.01" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="stats-info">
                <div class="stats-label">참여 가능 캠페인</div>
                <div class="stats-value">+{{ availableCampaigns }}개</div>
                <div class="points-info">출석률 80% 이상 달성 시 추가 캠페인 참여 기회</div>
              </div>
            </div>
          </div>
          
          <!-- 출석 혜택 정보 -->
          <div class="benefits-section">
            <h2 class="section-title">출석 혜택 안내</h2>
            <div class="benefits-card">
              <div class="benefit-item">
                <div class="benefit-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M15 9H9V15H15V9Z" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="benefit-info">
                  <div class="benefit-title">매일 출석 시 50P 적립</div>
                  <div class="benefit-desc">매일 1회 출석체크 완료 시 50포인트가 자동 적립됩니다.</div>
                </div>
              </div>
              
              <div class="benefit-item">
                <div class="benefit-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M20 8V14" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M23 11H17" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="benefit-info">
                  <div class="benefit-title">연속 출석 보너스</div>
                  <div class="benefit-desc">7일 연속 출석 시 100P, 30일 연속 출석 시 500P 추가 적립됩니다.</div>
                </div>
              </div>
              
              <div class="benefit-item">
                <div class="benefit-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 7V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V7" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="benefit-info">
                  <div class="benefit-title">출석률 80% 이상 시 혜택</div>
                  <div class="benefit-desc">월 출석률 80% 이상 달성 시 프리미엄 캠페인 우선 참여 기회가 제공됩니다.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import ReviewerSidebar from '@/components/ReviewerSidebar.vue';
  
  export default {
    name: 'ReviewerAttendance',
    components: {
      ReviewerSidebar
    },
    data() {
      return {
        isCheckedIn: false,
        checkInTime: null,
        weekdays: ['일', '월', '화', '수', '목', '금', '토'],
        currentMonthIndex: new Date().getMonth(),
        currentYear: new Date().getFullYear(),
        attendanceData: [], // 서버에서 가져올 출석 데이터
        consecutiveDays: 15,
        attendanceRate: 85,
        earnedPoints: 1250,
        availableCampaigns: 3,
        streakDisplay: [true, true, true, true, true, false, true, true]
      }
    },
    computed: {
      currentDate() {
        const today = new Date()
        const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }
        return today.toLocaleDateString('ko-KR', options)
      },
      attendanceStatus() {
        return this.isCheckedIn ? '출석 완료' : '미출석'
      },
      currentMonth() {
        return this.currentMonthIndex + 1
      },
      calendarDays() {
        const days = []
        
        // 현재 월의 첫 날과 마지막 날
        const firstDayOfMonth = new Date(this.currentYear, this.currentMonthIndex, 1)
        const lastDayOfMonth = new Date(this.currentYear, this.currentMonthIndex + 1, 0)
        
        // 이전 월의 날짜를 채움
        const firstDayOfWeek = firstDayOfMonth.getDay()
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
          const date = new Date(this.currentYear, this.currentMonthIndex, -i)
          days.push({
            date: date,
            dayNumber: date.getDate(),
            isCurrentMonth: false,
            attended: this.checkAttendanceForDate(date),
            isToday: this.isToday(date)
          })
        }
        
        // 현재 월의 날짜를 채움
        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
          const date = new Date(this.currentYear, this.currentMonthIndex, i)
          days.push({
            date: date,
            dayNumber: i,
            isCurrentMonth: true,
            attended: this.checkAttendanceForDate(date),
            isToday: this.isToday(date)
          })
        }
        
        // 다음 월의 날짜를 채워서 7의 배수로 맞춤
        const remainingDays = 7 - (days.length % 7)
        if (remainingDays < 7) {
          for (let i = 1; i <= remainingDays; i++) {
            const date = new Date(this.currentYear, this.currentMonthIndex + 1, i)
            days.push({
              date: date,
              dayNumber: i,
              isCurrentMonth: false,
              attended: this.checkAttendanceForDate(date),
              isToday: this.isToday(date)
            })
          }
        }
        
        return days
      }
    },
    mounted() {
      this.fetchAttendanceData()
      
      // 테스트를 위한 더미 데이터
      this.attendanceData = this.generateDummyData()
      
      // 오늘 이미 출석했는지 확인
      const today = new Date().toISOString().split('T')[0]
      if (this.attendanceData.some(item => item.date === today)) {
        this.isCheckedIn = true
        this.checkInTime = this.attendanceData.find(item => item.date === today).checkInTime
      }
    },
    methods: {
      formatNumber(number) {
        return number.toLocaleString();
      },
      async fetchAttendanceData() {
        // API에서 출석 데이터를 가져오는 로직
        try {
          // const response = await fetch('/api/attendance')
          // this.attendanceData = await response.json()
        } catch (error) {
          console.error('출석 데이터를 가져오는 중 오류가 발생했습니다:', error)
        }
      },
      checkAttendance() {
        // 출석 체크 로직
        this.isCheckedIn = true
        const now = new Date()
        this.checkInTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
        
        // API 호출하여 출석 데이터 저장
        // this.saveAttendanceData()
        
        // 출석 데이터 업데이트
        this.attendanceData.push({
          date: new Date().toISOString().split('T')[0],
          checkInTime: this.checkInTime
        })
        
        // 출석률과 연속 출석일 업데이트 (실제로는 API 응답에서 받아오는 값)
        this.attendanceRate = Math.min(100, this.attendanceRate + 3)
        this.consecutiveDays += 1
        this.earnedPoints += 50
      },
      prevMonth() {
        if (this.currentMonthIndex === 0) {
          this.currentMonthIndex = 11
          this.currentYear--
        } else {
          this.currentMonthIndex--
        }
      },
      nextMonth() {
        if (this.currentMonthIndex === 11) {
          this.currentMonthIndex = 0
          this.currentYear++
        } else {
          this.currentMonthIndex++
        }
      },
      isToday(date) {
        const today = new Date()
        return date.getDate() === today.getDate() && 
               date.getMonth() === today.getMonth() && 
               date.getFullYear() === today.getFullYear()
      },
      checkAttendanceForDate(date) {
        // 해당 날짜에 출석했는지 확인
        const dateString = date.toISOString().split('T')[0]
        return this.attendanceData.some(item => item.date === dateString)
      },
      generateDummyData() {
        // 테스트를 위한 더미 데이터 생성
        const data = []
        const today = new Date()
        
        // 이번 달에 랜덤하게 85% 정도 출석한 것으로 가정
        for (let i = 1; i < today.getDate(); i++) {
          if (Math.random() > 0.15) {  // 85% 확률로 출석
            const date = new Date(today.getFullYear(), today.getMonth(), i)
            data.push({
              date: date.toISOString().split('T')[0],
              checkInTime: `${Math.floor(Math.random() * 3) + 9}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
            })
          }
        }
        
        return data
      }
    }
  }
  </script>
  
  <style scoped>
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
  
  * {
    font-family: 'Pretendard', sans-serif;
    box-sizing: border-box;
  }
  
  .reviewer-attendance {
    background-color: #FFFFFF;
    min-height: 100vh;
  }
  
  .page-layout {
    display: flex;
    max-width: 1280px;
    margin: 0 auto;
  }
  
  .attendance-content {
    flex: 1;
    padding: 40px;
  }
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }
  
  .page-title {
    font-size: 24px;
    font-weight: 700;
    color: #229799;
    margin: 0;
  }
  
  .date-display {
    font-size: 16px;
    color: #424242;
    background-color: white;
    padding: 8px 16px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  /* 출석체크 카드 */
  .attendance-card {
    background-color: white;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #F0F0F0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .attendance-status {
    display: flex;
    align-items: center;
  }
  
  .status-circle {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #e0e0e0;
    margin-right: 12px;
  }
  
  .status-circle.active {
    background-color: #48CFCB;
  }
  
  .status-text {
    font-size: 18px;
    font-weight: 600;
    color: #424242;
  }
  
  .time-info {
    display: flex;
    flex-direction: column;
  }
  
  .time-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 8px;
  }
  
  .time-label {
    font-size: 12px;
    color: #757575;
    margin-bottom: 4px;
  }
  
  .time-value {
    font-size: 16px;
    font-weight: 600;
    color: #424242;
  }
  
  .check-button {
    background-color: #229799;
    color: white;
    font-size: 16px;
    font-weight: 600;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .check-button:hover {
    background-color: #1b7a7b;
  }
  
  .check-button.disabled {
    background-color: #48CFCB;
    cursor: not-allowed;
  }
  
  /* 출석 현황 */
  .attendance-history {
    background-color: white;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #F0F0F0;
  }
  
  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: #424242;
    margin-top: 0;
    margin-bottom: 16px;
  }
  
  .calendar {
    width: 100%;
  }
  
  .calendar-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  
  .month-selector {
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: 600;
    color: #424242;
  }
  
  .arrow-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    margin: 0 4px;
    color: #424242;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    margin-bottom: 8px;
  }
  
  .weekday {
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    color: #757575;
    padding: 8px 0;
  }
  
  .days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
  }
  
  .day {
    position: relative;
    height: 50px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #F5F5F5;
    transition: all 0.2s ease;
  }
  
  .day-number {
    font-size: 16px;
    font-weight: 500;
    color: #424242;
  }
  
  .other-month {
    opacity: 0.4;
  }
  
  .attended {
    background-color: rgba(72, 207, 203, 0.2);
  }
  
  .today {
    border: 2px solid #229799;
  }
  
  .attendance-mark {
    position: absolute;
    bottom: 4px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #229799;
  }
  
  /* 통계 섹션 */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }
  
  .stats-card {
    background-color: white;
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
    margin-bottom: 8px;
  }
  
  .points-info {
    font-size: 12px;
    color: #757575;
  }
  
  .progress-bar {
    width: 100%;
    height: 4px;
    background-color: #E0E0E0;
    border-radius: 2px;
    margin-top: 8px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background-color: #48CFCB;
    border-radius: 2px;
  }
  
  .streak-days {
    display: flex;
    gap: 8px;
    margin-top: 8px;
  }
  
  .streak-day {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #F5F5F5;
  }
  
  .streak-day.attended {
    background-color: #48CFCB;
  }
  
  /* 출석 혜택 정보 */
  .benefits-section {
    background-color: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border: 1px solid #F0F0F0;
  }
  
  .benefits-card {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .benefit-item {
    display: flex;
    align-items: flex-start;
    padding: 16px;
    background-color: #F8F8F8;
    border-radius: 8px;
  }
  
  .benefit-icon {
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
  
  .benefit-info {
    flex: 1;
  }
  
  .benefit-title {
    font-weight: 600;
    color: #424242;
    margin-bottom: 4px;
  }
  
  .benefit-desc {
    font-size: 14px;
    color: #666;
  }
  
  /* 반응형 설정 */
  @media (max-width: 1200px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 768px) {
    .attendance-content {
      padding: 24px;
    }
    
    .page-header {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .date-display {
      margin-top: 8px;
    }
    
    .attendance-card {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .attendance-status {
      margin-bottom: 16px;
    }
    
    .time-info {
      margin-bottom: 16px;
    }
    
    .check-button {
      width: 100%;
    }
    
    .stats-grid {
      grid-template-columns: 1fr;
    }
    
    .day {
      height: 40px;
    }
    
    .day-number {
      font-size: 14px;
    }
  }
  </style>
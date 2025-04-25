<template>
    <div class="reviewer-point-history">
      <div class="page-layout">
        <!-- 왼쪽 사이드바 -->
        <ReviewerSidebar />
        
        <!-- 메인 콘텐츠 영역 -->
        <div class="points-content">
          <!-- 페이지 헤더 -->
          <div class="page-header">
            <h1 class="page-title">포인트 내역</h1>
          </div>
  
          <!-- 포인트 요약 카드 -->
          <div class="points-summary-card">
            <div class="points-balance">
              <div class="balance-label">현재 보유 포인트</div>
              <div class="balance-value">{{ formatNumber(userPoints.balance) }} <span class="unit">P</span></div>
            </div>
            
            <div class="points-actions">
              <button 
                class="withdraw-button" 
                @click="showWithdrawModal = true"
                :disabled="userPoints.balance < 20000"
              >
                출금하기
              </button>
              <div class="withdraw-info" v-if="userPoints.balance < 20000">
                출금은 20,000P 이상부터 가능합니다
              </div>
            </div>
          </div>
  
          <!-- 탭 메뉴 -->
          <div class="tab-container">
            <div 
              class="tab-item" 
              :class="{ active: activeTab === 'earned' }"
              @click="activeTab = 'earned'"
            >
              적립 내역
            </div>
            <div 
              class="tab-item" 
              :class="{ active: activeTab === 'withdrawn' }"
              @click="activeTab = 'withdrawn'"
            >
              출금 내역
            </div>
          </div>
  
          <!-- 필터 및 검색 -->
          <div class="filter-row">
            <div class="date-filter">
              <select v-model="dateFilter" class="filter-select">
                <option value="all">전체 기간</option>
                <option value="1month">최근 1개월</option>
                <option value="3months">최근 3개월</option>
                <option value="6months">최근 6개월</option>
              </select>
            </div>
            
            <div class="type-filter" v-if="activeTab === 'earned'">
              <select v-model="typeFilter" class="filter-select">
                <option value="all">전체 유형</option>
                <option value="campaign">캠페인 보상</option>
                <option value="attendance">출석 보상</option>
                <option value="event">이벤트 보상</option>
              </select>
            </div>
            
            <div class="status-filter" v-if="activeTab === 'withdrawn'">
              <select v-model="statusFilter" class="filter-select">
                <option value="all">전체 상태</option>
                <option value="pending">처리중</option>
                <option value="completed">완료</option>
                <option value="failed">실패</option>
              </select>
            </div>
          </div>
  
          <!-- 적립 내역 탭 -->
          <div v-if="activeTab === 'earned'" class="tab-content">
            <div class="table-container">
              <table class="point-table">
                <thead>
                  <tr>
                    <th>날짜</th>
                    <th>내용</th>
                    <th>유형</th>
                    <th>포인트</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in filteredEarnedPoints" :key="index">
                    <td>{{ formatDate(item.date) }}</td>
                    <td>{{ item.description }}</td>
                    <td>
                      <span class="point-type" :class="item.type">
                        {{ getTypeLabel(item.type) }}
                      </span>
                    </td>
                    <td class="point-amount earned">+{{ formatNumber(item.amount) }}P</td>
                  </tr>
                </tbody>
              </table>
              
              <div v-if="filteredEarnedPoints.length === 0" class="empty-state">
                <div class="empty-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#CCCCCC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 8V12" stroke="#CCCCCC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 16H12.01" stroke="#CCCCCC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="empty-text">적립 내역이 없습니다</div>
              </div>
            </div>
            
            <!-- 페이지네이션 -->
            <div class="pagination">
              <button class="page-button" @click="changePage(-1)" :disabled="currentPage === 1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <div class="page-info">{{ currentPage }} / {{ totalPages }}</div>
              <button class="page-button" @click="changePage(1)" :disabled="currentPage === totalPages">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
  
          <!-- 출금 내역 탭 -->
          <div v-if="activeTab === 'withdrawn'" class="tab-content">
            <div class="table-container">
              <table class="point-table">
                <thead>
                  <tr>
                    <th>신청일</th>
                    <th>출금 포인트</th>
                    <th>실수령액</th>
                    <th>계좌정보</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in filteredWithdrawnPoints" :key="index">
                    <td>{{ formatDate(item.requestDate) }}</td>
                    <td class="point-amount withdrawn">{{ formatNumber(item.pointAmount) }}P</td>
                    <td>{{ formatNumber(item.actualAmount) }}원</td>
                    <td>{{ item.bankInfo }}</td>
                    <td>
                      <span class="status-badge" :class="item.status">
                        {{ getStatusLabel(item.status) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              
              <div v-if="filteredWithdrawnPoints.length === 0" class="empty-state">
                <div class="empty-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#CCCCCC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 8V12" stroke="#CCCCCC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 16H12.01" stroke="#CCCCCC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="empty-text">출금 내역이 없습니다</div>
              </div>
            </div>
            
            <!-- 페이지네이션 -->
            <div class="pagination">
              <button class="page-button" @click="changePage(-1)" :disabled="currentPage === 1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <div class="page-info">{{ currentPage }} / {{ totalPages }}</div>
              <button class="page-button" @click="changePage(1)" :disabled="currentPage === totalPages">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- 포인트 정책 안내 -->
          <div class="point-policy-card">
            <h3 class="policy-title">포인트 정책 안내</h3>
            <div class="policy-content">
              <div class="policy-item">
                <div class="policy-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 16V12" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 8H12.01" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="policy-text">
                  <strong>출금 최소 금액:</strong> 출금은 20,000P 이상부터 만원 단위로 가능합니다.
                </div>
              </div>
              <div class="policy-item">
                <div class="policy-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M22 6L12 13L2 6" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="policy-text">
                  <strong>세금 공제:</strong> 관련법상 사업소득에 따른 세금 3.3%가 공제됩니다. (1,000P = 1,000원)
                </div>
              </div>
              <div class="policy-item">
                <div class="policy-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 6V12L16 14" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="policy-text">
                  <strong>처리 시간:</strong> 출금 신청 후 영업일 기준 2~3일 내에 처리됩니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 출금 모달 -->
      <div class="modal-overlay" v-if="showWithdrawModal" @click="showWithdrawModal = false">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">포인트 출금하기</h3>
            <button class="close-button" @click="showWithdrawModal = false">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6 6L18 18" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          
          <div class="modal-body">
            <div class="withdrawal-info">
              <div class="balance-row">
                <div class="info-label">현재 보유 포인트</div>
                <div class="info-value">{{ formatNumber(userPoints.balance) }}P</div>
              </div>
              
              <div class="withdraw-amount-input">
                <label for="withdrawAmount">출금 포인트</label>
                <div class="input-wrapper">
                  <input 
                    type="number" 
                    id="withdrawAmount" 
                    v-model="withdrawAmount" 
                    :min="20000" 
                    :max="userPoints.balance"
                    step="10000"
                  />
                  <span class="input-suffix">P</span>
                </div>
                <div class="input-note">최소 20,000P부터 만원 단위로 출금 가능</div>
              </div>
              
              <div class="amount-buttons">
                <button 
                  v-for="amount in [20000, 50000, 100000]" 
                  :key="amount" 
                  class="amount-button" 
                  @click="withdrawAmount = amount"
                  :disabled="amount > userPoints.balance"
                >
                  {{ formatNumber(amount) }}P
                </button>
                <button 
                  class="amount-button"
                  @click="withdrawAmount = Math.floor(userPoints.balance / 10000) * 10000"
                >
                  전액
                </button>
              </div>
              
              <div class="fee-calculation">
                <div class="calculation-row">
                  <div class="calc-label">출금 포인트</div>
                  <div class="calc-value">{{ formatNumber(withdrawAmount) }}P</div>
                </div>
                <div class="calculation-row">
                  <div class="calc-label">세금 공제 (3.3%)</div>
                  <div class="calc-value tax">-{{ formatNumber(Math.floor(withdrawAmount * 0.033)) }}원</div>
                </div>
                <div class="calculation-divider"></div>
                <div class="calculation-row total">
                  <div class="calc-label">실수령액</div>
                  <div class="calc-value">{{ formatNumber(Math.floor(withdrawAmount * 0.967)) }}원</div>
                </div>
              </div>
              
              <div class="form-group">
                <label for="bankName">은행명</label>
                <select id="bankName" v-model="bankInfo.bankName" class="form-input">
                  <option value="">선택하세요</option>
                  <option value="KB국민은행">KB국민은행</option>
                  <option value="신한은행">신한은행</option>
                  <option value="우리은행">우리은행</option>
                  <option value="하나은행">하나은행</option>
                  <option value="NH농협은행">NH농협은행</option>
                  <option value="카카오뱅크">카카오뱅크</option>
                  <option value="토스뱅크">토스뱅크</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="accountNumber">계좌번호</label>
                <input 
                  type="text" 
                  id="accountNumber" 
                  v-model="bankInfo.accountNumber" 
                  class="form-input"
                  placeholder="- 없이 숫자만 입력"
                />
              </div>
              
              <div class="form-group">
                <label for="accountHolder">예금주</label>
                <input 
                  type="text" 
                  id="accountHolder" 
                  v-model="bankInfo.accountHolder" 
                  class="form-input"
                  placeholder="예금주명 입력"
                />
              </div>
            </div>
            
            <div class="withdraw-agreement">
              <label class="agreement-checkbox">
                <input type="checkbox" v-model="agreeToTerms" />
                <span>포인트 출금 시 적용되는 세금 공제(3.3%)에 동의합니다.</span>
              </label>
            </div>
          </div>
          
          <div class="modal-footer">
            <button class="cancel-button" @click="showWithdrawModal = false">취소</button>
            <button 
              class="confirm-button" 
              @click="submitWithdrawal"
              :disabled="!canSubmitWithdrawal"
            >
              출금 신청
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import ReviewerSidebar from '@/components/ReviewerSidebar.vue';
  
  export default {
    name: 'ReviewerPointHistory',
    components: {
      ReviewerSidebar
    },
    data() {
      return {
        // 유저 포인트 정보
        userPoints: {
          balance: 38450
        },
        
        // 탭 관련
        activeTab: 'earned',
        
        // 필터 관련
        dateFilter: 'all',
        typeFilter: 'all',
        statusFilter: 'all',
        
        // 페이지네이션
        currentPage: 1,
        itemsPerPage: 10,
        
        // 모달 관련
        showWithdrawModal: false,
        withdrawAmount: 20000,
        agreeToTerms: false,
        
        // 은행 정보
        bankInfo: {
          bankName: '',
          accountNumber: '',
          accountHolder: ''
        },
        
        // 적립 내역 데이터
        earnedPoints: [
          { 
            date: '2025-04-23',
            description: '식품 리뷰 캠페인 참여 보상',
            type: 'campaign',
            amount: 5000
          },
          { 
            date: '2025-04-22',
            description: '출석체크 보상',
            type: 'attendance',
            amount: 50
          },
          { 
            date: '2025-04-21',
            description: '연속 출석 7일 보너스',
            type: 'attendance',
            amount: 100
          },
          { 
            date: '2025-04-20',
            description: '봄맞이 이벤트 참여 보상',
            type: 'event',
            amount: 2000
          },
          { 
            date: '2025-04-18',
            description: '화장품 리뷰 캠페인 참여 보상',
            type: 'campaign',
            amount: 8000
          },
          { 
            date: '2025-04-15',
            description: '신규 리뷰어 환영 보너스',
            type: 'event',
            amount: 3000
          },
          { 
            date: '2025-04-10',
            description: '전자기기 리뷰 캠페인 참여 보상',
            type: 'campaign',
            amount: 10000
          },
        ],
        
        // 출금 내역 데이터
        withdrawnPoints: [
          {
            requestDate: '2025-03-15',
            pointAmount: 20000,
            actualAmount: 19340,
            bankInfo: '신한은행 110-123-456789',
            status: 'completed',
            completedDate: '2025-03-17'
          },
          {
            requestDate: '2025-02-10',
            pointAmount: 30000,
            actualAmount: 29010,
            bankInfo: '신한은행 110-123-456789',
            status: 'completed',
            completedDate: '2025-02-12'
          },
          {
            requestDate: '2025-01-05',
            pointAmount: 25000,
            actualAmount: 24175,
            bankInfo: '신한은행 110-123-456789',
            status: 'completed',
            completedDate: '2025-01-07'
          }
        ]
      }
    },
    computed: {
      // 적립 내역 필터링
      filteredEarnedPoints() {
        let filtered = [...this.earnedPoints];
        
        // 날짜 필터
        if (this.dateFilter !== 'all') {
          const now = new Date();
          let monthsToSubtract = 1;
          
          if (this.dateFilter === '3months') monthsToSubtract = 3;
          if (this.dateFilter === '6months') monthsToSubtract = 6;
          
          const filterDate = new Date();
          filterDate.setMonth(now.getMonth() - monthsToSubtract);
          
          filtered = filtered.filter(item => new Date(item.date) >= filterDate);
        }
        
        // 유형 필터
        if (this.typeFilter !== 'all') {
          filtered = filtered.filter(item => item.type === this.typeFilter);
        }
        
        // 페이지네이션
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        
        return filtered.slice(start, end);
      },
      
      // 출금 내역 필터링
      filteredWithdrawnPoints() {
        let filtered = [...this.withdrawnPoints];
        
        // 날짜 필터
        if (this.dateFilter !== 'all') {
          const now = new Date();
          let monthsToSubtract = 1;
          
          if (this.dateFilter === '3months') monthsToSubtract = 3;
          if (this.dateFilter === '6months') monthsToSubtract = 6;
          
          const filterDate = new Date();
          filterDate.setMonth(now.getMonth() - monthsToSubtract);
          
          filtered = filtered.filter(item => new Date(item.requestDate) >= filterDate);
        }
        
        // 상태 필터
        if (this.statusFilter !== 'all') {
          filtered = filtered.filter(item => item.status === this.statusFilter);
        }
        
        // 페이지네이션
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        
        return filtered.slice(start, end);
      },
      
      // 총 페이지 수 계산
      totalPages() {
        const totalItems = this.activeTab === 'earned' 
          ? this.earnedPoints.length 
          : this.withdrawnPoints.length;
          
        return Math.ceil(totalItems / this.itemsPerPage);
      },
      
      // 출금 제출 가능 여부
      canSubmitWithdrawal() {
        return this.withdrawAmount >= 20000 && 
               this.withdrawAmount <= this.userPoints.balance && 
               this.withdrawAmount % 10000 === 0 &&
               this.bankInfo.bankName &&
               this.bankInfo.accountNumber &&
               this.bankInfo.accountHolder &&
               this.agreeToTerms;
      }
    },
    methods: {
      formatNumber(number) {
        return Number(number).toLocaleString();
      },
      formatDate(dateString) {
        const date = new Date(dateString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
      },
      getTypeLabel(type) {
        const types = {
          campaign: '캠페인',
          attendance: '출석',
          event: '이벤트'
        };
        return types[type] || type;
      },
      getStatusLabel(status) {
        const statuses = {
          pending: '처리중',
          completed: '완료',
          failed: '실패'
        };
        return statuses[status] || status;
      },
      changePage(direction) {
        const newPage = this.currentPage + direction;
        if (newPage >= 1 && newPage <= this.totalPages) {
          this.currentPage = newPage;
        }
      },
      submitWithdrawal() {
        // 출금 신청 처리 로직
        const withdrawal = {
          requestDate: new Date().toISOString().split('T')[0],
          pointAmount: this.withdrawAmount,
          actualAmount: Math.floor(this.withdrawAmount * 0.967),
          bankInfo: `${this.bankInfo.bankName} ${this.bankInfo.accountNumber}`,
          status: 'pending'
        };
        
        // 출금 내역에 추가
        this.withdrawnPoints.unshift(withdrawal);
        
        // 포인트 차감
        this.userPoints.balance -= this.withdrawAmount;
        
        // 모달 닫기
        this.showWithdrawModal = false;
        
        // 폼 초기화
        this.withdrawAmount = 20000;
        this.agreeToTerms = false;
        this.bankInfo = {
          bankName: '',
          accountNumber: '',
          accountHolder: ''
        };
        
        // 출금 탭으로 전환
        this.activeTab = 'withdrawn';
        this.currentPage = 1;
        
        // 성공 메시지 표시 (실제로는 토스트 등으로 구현)
        alert('출금 신청이 완료되었습니다. 영업일 기준 2-3일 내에 처리됩니다.');
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

.reviewer-point-history {
  background-color: #FFFFFF;
  min-height: 100vh;
}

.page-layout {
  display: flex;
  max-width: 1280px;
  margin: 0 auto;
}

.points-content {
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
  margin: 0;
}

/* 포인트 요약 카드 */
.points-summary-card {
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

.points-balance {
  display: flex;
  flex-direction: column;
}

.balance-label {
  font-size: 16px;
  color: #666;
  margin-bottom: 8px;
}

.balance-value {
  font-size: 32px;
  font-weight: 700;
  color: #229799;
}

.unit {
  font-size: 20px;
  font-weight: 400;
}

.withdraw-button {
  background-color: #229799;
  color: white;
  font-size: 16px;
  font-weight: 600;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.withdraw-button:hover {
  background-color: #1c7f81;
}

.withdraw-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.withdraw-info {
  font-size: 13px;
  color: #666;
  margin-top: 8px;
  text-align: center;
}

/* 탭 메뉴 */
.tab-container {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #E0E0E0;
}

.tab-item {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab-item.active {
  color: #229799;
  border-bottom-color: #229799;
  font-weight: 600;
}

.tab-item:hover:not(.active) {
  color: #424242;
  border-bottom-color: #E0E0E0;
}

/* 필터 */
.filter-row {
  display: flex;
  margin-bottom: 16px;
  gap: 12px;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  font-size: 14px;
  color: #424242;
  background-color: white;
}

/* 테이블 */
.table-container {
  margin-bottom: 20px;
  min-height: 400px;
}

.point-table {
  width: 100%;
  border-collapse: collapse;
}

.point-table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #424242;
  background-color: #F5F5F5;
  border-bottom: 1px solid #E0E0E0;
}

.point-table td {
  padding: 16px;
  border-bottom: 1px solid #F0F0F0;
  color: #424242;
}

.point-type {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
}

.point-type.campaign {
  background-color: rgba(72, 207, 203, 0.1);
  color: #229799;
}

.point-type.attendance {
  background-color: rgba(33, 150, 243, 0.1);
  color: #2196F3;
}

.point-type.event {
  background-color: rgba(156, 39, 176, 0.1);
  color: #9C27B0;
}

.point-amount {
  font-weight: 600;
}

.point-amount.earned {
  color: #229799;
}

.point-amount.withdrawn {
  color: #424242;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
}

.status-badge.pending {
  background-color: rgba(255, 193, 7, 0.1);
  color: #FFC107;
}

.status-badge.completed {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.status-badge.failed {
  background-color: rgba(244, 67, 54, 0.1);
  color: #F44336;
}

/* 빈 상태 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #999;
}

.empty-icon {
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
}

/* 페이지네이션 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.page-button {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #E0E0E0;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  color: #424242;
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  margin: 0 12px;
  font-size: 14px;
  color: #666;
}

/* 포인트 정책 카드 */
.point-policy-card {
  background-color: #F9F9F9;
  border-radius: 12px;
  padding: 24px;
  margin-top: 40px;
}

.policy-title {
  font-size: 18px;
  font-weight: 600;
  color: #424242;
  margin-top: 0;
  margin-bottom: 16px;
}

.policy-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.policy-item {
  display: flex;
  align-items: flex-start;
}

.policy-icon {
  margin-right: 16px;
  color: #229799;
}

.policy-text {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.policy-text strong {
  color: #424242;
}

/* 모달 */
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
  width: 500px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #E0E0E0;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #424242;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: 1px solid #E0E0E0;
  gap: 12px;
}

.cancel-button {
  padding: 10px 20px;
  border: 1px solid #E0E0E0;
  background-color: white;
  border-radius: 6px;
  color: #666;
  font-weight: 500;
  cursor: pointer;
}

.confirm-button {
  padding: 10px 20px;
  border: none;
  background-color: #229799;
  color: white;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
}

.confirm-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* 출금 모달 내용 */
.withdrawal-info {
  margin-bottom: 24px;
}

.balance-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #F0F0F0;
}

.info-label {
  font-size: 14px;
  color: #666;
}

.info-value {
  font-size: 20px;
  font-weight: 600;
  color: #229799;
}

.withdraw-amount-input {
  margin-bottom: 16px;
}

.withdraw-amount-input label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #424242;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #E0E0E0;
  border-radius: 6px;
  font-size: 16px;
}

.input-suffix {
  position: absolute;
  right: 16px;
  font-size: 16px;
  color: #666;
}

.input-note {
  margin-top: 4px;
  font-size: 13px;
  color: #666;
}

.amount-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.amount-button {
  flex: 1;
  padding: 8px;
  border: 1px solid #E0E0E0;
  background-color: white;
  border-radius: 4px;
  color: #424242;
  font-size: 14px;
  cursor: pointer;
}

.amount-button:hover {
  background-color: #F5F5F5;
}

.amount-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.fee-calculation {
  background-color: #F9F9F9;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.calculation-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.calculation-row.total {
  font-weight: 600;
  color: #424242;
}

.calc-label {
  font-size: 14px;
  color: #666;
}

.calc-value {
  font-size: 14px;
  color: #424242;
}

.calc-value.tax {
  color: #F44336;
}

.calculation-divider {
  height: 1px;
  background-color: #E0E0E0;
  margin: 12px 0;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #424242;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #E0E0E0;
  border-radius: 6px;
  font-size: 16px;
}

.withdraw-agreement {
  margin-top: 16px;
}

.agreement-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
}

.agreement-checkbox input {
  margin-top: 2px;
}

/* 반응형 설정 */
@media (max-width: 1200px) {
  .points-content {
    padding: 24px;
  }
}

@media (max-width: 768px) {
  .points-summary-card {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .points-balance {
    margin-bottom: 16px;
  }
  
  .points-actions {
    width: 100%;
  }
  
  .withdraw-button {
    width: 100%;
  }
  
  .point-table th:nth-child(3),
  .point-table td:nth-child(3) {
    display: none;
  }
  
  .fee-calculation {
    font-size: 14px;
  }
  
  .amount-buttons {
    flex-wrap: wrap;
  }
  
  .amount-button {
    flex-basis: calc(50% - 4px);
  }
}
</style>
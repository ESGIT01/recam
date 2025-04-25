<template>
    <div class="reviewer-penalty">
      <div class="page-layout">
        <!-- 왼쪽 사이드바 -->
        <ReviewerSidebar />
        
        <!-- 메인 콘텐츠 영역 -->
        <div class="penalty-content">
          <!-- 페이지 헤더 -->
          <div class="page-header">
            <h1 class="page-title">페널티 관리</h1>
          </div>
  
          <!-- 페널티 상태 요약 -->
          <div class="penalty-summary-card">
            <div class="penalty-status">
              <div class="status-label">현재 상태</div>
              <div class="status-value" :class="penaltyStatusClass">{{ penaltyStatusText }}</div>
            </div>
            
            <div class="penalty-info">
              <div class="info-item">
                <div class="info-value">{{ activeCount }}</div>
                <div class="info-label">활성 페널티</div>
              </div>
              <div class="info-item">
                <div class="info-value">{{ expiringCount }}</div>
                <div class="info-label">7일 내 만료</div>
              </div>
              <div class="info-item">
                <div class="info-value">{{ expiredCount }}</div>
                <div class="info-label">만료된 페널티</div>
              </div>
            </div>
          </div>
  
          <!-- 페널티 정책 안내 -->
          <div class="penalty-policy-card">
            <h2 class="section-title">페널티 정책 안내</h2>
            <div class="policy-items">
              <div class="policy-item">
                <div class="policy-icon warn">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 8V12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 16H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="policy-content">
                  <h3 class="policy-title">선정 후 미참여</h3>
                  <p class="policy-description">캠페인 선정 후 참여하지 않은 경우 30일간 캠페인 신청이 제한됩니다.</p>
                </div>
              </div>
              
              <div class="policy-item">
                <div class="policy-icon warn">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 8V12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 16H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="policy-content">
                  <h3 class="policy-title">기한 초과 리뷰 작성</h3>
                  <p class="policy-description">리뷰 작성 기한이 지난 후 리뷰를 작성한 경우 14일간 캠페인 신청이 제한됩니다.</p>
                </div>
              </div>
              
              <div class="policy-item">
                <div class="policy-icon critical">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M15 9L9 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9 9L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="policy-content">
                  <h3 class="policy-title">체험 후 리뷰 미작성</h3>
                  <p class="policy-description">체험 후 리뷰를 작성하지 않은 경우 60일간 캠페인 신청이 제한됩니다.</p>
                </div>
              </div>
            </div>
          </div>
  
          <!-- 페널티 목록 -->
          <div class="penalty-list-section">
            <div class="section-header">
              <h2 class="section-title">페널티 내역</h2>
              <div class="filter-controls">
                <select v-model="statusFilter" class="filter-select">
                  <option value="all">전체 상태</option>
                  <option value="active">활성</option>
                  <option value="expired">만료</option>
                  <option value="appealed">이의신청</option>
                </select>
              </div>
            </div>
            
            <div class="penalty-list">
              <div v-for="(penalty, index) in filteredPenalties" :key="index" class="penalty-item">
                <div class="penalty-header">
                  <div class="penalty-type" :class="getPenaltyTypeClass(penalty.type)">
                    {{ getPenaltyTypeText(penalty.type) }}
                  </div>
                  <div class="penalty-status" :class="penalty.status">
                    {{ getPenaltyStatusText(penalty.status) }}
                  </div>
                </div>
                
                <div class="penalty-details">
                  <div class="campaign-info">
                    <div class="campaign-title">{{ penalty.campaignTitle }}</div>
                    <div class="penalty-date">
                      <span class="date-label">발생일:</span> {{ formatDate(penalty.issuedDate) }}
                    </div>
                    <div class="penalty-duration">
                      <span class="date-label">제한기간:</span> {{ penalty.duration }}일
                    </div>
                    <div class="penalty-expiry">
                      <span class="date-label">만료일:</span> {{ formatDate(penalty.expiryDate) }}
                    </div>
                  </div>
                  
                  <div class="penalty-reason">
                    <div class="reason-label">페널티 사유</div>
                    <div class="reason-text">{{ penalty.reason }}</div>
                  </div>
                </div>
                
                <div class="penalty-actions">
                  <button 
                    v-if="penalty.status === 'active' && !penalty.hasAppeal" 
                    class="appeal-button"
                    @click="openAppealModal(penalty)"
                  >
                    이의신청
                  </button>
                  <div v-else-if="penalty.status === 'appealed'" class="appeal-status">
                    이의신청 검토중
                  </div>
                  <div v-else-if="penalty.hasAppeal && penalty.appealRejected" class="appeal-rejected">
                    이의신청 반려
                  </div>
                </div>
              </div>
              
              <div v-if="filteredPenalties.length === 0" class="empty-state">
                <div class="empty-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#CCCCCC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 8V12" stroke="#CCCCCC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 16H12.01" stroke="#CCCCCC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div class="empty-text">페널티 내역이 없습니다</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 이의신청 모달 -->
      <div class="modal-overlay" v-if="showAppealModal" @click="closeAppealModal">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">이의신청 작성</h3>
            <button class="close-button" @click="closeAppealModal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6 6L18 18" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          
          <div class="modal-body">
            <div class="appeal-campaign-info">
              <div class="appeal-campaign-title">{{ currentPenalty ? currentPenalty.campaignTitle : '' }}</div>
              <div class="appeal-penalty-type">{{ currentPenalty ? getPenaltyTypeText(currentPenalty.type) : '' }}</div>
            </div>
            
            <div class="appeal-reason-section">
              <label for="appealReason">이의신청 사유 작성</label>
              <textarea 
                id="appealReason" 
                v-model="appealReason" 
                class="appeal-reason-input"
                placeholder="이의신청 사유를 상세히 작성해주세요. (최소 30자 이상)"
                rows="5"
              ></textarea>
              <div class="input-count" :class="{ 'error': appealReason.length < 30 }">
                {{ appealReason.length }} / 500자
              </div>
            </div>
            
            <div class="appeal-attachment-section">
              <label>증빙자료 첨부 (선택)</label>
              <div class="file-upload-container">
                <div class="file-upload-area" @click="triggerFileUpload">
                  <input 
                    type="file" 
                    ref="fileInput" 
                    style="display: none" 
                    @change="handleFileUpload"
                    accept="image/*, .pdf, .doc, .docx"
                    multiple
                  />
                  <div class="upload-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M7 10L12 15L17 10" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M12 15V3" stroke="#229799" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <div class="upload-text">
                    <div class="upload-title">파일을 끌어다 놓거나 클릭하여 업로드</div>
                    <div class="upload-description">JPG, PNG, PDF 파일 (최대 5MB)</div>
                  </div>
                </div>
                
                <div v-if="uploadedFiles.length > 0" class="uploaded-files-list">
                  <div v-for="(file, index) in uploadedFiles" :key="index" class="uploaded-file-item">
                    <div class="file-info">
                      <div class="file-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M14 2V8H20" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M16 13H8" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M16 17H8" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M10 9H9H8" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                      <div class="file-name">{{ file.name }}</div>
                    </div>
                    <button class="file-remove-button" @click="removeFile(index)">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M6 6L18 18" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="appeal-notice">
              <div class="notice-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 8V12" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 16H12.01" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="notice-content">
                <p>이의신청은 검토 후 처리되며 검토 기간은 최대 3영업일이 소요됩니다.</p>
                <p>허위 사실로 이의신청을 하는 경우 추가 페널티가 부과될 수 있습니다.</p>
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button class="cancel-button" @click="closeAppealModal">취소</button>
            <button 
              class="confirm-button" 
              @click="submitAppeal"
              :disabled="!canSubmitAppeal"
            >
              이의신청 제출
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import ReviewerSidebar from '@/components/ReviewerSidebar.vue';
  
  export default {
    name: 'ReviewerPenalty',
    components: {
      ReviewerSidebar
    },
    data() {
      return {
        // 필터링
        statusFilter: 'all',
        
        // 이의신청 모달
        showAppealModal: false,
        currentPenalty: null,
        appealReason: '',
        uploadedFiles: [],
        
        // 더미 데이터
        penalties: [
          {
            id: 1,
            type: 'no_participation',
            campaignTitle: '신제품 립스틱 체험단',
            issuedDate: '2025-04-15',
            duration: 30,
            expiryDate: '2025-05-15',
            reason: '캠페인 선정 후 제품 수령 및 체험 활동에 참여하지 않았습니다.',
            status: 'active',
            hasAppeal: false,
            appealRejected: false
          },
          {
            id: 2,
            type: 'late_review',
            campaignTitle: '프리미엄 헤어 트리트먼트 체험단',
            issuedDate: '2025-04-05',
            duration: 14,
            expiryDate: '2025-04-19',
            reason: '리뷰 작성 기한(2025-04-03)이 지난 후 리뷰를 작성하였습니다.',
            status: 'active',
            hasAppeal: false,
            appealRejected: false
          },
          {
            id: 3,
            type: 'no_review',
            campaignTitle: '신상 건강식품 체험단',
            issuedDate: '2025-03-10',
            duration: 60,
            expiryDate: '2025-05-09',
            reason: '체험 완료 후 리뷰 작성 기한(2025-03-08)까지 리뷰를 작성하지 않았습니다.',
            status: 'appealed',
            hasAppeal: true,
            appealRejected: false
          },
          {
            id: 4,
            type: 'no_participation',
            campaignTitle: '유기농 스킨케어 체험단',
            issuedDate: '2025-02-20',
            duration: 30,
            expiryDate: '2025-03-22',
            reason: '캠페인 선정 후 제품 수령 및 체험 활동에 참여하지 않았습니다.',
            status: 'expired',
            hasAppeal: false,
            appealRejected: false
          },
          {
            id: 5,
            type: 'late_review',
            campaignTitle: '프리미엄 디저트 체험단',
            issuedDate: '2025-02-05',
            duration: 14,
            expiryDate: '2025-02-19',
            reason: '리뷰 작성 기한(2025-02-03)이 지난 후 리뷰를 작성하였습니다.',
            status: 'active',
            hasAppeal: true,
            appealRejected: true
          }
        ]
      }
    },
    computed: {
      // 페널티 상태 관련
      activeCount() {
        return this.penalties.filter(p => p.status === 'active').length;
      },
      expiringCount() {
        const now = new Date();
        const oneWeekLater = new Date();
        oneWeekLater.setDate(now.getDate() + 7);
        
        return this.penalties.filter(p => {
          if (p.status !== 'active') return false;
          const expiryDate = new Date(p.expiryDate);
          return expiryDate <= oneWeekLater && expiryDate > now;
        }).length;
      },
      expiredCount() {
        return this.penalties.filter(p => p.status === 'expired').length;
      },
      penaltyStatusText() {
        if (this.activeCount === 0) return '정상';
        return '제한됨';
      },
      penaltyStatusClass() {
        return this.activeCount === 0 ? 'normal' : 'restricted';
      },
      
      // 필터링된 페널티 목록
      filteredPenalties() {
        if (this.statusFilter === 'all') return this.penalties;
        return this.penalties.filter(p => p.status === this.statusFilter);
      },
      
      // 이의신청 제출 가능 여부
      canSubmitAppeal() {
        return this.appealReason.length >= 30;
      }
    },
    methods: {
      formatDate(dateString) {
        const date = new Date(dateString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
      },
      getPenaltyTypeClass(type) {
        const classes = {
          'no_participation': 'type-no-participation',
          'late_review': 'type-late-review',
          'no_review': 'type-no-review'
        };
        return classes[type] || '';
      },
      getPenaltyTypeText(type) {
        const texts = {
          'no_participation': '선정 후 미참여',
          'late_review': '기한 초과 리뷰',
          'no_review': '리뷰 미작성'
        };
        return texts[type] || '알 수 없음';
      },
      getPenaltyStatusText(status) {
        const texts = {
          'active': '활성',
          'expired': '만료됨',
          'appealed': '이의신청 중'
        };
        return texts[status] || '알 수 없음';
      },
      openAppealModal(penalty) {
        this.currentPenalty = penalty;
        this.appealReason = '';
        this.uploadedFiles = [];
        this.showAppealModal = true;
      },
      closeAppealModal() {
        this.showAppealModal = false;
        this.currentPenalty = null;
        this.appealReason = '';
        this.uploadedFiles = [];
      },
      triggerFileUpload() {
        this.$refs.fileInput.click();
      },
      handleFileUpload(event) {
        const files = event.target.files;
        if (!files || files.length === 0) return;
        
        // 최대 3개 파일로 제한
        if (this.uploadedFiles.length + files.length > 3) {
          alert('최대 3개의 파일만 첨부할 수 있습니다.');
          return;
        }
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          
          // 파일 크기 검사 (최대 5MB)
          if (file.size > 5 * 1024 * 1024) {
            alert(`${file.name} 파일의 크기가 5MB를 초과합니다.`);
            continue;
          }
          
          this.uploadedFiles.push(file);
        }
        
        // 파일 input 초기화
        this.$refs.fileInput.value = '';
      },
      removeFile(index) {
        this.uploadedFiles.splice(index, 1);
      },
      submitAppeal() {
        if (!this.canSubmitAppeal) return;
        
        // 실제로는 API 호출로 처리
        // 여기서는 더미 데이터 업데이트
        if (this.currentPenalty) {
          const index = this.penalties.findIndex(p => p.id === this.currentPenalty.id);
          if (index !== -1) {
            this.penalties[index].status = 'appealed';
            this.penalties[index].hasAppeal = true;
          }
        }
        
        // 모달 닫기
        this.closeAppealModal();
        
        // 성공 메시지 표시
        alert('이의신청이 접수되었습니다. 검토까지 최대 3영업일이 소요됩니다.');
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
  
  .reviewer-penalty {
    background-color: #FFFFFF;
    min-height: 100vh;
  }
  
  .page-layout {
    display: flex;
    max-width: 1280px;
    margin: 0 auto;
  }
  
  .penalty-content {
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
  
  /* 페널티 상태 요약 카드 */
  .penalty-summary-card {
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
  
  .penalty-status {
    display: flex;
    flex-direction: column;
  }
  
  .status-label {
    font-size: 16px;
    color: #666;
    margin-bottom: 8px;
  }
  
  .status-value {
    font-size: 32px;
    font-weight: 700;
  }
  
  .status-value.normal {
    color: #4CAF50;
  }
  
  .status-value.restricted {
    color: #F44336;
  }
  
  .penalty-info {
    display: flex;
    gap: 24px;
  }
  
  .info-item {
    text-align: center;
  }
  
  .info-value {
    font-size: 24px;
    font-weight: 700;
    color: #424242;
    margin-bottom: 4px;
  }
  
  .info-label {
    font-size: 14px;
    color: #666;
  }
  
  /* 페널티 정책 카드 */
  .penalty-policy-card {
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
  
  .policy-items {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .policy-item {
    display: flex;
    align-items: flex-start;
    padding: 16px;
    background-color: #F9F9F9;
    border-radius: 8px;
  }
  
  .policy-icon {
    width: 40px;
    height: 40px;
    min-width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin-right: 16px;
  }
  
  .policy-icon.warn {
    background-color: rgba(245, 158, 11, 0.1);
    color: #F59E0B;
  }
  
  .policy-icon.critical {
    background-color: rgba(244, 67, 54, 0.1);
    color: #F44336;
  }
  
  .policy-content {
    flex: 1;
  }
  
  .policy-title {
    font-size: 16px;
    font-weight: 600;
    color: #424242;
    margin: 0 0 8px 0;
  }
  
  .policy-description {
    font-size: 14px;
    color: #666;
    margin: 0;
    line-height: 1.5;
  }
  
  /* 페널티 목록 섹션 */
  .penalty-list-section {
    background-color: white;
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
  
  .filter-select {
    padding: 8px 12px;
    border: 1px solid #E0E0E0;
    border-radius: 4px;
    font-size: 14px;
    color: #424242;
    background-color: white;
  }
  
  .penalty-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .penalty-item {
    border: 1px solid #E0E0E0;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .penalty-header {
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;
    background-color: #F5F5F5;
  }
  
  .penalty-type {
    font-size: 14px;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 4px;
  }
  
  .type-no-participation {
    background-color: rgba(244, 67, 54, 0.1);
    color: #F44336;
  }
  
  .type-late-review {
    background-color: rgba(255, 152, 0, 0.1);
    color: #FF9800;
  }
  
  .type-no-review {
    background-color: rgba(244, 67, 54, 0.1);
    color: #F44336;
  }
  
  .penalty-status {
    font-size: 14px;
    font-weight: 500;
    padding: 4px 8px;
    border-radius: 4px;
  }
  
  .penalty-status.active {
    background-color: rgba(244, 67, 54, 0.1);
    color: #F44336;
  }
  
  .penalty-status.expired {
    background-color: rgba(158, 158, 158, 0.1);
    color: #757575;
  }
  
  .penalty-status.appealed {
    background-color: rgba(33, 150, 243, 0.1);
    color: #2196F3;
  }
  
  .penalty-details {
    padding: 16px;
    border-bottom: 1px solid #E0E0E0;
  }
  
  .campaign-info {
    margin-bottom: 16px;
  }
  
  .campaign-title {
    font-size: 16px;
    font-weight: 600;
    color: #424242;
    margin-bottom: 8px;
  }
  
  .penalty-date, .penalty-duration, .penalty-expiry {
    font-size: 14px;
    color: #666;
    margin-bottom: 4px;
  }
  
  .date-label {
    color: #8F8F8F;
    margin-right: 4px;
  }
  
  .penalty-reason {
    background-color: #F9F9F9;
    padding: 12px;
    border-radius: 4px;
  }
  
  .reason-label {
    font-size: 14px;
    font-weight: 600;
    color: #424242;
    margin-bottom: 8px;
  }
  
  .reason-text {
    font-size: 14px;
    color: #666;
    line-height: 1.5;
  }
  
  .penalty-actions {
    padding: 12px 16px;
    display: flex;
    justify-content: flex-end;
  }
  
  .appeal-button {
    background-color: #229799;
    color: white;
    font-size: 14px;
    font-weight: 500;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .appeal-button:hover {
    background-color: #1c7f81;
  }
  
  .appeal-status {
    font-size: 14px;
    color: #2196F3;
  }
  
  .appeal-rejected {
    font-size: 14px;
    color: #757575;
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
    width: 600px;
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
  
  /* 이의신청 모달 내용 */
  .appeal-campaign-info {
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #E0E0E0;
  }
  
  .appeal-campaign-title {
    font-size: 16px;
    font-weight: 600;
    color: #424242;
    margin-bottom: 8px;
  }
  
  .appeal-penalty-type {
    display: inline-block;
    font-size: 14px;
    padding: 4px 8px;
    border-radius: 4px;
    background-color: rgba(244, 67, 54, 0.1);
    color: #F44336;
  }
  
  .appeal-reason-section {
    margin-bottom: 20px;
  }
  
  .appeal-reason-section label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #424242;
    margin-bottom: 8px;
  }
  
  .appeal-reason-input {
    width: 100%;
    padding: 12px;
    border: 1px solid #E0E0E0;
    border-radius: 6px;
    font-size: 14px;
    resize: vertical;
  }
  
  .input-count {
    text-align: right;
    font-size: 13px;
    color: #8F8F8F;
    margin-top: 4px;
  }
  
  .input-count.error {
    color: #F44336;
  }
  
  .appeal-attachment-section {
    margin-bottom: 20px;
  }
  
  .appeal-attachment-section label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #424242;
    margin-bottom: 8px;
  }
  
  .file-upload-container {
    margin-bottom: 16px;
  }
  
  .file-upload-area {
    border: 2px dashed #E0E0E0;
    border-radius: 8px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: border-color 0.2s;
  }
  
  .file-upload-area:hover {
    border-color: #229799;
  }
  
  .upload-icon {
    margin-bottom: 12px;
    color: #229799;
  }
  
  .upload-text {
    text-align: center;
  }
  
  .upload-title {
    font-size: 16px;
    font-weight: 500;
    color: #424242;
    margin-bottom: 4px;
  }
  
  .upload-description {
    font-size: 13px;
    color: #666;
  }
  
  .uploaded-files-list {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .uploaded-file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background-color: #F5F5F5;
    border-radius: 4px;
  }
  
  .file-info {
    display: flex;
    align-items: center;
  }
  
  .file-icon {
    margin-right: 8px;
  }
  
  .file-name {
    font-size: 14px;
    color: #424242;
  }
  
  .file-remove-button {
    background: none;
    border: none;
    cursor: pointer;
    color: #666;
  }
  
  .appeal-notice {
    background-color: #FFF8E1;
    border-radius: 8px;
    padding: 16px;
    display: flex;
    align-items: flex-start;
  }
  
  .notice-icon {
    margin-right: 12px;
    margin-top: 2px;
  }
  
  .notice-content {
    flex: 1;
    font-size: 14px;
    color: #755600;
  }
  
  .notice-content p {
    margin: 0 0 8px 0;
  }
  
  .notice-content p:last-child {
    margin-bottom: 0;
  }
  
  /* 반응형 설정 */
  @media (max-width: 1200px) {
    .penalty-content {
      padding: 24px;
    }
  }
  
  @media (max-width: 768px) {
    .penalty-summary-card {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .penalty-status {
      margin-bottom: 16px;
    }
    
    .penalty-info {
      width: 100%;
      justify-content: space-between;
    }
    
    .penalty-header {
      flex-direction: column;
      gap: 8px;
    }
    
    .upload-title {
      font-size: 14px;
    }
  }
  </style>
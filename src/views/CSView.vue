<template>
  <div class="cs-view">
    <div class="container">
      <div class="content-layout">
        <!-- 사이드바 -->
        <SideBar />
        
        <div class="main-content">
          <div class="cs-header">
            <h1 class="cs-title">고객센터</h1>
            <p class="cs-description">서비스 이용 중 궁금한 점이 있으시면 아래 내용을 확인하거나 문의해주세요.</p>
          </div>
          
          <!-- 탭 메뉴 -->
          <div class="cs-tabs">
            <button 
              class="cs-tab-button" 
              :class="{ 'active': activeTab === 'faq' }"
              @click="activeTab = 'faq'"
            >
              <span class="tab-icon">❓</span>
              자주 묻는 질문 (FAQ)
            </button>
            <button 
              class="cs-tab-button" 
              :class="{ 'active': activeTab === 'inquiry' }"
              @click="activeTab = 'inquiry'"
            >
              <span class="tab-icon">✉️</span>
              1:1 문의하기
            </button>
          </div>
          
          <!-- FAQ 컨텐츠 -->
          <div v-if="activeTab === 'faq'" class="tab-content faq-content">
            <!-- FAQ 카테고리 선택 -->
            <div class="faq-category-tabs">
              <button 
                v-for="(category, index) in faqCategories" 
                :key="index"
                class="category-tab" 
                :class="{ 'active': activeFaqCategory === category.value }"
                @click="activeFaqCategory = category.value"
              >
                {{ category.name }}
              </button>
            </div>
            
            <!-- FAQ 검색 -->
            <div class="faq-search">
              <input 
                type="text"
                v-model="faqSearchQuery" 
                placeholder="궁금한 내용을 검색해보세요" 
                class="search-input"
                @keyup.enter="searchFaq"
              />
              <button class="search-button" @click="searchFaq">
                검색
              </button>
            </div>
            
            <!-- FAQ 리스트 -->
            <div class="faq-list">
              <div 
                v-for="(faq, index) in filteredFaqs" 
                :key="index"
                class="faq-item"
              >
                <div 
                  class="faq-question" 
                  @click="toggleFaq(index)"
                  :class="{ 'active': openFaqs.includes(index) }"
                >
                  <span class="question-mark">Q</span>
                  <span class="question-text">{{ faq.question }}</span>
                  <span class="toggle-icon">{{ openFaqs.includes(index) ? '−' : '+' }}</span>
                </div>
                <div 
                  v-if="openFaqs.includes(index)" 
                  class="faq-answer"
                >
                  <span class="answer-mark">A</span>
                  <div class="answer-content" v-html="faq.answer"></div>
                </div>
              </div>
              
              <!-- 결과 없음 표시 -->
              <div v-if="filteredFaqs.length === 0" class="no-result">
                <p>검색 결과가 없습니다. 다른 키워드로 검색해보세요.</p>
              </div>
            </div>
          </div>
          
          <!-- 1:1 문의하기 컨텐츠 -->
          <div v-if="activeTab === 'inquiry'" class="tab-content inquiry-content">
            <div class="inquiry-intro">
              <h3>1:1 문의하기</h3>
              <p>아래 양식을 작성하여 문의해주시면 빠른 시일 내에 답변 드리겠습니다.</p>
              <div class="note-box">
                <p><strong>운영시간:</strong> 평일 오전 10:00 ~ 오후 6:00 (주말 및 공휴일 제외)</p>
                <p>문의량이 많을 경우 답변이 지연될 수 있습니다.</p>
              </div>
            </div>
            
            <form class="inquiry-form" @submit.prevent="submitInquiry">
              <div class="form-group">
                <label for="inquiry-category">문의 유형</label>
                <select id="inquiry-category" v-model="inquiryForm.category" required>
                  <option value="">문의 유형을 선택해주세요</option>
                  <option value="account">계정 관련</option>
                  <option value="campaign">캠페인 관련</option>
                  <option value="payment">결제 관련</option>
                  <option value="reviewer">리뷰어 관련</option>
                  <option value="advertiser">광고주 관련</option>
                  <option value="etc">기타 문의</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="inquiry-title">제목</label>
                <input 
                  type="text" 
                  id="inquiry-title" 
                  v-model="inquiryForm.title" 
                  placeholder="문의 제목을 입력해주세요" 
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="inquiry-content">내용</label>
                <textarea 
                  id="inquiry-content" 
                  v-model="inquiryForm.content" 
                  placeholder="문의 내용을 자세히 입력해주세요" 
                  rows="6" 
                  required
                ></textarea>
              </div>
              
              <div class="form-group">
                <label for="inquiry-email">이메일</label>
                <input 
                  type="email" 
                  id="inquiry-email" 
                  v-model="inquiryForm.email" 
                  placeholder="답변 받으실 이메일을 입력해주세요" 
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="inquiry-file">첨부파일 (선택)</label>
                <input type="file" id="inquiry-file" @change="handleFileUpload" />
                <p class="file-help">JPG, PNG, PDF 파일 (최대 5MB)</p>
              </div>
              
              <div class="form-agreement">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="inquiryForm.agreement" required />
                  <span>개인정보 수집 및 이용에 동의합니다.</span>
                </label>
                <button type="button" class="agreement-detail-btn" @click="showAgreementDetail = true">자세히 보기</button>
              </div>
              
              <div class="form-actions">
                <button type="submit" class="submit-btn" :disabled="!inquiryForm.agreement">문의하기</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 개인정보 수집 동의 모달 -->
    <div v-if="showAgreementDetail" class="modal-overlay" @click="showAgreementDetail = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>개인정보 수집 및 이용 동의</h3>
          <button class="modal-close" @click="showAgreementDetail = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="agreement-content">
            <h4>1. 수집하는 개인정보 항목</h4>
            <p>- 이메일 주소</p>
            <p>- 문의 내용에 포함된 개인정보</p>
            
            <h4>2. 수집 및 이용 목적</h4>
            <p>- 문의에 대한 답변 및 안내</p>
            <p>- 서비스 개선을 위한 통계 및 분석 자료</p>
            
            <h4>3. 보유 및 이용기간</h4>
            <p>- 문의 해결 후 3개월</p>
            <p>- 관계 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관</p>
            
            <h4>4. 동의 거부권 및 거부 시 불이익</h4>
            <p>- 개인정보 수집 및 이용 동의를 거부할 권리가 있습니다.</p>
            <p>- 동의를 거부할 경우 문의 접수 및 답변이 제한됩니다.</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="agree-btn" @click="confirmAgreement">동의합니다</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import SideBar from '@/components/SideBar.vue';

export default {
  name: 'CSView',
  components: {
    SideBar
  },
  setup() {
    // 탭 관리
    const activeTab = ref('faq');
    
    // FAQ 관리
    const faqCategories = [
      { value: 'all', name: '전체' },
      { value: 'account', name: '계정' },
      { value: 'campaign', name: '캠페인' },
      { value: 'payment', name: '결제' },
      { value: 'reviewer', name: '리뷰어' },
      { value: 'advertiser', name: '광고주' }
    ];
    
    const activeFaqCategory = ref('all');
    const faqSearchQuery = ref('');
    const openFaqs = ref([]);
    
    // FAQ 목록 (실제로는 API에서 가져와야 함)
    const faqs = ref([
      {
        id: 1,
        category: 'account',
        question: '회원가입은 어떻게 하나요?',
        answer: '홈페이지 상단의 <strong>회원가입</strong> 버튼을 클릭하여 필요한 정보를 입력하시면 가입이 완료됩니다. 소셜 계정(카카오, 네이버, 구글)을 통한 간편 가입도 가능합니다.'
      },
      {
        id: 2,
        category: 'account',
        question: '아이디/비밀번호를 잊어버렸어요.',
        answer: '로그인 페이지에서 <strong>아이디 찾기</strong> 또는 <strong>비밀번호 찾기</strong>를 통해 가입 시 등록한 이메일로 인증 후 확인/재설정이 가능합니다.'
      },
      {
        id: 3,
        category: 'campaign',
        question: '캠페인 신청 후 선정 결과는 언제 알 수 있나요?',
        answer: '캠페인 모집 마감일로부터 평균 3~5일 이내에 선정 결과가 발표됩니다. 결과는 마이페이지와 등록하신 이메일로 안내드립니다.'
      },
      {
        id: 4,
        category: 'campaign',
        question: '캠페인 신청을 취소하고 싶어요.',
        answer: '캠페인 모집 기간 내에는 마이페이지 > 캠페인 신청 내역에서 취소가 가능합니다. 모집 마감 이후에는 취소가 불가능하니 신중하게 신청해주세요.'
      },
      {
        id: 5,
        category: 'payment',
        question: '포인트는 어떻게 적립되나요?',
        answer: '캠페인 리뷰 작성 완료 및 승인 후 자동으로 적립됩니다. 적립된 포인트는 마이페이지 > 포인트 내역에서 확인 가능합니다.'
      },
      {
        id: 6,
        category: 'payment',
        question: '포인트 출금은 어떻게 하나요?',
        answer: '마이페이지 > 포인트 > 출금신청에서 최소 10,000포인트(1만원)부터 출금 신청이 가능합니다. 출금 시 등록된 계좌로 영업일 기준 3일 이내 입금됩니다.'
      },
      {
        id: 7,
        category: 'reviewer',
        question: '리뷰어 등급은 어떻게 결정되나요?',
        answer: '리뷰어 등급은 활동 이력, 리뷰 품질, 마감일 준수율 등을 종합적으로 평가하여 책정됩니다. 자세한 등급 기준은 <a href="/guide?type=reviewer">리뷰어 이용가이드</a>에서 확인하실 수 있습니다.'
      },
      {
        id: 8,
        category: 'reviewer',
        question: '리뷰 작성 기한이 지났어요. 어떻게 해야 하나요?',
        answer: '리뷰 작성 기한을 준수하는 것이 중요합니다. 부득이한 사유로 기한 내 작성이 어려운 경우, 기한 전에 고객센터로 연락주시기 바랍니다. 기한이 지난 경우 패널티가 부과될 수 있습니다.'
      },
      {
        id: 9,
        category: 'advertiser',
        question: '광고주로 가입하려면 어떻게 해야 하나요?',
        answer: '홈페이지에서 기업회원으로 가입 후, 사업자등록증 인증을 완료하시면 광고주 계정으로 전환됩니다. 자세한 내용은 <a href="/guide?type=advertiser">광고주 이용가이드</a>를 참고해주세요.'
      },
      {
        id: 10,
        category: 'advertiser',
        question: '캠페인 비용은 어떻게 산정되나요?',
        answer: '캠페인 유형, 모집 인원, 제공 제품/서비스의 가치, 추가 옵션 등에 따라 비용이 산정됩니다. 정확한 견적은 캠페인 등록 시 확인 가능하며, 기업 담당자와 상담도 가능합니다.'
      }
    ]);
    
    // 필터링된 FAQ 목록
    const filteredFaqs = computed(() => {
      let result = [...faqs.value];
      
      // 카테고리 필터링
      if (activeFaqCategory.value !== 'all') {
        result = result.filter(faq => faq.category === activeFaqCategory.value);
      }
      
      // 검색어 필터링
      if (faqSearchQuery.value.trim() !== '') {
        const query = faqSearchQuery.value.toLowerCase();
        result = result.filter(faq => 
          faq.question.toLowerCase().includes(query) || 
          faq.answer.toLowerCase().includes(query)
        );
      }
      
      return result;
    });
    
    // FAQ 토글 함수
    const toggleFaq = (index) => {
      if (openFaqs.value.includes(index)) {
        openFaqs.value = openFaqs.value.filter(i => i !== index);
      } else {
        openFaqs.value.push(index);
      }
    };
    
    // FAQ 검색 함수
    const searchFaq = () => {
      // 검색 실행 (Vue의 computed를 사용하므로 별도 처리 필요 없음)
      // 검색 후 모든 FAQ 접기
      openFaqs.value = [];
    };
    
    // 1:1 문의 폼 관리
    const inquiryForm = ref({
      category: '',
      title: '',
      content: '',
      email: '',
      file: null,
      agreement: false
    });
    
    // 파일 업로드 처리
    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        // 파일 유형 및 크기 검사
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        
        if (!allowedTypes.includes(file.type)) {
          alert('JPG, PNG, PDF 파일만 업로드 가능합니다.');
          event.target.value = '';
          return;
        }
        
        if (file.size > maxSize) {
          alert('파일 크기는 최대 5MB까지 가능합니다.');
          event.target.value = '';
          return;
        }
        
        inquiryForm.value.file = file;
      }
    };
    
    // 개인정보 동의 관리
    const showAgreementDetail = ref(false);
    
    // 개인정보 동의 확인
    const confirmAgreement = () => {
      inquiryForm.value.agreement = true;
      showAgreementDetail.value = false;
    };
    
    // 문의 제출
    const submitInquiry = () => {
      // 실제로는 API를 통해 서버로 제출
      console.log('문의 제출:', inquiryForm.value);
      
      // 성공 메시지 및 폼 초기화
      alert('문의가 접수되었습니다. 빠른 시일 내에 답변 드리겠습니다.');
      inquiryForm.value = {
        category: '',
        title: '',
        content: '',
        email: '',
        file: null,
        agreement: false
      };
    };
    
    return {
      activeTab,
      faqCategories,
      activeFaqCategory,
      faqSearchQuery,
      openFaqs,
      filteredFaqs,
      toggleFaq,
      searchFaq,
      inquiryForm,
      handleFileUpload,
      showAgreementDetail,
      confirmAgreement,
      submitInquiry
    };
  }
};
</script>

<style scoped>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

/* 브랜드 컬러 변수 */
:root {
  --primary-light: #F5F5F5;
  --primary: #48CFCB;
  --primary-dark: #229799;
  --text-dark: #424242;
}

.cs-view {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  background-color: #FAFAFA;
  min-height: 100vh;
  padding-bottom: 60px;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 콘텐츠 레이아웃 */
.content-layout {
  display: flex;
  gap: 30px;
  padding-top: 30px;
}

.main-content {
  flex: 1;
  min-width: 0; /* flexbox 내에서 overflow 방지 */
}

/* 고객센터 헤더 */
.cs-header {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 30px;
  margin-bottom: 30px;
}

.cs-title {
  font-size: 26px;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0 0 10px;
}

.cs-description {
  font-size: 16px;
  color: #666;
  margin: 0;
}

/* 탭 스타일 */
.cs-tabs {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.cs-tab-button {
  flex: 1;
  background-color: white;
  border: 1px solid #EEEEEE;
  border-radius: 8px;
  padding: 15px;
  font-family: 'Pretendard', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);
}

.cs-tab-button:hover {
  border-color: var(--primary);
}

.cs-tab-button.active {
  background-color: var(--primary-light);
  border-color: var(--primary);
  color: var(--primary-dark);
}

.tab-icon {
  font-size: 24px;
  margin-bottom: 5px;
}

/* 탭 콘텐츠 */
.tab-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 30px;
}

/* FAQ 스타일 */
.faq-category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.category-tab {
  background-color: #F5F5F5;
  border: 1px solid #EEEEEE;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-tab:hover {
  background-color: #EEEEEE;
}

.category-tab.active {
  background-color: var(--primary);
  border-color: var(--primary-dark);
  color: white;
}

.faq-search {
  display: flex;
  margin-bottom: 30px;
}

.search-input {
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #E0E0E0;
  border-radius: 6px 0 0 6px;
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
  outline: none;
}

.search-button {
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 0 6px 6px 0;
  padding: 0 20px;
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.search-button:hover {
  background-color: var(--primary-dark);
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.faq-item {
  border: 1px solid #EEEEEE;
  border-radius: 8px;
  overflow: hidden;
}

.faq-question {
  display: flex;
  align-items: flex-start;
  padding: 20px;
  background-color: #F9F9F9;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.faq-question:hover, .faq-question.active {
  background-color: #F0F9F9;
}

.question-mark, .answer-mark {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
  margin-right: 15px;
}

.question-mark {
  background-color: var(--primary-light);
  color: var(--primary-dark);
}

.answer-mark {
  background-color: #FEF2F2;
  color: #EF4444;
}

.question-text {
  flex: 1;
  font-size: 16px;
  font-weight: 500;
  color: var(--text-dark);
  line-height: 1.5;
  padding-top: 3px;
}

.toggle-icon {
  font-size: 20px;
  color: #999;
  margin-left: 10px;
}

.faq-answer {
  display: flex;
  align-items: flex-start;
  padding: 20px;
  border-top: 1px solid #EEEEEE;
  background-color: white;
}

.answer-content {
  flex: 1;
  font-size: 15px;
  line-height: 1.6;
  color: #555;
  padding-top: 3px;
}

.answer-content a {
  color: var(--primary-dark);
  text-decoration: none;
}

.answer-content a:hover {
  text-decoration: underline;
}

.no-result {
  text-align: center;
  padding: 30px;
  color: #888;
}

/* 1:1 문의 스타일 */
.inquiry-intro {
  margin-bottom: 30px;
}

.inquiry-intro h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0 0 10px;
}

.inquiry-intro p {
  font-size: 15px;
  color: #666;
  margin: 0 0 15px;
}

.note-box {
  background-color: #F9F9F9;
  border: 1px solid #EEEEEE;
  border-radius: 8px;
  padding: 15px 20px;
}

.note-box p {
  margin: 5px 0;
  font-size: 14px;
}

.inquiry-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-dark);
}

.form-group input, .form-group textarea, .form-group select {
  padding: 12px 15px;
  border: 1px solid #E0E0E0;
  border-radius: 6px;
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

.form-group input:focus, .form-group textarea:focus, .form-group select:focus {
  border-color: var(--primary);
}

.file-help {
  font-size: 12px;
  color: #888;
  margin: 5px 0 0;
}

.form-agreement {
  display: flex;
  align-items: center;
  gap: 10px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #555;
  cursor: pointer;
}

.agreement-detail-btn {
  background: none;
  border: none;
  font-size: 13px;
  color: var(--primary-dark);
  text-decoration: underline;
  cursor: pointer;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.submit-btn {
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 30px;
  font-family: 'Pretendard', sans-serif;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  background-color: var(--primary-dark);
}

.submit-btn:disabled {
  background-color: #CCCCCC;
  cursor: not-allowed;
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
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #EEEEEE;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  color: #888;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

.agreement-content {
  font-size: 14px;
  line-height: 1.6;
  color: #555;
}

.agreement-content h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-dark);
  margin: 20px 0 10px;
}

.agreement-content h4:first-child {
  margin-top: 0;
}

.agreement-content p {
  margin: 5px 0;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #EEEEEE;
  text-align: right;
}

.agree-btn {
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-family: 'Pretendard', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.agree-btn:hover {
  background-color: var(--primary-dark);
}

/* 반응형 스타일 */
@media (max-width: 991px) {
  .content-layout {
    flex-direction: column;
    gap: 20px;
  }
  
  .cs-header {
    padding: 20px;
  }
  
  .cs-title {
    font-size: 22px;
  }
  
  .cs-description {
    font-size: 15px;
  }
  
  .cs-tabs {
    flex-direction: column;
  }
  
  .tab-content {
    padding: 20px;
  }
}

@media (max-width: 767px) {
  .faq-category-tabs {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
  
  .faq-question, .faq-answer {
    padding: 15px;
  }
  
  .question-text {
    font-size: 15px;
  }
  
  .inquiry-intro h3 {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .cs-header {
    padding: 15px;
  }
  
  .cs-title {
    font-size: 20px;
  }
  
  .cs-tab-button {
    font-size: 14px;
    padding: 12px;
  }
  
  .tab-icon {
    font-size: 20px;
  }
  
  .faq-category-tabs {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  
  .category-tab {
    font-size: 13px;
    padding: 6px 12px;
  }
  
  .form-agreement {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .agreement-detail-btn {
    margin-left: 25px;
  }
}
</style>
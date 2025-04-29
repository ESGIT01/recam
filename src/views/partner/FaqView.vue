<!-- src/views/partner/FaqView.vue -->
<template>
    <div class="faq-view">
      <div class="page-header">
        <h1 class="page-title">자주 묻는 질문</h1>
        <div class="page-description">
          리뷰캠퍼스에 관한 가장 자주 묻는 질문들을 모았습니다. 원하는 답변을 찾지 못하셨다면 1:1 문의를 이용해주세요.
        </div>
      </div>
      
      <!-- 검색 컴포넌트 -->
      <faq-search 
        v-model="searchQuery"
        :popular-queries="popularQueries"
      />
      
      <!-- 카테고리 탭 메뉴 -->
      <div class="category-tabs">
        <button 
          class="tab-btn" 
          :class="{ active: activeCategory === 'all' }"
          @click="activeCategory = 'all'"
        >
          전체
        </button>
        <button 
          v-for="category in categories" 
          :key="category.id"
          class="tab-btn" 
          :class="{ active: activeCategory === category.id }"
          @click="activeCategory = category.id"
        >
          {{ category.title }}
        </button>
      </div>
      
      <!-- 검색 결과가 있는 경우 -->
      <div v-if="searchQuery && filteredFaqs.length > 0" class="search-results">
        <div class="results-header">
          <h2>"{{ searchQuery }}" 검색 결과</h2>
          <span class="results-count">{{ filteredFaqs.length }}개의 검색 결과</span>
        </div>
        <faq-item 
          v-for="faq in filteredFaqs" 
          :key="faq.id" 
          :question="faq.question" 
          :answer="faq.answer"
        />
      </div>
      
      <!-- 검색 결과가 없는 경우 -->
      <div v-else-if="searchQuery && filteredFaqs.length === 0" class="no-results">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p>"{{ searchQuery }}"에 대한 검색 결과가 없습니다</p>
        <p>다른 검색어를 입력하거나 아래 카테고리에서 찾아보세요</p>
      </div>
      
      <!-- 카테고리별 FAQ -->
      <div v-else>
        <div v-if="activeCategory === 'all'">
          <faq-category 
            v-for="category in categories" 
            :key="category.id"
            :title="category.title"
            :items="getFaqsByCategory(category.id)"
          />
        </div>
        <div v-else>
          <faq-category 
            v-for="category in categories.filter(c => c.id === activeCategory)" 
            :key="category.id"
            :title="category.title"
            :items="getFaqsByCategory(category.id)"
          />
        </div>
      </div>
      
      <!-- 문의하기 섹션 -->
      <div class="contact-section">
        <div class="contact-content">
          <h2>원하는 답변을 찾지 못하셨나요?</h2>
          <p>다른 궁금한 점이 있으시면 1:1 문의를 통해 질문해주세요. 빠른 시일 내에 답변 드리겠습니다.</p>
        </div>
        <router-link to="/partner/inquiry" class="contact-btn">
          1:1 문의하기
        </router-link>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import FaqSearch from '@/components/partner/faq/FaqSearch.vue';
  import FaqCategory from '@/components/partner/faq/FaqCategory.vue';
  import FaqItem from '@/components/partner/faq/FaqItem.vue';
  
  export default {
    name: 'FaqView',
    components: {
      FaqSearch,
      FaqCategory,
      FaqItem
    },
    setup() {
      const searchQuery = ref('');
      const activeCategory = ref('all');
      
      // 인기 검색어
      const popularQueries = [
        '결제 방법', '캠페인 등록', '리뷰어 선정', '환불 정책', '세금계산서'
      ];
      
      // 카테고리 데이터
      const categories = [
        { id: 'account', title: '계정 관련' },
        { id: 'campaign', title: '캠페인 관련' },
        { id: 'reviewer', title: '리뷰어 관련' },
        { id: 'payment', title: '결제 관련' }
      ];
      
      // FAQ 데이터
      const faqs = [
        {
          id: 1,
          categoryId: 'account',
          question: '회원가입은 어떻게 하나요?',
          answer: '회원가입은 리뷰캠퍼스 홈페이지 우측 상단의 <strong>회원가입</strong> 버튼을 통해 진행할 수 있습니다. 기업 회원의 경우 사업자등록증 정보가 필요하니 미리 준비해주세요. 가입 절차는 3단계로 간단하게 완료됩니다.'
        },
        {
          id: 2,
          categoryId: 'account',
          question: '비밀번호를 잊어버렸어요. 어떻게 찾을 수 있나요?',
          answer: '로그인 페이지에서 <strong>비밀번호 찾기</strong> 버튼을 클릭하시면 가입 시 등록한 이메일로 비밀번호 재설정 링크를 받을 수 있습니다. 메일이 오지 않는 경우 스팸함을 확인해보시고, 그래도 문제가 해결되지 않으면 고객센터로 문의해주세요.'
        },
        {
          id: 3,
          categoryId: 'account',
          question: '회원 정보는 어디서 수정할 수 있나요?',
          answer: '로그인 후 우측 상단의 프로필 아이콘을 클릭하면 나타나는 드롭다운 메뉴에서 <strong>계정 설정</strong>을 선택하시면 회원 정보를 수정할 수 있는 페이지로 이동합니다. 이메일 주소 변경 시에는 인증 과정이 필요합니다.'
        },
        {
          id: 4,
          categoryId: 'campaign',
          question: '캠페인 등록은 어떻게 하나요?',
          answer: '로그인 후 대시보드의 <strong>캠페인 등록</strong> 버튼을 클릭하시면 캠페인 등록 페이지로 이동합니다. 제품 정보, 리뷰어 모집 조건, 검색 키워드 등 필요한 정보를 입력하고 제출하시면 검토 후 승인됩니다. 캠페인 등록 가이드는 <a href="#" style="color: #229799;">여기</a>에서 확인하실 수 있습니다.'
        }
      ];
      
      // 카테고리별 FAQ 필터링
      const getFaqsByCategory = (categoryId) => {
        return faqs.filter(faq => faq.categoryId === categoryId);
      };
      
      // 검색 결과 필터링
      const filteredFaqs = computed(() => {
        if (!searchQuery.value) return [];
        
        const query = searchQuery.value.toLowerCase();
        return faqs.filter(faq => 
          faq.question.toLowerCase().includes(query) || 
          faq.answer.toLowerCase().includes(query)
        );
      });
      
      return {
        searchQuery,
        activeCategory,
        popularQueries,
        categories,
        faqs,
        filteredFaqs,
        getFaqsByCategory
      };
    }
};
  </script>
  
  <style scoped>
  .faq-view {
    width: 100%;
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  
  .page-header {
    margin-bottom: 32px;
  }
  
  .page-title {
    font-size: 28px;
    font-weight: 700;
    color: #424242;
    margin: 0 0 12px;
  }
  
  .page-description {
    font-size: 16px;
    color: #64748b;
    max-width: 700px;
  }
  
  .category-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 32px;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 8px;
  }
  
  .tab-btn {
    padding: 8px 16px;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
    color: #64748b;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .tab-btn:hover {
    background-color: #f8fafc;
    border-color: #cbd5e1;
  }
  
  .tab-btn.active {
    background-color: #229799;
    color: white;
    border-color: #229799;
  }
  
  .search-results {
    margin-bottom: 40px;
  }
  
  .results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .results-header h2 {
    font-size: 18px;
    font-weight: 600;
    color: #424242;
    margin: 0;
  }
  
  .results-count {
    font-size: 14px;
    color: #64748b;
  }
  
  .no-results {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 48px 0;
    text-align: center;
  }
  
  .no-results svg {
    color: #cbd5e1;
    margin-bottom: 16px;
  }
  
  .no-results p {
    margin: 0 0 8px;
    color: #64748b;
    font-size: 16px;
  }
  
  .contact-section {
    margin-top: 64px;
    padding: 32px;
    background-color: #F5F5F5;
    border-radius: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .contact-content h2 {
    font-size: 20px;
    font-weight: 600;
    color: #424242;
    margin: 0 0 8px;
  }
  
  .contact-content p {
    font-size: 16px;
    color: #64748b;
    margin: 0;
    max-width: 600px;
  }
  
  .contact-btn {
    display: inline-block;
    background-color: #229799;
    color: white;
    font-size: 16px;
    font-weight: 500;
    padding: 12px 24px;
    border-radius: 8px;
    text-decoration: none;
    transition: background-color 0.3s;
    white-space: nowrap;
  }
  
  .contact-btn:hover {
    background-color: #1a7a7c;
  }
  
  @media (max-width: 768px) {
    .contact-section {
      flex-direction: column;
      text-align: center;
      gap: 24px;
    }
    
    .contact-btn {
      width: 100%;
      text-align: center;
    }
  }
  </style>
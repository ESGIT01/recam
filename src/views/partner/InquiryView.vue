<!-- src/views/partner/InquiryView.vue -->
<template>
    <div class="inquiry-view">
      <div class="page-header">
        <h1 class="page-title">1:1 문의</h1>
        <div class="page-description">
          리뷰캠퍼스에 문의사항이 있으신가요? 1:1 문의를 통해 빠르게 답변을 받아보세요.
        </div>
      </div>
  
      <!-- 탭 메뉴 -->
      <div class="tabs">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'list' }"
          @click="activeTab = 'list'"
        >
          문의 내역
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'create' }"
          @click="activeTab = 'create'"
        >
          문의 작성
        </button>
      </div>
  
      <!-- 문의 목록 탭 -->
      <div v-if="activeTab === 'list'">
        <inquiry-list
          :inquiries="paginatedInquiries"
          :search-query="searchQuery"
          :status-filter="statusFilter"
          :category-filter="categoryFilter"
          :current-page="currentPage"
          :total-pages="totalPages"
          :displayed-pages="displayedPages"
          @update:search-query="updateSearchQuery"
          @update:status-filter="updateStatusFilter" 
          @update:category-filter="updateCategoryFilter"
          @view-detail="viewInquiryDetail"
          @change-page="changePage"
          @create-new="activeTab = 'create'"
        />
      </div>
  
      <!-- 문의 작성 탭 -->
      <div v-if="activeTab === 'create'">
        <inquiry-form
          :is-submitting="isSubmitting"
          @submit="submitInquiry"
          @cancel="activeTab = 'list'"
        />
      </div>
  
      <!-- 문의 상세 모달 -->
      <inquiry-detail-modal
        v-if="showDetailModal"
        :inquiry="selectedInquiry"
        @close="closeDetailModal"
        @create-new="activeTab = 'create'"
      />
  
      <!-- 성공 알림 -->
      <div v-if="showSuccessAlert" class="alert-overlay">
        <div class="alert-container success">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <div class="alert-message">
            <h4>문의가 성공적으로 제출되었습니다</h4>
            <p>빠른 시일 내에 답변 드리겠습니다</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import InquiryList from '@/components/partner/inquiry/InquiryList.vue';
  import InquiryForm from '@/components/partner/inquiry/InquiryForm.vue';
  import InquiryDetailModal from '@/components/partner/inquiry/InquiryDetailModal.vue';
  
  export default {
    name: 'InquiryView',
    components: {
      InquiryList,
      InquiryForm,
      InquiryDetailModal
    },
    setup() {
      // 탭 상태
      const activeTab = ref('list');
      
      // 검색 및 필터링 상태
      const searchQuery = ref('');
      const statusFilter = ref('all');
      const categoryFilter = ref('all');
      const currentPage = ref(1);
      const perPage = ref(5);
      
      // 모달 상태
      const showDetailModal = ref(false);
      const selectedInquiry = ref(null);
      
      // 제출 상태
      const isSubmitting = ref(false);
      const showSuccessAlert = ref(false);
      
      // 샘플 데이터 (실제로는 API에서 가져올 예정)
      const inquiries = ref([
        {
          id: 1,
          category: 'campaign',
          title: '캠페인 등록 시 오류가 발생합니다',
          content: '리뷰어 모집 캠페인을 등록하려고 하는데 이미지 업로드 후 저장 버튼을 눌러도 진행이 되지 않습니다. 여러 번 시도해도 동일한 문제가 발생합니다. 어떻게 해결할 수 있을까요?',
          status: 'answered',
          createdAt: '2025-04-25T10:00:00',
          answeredAt: '2025-04-26T14:30:00',
          answer: '안녕하세요, 문의 주셔서 감사합니다. 해당 오류는 일시적인 서버 문제로 인해 발생한 것으로 확인됩니다. 현재는 문제가 해결되어 정상적으로 캠페인 등록이 가능합니다. 혹시 여전히 문제가 발생한다면 브라우저 캐시를 삭제하시고 다시 시도해보시기 바랍니다. 추가 문의사항이 있으시면 언제든지 문의해주세요.',
          isRead: true,
          attachments: [
            {
              name: '에러_스크린샷.png',
              url: '#',
              size: 750000
            }
          ]
        },
        {
          id: 2,
          category: 'payment',
          title: '결제 내역을 확인하고 싶습니다',
          content: '지난달 캠페인 비용 결제 내역과 세금계산서 발행 여부를 확인하고 싶습니다. 관리자 페이지에서 확인이 어려워 문의드립니다.',
          status: 'answered',
          createdAt: '2025-04-20T15:30:00',
          answeredAt: '2025-04-21T09:15:00',
          answer: '안녕하세요, 문의 주셔서 감사합니다. 결제 내역은 "마이페이지 > 결제 내역" 메뉴에서 확인하실 수 있습니다. 세금계산서는 결제 완료 후 익월 초(10일 이내)에 자동으로 발행되며, 등록하신 이메일로 전송됩니다. 해당 내역이 보이지 않는다면 시스템 오류일 수 있으니 관련 스크린샷과 함께 추가 문의 부탁드립니다.',
          isRead: false,
          attachments: []
        },
        {
          id: 3,
          category: 'reviewer',
          title: '리뷰어 선정 기준이 궁금합니다',
          content: '리뷰어 선정 기준과 프로세스에 대해 자세히 알고 싶습니다. 어떤 기준으로 리뷰어가 선정되는지, 그리고 기간은 어느 정도인지 궁금합니다.',
          status: 'pending',
          createdAt: '2025-04-28T11:45:00',
          answeredAt: null,
          answer: null,
          isRead: true,
          attachments: []
        },
        {
          id: 4,
          category: 'account',
          title: '계정 정보 변경 방법',
          content: '회사 정보와 담당자 이메일을 변경하고 싶습니다. 어디서 변경할 수 있나요?',
          status: 'answered',
          createdAt: '2025-04-15T09:20:00',
          answeredAt: '2025-04-15T16:30:00',
          answer: '안녕하세요, 문의 주셔서 감사합니다. 계정 정보는 "마이페이지 > 계정 설정" 메뉴에서 변경하실 수 있습니다. 회사 정보 변경 시 사업자등록증이 필요할 수 있으며, 담당자 이메일 변경 시 새 이메일로 인증 메일이 발송됩니다. 인증 후에 변경 사항이 적용됩니다. 추가 도움이 필요하시면 문의해주세요.',
          isRead: true,
          attachments: []
        },
        {
          id: 5,
          category: 'other',
          title: '리뷰어 추천 기능이 있나요?',
          content: '특정 제품군에 적합한 리뷰어를 추천받을 수 있는 기능이 있는지 궁금합니다. 혹은 리뷰어 필터링을 더 상세하게 할 수 있는 방법이 있는지요?',
          status: 'pending',
          createdAt: '2025-04-27T14:10:00',
          answeredAt: null,
          answer: null,
          isRead: true,
          attachments: []
        }
      ]);
      
      // 필터링된 문의 목록
      const filteredInquiries = ref([]);
      
      // 페이지네이션을 위한 계산된 속성
      const totalPages = computed(() => {
        if (filteredInquiries.value.length === 0) return 1;
        return Math.ceil(filteredInquiries.value.length / perPage.value);
      });
      
      // 현재 페이지에 표시될 문의
      const paginatedInquiries = computed(() => {
        const start = (currentPage.value - 1) * perPage.value;
        const end = start + perPage.value;
        return filteredInquiries.value.slice(start, end);
      });
      
      // 표시할 페이지 번호
      const displayedPages = computed(() => {
        const pages = [];
        const maxDisplayPages = 5;
        
        if (totalPages.value <= maxDisplayPages) {
          for (let i = 1; i <= totalPages.value; i++) {
            pages.push(i);
          }
        } else {
          let startPage = Math.max(currentPage.value - Math.floor(maxDisplayPages / 2), 1);
          const endPage = Math.min(startPage + maxDisplayPages - 1, totalPages.value);
          
          if (endPage - startPage < maxDisplayPages - 1) {
            startPage = Math.max(endPage - maxDisplayPages + 1, 1);
          }
          
          for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
          }
        }
        
        return pages;
      });
      
      // 초기 데이터 로드 및 필터링
      onMounted(() => {
        filterInquiries();
      });
      
      // 문의 필터링
      const filterInquiries = () => {
        let filtered = [...inquiries.value];
        
        // 상태 필터 적용
        if (statusFilter.value !== 'all') {
          filtered = filtered.filter(inquiry => inquiry.status === statusFilter.value);
        }
        
        // 카테고리 필터 적용
        if (categoryFilter.value !== 'all') {
          filtered = filtered.filter(inquiry => inquiry.category === categoryFilter.value);
        }
        
        // 검색어 필터 적용
        if (searchQuery.value) {
          const query = searchQuery.value.toLowerCase();
          filtered = filtered.filter(inquiry => 
            inquiry.title.toLowerCase().includes(query) || 
            inquiry.content.toLowerCase().includes(query)
          );
        }
        
        // 날짜순 정렬 (최신순)
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        filteredInquiries.value = filtered;
        currentPage.value = 1; // 필터링 후 첫 페이지로 이동
      };
      
      // 필터 업데이트 함수들
      const updateSearchQuery = (value) => {
        searchQuery.value = value;
        filterInquiries();
      };
      
      const updateStatusFilter = (value) => {
        statusFilter.value = value;
        filterInquiries();
      };
      
      const updateCategoryFilter = (value) => {
        categoryFilter.value = value;
        filterInquiries();
      };
      
      // 페이지 변경
      const changePage = (page) => {
        if (page < 1 || page > totalPages.value) return;
        currentPage.value = page;
      };
      
      // 문의 상세 보기
      const viewInquiryDetail = (inquiryId) => {
        selectedInquiry.value = inquiries.value.find(i => i.id === inquiryId);
        if (selectedInquiry.value) {
          // 읽음 표시
          const inquiryIndex = inquiries.value.findIndex(i => i.id === inquiryId);
          if (inquiryIndex !== -1 && !inquiries.value[inquiryIndex].isRead) {
            inquiries.value[inquiryIndex].isRead = true;
          }
          showDetailModal.value = true;
        }
      };
      
      // 상세 모달 닫기
      const closeDetailModal = () => {
        showDetailModal.value = false;
        setTimeout(() => {
          selectedInquiry.value = null;
        }, 300);
      };
      
      // 문의 제출
      const submitInquiry = (formData) => {
        // 제출 처리
        isSubmitting.value = true;
        
        // 실제로는 API 요청이 이루어짐
        setTimeout(() => {
          // 문의 추가
          const newId = Math.max(...inquiries.value.map(i => i.id)) + 1;
          
          inquiries.value.unshift({
            id: newId,
            category: formData.category,
            title: formData.title,
            content: formData.content,
            status: 'pending',
            createdAt: new Date().toISOString(),
            answeredAt: null,
            answer: null,
            isRead: true,
            attachments: formData.attachments.map(file => ({
              name: file.name,
              url: '#',
              size: file.size
            }))
          });
          
          isSubmitting.value = false;
          
          // 성공 알림 표시
          showSuccessAlert.value = true;
          
          // 알림 3초 후에 숨기기
          setTimeout(() => {
            showSuccessAlert.value = false;
          }, 3000);
          
          // 목록 탭으로 이동
          activeTab.value = 'list';
          
          // 목록 필터링 업데이트
          filterInquiries();
        }, 1500);
      };
      
      return {
        activeTab,
        searchQuery,
        statusFilter,
        categoryFilter,
        currentPage,
        perPage,
        showDetailModal,
        selectedInquiry,
        isSubmitting,
        showSuccessAlert,
        inquiries,
        filteredInquiries,
        paginatedInquiries,
        totalPages,
        displayedPages,
        updateSearchQuery,
        updateStatusFilter,
        updateCategoryFilter,
        filterInquiries,
        changePage,
        viewInquiryDetail,
        closeDetailModal,
        submitInquiry
      };
    }
  };
  </script>
  
  <style scoped>
  .inquiry-view {
    width: 100%;
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    position: relative;
  }
  
  .page-header {
    margin-bottom: 24px;
  }
  
  .page-title {
    font-size: 24px;
    font-weight: 700;
    color: #424242;
    margin: 0 0 8px;
  }
  
  .page-description {
    font-size: 14px;
    color: #64748b;
    margin: 0;
  }
  
  /* 탭 스타일 */
  .tabs {
    display: flex;
    margin: 24px 0;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .tab-btn {
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 500;
    color: #64748b;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .tab-btn:hover {
    color: #1e293b;
  }
  
  .tab-btn.active {
    color: #229799;
    border-bottom-color: #229799;
  }
  
  /* 알림 스타일 */
  .alert-overlay {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1100;
  }
  
  .alert-container {
    display: flex;
    align-items: center;
    gap: 16px;
    background-color: white;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    animation: slideIn 0.3s ease-out;
  }
  
  @keyframes slideIn {
    0% {
      transform: translateX(100%);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .alert-container.success {
    border-left: 4px solid #10b981;
  }
  
  .alert-container svg {
    color: #10b981;
  }
  
  .alert-message {
    flex: 1;
  }
  
  .alert-message h4 {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 4px;
  }
  
  .alert-message p {
    font-size: 14px;
    color: #64748b;
    margin: 0;
  }
  
  @media (max-width: 768px) {
    .alert-overlay {
      left: 20px;
      right: 20px;
    }
  }
  </style>
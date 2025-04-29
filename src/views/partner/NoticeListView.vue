<!-- src/views/partner/NoticeListView.vue -->
<template>
    <div class="notice-list-view">
      <div class="page-header">
        <h1 class="page-title">공지사항</h1>
        <div class="page-description">
          중요한 소식과 업데이트 정보를 확인하세요.
        </div>
      </div>
  
      <!-- 필터 및 검색 -->
      <div class="filter-container">
        <div class="search-bar">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="공지사항 검색" 
            v-model="searchQuery"
            @input="filterNotices"
          />
        </div>
        
        <div class="filter-options">
          <div class="status-filter">
            <label for="type-select">유형:</label>
            <select id="type-select" v-model="typeFilter" @change="filterNotices">
              <option value="all">전체</option>
              <option value="general">일반</option>
              <option value="important">중요</option>
              <option value="update">업데이트</option>
              <option value="event">이벤트</option>
            </select>
          </div>
        </div>
      </div>
  
      <!-- 공지사항 목록 -->
      <div v-if="filteredNotices.length > 0" class="notices-list">
        <div 
          v-for="notice in paginatedNotices" 
          :key="notice.id" 
          class="notice-item"
          :class="{ 'important-notice': notice.type === 'important' }"
          @click="viewNoticeDetail(notice.id)"
        >
          <div class="notice-header">
            <span class="notice-type" :class="notice.type">
              {{ getNoticeTypeName(notice.type) }}
            </span>
            <span class="notice-date">{{ formatDate(notice.createdAt) }}</span>
          </div>
          <h3 class="notice-title">
            {{ notice.title }}
            <span v-if="isNew(notice.createdAt)" class="new-badge">NEW</span>
          </h3>
          <p class="notice-preview">{{ getPreviewContent(notice.content) }}</p>
          <div class="notice-meta">
            <span class="notice-views">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              {{ notice.views }}
            </span>
            <span v-if="notice.attachments && notice.attachments.length > 0" class="notice-attachments">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
              </svg>
              첨부파일 {{ notice.attachments.length }}개
            </span>
          </div>
        </div>
      </div>
      
      <!-- 검색 결과 없음 -->
      <div v-else class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p v-if="searchQuery || typeFilter !== 'all'">
          검색 결과가 없습니다. 다른 검색어나 필터를 사용해보세요.
        </p>
        <p v-else>등록된 공지사항이 없습니다.</p>
      </div>
      
      <!-- 페이지네이션 -->
      <div v-if="filteredNotices.length > 0" class="pagination">
        <button 
          class="pagination-btn" 
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div class="page-numbers">
          <button 
            v-for="page in displayedPages" 
            :key="page" 
            class="page-number" 
            :class="{ active: currentPage === page }"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
        </div>
        <button 
          class="pagination-btn" 
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
  
      <!-- 공지사항 상세 모달 -->
      <div v-if="showDetailModal" class="modal-overlay" @click="showDetailModal = false">
        <div class="modal-container" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">공지사항</h3>
            <button class="close-btn" @click="showDetailModal = false">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div class="modal-body">
            <div class="notice-detail-header">
              <span class="notice-type" :class="selectedNotice.type">
                {{ getNoticeTypeName(selectedNotice.type) }}
              </span>
              <h2 class="notice-detail-title">{{ selectedNotice.title }}</h2>
              <div class="notice-meta">
                <span class="notice-date">등록일: {{ formatDate(selectedNotice.createdAt) }}</span>
                <span class="notice-views">조회수: {{ selectedNotice.views }}</span>
              </div>
            </div>
            
            <div class="notice-detail-content" v-html="selectedNotice.content"></div>
            
            <div v-if="selectedNotice.attachments && selectedNotice.attachments.length > 0" class="notice-attachments">
              <h4 class="attachments-title">첨부파일</h4>
              <ul class="attachments-list">
                <li v-for="(attachment, index) in selectedNotice.attachments" :key="index" class="attachment-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                    <polyline points="13 2 13 9 20 9"></polyline>
                  </svg>
                  <a :href="attachment.url" target="_blank" class="attachment-link">
                    {{ attachment.name }}
                  </a>
                  <span class="attachment-size">{{ formatFileSize(attachment.size) }}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div class="modal-footer">
            <button class="btn btn-outline" @click="showDetailModal = false">닫기</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  
  export default {
    name: 'NoticeListView',
    setup() {
      // 상태 변수
      const searchQuery = ref('');
      const typeFilter = ref('all');
      const currentPage = ref(1);
      const perPage = ref(10);
      
      // 모달 상태
      const showDetailModal = ref(false);
      const selectedNotice = ref(null);
      
      // 샘플 데이터 (실제로는 API에서 가져올 예정)
      const notices = ref([
        {
          id: 1,
          title: '리뷰 캠퍼스 서비스 업데이트 안내',
          content: '<p>안녕하세요, 리뷰 캠퍼스입니다.</p><p>더 나은 서비스를 제공하기 위해 다음과 같이 시스템을 업데이트하였습니다:</p><ul><li>리뷰어 모집 프로세스 개선</li><li>캠페인 관리 기능 추가</li><li>통계 대시보드 추가</li><li>모바일 UI/UX 개선</li></ul><p>더 편리하게 개선된 서비스를 이용해보세요.</p><p>감사합니다.</p>',
          type: 'update',
          createdAt: '2025-04-25T10:00:00',
          views: 256,
          attachments: [
            {
              name: '업데이트_안내문.pdf',
              url: '#',
              size: 1025000
            }
          ]
        },
        {
          id: 2,
          title: '5월 캠페인 등록 마감일 연장 안내',
          content: '<p>안녕하세요, 리뷰 캠퍼스입니다.</p><p>5월 캠페인 등록 마감일이 연장되었습니다.</p><p>기존: 4월 30일 → 변경: 5월 5일</p><p>더 많은 캠페인을 등록하실 수 있는 기회를 놓치지 마세요!</p><p>감사합니다.</p>',
          type: 'general',
          createdAt: '2025-04-28T14:30:00',
          views: 120,
          attachments: []
        },
        {
          id: 3,
          title: '[중요] 개인정보 처리방침 개정 안내',
          content: '<p>안녕하세요, 리뷰 캠퍼스입니다.</p><p>2025년 5월 1일부터 적용되는 개인정보 처리방침 개정 내용을 안내드립니다.</p><p>주요 변경사항:</p><ul><li>개인정보 수집 항목 변경</li><li>제3자 정보제공 관련 내용 추가</li><li>개인정보 보유기간 명시</li></ul><p>자세한 내용은 첨부된 파일을 참고해주세요.</p><p>감사합니다.</p>',
          type: 'important',
          createdAt: '2025-04-20T09:15:00',
          views: 340,
          attachments: [
            {
              name: '개인정보처리방침_개정안.pdf',
              url: '#',
              size: 890000
            },
            {
              name: '신구대조표.xlsx',
              url: '#',
              size: 52000
            }
          ]
        },
        {
          id: 4,
          title: '리뷰 캠퍼스 봄 시즌 이벤트 안내',
          content: '<p>안녕하세요, 리뷰 캠퍼스입니다.</p><p>봄 시즌을 맞아 특별 이벤트를 진행합니다!</p><h4>이벤트 내용</h4><ul><li>신규 캠페인 등록 시 수수료 10% 할인</li><li>리뷰어 선정 30명 이상 시 추가 5% 할인</li><li>봄 시즌 특별 템플릿 제공</li></ul><h4>이벤트 기간</h4><p>2025년 5월 1일 ~ 5월 31일</p><p>많은 참여 부탁드립니다!</p>',
          type: 'event',
          createdAt: '2025-04-15T11:20:00',
          views: 185,
          attachments: [
            {
              name: '봄_이벤트_상세안내.pdf',
              url: '#',
              size: 750000
            }
          ]
        },
        {
          id: 5,
          title: '리뷰어 선정 가이드라인 업데이트',
          content: '<p>안녕하세요, 리뷰 캠퍼스입니다.</p><p>리뷰어 선정 과정의 투명성과 효율성을 높이기 위해 가이드라인이 업데이트되었습니다.</p><p>주요 변경사항:</p><ul><li>리뷰어 프로필 평가 기준 구체화</li><li>리뷰 품질 측정 지표 추가</li><li>부적절한 리뷰어 신고 프로세스 간소화</li></ul><p>자세한 내용은 첨부된 가이드라인을 참고해주세요.</p><p>감사합니다.</p>',
          type: 'update',
          createdAt: '2025-04-10T16:45:00',
          views: 210,
          attachments: [
            {
              name: '리뷰어_선정_가이드라인_v2.pdf',
              url: '#',
              size: 675000
            }
          ]
        }
      ]);
      
      // 필터링된 공지사항 목록
      const filteredNotices = ref([]);
      
      // 페이지네이션을 위한 계산된 속성
      const totalPages = computed(() => {
        if (filteredNotices.value.length === 0) return 1;
        return Math.ceil(filteredNotices.value.length / perPage.value);
      });
      
      // 현재 페이지에 표시될 공지사항
      const paginatedNotices = computed(() => {
        const start = (currentPage.value - 1) * perPage.value;
        const end = start + perPage.value;
        return filteredNotices.value.slice(start, end);
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
        filterNotices();
      });
      
      // 공지사항 유형명 반환
      const getNoticeTypeName = (type) => {
        switch (type) {
          case 'general':
            return '일반';
          case 'important':
            return '중요';
          case 'update':
            return '업데이트';
          case 'event':
            return '이벤트';
          default:
            return '일반';
        }
      };
      
      // 공지사항 필터링
      const filterNotices = () => {
        let filtered = [...notices.value];
        
        // 유형 필터 적용
        if (typeFilter.value !== 'all') {
          filtered = filtered.filter(notice => notice.type === typeFilter.value);
        }
        
        // 검색어 필터 적용
        if (searchQuery.value) {
          const query = searchQuery.value.toLowerCase();
          filtered = filtered.filter(notice => 
            notice.title.toLowerCase().includes(query) || 
            stripHtml(notice.content).toLowerCase().includes(query)
          );
        }
        
        // 날짜순 정렬 (최신순)
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        filteredNotices.value = filtered;
        currentPage.value = 1; // 필터링 후 첫 페이지로 이동
      };
      
      // 페이지 변경
      const changePage = (page) => {
        if (page < 1 || page > totalPages.value) return;
        currentPage.value = page;
      };
      
      // 공지사항 상세 보기
      const viewNoticeDetail = (noticeId) => {
        selectedNotice.value = notices.value.find(n => n.id === noticeId);
        if (selectedNotice.value) {
          // 조회수 증가
          const noticeIndex = notices.value.findIndex(n => n.id === noticeId);
          if (noticeIndex !== -1) {
            notices.value[noticeIndex].views += 1;
            selectedNotice.value.views += 1;
          }
          showDetailModal.value = true;
        }
      };
      
      // HTML 태그 제거
      const stripHtml = (html) => {
        const tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
      };
      
      // 미리보기 내용 생성
      const getPreviewContent = (content) => {
        const stripped = stripHtml(content);
        return stripped.length > 100 ? stripped.substring(0, 100) + '...' : stripped;
      };
      
      // 날짜 포맷팅
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
      };
      
      // 파일 크기 포맷팅
      const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      };
      
      // 새 공지 여부 확인 (7일 이내)
      const isNew = (dateString) => {
        const createDate = new Date(dateString);
        const now = new Date();
        const diffTime = now - createDate;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        
        return diffDays <= 7;
      };
      
      return {
        searchQuery,
        typeFilter,
        currentPage,
        showDetailModal,
        selectedNotice,
        notices,
        filteredNotices: filteredNotices,
        paginatedNotices,
        totalPages,
        displayedPages,
        getNoticeTypeName,
        getPreviewContent,
        filterNotices,
        changePage,
        viewNoticeDetail,
        formatDate,
        formatFileSize,
        isNew
      };
    }
  };
  </script>
  
  <style scoped>
  .notice-list-view {
    width: 100%;
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
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
  
  .filter-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 24px 0;
    flex-wrap: wrap;
    gap: 16px;
  }
  
  .search-bar {
    position: relative;
    max-width: 300px;
    width: 100%;
  }
  
  .search-bar svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
  }
  
  .search-bar input {
    width: 100%;
    padding: 10px 10px 10px 40px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.2s;
  }
  
  .search-bar input:focus {
    outline: none;
    border-color: #229799;
  }
  
  .filter-options {
    display: flex;
    gap: 16px;
  }
  
  .status-filter {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .status-filter label {
    font-size: 14px;
    color: #64748b;
  }
  
  .status-filter select {
    padding: 8px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.2s;
  }
  
  .status-filter select:focus {
    outline: none;
    border-color: #229799;
  }
  
  .notices-list {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
    margin: 20px 0;
  }
  
  .notice-item {
    background-color: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    border: 1px solid #f1f5f9;
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: pointer;
  }
  
  .notice-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .notice-item.important-notice {
    border-left: 3px solid #ef4444;
  }
  
  .notice-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  
  .notice-type {
    display: inline-block;
    font-size: 12px;
    font-weight: 500;
    padding: 4px 8px;
    border-radius: 4px;
  }
  
  .notice-type.general {
    background-color: #f1f5f9;
    color: #64748b;
  }
  
  .notice-type.important {
    background-color: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }
  
  .notice-type.update {
    background-color: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
  }
  
  .notice-type.event {
    background-color: rgba(234, 179, 8, 0.1);
    color: #eab308;
  }
  
  .notice-date {
    font-size: 12px;
    color: #94a3b8;
  }
  
  .notice-title {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .new-badge {
    background-color: #48CFCB;
    color: white;
    font-size: 10px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 10px;
  }
  
  .notice-preview {
    font-size: 14px;
    color: #64748b;
    line-height: 1.5;
    margin: 0 0 16px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .notice-meta {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .notice-views, .notice-attachments {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #94a3b8;
  }
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 0;
    color: #94a3b8;
  }
  
  .empty-state svg {
    color: #e5e7eb;
    margin-bottom: 20px;
  }
  
  .empty-state p {
    font-size: 16px;
    margin: 0;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 32px;
    gap: 8px;
  }
  
  .pagination-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
    background-color: white;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .pagination-btn:not(:disabled):hover {
    border-color: #229799;
    color: #229799;
  }
  
  .page-numbers {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .page-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
    background-color: white;
    color: #64748b;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .page-number:hover {
    border-color: #229799;
    color: #229799;
  }
  
  .page-number.active {
    background-color: #229799;
    color: white;
    border-color: #229799;
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
  
  .modal-container {
    background-color: white;
    border-radius: 12px;
    width: 95%;
    max-width: 800px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .modal-title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
  }
  
  .close-btn {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    transition: color 0.2s;
  }
  
  .close-btn:hover {
    color: #1e293b;
  }
  
  .modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
  }
  
  .notice-detail-header {
    margin-bottom: 24px;
  }
  
  .notice-detail-title {
    font-size: 24px;
    font-weight: 700;
    color: #1e293b;
    margin: 12px 0;
  }
  
  .notice-meta {
    display: flex;
    align-items: center;
    gap: 16px;
    color: #64748b;
    font-size: 14px;
  }
  
  .notice-detail-content {
    margin-bottom: 24px;
    line-height: 1.6;
    color: #1e293b;
    font-size: 15px;
  }
  
  /* HTML 콘텐츠의 스타일링 */
  .notice-detail-content :deep(h1),
  .notice-detail-content :deep(h2),
  .notice-detail-content :deep(h3),
  .notice-detail-content :deep(h4) {
    margin: 24px 0 16px;
    color: #1e293b;
  }
  
  .notice-detail-content :deep(p) {
    margin: 16px 0;
  }
  
  .notice-detail-content :deep(ul),
  .notice-detail-content :deep(ol) {
    margin: 16px 0;
    padding-left: 24px;
  }
  
  .notice-detail-content :deep(li) {
    margin: 8px 0;
  }
  
  .notice-detail-content :deep(a) {
    color: #229799;
    text-decoration: none;
  }
  
  .notice-detail-content :deep(a:hover) {
    text-decoration: underline;
  }
  
  .notice-attachments {
    background-color: #f8fafc;
    border-radius: 8px;
    padding: 16px;
    margin-top: 24px;
  }
  
  .attachments-title {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 12px;
  }
  
  .attachments-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .attachment-item {
    display: flex;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .attachment-item:last-child {
    border-bottom: none;
  }
  
  .attachment-item svg {
    color: #64748b;
    margin-right: 8px;
  }
  
  .attachment-link {
    flex: 1;
    color: #1e293b;
    text-decoration: none;
    font-size: 14px;
    margin-right: 8px;
  }
  
  .attachment-link:hover {
    color: #229799;
    text-decoration: underline;
  }
  
  .attachment-size {
    font-size: 12px;
    color: #94a3b8;
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    padding: 20px;
    border-top: 1px solid #e5e7eb;
  }
  
  .btn {
    padding: 10px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .btn-outline {
    background-color: white;
    color: #64748b;
    border: 1px solid #e5e7eb;
  }
  
  .btn-outline:hover {
    background-color: #f8fafc;
  }
  
  @media (max-width: 768px) {
    .filter-container {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .search-bar {
      max-width: 100%;
    }
    
    .filter-options {
      width: 100%;
    }
    
    .status-filter {
      width: 100%;
    }
    
    .status-filter select {
      width: 100%;
    }
    
    .notice-meta {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
  }
  </style>
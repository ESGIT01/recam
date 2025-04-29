<!-- src/components/partner/campaigns/ApplicantsModal.vue -->
<template>
    <div class="modal-overlay" @click="closeModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">지원자 관리</h3>
          <button class="close-btn" @click="closeModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="modal-subheader">
          <div class="campaign-info">
            <div class="campaign-thumbnail" :style="{ backgroundColor: campaign.thumbnailBg }">
              {{ campaign.title.charAt(0) }}
            </div>
            <div class="campaign-title-info">
              <h4 class="campaign-title">{{ campaign.title }}</h4>
              <div class="applicants-count">
                <span>지원자 {{ campaign.applicants.length }}명</span>
                <span class="separator">|</span>
                <span>모집인원 {{ campaign.target }}명</span>
              </div>
            </div>
          </div>
          
          <div class="search-filter">
            <div class="search-bar">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                placeholder="이름 또는 채널 검색" 
                v-model="searchQuery"
              />
            </div>
            <div class="filter-dropdown">
              <select v-model="channelFilter">
                <option value="all">모든 채널</option>
                <option value="블로그">블로그</option>
                <option value="인스타그램">인스타그램</option>
                <option value="유튜브">유튜브</option>
                <option value="페이스북">페이스북</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="modal-body">
          <div v-if="filteredApplicants.length > 0" class="applicants-table-container">
            <table class="applicants-table">
              <thead>
                <tr>
                  <th class="column-checkbox">
                    <input 
                      type="checkbox" 
                      :checked="isAllSelected" 
                      @change="toggleSelectAll"
                    />
                  </th>
                  <th class="column-name">이름</th>
                  <th class="column-channel">채널</th>
                  <th class="column-followers">팔로워</th>
                  <th class="column-actions">액션</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="applicant in filteredApplicants" :key="applicant.id">
                  <td class="column-checkbox">
                    <input 
                      type="checkbox" 
                      :checked="selectedApplicants.includes(applicant.id)"
                      @change="toggleSelectApplicant(applicant.id)"
                    />
                  </td>
                  <td class="column-name">
                    <div class="applicant-profile">
                      <div class="applicant-avatar">{{ applicant.name.charAt(0) }}</div>
                      <span class="applicant-name">{{ applicant.name }}</span>
                    </div>
                  </td>
                  <td class="column-channel">{{ applicant.channel }}</td>
                  <td class="column-followers">{{ applicant.followers }}</td>
                  <td class="column-actions">
                    <button class="view-profile-btn" @click="viewProfile(applicant.id)">프로필 보기</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div v-else class="empty-applicants">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p v-if="searchQuery || channelFilter !== 'all'">검색 결과가 없습니다.</p>
            <p v-else>지원자가 없습니다.</p>
          </div>
        </div>
        
        <div class="modal-footer">
          <div class="selection-info">
            <span v-if="selectedApplicants.length > 0">
              {{ selectedApplicants.length }}명 선택됨
            </span>
          </div>
          <div class="action-buttons">
            <button 
              class="btn btn-outline" 
              @click="closeModal"
            >
              닫기
            </button>
            <button 
              class="btn btn-primary" 
              @click="goToSelectReviewers"
              :disabled="selectedApplicants.length === 0"
            >
              선택한 지원자로 리뷰어 선정하기
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref, computed } from 'vue';
  
  export default defineComponent({
    name: 'ApplicantsModal',
    props: {
      campaign: {
        type: Object,
        required: true
      }
    },
    emits: ['close', 'select-reviewers'],
    setup(props, { emit }) {
      const searchQuery = ref('');
      const channelFilter = ref('all');
      const selectedApplicants = ref([]);
      
      // 필터링된 지원자 목록
      const filteredApplicants = computed(() => {
        let filtered = [...props.campaign.applicants];
        
        // 채널 필터 적용
        if (channelFilter.value !== 'all') {
          filtered = filtered.filter(app => app.channel === channelFilter.value);
        }
        
        // 검색어 필터 적용
        if (searchQuery.value) {
          const query = searchQuery.value.toLowerCase();
          filtered = filtered.filter(app => 
            app.name.toLowerCase().includes(query) || 
            app.channel.toLowerCase().includes(query)
          );
        }
        
        return filtered;
      });
      
      // 모든 지원자가 선택되었는지 확인
      const isAllSelected = computed(() => {
        return filteredApplicants.value.length > 0 && 
               filteredApplicants.value.every(app => selectedApplicants.value.includes(app.id));
      });
      
      // 모든 지원자 선택/해제 토글
      const toggleSelectAll = (event) => {
        if (event.target.checked) {
          // 모든 지원자 선택
          selectedApplicants.value = filteredApplicants.value.map(app => app.id);
        } else {
          // 모든 지원자 선택 해제
          selectedApplicants.value = [];
        }
      };
      
      // 개별 지원자 선택/해제 토글
      const toggleSelectApplicant = (applicantId) => {
        const index = selectedApplicants.value.indexOf(applicantId);
        if (index === -1) {
          // 선택되지 않은 경우 선택
          selectedApplicants.value.push(applicantId);
        } else {
          // 선택된 경우 선택 해제
          selectedApplicants.value.splice(index, 1);
        }
      };
      
      // 프로필 보기
      const viewProfile = (applicantId) => {
        console.log(`지원자 ID ${applicantId} 프로필 보기`);
        // 실제 구현에서는 프로필 상세 모달을 표시
      };
      
      // 모달 닫기
      const closeModal = () => {
        emit('close');
      };
      
      // 리뷰어 선정 페이지로 이동
      const goToSelectReviewers = () => {
        emit('select-reviewers', {
          campaignId: props.campaign.id,
          selectedApplicantIds: selectedApplicants.value
        });
      };
      
      return {
        searchQuery,
        channelFilter,
        selectedApplicants,
        filteredApplicants,
        isAllSelected,
        toggleSelectAll,
        toggleSelectApplicant,
        viewProfile,
        closeModal,
        goToSelectReviewers
      };
    }
  });
  </script>
  
  <style scoped>
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
    max-width: 900px;
    height: 90vh;
    max-height: 800px;
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
  
  .modal-subheader {
    padding: 16px 20px;
    border-bottom: 1px solid #e5e7eb;
    background-color: #f8fafc;
  }
  
  .campaign-info {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }
  
  .campaign-thumbnail {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: #229799;
    font-size: 18px;
  }
  
  .campaign-title-info {
    flex: 1;
  }
  
  .campaign-title {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 4px;
  }
  
  .applicants-count {
    font-size: 13px;
    color: #64748b;
    display: flex;
    align-items: center;
  }
  
  .separator {
    margin: 0 8px;
    color: #cbd5e1;
  }
  
  .search-filter {
    display: flex;
    gap: 12px;
  }
  
  .search-bar {
    position: relative;
    flex: 1;
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
    padding: 8px 8px 8px 36px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.2s;
  }
  
  .search-bar input:focus {
    outline: none;
    border-color: #229799;
  }
  
  .filter-dropdown select {
    padding: 8px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 14px;
    background-color: white;
    transition: border-color 0.2s;
  }
  
  .filter-dropdown select:focus {
    outline: none;
    border-color: #229799;
  }
  
  .modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 0;
  }
  
  .applicants-table-container {
    width: 100%;
  }
  
  .applicants-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .applicants-table th, .applicants-table td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid #f1f5f9;
  }
  
  .applicants-table th {
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    background-color: #f8fafc;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  
  .column-checkbox {
    width: 48px;
    text-align: center;
  }
  
  .column-checkbox input[type="checkbox"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
  
  .column-name {
    width: 30%;
  }
  
  .column-channel, .column-followers {
    width: 20%;
  }
  
  .column-actions {
    width: 15%;
    text-align: right;
  }
  
  .applicant-profile {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .applicant-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #229799;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 14px;
  }
  
  .applicant-name {
    font-weight: 500;
  }
  
  .view-profile-btn {
    background: none;
    border: none;
    color: #229799;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.2s;
  }
  
  .view-profile-btn:hover {
    color: #1a7a7c;
    text-decoration: underline;
  }
  
  .empty-applicants {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 0;
    color: #94a3b8;
  }
  
  .empty-applicants svg {
    color: #e5e7eb;
    margin-bottom: 20px;
  }
  
  .empty-applicants p {
    font-size: 16px;
    margin: 0;
  }
  
  .modal-footer {
    padding: 16px 20px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .selection-info {
    font-size: 14px;
    font-weight: 500;
    color: #1e293b;
  }
  
  .action-buttons {
    display: flex;
    gap: 8px;
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
  
  .btn-primary {
    background-color: #229799;
    color: white;
    border: none;
  }
  
  .btn-primary:hover {
    background-color: #1a7a7c;
  }
  
  .btn-primary:disabled {
    background-color: #cbd5e1;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    .search-filter {
      flex-direction: column;
      gap: 8px;
    }
    
    .column-followers {
      display: none;
    }
    
    .modal-footer {
      flex-direction: column;
      gap: 12px;
    }
    
    .action-buttons {
      width: 100%;
      flex-direction: column;
    }
    
    .btn {
      width: 100%;
    }
  }
  </style>
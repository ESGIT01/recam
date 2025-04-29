<!-- src/components/partner/dashboard/CampaignTable.vue -->
<template>
    <div class="content-card">
      <div class="card-header">
        <h2 class="card-title">전체 캠페인</h2>
        <router-link to="/partner/campaigns" class="card-link">
          모두 보기
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </router-link>
      </div>
      <div class="card-content">
        <table class="data-table">
          <thead>
            <tr>
              <th>캠페인</th>
              <th>승인여부</th>
              <th>모집인원</th>
              <th>지원</th>
              <th>마감일</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(campaign, index) in campaigns" :key="index">
              <td>
                <div class="campaign-info">
                  <div class="campaign-image" :style="{ backgroundColor: campaign.imageBg }">
                    {{ campaign.title.charAt(0) }}
                  </div>
                  <div class="campaign-text">
                    <div class="campaign-title">{{ campaign.title }}</div>
                    <div class="campaign-type">{{ campaign.type }}</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="status-badge" :class="campaign.approvalStatus">
                  {{ campaign.approvalStatusText }}
                </span>
              </td>
              <td>{{ campaign.target }}명</td>
              <td>{{ campaign.applications }}명</td>
              <td>
                <div v-if="campaign.expired" class="select-reviewers-btn">
                  <button class="primary-btn" @click="onSelectReviewers(campaign.id)">리뷰어 선정하기</button>
                </div>
                <div v-else class="deadline" :class="{ 'urgent': campaign.daysLeft <= 3 }">
                  {{ campaign.daysLeft }}일 남음
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'CampaignTable',
    props: {
      campaigns: {
        type: Array,
        required: true
      }
    },
    emits: ['select-reviewers'],
    setup(props, { emit }) {
      const onSelectReviewers = (campaignId) => {
        emit('select-reviewers', campaignId);
      };
  
      return {
        onSelectReviewers
      };
    }
  });
  </script>
  
  <style scoped>
  .content-card {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #f1f5f9;
  }
  
  .card-title {
    font-size: 16px;
    font-weight: 600;
    color: #424242;
    margin: 0;
  }
  
  .card-link {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    color: #229799;
    text-decoration: none;
    transition: color 0.2s;
  }
  
  .card-link:hover {
    color: #1d8385;
    text-decoration: none;
  }
  
  .card-content {
    padding: 0 20px 20px;
  }
  
  /* 테이블 스타일 */
  .data-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .data-table th, .data-table td {
    padding: 12px 8px;
    text-align: left;
  }
  
  .data-table th {
    font-size: 13px;
    font-weight: 600;
    color: #94a3b8;
    border-bottom: 1px solid #f1f5f9;
  }
  
  .data-table td {
    font-size: 14px;
    color: #1e293b;
    border-bottom: 1px solid #f8fafc;
  }
  
  .data-table tr:last-child td {
    border-bottom: none;
  }
  
  .campaign-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .campaign-image {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: #229799;
    font-size: 16px;
  }
  
  .campaign-text {
    display: flex;
    flex-direction: column;
  }
  
  .campaign-title {
    font-weight: 500;
    margin-bottom: 4px;
  }
  
  .campaign-type {
    font-size: 12px;
    color: #64748b;
  }
  
  .deadline {
    font-size: 13px;
    color: #5c6a7e;
  }
  
  .deadline.urgent {
    color: #ef4444;
    font-weight: 500;
  }
  
  .status-badge {
    display: inline-flex;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
  }
  
  .status-badge.approved {
    background-color: rgba(16, 185, 129, 0.1);
    color: #10b981;
  }
  
  .status-badge.waiting {
    background-color: rgba(245, 158, 11, 0.1);
    color: #f59e0b;
  }
  
  .select-reviewers-btn {
    display: flex;
    justify-content: center;
  }
  
  .primary-btn {
    background-color: #229799;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .primary-btn:hover {
    background-color: #1a7a7c;
  }
  
  /* CSS 변수 사용 버전 */
  @media (prefers-reduced-motion: no-preference) {
    .content-card {
      background-color: var(--color-bg-white, white);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    }
  
    .card-title {
      color: var(--color-dark-gray, #424242);
    }
  
    .card-link {
      color: var(--color-teal, #229799);
    }
  
    .card-link:hover {
      color: var(--color-teal-dark, #1d8385);
    }
  
    .campaign-image {
      color: var(--color-teal, #229799);
    }
  
    .status-badge.approved {
      background-color: rgba(16, 185, 129, 0.1);
      color: var(--color-success, #10b981);
    }
  
    .status-badge.waiting {
      background-color: rgba(245, 158, 11, 0.1);
      color: var(--color-warning, #f59e0b);
    }
  
    .deadline.urgent {
      color: var(--color-danger, #ef4444);
    }
  
    .primary-btn {
      background-color: var(--color-teal, #229799);
    }
  
    .primary-btn:hover {
      background-color: var(--color-teal-dark, #1a7a7c);
    }
  }
  
  /* 반응형 디자인 */
  @media (max-width: 768px) {
    .data-table {
      display: block;
      overflow-x: auto;
    }
  
    .campaign-title {
      max-width: 120px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  </style>
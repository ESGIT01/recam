<!-- src/components/partner/campaigns/CampaignList.vue -->
<template>
    <div class="campaign-list">
      <campaign-card 
        v-for="campaign in campaigns" 
        :key="campaign.id" 
        :campaign="campaign"
        :list-type="listType"
        @select-reviewers="onSelectReviewers"
        @view-reviewers="onViewReviewers"
        @view-review="onViewReview"
      />
    </div>
  </template>
  
  <script>
  import { defineComponent } from 'vue';
  import CampaignCard from './CampaignCard.vue';
  
  export default defineComponent({
    name: 'CampaignList',
    components: {
      CampaignCard
    },
    props: {
      campaigns: {
        type: Array,
        required: true
      },
      listType: {
        type: String,
        default: 'all'
      }
    },
    emits: ['select-reviewers', 'view-reviewers', 'view-review'],
    setup(props, { emit }) {
      const onSelectReviewers = (campaignId) => {
        emit('select-reviewers', campaignId);
      };
      
      const onViewReviewers = (campaignId) => {
        emit('view-reviewers', campaignId);
      };
      
      const onViewReview = (review) => {
        emit('view-review', review);
      };
      
      return {
        onSelectReviewers,
        onViewReviewers,
        onViewReview
      };
    }
  });
  </script>
  
  <style scoped>
  .campaign-list {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 20px;
  }
  
  @media (min-width: 768px) {
    .campaign-list {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (min-width: 1200px) {
    .campaign-list {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  </style>
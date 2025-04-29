<!-- src/components/header/NoticeBar.vue -->
<template>
    <div class="notice-bar">
      <div class="container">
        <div class="notice-slider">
          <transition name="fade-notice" mode="out-in">
            <div :key="currentNoticeIndex" class="notice-item" @click="goToNotice(notices[currentNoticeIndex])">
              {{ notices[currentNoticeIndex].content }}
            </div>
          </transition>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'NoticeBar',
    setup() {
      const router = useRouter();
      
      // 공지사항 데이터
      const notices = ref([
        { id: 1, content: '3/22 14:00 ~ 20:00 서비스 이용 중지 안내' },
        { id: 2, content: '리뷰캠퍼스 앱 출시 안내' },
        { id: 3, content: '신규회원 가입 시 3,000포인트 지급!' }
      ]);
      
      // 공지사항 슬라이더
      const currentNoticeIndex = ref(0);
      let noticeInterval = null;
      
      const startNoticeRotation = () => {
        noticeInterval = setInterval(() => {
          currentNoticeIndex.value = (currentNoticeIndex.value + 1) % notices.value.length;
        }, 5000);
      };
      
      const goToNotice = (notice) => {
        // 라우터를 통해 공지사항 페이지로 이동
        router.push({ path: '/notices', query: { id: notice.id } });
      };
      
      onMounted(() => {
        startNoticeRotation();
      });
      
      onBeforeUnmount(() => {
        clearInterval(noticeInterval);
      });
      
      return {
        notices,
        currentNoticeIndex,
        goToNotice
      };
    }
  }
  </script>
  
  <style scoped>
  .notice-bar {
    background-color: #f7f7f7;
    padding: 8px 0;
    border-bottom: 1px solid #eaeaea;
  }
  
  .notice-slider {
    position: relative;
    height: 22px;
    display: flex;
    align-items: center;
    padding: 0;
    width: 100%;
  }
  
  .notice-item {
    position: absolute;
    width: 100%;
    font-size: 13px;
    color: #555;
    font-weight: 400;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: color 0.2s ease;
  }
  
  .notice-item:hover {
    color: var(--primary-dark);
  }
  
  .notice-item::before {
    content: '•';
    margin-right: 8px;
    color: var(--primary-dark);
    font-size: 18px;
  }
  
  /* 애니메이션 */
  .fade-notice-enter-active,
  .fade-notice-leave-active {
    transition: opacity 0.5s ease, transform 0.5s ease;
  }
  
  .fade-notice-enter-from,
  .fade-notice-leave-to {
    opacity: 0;
    transform: translateY(5px);
  }
  
  /* 반응형 */
  @media (max-width: 768px) {
    .notice-item {
      font-size: 13px;
    }
  }
  
  @media (max-width: 576px) {
    .notice-bar {
      padding: 6px 0;
    }
    
    .notice-slider {
      height: 20px;
    }
    
    .notice-item {
      font-size: 12px;
    }
    
    .notice-item::before {
      font-size: 16px;
    }
  }
  </style>
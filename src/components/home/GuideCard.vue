<template>
    <div class="guide-cards-wrapper">
      <div class="guide-cards-container">
        <div 
          v-for="(card, index) in guideCards" 
          :key="index"
          class="guide-card"
          @click="navigateToLink(card)"
          @mouseenter="activeIndex = index"
          @mouseleave="activeIndex = null"
          :class="{ 'active': activeIndex === index }"
        >
          <div class="card-content">
            <div class="card-icon-container">
              <div class="card-icon" :style="{ backgroundColor: card.iconBgColor }">
                <img :src="card.iconSrc" :alt="card.title" />
                <span v-if="card.badge" class="card-badge" :style="{ backgroundColor: card.badgeColor }">{{ card.badge }}</span>
              </div>
            </div>
            <div class="card-text-container">
              <h3 class="card-title">{{ card.title }}</h3>
              <p class="card-description">{{ card.description }}</p>
              <span class="card-link">{{ card.linkText }} →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'GuideCards',
    data() {
      return {
        activeIndex: null,
        guideCards: [
          {
            title: '선정확률 UP!',
            description: '리뷰캠퍼스 위젯 삽입하고 선정확률을 높여보세요',
            linkText: '위젯 삽입하기',
            link: '/guide',
            iconSrc: require('@/assets/logo.png'),
            iconBgColor: '#E5F9F8',
            badge: '',
            badgeColor: ''
          },
          {
            title: '리뷰캠퍼스 공략하기',
            description: '서비스 이용 가이드에 대해 알려드립니다',
            linkText: '이용가이드 보기',
            link: '/guide',
            iconSrc: require('@/assets/logo.png'),
            iconBgColor: '#F5F5FF',
            badge: '',
            badgeColor: ''
          },
          {
            title: '캠퍼스등록을 안하셨나요?',
            description: '지금 회원가입하고 리뷰캠퍼스의 회원이 되어주세요',
            linkText: '회원가입하기',
            link: '/select-type',
            iconSrc: require('@/assets/logo.png'),
            iconBgColor: '#FFF2F2',
            badge: '',
            badgeColor: ''
          },
          {
            title: '이벤트 함께해요',
            description: '선물이 펑펑! 다양한 이벤트를 확인해보세요',
            linkText: '이벤트 보러가기',
            link: '/event',
            iconSrc: require('@/assets/logo.png'),
            iconBgColor: '#FFF7E6',
            badge: 'NEW',
            badgeColor: '#FF6B6B'
          }
        ]
      }
    },
    methods: {
      navigateToLink(card) {
        this.$router.push(card.link);
      }
    }
  }
  </script>
  
  <style scoped>
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
  
  :root {
    --primary: #48CFCB;
    --primary-dark: #229799;
    --text-dark: #424242;
  }
  
  .guide-cards-wrapper {
    width: 100%;
    padding: 2.5rem 0;
    background-color: #FFFFFF;
  }
  
  .guide-cards-container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    padding: 0 1.5rem;
  }
  
  .guide-card {
    background-color: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
    height: 100%;
  }
  
  .guide-card::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--primary), var(--primary-dark));
    transition: all 0.3s ease;
  }
  
  .guide-card:hover, .guide-card.active {
    transform: translateY(-8px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
  
  .guide-card:hover::after, .guide-card.active::after {
    width: 100%;
  }
  
  .card-content {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .card-icon-container {
    margin-bottom: 1.5rem;
  }
  
  .card-icon {
    width: 60px;
    height: 60px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  
  .card-icon img {
    width: 30px;
    height: 30px;
  }
  
  .card-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: #FF6B6B;
    color: white;
    font-size: 0.7rem;
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 8px;
    border: 2px solid white;
  }
  
  .card-text-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .card-title {
    font-family: 'Pretendard', sans-serif;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-dark);
    margin: 0 0 0.75rem 0;
  }
  
  .card-description {
    font-family: 'Pretendard', sans-serif;
    font-size: 0.95rem;
    line-height: 1.5;
    color: #666;
    margin: 0 0 1.5rem 0;
    flex-grow: 1;
  }
  
  .card-link {
    font-family: 'Pretendard', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--primary-dark);
    display: inline-block;
    transition: all 0.3s ease;
    align-self: flex-start;
  }
  
  .guide-card:hover .card-link {
    transform: translateX(5px);
  }
  
  /* 반응형 스타일링 */
  @media (max-width: 1024px) {
    .guide-cards-container {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 640px) {
    .guide-cards-container {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .card-content {
      padding: 1.5rem;
    }
    
    .card-icon {
      width: 50px;
      height: 50px;
    }
    
    .card-icon img {
      width: 24px;
      height: 24px;
    }
    
    .card-title {
      font-size: 1.1rem;
    }
    
    .card-description {
      font-size: 0.9rem;
    }
  }
  </style>
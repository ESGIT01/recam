<template>
  <div class="home-container">
    <BannerSlider />
    <CategoryNav />
    <HotCampaign />
    <MiddleBanner 
      :bannerImage="require('@/assets/banners/kakao-channel-banner.png')"
      linkUrl="https://www.naver.com"
    />
    <HighProbabilityCampaign />
    <ClosingSoonCampaign />
    <MiddleBanner 
      :bannerImage="require('@/assets/banners/ad-banner-main-img-bottom.png')"
      linkUrl="https://www.naver.com"
    />
    <GuideCard />
    <section class="main-content">
      <!-- 여기에 추가 컴포넌트를 넣을 수 있습니다 -->
    </section>
  </div>
</template>

<script>
import BannerSlider from '@/components/home/BannerSlider.vue'
import CategoryNav from '@/components/home/CategoryNav.vue';
import HotCampaign from '@/components/home/HotCampaign.vue';
import MiddleBanner from '@/components/any/MiddleBanner.vue';
import HighProbabilityCampaign from '@/components/home/HighProbabilityCampaign.vue';
import ClosingSoonCampaign from '@/components/home/ClosingSoonCampaign.vue';
import GuideCard from '@/components/home/GuideCard.vue';


export default {
  name: 'HomeView',
  components: {
    BannerSlider,
    CategoryNav,
    HotCampaign,
    MiddleBanner,
    HighProbabilityCampaign,
    ClosingSoonCampaign,
    GuideCard,
  }
}
</script>

<style scoped>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

.home-container {
  font-family: 'Pretendard', sans-serif;
  width: 100%;
  min-height: 100vh;
  background-color: #FFFFFF;
  color: #424242;
}

.main-content {
  padding: 2rem;
  max-width: 1280px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }
}
</style>
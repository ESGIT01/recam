import { createRouter, createWebHistory } from 'vue-router'

// 메인 페이지
import HomeView from '@/views/HomeView.vue'

// 메인 카테고리 페이지
import DeliveryView from '@/views/DeliveryView.vue'
import VisitView from '@/views/VisitView.vue'
import PurchaseView from '@/views/PurchaseView.vue'
import ReporterView from '@/views/ReporterView.vue'
import NoticeView from '@/views/NoticeView.vue'

// 캠페인 상세 페이지
import CampaignDetailView from '@/views/CampaignDetailView.vue'

// 기타 유틸리티 페이지
import TodayView from '@/views/TodayView.vue'
import EventView from '@/views/EventView.vue'
import GuideView from '@/views/GuideView.vue'
import LoginView from '@/views/LoginView.vue'
import SelectType from '@/views/SelectType.vue'
import ReviewerSignup from '@/views/ReviewerSignup.vue'
import ReviewerSigncomplete from '@/views/ReviewerSigncomplete.vue'
import AdvertiserSignup from '@/views/AdvertiserSignup.vue'
import AdvertiserSigncomplete from '@/views/AdvertiserSigncomplete.vue'
import CSView from '@/views/CSView.vue'
import ReviewerProfile from '@/views/mypage/ReviewerProfile.vue'
import ReviewerAttendance from '@/views/mypage/ReviewerAttendance.vue'
import ReviewerPoint from '@/views/mypage/ReviewerPoint.vue'
import ReviewerPenalty from '@/views/mypage/ReviewerPenalty.vue'
import ReviewerEdit from '@/views/mypage/ReviewerEdit.vue'
import ReviewerApply from '@/views/mypage/ReviewerApply.vue'
import ReviewerDibs from '@/views/mypage/ReviewerDibs.vue'
import AdDashboard from '@/views/adpage/AdDashboard.vue'
import CampaignRegister from '@/views/campaignregister/CampaignRegister.vue'
import TermsOfService from '@/views/TermsOfService.vue'
import TermsOfPrivacypolicy from '@/views/TermsOfPrivacypolicy.vue'
import CampaignDetail from '@/views/CampaignDetail.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  
  // 배송형 페이지 및 상세 페이지 (순서 중요!)
  {
    path: '/delivery/detail/:id',  // 정확한 경로 먼저
    name: 'delivery-detail',
    component: CampaignDetailView,
    props: true
  },
  {
    path: '/delivery/:category',   // 그 다음 동적 파라미터 경로
    name: 'delivery-category',
    component: DeliveryView,
    props: true
  },
  {
    path: '/delivery',             // 마지막으로 기본 경로
    name: 'delivery',
    component: DeliveryView
  },
  
  // 방문형 페이지 및 상세 페이지 (순서 중요!)
  {
    path: '/visit/detail/:id',     // 정확한 경로 먼저
    name: 'visit-detail',
    component: CampaignDetailView,
    props: true
  },
  {
    path: '/visit/:category',      // 그 다음 동적 파라미터 경로
    name: 'visit-category',
    component: VisitView,
    props: true
  },
  {
    path: '/visit',                // 마지막으로 기본 경로
    name: 'visit',
    component: VisitView
  },
  
  // 구매형 페이지 및 상세 페이지 (순서 중요!)
  {
    path: '/purchase/detail/:id',  // 정확한 경로 먼저
    name: 'purchase-detail',
    component: CampaignDetailView,
    props: true
  },
  {
    path: '/purchase/:category',   // 그 다음 동적 파라미터 경로
    name: 'purchase-category',
    component: PurchaseView,
    props: true
  },
  {
    path: '/purchase',             // 마지막으로 기본 경로
    name: 'purchase',
    component: PurchaseView
  },
  
  // 기자단 페이지 및 상세 페이지 (순서 중요!)
  {
    path: '/reporter/detail/:id',  // 정확한 경로 먼저
    name: 'reporter-detail',
    component: CampaignDetailView,
    props: true
  },
  {
    path: '/reporter/:category',   // 그 다음 동적 파라미터 경로
    name: 'reporter-category',
    component: ReporterView,
    props: true
  },
  {
    path: '/reporter',             // 마지막으로 기본 경로
    name: 'reporter',
    component: ReporterView
  },
  
  // 기타 유틸리티 라우트
  {
    path: '/today',
    name: 'today',
    component: TodayView
  },
  {
    path: '/event',
    name: 'event',
    component: EventView
  },
  {
    path: '/guide',
    name: 'guide',
    component: GuideView
  },
  {
    path: '/notices',
    name: 'notices',
    component: NoticeView
  },
  {
    path: '/support',
    name: 'support',
    component: CSView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/select-type',
    name: 'select-type',
    component: SelectType
  },
  {
    path: '/reviewer-signup', // 리뷰어 가입 페이지 경로
    name: 'reviewerSignup',
    component: ReviewerSignup
  },
  {
    path: '/reviewer-sign-complete', // 리뷰어 가입 페이지 경로
    name: 'reviewersigncomplete',
    component: ReviewerSigncomplete
  },
  {
    path: '/advertiser-signup',
    name: '/advertiser-signup',
    component: AdvertiserSignup
  },
  {
    path: '/advertiser-sign-complete',
    name: '/advertiser-sign-complete',
    component: AdvertiserSigncomplete
  },
  //리뷰어 마이페이지지
  {
    path: '/reviewer-mypage',
    name: '/reviewer-mypage',
    component: ReviewerProfile
  },
  {
    path: '/reviewer-attendance',
    name: '/reviewer-attendance',
    component: ReviewerAttendance
  },
  {
    path: '/reviewer-point',
    name: '/reviewer-point',
    component: ReviewerPoint
  },
  {
    path: '/reviewer-penalty',
    name: '/reviewer-penalty',
    component: ReviewerPenalty
  },
  {
    path: '/reviewer-edit',
    name: '/reviewer-edit',
    component: ReviewerEdit
  },
  {
    path: '/reviewer-apply',
    name: '/reviewer-apply',
    component: ReviewerApply
  },
  {
    path: '/reviewer-dibs',
    name: '/reviewer-dibs',
    component: ReviewerDibs
  },
  //광고주 페이지
  {
    path: '/ad-dashboard',
    name: '/ad-dashboard',
    component: AdDashboard
  },
  {
    path: '/ad-campaignregister',
    name: '/ad-campaignregister',
    component: CampaignRegister
  },
  //약관 내용 등
  {
    path: '/terms/of-service',
    name: '/terms/of-service',
    component: TermsOfService
  },
  {
    path: '/terms/privacy-policy',
    name: '/terms/privacy-policy',
    component: TermsOfPrivacypolicy
  },
  {
    path: '/ss',
    name: '/ss',
    component: CampaignDetail
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    // 페이지 전환 시 항상 맨 위로 스크롤
    return { top: 0 }
  }
})

export default router
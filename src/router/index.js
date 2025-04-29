import { createRouter, createWebHistory } from 'vue-router'

// 메인 페이지
import HomeView from '@/views/home/HomeView.vue'

// 메인 카테고리 페이지
import DeliveryView from '@/views/category/DeliveryView.vue'
import VisitView from '@/views/category/VisitView.vue'
import PurchaseView from '@/views/category/PurchaseView.vue'
import ReporterView from '@/views/category/ReporterView.vue'
import NoticeView from '@/views/utilitycategory/NoticeView.vue'

// 캠페인 상세 페이지
import CampaignDetailView from '@/views/CampaignDetailView.vue'

// 기타 유틸리티 페이지
import TodayView from '@/views/utilitycategory/TodayView.vue'
import EventView from '@/views/utilitycategory/EventView.vue'
import GuideView from '@/views/utilitycategory/GuideView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import SelectType from '@/views/auth/SelectType.vue'
import ReviewerSignup from '@/views/auth/ReviewerSignup.vue'
import ReviewerSigncomplete from '@/views/auth/ReviewerSigncomplete.vue'
import AdvertiserSignup from '@/views/auth/AdvertiserSignup.vue'
import AdvertiserSigncomplete from '@/views/auth/AdvertiserSigncomplete.vue'
import CSView from '@/views/utilitycategory/CSView.vue'
import ReviewerProfile from '@/views/mypage/ReviewerProfile.vue'
import ReviewerAttendance from '@/views/mypage/ReviewerAttendance.vue'
import ReviewerPoint from '@/views/mypage/ReviewerPoint.vue'
import ReviewerPenalty from '@/views/mypage/ReviewerPenalty.vue'
import ReviewerEdit from '@/views/mypage/ReviewerEdit.vue'
import ReviewerApply from '@/views/mypage/ReviewerApply.vue'
import ReviewerDibs from '@/views/mypage/ReviewerDibs.vue'
import CampaignRegister from '@/views/campaignregister/CampaignRegister.vue'
import TermsOfService from '@/views/terms/TermsOfService.vue'
import TermsOfPrivacypolicy from '@/views/terms/TermsOfPrivacypolicy.vue'
import CampaignDetail from '@/views/CampaignDetail.vue'

// 파트너센터 레이아웃
import PartnerLayout from '@/layouts/PartnerLayout.vue'
import DashboardView from '@/views/partner/DashboardView.vue'
import AllcampaignsView from '@/views/partner/AllcampaignsView.vue'
import WatingApprovalView from '@/views/partner/WatingApprovalView.vue'
import ActiveCampaignsView from '@/views/partner/ActiveCampaignsView.vue'
import CompletedCampaignsView from '@/views/partner/CompletedCampaignsView.vue'
import RegisteredReviewsView from '@/views/partner/RegisteredReviewsView.vue'
import NoticeListView from '@/views/partner/NoticeListView.vue'
import InquiryView from '@/views/partner/InquiryView.vue'
import FaqView from '@/views/partner/FaqView.vue'
import EditProfileView from '@/views/partner/EditProfileView.vue'

// 임시 빈 컴포넌트들 - 나중에 실제 구현할 때 대체
const EmptyComponent = { 
  template: '<div class="empty-page" style="padding: 30px;"><h2>페이지 준비 중</h2><p>이 페이지는 아직 개발 중입니다.</p></div>' 
}

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
  },
  
  // 파트너센터 라우트 (새로 추가)
  {
    path: '/partner',
    component: PartnerLayout,
    children: [
      {
        path: '',
        redirect: '/partner/dashboard'
      },
      {
        path: 'dashboard',
        name: 'partner-dashboard',
        component: DashboardView // 실제 컴포넌트 생성 전까지 임시 컴포넌트 사용
      },
      {
        path: 'campaigns/all',
        name: 'campaigns-all',
        component: AllcampaignsView
      },
      {
        path: 'campaigns/pending',
        name: 'campaigns-pending',
        component: WatingApprovalView
      },
      {
        path: 'campaigns/active',
        name: 'campaigns-active',
        component: ActiveCampaignsView
      },
      {
        path: 'campaigns/completed',
        name: 'campaigns-completed',
        component: CompletedCampaignsView
      },
      {
        path: 'reviews',
        name: 'partner-reviews',
        component: RegisteredReviewsView
      },
      {
        path: 'notices',
        name: 'partner-notices',
        component: NoticeListView
      },
      {
        path: 'inquiry',
        name: 'partner-inquiry',
        component: InquiryView
      },
      {
        path: 'faq',
        name: 'partner-faq',
        component: FaqView
      },
      {
        path: 'profile',
        name: 'partner-profile',
        component: EditProfileView
      },
      {
        path: 'proxy-campaign',
        name: 'proxy-campaign',
        component: EmptyComponent
      },
      {
        path: 'blog-agency',
        name: 'blog-agency',
        component: EmptyComponent
      },
      {
        path: 'blog-branding',
        name: 'blog-branding',
        component: EmptyComponent
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    // 페이지 전환 시 항상 맨 위로 스크롤
    return { top: 0 }
  },
})

export default router
<template>
    <footer class="site-footer">
      <!-- 상단 메뉴 영역 -->
      <div class="footer-menu">
        <nav class="footer-nav">
          <router-link to="/guide" a href="#" class="footer-link">서비스 이용가이드</router-link>
          <router-link to="/terms/of-service" a href="#" class="footer-link">이용약관</router-link>
          <router-link to="/terms/privacy-policy" a href="#" class="footer-link">개인정보처리방침</router-link>
          <a href="#" class="footer-link ad-inquiry">
            광고문의
            <span class="ad-badge">FREE</span>
          </a>
        </nav>
      </div>
      
      <!-- 주요 정보 영역 -->
      <div class="footer-info">
        <div class="company-info">
          <div class="company-logo">
            <img src="@/assets/logo.png" alt="REVU 로고" class="logo-image">
          </div>
          <div class="info-blocks">
            <div class="info-row">
              <span class="info-label">이에스랩스 코퍼레이션</span>
              <span class="info-text">대표이사 : 심응선</span>
              <span class="info-text">개인정보 보호 책임자 : 심응선</span>
            </div>
            <div class="info-row">
              <span class="info-text">사업자등록번호 : 227-31-01670</span>
              <span class="info-text">통신판매업신고번호 제 2024-충북청주-2550</span>
            </div>
            <div class="info-row">
              <span class="info-text">메일 : eslabsofficial@gmail.com</span>
              <span class="info-text">전화 : 010-4004-0974</span>
            </div>
          </div>
        </div>
        
        <!-- 연락처 정보 -->
        <div class="contact-right">
          <div class="contact-number">010-4004-0974</div>
          <div class="contact-hours">
            <p>월-금 9:00-18:00</p>
            <p>주말, 공휴일 휴무</p>
          </div>
        </div>
      </div>
      
      <!-- 하단 저작권 영역 -->
      <div class="copyright">
        <p>© ESLABS Corporation. All Rights Reserved.</p>
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    name: 'SiteFooter',
    data() {
      return {
        currentYear: new Date().getFullYear()
      }
    }
  }
  </script>
  
  <style scoped>
  /* 프리텐다드 폰트 적용 */
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
  
  /* 브랜드 컬러 변수 설정 */
  :root {
    --color-light-gray: #F5F5F5;
    --color-teal-light: #48CFCB;
    --color-teal-dark: #229799;
    --color-dark-gray: #424242;
  }
  
  .site-footer {
    font-family: 'Pretendard', sans-serif;
    border-top: 1px solid #e8e8e8;
    background-color: #fff;
    color: var(--color-dark-gray);
    width: 100%;
    padding: 0;
  }
  
  .footer-menu {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1.2rem 2rem;
    border-bottom: 1px solid #eee;
  }
  
  .footer-nav {
    display: flex;
    gap: 2.5rem;
  }
  
  .footer-link {
    color: var(--color-dark-gray);
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    position: relative;
    transition: color 0.2s ease;
  }
  
  .footer-link:hover {
    color: var(--color-teal-dark);
  }
  
  .footer-link:hover::after {
    width: 100%;
  }
  
  .footer-link::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: var(--color-teal-dark);
    transition: width 0.3s ease;
  }
  
  .footer-link.highlight {
    color: var(--color-teal-dark);
    font-weight: 600;
  }
  
  .footer-link.highlight::after {
    width: 100%;
  }
  
  /* 광고문의 스타일 */
  .footer-link.ad-inquiry {
    position: relative;
    color: var(--color-teal-dark);
    font-weight: 500;
    padding-right: 2.5rem;
  }
  
  .footer-link.ad-inquiry:hover {
    color: var(--color-teal-dark);
  }
  
  .footer-link.ad-inquiry::after {
    display: none;
  }
  
  .ad-badge {
    position: absolute;
    right: 0;
    top: -8px;
    background-color: var(--color-teal-dark);
    color: #fff;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 1px 4px;
    border-radius: 4px;
    letter-spacing: 0.5px;
  }
  
  .footer-info {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2.5rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  
  .company-info {
    display: flex;
    gap: 2rem;
    align-items: flex-start;
  }
  
  .company-logo {
    flex-shrink: 0;
  }
  
  .logo-image {
    width: 120px;
    height: auto;
  }
  
  .info-blocks {
    display: flex;
    flex-direction: column;
  }
  
  .info-row {
    margin: 0.5rem 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
  }
  
  .info-label {
    font-weight: 600;
    color: #333;
    font-size: 0.9rem;
  }
  
  .info-text {
    font-size: 0.85rem;
    color: #666;
  }
  
  .contact-right {
    text-align: right;
  }
  
  .contact-number {
    font-size: 2.2rem;
    font-weight: 700;
    color: var(--color-teal-dark);
    margin-bottom: 0.8rem;
    letter-spacing: -0.5px;
  }
  
  .contact-hours {
    color: #666;
  }
  
  .contact-hours p {
    margin: 0.2rem 0;
    font-size: 0.85rem;
    line-height: 1.4;
    text-align: right;
  }
  
  .copyright {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1.5rem 2rem;
    font-size: 0.8rem;
    color: #888;
    border-top: 1px solid #eee;
  }
  
  /* 반응형 스타일 */
  @media (max-width: 992px) {
    .company-info {
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .company-logo {
      margin: 0 auto;
      text-align: center;
    }
    
    .footer-info {
      flex-direction: column;
      gap: 2.5rem;
    }
    
    .contact-right {
      width: 100%;
      text-align: center;
    }
    
    .contact-hours p {
      text-align: center;
    }
  }
  
  @media (max-width: 768px) {
    .footer-nav {
      flex-wrap: wrap;
      row-gap: 1rem;
      column-gap: 1.5rem;
      justify-content: center;
    }
    
    .copyright {
      text-align: center;
    }
    
    .info-blocks {
      width: 100%;
    }
    
    .info-row {
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 0.4rem;
    }
  }
  </style>